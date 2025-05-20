"use server"

const FASTAPI_URL = process.env.FASTAPI_URL

export const getCoins = async () => {
    const res = await fetch(`${FASTAPI_URL}/coins`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })

    if (!res.ok) {
        throw new Error(`Failed to fetch coins: ${res.statusText}`)
    }
    return await res.json()
}

export const calculateOptionPrice = async ({
    ticker = "pepe",
    strike_price_multiple = 1.2,
    option_type = "call",
    expiry_in_years = 0.5,
    risk_free_rate = 0.05,
    volatility_lookback_days = "90",
    vs_currency = "usd",
} = {}) => {
    const params = new URLSearchParams({
        ticker,
        strike_price_multiple: strike_price_multiple.toString(),
        option_type,
        expiry_in_years: expiry_in_years.toString(),
        risk_free_rate: risk_free_rate.toString(),
        volatility_lookback_days,
        vs_currency,
    })

    const res = await fetch(`${FASTAPI_URL}/price-options?${params.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })

    if (!res.ok) {
        throw new Error(`Failed to calculate option price: ${res.statusText}`)
    }

    return await res.json()
}