import CoinsDisplay from "@/components/CoinsDisplay";

function MarketMakerPage() {
    return (
        <div className="flex flex-col p-4 gap-2">
            <h2 className="text-white text-2xl font-semibold">Coins</h2>
            <p className="text-gray-200">Select a coin to underwrite options for</p>
            <CoinsDisplay />
        </div>
    );
}

export default MarketMakerPage;