"""
D'Tee & Gee Kitchen - Security Utilities
=========================================
This module contains security decorators and utilities to protect against:
- IDOR (Insecure Direct Object Reference)
- Broken Access Control
- Malicious File Uploads
- Account Enumeration
- Mass Assignment
"""

from functools import wraps
from flask import jsonify, request, session, abort
import os
import uuid
import re
from werkzeug.utils import secure_filename


# ============================================
# AUTHENTICATION & AUTHORIZATION DECORATORS
# ============================================

def login_required(f):
    """
    Decorator to require user authentication.
    Returns 401 if user is not logged in.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function


def admin_required(f):
    """
    Decorator to require admin privileges.
    Must be used AFTER @login_required.
    Returns 403 if user is not an admin.

    Usage:
        @app.route('/admin/dashboard')
        @login_required
        @admin_required
        def admin_dashboard():
            ...
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        from src.models.user import User

        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Authentication required'}), 401

        user = User.query.get(user_id)
        if not user or not user.is_admin:
            return jsonify({'error': 'Admin access required'}), 403

        return f(*args, **kwargs)
    return decorated_function


def get_current_user():
    """
    Get the current logged-in user object.
    Returns None if not logged in.
    """
    from src.models.user import User

    user_id = session.get('user_id')
    if not user_id:
        return None
    return User.query.get(user_id)


def get_current_user_id():
    """Get current user ID from session"""
    return session.get('user_id')


# ============================================
# IDOR PROTECTION UTILITIES
# ============================================

def check_resource_ownership(resource, user_id_field='user_id', allow_admin=True, allow_guest=False):
    """
    Check if the current user owns a resource.

    Args:
        resource: The database model instance to check
        user_id_field: The field name that contains the owner's user ID
        allow_admin: If True, admins can access any resource
        allow_guest: If True, allow access to resources with no owner (guest orders)

    Returns:
        tuple: (is_authorized, error_response)
        - If authorized: (True, None)
        - If not authorized: (False, (error_dict, status_code))

    Usage:
        order = Order.query.get_or_404(order_id)
        authorized, error = check_resource_ownership(order)
        if not authorized:
            return error
    """
    from src.models.user import User

    current_user_id = session.get('user_id')
    resource_owner_id = getattr(resource, user_id_field, None)

    # Check if resource has no owner (guest order) and guest access is allowed
    if resource_owner_id is None and allow_guest:
        return True, None

    # If user is not logged in
    if not current_user_id:
        return False, (jsonify({'error': 'Authentication required'}), 401)

    # Check if user owns the resource
    if resource_owner_id == current_user_id:
        return True, None

    # Check if user is admin (and admin access is allowed)
    if allow_admin:
        user = User.query.get(current_user_id)
        if user and user.is_admin:
            return True, None

    # Not authorized
    return False, (jsonify({'error': 'Access denied'}), 403)


def ownership_required(model_class, id_param='id', user_id_field='user_id', allow_admin=True):
    """
    Decorator to automatically check resource ownership.

    Args:
        model_class: The SQLAlchemy model class
        id_param: The URL parameter name containing the resource ID
        user_id_field: The model field containing the owner's user ID
        allow_admin: If True, admins can access any resource

    Usage:
        @app.route('/orders/<int:order_id>')
        @login_required
        @ownership_required(Order, id_param='order_id')
        def get_order(order_id):
            ...
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            resource_id = kwargs.get(id_param)
            if resource_id is None:
                return jsonify({'error': 'Resource ID required'}), 400

            resource = model_class.query.get(resource_id)
            if not resource:
                return jsonify({'error': 'Resource not found'}), 404

            authorized, error = check_resource_ownership(
                resource,
                user_id_field=user_id_field,
                allow_admin=allow_admin
            )

            if not authorized:
                return error

            return f(*args, **kwargs)
        return decorated_function
    return decorator


# ============================================
# SECURE FILE UPLOAD UTILITIES
# ============================================

# Allowed file extensions for different types
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'gif'}
ALLOWED_DOCUMENT_EXTENSIONS = {'pdf', 'doc', 'docx', 'txt'}

# Maximum file sizes (in bytes)
MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5MB
MAX_DOCUMENT_SIZE = 10 * 1024 * 1024  # 10MB

# Dangerous file extensions that should NEVER be allowed
DANGEROUS_EXTENSIONS = {
    'php', 'phtml', 'php3', 'php4', 'php5', 'phps',
    'py', 'pyc', 'pyo',
    'js', 'jsx', 'ts', 'tsx',
    'sh', 'bash', 'zsh',
    'exe', 'dll', 'so', 'bat', 'cmd', 'com',
    'asp', 'aspx', 'jsp', 'jspx',
    'cgi', 'pl', 'rb',
    'htaccess', 'htpasswd',
    'config', 'ini', 'env'
}


def allowed_file(filename, allowed_extensions=None):
    """
    Check if a file has an allowed extension.

    Args:
        filename: The original filename
        allowed_extensions: Set of allowed extensions (default: images only)

    Returns:
        bool: True if file extension is allowed
    """
    if allowed_extensions is None:
        allowed_extensions = ALLOWED_IMAGE_EXTENSIONS

    if '.' not in filename:
        return False

    ext = filename.rsplit('.', 1)[1].lower()

    # Always reject dangerous extensions
    if ext in DANGEROUS_EXTENSIONS:
        return False

    return ext in allowed_extensions


def generate_secure_filename(original_filename):
    """
    Generate a secure random filename while preserving the extension.

    Args:
        original_filename: The original filename from the upload

    Returns:
        str: A secure random filename with original extension
    """
    if '.' not in original_filename:
        return f"{uuid.uuid4().hex}"

    ext = original_filename.rsplit('.', 1)[1].lower()
    return f"{uuid.uuid4().hex}.{ext}"


def validate_file_upload(file, allowed_extensions=None, max_size=None):
    """
    Comprehensive file upload validation.

    Args:
        file: The uploaded file object from request.files
        allowed_extensions: Set of allowed extensions
        max_size: Maximum file size in bytes

    Returns:
        tuple: (is_valid, error_message)
    """
    if allowed_extensions is None:
        allowed_extensions = ALLOWED_IMAGE_EXTENSIONS

    if max_size is None:
        max_size = MAX_IMAGE_SIZE

    # Check if file exists
    if not file or file.filename == '':
        return False, 'No file selected'

    # Check extension
    if not allowed_file(file.filename, allowed_extensions):
        return False, f'File type not allowed. Allowed types: {", ".join(allowed_extensions)}'

    # Check file size (seek to end, get position, seek back)
    file.seek(0, os.SEEK_END)
    file_size = file.tell()
    file.seek(0)

    if file_size > max_size:
        max_mb = max_size / (1024 * 1024)
        return False, f'File too large. Maximum size: {max_mb}MB'

    # Check for null bytes (common attack vector)
    filename = file.filename
    if '\x00' in filename:
        return False, 'Invalid filename'

    return True, None


def save_uploaded_file(file, upload_folder, allowed_extensions=None, max_size=None):
    """
    Securely save an uploaded file.

    Args:
        file: The uploaded file object
        upload_folder: Directory to save the file
        allowed_extensions: Set of allowed extensions
        max_size: Maximum file size in bytes

    Returns:
        tuple: (success, result)
        - If success: (True, {'filename': 'secure_name.ext', 'path': '/full/path'})
        - If error: (False, {'error': 'error message'})
    """
    # Validate the file
    is_valid, error = validate_file_upload(file, allowed_extensions, max_size)
    if not is_valid:
        return False, {'error': error}

    # Generate secure filename
    secure_name = generate_secure_filename(file.filename)

    # Ensure upload folder exists
    os.makedirs(upload_folder, exist_ok=True)

    # Build full path and ensure it's within upload folder (prevent path traversal)
    full_path = os.path.abspath(os.path.join(upload_folder, secure_name))
    if not full_path.startswith(os.path.abspath(upload_folder)):
        return False, {'error': 'Invalid file path'}

    # Save the file
    try:
        file.save(full_path)
        return True, {
            'filename': secure_name,
            'path': full_path,
            'original_name': secure_filename(file.filename)
        }
    except Exception as e:
        return False, {'error': f'Failed to save file: {str(e)}'}


# ============================================
# INPUT VALIDATION & SANITIZATION
# ============================================

def sanitize_input(value, max_length=None, strip_html=True):
    """
    Sanitize user input to prevent XSS and injection attacks.

    Args:
        value: The input value to sanitize
        max_length: Maximum allowed length
        strip_html: If True, remove HTML tags

    Returns:
        str: Sanitized string
    """
    if value is None:
        return None

    if not isinstance(value, str):
        value = str(value)

    # Strip whitespace
    value = value.strip()

    # Remove HTML tags if requested
    if strip_html:
        value = re.sub(r'<[^>]+>', '', value)

    # Limit length
    if max_length and len(value) > max_length:
        value = value[:max_length]

    return value


def validate_email(email):
    """
    Validate email format.

    Returns:
        bool: True if valid email format
    """
    if not email:
        return False

    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(email_regex, email))


def validate_phone(phone):
    """
    Validate phone number format (Nigerian format).

    Returns:
        bool: True if valid phone format
    """
    if not phone:
        return False

    # Remove spaces, dashes, and parentheses
    phone = re.sub(r'[\s\-\(\)]', '', phone)

    # Nigerian phone: +234, 234, or 0 followed by 10 digits
    phone_regex = r'^(\+?234|0)?[789]\d{9}$'
    return bool(re.match(phone_regex, phone))


def filter_allowed_fields(data, allowed_fields):
    """
    Filter input data to only include allowed fields.
    Prevents mass assignment attacks.

    Args:
        data: Dictionary of input data
        allowed_fields: Set or list of allowed field names

    Returns:
        dict: Filtered data with only allowed fields

    Usage:
        allowed = {'username', 'email', 'first_name', 'last_name'}
        safe_data = filter_allowed_fields(request.json, allowed)
    """
    if not data:
        return {}

    return {k: v for k, v in data.items() if k in allowed_fields}


# ============================================
# PASSWORD VALIDATION
# ============================================

def validate_password_strength(password):
    """
    Validate password meets security requirements.

    Requirements:
    - Minimum 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one digit
    - At least one special character

    Returns:
        tuple: (is_valid, error_message or None)
    """
    if not password:
        return False, 'Password is required'

    if len(password) < 8:
        return False, 'Password must be at least 8 characters long'

    if not re.search(r'[A-Z]', password):
        return False, 'Password must contain at least one uppercase letter'

    if not re.search(r'[a-z]', password):
        return False, 'Password must contain at least one lowercase letter'

    if not re.search(r'\d', password):
        return False, 'Password must contain at least one digit'

    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False, 'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)'

    # Check for common weak passwords
    weak_passwords = {
        'password', 'password1', 'password123', '12345678', 'qwerty123',
        'letmein', 'welcome', 'admin123', 'login123'
    }
    if password.lower() in weak_passwords:
        return False, 'This password is too common. Please choose a stronger password.'

    return True, None


# ============================================
# ACCOUNT ENUMERATION PROTECTION
# ============================================

# Generic error messages to prevent account enumeration
AUTH_ERROR_MESSAGES = {
    'invalid_credentials': 'Invalid email/username or password',
    'account_locked': 'Account temporarily locked. Please try again later.',
    'generic_error': 'Unable to process request. Please try again.'
}


def get_auth_error(error_type='invalid_credentials'):
    """
    Get a generic authentication error message.
    Prevents account enumeration by not revealing specific details.
    """
    return AUTH_ERROR_MESSAGES.get(error_type, AUTH_ERROR_MESSAGES['generic_error'])
