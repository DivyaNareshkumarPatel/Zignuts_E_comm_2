interface DashboardTabsProps {
    tab: "cart" | "orders";
    setTab: (tab: "cart" | "orders") => void;
    cartCount: number;
}

export default function DashboardTabs({ tab, setTab, cartCount }: DashboardTabsProps) {
    return (
        <div className="flex gap-1 rounded-2xl bg-slate-200 p-1 w-fit mb-8">
            {(["cart", "orders"] as const).map((t) => (
                <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`rounded-xl px-6 py-2.5 text-sm font-semibold capitalize transition ${tab === t
                            ? "bg-white text-slate-950 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                >
                    {t === "cart" ? `Cart (${cartCount})` : "Order History"}
                </button>
            ))}
        </div>
    );
}