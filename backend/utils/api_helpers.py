import requests

def get_price(symbol):
    try:
        symbol = symbol.lower()  # Ensure lowercase
        response = requests.get(f'https://api.coingecko.com/api/v3/simple/price?ids={symbol}&vs_currencies=usd&include_24hr_change=true')
        if response.status_code != 200:
            return None
        data = response.json()
        price = data[symbol].get('usd')
        change = data[symbol].get('usd_24h_change', 0.0)  # Default to 0.0 if missing
        return {'price': price, 'change': change}
    except Exception as e:
        print(f"Error fetching price for {symbol}: {e}")
        return None