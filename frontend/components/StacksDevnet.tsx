"use client"
import { createOption, deleteOption, fundContract } from "@/lib/stacks";
import { Button } from "./ui/button";

function StacksDevnet() {
    return (
        <div className="flex flex-col justify-center items-center gap-8">
            <h1 className="text-2xl text-white">Confirm Option Creation</h1>
            <Button
                className="p-4 bg-indigo-500 rounded text-white"
                onClick={() => createOption(

                )}
            >
                Create Option
            </Button>
            <Button onClick={fundContract}>Fund Contract</Button>
            <Button onClick={deleteOption}> Delete Contract</Button>
        </div>
    );
}

export default StacksDevnet;