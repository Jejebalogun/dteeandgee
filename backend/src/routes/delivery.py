from flask import Blueprint, jsonify, request, session
from src.models.user import DeliveryZone, db
from functools import wraps

delivery_bp = Blueprint('delivery', __name__)


def admin_required(f):
    """Decorator to require admin authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        from src.models.user import User
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Authentication required'}), 401
        user = User.query.get(user_id)
        if not user or not getattr(user, 'is_admin', False):
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated_function


@delivery_bp.route('/delivery/zones', methods=['GET'])
def get_delivery_zones():
    """Get all active delivery zones (public)"""
    zones = DeliveryZone.query.filter_by(is_active=True).all()
    return jsonify({
        'zones': [zone.to_dict() for zone in zones]
    })


@delivery_bp.route('/delivery/zones/all', methods=['GET'])
@admin_required
def get_all_delivery_zones():
    """Get all delivery zones including inactive (admin only)"""
    zones = DeliveryZone.query.all()
    return jsonify({
        'zones': [zone.to_dict() for zone in zones]
    })


@delivery_bp.route('/delivery/zones/<int:zone_id>', methods=['GET'])
def get_delivery_zone(zone_id):
    """Get a specific delivery zone"""
    zone = DeliveryZone.query.get_or_404(zone_id)
    return jsonify(zone.to_dict())


@delivery_bp.route('/delivery/zones', methods=['POST'])
@admin_required
def create_delivery_zone():
    """Create a new delivery zone (admin only)"""
    data = request.json

    # Validate required fields
    if not data.get('name'):
        return jsonify({'error': 'Zone name is required'}), 400
    if not data.get('areas'):
        return jsonify({'error': 'Areas list is required'}), 400

    zone = DeliveryZone(
        name=data['name'],
        areas=data['areas'],
        delivery_fee=data.get('delivery_fee', 0),
        min_order_amount=data.get('min_order_amount', 0),
        estimated_time=data.get('estimated_time', '30-45 mins'),
        is_active=data.get('is_active', True)
    )

    db.session.add(zone)
    db.session.commit()

    return jsonify(zone.to_dict()), 201


@delivery_bp.route('/delivery/zones/<int:zone_id>', methods=['PUT'])
@admin_required
def update_delivery_zone(zone_id):
    """Update a delivery zone (admin only)"""
    zone = DeliveryZone.query.get_or_404(zone_id)
    data = request.json

    if 'name' in data:
        zone.name = data['name']
    if 'areas' in data:
        zone.areas = data['areas']
    if 'delivery_fee' in data:
        zone.delivery_fee = data['delivery_fee']
    if 'min_order_amount' in data:
        zone.min_order_amount = data['min_order_amount']
    if 'estimated_time' in data:
        zone.estimated_time = data['estimated_time']
    if 'is_active' in data:
        zone.is_active = data['is_active']

    db.session.commit()
    return jsonify(zone.to_dict())


@delivery_bp.route('/delivery/zones/<int:zone_id>', methods=['DELETE'])
@admin_required
def delete_delivery_zone(zone_id):
    """Delete a delivery zone (admin only)"""
    zone = DeliveryZone.query.get_or_404(zone_id)
    db.session.delete(zone)
    db.session.commit()
    return jsonify({'message': 'Delivery zone deleted successfully'})


@delivery_bp.route('/delivery/check', methods=['POST'])
def check_delivery_area():
    """Check if an area is covered and get delivery fee"""
    data = request.json
    area = data.get('area', '').strip().lower()

    if not area:
        return jsonify({'error': 'Area is required'}), 400

    # Search through all active zones
    zones = DeliveryZone.query.filter_by(is_active=True).all()

    for zone in zones:
        areas_list = [a.strip().lower() for a in zone.areas.split(',')]
        # Check if the input area matches or is contained in any zone area
        for zone_area in areas_list:
            if area in zone_area or zone_area in area:
                return jsonify({
                    'covered': True,
                    'zone': zone.to_dict(),
                    'delivery_fee': float(zone.delivery_fee),
                    'estimated_time': zone.estimated_time,
                    'min_order_amount': float(zone.min_order_amount)
                })

    return jsonify({
        'covered': False,
        'message': 'Sorry, we do not currently deliver to this area. Please contact us for special arrangements.'
    })


@delivery_bp.route('/delivery/calculate', methods=['POST'])
def calculate_delivery_fee():
    """Calculate delivery fee for an order"""
    data = request.json
    zone_id = data.get('zone_id')
    subtotal = float(data.get('subtotal', 0))

    if not zone_id:
        return jsonify({'error': 'Delivery zone is required'}), 400

    zone = DeliveryZone.query.get(zone_id)
    if not zone or not zone.is_active:
        return jsonify({'error': 'Invalid delivery zone'}), 400

    # Check minimum order amount
    if subtotal < float(zone.min_order_amount):
        return jsonify({
            'error': f'Minimum order amount for {zone.name} is ₦{zone.min_order_amount}',
            'min_order_amount': float(zone.min_order_amount)
        }), 400

    delivery_fee = float(zone.delivery_fee)
    total = subtotal + delivery_fee

    return jsonify({
        'subtotal': subtotal,
        'delivery_fee': delivery_fee,
        'total': total,
        'zone': zone.to_dict()
    })
