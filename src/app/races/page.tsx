import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { races } from "@/constants/races";

export default function RacesPage() {
    return (
        <div className="bg-background text-primary min-h-screen">
            <Header />

            <main className="pt-24 pb-16">
                <div className="container-base">
                    {/* Page Header */}
                    <div className="text-center mb-16">
                        <h1 className="heading-hero mb-4">
                            <span className="text-primary">種族介紹</span>
                        </h1>
                        <p className="text-body text-muted max-w-2xl mx-auto">
                            在這個被虛無之海包圍的世界中，存在著三種主要智慧種族。
                            他們各有起源，卻因命運糾纏在一起。
                        </p>
                    </div>

                    {/* Race Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {races.map((race) => {
                            // 吸血鬼用銀色（月神造物），其他用金色
                            const isVampire = race.id === "vampire";
                            const cardClass = isVampire ? "card card-silver" : "card";
                            const accentColor = isVampire ? "bg-silver" : "bg-gold";

                            return (
                                <div
                                    key={race.id}
                                    className={`${cardClass} p-8 flex flex-col`}
                                >
                                    {/* Header */}
                                    <div className="mb-6">
                                        <div className={`w-12 h-1 ${accentColor} mb-4`} />
                                        <p className="text-sm text-muted mb-1">
                                            造物主：{race.creator}
                                        </p>
                                        <h2 className="heading-section text-primary">
                                            {race.nameTW}
                                        </h2>
                                        <p className="text-sm text-muted italic">
                                            {race.name}
                                        </p>
                                    </div>

                                    {/* Description */}
                                    <p className="text-secondary leading-relaxed mb-6 flex-grow">
                                        {race.description}
                                    </p>

                                    {/* Traits */}
                                    <div className="mb-6">
                                        <h3 className="heading-item text-primary mb-3">
                                            特徵
                                        </h3>
                                        <ul className="space-y-3">
                                            {race.traits.map((trait, index) => (
                                                <li
                                                    key={index}
                                                    className="text-sm"
                                                >
                                                    <span className="font-semibold text-primary">
                                                        {trait.title}
                                                    </span>
                                                    <span className="text-muted ml-1">
                                                        — {trait.description}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Footer Info */}
                                    <div className="pt-4 border-t border-border-base">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted">人口比例</span>
                                            <span className="text-primary font-medium">
                                                {race.population}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm mt-2">
                                            <span className="text-muted">主要分布</span>
                                            <span className="text-primary font-medium">
                                                {race.regions.join("、")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
