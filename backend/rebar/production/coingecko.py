from scipy.stats import norm
import math
import numpy as np
import requests
from dotenv import load_dotenv
import os

load_dotenv()

REBAR_API_KEY = os.getenv('REBAR_API_KEY')
COINGECKO_API_KEY = os.getenv('COINGECKO_API_KEY') 
#coingecko for prices
COINGECKO_URL = "https://api.coingecko.com/api/v3"
COINGECKO_HEADERS = {
    "x-cg-demo-api-key": COINGECKO_API_KEY
}

def get_coins():
    url = f"{COINGECKO_URL}/coins/list"
    res = requests.get(url,headers=COINGECKO_HEADERS)
    return res.json()

def get_coin_historical_data(id:str, date:str="19-05-2025"):
    url = f"{COINGECKO_URL}/coins/{id}/history?date={date}"
    res = requests.get(url,headers=COINGECKO_HEADERS)
    return res.json()

def get_coin_prices(id:str, vs_currency:str="btc", days:str="90", interval="daily"):
    url = f"{COINGECKO_URL}/coins/{id}/market_chart?vs_currency={vs_currency}&days={days}&interval={interval}"
    res = requests.get(url,headers=COINGECKO_HEADERS)
    return res.json()

def calculate_volatility(price_data):
    """
    Calculate annualized historical volatility from price data.
    
    price_data: List of [timestamp, price] pairs (timestamps in ms)
    """
    prices = [p[1] for p in sorted(price_data, key=lambda x: x[0])]
    log_returns = np.diff(np.log(prices))
    volatility = np.std(log_returns) * math.sqrt(365)  # Annualized
    return volatility

def black_scholes_price(S, K, T, r, sigma, option_type='call'):
    """
    Black-Scholes option pricing.
    
    S: Current price of underlying
    K: Strike price
    T: Time to maturity in years
    r: Risk-free interest rate (e.g., 0.05 for 5%)
    sigma: Volatility (standard deviation of returns, annualized)
    option_type: 'call' or 'put'
    """
    d1 = (np.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))
    d2 = d1 - sigma * np.sqrt(T)

    if option_type == 'call':
        price = S * norm.cdf(d1) - K * np.exp(-r * T) * norm.cdf(d2)
    elif option_type == 'put':
        price = K * np.exp(-r * T) * norm.cdf(-d2) - S * norm.cdf(-d1)
    else:
        raise ValueError("option_type must be 'call' or 'put'")
    
    return price
