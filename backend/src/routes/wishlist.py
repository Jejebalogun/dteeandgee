from flask import Blueprint, jsonify, request, session
from src.models.user import Wishlist, Product, CartItem, db

wishlist_bp = Blueprint('wishlist', __name__)

def get_current_user_id():
    """Get current user ID from session or return None"""
    return session.get('user_id')

@wishlist_bp.route('/wishlist', methods=['GET'])
def get_wishlist():
    """Get current user's wishlist"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({'error': 'Authentication required'}), 401

    wishlist_items = Wishlist.query.filter_by(user_id=user_id)\
                                   .order_by(Wishlist.created_at.desc())\
                                   .all()

    return jsonify({
        'items': [item.to_dict() for item in wishlist_items],
        'count': len(wishlist_items)
    })

@wishlist_bp.route('/wishlist/add', methods=['POST'])
def add_to_wishlist():
    """Add product to wishlist"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({'error': 'Authentication required'}), 401

    data = request.json
    product_id = data.get('product_id')

    if not product_id:
        return jsonify({'error': 'Product ID is required'}), 400

    # Check if product exists
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404

    # Check if already in wishlist
    existing = Wishlist.query.filter_by(user_id=user_id, product_id=product_id).first()
    if existing:
        return jsonify({'error': 'Product already in wishlist', 'item': existing.to_dict()}), 400

    # Add to wishlist
    wishlist_item = Wishlist(user_id=user_id, product_id=product_id)
    db.session.add(wishlist_item)
    db.session.commit()

    return jsonify(wishlist_item.to_dict()), 201

@wishlist_bp.route('/wishlist/remove/<int:product_id>', methods=['DELETE'])
def remove_from_wishlist(product_id):
    """Remove product from wishlist"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({'error': 'Authentication required'}), 401

    wishlist_item = Wishlist.query.filter_by(user_id=user_id, product_id=product_id).first()

    if not wishlist_item:
        return jsonify({'error': 'Product not in wishlist'}), 404

    db.session.delete(wishlist_item)
    db.session.commit()

    return '', 204

@wishlist_bp.route('/wishlist/check/<int:product_id>', methods=['GET'])
def check_wishlist(product_id):
    """Check if product is in user's wishlist"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({'in_wishlist': False})

    exists = Wishlist.query.filter_by(user_id=user_id, product_id=product_id).first() is not None
    return jsonify({'in_wishlist': exists})

@wishlist_bp.route('/wishlist/toggle/<int:product_id>', methods=['POST'])
def toggle_wishlist(product_id):
    """Toggle product in wishlist (add if not present, remove if present)"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({'error': 'Authentication required'}), 401

    # Check if product exists
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404

    existing = Wishlist.query.filter_by(user_id=user_id, product_id=product_id).first()

    if existing:
        db.session.delete(existing)
        db.session.commit()
        return jsonify({'in_wishlist': False, 'message': 'Removed from wishlist'})
    else:
        wishlist_item = Wishlist(user_id=user_id, product_id=product_id)
        db.session.add(wishlist_item)
        db.session.commit()
        return jsonify({'in_wishlist': True, 'message': 'Added to wishlist', 'item': wishlist_item.to_dict()})

@wishlist_bp.route('/wishlist/move-to-cart/<int:product_id>', methods=['POST'])
def move_to_cart(product_id):
    """Move item from wishlist to cart"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({'error': 'Authentication required'}), 401

    # Find wishlist item
    wishlist_item = Wishlist.query.filter_by(user_id=user_id, product_id=product_id).first()
    if not wishlist_item:
        return jsonify({'error': 'Product not in wishlist'}), 404

    # Check if product is available
    product = Product.query.get(product_id)
    if not product or not product.is_available:
        return jsonify({'error': 'Product not available'}), 400

    # Check if already in cart
    cart_item = CartItem.query.filter_by(user_id=user_id, product_id=product_id).first()
    if cart_item:
        cart_item.quantity += 1
    else:
        cart_item = CartItem(user_id=user_id, product_id=product_id, quantity=1)
        db.session.add(cart_item)

    # Remove from wishlist
    db.session.delete(wishlist_item)
    db.session.commit()

    return jsonify({
        'message': 'Moved to cart successfully',
        'cart_item': cart_item.to_dict()
    })
