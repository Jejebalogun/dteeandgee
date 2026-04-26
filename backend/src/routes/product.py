from flask import Blueprint, jsonify, request
from src.models.user import Product, Category, db
from sqlalchemy import func, or_

product_bp = Blueprint('product', __name__)

@product_bp.route('/products', methods=['GET'])
def get_products():
    """Get all products with optional filtering and sorting"""
    # Filter parameters
    category_id = request.args.get('category_id', type=int)
    search = request.args.get('search', '').strip()
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    min_rating = request.args.get('min_rating', type=float)

    # Sorting parameters
    sort_by = request.args.get('sort_by', 'newest')  # newest, price_low, price_high, rating, name

    # Pagination
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 12, type=int)

    query = Product.query.filter(Product.is_available == True)

    # Category filter
    if category_id:
        query = query.filter(Product.category_id == category_id)

    # Search filter (case-insensitive, searches name and description)
    if search:
        search_term = f'%{search}%'
        query = query.filter(
            or_(
                Product.name.ilike(search_term),
                Product.description.ilike(search_term)
            )
        )

    # Price range filter
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    # Get all products for rating filter (need to calculate average rating)
    all_products = query.all()

    # Apply rating filter if specified
    if min_rating is not None:
        all_products = [p for p in all_products if p.get_average_rating() >= min_rating]

    # Apply sorting
    if sort_by == 'price_low':
        all_products.sort(key=lambda p: float(p.price))
    elif sort_by == 'price_high':
        all_products.sort(key=lambda p: float(p.price), reverse=True)
    elif sort_by == 'rating':
        all_products.sort(key=lambda p: p.get_average_rating(), reverse=True)
    elif sort_by == 'name':
        all_products.sort(key=lambda p: p.name.lower())
    else:  # newest (default)
        all_products.sort(key=lambda p: p.created_at, reverse=True)

    # Manual pagination
    total = len(all_products)
    start = (page - 1) * per_page
    end = start + per_page
    paginated_products = all_products[start:end]

    return jsonify({
        'products': [product.to_dict() for product in paginated_products],
        'total': total,
        'pages': (total + per_page - 1) // per_page,
        'current_page': page,
        'per_page': per_page,
        'filters': {
            'category_id': category_id,
            'search': search,
            'min_price': min_price,
            'max_price': max_price,
            'min_rating': min_rating,
            'sort_by': sort_by
        }
    })

@product_bp.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Get a single product by ID"""
    product = Product.query.get_or_404(product_id)
    return jsonify(product.to_dict())

@product_bp.route('/products', methods=['POST'])
def create_product():
    """Create a new product"""
    data = request.json
    
    product = Product(
        name=data['name'],
        description=data.get('description', ''),
        price=data['price'],
        image_url=data.get('image_url', ''),
        category_id=data['category_id'],
        stock_quantity=data.get('stock_quantity', 0)
    )
    
    db.session.add(product)
    db.session.commit()
    
    return jsonify(product.to_dict()), 201

@product_bp.route('/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    """Update a product"""
    product = Product.query.get_or_404(product_id)
    data = request.json
    
    product.name = data.get('name', product.name)
    product.description = data.get('description', product.description)
    product.price = data.get('price', product.price)
    product.image_url = data.get('image_url', product.image_url)
    product.category_id = data.get('category_id', product.category_id)
    product.is_available = data.get('is_available', product.is_available)
    product.stock_quantity = data.get('stock_quantity', product.stock_quantity)
    
    db.session.commit()
    
    return jsonify(product.to_dict())

@product_bp.route('/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    """Delete a product"""
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    
    return '', 204

@product_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all categories"""
    categories = Category.query.filter(Category.is_active == True).all()
    return jsonify({
        'categories': [category.to_dict() for category in categories]
    })

@product_bp.route('/categories/<int:category_id>', methods=['GET'])
def get_category(category_id):
    """Get a single category by ID"""
    category = Category.query.get_or_404(category_id)
    return jsonify(category.to_dict())

@product_bp.route('/categories', methods=['POST'])
def create_category():
    """Create a new category"""
    data = request.json
    
    category = Category(
        name=data['name'],
        description=data.get('description', ''),
        image_url=data.get('image_url', '')
    )
    
    db.session.add(category)
    db.session.commit()
    
    return jsonify(category.to_dict()), 201

@product_bp.route('/categories/<int:category_id>', methods=['PUT'])
def update_category(category_id):
    """Update a category"""
    category = Category.query.get_or_404(category_id)
    data = request.json
    
    category.name = data.get('name', category.name)
    category.description = data.get('description', category.description)
    category.image_url = data.get('image_url', category.image_url)
    category.is_active = data.get('is_active', category.is_active)
    
    db.session.commit()
    
    return jsonify(category.to_dict())

@product_bp.route('/categories/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    """Delete a category"""
    category = Category.query.get_or_404(category_id)
    db.session.delete(category)
    db.session.commit()
    
    return '', 204

@product_bp.route('/products/search', methods=['GET'])
def search_products():
    """Quick search endpoint for autocomplete/suggestions"""
    query = request.args.get('q', '').strip()
    limit = request.args.get('limit', 5, type=int)

    if not query or len(query) < 2:
        return jsonify({'products': [], 'query': query})

    search_term = f'%{query}%'
    products = Product.query.filter(
        Product.is_available == True,
        or_(
            Product.name.ilike(search_term),
            Product.description.ilike(search_term)
        )
    ).limit(limit).all()

    return jsonify({
        'products': [{'id': p.id, 'name': p.name, 'price': float(p.price), 'image_url': p.image_url} for p in products],
        'query': query
    })

@product_bp.route('/products/price-range', methods=['GET'])
def get_price_range():
    """Get min and max product prices for filter UI"""
    min_price = db.session.query(func.min(Product.price)).filter(Product.is_available == True).scalar()
    max_price = db.session.query(func.max(Product.price)).filter(Product.is_available == True).scalar()

    return jsonify({
        'min_price': float(min_price) if min_price else 0,
        'max_price': float(max_price) if max_price else 0
    })

@product_bp.route('/featured-products', methods=['GET'])
def get_featured_products():
    """Get featured products (latest or most popular)"""
    limit = request.args.get('limit', 8, type=int)

    # Get latest products as featured
    products = Product.query.filter(Product.is_available == True)\
                           .order_by(Product.created_at.desc())\
                           .limit(limit)\
                           .all()

    return jsonify({
        'products': [product.to_dict() for product in products]
    })

@product_bp.route('/products/<int:product_id>/related', methods=['GET'])
def get_related_products(product_id):
    """Get related products from same category"""
    limit = request.args.get('limit', 4, type=int)

    # Get the current product
    product = Product.query.get_or_404(product_id)

    # Get products from same category, excluding current product
    related_products = Product.query.filter(
        Product.category_id == product.category_id,
        Product.id != product_id,
        Product.is_available == True
    ).order_by(db.func.random()).limit(limit).all()

    return jsonify({
        'products': [p.to_dict() for p in related_products]
    })

