from flask import Blueprint, jsonify, request, session
import requests
import os
import hmac
import hashlib
import base64
from functools import wraps
import time
from src.models.user import Order, db

payment_bp = Blueprint('payment', __name__)

# Monnify configuration - MUST be set in .env file
MONNIFY_API_KEY = os.environ.get('MONNIFY_API_KEY', '')
MONNIFY_SECRET_KEY = os.environ.get('MONNIFY_SECRET_KEY', '')
MONNIFY_CONTRACT_CODE = os.environ.get('MONNIFY_CONTRACT_CODE', '')
MONNIFY_BASE_URL = os.environ.get('MONNIFY_BASE_URL', 'https://sandbox.monnify.com')  # Use https://api.monnify.com for production

# ============================================
# SECURITY: Rate Limiting for Payment Routes
# ============================================
_payment_rate_limit_store = {}


def payment_rate_limit(max_requests, window_seconds):
    """Rate limiting decorator specifically for payment routes"""
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            # Get client identifier (IP + user_id if available)
            client_ip = request.remote_addr
            user_id = session.get('user_id', 'guest')
            key = f"{client_ip}:{user_id}"

            route_key = f"{f.__name__}:{key}"
            current_time = time.time()

            # Clean old entries
            if route_key in _payment_rate_limit_store:
                _payment_rate_limit_store[route_key] = [
                    t for t in _payment_rate_limit_store[route_key]
                    if current_time - t < window_seconds
                ]
            else:
                _payment_rate_limit_store[route_key] = []

            # Check rate limit
            if len(_payment_rate_limit_store[route_key]) >= max_requests:
                return jsonify({
                    'error': 'Too many payment attempts. Please try again later.',
                    'retry_after': window_seconds
                }), 429

            # Record this request
            _payment_rate_limit_store[route_key].append(current_time)

            return f(*args, **kwargs)
        return wrapper
    return decorator


def get_current_user_id():
    """Get current user ID from session"""
    return session.get('user_id')


# ============================================
# Monnify Authentication
# ============================================
_monnify_token_cache = {'token': None, 'expires_at': 0}


def get_monnify_access_token():
    """
    Get Monnify access token for API calls.
    Tokens are cached until expiry.
    """
    current_time = time.time()

    # Return cached token if still valid (with 60s buffer)
    if _monnify_token_cache['token'] and _monnify_token_cache['expires_at'] > current_time + 60:
        return _monnify_token_cache['token']

    # Generate new token
    auth_string = f"{MONNIFY_API_KEY}:{MONNIFY_SECRET_KEY}"
    auth_bytes = base64.b64encode(auth_string.encode('utf-8')).decode('utf-8')

    headers = {
        'Authorization': f'Basic {auth_bytes}',
        'Content-Type': 'application/json'
    }

    try:
        response = requests.post(
            f'{MONNIFY_BASE_URL}/api/v1/auth/login',
            headers=headers,
            timeout=30
        )
        result = response.json()

        if result.get('requestSuccessful'):
            token = result['responseBody']['accessToken']
            # Monnify tokens expire in 1 hour (3600 seconds)
            _monnify_token_cache['token'] = token
            _monnify_token_cache['expires_at'] = current_time + 3500  # 3500s to be safe
            return token
        else:
            print(f"[MONNIFY ERROR] Token generation failed: {result.get('responseMessage')}")
            return None

    except Exception as e:
        print(f"[MONNIFY ERROR] Token generation exception: {str(e)}")
        return None


# ============================================
# SECURITY: Webhook Signature Verification
# ============================================
def verify_monnify_signature(payload, signature):
    """
    Verify that webhook request actually came from Monnify.
    Uses SHA512 hash verification.

    Monnify computes: SHA512(secretKey + "|" + payloadString)

    Returns True if signature is valid, False otherwise.
    """
    if not MONNIFY_SECRET_KEY or not signature:
        return False

    # Monnify signature format: secretKey|payloadString
    if isinstance(payload, bytes):
        payload = payload.decode('utf-8')

    string_to_hash = f"{MONNIFY_SECRET_KEY}|{payload}"
    expected_signature = hashlib.sha512(string_to_hash.encode('utf-8')).hexdigest()

    # Use constant-time comparison to prevent timing attacks
    return hmac.compare_digest(expected_signature.lower(), signature.lower())


@payment_bp.route('/payment/config', methods=['GET'])
def get_payment_config():
    """Get payment configuration for frontend"""
    return jsonify({
        'api_key': MONNIFY_API_KEY,
        'contract_code': MONNIFY_CONTRACT_CODE,
        'currency': 'NGN',
        'is_test_mode': 'sandbox' in MONNIFY_BASE_URL.lower()
    })


@payment_bp.route('/payment/initialize', methods=['POST'])
@payment_rate_limit(max_requests=5, window_seconds=3600)  # 5 payment attempts per hour per IP
def initialize_payment():
    """
    Initialize a Monnify payment transaction.

    SECURITY: Server-side price calculation
    - Amount is NEVER accepted from frontend
    - Price is always calculated from order stored in database
    - This prevents price tampering attacks
    """
    user_id = get_current_user_id()

    data = request.json
    order_id = data.get('order_id')
    email = data.get('email')
    name = data.get('name', 'Customer')
    callback_url = data.get('callback_url', '')

    # Validate required fields (amount is NOT required - we calculate it)
    if not order_id:
        return jsonify({'error': 'Order ID is required'}), 400

    if not email:
        return jsonify({'error': 'Email is required'}), 400

    # Verify order exists
    order = Order.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    # SECURITY: Verify order belongs to current user (if logged in)
    if user_id and order.user_id and order.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403

    # SECURITY: Prevent double-payment
    if order.payment_status == 'paid':
        return jsonify({'error': 'Order has already been paid'}), 400

    # SECURITY: Only allow payment for pending orders
    if order.status not in ['pending', 'confirmed']:
        return jsonify({'error': 'Order cannot be paid at this stage'}), 400

    # ============================================
    # CRITICAL SECURITY: Server-side price calculation
    # Amount comes from DATABASE, not from frontend!
    # ============================================
    amount_in_naira = float(order.total_amount)

    # Minimum amount validation (Monnify minimum is 20 NGN)
    if amount_in_naira < 20:
        return jsonify({'error': 'Minimum order amount is ₦20'}), 400

    # Get Monnify access token
    access_token = get_monnify_access_token()
    if not access_token:
        return jsonify({
            'status': False,
            'error': 'Payment service temporarily unavailable. Please try again.'
        }), 503

    # Initialize transaction with Monnify
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }

    # Generate unique reference to prevent replay attacks
    reference = f'DTG-{order.order_number}'

    payload = {
        'amount': amount_in_naira,
        'customerName': name,
        'customerEmail': email,
        'paymentReference': reference,
        'paymentDescription': f"D'Tee & Gee Kitchen - Order #{order.order_number}",
        'currencyCode': 'NGN',
        'contractCode': MONNIFY_CONTRACT_CODE,
        'redirectUrl': callback_url,
        'paymentMethods': ['CARD', 'ACCOUNT_TRANSFER', 'USSD'],
        'metadata': {
            'order_id': str(order_id),
            'order_number': order.order_number,
            'user_id': str(user_id) if user_id else None
        }
    }

    try:
        response = requests.post(
            f'{MONNIFY_BASE_URL}/api/v1/merchant/transactions/init-transaction',
            json=payload,
            headers=headers,
            timeout=30  # Timeout to prevent hanging
        )
        result = response.json()

        if result.get('requestSuccessful'):
            # Log payment initialization (for audit trail)
            print(f"[PAYMENT] Initialized Monnify payment for Order #{order.order_number}, Amount: ₦{amount_in_naira}")

            return jsonify({
                'status': True,
                'checkout_url': result['responseBody']['checkoutUrl'],
                'transaction_reference': result['responseBody']['transactionReference'],
                'payment_reference': reference,
                'amount': amount_in_naira  # Return calculated amount for frontend display
            })
        else:
            return jsonify({
                'status': False,
                'error': result.get('responseMessage', 'Payment initialization failed')
            }), 400

    except requests.exceptions.Timeout:
        return jsonify({
            'status': False,
            'error': 'Payment gateway timeout. Please try again.'
        }), 504

    except Exception as e:
        # Log error but don't expose details to frontend
        print(f"[PAYMENT ERROR] {str(e)}")
        return jsonify({
            'status': False,
            'error': 'Payment initialization failed. Please try again.'
        }), 500


@payment_bp.route('/payment/verify/<reference>', methods=['GET'])
@payment_rate_limit(max_requests=10, window_seconds=60)  # 10 verifications per minute
def verify_payment(reference):
    """
    Verify a Monnify payment.

    SECURITY: Double verification
    - Verifies with Monnify API
    - Cross-checks amount matches order total
    """
    access_token = get_monnify_access_token()
    if not access_token:
        return jsonify({
            'status': False,
            'error': 'Payment service temporarily unavailable.'
        }), 503

    headers = {
        'Authorization': f'Bearer {access_token}',
    }

    try:
        # URL encode the reference
        encoded_reference = requests.utils.quote(reference, safe='')

        response = requests.get(
            f'{MONNIFY_BASE_URL}/api/v2/transactions/{encoded_reference}',
            headers=headers,
            timeout=30
        )
        result = response.json()

        if result.get('requestSuccessful'):
            transaction = result['responseBody']
            payment_status = transaction.get('paymentStatus', '')

            if payment_status == 'PAID':
                # Extract order info from reference
                payment_ref = transaction.get('paymentReference', '')
                order_number = payment_ref.replace('DTG-', '') if payment_ref.startswith('DTG-') else None

                if order_number:
                    order = Order.query.filter_by(order_number=order_number).first()

                    if order:
                        # SECURITY: Verify amount matches order total
                        paid_amount = float(transaction.get('amountPaid', 0))
                        expected_amount = float(order.total_amount)

                        # Allow small tolerance for rounding (0.01 Naira)
                        if abs(paid_amount - expected_amount) > 0.01:
                            # Amount mismatch - potential fraud attempt
                            print(f"[SECURITY ALERT] Amount mismatch for Order #{order_number}: "
                                  f"Paid ₦{paid_amount}, Expected ₦{expected_amount}")
                            return jsonify({
                                'status': False,
                                'message': 'Payment amount mismatch. Please contact support.',
                            }), 400

                        # Update order status
                        order.status = 'confirmed'
                        order.payment_reference = reference
                        order.payment_status = 'paid'
                        db.session.commit()

                        print(f"[PAYMENT] Verified payment for Order #{order.order_number}, Amount: ₦{paid_amount}")

                return jsonify({
                    'status': True,
                    'message': 'Payment verified successfully',
                    'data': {
                        'reference': reference,
                        'amount': transaction.get('amountPaid', 0),
                        'paid_at': transaction.get('completedOn'),
                        'payment_method': transaction.get('paymentMethod')
                    }
                })
            else:
                return jsonify({
                    'status': False,
                    'message': f'Payment status: {payment_status}',
                    'data': transaction
                }), 400
        else:
            return jsonify({
                'status': False,
                'message': 'Payment verification failed',
                'error': result.get('responseMessage', 'Unknown error')
            }), 400

    except requests.exceptions.Timeout:
        return jsonify({
            'status': False,
            'error': 'Verification timeout. Please try again.'
        }), 504

    except Exception as e:
        print(f"[PAYMENT ERROR] Verification failed: {str(e)}")
        return jsonify({
            'status': False,
            'error': 'Payment verification failed'
        }), 500


@payment_bp.route('/payment/webhook', methods=['POST'])
def payment_webhook():
    """
    Handle Monnify webhook events.

    SECURITY: Signature verification
    - Verifies SHA512 signature to ensure request came from Monnify
    - Rejects any requests with invalid or missing signatures
    - This prevents webhook spoofing attacks
    """
    # ============================================
    # CRITICAL SECURITY: Verify webhook signature
    # ============================================
    signature = request.headers.get('monnify-signature')
    payload = request.get_data(as_text=True)

    if not verify_monnify_signature(payload, signature):
        # Invalid signature - possible spoofing attempt
        print(f"[SECURITY ALERT] Invalid Monnify webhook signature from {request.remote_addr}")
        return jsonify({'error': 'Invalid signature'}), 400

    # Signature valid - process the webhook
    try:
        data = request.json
    except Exception:
        return jsonify({'error': 'Invalid JSON'}), 400

    event_type = data.get('eventType')
    event_data = data.get('eventData', {})

    print(f"[WEBHOOK] Received Monnify event: {event_type}")

    if event_type == 'SUCCESSFUL_TRANSACTION':
        payment_ref = event_data.get('paymentReference', '')

        if payment_ref.startswith('DTG-'):
            order_number = payment_ref.replace('DTG-', '')
            order = Order.query.filter_by(order_number=order_number).first()

            if order:
                # SECURITY: Verify amount matches (defense in depth)
                paid_amount = float(event_data.get('amountPaid', 0))
                expected_amount = float(order.total_amount)

                if abs(paid_amount - expected_amount) > 0.01:
                    print(f"[SECURITY ALERT] Webhook amount mismatch for Order #{order_number}")
                    # Still mark as paid but flag for review
                    order.notes = f"{order.notes or ''}\n[ALERT] Amount mismatch in webhook"

                order.status = 'confirmed'
                order.payment_reference = event_data.get('transactionReference', payment_ref)
                order.payment_status = 'paid'
                db.session.commit()

                print(f"[WEBHOOK] Order #{order_number} marked as paid")

    elif event_type == 'FAILED_TRANSACTION':
        payment_ref = event_data.get('paymentReference', '')

        if payment_ref.startswith('DTG-'):
            order_number = payment_ref.replace('DTG-', '')
            order = Order.query.filter_by(order_number=order_number).first()

            if order and order.payment_status != 'paid':
                order.payment_status = 'failed'
                db.session.commit()
                print(f"[WEBHOOK] Order #{order_number} payment failed")

    elif event_type == 'CANCELLED_TRANSACTION':
        payment_ref = event_data.get('paymentReference', '')

        if payment_ref.startswith('DTG-'):
            order_number = payment_ref.replace('DTG-', '')
            order = Order.query.filter_by(order_number=order_number).first()

            if order and order.payment_status != 'paid':
                order.payment_status = 'cancelled'
                db.session.commit()
                print(f"[WEBHOOK] Order #{order_number} payment cancelled")

    return jsonify({'status': 'success'}), 200


@payment_bp.route('/payment/methods', methods=['GET'])
def get_payment_methods():
    """Get available payment methods"""
    return jsonify({
        'methods': [
            {
                'id': 'monnify',
                'name': 'Pay with Card/Bank',
                'description': 'Pay securely with your debit card, bank transfer, or USSD',
                'icon': 'fa-credit-card',
                'enabled': True
            },
            {
                'id': 'bank_transfer',
                'name': 'Bank Transfer',
                'description': 'Transfer to our bank account',
                'icon': 'fa-university',
                'enabled': True,
                'details': {
                    'bank_name': 'GTBank',
                    'account_number': '0123456789',
                    'account_name': "D'Tee & Gee Kitchen"
                }
            },
            {
                'id': 'cash_on_delivery',
                'name': 'Cash on Delivery',
                'description': 'Pay when your order arrives',
                'icon': 'fa-money-bill-wave',
                'enabled': True
            }
        ]
    })
