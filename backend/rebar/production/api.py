from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from coingecko import get_coin_prices, calculate_volatility, black_scholes_price, get_coins

app = FastAPI()

# Allow all CORS origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/coins")
def list_all_coins():
    return get_coins()

@app.get("/price-options")
def calculate_options_price(
    ticker: str = "pepe",
    strike_price_multiple: float = 1.2,
    option_type: str = "call",
    expiry_in_years: float = 0.5,
    risk_free_rate: float = 0.05,
    volatility_lookback_days: str = "90",
    vs_currency: str = "usd"
):
    prices = get_coin_prices(ticker, vs_currency=vs_currency, days=volatility_lookback_days)["prices"]

    current_price = prices[0][1]
    strike_price = current_price * strike_price_multiple
    sigma = calculate_volatility(prices)

    option_price = black_scholes_price(
        current_price,
        strike_price,
        expiry_in_years,
        risk_free_rate,
        sigma,
        option_type
    )

    return {
        "option_price": option_price,
        "strike_price": strike_price,
        "current_price": current_price,
        "volatility": sigma,
        "prices": prices
    }

if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0",port=8000, reload=True)