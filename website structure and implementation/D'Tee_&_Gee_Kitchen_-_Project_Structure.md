# D'Tee & Gee Kitchen - Project Structure

## Overview
This is a full-stack e-commerce website for D'Tee & Gee Kitchen, featuring a Flask backend API and a responsive frontend with modern animations and design.

## Project Structure

```
dtee-gee-kitchen/
├── backend/                    # Flask API Backend
│   ├── venv/                  # Python virtual environment
│   ├── src/
│   │   ├── models/
│   │   │   └── user.py        # Database models (User, Product, Category, Order, etc.)
│   │   ├── routes/
│   │   │   ├── auth.py        # Authentication endpoints
│   │   │   ├── cart.py        # Shopping cart endpoints
│   │   │   ├── order.py       # Order management endpoints
│   │   │   ├── product.py     # Product and category endpoints
│   │   │   ├── review.py      # Review system endpoints
│   │   │   └── user.py        # User management endpoints
│   │   ├── database/
│   │   │   └── app.db         # SQLite database
│   │   ├── static/            # Static files served by Flask
│   │   └── main.py            # Flask application entry point
│   ├── seed_data.py           # Database seeding script
│   └── requirements.txt       # Python dependencies
├── frontend/                   # Frontend Application
│   ├── css/                   # Stylesheets
│   ├── js/                    # JavaScript files
│   ├── images/                # Image assets
│   ├── videos/                # Video assets
│   ├── pages/                 # Additional HTML pages
│   └── index.html             # Main homepage
├── mockups/                   # UI/UX Design Mockups
│   ├── homepage-mockup.png
│   ├── product-page-mockup.png
│   ├── user-account-mockup.png
│   └── mobile-mockup.png
├── design-references/         # Design inspiration images
├── design-system.md           # Brand guidelines and design system
└── wireframes.md              # Site structure and user flow
```

## Backend API Architecture

### Database Models
- **User**: User accounts with authentication
- **Category**: Product categories (Drinks, Smoothies, etc.)
- **Product**: Individual products with pricing and inventory
- **Order**: Customer orders with status tracking
- **OrderItem**: Individual items within orders
- **CartItem**: Shopping cart functionality
- **Address**: User delivery addresses
- **Review**: Product reviews and ratings

### API Endpoints

#### Authentication (`/api/auth/`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `GET /check-auth` - Check authentication status

#### Products (`/api/`)
- `GET /products` - List products with filtering
- `GET /products/<id>` - Get single product
- `GET /categories` - List categories
- `GET /featured-products` - Get featured products

#### Shopping Cart (`/api/`)
- `GET /cart` - Get cart items
- `POST /cart/add` - Add item to cart
- `PUT /cart/update/<id>` - Update cart item
- `DELETE /cart/remove/<id>` - Remove cart item
- `DELETE /cart/clear` - Clear entire cart

#### Orders (`/api/`)
- `GET /orders` - Get user orders
- `POST /orders` - Create new order
- `GET /orders/<id>` - Get specific order
- `PUT /orders/<id>/cancel` - Cancel order

#### Reviews (`/api/`)
- `GET /products/<id>/reviews` - Get product reviews
- `POST /products/<id>/reviews` - Create review
- `PUT /reviews/<id>` - Update review
- `DELETE /reviews/<id>` - Delete review

## Frontend Architecture

### Technology Stack
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Grid and Flexbox
- **JavaScript**: ES6+ with modern features
- **Responsive Design**: Mobile-first approach
- **Animations**: CSS transitions and keyframes

### Key Features
- **Responsive Design**: Works on all device sizes
- **Dark/Light Mode**: Theme switching
- **Smooth Animations**: Page transitions and micro-interactions
- **Video Background**: Hero section with food preparation videos
- **Interactive Elements**: Hover states and touch-friendly controls
- **Shopping Cart**: Persistent cart with real-time updates
- **User Authentication**: Login/register functionality
- **Order Tracking**: Real-time order status updates
- **Product Reviews**: Customer feedback system

### Design System
- **Colors**: Gold (#D4AF37), Teal (#7FB3D3), Red (#C41E3A)
- **Typography**: Playfair Display (headings), Inter (body)
- **Spacing**: 8px base unit with consistent scale
- **Components**: Reusable UI components with consistent styling

## Sample Data
The database is pre-populated with:
- 7 product categories
- 16 sample products
- 1 test user (username: testuser, password: password123)

## Development Workflow

### Backend Development
1. Activate virtual environment: `source backend/venv/bin/activate`
2. Start Flask server: `python backend/src/main.py`
3. API available at: `http://localhost:5000/api/`

### Frontend Development
1. Serve frontend files through Flask static serving
2. Access website at: `http://localhost:5000/`
3. API calls made to same domain for CORS compatibility

## Deployment Ready
- **Backend**: Flask app configured for production deployment
- **Frontend**: Static files optimized for serving
- **Database**: SQLite for development, easily upgradeable to PostgreSQL
- **CORS**: Configured for cross-origin requests
- **Security**: Password hashing, session management, input validation

## Next Steps
1. Complete frontend development with animations
2. Integrate frontend with backend API
3. Add payment processing
4. Test all functionality
5. Deploy to production environment

This architecture provides a solid foundation for a modern, scalable e-commerce website that can handle user authentication, product management, shopping cart functionality, order processing, and customer reviews.

