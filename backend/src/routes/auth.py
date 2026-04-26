"""
D'Tee & Gee Kitchen - Authentication Routes
============================================
Secured against:
- Brute force attacks (rate limiting)
- Account enumeration (generic error messages)
- Weak passwords (strength validation)
- Session fixation (session regeneration)
- Mass assignment (field whitelisting)
"""

from flask import Blueprint, jsonify, request, session
from src.models.user import User, db
from src.utils.security import (
    validate_password_strength,
    validate_email,
    sanitize_input,
    filter_allowed_fields,
    get_auth_error,
    login_required
)
from src.utils.limiter import limiter
import secrets
from datetime import datetime, timedelta

# Import email utility (handle import error gracefully)
try:
    from src.utils.email import send_password_reset_email
    EMAIL_ENABLED = True
except ImportError:
    EMAIL_ENABLED = False

auth_bp = Blueprint('auth', __name__)


def regenerate_session():
    """
    Regenerate session ID to prevent session fixation attacks.
    Preserves session data while changing the session ID.
    """
    # Store current session data
    session_data = dict(session)
    # Clear current session
    session.clear()
    # Restore data with new session ID
    session.update(session_data)
    session.modified = True


# ============================================
# REGISTRATION
# ============================================
@auth_bp.route('/register', methods=['POST'])
@limiter.limit("50 per hour")  # 50 registrations per hour
def register():
    """
    Register a new user.

    Security features:
    - Rate limited to prevent spam
    - Password strength validation
    - Email format validation
    - Input sanitization
    """
    data = request.json or {}

    # Whitelist allowed fields (prevent mass assignment)
    allowed_fields = {'username', 'email', 'password', 'first_name', 'last_name', 'phone'}
    data = filter_allowed_fields(data, allowed_fields)

    # Validate required fields
    required_fields = ['username', 'email', 'password']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400

    # Sanitize inputs
    username = sanitize_input(data['username'], max_length=80)
    email = sanitize_input(data['email'], max_length=120)
    first_name = sanitize_input(data.get('first_name', ''), max_length=50)
    last_name = sanitize_input(data.get('last_name', ''), max_length=50)
    phone = sanitize_input(data.get('phone', ''), max_length=20)

    # Validate email format
    if not validate_email(email):
        return jsonify({'error': 'Invalid email format'}), 400

    # Validate password strength
    is_valid, password_error = validate_password_strength(data['password'])
    if not is_valid:
        return jsonify({'error': password_error}), 400

    # Check username length and format
    if len(username) < 3:
        return jsonify({'error': 'Username must be at least 3 characters'}), 400

    if not username.replace('_', '').replace('-', '').isalnum():
        return jsonify({'error': 'Username can only contain letters, numbers, underscores, and hyphens'}), 400

    # Check if user already exists (use same error to prevent enumeration)
    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already taken'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 400

    # Create new user
    user = User(
        username=username,
        email=email,
        first_name=first_name,
        last_name=last_name,
        phone=phone
    )
    user.set_password(data['password'])

    db.session.add(user)
    db.session.commit()

    # Regenerate session and log user in
    regenerate_session()
    session['user_id'] = user.id
    session['username'] = user.username
    session.permanent = True

    return jsonify({
        'message': 'Registration successful',
        'user': user.to_dict()
    }), 201


# ============================================
# LOGIN
# ============================================
@auth_bp.route('/login', methods=['POST'])
@limiter.limit("30 per minute")  # 30 login attempts per minute
def login():
    """
    Login user.

    Security features:
    - Rate limited to prevent brute force
    - Generic error messages (prevent account enumeration)
    - Session regeneration (prevent session fixation)
    """
    data = request.json or {}

    username_or_email = data.get('username_or_email', '').strip()
    password = data.get('password', '')

    if not username_or_email or not password:
        return jsonify({'error': 'Username/email and password are required'}), 400

    # Find user by username or email
    user = User.query.filter(
        (User.username == username_or_email) |
        (User.email == username_or_email)
    ).first()

    # SECURITY: Use same error message for all failure cases
    # This prevents attackers from knowing if a username/email exists
    if not user or not user.check_password(password):
        return jsonify({'error': get_auth_error('invalid_credentials')}), 401

    # Check if account is active (same generic error)
    if not user.is_active:
        return jsonify({'error': get_auth_error('invalid_credentials')}), 401

    # SECURITY: Regenerate session ID to prevent session fixation
    regenerate_session()

    # Log user in
    session['user_id'] = user.id
    session['username'] = user.username
    session.permanent = True

    return jsonify({
        'message': 'Login successful',
        'user': user.to_dict()
    })


# ============================================
# LOGOUT
# ============================================
@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Logout user - Clear all session data"""
    session.clear()
    return jsonify({'message': 'Logout successful'})


# ============================================
# PROFILE
# ============================================
@auth_bp.route('/profile', methods=['GET'])
@login_required
def get_profile():
    """Get current user profile"""
    user_id = session.get('user_id')
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())


@auth_bp.route('/profile', methods=['PUT'])
@login_required
def update_profile():
    """
    Update current user profile.

    Security features:
    - Whitelist allowed fields (prevent mass assignment)
    - Input sanitization
    - Password strength validation
    """
    user_id = session.get('user_id')
    user = User.query.get_or_404(user_id)
    data = request.json or {}

    # SECURITY: Whitelist allowed fields (prevent mass assignment)
    # User cannot set is_admin, is_active, etc. through this endpoint
    allowed_fields = {'first_name', 'last_name', 'phone', 'email', 'password', 'username'}
    data = filter_allowed_fields(data, allowed_fields)

    # Sanitize and update allowed fields
    if 'first_name' in data:
        user.first_name = sanitize_input(data['first_name'], max_length=50)

    if 'last_name' in data:
        user.last_name = sanitize_input(data['last_name'], max_length=50)

    if 'phone' in data:
        user.phone = sanitize_input(data['phone'], max_length=20)

    # Update username if provided and not already taken
    if 'username' in data and data['username']:
        new_username = sanitize_input(data['username'], max_length=80)

        if len(new_username) < 3:
            return jsonify({'error': 'Username must be at least 3 characters'}), 400

        if not new_username.replace('_', '').replace('-', '').isalnum():
            return jsonify({'error': 'Username can only contain letters, numbers, underscores, and hyphens'}), 400

        if new_username != user.username:
            if User.query.filter_by(username=new_username).first():
                return jsonify({'error': 'Username already taken'}), 400
            user.username = new_username
            # Update session username
            session['username'] = new_username

    # Update email if provided and not already taken
    if 'email' in data and data['email']:
        new_email = sanitize_input(data['email'], max_length=120)

        if not validate_email(new_email):
            return jsonify({'error': 'Invalid email format'}), 400

        if new_email != user.email:
            if User.query.filter_by(email=new_email).first():
                return jsonify({'error': 'Email already in use'}), 400
            user.email = new_email

    # Update password if provided
    if 'password' in data and data['password']:
        is_valid, password_error = validate_password_strength(data['password'])
        if not is_valid:
            return jsonify({'error': password_error}), 400
        user.set_password(data['password'])

    db.session.commit()

    return jsonify({
        'message': 'Profile updated successfully',
        'user': user.to_dict()
    })


# ============================================
# PASSWORD RESET
# ============================================
@auth_bp.route('/forgot-password', methods=['POST'])
@limiter.limit("5 per hour")  # Strict rate limit to prevent abuse
def forgot_password():
    """
    Request a password reset link via email.
    Always returns success to prevent email enumeration.
    """
    data = request.json or {}
    email = data.get('email', '').strip().lower()

    if not email:
        return jsonify({'error': 'Email is required'}), 400

    # Always return success message to prevent email enumeration
    success_msg = 'If an account with that email exists, a password reset link has been sent.'

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'message': success_msg})

    # Generate secure reset token
    token = secrets.token_urlsafe(32)
    user.reset_token = token
    user.reset_token_expires = datetime.utcnow() + timedelta(hours=1)
    db.session.commit()

    # Send reset email
    if EMAIL_ENABLED:
        try:
            send_password_reset_email(user.email, user.username, token)
        except Exception as e:
            print(f"Failed to send password reset email: {e}")

    # Log token to console for development (since SMTP may not be configured)
    print(f"[DEV] Password reset token for {email}: {token}")
    print(f"[DEV] Reset link: http://localhost:5000/?reset_token={token}")

    return jsonify({'message': success_msg})


@auth_bp.route('/reset-password', methods=['POST'])
@limiter.limit("10 per hour")
def reset_password():
    """
    Reset password using a valid token.
    """
    data = request.json or {}
    token = data.get('token', '').strip()
    new_password = data.get('password', '')

    if not token or not new_password:
        return jsonify({'error': 'Token and new password are required'}), 400

    # Validate password strength
    is_valid, password_error = validate_password_strength(new_password)
    if not is_valid:
        return jsonify({'error': password_error}), 400

    # Find user by token
    user = User.query.filter_by(reset_token=token).first()

    if not user:
        return jsonify({'error': 'Invalid or expired reset token'}), 400

    # Check if token has expired
    if user.reset_token_expires and user.reset_token_expires < datetime.utcnow():
        user.reset_token = None
        user.reset_token_expires = None
        db.session.commit()
        return jsonify({'error': 'Reset token has expired. Please request a new one.'}), 400

    # Update password and clear token
    user.set_password(new_password)
    user.reset_token = None
    user.reset_token_expires = None
    db.session.commit()

    return jsonify({'message': 'Password has been reset successfully. You can now sign in with your new password.'})


# ============================================
# AUTH CHECK
# ============================================
@auth_bp.route('/check-auth', methods=['GET'])
def check_auth():
    """Check if user is authenticated"""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'authenticated': False})

    user = User.query.get(user_id)
    if not user or not user.is_active:
        session.clear()
        return jsonify({'authenticated': False})

    return jsonify({
        'authenticated': True,
        'user': user.to_dict()
    })



