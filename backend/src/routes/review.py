from flask import Blueprint, jsonify, request, session
from src.models.user import Review, Product, User, db

review_bp = Blueprint('review', __name__)

def get_current_user_id():
    """Get current user ID from session or return None"""
    return session.get('user_id')

@review_bp.route('/products/<int:product_id>/reviews', methods=['GET'])
def get_product_reviews(product_id):
    """Get all reviews for a product"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    reviews = Review.query.filter_by(product_id=product_id)\
                         .order_by(Review.created_at.desc())\
                         .paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'reviews': [review.to_dict() for review in reviews.items],
        'total': reviews.total,
        'pages': reviews.pages,
        'current_page': page,
        'per_page': per_page
    })

@review_bp.route('/products/<int:product_id>/reviews', methods=['POST'])
def create_review(product_id):
    """Create a new review for a product"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({'error': 'Authentication required'}), 401
    
    data = request.json
    
    # Validate required fields
    if not data.get('rating') or not isinstance(data['rating'], int):
        return jsonify({'error': 'Rating is required and must be an integer'}), 400
    
    if data['rating'] < 1 or data['rating'] > 5:
        return jsonify({'error': 'Rating must be between 1 and 5'}), 400
    
    # Check if product exists
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    # Check if user already reviewed this product
    existing_review = Review.query.filter_by(
        user_id=user_id, 
        product_id=product_id
    ).first()
    
    if existing_review:
        return jsonify({'error': 'You have already reviewed this product'}), 400
    
    # Create review
    review = Review(
        user_id=user_id,
        product_id=product_id,
        rating=data['rating'],
        comment=data.get('comment', '')
    )
    
    db.session.add(review)
    db.session.commit()
    
    return jsonify(review.to_dict()), 201

@review_bp.route('/reviews/<int:review_id>', methods=['PUT'])
def update_review(review_id):
    """Update a review"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({'error': 'Authentication required'}), 401
    
    review = Review.query.filter_by(id=review_id, user_id=user_id).first_or_404()
    data = request.json
    
    # Validate rating if provided
    if 'rating' in data:
        if not isinstance(data['rating'], int) or data['rating'] < 1 or data['rating'] > 5:
            return jsonify({'error': 'Rating must be an integer between 1 and 5'}), 400
        review.rating = data['rating']
    
    if 'comment' in data:
        review.comment = data['comment']
    
    db.session.commit()
    
    return jsonify(review.to_dict())

@review_bp.route('/reviews/<int:review_id>', methods=['DELETE'])
def delete_review(review_id):
    """Delete a review"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({'error': 'Authentication required'}), 401
    
    review = Review.query.filter_by(id=review_id, user_id=user_id).first_or_404()
    
    db.session.delete(review)
    db.session.commit()
    
    return '', 204

@review_bp.route('/users/<int:user_id>/reviews', methods=['GET'])
def get_user_reviews(user_id):
    """Get all reviews by a user"""
    current_user_id = get_current_user_id()
    
    # Only allow users to see their own reviews or make this admin-only
    if current_user_id != user_id:
        return jsonify({'error': 'Access denied'}), 403
    
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    reviews = Review.query.filter_by(user_id=user_id)\
                         .order_by(Review.created_at.desc())\
                         .paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'reviews': [review.to_dict() for review in reviews.items],
        'total': reviews.total,
        'pages': reviews.pages,
        'current_page': page,
        'per_page': per_page
    })

@review_bp.route('/reviews/recent', methods=['GET'])
def get_recent_reviews():
    """Get recent featured reviews across all products"""
    limit = request.args.get('limit', 5, type=int)
    
    reviews = Review.query.filter_by(is_featured=True)\
                         .order_by(Review.created_at.desc())\
                         .limit(limit)\
                         .all()
    
    return jsonify([review.to_dict() for review in reviews])

