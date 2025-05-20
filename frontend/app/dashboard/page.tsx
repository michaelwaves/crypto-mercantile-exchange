import NavCard from "@/components/cards/NavCard";
import { Landmark, User, } from "lucide-react";

function DashboardPage() {
    const cardData = [
        {
            icon: User,
            title: "Market Participant",
            href: "/user",
            description: "Buy and Sell Options"
        },
        {
            icon: Landmark,
            title: "Market Maker",
            href: "/market-maker",
            description: "Issue options and fund the contract to provide initial liquidity"
        },
    ]
    return (
        <div className="flex w-full h-full min-h-screen items-center justify-center">
            <div className="max-w-4xl w-[50vw] flex flex-col gap-4 ">
                {cardData.map(c => <NavCard key={c.title} icon={c.icon} title={c.title} description={c.description} href={c.href} />)}
            </div>
        </div>
    );
}

export default DashboardPage;