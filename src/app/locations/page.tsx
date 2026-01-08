import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { locations } from "@/constants/locations";

export default function LocationsPage() {
    return (
        <div className="bg-background text-primary min-h-screen">
            <Header />

            <main className="pt-24 pb-16">
                <div className="container-base">
                    {/* Page Header */}
                    <div className="text-center mb-16">
                        <h1 className="heading-hero mb-4">
                            <span className="text-primary">地點介紹</span>
                        </h1>
                        <p className="text-body text-muted max-w-2xl mx-auto">
                            在這片被虛無之海包圍的大陸上，每一個地點都有其獨特的歷史與命運。
                            城市、荒野、海域——各自訴說著不同的故事。
                        </p>
                    </div>

                    {/* Location Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {locations.map((loc) => {
                            // 使用資料中定義的 theme 屬性
                            const isGold = loc.theme === "gold";
                            const cardClass = isGold ? "card" : "card card-silver";
                            const accentColor = isGold ? "bg-gold" : "bg-silver";
                            const typeLabel = loc.type === "city" ? "城市" : loc.type === "sea" ? "海域" : "區域";

                            return (
                                <Link
                                    key={loc.id}
                                    href={`/locations/${loc.id}`}
                                    className={`${cardClass} p-6 group cursor-pointer`}
                                >
                                    {/* Header */}
                                    <div className="mb-4">
                                        <div className={`w-12 h-1 ${accentColor} mb-4 group-hover:w-20 transition-all duration-300`} />
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="tag">{typeLabel}</span>
                                            {"faction" in loc && loc.faction && loc.faction !== "無" && (
                                                <span className="text-xs text-muted">{loc.faction}</span>
                                            )}
                                        </div>
                                        <h2 className="heading-section text-primary transition-colors">
                                            {loc.nameTW}
                                        </h2>
                                        <p className="text-sm text-muted italic">
                                            {loc.name}
                                        </p>
                                    </div>

                                    {/* Description */}
                                    <p className="text-secondary text-sm leading-relaxed mb-4">
                                        {loc.description}
                                    </p>

                                    {/* Ruler (cities only) */}
                                    {"ruler" in loc && loc.ruler && (
                                        <div className="pt-4 border-t border-border-base">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted">統治者</span>
                                                <span className="text-primary font-medium">
                                                    {loc.ruler}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* CTA */}
                                    <div className="mt-4 text-sm text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                        查看詳情 →
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
