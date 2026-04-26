from flask import Blueprint, jsonify

user_bp = Blueprint('user', __name__)

@user_bp.route('/users', methods=['GET'])
def get_users():
    # Example response, replace with actual logic
    return jsonify({'users': []})

@user_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    # Example response, replace with actual logic
    return jsonify({'user_id': user_id})
