"""
Admin routes for D'Tee & Gee Kitchen
Handles admin dashboard, product management, order management, user management

Security features:
- Admin authentication required for all routes
- Secure file uploads with validation
- Input sanitization
"""
from flask import Blueprint, jsonify, request, session, current_app
from src.models.user import (
    User, Product, Category, Order, OrderItem, Review, PromoCode, db
)
from src.utils.security import (
    admin_required,
    save_uploaded_file,
    validate_file_upload,
    sanitize_input,
    ALLOWED_IMAGE_EXTENSIONS,
    MAX_IMAGE_SIZE
)
from sqlalchemy import func, desc
from datetime import datetime, timedelta
import os

# Create admin blueprint
admin_bp = Blueprint('admin', __name__)

# ============ Dashboard Stats ============

@admin_bp.route('/admin/dashboard', methods=['GET'])
@admin_required
def get_dashboard_stats():
    """Get dashboard overview statistics"""
    today = datetime.utcnow().date()
    week_ago = today - timedelta(days=7)
    month_ago = today - timedelta(days=30)

    # Order statistics
    total_orders = Order.query.count()
    pending_orders = Order.query.filter_by(status='pending').count()
    today_orders = Order.query.filter(
        func.date(Order.created_at) == today
    ).count()

    # Revenue statistics
    total_revenue = db.session.query(
        func.sum(Order.total_amount)
    ).filter(Order.status != 'cancelled').scalar() or 0

    today_revenue = db.session.query(
        func.sum(Order.total_amount)
    ).filter(
        func.date(Order.created_at) == today,
        Order.status != 'cancelled'
    ).scalar() or 0

    week_revenue = db.session.query(
        func.sum(Order.total_amount)
    ).filter(
        func.date(Order.created_at) >= week_ago,
        Order.status != 'cancelled'
    ).scalar() or 0

    month_revenue = db.session.query(
        func.sum(Order.total_amount)
    ).filter(
        func.date(Order.created_at) >= month_ago,
        Order.status != 'cancelled'
    ).scalar() or 0

    # Product statistics
    total_products = Product.query.count()
    low_stock_products = Product.query.filter(
        Product.stock_quantity <= Product.low_stock_threshold,
        Product.stock_quantity > 0
    ).count() if hasattr(Product, 'low_stock_threshold') else 0

    out_of_stock = Product.query.filter(
        Product.stock_quantity == 0
    ).count() if hasattr(Product, 'stock_quantity') else 0

    # User statistics
    total_users = User.query.count()
    new_users_today = User.query.filter(
        func.date(User.created_at) == today
    ).count()

    # Recent orders
    recent_orders = Order.query.order_by(
        Order.created_at.desc()
    ).limit(5).all()

    # Top selling products (by quantity)
    top_products = db.session.query(
        Product.id,
        Product.name,
        Product.image_url,
        func.sum(OrderItem.quantity).label('total_sold')
    ).join(OrderItem).join(Order).filter(
        Order.status != 'cancelled'
    ).group_by(Product.id).order_by(
        desc('total_sold')
    ).limit(5).all()

    return jsonify({
        'orders': {
            'total': total_orders,
            'pending': pending_orders,
            'today': today_orders
        },
        'revenue': {
            'total': float(total_revenue),
            'today': float(today_revenue),
            'week': float(week_revenue),
            'month': float(month_revenue)
        },
        'products': {
            'total': total_products,
            'low_stock': low_stock_products,
            'out_of_stock': out_of_stock
        },
        'users': {
            'total': total_users,
            'new_today': new_users_today
        },
        'recent_orders': [order.to_dict() for order in recent_orders],
        'top_products': [
            {
                'id': p.id,
                'name': p.name,
                'image_url': p.image_url,
                'total_sold': int(p.total_sold)
            } for p in top_products
        ]
    })


@admin_bp.route('/admin/stats/revenue', methods=['GET'])
@admin_required
def get_revenue_chart():
    """Get revenue data for charts"""
    days = request.args.get('days', 30, type=int)
    start_date = datetime.utcnow().date() - timedelta(days=days)

    # Daily revenue for the period
    daily_revenue = db.session.query(
        func.date(Order.created_at).label('date'),
        func.sum(Order.total_amount).label('revenue'),
        func.count(Order.id).label('orders')
    ).filter(
        func.date(Order.created_at) >= start_date,
        Order.status != 'cancelled'
    ).group_by(
        func.date(Order.created_at)
    ).order_by('date').all()

    return jsonify({
        'data': [
            {
                'date': str(row.date),
                'revenue': float(row.revenue or 0),
                'orders': row.orders
            } for row in daily_revenue
        ]
    })


# ============ Product Management ============

@admin_bp.route('/admin/products', methods=['GET'])
@admin_required
def get_admin_products():
    """Get all products with admin details"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    search = request.args.get('search', '')
    category = request.args.get('category', '')
    stock_status = request.args.get('stock_status', '')  # all, low, out

    query = Product.query

    if search:
        query = query.filter(Product.name.ilike(f'%{search}%'))

    if category:
        query = query.filter(Product.category == category)

    if stock_status == 'low' and hasattr(Product, 'stock_quantity'):
        query = query.filter(
            Product.stock_quantity <= Product.low_stock_threshold,
            Product.stock_quantity > 0
        )
    elif stock_status == 'out' and hasattr(Product, 'stock_quantity'):
        query = query.filter(Product.stock_quantity == 0)

    products = query.order_by(Product.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )

    return jsonify({
        'products': [p.to_dict() for p in products.items],
        'total': products.total,
        'pages': products.pages,
        'current_page': page
    })


@admin_bp.route('/admin/products', methods=['POST'])
@admin_required
def create_product():
    """Create a new product"""
    data = request.json
    if not data:
        return jsonify({'error': 'Request body must be JSON'}), 400

    required_fields = ['name', 'price', 'category']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400

    # Resolve category name → ID
    category_name = data['category']
    category_obj = Category.query.filter_by(name=category_name).first()
    if not category_obj:
        return jsonify({'error': f'Unknown category: "{category_name}". Please pick a valid category.'}), 400

    product = Product(
        name=data['name'],
        description=data.get('description', ''),
        price=data['price'],
        category_id=category_obj.id,
        image_url=data.get('image_url', ''),
        is_available=data.get('is_available', True),
        stock_quantity=data.get('stock_quantity', 100),
        low_stock_threshold=data.get('low_stock_threshold', 10)
    )

    db.session.add(product)
    db.session.commit()

    return jsonify(product.to_dict()), 201


@admin_bp.route('/admin/products/upload-image', methods=['POST'])
@admin_required
def upload_product_image():
    """Upload a product image and save it to the static images folder."""
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    file = request.files['image']

    # Determine absolute path to frontend/images/products/
    frontend_dir = os.path.abspath(
        os.path.join(os.path.dirname(__file__), '../../../frontend')
    )
    upload_folder = os.path.join(frontend_dir, 'images', 'products')

    success, result = save_uploaded_file(
        file,
        upload_folder,
        allowed_extensions=ALLOWED_IMAGE_EXTENSIONS,
        max_size=MAX_IMAGE_SIZE
    )

    if not success:
        return jsonify({'error': result.get('error', 'Upload failed')}), 400

    # Return the public URL path (served as a static file)
    public_url = f"/images/products/{result['filename']}"
    return jsonify({'url': public_url, 'filename': result['filename']}), 201




@admin_bp.route('/admin/products/<int:product_id>', methods=['PUT'])
@admin_required
def update_product(product_id):
    """Update a product"""
    product = Product.query.get_or_404(product_id)
    data = request.json
    if not data:
        return jsonify({'error': 'Request body must be JSON'}), 400

    # Update fields if provided
    if 'name' in data:
        product.name = data['name']
    if 'description' in data:
        product.description = data['description']
    if 'price' in data:
        product.price = data['price']
    if 'category' in data:
        # Resolve category name → ID
        category_obj = Category.query.filter_by(name=data['category']).first()
        if not category_obj:
            return jsonify({'error': f'Unknown category: "{data["category"]}"'}), 400
        product.category_id = category_obj.id
    if 'image_url' in data:
        product.image_url = data['image_url']
    if 'is_available' in data:
        product.is_available = data['is_available']
    if 'stock_quantity' in data:
        product.stock_quantity = data['stock_quantity']
    if 'low_stock_threshold' in data:
        product.low_stock_threshold = data['low_stock_threshold']

    db.session.commit()

    return jsonify(product.to_dict())


@admin_bp.route('/admin/products/<int:product_id>', methods=['DELETE'])
@admin_required
def delete_product(product_id):
    """Delete a product"""
    product = Product.query.get_or_404(product_id)

    # Soft delete by marking unavailable instead of hard delete
    product.is_available = False
    db.session.commit()

    return jsonify({'message': 'Product deleted successfully'})


@admin_bp.route('/admin/products/<int:product_id>/stock', methods=['PUT'])
@admin_required
def update_stock(product_id):
    """Update product stock quantity"""
    product = Product.query.get_or_404(product_id)
    data = request.json

    if 'stock_quantity' not in data:
        return jsonify({'error': 'stock_quantity is required'}), 400

    product.stock_quantity = data['stock_quantity']
    db.session.commit()

    return jsonify(product.to_dict())


# ============ Order Management ============

@admin_bp.route('/admin/orders', methods=['GET'])
@admin_required
def get_admin_orders():
    """Get all orders with filters"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    status = request.args.get('status', '')
    payment_status = request.args.get('payment_status', '')
    search = request.args.get('search', '')  # order number or customer name
    date_from = request.args.get('date_from', '')
    date_to = request.args.get('date_to', '')

    query = Order.query

    if status:
        query = query.filter(Order.status == status)

    if payment_status:
        query = query.filter(Order.payment_status == payment_status)

    if search:
        query = query.filter(
            (Order.order_number.ilike(f'%{search}%')) |
            (Order.guest_name.ilike(f'%{search}%')) |
            (Order.phone_number.ilike(f'%{search}%'))
        )

    if date_from:
        try:
            from_date = datetime.strptime(date_from, '%Y-%m-%d')
            query = query.filter(Order.created_at >= from_date)
        except ValueError:
            pass

    if date_to:
        try:
            to_date = datetime.strptime(date_to, '%Y-%m-%d')
            to_date = to_date + timedelta(days=1)  # Include the entire day
            query = query.filter(Order.created_at < to_date)
        except ValueError:
            pass

    orders = query.order_by(Order.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )

    return jsonify({
        'orders': [order.to_dict() for order in orders.items],
        'total': orders.total,
        'pages': orders.pages,
        'current_page': page
    })


@admin_bp.route('/admin/orders/<int:order_id>', methods=['GET'])
@admin_required
def get_admin_order_detail(order_id):
    """Get detailed order information"""
    order = Order.query.get_or_404(order_id)

    order_data = order.to_dict()

    # Add customer info if registered user
    if order.user_id:
        user = User.query.get(order.user_id)
        if user:
            order_data['customer'] = {
                'id': user.id,
                'name': f"{user.first_name} {user.last_name}".strip() or user.username,
                'email': user.email,
                'phone': user.phone,
                'total_orders': Order.query.filter_by(user_id=user.id).count()
            }

    return jsonify(order_data)


@admin_bp.route('/admin/orders/<int:order_id>/status', methods=['PUT'])
@admin_required
def admin_update_order_status(order_id):
    """Update order status"""
    order = Order.query.get_or_404(order_id)
    data = request.json

    new_status = data.get('status')
    valid_statuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']

    if new_status not in valid_statuses:
        return jsonify({'error': 'Invalid status'}), 400

    order.status = new_status
    db.session.commit()

    return jsonify(order.to_dict())


@admin_bp.route('/admin/orders/<int:order_id>/payment', methods=['PUT'])
@admin_required
def update_payment_status(order_id):
    """Update order payment status"""
    order = Order.query.get_or_404(order_id)
    data = request.json

    new_status = data.get('payment_status')
    valid_statuses = ['pending', 'paid', 'failed', 'refunded']

    if new_status not in valid_statuses:
        return jsonify({'error': 'Invalid payment status'}), 400

    order.payment_status = new_status
    if data.get('payment_reference'):
        order.payment_reference = data['payment_reference']

    db.session.commit()

    return jsonify(order.to_dict())


# ============ User Management ============

@admin_bp.route('/admin/users', methods=['GET'])
@admin_required
def get_admin_users():
    """Get all users"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    search = request.args.get('search', '')

    query = User.query

    if search:
        query = query.filter(
            (User.username.ilike(f'%{search}%')) |
            (User.email.ilike(f'%{search}%')) |
            (User.first_name.ilike(f'%{search}%')) |
            (User.last_name.ilike(f'%{search}%'))
        )

    users = query.order_by(User.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )

    user_list = []
    for user in users.items:
        user_data = user.to_dict()
        # Add order count
        user_data['order_count'] = Order.query.filter_by(user_id=user.id).count()
        user_data['total_spent'] = float(
            db.session.query(func.sum(Order.total_amount))
            .filter(Order.user_id == user.id, Order.status != 'cancelled')
            .scalar() or 0
        )
        user_list.append(user_data)

    return jsonify({
        'users': user_list,
        'total': users.total,
        'pages': users.pages,
        'current_page': page
    })


@admin_bp.route('/admin/users/<int:user_id>', methods=['GET'])
@admin_required
def get_admin_user_detail(user_id):
    """Get detailed user information"""
    user = User.query.get_or_404(user_id)

    user_data = user.to_dict()
    user_data['order_count'] = Order.query.filter_by(user_id=user.id).count()
    user_data['total_spent'] = float(
        db.session.query(func.sum(Order.total_amount))
        .filter(Order.user_id == user.id, Order.status != 'cancelled')
        .scalar() or 0
    )

    # Recent orders
    recent_orders = Order.query.filter_by(user_id=user.id).order_by(
        Order.created_at.desc()
    ).limit(10).all()
    user_data['recent_orders'] = [order.to_dict() for order in recent_orders]

    return jsonify(user_data)


# ============ Inventory Alerts ============

@admin_bp.route('/admin/inventory/alerts', methods=['GET'])
@admin_required
def get_inventory_alerts():
    """Get products with low stock or out of stock"""
    low_stock = []
    out_of_stock = []

    if hasattr(Product, 'stock_quantity'):
        # Low stock products
        low_stock_products = Product.query.filter(
            Product.stock_quantity <= Product.low_stock_threshold,
            Product.stock_quantity > 0,
            Product.is_available == True
        ).all()

        low_stock = [{
            'id': p.id,
            'name': p.name,
            'image_url': p.image_url,
            'stock_quantity': p.stock_quantity,
            'low_stock_threshold': p.low_stock_threshold,
            'category': p.category.name if p.category else None
        } for p in low_stock_products]

        # Out of stock products
        out_of_stock_products = Product.query.filter(
            Product.stock_quantity == 0,
            Product.is_available == True
        ).all()

        out_of_stock = [{
            'id': p.id,
            'name': p.name,
            'image_url': p.image_url,
            'stock_quantity': 0,
            'category': p.category.name if p.category else None
        } for p in out_of_stock_products]

    return jsonify({
        'low_stock': low_stock,
        'out_of_stock': out_of_stock,
        'low_stock_count': len(low_stock),
        'out_of_stock_count': len(out_of_stock)
    })


# ============ Promo Code Management ============

@admin_bp.route('/admin/promos', methods=['GET'])
@admin_required
def get_admin_promos():
    """Get all promo codes"""
    promos = PromoCode.query.order_by(PromoCode.created_at.desc()).all()
    return jsonify({
        'promos': [promo.to_dict() for promo in promos]
    })


@admin_bp.route('/admin/promos', methods=['POST'])
@admin_required
def create_promo():
    """Create a new promo code"""
    data = request.json

    if not data.get('code'):
        return jsonify({'error': 'Promo code is required'}), 400

    # Check if code already exists
    existing = PromoCode.query.filter_by(code=data['code'].upper()).first()
    if existing:
        return jsonify({'error': 'Promo code already exists'}), 400

    expires_at = None
    if data.get('expires_at'):
        try:
            expires_at = datetime.strptime(data['expires_at'], '%Y-%m-%d')
        except ValueError:
            return jsonify({'error': 'Invalid date format'}), 400

    promo = PromoCode(
        code=data['code'].upper(),
        discount_type=data.get('discount_type', 'percentage'),
        discount_value=data.get('discount_value', 10),
        min_order_amount=data.get('min_order_amount', 0),
        max_uses=data.get('max_uses'),
        expires_at=expires_at,
        is_active=data.get('is_active', True)
    )

    db.session.add(promo)
    db.session.commit()

    return jsonify(promo.to_dict()), 201


@admin_bp.route('/admin/promos/<int:promo_id>', methods=['PUT'])
@admin_required
def update_promo(promo_id):
    """Update a promo code"""
    promo = PromoCode.query.get_or_404(promo_id)
    data = request.json

    if 'is_active' in data:
        promo.is_active = data['is_active']
    if 'discount_value' in data:
        promo.discount_value = data['discount_value']
    if 'min_order_amount' in data:
        promo.min_order_amount = data['min_order_amount']
    if 'max_uses' in data:
        promo.max_uses = data['max_uses']
    if 'expires_at' in data:
        if data['expires_at']:
            try:
                promo.expires_at = datetime.strptime(data['expires_at'], '%Y-%m-%d')
            except ValueError:
                pass
        else:
            promo.expires_at = None

    db.session.commit()

    return jsonify(promo.to_dict())


@admin_bp.route('/admin/promos/<int:promo_id>', methods=['DELETE'])
@admin_required
def delete_promo(promo_id):
    """Delete a promo code"""
    promo = PromoCode.query.get_or_404(promo_id)
    db.session.delete(promo)
    db.session.commit()

    return jsonify({'message': 'Promo code deleted successfully'})


# ============ Reviews Management ============

@admin_bp.route('/admin/reviews', methods=['GET'])
@admin_required
def get_admin_reviews():
    """Get all reviews"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    rating = request.args.get('rating', type=int)

    query = Review.query

    if rating:
        query = query.filter(Review.rating == rating)

    reviews = query.order_by(Review.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )

    return jsonify({
        'reviews': [review.to_dict() for review in reviews.items],
        'total': reviews.total,
        'pages': reviews.pages,
        'current_page': page
    })


@admin_bp.route('/admin/reviews', methods=['POST'])
@admin_required
def create_admin_review():
    """Create a curated review by admin"""
    data = request.json
    required_fields = ['product_id', 'rating', 'comment', 'reviewer_name']
    
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400

    review = Review(
        user_id=session.get('user_id'), # Link it to the admin who created it
        product_id=data['product_id'],
        rating=int(data['rating']),
        comment=data['comment'],
        reviewer_name=data['reviewer_name'],
        is_featured=data.get('is_featured', True)
    )
    
    db.session.add(review)
    db.session.commit()
    
    return jsonify(review.to_dict()), 201


@admin_bp.route('/admin/reviews/<int:review_id>', methods=['PUT'])
@admin_required
def update_admin_review(review_id):
    """Update a review (e.g. toggle is_featured)"""
    review = Review.query.get_or_404(review_id)
    data = request.json
    
    if 'is_featured' in data:
        review.is_featured = bool(data['is_featured'])
        
    db.session.commit()
    return jsonify(review.to_dict())


@admin_bp.route('/admin/reviews/<int:review_id>', methods=['DELETE'])
@admin_required
def delete_review(review_id):
    """Delete a review"""
    review = Review.query.get_or_404(review_id)
    db.session.delete(review)
    db.session.commit()

    return jsonify({'message': 'Review deleted successfully'})


# ============ Analytics Dashboard ============

@admin_bp.route('/admin/analytics/overview', methods=['GET'])
@admin_required
def get_analytics_overview():
    """Get comprehensive analytics overview"""
    # Time periods
    today = datetime.utcnow().date()
    yesterday = today - timedelta(days=1)
    week_ago = today - timedelta(days=7)
    month_ago = today - timedelta(days=30)
    last_month_start = (today.replace(day=1) - timedelta(days=1)).replace(day=1)
    last_month_end = today.replace(day=1) - timedelta(days=1)

    # Today's stats
    today_revenue = db.session.query(func.coalesce(func.sum(Order.total_amount), 0)).filter(
        func.date(Order.created_at) == today,
        Order.status != 'cancelled'
    ).scalar() or 0

    today_orders = Order.query.filter(
        func.date(Order.created_at) == today
    ).count()

    # Yesterday's stats (for comparison)
    yesterday_revenue = db.session.query(func.coalesce(func.sum(Order.total_amount), 0)).filter(
        func.date(Order.created_at) == yesterday,
        Order.status != 'cancelled'
    ).scalar() or 0

    yesterday_orders = Order.query.filter(
        func.date(Order.created_at) == yesterday
    ).count()

    # This week's stats
    week_revenue = db.session.query(func.coalesce(func.sum(Order.total_amount), 0)).filter(
        func.date(Order.created_at) >= week_ago,
        Order.status != 'cancelled'
    ).scalar() or 0

    week_orders = Order.query.filter(
        func.date(Order.created_at) >= week_ago
    ).count()

    # This month's stats
    month_revenue = db.session.query(func.coalesce(func.sum(Order.total_amount), 0)).filter(
        func.date(Order.created_at) >= month_ago,
        Order.status != 'cancelled'
    ).scalar() or 0

    month_orders = Order.query.filter(
        func.date(Order.created_at) >= month_ago
    ).count()

    # Total stats
    total_revenue = db.session.query(func.coalesce(func.sum(Order.total_amount), 0)).filter(
        Order.status != 'cancelled'
    ).scalar() or 0

    total_orders = Order.query.count()
    total_customers = User.query.filter_by(is_admin=False).count()
    total_products = Product.query.count()

    # Calculate growth rates safely
    revenue_growth = 0
    if yesterday_revenue and yesterday_revenue > 0:
        revenue_growth = ((float(today_revenue) - float(yesterday_revenue)) / float(yesterday_revenue) * 100)
    elif today_revenue > 0:
        revenue_growth = 100.0

    orders_growth = 0
    if yesterday_orders and yesterday_orders > 0:
        orders_growth = ((today_orders - yesterday_orders) / yesterday_orders * 100)
    elif today_orders > 0:
        orders_growth = 100.0

    return jsonify({
        'today': {
            'revenue': float(today_revenue),
            'orders': today_orders,
            'revenue_growth': round(revenue_growth, 1),
            'orders_growth': round(orders_growth, 1)
        },
        'week': {
            'revenue': float(week_revenue),
            'orders': week_orders,
            'avg_daily_revenue': round(float(week_revenue) / 7, 2),
            'avg_daily_orders': round(week_orders / 7, 1)
        },
        'month': {
            'revenue': float(month_revenue),
            'orders': month_orders,
            'avg_daily_revenue': round(float(month_revenue) / 30, 2),
            'avg_daily_orders': round(month_orders / 30, 1)
        },
        'total': {
            'revenue': float(total_revenue),
            'orders': total_orders,
            'customers': total_customers,
            'products': total_products
        }
    })


@admin_bp.route('/admin/analytics/sales-chart', methods=['GET'])
@admin_required
def get_sales_chart_data():
    """Get sales data for charts (last 30 days)"""
    days = request.args.get('days', 30, type=int)
    today = datetime.utcnow().date()

    chart_data = []
    for i in range(days - 1, -1, -1):
        date = today - timedelta(days=i)

        daily_revenue = db.session.query(func.coalesce(func.sum(Order.total_amount), 0)).filter(
            func.date(Order.created_at) == date,
            Order.status != 'cancelled'
        ).scalar() or 0

        daily_orders = Order.query.filter(
            func.date(Order.created_at) == date
        ).count()

        chart_data.append({
            'date': date.isoformat(),
            'day': date.strftime('%a'),
            'revenue': float(daily_revenue),
            'orders': daily_orders
        })

    return jsonify({
        'chart_data': chart_data,
        'period': f'Last {days} days'
    })


@admin_bp.route('/admin/analytics/top-products', methods=['GET'])
@admin_required
def get_top_products():
    """Get top selling products"""
    limit = request.args.get('limit', 10, type=int)
    days = request.args.get('days', 30, type=int)
    date_from = datetime.utcnow().date() - timedelta(days=days)

    # Get top products by quantity sold
    top_products = db.session.query(
        Product.id,
        Product.name,
        Product.price,
        Product.image_url,
        func.sum(OrderItem.quantity).label('total_sold'),
        func.sum(OrderItem.total_price).label('total_revenue')
    ).join(
        OrderItem, OrderItem.product_id == Product.id
    ).join(
        Order, Order.id == OrderItem.order_id
    ).filter(
        func.date(Order.created_at) >= date_from,
        Order.status != 'cancelled'
    ).group_by(
        Product.id
    ).order_by(
        desc('total_sold')
    ).limit(limit).all()

    return jsonify({
        'top_products': [{
            'id': p.id,
            'name': p.name,
            'price': float(p.price),
            'image_url': p.image_url,
            'total_sold': int(p.total_sold),
            'total_revenue': float(p.total_revenue)
        } for p in top_products],
        'period': f'Last {days} days'
    })


@admin_bp.route('/admin/analytics/sales-by-category', methods=['GET'])
@admin_required
def get_sales_by_category():
    """Get sales breakdown by category"""
    from src.models.user import Category

    days = request.args.get('days', 30, type=int)
    date_from = datetime.utcnow().date() - timedelta(days=days)

    # Get sales by category
    category_sales = db.session.query(
        Category.id,
        Category.name,
        func.coalesce(func.sum(OrderItem.quantity), 0).label('total_items'),
        func.coalesce(func.sum(OrderItem.total_price), 0).label('total_revenue')
    ).outerjoin(
        Product, Product.category_id == Category.id
    ).outerjoin(
        OrderItem, OrderItem.product_id == Product.id
    ).outerjoin(
        Order, Order.id == OrderItem.order_id
    ).filter(
        (Order.id == None) | (
            (func.date(Order.created_at) >= date_from) &
            (Order.status != 'cancelled')
        )
    ).group_by(
        Category.id
    ).all()

    return jsonify({
        'category_sales': [{
            'id': c.id,
            'name': c.name,
            'total_items': int(c.total_items),
            'total_revenue': float(c.total_revenue)
        } for c in category_sales],
        'period': f'Last {days} days'
    })


@admin_bp.route('/admin/analytics/order-status', methods=['GET'])
@admin_required
def get_order_status_breakdown():
    """Get order status breakdown"""
    status_counts = db.session.query(
        Order.status,
        func.count(Order.id).label('count')
    ).group_by(Order.status).all()

    return jsonify({
        'status_breakdown': [{
            'status': s.status,
            'count': s.count
        } for s in status_counts]
    })


@admin_bp.route('/admin/analytics/payment-methods', methods=['GET'])
@admin_required
def get_payment_methods_breakdown():
    """Get payment methods breakdown"""
    days = request.args.get('days', 30, type=int)
    date_from = datetime.utcnow().date() - timedelta(days=days)

    payment_stats = db.session.query(
        Order.payment_method,
        func.count(Order.id).label('count'),
        func.sum(Order.total_amount).label('total_amount')
    ).filter(
        func.date(Order.created_at) >= date_from,
        Order.status != 'cancelled'
    ).group_by(Order.payment_method).all()

    return jsonify({
        'payment_methods': [{
            'method': p.payment_method or 'Not specified',
            'count': p.count,
            'total_amount': float(p.total_amount) if p.total_amount else 0
        } for p in payment_stats],
        'period': f'Last {days} days'
    })


@admin_bp.route('/admin/analytics/recent-orders', methods=['GET'])
@admin_required
def get_recent_orders_analytics():
    """Get recent orders for quick view"""
    limit = request.args.get('limit', 10, type=int)

    recent_orders = Order.query.order_by(
        Order.created_at.desc()
    ).limit(limit).all()

    return jsonify({
        'recent_orders': [{
            'id': o.id,
            'order_number': o.order_number,
            'customer_name': o.guest_name if o.guest_name else (
                f"{o.user.first_name} {o.user.last_name}" if o.user else "Unknown"
            ),
            'total_amount': float(o.total_amount),
            'status': o.status,
            'payment_status': o.payment_status,
            'created_at': o.created_at.isoformat() if o.created_at else None
        } for o in recent_orders]
    })


@admin_bp.route('/admin/analytics/hourly-sales', methods=['GET'])
@admin_required
def get_hourly_sales():
    """Get sales breakdown by hour (for today)"""
    today = datetime.utcnow().date()

    hourly_data = []
    for hour in range(24):
        hour_start = datetime.combine(today, datetime.min.time()) + timedelta(hours=hour)
        hour_end = hour_start + timedelta(hours=1)

        hour_revenue = db.session.query(func.coalesce(func.sum(Order.total_amount), 0)).filter(
            Order.created_at >= hour_start,
            Order.created_at < hour_end,
            Order.status != 'cancelled'
        ).scalar() or 0

        hour_orders = Order.query.filter(
            Order.created_at >= hour_start,
            Order.created_at < hour_end
        ).count()

        hourly_data.append({
            'hour': hour,
            'label': f'{hour:02d}:00',
            'revenue': float(hour_revenue),
            'orders': hour_orders
        })

    return jsonify({
        'hourly_data': hourly_data,
        'date': today.isoformat()
    })


# ============ Secure File Upload ============

@admin_bp.route('/admin/upload', methods=['POST'])
@admin_required
def upload_file():
    """
    Secure file upload for product images.

    Security features:
    - Only allows image files (png, jpg, jpeg, webp, gif)
    - Validates file size (max 5MB)
    - Generates random filename to prevent overwrites
    - Validates file type by extension
    - Prevents path traversal attacks

    Returns:
        JSON with uploaded file URL or error
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    # Get upload folder from config or use default
    upload_folder = os.path.join(
        current_app.static_folder or 'frontend',
        'images',
        'uploads'
    )

    # Save file securely
    success, result = save_uploaded_file(
        file,
        upload_folder,
        allowed_extensions=ALLOWED_IMAGE_EXTENSIONS,
        max_size=MAX_IMAGE_SIZE
    )

    if not success:
        return jsonify(result), 400

    # Return the URL path for the uploaded file
    file_url = f"/images/uploads/{result['filename']}"

    return jsonify({
        'message': 'File uploaded successfully',
        'filename': result['filename'],
        'url': file_url,
        'original_name': result['original_name']
    }), 201


@admin_bp.route('/admin/upload/multiple', methods=['POST'])
@admin_required
def upload_multiple_files():
    """
    Upload multiple files at once.

    Returns:
        JSON with list of uploaded file URLs
    """
    if 'files' not in request.files:
        return jsonify({'error': 'No files provided'}), 400

    files = request.files.getlist('files')

    if not files:
        return jsonify({'error': 'No files selected'}), 400

    upload_folder = os.path.join(
        current_app.static_folder or 'frontend',
        'images',
        'uploads'
    )

    uploaded = []
    errors = []

    for file in files:
        if file.filename == '':
            continue

        success, result = save_uploaded_file(
            file,
            upload_folder,
            allowed_extensions=ALLOWED_IMAGE_EXTENSIONS,
            max_size=MAX_IMAGE_SIZE
        )

        if success:
            uploaded.append({
                'filename': result['filename'],
                'url': f"/images/uploads/{result['filename']}",
                'original_name': result['original_name']
            })
        else:
            errors.append({
                'filename': file.filename,
                'error': result.get('error', 'Upload failed')
            })

    return jsonify({
        'message': f'{len(uploaded)} file(s) uploaded successfully',
        'uploaded': uploaded,
        'errors': errors if errors else None
    }), 201 if uploaded else 400
