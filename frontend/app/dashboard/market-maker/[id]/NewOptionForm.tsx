"use client"

import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { calculateOptionPrice } from "@/lib/fastapi" // Adjust to your path
import { useParams } from "next/navigation"
import OptionsDataViewer from "./OptionsDataViewer"

type FormValues = {
    strike_price_multiple: number
    option_type: "call" | "put"
    expiry_in_years: number
    risk_free_rate: number
    volatility_lookback_days: string
    vs_currency: string
}

export default function NewOptionForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        getValues
    } = useForm<FormValues>({
        defaultValues: {
            strike_price_multiple: 1.2,
            option_type: "call",
            expiry_in_years: 0.5,
            risk_free_rate: 0.05,
            volatility_lookback_days: "90",
            vs_currency: "usd",
        },
    })

    const { id } = useParams();
    const formData = getValues();

    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    const onSubmit = async (data: FormValues) => {
        try {
            setError(null)
            const res = await calculateOptionPrice({
                ticker: id as string,
                ...data,
            })
            console.log(res)
            setResult(res)
        } catch (err: any) {
            setError(err.message || "Failed to calculate option price")
            setResult(null)
        }
    }

    return (
        <div className="flex flex-row gap-4 p-4">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full space-y-4 rounded-md border border-gray-700 p-6 shadow-md bg-gray-900 text-gray-100 max-w-md"
            >
                <h2 className="text-lg font-semibold">Price Option for {id}</h2>
                <div className="space-y-2">
                    <Label htmlFor="strike_price_multiple">Strike Price Multiple</Label>
                    <Input
                        type="number"
                        step="0.01"
                        {...register("strike_price_multiple", { required: true, min: 0.1 })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="option_type">Option Type</Label>
                    <select
                        className="w-full bg-gray-800 text-white border border-gray-600 rounded-md p-2"
                        {...register("option_type", { required: true })}
                    >
                        <option value="call">Call</option>
                        <option value="put">Put</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="expiry_in_years">Expiry (Years)</Label>
                    <Input
                        type="number"
                        step="0.01"
                        {...register("expiry_in_years", { required: true, min: 0.01 })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="risk_free_rate">Risk-Free Rate</Label>
                    <Input
                        type="number"
                        step="0.001"
                        {...register("risk_free_rate", { required: true })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="volatility_lookback_days">Volatility Lookback Days</Label>
                    <Input
                        type="text"
                        {...register("volatility_lookback_days", { required: true })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="vs_currency">VS Currency</Label>
                    <Input
                        type="text"
                        {...register("vs_currency", { required: true })}
                    />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Calculating..." : "Calculate Option Price"}
                </Button>
                {error && (
                    <p className="text-red-400 text-sm mt-2">{error}</p>
                )}
            </form>
            {result && <OptionsDataViewer data={result} formData={formData} />}
        </div>
    )
}
