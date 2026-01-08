import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { cities } from "@/constants/locations";

export default function CitiesPage() {
    return (
        <div className="bg-background text-primary min-h-screen">
            <Header />

            <main className="pt-24 pb-16">
                <div className="container-base">
                    {/* Page Header */}
                    <div className="text-center mb-16">
                        <h1 className="heading-hero mb-4">
                            <span className="text-primary">城市介紹</span>
                        </h1>
                        <p className="text-body text-muted max-w-2xl mx-auto">
                            在帝國滅亡後的百年間，這片大陸上僅存三座主要城市，
                            各自懷抱著不同的信仰與制度，在險惡的世界中艱難存活。
                        </p>
                    </div>

                    {/* City Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {cities.map((city) => (
                            <Link
                                key={city.id}
                                href={`/cities/${city.id}`}
                                className="card p-6 group cursor-pointer"
                            >
                                {/* Header */}
                                <div className="mb-4">
                                    <div className="w-12 h-1 bg-gold mb-4 group-hover:w-20 transition-all duration-300" />
                                    <p className="text-sm text-muted mb-1">
                                        {city.faction}
                                    </p>
                                    <h2 className="heading-section text-primary transition-colors">
                                        {city.nameTW}
                                    </h2>
                                    <p className="text-sm text-muted italic">
                                        {city.name}
                                    </p>
                                </div>

                                {/* Description */}
                                <p className="text-secondary text-sm leading-relaxed mb-4">
                                    {city.description}
                                </p>

                                {/* Ruler */}
                                {"ruler" in city && city.ruler && (
                                    <div className="pt-4 border-t border-border-base">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted">統治者</span>
                                            <span className="text-primary font-medium">
                                                {city.ruler}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* CTA */}
                                <div className="mt-4 text-sm text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                    查看詳情 →
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
