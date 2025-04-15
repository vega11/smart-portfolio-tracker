from celery import Celery
from flask import Flask
from models.user import Alert, db  # Import your database and Alert model
from utils.api_helpers import get_price  # Import the function to fetch prices
from app import create_app  # Import the Flask app factory
from extensions import make_celery
# Create the Flask app instance
flask_app = create_app()


# Initialize Celery with the Flask app
celery = make_celery(flask_app)

# Schedule periodic tasks
@celery.task
def check_price_alerts():
    """
    Background task to check if any price alerts have been triggered.
    This task runs periodically (e.g., every minute) and updates the database.
    """
    with flask_app.app_context():  # Push the Flask app context
        # Fetch all active alerts (those that haven't been triggered yet)
        alerts = Alert.query.filter_by(triggered=False).all()

        for alert in alerts:
            # Fetch the current price for the symbol
            price_data = get_price(alert.symbol)

            if price_data and price_data.get('price', 0) >= alert.target_price:
                # If the price meets or exceeds the target price, trigger the alert
                alert.triggered = True
                db.session.commit()

                # Log the alert (optional: send a notification via email or webhook)
                print(f"Alert triggered for {alert.symbol} at price {price_data['price']}")

# Configure Celery beat schedule for periodic tasks
celery.conf.beat_schedule = {
    'check-price-alerts-every-minute': {
        'task': 'tasks.check_price_alerts',
        'schedule': 60.0,  # Run every 60 seconds
    },
}