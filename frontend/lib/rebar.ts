"use server"

const API_KEY = process.env.REBAR_API_KEY
if (!API_KEY) {
    throw new Error("Must set env variable REBAR_API_KEY")
}
const headers = {
    "X-API-Key": API_KEY
}
export const getRunes = async () => {
    const url = 'https://api.rebarlabs.io/runes/v1/etchings?' + new URLSearchParams({ limit: "60" })

    try {
        const response = await fetch(url, {
            method: "GET",
            headers
        })

        const data = await response.json()
        return data
    } catch (e) {
        console.error(e)
        return []
    }
}

export const getInscriptions = async () => {
    const url = 'https://api.rebarlabs.io/ordinals/v1/inscriptons?' + new URLSearchParams({ limit: "60" })

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers
        })
        const data = await response.json()
        return data
    } catch (e) {
        console.error(e)
        return []
    }
}