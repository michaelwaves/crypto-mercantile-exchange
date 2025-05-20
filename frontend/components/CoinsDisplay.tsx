import { getCoins } from "@/lib/fastapi";
import { DataTable } from "./datatable/Datatable";

async function CoinsDisplay() {
    const coinData = await getCoins();
    return (
        <DataTable data={coinData} />
    );
}

export default CoinsDisplay;