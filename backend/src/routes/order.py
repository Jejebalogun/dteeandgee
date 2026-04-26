from flask import Blueprint, jsonify, request, session
from src.models.user import Order, OrderItem, CartItem, Product, User, db
import uuid
from datetime import datetime
from threading import Thread

# Import email utility (handle import error gracefully)
try:
    from src.utils.email import send_order_confirmation, send_order_status_update
    EMAIL_ENABLED = True
except ImportError:
    EMAIL_ENABLED = False
    print("Email utility not available - order confirmations disabled")

order_bp = Blueprint('order', __name__)

def get_current_user_id():
    """Get current user ID from session or return None"""
    return session.get('user_id')

def generate_order_number():
    """Generate unique order number"""
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    random_suffix = str(uuid.uuid4())[:8].upper()
    return f"DG{timestamp}{random_suffix}"

@order_bp.route('/orders', methods=['GET'])
def get_orders():
    """Get current user's orders"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({'error': 'Authentication required'}), 401
    
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    orders = Order.query.filter_by(user_id=user_id)\
                       .order_by(Order.created_at.desc())\
                       .paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'orders': [order.to_dict() for order in orders.items],
        'total': orders.total,
        'pages': orders.pages,
        'current_page': page,
        'per_page': per_page
    })

@order_bp.route('/orders/<int:order_id>', methods=['GET'])
def get_order(order_id):
    """Get a specific order"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({'error': 'Authentication required'}), 401
    
    order = Order.query.filter_by(id=order_id, user_id=user_id).first_or_404()
    return jsonify(order.to_dict())

@order_bp.route('/orders', methods=['POST'])
def create_order():
    """Create a new order from cart items"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({'error': 'Authentication required'}), 401
    
    data = request.json
    
    # Validate required fields
    required_fields = ['delivery_address', 'phone_number']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400
    
    # Get cart items
    cart_items = CartItem.query.filter_by(user_id=user_id).all()
    if not cart_items:
        return jsonify({'error': 'Cart is empty'}), 400
    
    # Calculate total
    total_amount = sum(item.product.price * item.quantity for item in cart_items if item.product)
    
    # Get payment method (default to cash on delivery)
    payment_method = data.get('payment_method', 'cash_on_delivery')
    valid_payment_methods = ['paystack', 'bank_transfer', 'cash_on_delivery']
    if payment_method not in valid_payment_methods:
        payment_method = 'cash_on_delivery'

    # Determine initial payment status
    payment_status = 'pending'
    if payment_method == 'cash_on_delivery':
        payment_status = 'pending'

    # Create order
    order = Order(
        user_id=user_id,
        order_number=generate_order_number(),
        total_amount=total_amount,
        delivery_address=data['delivery_address'],
        phone_number=data['phone_number'],
        notes=data.get('notes', ''),
        payment_method=payment_method,
        payment_status=payment_status
    )
    
    db.session.add(order)
    db.session.flush()  # Get order ID
    
    # Create order items
    for cart_item in cart_items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=cart_item.product_id,
            quantity=cart_item.quantity,
            unit_price=cart_item.product.price,
            total_price=cart_item.product.price * cart_item.quantity
        )
        db.session.add(order_item)
    
    # Clear cart
    CartItem.query.filter_by(user_id=user_id).delete()

    db.session.commit()

    # Send order confirmation email (in background thread)
    if EMAIL_ENABLED:
        user = User.query.get(user_id)
        if user and user.email:
            # Use thread to avoid blocking the response
            Thread(target=send_order_confirmation, args=(order, user.email, user.name)).start()

    return jsonify(order.to_dict()), 201

@order_bp.route('/orders/guest', methods=['POST'])
def create_guest_order():
    """Create a new order as guest (no authentication required)"""
    data = request.json

    # Validate required fields for guest checkout
    required_fields = ['delivery_address', 'phone_number', 'guest_name', 'guest_email']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field.replace("_", " ").title()} is required'}), 400

    # Validate email format
    import re
    email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    if not re.match(email_regex, data['guest_email']):
        return jsonify({'error': 'Invalid email address'}), 400

    # Get cart items from request (for guest checkout, items must be provided)
    cart_items_data = data.get('items', [])

    # If no items in request, try to calculate from localStorage data (frontend sends this)
    if not cart_items_data:
        return jsonify({'error': 'Cart items are required for guest checkout'}), 400

    # Calculate total from provided items
    total_amount = 0
    order_items_data = []

    for item_data in cart_items_data:
        product = Product.query.get(item_data.get('product_id'))
        if not product:
            continue

        quantity = item_data.get('quantity', 1)
        unit_price = product.price
        item_total = unit_price * quantity
        total_amount += item_total

        order_items_data.append({
            'product': product,
            'quantity': quantity,
            'unit_price': unit_price,
            'total_price': item_total
        })

    if not order_items_data:
        return jsonify({'error': 'No valid products found'}), 400

    # Get payment method
    payment_method = data.get('payment_method', 'cash_on_delivery')
    valid_payment_methods = ['paystack', 'bank_transfer', 'cash_on_delivery']
    if payment_method not in valid_payment_methods:
        payment_method = 'cash_on_delivery'

    # Create order (without user_id for guest)
    order = Order(
        user_id=None,  # Guest order - no user account
        order_number=generate_order_number(),
        total_amount=total_amount,
        delivery_address=data['delivery_address'],
        phone_number=data['phone_number'],
        notes=data.get('notes', ''),
        payment_method=payment_method,
        payment_status='pending',
        guest_name=data['guest_name'],
        guest_email=data['guest_email']
    )

    db.session.add(order)
    db.session.flush()  # Get order ID

    # Create order items
    for item_data in order_items_data:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item_data['product'].id,
            quantity=item_data['quantity'],
            unit_price=item_data['unit_price'],
            total_price=item_data['total_price']
        )
        db.session.add(order_item)

    db.session.commit()

    # Send order confirmation email to guest (in background thread)
    if EMAIL_ENABLED and data.get('guest_email'):
        Thread(target=send_order_confirmation, args=(order, data['guest_email'], data.get('guest_name'))).start()

    return jsonify(order.to_dict()), 201

@order_bp.route('/orders/<int:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    """Update order status (admin function)"""
    data = request.json
    new_status = data.get('status')

    valid_statuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']
    if new_status not in valid_statuses:
        return jsonify({'error': 'Invalid status'}), 400

    order = Order.query.get_or_404(order_id)
    old_status = order.status
    order.status = new_status
    db.session.commit()

    # Send status update email if status actually changed
    if EMAIL_ENABLED and old_status != new_status:
        # Get customer email
        user_email = None
        user_name = None
        if order.user_id:
            user = User.query.get(order.user_id)
            if user:
                user_email = user.email
                user_name = user.name
        elif order.guest_email:
            user_email = order.guest_email
            user_name = order.guest_name

        if user_email:
            Thread(target=send_order_status_update, args=(order, user_email, user_name)).start()

    return jsonify(order.to_dict())

@order_bp.route('/orders/<int:order_id>/cancel', methods=['PUT'])
def cancel_order(order_id):
    """Cancel an order"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({'error': 'Authentication required'}), 401
    
    order = Order.query.filter_by(id=order_id, user_id=user_id).first_or_404()
    
    # Only allow cancellation if order is still pending or confirmed
    if order.status not in ['pending', 'confirmed']:
        return jsonify({'error': 'Order cannot be cancelled at this stage'}), 400
    
    order.status = 'cancelled'
    db.session.commit()

    return jsonify(order.to_dict())

@order_bp.route('/orders/<int:order_id>/reorder', methods=['POST'])
def reorder(order_id):
    """Add all items from a previous order to cart"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({'error': 'Authentication required'}), 401

    # Get the original order
    order = Order.query.filter_by(id=order_id, user_id=user_id).first_or_404()

    # Get order items
    items_added = 0
    items_unavailable = []

    for order_item in order.items:
        product = order_item.product
        if not product:
            continue

        # Check if product is still available (in stock)
        if hasattr(product, 'stock_quantity') and product.stock_quantity is not None:
            if product.stock_quantity <= 0:
                items_unavailable.append(product.name)
                continue

        # Check if item already in cart
        existing_cart_item = CartItem.query.filter_by(
            user_id=user_id,
            product_id=product.id
        ).first()

        if existing_cart_item:
            # Update quantity
            existing_cart_item.quantity += order_item.quantity
        else:
            # Add new cart item
            cart_item = CartItem(
                user_id=user_id,
                product_id=product.id,
                quantity=order_item.quantity
            )
            db.session.add(cart_item)

        items_added += 1

    db.session.commit()

    response = {
        'message': f'{items_added} item(s) added to cart',
        'items_added': items_added
    }

    if items_unavailable:
        response['unavailable_items'] = items_unavailable
        response['message'] += f'. {len(items_unavailable)} item(s) unavailable.'

    return jsonify(response)

@order_bp.route('/admin/orders', methods=['GET'])
def get_all_orders():
    """Get all orders (admin function)"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    status = request.args.get('status')
    
    query = Order.query
    
    if status:
        query = query.filter(Order.status == status)
    
    orders = query.order_by(Order.created_at.desc())\
                  .paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'orders': [order.to_dict() for order in orders.items],
        'total': orders.total,
        'pages': orders.pages,
        'current_page': page,
        'per_page': per_page
    })

