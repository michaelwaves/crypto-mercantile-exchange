"use client"
import { Button } from "@/components/ui/button";
import { createOption, deleteOption, fundContract } from "@/lib/stacks";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

function ConfirmCreateOption({ formData, optionData }: { formData: any, optionData: any }) {
    const { expiry_in_years, option_type } = formData
    const { id: ticker } = useParams()
    const { option_price, volatility, strike_price } = optionData
    const [name, setName] = useState("");
    console.log(optionData)
    return (
        <div className="flex flex-col justify-center items-center gap-8">
            <h1 className="text-2xl text-white">Confirm Option Creation</h1>
            <p>Must have minimum 10000 STX to fund contract and provide liquidity</p>
            <Button
                className="bg-green-800 hover:bg-green-600"
                onClick={async () => {
                    const name = await createOption(ticker as string, option_type, strike_price, option_price, expiry_in_years, volatility)
                    await fundContract(10000)
                    setName(name)
                    toast(`Successfully created option ${name}`)
                }}
            >
                Create Option
            </Button>
            {name && <Button onClick={() => deleteOption(name)} variant="destructive"> Delete Option</Button>}
        </div>
    );
}

export default ConfirmCreateOption;