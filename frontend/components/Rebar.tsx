import { getRunes } from "@/lib/rebar";
import RunesDataTable from "./datatable/RunesDatatable";

async function Rebar() {
    const runes = await getRunes();
    return (
        <div className="text-green-500">
            <h1>
                Rebar Runes
            </h1>
            <RunesDataTable data={runes} />
        </div>
    );
}

export default Rebar;