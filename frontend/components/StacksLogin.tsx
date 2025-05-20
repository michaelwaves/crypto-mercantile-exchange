"use client"
import { connect, isConnected, request } from "@stacks/connect";
import { useRouter } from "next/navigation";

function StacksLogin() {

    const router = useRouter();
    async function authenticate() {
        if (!isConnected()) {
            const response = await connect();
            console.log(response)
        }
        router.push("/dashboard")
    }

    return (
        <div className="flex flex-col gap-2">
            <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-500"
                onClick={authenticate}
            >Login</button>
        </div>
    );
}

export default StacksLogin;