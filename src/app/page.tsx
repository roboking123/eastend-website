import Link from "next/link";
import Footer from "@/components/layout/Footer";
import HeroMapBackground from "@/components/features/HeroMapBackground";
import { content } from "@/constants/content";

export default function HomePage() {
    const { hero, features, characters, ctaSection } = content.home;

    return (
        <div className="bg-background text-primary snap-container">
            {/* Hero Section */}
            <section className="snap-section relative overflow-hidden bg-surface">
                {/* 模糊地圖背景 (Motion Layout) */}
                <HeroMapBackground />

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-16">
                    <h1 className="heading-hero mb-6 animate-fade-in">
                        <span className="text-primary">{hero.title}</span>
                    </h1>
                    <p className="text-lead text-secondary mb-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                        {hero.subtitle}
                    </p>
                    <p className="text-body text-muted mb-12 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.4s" }}>
                        {hero.description.map((line, index) => (
                            <span key={index}>
                                {line}
                                {index < hero.description.length - 1 && <br />}
                            </span>
                        ))}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.6s" }}>
                        <Link href="/world" className="btn-outline">
                            {hero.cta1}
                        </Link>
                        <Link href="/characters" className="btn-outline">
                            {hero.cta2}
                        </Link>
                    </div>
                </div>

                {/* 向下滾動提示 */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <svg
                        className="w-6 h-6 text-muted"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                    </svg>
                </div>
            </section>

            {/* 世界特色 Section */}
            <section className="snap-section bg-background">
                <div className="container-base">
                    <h2 className="heading-section text-center mb-16">
                        <span className="text-primary">{features.title}</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.items.map((feature, index) => (
                            <div
                                key={feature.title}
                                className="card p-8 text-center"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="w-12 h-1 bg-gold mx-auto mb-6" />
                                <h3 className="heading-item text-primary mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-muted leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 角色預覽 Section */}
            <section className="snap-section bg-surface">
                <div className="container-base">
                    <h2 className="heading-section text-center mb-4">
                        <span className="text-primary">{characters.title}</span>
                    </h2>
                    <p className="text-muted text-center mb-16">
                        {characters.subtitle}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {characters.items.map((character) => (
                            <div key={character.name} className="card p-6">
                                {/* 頂部裝飾 */}
                                <div className="h-1 w-16 bg-gold mb-6" />
                                <p className="text-sm text-muted mb-2">{character.faction}</p>
                                <h3 className="heading-item text-primary mb-3">
                                    {character.name}
                                </h3>
                                <p className="text-secondary text-sm leading-relaxed">
                                    {character.description}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <Link href="/characters" className="btn-outline">
                            {characters.cta}
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="snap-section bg-background">
                <div className="max-w-3xl mx-auto text-center px-4">
                    <h2 className="heading-section mb-6">
                        <span className="text-primary">{ctaSection.title}</span>
                    </h2>
                    <p className="text-muted text-lg mb-8">
                        {ctaSection.description}
                    </p>
                    <Link href="/world" className="btn-outline">
                        {ctaSection.button}
                    </Link>
                </div>
            </section>

            {/* Footer with snap alignment - snap to bottom */}
            <div style={{ scrollSnapAlign: 'end' }}>
                <Footer />
            </div>
        </div>
    );
}
