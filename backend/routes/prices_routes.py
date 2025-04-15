from flask import Blueprint, jsonify
from utils.api_helpers import get_price
from extensions import cache
prices_bp = Blueprint('prices', __name__)

@prices_bp.route('/<symbol>', methods=['GET'])
@cache.cached(timeout=300, query_string=True)
def get_stock_price(symbol):
    price_data = get_price(symbol)
    if not price_data or price_data['price'] is None:
        return jsonify({'message': 'Symbol not found or unsupported'}), 404
    return jsonify({
        'symbol': symbol,
        'price': price_data['price'],
        'change': price_data['change']
    })