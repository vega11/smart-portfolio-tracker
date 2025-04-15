from flask import Blueprint, request, jsonify
from extensions import db, jwt
from models.user import User
from flask_jwt_extended import create_access_token
from datetime import timedelta  # Import timedelta

# Create the auth blueprint
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        # Log incoming headers and data for debugging
        print("Headers:", request.headers)
        print("Incoming JSON Data:", request.get_json())

        # Parse JSON payload
        data = request.get_json(silent=True)  # Use `silent=True` to avoid raising an error if JSON is invalid
        if not data:
            return jsonify({'message': 'Invalid or missing JSON payload'}), 400

        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        # Validate required fields
        missing_fields = []
        if not username:
            missing_fields.append('username')
        if not email:
            missing_fields.append('email')
        if not password:
            missing_fields.append('password')

        if missing_fields:
            return jsonify({
                'message': f'Missing required fields: {", ".join(missing_fields)}'
            }), 400

        # Check if the username already exists
        if User.query.filter_by(username=username).first():
            return jsonify({'message': 'Username already exists'}), 400

        # Check if the email already exists
        if User.query.filter_by(email=email).first():
            return jsonify({'message': 'Email already exists'}), 400

        # Create and save the new user
        new_user = User(username=username, email=email)
        new_user.set_password(password)  # Hash the password
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'User registered successfully'}), 201

    except Exception as e:
        print(f"Error during registration: {str(e)}")  # Log the error for debugging
        return jsonify({'message': 'An error occurred during registration', 'error': str(e)}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        # Log the incoming headers and data for debugging
        print("Headers:", request.headers)
        print("Incoming JSON Data:", request.get_json())

        # Parse JSON payload
        data = request.get_json(silent=True)  # Use `silent=True` to avoid raising an error if JSON is invalid
        if not data:
            return jsonify({'message': 'Invalid or missing JSON payload'}), 400

        username = data.get('username')
        password = data.get('password')
        token_duration = data.get('token_duration', '1h')  # Default to 1 hour if not specified

        # Validate required fields
        missing_fields = []
        if not username:
            missing_fields.append('username')
        if not password:
            missing_fields.append('password')

        if missing_fields:
            return jsonify({
                'message': f'Missing required fields: {", ".join(missing_fields)}'
            }), 400

        # Validate the user credentials
        user = User.query.filter_by(username=username).first()

        if not user:
            return jsonify({'message': 'User not found'}), 401

        if not user.check_password(password):
            return jsonify({'message': 'Invalid password'}), 401

        # Map token duration strings to actual durations in seconds
        duration_mapping = {
            '15m': 15 * 60,        # 15 minutes
            '30m': 30 * 60,        # 30 minutes
            '1h': 1 * 60 * 60,     # 1 hour
            '12h': 12 * 60 * 60,   # 12 hours
            '24h': 24 * 60 * 60    # 24 hours
        }

        if token_duration not in duration_mapping:
            return jsonify({
                'message': 'Invalid token duration. Choose from: 15m, 30m, 1h, 12h, 24h'
            }), 400

        # Get the expiration time in seconds
        expires_in_seconds = duration_mapping.get(token_duration, 1 * 60 * 60)  # Default to 1 hour if invalid

        # Convert seconds to a timedelta object
        expires_delta = timedelta(seconds=expires_in_seconds)

        # Generate the JWT token with the specified expiration
        access_token = create_access_token(identity=str(user.id), expires_delta=expires_delta)

        return jsonify({
            'message': 'Logged in successfully',
            'access_token': access_token,
            'expires_in': expires_in_seconds  # Optional: Return the expiration time for reference
        }), 200

    except Exception as e:
        print(f"Error during login: {str(e)}")  # Log the error for debugging
        return jsonify({'message': 'An error occurred during login', 'error': str(e)}), 500