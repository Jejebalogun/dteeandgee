from flask import Blueprint, jsonify, request, session
from src.models.user import PromoCode, db

promo_bp = Blueprint('promo', __name__)

@promo_bp.route('/promo/validate', methods=['POST'])
def validate_promo_code():
    """Validate a promo code"""
    data = request.json
    code = data.get('code', '').strip().upper()
    order_amount = data.get('order_amount', 0)

    if not code:
        return jsonify({'error': 'Promo code is required'}), 400

    promo = PromoCode.query.filter_by(code=code).first()

    if not promo:
        return jsonify({'error': 'Invalid promo code'}), 404

    is_valid, message = promo.is_valid(order_amount)

    if not is_valid:
        return jsonify({'error': message}), 400

    discount = promo.calculate_discount(order_amount)

    return jsonify({
        'valid': True,
        'code': promo.code,
        'discount_type': promo.discount_type,
        'discount_value': float(promo.discount_value),
        'discount_amount': round(discount, 2),
        'final_amount': round(order_amount - discount, 2)
    })

@promo_bp.route('/promo/apply', methods=['POST'])
def apply_promo_code():
    """Apply promo code to session for checkout"""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Authentication required'}), 401

    data = request.json
    code = data.get('code', '').strip().upper()
    order_amount = data.get('order_amount', 0)

    promo = PromoCode.query.filter_by(code=code).first()

    if not promo:
        return jsonify({'error': 'Invalid promo code'}), 404

    is_valid, message = promo.is_valid(order_amount)

    if not is_valid:
        return jsonify({'error': message}), 400

    discount = promo.calculate_discount(order_amount)

    # Store in session for checkout
    session['applied_promo'] = {
        'promo_id': promo.id,
        'code': promo.code,
        'discount_amount': round(discount, 2)
    }

    return jsonify({
        'success': True,
        'code': promo.code,
        'discount_amount': round(discount, 2),
        'final_amount': round(order_amount - discount, 2)
    })

@promo_bp.route('/promo/remove', methods=['POST'])
def remove_promo_code():
    """Remove applied promo code from session"""
    if 'applied_promo' in session:
        del session['applied_promo']

    return jsonify({'success': True, 'message': 'Promo code removed'})

@promo_bp.route('/promo/current', methods=['GET'])
def get_current_promo():
    """Get currently applied promo code"""
    applied = session.get('applied_promo')

    if not applied:
        return jsonify({'applied': False})

    return jsonify({
        'applied': True,
        'code': applied['code'],
        'discount_amount': applied['discount_amount']
    })
