"""
Contact and Support routes for D'Tee & Gee Kitchen
Handles contact form submissions, feedback, and support inquiries
"""
from flask import Blueprint, jsonify, request, render_template_string
from src.models.user import db, Product, Category
from datetime import datetime
from src.utils.security import sanitize_input
import re
import os

support_bp = Blueprint('support', __name__)

# In-memory storage for contact messages (in production, use database)
# For now, we'll create a simple Contact model in models/user.py
class ContactMessage(db.Model):
    """Store contact form submissions"""
    __tablename__ = 'contact_messages'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20))
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default='unread')  # unread, read, resolved
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'subject': self.subject,
            'message': self.message,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


def is_valid_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


@support_bp.route('/contact', methods=['POST'])
def submit_contact_form():
    """
    Submit a contact form
    Required fields: name, email, subject, message
    Optional fields: phone
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        phone = data.get('phone', '').strip()
        subject = data.get('subject', '').strip()
        message = data.get('message', '').strip()
        
        # Validation
        if not name or len(name) < 2:
            return jsonify({'error': 'Name must be at least 2 characters'}), 400
        
        if not email or not is_valid_email(email):
            return jsonify({'error': 'Invalid email address'}), 400
        
        if not subject or len(subject) < 3:
            return jsonify({'error': 'Subject must be at least 3 characters'}), 400
        
        if not message or len(message) < 10:
            return jsonify({'error': 'Message must be at least 10 characters'}), 400
        
        # Sanitize inputs
        name = sanitize_input(name)
        email = sanitize_input(email)
        subject = sanitize_input(subject)
        message = sanitize_input(message)
        if phone:
            phone = sanitize_input(phone)
        
        # Create contact message
        contact = ContactMessage(
            name=name,
            email=email,
            phone=phone if phone else None,
            subject=subject,
            message=message
        )
        
        db.session.add(contact)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Thank you for contacting us! We will get back to you soon.',
            'contact_id': contact.id
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error submitting contact form: {str(e)}'}), 500


@support_bp.route('/contact/list', methods=['GET'])
def get_contact_messages():
    """
    Get all contact messages (admin only)
    Query parameters: status, page, per_page
    """
    try:
        # In production, add admin_required decorator
        status = request.args.get('status')
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        query = ContactMessage.query
        
        if status:
            query = query.filter_by(status=status)
        
        # Order by most recent first
        messages = query.order_by(ContactMessage.created_at.desc()).paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        return jsonify({
            'success': True,
            'messages': [msg.to_dict() for msg in messages.items],
            'total': messages.total,
            'pages': messages.pages,
            'current_page': page
        }), 200
    
    except Exception as e:
        return jsonify({'error': f'Error retrieving messages: {str(e)}'}), 500


@support_bp.route('/contact/<int:contact_id>', methods=['GET'])
def get_contact_message(contact_id):
    """Get a specific contact message"""
    try:
        contact = ContactMessage.query.get(contact_id)
        
        if not contact:
            return jsonify({'error': 'Contact message not found'}), 404
        
        # Mark as read
        if contact.status == 'unread':
            contact.status = 'read'
            db.session.commit()
        
        return jsonify({
            'success': True,
            'message': contact.to_dict()
        }), 200
    
    except Exception as e:
        return jsonify({'error': f'Error retrieving message: {str(e)}'}), 500


@support_bp.route('/contact/<int:contact_id>/status', methods=['PUT'])
def update_contact_status(contact_id):
    """Update contact message status (admin only)"""
    try:
        contact = ContactMessage.query.get(contact_id)
        
        if not contact:
            return jsonify({'error': 'Contact message not found'}), 404
        
        data = request.get_json()
        status = data.get('status')
        
        valid_statuses = ['unread', 'read', 'resolved']
        if status not in valid_statuses:
            return jsonify({'error': f'Invalid status. Must be one of: {valid_statuses}'}), 400
        
        contact.status = status
        contact.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Status updated successfully',
            'contact': contact.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error updating status: {str(e)}'}), 500


@support_bp.route('/contact/<int:contact_id>', methods=['DELETE'])
def delete_contact_message(contact_id):
    """Delete a contact message (admin only)"""
    try:
        contact = ContactMessage.query.get(contact_id)
        
        if not contact:
            return jsonify({'error': 'Contact message not found'}), 404
        
        db.session.delete(contact)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Contact message deleted successfully'
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error deleting message: {str(e)}'}), 500


@support_bp.route('/newsletter/subscribe', methods=['POST'])
def subscribe_newsletter():
    """Subscribe to newsletter"""
    try:
        data = request.get_json()
        email = data.get('email', '').strip()
        
        if not email or not is_valid_email(email):
            return jsonify({'error': 'Invalid email address'}), 400
        
        email = sanitize_input(email)
        
        # In production, save to newsletter database and send confirmation email
        # For now, just return success
        
        return jsonify({
            'success': True,
            'message': 'Successfully subscribed to our newsletter!'
        }), 201
    
    except Exception as e:
        return jsonify({'error': f'Error subscribing: {str(e)}'}), 500


@support_bp.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint for monitoring
    Returns basic system status
    """
    try:
        return jsonify({
            'status': 'healthy',
            'service': 'D\'Tee & Gee Kitchen API',
            'timestamp': datetime.utcnow().isoformat(),
            'version': '1.0.0'
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), 500


@support_bp.route('/sitemap.xml', methods=['GET'])
def generate_sitemap():
    """
    Generate XML sitemap for search engine crawlers
    """
    try:
        base_url = os.getenv('BASE_URL', 'https://dteeandgee.com')
        
        # Static pages
        static_urls = [
            ('/', '1.0', 'daily'),
            ('/privacy-policy.html', '0.8', 'monthly'),
            ('/terms-of-service.html', '0.8', 'monthly'),
        ]
        
        # Get all products
        products = Product.query.filter_by(is_available=True).all()
        product_urls = [
            (f'/?product={p.id}', '0.8', 'weekly') for p in products
        ]
        
        # Get all categories
        categories = Category.query.all()
        category_urls = [
            (f'/?category={c.id}', '0.9', 'weekly') for c in categories
        ]
        
        # Combine all URLs
        all_urls = static_urls + product_urls + category_urls
        
        # Generate XML
        sitemap_xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
        sitemap_xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        
        for url, priority, changefreq in all_urls:
            sitemap_xml += '  <url>\n'
            sitemap_xml += f'    <loc>{base_url}{url}</loc>\n'
            sitemap_xml += f'    <lastmod>{datetime.utcnow().strftime("%Y-%m-%d")}</lastmod>\n'
            sitemap_xml += f'    <changefreq>{changefreq}</changefreq>\n'
            sitemap_xml += f'    <priority>{priority}</priority>\n'
            sitemap_xml += '  </url>\n'
        
        sitemap_xml += '</urlset>'
        
        return sitemap_xml, 200, {'Content-Type': 'application/xml; charset=utf-8'}
    
    except Exception as e:
        return jsonify({
            'error': f'Error generating sitemap: {str(e)}'
        }), 500

