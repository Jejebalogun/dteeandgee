#!/usr/bin/env python3
"""
Data seeding script for D'Tee & Gee Kitchen
Populates the database with sample categories, products, and a test user
"""

import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from src.models.user import db, Category, Product, User, PromoCode, Review, DeliveryZone
from datetime import datetime, timedelta
from src.main import app

def seed_categories():
    """Create product categories"""
    categories = [
        {
            'name': 'Natural Drinks',
            'description': 'Fresh and natural beverages made with premium ingredients',
            'image_url': '/images/categories/drinks.jpg'
        },
        {
            'name': 'Smoothies',
            'description': 'Creamy and nutritious smoothies packed with fruits and vegetables',
            'image_url': '/images/categories/smoothies.jpg'
        },
        {
            'name': 'Parfaits',
            'description': 'Layered parfaits with yogurt, fruits, and granola',
            'image_url': '/images/categories/parfaits.jpg'
        },
        {
            'name': 'Zobo Drinks',
            'description': 'Traditional Nigerian hibiscus drinks with natural spices',
            'image_url': '/images/categories/zobo.jpg'
        },
        {
            'name': 'Yogurt',
            'description': 'Creamy and healthy yogurt in various flavors',
            'image_url': '/images/categories/yogurt.jpg'
        },
        {
            'name': 'Chin Chin',
            'description': 'Crispy and sweet Nigerian snacks perfect for any time',
            'image_url': '/images/categories/chinchin.jpg'
        },
        {
            'name': 'Small Chops',
            'description': 'Assorted bite-sized Nigerian appetizers and snacks',
            'image_url': '/images/categories/smallchops.jpg'
        }
    ]
    
    for cat_data in categories:
        category = Category(**cat_data)
        db.session.add(category)
    
    db.session.commit()
    print("[+] Categories created successfully")

def seed_products():
    """Create sample products"""
    products = [
        # Natural Drinks (Category 1)
        {
            'name': 'Fresh Orange Juice',
            'description': 'Freshly squeezed orange juice with no added sugar or preservatives',
            'price': 800.00,
            'category_id': 1,
            'image_url': '/images/products/orange-juice.jpg',
            'stock_quantity': 50
        },
        {
            'name': 'Pineapple Ginger Drink',
            'description': 'Refreshing pineapple juice infused with fresh ginger',
            'price': 900.00,
            'category_id': 1,
            'image_url': '/images/products/pineapple-ginger.jpg',
            'stock_quantity': 30
        },
        {
            'name': 'Watermelon Mint Cooler',
            'description': 'Cool watermelon juice with fresh mint leaves',
            'price': 750.00,
            'category_id': 1,
            'image_url': '/images/products/watermelon-mint.jpg',
            'stock_quantity': 40
        },
        {
            'name': 'Carrot Papaya Juice',
            'description': 'Nutrient-rich blend of fresh carrots and ripe papaya',
            'price': 850.00,
            'category_id': 1,
            'image_url': '/images/products/carrot-papaya.jpg',
            'stock_quantity': 35
        },
        {
            'name': 'Lime & Lemon Detox',
            'description': 'Refreshing citrus blend with natural detoxifying properties',
            'price': 700.00,
            'category_id': 1,
            'image_url': '/images/products/lime-lemon-detox.jpg',
            'stock_quantity': 45
        },
        {
            'name': 'Cucumber Mint Water',
            'description': 'Light and hydrating cucumber juice with fresh mint',
            'price': 600.00,
            'category_id': 1,
            'image_url': '/images/products/cucumber-mint.jpg',
            'stock_quantity': 55
        },
        
        # Smoothies (Category 2)
        {
            'name': 'Mango Green Smoothie',
            'description': 'Tropical mango blended with spinach and banana for a healthy boost',
            'price': 1200.00,
            'category_id': 2,
            'image_url': '/images/products/mango-green-smoothie.jpg',
            'stock_quantity': 25
        },
        {
            'name': 'Berry Protein Smoothie',
            'description': 'Mixed berries with protein powder and Greek yogurt',
            'price': 1500.00,
            'category_id': 2,
            'image_url': '/images/products/berry-protein-smoothie.jpg',
            'stock_quantity': 20
        },
        {
            'name': 'Avocado Banana Smoothie',
            'description': 'Creamy avocado and banana smoothie with honey',
            'price': 1300.00,
            'category_id': 2,
            'image_url': '/images/products/avocado-banana-smoothie.jpg',
            'stock_quantity': 30
        },
        {
            'name': 'Strawberry Bliss Smoothie',
            'description': 'Sweet strawberries blended with yogurt and milk',
            'price': 1100.00,
            'category_id': 2,
            'image_url': '/images/products/strawberry-bliss.jpg',
            'stock_quantity': 28
        },
        {
            'name': 'Chocolate Almond Smoothie',
            'description': 'Rich chocolate with almond butter and banana',
            'price': 1350.00,
            'category_id': 2,
            'image_url': '/images/products/chocolate-almond.jpg',
            'stock_quantity': 22
        },
        {
            'name': 'Tropical Paradise Smoothie',
            'description': 'Pineapple, mango, and coconut in a refreshing blend',
            'price': 1250.00,
            'category_id': 2,
            'image_url': '/images/products/tropical-paradise.jpg',
            'stock_quantity': 25
        },
        
        # Parfaits (Category 3)
        {
            'name': 'Classic Berry Parfait',
            'description': 'Layers of Greek yogurt, mixed berries, and granola',
            'price': 1000.00,
            'category_id': 3,
            'image_url': '/images/products/berry-parfait.jpg',
            'stock_quantity': 15
        },
        {
            'name': 'Tropical Fruit Parfait',
            'description': 'Mango, pineapple, and coconut yogurt parfait',
            'price': 1100.00,
            'category_id': 3,
            'image_url': '/images/products/tropical-parfait.jpg',
            'stock_quantity': 12
        },
        {
            'name': 'Honey Granola Parfait',
            'description': 'Creamy yogurt with honey drizzle and crunchy granola',
            'price': 950.00,
            'category_id': 3,
            'image_url': '/images/products/honey-granola-parfait.jpg',
            'stock_quantity': 18
        },
        {
            'name': 'Chocolate Banana Parfait',
            'description': 'Layered chocolate yogurt with banana and nuts',
            'price': 1150.00,
            'category_id': 3,
            'image_url': '/images/products/chocolate-banana-parfait.jpg',
            'stock_quantity': 14
        },
        {
            'name': 'Strawberry Cheesecake Parfait',
            'description': 'Creamy cheesecake parfait with fresh strawberries',
            'price': 1200.00,
            'category_id': 3,
            'image_url': '/images/products/strawberry-cheesecake.jpg',
            'stock_quantity': 10
        },
        
        # Zobo Drinks (Category 4)
        {
            'name': 'Classic Zobo',
            'description': 'Traditional hibiscus drink with ginger, cucumber, and pineapple',
            'price': 600.00,
            'category_id': 4,
            'image_url': '/images/products/classic-zobo.jpg',
            'stock_quantity': 60
        },
        {
            'name': 'Spicy Zobo',
            'description': 'Zobo drink with extra ginger and pepper for a kick',
            'price': 650.00,
            'category_id': 4,
            'image_url': '/images/products/spicy-zobo.jpg',
            'stock_quantity': 45
        },
        {
            'name': 'Fruity Zobo Mix',
            'description': 'Zobo infused with assorted tropical fruits',
            'price': 700.00,
            'category_id': 4,
            'image_url': '/images/products/fruity-zobo.jpg',
            'stock_quantity': 40
        },
        {
            'name': 'Honey Lemon Zobo',
            'description': 'Smooth zobo with honey and fresh lemon',
            'price': 680.00,
            'category_id': 4,
            'image_url': '/images/products/honey-lemon-zobo.jpg',
            'stock_quantity': 50
        },
        
        # Yogurt (Category 5)
        {
            'name': 'Strawberry Yogurt',
            'description': 'Creamy yogurt with fresh strawberry pieces',
            'price': 500.00,
            'category_id': 5,
            'image_url': '/images/products/strawberry-yogurt.jpg',
            'stock_quantity': 35
        },
        {
            'name': 'Vanilla Greek Yogurt',
            'description': 'Rich and thick Greek yogurt with vanilla flavor',
            'price': 600.00,
            'category_id': 5,
            'image_url': '/images/products/vanilla-greek-yogurt.jpg',
            'stock_quantity': 40
        },
        {
            'name': 'Blueberry Yogurt',
            'description': 'Antioxidant-rich blueberry yogurt',
            'price': 520.00,
            'category_id': 5,
            'image_url': '/images/products/blueberry-yogurt.jpg',
            'stock_quantity': 32
        },
        {
            'name': 'Mango Yogurt',
            'description': 'Tropical mango flavored creamy yogurt',
            'price': 550.00,
            'category_id': 5,
            'image_url': '/images/products/mango-yogurt.jpg',
            'stock_quantity': 30
        },
        {
            'name': 'Honey Almond Yogurt',
            'description': 'Natural yogurt with honey and roasted almonds',
            'price': 650.00,
            'category_id': 5,
            'image_url': '/images/products/honey-almond-yogurt.jpg',
            'stock_quantity': 28
        },
        {
            'name': 'Plain Natural Yogurt',
            'description': 'Pure, unsweetened natural yogurt',
            'price': 450.00,
            'category_id': 5,
            'image_url': '/images/products/plain-yogurt.jpg',
            'stock_quantity': 50
        },
        
        # Chin Chin (Category 6)
        {
            'name': 'Original Chin Chin',
            'description': 'Classic crispy chin chin with the perfect sweetness',
            'price': 400.00,
            'category_id': 6,
            'image_url': '/images/products/original-chinchin.jpg',
            'stock_quantity': 100
        },
        {
            'name': 'Coconut Chin Chin',
            'description': 'Chin chin with coconut flakes for extra flavor',
            'price': 450.00,
            'category_id': 6,
            'image_url': '/images/products/coconut-chinchin.jpg',
            'stock_quantity': 80
        },
        {
            'name': 'Honey Chin Chin',
            'description': 'Sweetened chin chin with pure honey',
            'price': 480.00,
            'category_id': 6,
            'image_url': '/images/products/honey-chinchin.jpg',
            'stock_quantity': 75
        },
        {
            'name': 'Spiced Chin Chin',
            'description': 'Chin chin with aromatic spices',
            'price': 420.00,
            'category_id': 6,
            'image_url': '/images/products/spiced-chinchin.jpg',
            'stock_quantity': 90
        },
        {
            'name': 'Almond Chin Chin',
            'description': 'Crispy chin chin studded with roasted almonds',
            'price': 520.00,
            'category_id': 6,
            'image_url': '/images/products/almond-chinchin.jpg',
            'stock_quantity': 60
        },
        
        # Small Chops (Category 7)
        {
            'name': 'Mixed Small Chops',
            'description': 'Assorted small chops including samosa, spring rolls, and meat pie',
            'price': 2000.00,
            'category_id': 7,
            'image_url': '/images/products/mixed-smallchops.jpg',
            'stock_quantity': 20
        },
        {
            'name': 'Vegetarian Small Chops',
            'description': 'Plant-based small chops with vegetables and legumes',
            'price': 1800.00,
            'category_id': 7,
            'image_url': '/images/products/vegetarian-smallchops.jpg',
            'stock_quantity': 15
        },
        {
            'name': 'Meat Pie Combo',
            'description': 'Golden baked meat pies with savory filling',
            'price': 1500.00,
            'category_id': 7,
            'image_url': '/images/products/meat-pie.jpg',
            'stock_quantity': 25
        },
        {
            'name': 'Spring Rolls Collection',
            'description': 'Crispy spring rolls with vegetable and meat options',
            'price': 1400.00,
            'category_id': 7,
            'image_url': '/images/products/spring-rolls.jpg',
            'stock_quantity': 30
        },
        {
            'name': 'Samosa Selection',
            'description': 'Triangular pastries filled with spiced potatoes and peas',
            'price': 1200.00,
            'category_id': 7,
            'image_url': '/images/products/samosa.jpg',
            'stock_quantity': 35
        },
        {
            'name': 'Chicken Puff Pastry',
            'description': 'Buttery puff pastry with chicken filling',
            'price': 1600.00,
            'category_id': 7,
            'image_url': '/images/products/chicken-puff.jpg',
            'stock_quantity': 18
        }
    ]
    
    for prod_data in products:
        product = Product(**prod_data)
        db.session.add(product)
    
    db.session.commit()
    print("[+] Products created successfully")

def seed_test_user():
    """Create a test user for development"""
    user = User(
        username='testuser',
        email='test@dteegee.com',
        first_name='Test',
        last_name='User',
        phone='+234-800-123-4567'
    )
    user.set_password('password123')

    db.session.add(user)
    db.session.commit()
    print("[+] Test user created (username: testuser, password: password123)")

def seed_admin_user():
    """Create an admin user for dashboard access"""
    # Check if admin already exists
    existing_admin = User.query.filter_by(username='admin').first()
    if existing_admin:
        existing_admin.is_admin = True
        db.session.commit()
        print("[!] Admin user already exists, updated is_admin flag")
        return

    admin = User(
        username='admin',
        email='admin@dteegee.com',
        first_name='Admin',
        last_name='User',
        phone='+234-800-000-0001',
        is_admin=True
    )
    admin.set_password('admin123')

    db.session.add(admin)
    db.session.commit()
    print("[+] Admin user created (username: admin, password: admin123)")

def seed_promo_codes():
    """Create sample promo codes"""
    promo_codes = [
        {
            'code': 'WELCOME10',
            'discount_type': 'percent',
            'discount_value': 10,
            'min_order_amount': 1000,
            'max_uses': 100,
            'expires_at': datetime.utcnow() + timedelta(days=365)
        },
        {
            'code': 'SAVE500',
            'discount_type': 'fixed',
            'discount_value': 500,
            'min_order_amount': 3000,
            'max_uses': 50,
            'expires_at': datetime.utcnow() + timedelta(days=90)
        },
        {
            'code': 'FREESHIP',
            'discount_type': 'fixed',
            'discount_value': 200,
            'min_order_amount': 2000,
            'max_uses': None,  # Unlimited
            'expires_at': None  # No expiry
        },
        {
            'code': 'VIP20',
            'discount_type': 'percent',
            'discount_value': 20,
            'min_order_amount': 5000,
            'max_uses': 25,
            'expires_at': datetime.utcnow() + timedelta(days=30)
        }
    ]

    for promo_data in promo_codes:
        promo = PromoCode(**promo_data)
        db.session.add(promo)

    db.session.commit()
    print("[+] Promo codes created successfully")
    print("    Available codes: WELCOME10 (10% off), SAVE500 (N500 off), FREESHIP (N200 off), VIP20 (20% off)")


def seed_delivery_zones():
    """Create delivery zones with fees"""
    zones = [
        {
            'name': 'Zone A - Central Lagos',
            'areas': 'Victoria Island, Ikoyi, Lekki Phase 1, Lagos Island, Oniru',
            'delivery_fee': 500,
            'min_order_amount': 2000,
            'estimated_time': '20-30 mins'
        },
        {
            'name': 'Zone B - Lagos Mainland',
            'areas': 'Surulere, Yaba, Ikeja, Maryland, Ogba, Gbagada, Anthony',
            'delivery_fee': 800,
            'min_order_amount': 3000,
            'estimated_time': '30-45 mins'
        },
        {
            'name': 'Zone C - Greater Lekki',
            'areas': 'Lekki Phase 2, Ajah, Sangotedo, VGC, Chevron, Ikota',
            'delivery_fee': 1000,
            'min_order_amount': 3500,
            'estimated_time': '40-60 mins'
        },
        {
            'name': 'Zone D - Extended Areas',
            'areas': 'Festac, Apapa, Ikorodu, Berger, Ojodu, Magodo, Omole',
            'delivery_fee': 1500,
            'min_order_amount': 5000,
            'estimated_time': '45-75 mins'
        },
        {
            'name': 'Free Delivery Zone',
            'areas': 'D\'Tee & Gee Main Office, Pickup Point',
            'delivery_fee': 0,
            'min_order_amount': 0,
            'estimated_time': '15-20 mins'
        }
    ]

    for zone_data in zones:
        zone = DeliveryZone(**zone_data)
        db.session.add(zone)

    db.session.commit()
    print("[+] Delivery zones created successfully")
    print("    Zones: Zone A (N500), Zone B (N800), Zone C (N1000), Zone D (N1500), Free Pickup")


def seed_reviews():
    """Create sample reviews for products with varied reviewers"""
    from werkzeug.security import generate_password_hash

    products = Product.query.limit(10).all()
    if not products:
        print("[!] No products found, skipping reviews")
        return

    # Create sample reviewer users with different names
    reviewers_data = [
        {'username': 'adaeze_n', 'email': 'adaeze@example.com', 'first_name': 'Adaeze', 'last_name': 'Nwosu'},
        {'username': 'chidi_o', 'email': 'chidi@example.com', 'first_name': 'Chidi', 'last_name': 'Okafor'},
        {'username': 'blessing_a', 'email': 'blessing@example.com', 'first_name': 'Blessing', 'last_name': 'Adeyemi'},
        {'username': 'emeka_u', 'email': 'emeka@example.com', 'first_name': 'Emeka', 'last_name': 'Uche'},
        {'username': 'funke_b', 'email': 'funke@example.com', 'first_name': 'Funke', 'last_name': 'Balogun'},
        {'username': 'tunde_j', 'email': 'tunde@example.com', 'first_name': 'Tunde', 'last_name': 'Johnson'},
        {'username': 'ngozi_e', 'email': 'ngozi@example.com', 'first_name': 'Ngozi', 'last_name': 'Eze'},
        {'username': 'segun_o', 'email': 'segun@example.com', 'first_name': 'Segun', 'last_name': 'Oladipo'},
    ]

    reviewers = []
    for data in reviewers_data:
        user = User.query.filter_by(email=data['email']).first()
        if not user:
            user = User(
                username=data['username'],
                email=data['email'],
                first_name=data['first_name'],
                last_name=data['last_name'],
                password_hash=generate_password_hash('reviewer123')
            )
            db.session.add(user)
            db.session.flush()
        reviewers.append(user)

    reviews_data = [
        {
            'reviewer_index': 0,
            'product_index': 0,
            'rating': 5,
            'comment': 'Absolutely delicious! The flavors are perfectly balanced and it tastes so fresh. Will definitely order again!'
        },
        {
            'reviewer_index': 1,
            'product_index': 1,
            'rating': 5,
            'comment': 'Best smoothie I have ever had! So creamy and refreshing. The quality of ingredients really shows.'
        },
        {
            'reviewer_index': 2,
            'product_index': 2,
            'rating': 4,
            'comment': 'Really enjoyed this! Great taste and perfect portion size. Delivery was also very fast.'
        },
        {
            'reviewer_index': 3,
            'product_index': 3,
            'rating': 5,
            'comment': 'This has become my go-to treat! The texture is amazing and it is not too sweet. Highly recommend!'
        },
        {
            'reviewer_index': 4,
            'product_index': 4,
            'rating': 4,
            'comment': 'Very good quality and tastes homemade. Love supporting local businesses like this one!'
        },
        {
            'reviewer_index': 5,
            'product_index': 5,
            'rating': 5,
            'comment': 'Ordered for a party and everyone loved it! Fresh, delicious, and beautifully packaged.'
        },
        {
            'reviewer_index': 6,
            'product_index': 0,
            'rating': 4,
            'comment': 'Great product! The natural ingredients make such a difference. Will be ordering more.'
        },
        {
            'reviewer_index': 7,
            'product_index': 1,
            'rating': 5,
            'comment': 'My kids absolutely love this! Finally found something healthy that they actually enjoy.'
        }
    ]

    for review_data in reviews_data:
        product_index = review_data['product_index']
        reviewer_index = review_data['reviewer_index']
        if product_index < len(products) and reviewer_index < len(reviewers):
            review = Review(
                user_id=reviewers[reviewer_index].id,
                product_id=products[product_index].id,
                rating=review_data['rating'],
                comment=review_data['comment']
            )
            db.session.add(review)

    db.session.commit()
    print("[+] Sample reviews with varied reviewers created successfully")


def main():
    """Main seeding function"""
    with app.app_context():
        print("[*] Starting database seeding...")

        # Create all tables
        db.create_all()
        print("[+] Database tables created")

        # Check if data already exists
        if Category.query.first():
            print("[!] Database already contains data. Skipping seeding.")
            return

        # Seed data
        seed_categories()
        seed_products()
        seed_test_user()
        seed_admin_user()
        seed_promo_codes()
        seed_delivery_zones()
        seed_reviews()

        print("[+] Database seeding completed successfully!")
        print("\nYou can now:")
        print("1. Start the Flask server: python src/main.py")
        print("2. Login with: username=testuser, password=password123")
        print("3. Admin login: username=admin, password=admin123")
        print("4. Browse products and test the API endpoints")

if __name__ == '__main__':
    main()

