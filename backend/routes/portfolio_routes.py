from flask import Blueprint, request, jsonify
from extensions import db
from models.user import Portfolio, Transaction
from flask_jwt_extended import jwt_required, get_jwt_identity
from utils.api_helpers import get_price
from models.user import Alert
portfolio_bp = Blueprint('portfolio', __name__)

@portfolio_bp.route('/add', methods=['POST'])
@jwt_required()  # Protect the route with JWT
def add_stock():
    current_user_id = get_jwt_identity()  # Get the user ID from the JWT token
    data = request.get_json()
    symbol = data.get('symbol')
    quantity = data.get('quantity')
    purchase_price = data.get('purchase_price')

    # Add to portfolio
    new_stock = Portfolio(
        user_id=current_user_id,
        symbol=symbol,
        quantity=quantity,
        purchase_price=purchase_price
    )
    db.session.add(new_stock)

    # Log the transaction
    transaction = Transaction(
        user_id=current_user_id,
        symbol=symbol,
        action='buy',
        quantity=quantity,
        price=purchase_price
    )
    db.session.add(transaction)

    db.session.commit()

    return jsonify({'message': 'Stock added to portfolio'})

@portfolio_bp.route('/view', methods=['GET'])
@jwt_required()
def view_portfolio():
    current_user_id = int(get_jwt_identity())  # Convert to integer
    portfolio = Portfolio.query.filter_by(user_id=current_user_id).all()

    result = [
        {
            'symbol': stock.symbol,
            'quantity': stock.quantity,
            'purchase_price': stock.purchase_price
        }
        for stock in portfolio
    ]
    return jsonify(result)

@portfolio_bp.route('/history', methods=['GET'])
@jwt_required()
def transaction_history():
    current_user_id = int(get_jwt_identity())
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    transactions = Transaction.query.filter_by(user_id=current_user_id)\
        .order_by(Transaction.timestamp.desc())\
        .paginate(page=page, per_page=per_page, error_out=False)

    result = [
        {
            'symbol': txn.symbol,
            'action': txn.action,
            'quantity': txn.quantity,
            'price': txn.price,
            'timestamp': txn.timestamp.isoformat()
        }
        for txn in transactions.items
    ]
    return jsonify({
        'transactions': result,
        'total_pages': transactions.pages,
        'current_page': transactions.page
    })
@portfolio_bp.route('/sell', methods=['POST'])
@jwt_required()
def sell_stock():
    current_user_id = int(get_jwt_identity())
    data = request.get_json()
    symbol = data.get('symbol')
    quantity = data.get('quantity')

    # Check if the user owns the stock and has enough quantity
    holding = Portfolio.query.filter_by(user_id=current_user_id, symbol=symbol).first()
    if not holding or holding.quantity < quantity:
        return jsonify({'message': 'Insufficient quantity to sell'}), 400

    # Reduce the quantity in the portfolio
    holding.quantity -= quantity
    if holding.quantity == 0:
        db.session.delete(holding)  # Remove the holding if quantity is zero

    # Log the transaction
    transaction = Transaction(
        user_id=current_user_id,
        symbol=symbol,
        action='sell',
        quantity=quantity,
        price=83695  # Replace with actual price fetched from the API
    )
    db.session.add(transaction)

    db.session.commit()

    return jsonify({'message': f'Sold {quantity} units of {symbol}'})

@portfolio_bp.route('/value', methods=['GET'])
@jwt_required()
def portfolio_value():
    current_user_id = int(get_jwt_identity())
    holdings = Portfolio.query.filter_by(user_id=current_user_id).all()

    total_value = 0.0
    for holding in holdings:
        price_data = get_price(holding.symbol)
        if price_data and price_data['price']:
            total_value += price_data['price'] * holding.quantity

    return jsonify({'total_value': round(total_value, 2)})

@portfolio_bp.route('/alerts', methods=['POST'])
@jwt_required()
def create_alert():
    current_user_id = int(get_jwt_identity())
    data = request.get_json()
    symbol = data.get('symbol')
    target_price = data.get('target_price')

    if not symbol or not target_price:
        return jsonify({'message': 'Symbol and target_price are required'}), 400

    alert = Alert(user_id=current_user_id, symbol=symbol, target_price=target_price)
    db.session.add(alert)
    db.session.commit()

    return jsonify({'message': 'Alert created successfully'})


@portfolio_bp.route('/alerts', methods=['GET'])
@jwt_required()
def view_alerts():
    current_user_id = int(get_jwt_identity())  # Get the current user's ID from the JWT token
    alerts = Alert.query.filter_by(user_id=current_user_id).all()  # Fetch all alerts for the user

    result = [
        {
            'id': alert.id,
            'symbol': alert.symbol,
            'target_price': alert.target_price,
            'triggered': alert.triggered
        }
        for alert in alerts
    ]
    return jsonify(result)