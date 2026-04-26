from flask import Blueprint, jsonify, request, session
from sqlalchemy import func
from src.models.user import CartItem, Product, User, db

cart_bp = Blueprint('cart', __name__)

def get_current_user_id():
    """Get current user ID from session or return None"""
    return session.get('user_id')

@cart_bp.route('/cart', methods=['GET'])
def get_cart():
    """Get current user's cart items"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({'error': 'Authentication required'}), 401
    
    cart_items = CartItem.query.filter_by(user_id=user_id).all()
    
    total = sum(item.product.price * item.quantity for item in cart_items if item.product)
    
    return jsonify({
        'items': [item.to_dict() for item in cart_items],
        'total': float(total),
        'item_count': sum(item.quantity for item in cart_items)
    })

@cart_bp.route('/cart/add', methods=['POST'])
def add_to_cart():
    """Add item to cart"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({'error': 'Authentication required'}), 401
    
    data = request.json
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)
    
    if not product_id:
        return jsonify({'error': 'Product ID is required'}), 400
    
    # Check if product exists and is available
    product = Product.query.get(product_id)
    if not product or not product.is_available:
        return jsonify({'error': 'Product not found or unavailable'}), 404
    
    # Check if item already exists in cart
    existing_item = CartItem.query.filter_by(
        user_id=user_id, 
        product_id=product_id
    ).first()
    
    if existing_item:
        existing_item.quantity += quantity
        db.session.commit()
        return jsonify(existing_item.to_dict())
    else:
        cart_item = CartItem(
            user_id=user_id,
            product_id=product_id,
            quantity=quantity
        )
        db.session.add(cart_item)
        db.session.commit()
        return jsonify(cart_item.to_dict()), 201

@cart_bp.route('/cart/update/<int:item_id>', methods=['PUT'])
def update_cart_item(item_id):
    """Update cart item quantity"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({'error': 'Authentication required'}), 401
    
    cart_item = CartItem.query.filter_by(
        id=item_id, 
        user_id=user_id
    ).first_or_404()
    
    data = request.json
    quantity = data.get('quantity', 1)
    
    if quantity <= 0:
        db.session.delete(cart_item)
    else:
        cart_item.quantity = quantity
    
    db.session.commit()
    
    if quantity <= 0:
        return '', 204
    else:
        return jsonify(cart_item.to_dict())

@cart_bp.route('/cart/remove/<int:item_id>', methods=['DELETE'])
def remove_cart_item(item_id):
    """Remove item from cart"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({'error': 'Authentication required'}), 401
    
    cart_item = CartItem.query.filter_by(
        id=item_id, 
        user_id=user_id
    ).first_or_404()
    
    db.session.delete(cart_item)
    db.session.commit()
    
    return '', 204

@cart_bp.route('/cart/clear', methods=['DELETE'])
def clear_cart():
    """Clear all items from cart"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({'error': 'Authentication required'}), 401
    
    CartItem.query.filter_by(user_id=user_id).delete()
    db.session.commit()
    
    return '', 204

@cart_bp.route('/cart/count', methods=['GET'])
def get_cart_count():
    """Get cart item count"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({'count': 0})
    
    count = db.session.query(func.coalesce(func.sum(CartItem.quantity), 0)).filter_by(user_id=user_id).scalar()
    return jsonify({'count': int(count)})

