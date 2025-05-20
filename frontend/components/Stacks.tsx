"use client"
import { connect, isConnected, request } from "@stacks/connect";

function Stacks() {
    async function authenticate() {
        if (!isConnected()) {
            const response = await connect();
            console.log(response)
        }
    }

    async function transferStx() {
        const response = await request('stx_transferStx', {
            recipient: "ST2EB9WEQNR9P0K28D2DC352TM75YG3K0GT7V13CV",
            amount: '100',
            memo: 'Reimbursement'
        })
        console.log('transaction id: ', response.txid);
        console.log('raw transaction: ', response.transaction);
        const explorerUrl = `https://explorer.stacks.co/txid/${response.txid}`;
        console.log('View transaction in explorer:', explorerUrl);
    }

    return (
        <div className="flex flex-col gap-2">
            <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-500"
                onClick={authenticate}
            >Connect wallet</button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-gray-500"
                onClick={transferStx}
            >Send STX</button>
        </div>
    );
}

export default Stacks;