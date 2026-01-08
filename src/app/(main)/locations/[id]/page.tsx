import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { locations } from "@/constants/locations";

// SSG: Generate static paths for all locations
export function generateStaticParams() {
    return locations.map((loc) => ({
        id: loc.id,
    }));
}

// Get location by ID
function getLocation(id: string) {
    return locations.find((loc) => loc.id === id);
}

export default async function LocationDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const rawLoc = getLocation(id);

    if (!rawLoc) {
        notFound();
    }

    // 強制斷言，消除 lint
    const loc = rawLoc!;

    // 使用資料中定義的 theme 屬性
    const isGold = loc.theme === "gold";
    const accentColor = isGold ? "bg-gold" : "bg-silver";
    const textAccentColor = isGold ? "text-gold" : "text-silver";
    const cardClass = isGold ? "card" : "card card-silver";
    const typeLabel = loc.type === "city" ? "城市" : loc.type === "sea" ? "海域" : "區域";

    return (
        <main className="pt-24 pb-16">
            <div className="container-base">
                {/* Back Button */}
                <Link
                    href="/locations"
                    className="btn-outline btn-sm mb-8 inline-flex"
                >
                    ← 返回地點列表
                </Link>

                {/* Hero Section */}
                <div className="mb-12">
                    <div className={`w-16 h-1 ${accentColor} mb-6`} />
                    <div className="flex items-center gap-2 mb-2">
                        <span className="tag">{typeLabel}</span>
                        {"faction" in loc && loc.faction && loc.faction !== "無" && (
                            <span className="text-muted text-sm">{loc.faction}</span>
                        )}
                    </div>
                    <h1 className="heading-hero text-primary mb-2">
                        {loc.nameTW}
                    </h1>
                    <p className="text-lead text-muted italic mb-6">
                        {loc.name}
                    </p>
                    {"ruler" in loc && loc.ruler && (
                        <p className="text-secondary">
                            統治者：<span className="text-primary font-semibold">{loc.ruler}</span>
                        </p>
                    )}
                </div>

                {/* Description */}
                <div className="mb-12">
                    <h2 className="heading-section text-primary mb-4">概述</h2>
                    <p className="text-body text-secondary leading-relaxed mb-4">
                        {loc.description}
                    </p>
                    {"details" in loc && loc.details && (
                        <ul className="space-y-2">
                            {loc.details.map((detail, index) => (
                                <li key={index} className="flex items-start gap-2 text-secondary">
                                    <span className={isGold ? "text-gold mt-1" : "text-silver mt-1"}>•</span>
                                    {detail}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Blood Tax System (East End only) */}
                {"systems" in loc && loc.systems?.bloodTax && (
                    <div className="mb-12 card p-8">
                        <h2 className="heading-section text-primary mb-6">
                            {loc.systems.bloodTax.title}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="heading-item text-primary mb-2">人類義務</h3>
                                <p className="text-secondary text-sm leading-relaxed">
                                    {loc.systems.bloodTax.humanDuty}
                                </p>
                            </div>
                            <div>
                                <h3 className="heading-item text-primary mb-2">吸血鬼義務</h3>
                                <p className="text-secondary text-sm leading-relaxed">
                                    {loc.systems.bloodTax.vampireDuty}
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-border-base">
                            <h3 className="heading-item text-primary mb-3">管制規則</h3>
                            <ul className="space-y-2">
                                {loc.systems.bloodTax.rules.map((rule, index) => (
                                    <li key={index} className="flex items-center gap-2 text-sm text-muted">
                                        <span className="text-gold">⚠</span>
                                        {rule}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Landmarks */}
                {"landmarks" in loc && loc.landmarks && loc.landmarks.length > 0 && (
                    <div className="mb-12">
                        <h2 className="heading-section text-primary mb-6">重要地標</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {loc.landmarks.map((landmark, index) => (
                                <div key={index} className={`${cardClass} p-6`}>
                                    <div className={`w-8 h-1 ${accentColor} mb-4`} />
                                    <h3 className="heading-item text-primary mb-2">
                                        {landmark.name}
                                    </h3>
                                    <p className="text-muted text-sm leading-relaxed">
                                        {landmark.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
