import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { cities } from "@/constants/locations";

// SSG: Generate static paths for all cities
export function generateStaticParams() {
    return cities.map((city) => ({
        id: city.id,
    }));
}

// Get city by ID
function getCity(id: string) {
    return cities.find((city) => city.id === id);
}

export default async function CityDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const city = getCity(id);

    if (!city) {
        notFound();
    }

    return (
        <div className="bg-background text-primary min-h-screen">
            <Header />

            <main className="pt-24 pb-16">
                <div className="container-base">
                    {/* Back Button */}
                    <Link
                        href="/cities"
                        className="btn-outline btn-sm mb-8 inline-flex"
                    >
                        ← 返回城市列表
                    </Link>

                    {/* Hero Section */}
                    <div className="mb-12">
                        <div className="w-16 h-1 bg-gold mb-6" />
                        <p className="text-muted text-sm mb-2">{city.faction}</p>
                        <h1 className="heading-hero text-primary mb-2">
                            {city.nameTW}
                        </h1>
                        <p className="text-lead text-muted italic mb-6">
                            {city.name}
                        </p>
                        {"ruler" in city && city.ruler && (
                            <p className="text-secondary">
                                統治者：<span className="text-primary font-semibold">{city.ruler}</span>
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="mb-12">
                        <h2 className="heading-section text-primary mb-4">概述</h2>
                        <p className="text-body text-secondary leading-relaxed mb-4">
                            {city.description}
                        </p>
                        {city.details && (
                            <ul className="space-y-2">
                                {city.details.map((detail, index) => (
                                    <li key={index} className="flex items-start gap-2 text-secondary">
                                        <span className="text-gold mt-1">•</span>
                                        {detail}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Blood Tax System (East End only) */}
                    {"systems" in city && city.systems?.bloodTax && (
                        <div className="mb-12 card p-8">
                            <h2 className="heading-section text-primary mb-6">
                                {city.systems.bloodTax.title}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="heading-item text-primary mb-2">人類義務</h3>
                                    <p className="text-secondary text-sm leading-relaxed">
                                        {city.systems.bloodTax.humanDuty}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="heading-item text-primary mb-2">吸血鬼義務</h3>
                                    <p className="text-secondary text-sm leading-relaxed">
                                        {city.systems.bloodTax.vampireDuty}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-border-base">
                                <h3 className="heading-item text-primary mb-3">管制規則</h3>
                                <ul className="space-y-2">
                                    {city.systems.bloodTax.rules.map((rule, index) => (
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
                    {"landmarks" in city && city.landmarks && city.landmarks.length > 0 && (
                        <div className="mb-12">
                            <h2 className="heading-section text-primary mb-6">重要地標</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {city.landmarks.map((landmark, index) => (
                                    <div key={index} className="card p-6">
                                        <div className="w-8 h-1 bg-gold mb-4" />
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

            <Footer />
        </div>
    );
}
