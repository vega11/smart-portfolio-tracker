

from flask import Flask, jsonify, request
from flask_cors import CORS
from extensions import db, jwt, cache, make_celery  # Import Celery from extensions.py
from config import Config
from routes.portfolio_routes import portfolio_bp
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from models.user import User, Portfolio, Transaction, Alert
from flask_migrate import Migrate

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.config['CACHE_TYPE'] = 'filesystem'
    app.config['CACHE_DIR'] = '/tmp/cache'
    
    # Configure Celery
    app.config['broker_url'] = 'redis://redis:6379/0'  # New key for broker
    app.config['result_backend'] = 'redis://redis:6379/0'  # New key for backend
    
    # Initialize extensions
    db.init_app(app)  # Initialize SQLAlchemy
    jwt.init_app(app)  # Initialize JWT
    cache.init_app(app)  # Initialize Cache

    # Enable Cross-Origin Resource Sharing (CORS) & Allow requests from the frontend
    CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins for development
    

    # Handle OPTIONS requests globally
    @app.before_request
    def handle_options():
        if request.method == "OPTIONS":
            response = jsonify()
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            response.headers.add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
            response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
            response.headers.add("Access-Control-Allow-Credentials", "true")  # Allow credentials

            return response, 200

    # Initialize Celery
    global celery
    celery = make_celery(app)  # Update Celery configuration with Flask app settings

    # Initialize Flask-Migrate
    migrate = Migrate(app, db)  # Add this line

    # Import and register blueprints
    from routes.auth_routes import auth_bp
    from routes.prices_routes import prices_bp
    from routes.portfolio_routes import portfolio_bp
    
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(portfolio_bp, url_prefix='/portfolio')
    app.register_blueprint(prices_bp, url_prefix='/prices')

    # Define a simple route to list all routes
    @app.route('/routes')
    def list_routes():
        import urllib
        output = []
        for rule in app.url_map.iter_rules():
            methods = ','.join(sorted(rule.methods))
            line = urllib.parse.unquote(f"{rule.endpoint:50s} {methods:20s} {rule}")
            output.append(line)
        return "<br>".join(sorted(output))

    @app.route('/')
    def home():
        return "Welcome to the Smart Portfolio Tracker API!"

    return app

# Create the Flask app
app = create_app()

# Entry point for running the app
if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Create database tables
    app.run(host="0.0.0.0", port=5000, debug=True)