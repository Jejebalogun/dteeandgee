import os
from dotenv import load_dotenv
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_talisman import Talisman
from src.utils.limiter import limiter
from src.models.user import db
from src.routes.user import user_bp
from src.routes.auth import auth_bp
from src.routes.product import product_bp
from src.routes.cart import cart_bp
from src.routes.order import order_bp
from src.routes.review import review_bp
from src.routes.wishlist import wishlist_bp
from src.routes.promo import promo_bp
from src.routes.payment import payment_bp
from src.routes.admin import admin_bp
from src.routes.delivery import delivery_bp
from src.routes.support import support_bp

load_dotenv()
app = Flask(__name__, static_folder=os.path.abspath(os.path.join(os.path.dirname(__file__), '../../frontend')))
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'change-this-in-production')
app.config['DEBUG'] = False

# Security configurations
is_production = os.getenv('FLASK_ENV') == 'production'

# Session cookie security
app.config['SESSION_COOKIE_SECURE'] = is_production  # Only HTTPS in production
app.config['SESSION_COOKIE_HTTPONLY'] = True  # Prevent JavaScript access
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  # CSRF protection
app.config['PERMANENT_SESSION_LIFETIME'] = 86400  # 24 hours

# CSRF Protection
app.config['WTF_CSRF_ENABLED'] = True
app.config['WTF_CSRF_CHECK_DEFAULT'] = False  # We'll check manually for API routes
app.config['WTF_CSRF_TIME_LIMIT'] = 3600  # 1 hour token validity
csrf = CSRFProtect(app)

# Rate Limiting - Initialized via extension and applied to app
limiter.init_app(app)

# Content Security Policy for Flask-Talisman
csp = {
    'default-src': "'self'",
    'script-src': [
        "'self'",
        "'unsafe-inline'",  # Required for inline scripts
        "https://sdk.monnify.com",
        "https://cdnjs.cloudflare.com",
        "https://cdn.jsdelivr.net",
    ],
    'style-src': [
        "'self'",
        "'unsafe-inline'",  # Required for inline styles
        "https://fonts.googleapis.com",
        "https://cdnjs.cloudflare.com",
        "https://cdn.jsdelivr.net",
        "https://sdk.monnify.com",
    ],
    'font-src': [
        "'self'",
        "https://fonts.gstatic.com",
        "https://cdnjs.cloudflare.com",
    ],
    'img-src': [
        "'self'",
        "data:",
        "https:",
    ],
    'connect-src': [
        "'self'",
        "https://api.monnify.com",
        "https://sandbox.monnify.com",
    ],
    'frame-src': [
        "'self'",
        "https://sdk.monnify.com",
        "https://api.monnify.com",
        "https://sandbox.monnify.com",
    ],
}

# Enable Flask-Talisman only in production (forces HTTPS)
if is_production:
    Talisman(
        app,
        content_security_policy=csp,
        force_https=True,
        strict_transport_security=True,
        strict_transport_security_max_age=31536000,
        strict_transport_security_include_subdomains=True,
    )

# CORS configuration — covers local dev and any Vercel deployment URL
allowed_origins = [
    'http://localhost:3000',
    'http://localhost:5000',
    'http://127.0.0.1:5000',
    'http://127.0.0.1:3000',
]
production_domain = os.getenv('PRODUCTION_DOMAIN', '')
if production_domain:
    allowed_origins.append(production_domain)
    # Also allow *.vercel.app preview URLs
    allowed_origins.append('https://*.vercel.app')

CORS(app, supports_credentials=True, origins=allowed_origins, expose_headers=['X-CSRFToken'])

# Register all blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(product_bp, url_prefix='/api')
app.register_blueprint(cart_bp, url_prefix='/api')
app.register_blueprint(order_bp, url_prefix='/api')
app.register_blueprint(review_bp, url_prefix='/api')
app.register_blueprint(wishlist_bp, url_prefix='/api')
app.register_blueprint(promo_bp, url_prefix='/api')
app.register_blueprint(payment_bp, url_prefix='/api')
app.register_blueprint(admin_bp, url_prefix='/api')
app.register_blueprint(delivery_bp, url_prefix='/api')
app.register_blueprint(support_bp, url_prefix='/api')

# Exempt payment webhook from CSRF (external webhook requests don't have CSRF tokens)
csrf.exempt(payment_bp)

# Exempt cart and order routes from rate limiting (users adjusting cart should never be throttled)
limiter.exempt(cart_bp)
limiter.exempt(order_bp)

# Add security headers to all responses
@app.after_request
def set_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    if is_production:
        response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    # Add CSRF token to response header for JavaScript access
    if 'text/html' in response.content_type or 'application/json' in response.content_type:
        response.headers['X-CSRFToken'] = generate_csrf()
    return response

# Rate limit error handler
@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify({
        'error': 'Too many requests. Please slow down.',
        'message': str(e.description)
    }), 429

# Global error handler to ensure JSON responses for API
@app.errorhandler(Exception)
def handle_exception(e):
    # Pass through HTTP errors
    if hasattr(e, 'code'):
        return jsonify({'error': str(e)}), e.code
    # Handle non-HTTP exceptions
    import traceback
    return jsonify({
        'error': 'Internal Server Error',
        'message': str(e),
        'traceback': traceback.format_exc()
    }), 500

# CSRF token endpoint for JavaScript frontend
@app.route('/api/csrf-token', methods=['GET'])
def get_csrf_token():
    """Get CSRF token for frontend requests"""
    return jsonify({'csrf_token': generate_csrf()})

# Exempt payment webhook from CSRF (webhooks come from external services)
# This is done after blueprint registration below

# Database configuration - supports both SQLite (local) and PostgreSQL (production)
# Vercel Neon integration creates POSTGRES_URL automatically
database_url = os.getenv('DATABASE_URL') or os.getenv('POSTGRES_URL')

is_memory_sqlite = False
if database_url:
    database_url = database_url.strip(' "\'')
    # Handle Heroku/Render/Neon style postgres:// URLs for pg8000
    if database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql+pg8000://', 1)
    elif database_url.startswith('postgresql://'):
        database_url = database_url.replace('postgresql://', 'postgresql+pg8000://', 1)
        
    # Neon specifically requires sslmode=require
    if 'neon.tech' in database_url and 'sslmode' not in database_url:
        if '?' in database_url:
            database_url += '&sslmode=require'
        else:
            database_url += '?sslmode=require'
            
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    if database_url == 'sqlite:///:memory:':
        is_memory_sqlite = True
else:
    # Fallback to a persistent local SQLite file for local development
    # so data is not wiped on every restart.
    # If running on Vercel without a DB configured, we must use /tmp/ because
    # the main filesystem is read-only and will crash.
    if os.getenv('VERCEL'):
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/dteeandgee.db'
    else:
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///dteeandgee.db'
    is_memory_sqlite = False

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024  # 5MB max upload

if is_memory_sqlite:
    # In-memory SQLite needs a single shared connection so data persists across requests
    from sqlalchemy.pool import StaticPool
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        'poolclass': StaticPool,
        'connect_args': {'check_same_thread': False},
    }
else:
    # PostgreSQL (Neon / Render / Railway) — use connection pooling
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        'pool_recycle': 300,   # Recycle connections after 5 minutes
        'pool_pre_ping': True, # Test connections before using
        'pool_size': 5,        # Keep 5 connections in the pool
        'max_overflow': 10,    # Allow up to 10 overflow connections
        'connect_args': {
            'connect_timeout': 10 # 10 seconds timeout for serverless
        }
    }
db.init_app(app)

with app.app_context():
    # Seed database if empty — runs for both SQLite (local) and PostgreSQL (production)
    try:
        db.create_all()
        from src.models.user import Category, Product, User, Review
            
        # Check if tables exist and have data
        if Category.query.first() is None or Product.query.first() is None:
            print("[*] Seeding database with initial data...")
            # Seed categories
            categories_data = [
                {'name': 'Natural Drinks', 'description': 'Fresh and natural beverages made with premium ingredients', 'image_url': '/images/categories/drinks.jpg'},
                {'name': 'Smoothies', 'description': 'Creamy and nutritious smoothies packed with fruits and vegetables', 'image_url': '/images/categories/smoothies.jpg'},
                {'name': 'Parfaits', 'description': 'Layered parfaits with yogurt, fruits, and granola', 'image_url': '/images/categories/parfaits.jpg'},
                {'name': 'Zobo Drinks', 'description': 'Traditional Nigerian hibiscus drinks with natural spices', 'image_url': '/images/categories/zobo.jpg'},
                {'name': 'Yogurt', 'description': 'Creamy and healthy yogurt in various flavors', 'image_url': '/images/categories/yogurt.jpg'},
                {'name': 'Chin Chin', 'description': 'Crispy and sweet Nigerian snacks perfect for any time', 'image_url': '/images/categories/chinchin.jpg'},
                {'name': 'Small Chops', 'description': 'Assorted bite-sized Nigerian appetizers and snacks', 'image_url': '/images/categories/smallchops.jpg'},
            ]
            categories = {}
            for idx, cat_data in enumerate(categories_data):
                category = Category(**cat_data)
                db.session.add(category)
                db.session.flush()
                categories[idx + 1] = category.id
            db.session.commit()
                
            # Seed products
            products_data = [
                    # Natural Drinks (Category 1)
                    {'name': 'Fresh Lemon Juice', 'description': 'Freshly squeezed lemon juice with no added sugar', 'price': 500.00, 'category_id': categories[1], 'image_url': '/images/products/lemon-juice.jpg', 'stock_quantity': 50},
                    {'name': 'Orange Mango Blend', 'description': 'Perfect combination of fresh orange and mango', 'price': 600.00, 'category_id': categories[1], 'image_url': '/images/products/orange-mango.jpg', 'stock_quantity': 45},
                    {'name': 'Pineapple Express', 'description': 'Pure pineapple juice with tropical flavor', 'price': 550.00, 'category_id': categories[1], 'image_url': '/images/products/pineapple.jpg', 'stock_quantity': 40},
                    {'name': 'Watermelon Cooler', 'description': 'Refreshing watermelon juice perfect for hot days', 'price': 500.00, 'category_id': categories[1], 'image_url': '/images/products/watermelon.jpg', 'stock_quantity': 55},
                    # Smoothies (Category 2)
                    {'name': 'Berry Blast Smoothie', 'description': 'Mixed berries with yogurt and honey', 'price': 800.00, 'category_id': categories[2], 'image_url': '/images/products/berry-smoothie.jpg', 'stock_quantity': 30},
                    {'name': 'Tropical Paradise', 'description': 'Mango, pineapple, and coconut milk blend', 'price': 850.00, 'category_id': categories[2], 'image_url': '/images/products/tropical-smoothie.jpg', 'stock_quantity': 28},
                    {'name': 'Green Energy', 'description': 'Spinach, apple, and ginger for a healthy boost', 'price': 750.00, 'category_id': categories[2], 'image_url': '/images/products/green-smoothie.jpg', 'stock_quantity': 25},
                    {'name': 'Chocolate Peanut Butter', 'description': 'Rich chocolate with creamy peanut butter', 'price': 900.00, 'category_id': categories[2], 'image_url': '/images/products/choco-pb-smoothie.jpg', 'stock_quantity': 20},
                    # Parfaits (Category 3)
                    {'name': 'Fruity Yogurt Parfait', 'description': 'Layers of yogurt, granola, and fresh fruits', 'price': 1000.00, 'category_id': categories[3], 'image_url': '/images/products/fruit-parfait.jpg', 'stock_quantity': 15},
                    {'name': 'Honey Granola Bowl', 'description': 'Creamy yogurt with honey and crunchy granola', 'price': 950.00, 'category_id': categories[3], 'image_url': '/images/products/honey-parfait.jpg', 'stock_quantity': 18},
                    {'name': 'Strawberry Cheesecake', 'description': 'Parfait with strawberry sauce and cheesecake layer', 'price': 1100.00, 'category_id': categories[3], 'image_url': '/images/products/strawberry-cheesecake.jpg', 'stock_quantity': 10},
                    # Zobo Drinks (Category 4)
                    {'name': 'Classic Zobo', 'description': 'Traditional hibiscus drink with ginger, cucumber, and pineapple', 'price': 600.00, 'category_id': categories[4], 'image_url': '/images/products/classic-zobo.jpg', 'stock_quantity': 60},
                    {'name': 'Spicy Zobo', 'description': 'Zobo drink with extra ginger and pepper for a kick', 'price': 650.00, 'category_id': categories[4], 'image_url': '/images/products/spicy-zobo.jpg', 'stock_quantity': 45},
                    {'name': 'Fruity Zobo Mix', 'description': 'Zobo infused with assorted tropical fruits', 'price': 700.00, 'category_id': categories[4], 'image_url': '/images/products/fruity-zobo.jpg', 'stock_quantity': 40},
                    {'name': 'Honey Lemon Zobo', 'description': 'Smooth zobo with honey and fresh lemon', 'price': 680.00, 'category_id': categories[4], 'image_url': '/images/products/honey-lemon-zobo.jpg', 'stock_quantity': 50},
                    # Yogurt (Category 5)
                    {'name': 'Strawberry Yogurt', 'description': 'Creamy yogurt with fresh strawberry pieces', 'price': 500.00, 'category_id': categories[5], 'image_url': '/images/products/strawberry-yogurt.jpg', 'stock_quantity': 35},
                    {'name': 'Vanilla Greek Yogurt', 'description': 'Rich and thick Greek yogurt with vanilla flavor', 'price': 600.00, 'category_id': categories[5], 'image_url': '/images/products/vanilla-greek-yogurt.jpg', 'stock_quantity': 40},
                    {'name': 'Blueberry Yogurt', 'description': 'Antioxidant-rich blueberry yogurt', 'price': 520.00, 'category_id': categories[5], 'image_url': '/images/products/blueberry-yogurt.jpg', 'stock_quantity': 32},
                    {'name': 'Mango Yogurt', 'description': 'Tropical mango flavored creamy yogurt', 'price': 550.00, 'category_id': categories[5], 'image_url': '/images/products/mango-yogurt.jpg', 'stock_quantity': 30},
                    # Chin Chin (Category 6)
                    {'name': 'Original Chin Chin', 'description': 'Classic crispy chin chin with the perfect sweetness', 'price': 400.00, 'category_id': categories[6], 'image_url': '/images/products/original-chinchin.jpg', 'stock_quantity': 100},
                    {'name': 'Coconut Chin Chin', 'description': 'Chin chin with coconut flakes for extra flavor', 'price': 450.00, 'category_id': categories[6], 'image_url': '/images/products/coconut-chinchin.jpg', 'stock_quantity': 80},
                    {'name': 'Honey Chin Chin', 'description': 'Sweetened chin chin with pure honey', 'price': 480.00, 'category_id': categories[6], 'image_url': '/images/products/honey-chinchin.jpg', 'stock_quantity': 75},
                    {'name': 'Spiced Chin Chin', 'description': 'Chin chin with aromatic spices', 'price': 420.00, 'category_id': categories[6], 'image_url': '/images/products/spiced-chinchin.jpg', 'stock_quantity': 90},
                    # Small Chops (Category 7)
                    {'name': 'Mixed Small Chops', 'description': 'Assorted small chops including samosa, spring rolls, and meat pie', 'price': 2000.00, 'category_id': categories[7], 'image_url': '/images/products/mixed-smallchops.jpg', 'stock_quantity': 20},
                    {'name': 'Vegetarian Small Chops', 'description': 'Plant-based small chops with vegetables and legumes', 'price': 1800.00, 'category_id': categories[7], 'image_url': '/images/products/vegetarian-smallchops.jpg', 'stock_quantity': 15},
                    {'name': 'Meat Pie Combo', 'description': 'Golden baked meat pies with savory filling', 'price': 1500.00, 'category_id': categories[7], 'image_url': '/images/products/meat-pie.jpg', 'stock_quantity': 25},
                    {'name': 'Spring Rolls Collection', 'description': 'Crispy spring rolls with vegetable and meat options', 'price': 1400.00, 'category_id': categories[7], 'image_url': '/images/products/spring-rolls.jpg', 'stock_quantity': 30},
                    {'name': 'Samosa Selection', 'description': 'Triangular pastries filled with spiced potatoes and peas', 'price': 1200.00, 'category_id': categories[7], 'image_url': '/images/products/samosa.jpg', 'stock_quantity': 35},
            ]

            for prod_data in products_data:
                product = Product(**prod_data)
                db.session.add(product)
            db.session.commit()

        # Create admin user if missing
        if User.query.filter_by(username='admin').first() is None:
            admin = User(username='admin', email='admin@dteegee.com', first_name='Admin', last_name='User', phone='+234-800-000-0001', is_admin=True)
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()

        # Create testuser if missing
        if User.query.filter_by(username='testuser').first() is None:
            testuser = User(username='testuser', email='test@dteegee.com', first_name='Test', last_name='User', phone='+234-800-123-4567')
            testuser.set_password('password123')
            db.session.add(testuser)
            db.session.commit()
            
        # Create sample reviews for homepage carousel
        if Review.query.first() is None:
            testuser = User.query.filter_by(username='testuser').first()
            if testuser:
                review_data = [
                    {'user_id': testuser.id, 'product_id': 1, 'rating': 5, 'comment': 'The smoothies are absolutely delicious and made with fresh ingredients. Delivery was fast and the service is excellent!'},
                    {'user_id': testuser.id, 'product_id': 2, 'rating': 5, 'comment': 'Love the zobo drinks! Authentic taste, exactly how my grandmother makes it. Highly recommended!'},
                    {'user_id': testuser.id, 'product_id': 3, 'rating': 5, 'comment': 'The parfaits are so creamy and the yogurt is premium quality. Worth every naira!'},
                    {'user_id': testuser.id, 'product_id': 4, 'rating': 4, 'comment': 'Finally found a place that makes authentic chin chin just like my mom! Amazing quality and taste.'},
                    {'user_id': testuser.id, 'product_id': 5, 'rating': 5, 'comment': 'The small chops are perfect for gatherings. Fresh, tasty, and the presentation is lovely!'},
                    {'user_id': testuser.id, 'product_id': 6, 'rating': 5, 'comment': 'Great natural drinks. No artificial flavors, pure taste. Definitely ordering again!'},
                ]
                for rev_data in review_data:
                    review = Review(**rev_data)
                    db.session.add(review)
                db.session.commit()
                print(f"[+] Sample reviews: {len(review_data)}")

        print("[+] Database ready!")
        print("[+] Admin login: username=admin, password=admin123")
        print("[+] Test login:  username=testuser, password=password123")
    except Exception as e:
        print(f"[!] Error during database setup: {e}")
        import traceback
        traceback.print_exc()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
@limiter.exempt
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
