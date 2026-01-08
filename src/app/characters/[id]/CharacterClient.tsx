"use client";


import Image from "next/image";
import { motion } from "framer-motion";

interface Character {
    id: string;
    name: string;
    alias: string;
    faction: string;
    race: string;
    theme?: string;
    description: string;
    quote?: string;
    heroImage?: string;
    stats?: {
        role: string;
        status: string;
        ability: string;
    };
    fullBio?: string[];
}

export default function CharacterClient({ character }: { character: Character }) {
    // Default to undefined if no hero image
    const heroImage = character.heroImage;

    // Determine theme based on explicit theme field
    const isSilver = character.theme === "silver";
    const themeColorText = isSilver ? "text-silver" : "text-gold";
    const themeColorBorder = isSilver ? "border-silver" : "border-gold";
    const themeColorBorderLight = isSilver ? "border-silver/30" : "border-gold/30";
    const themeBtnClass = isSilver ? "btn-outline-silver" : "btn-outline";

    // Gradient for Hero bottom overlay: Fade from black to Theme Color (very dark/subtle) mixed with Surface?
    // User requested "Black -> White" (current to-surface) to become "Black -> Silver/Gold".
    // To ensure smooth transition to next section (which is bg-surface), we might need to be careful.
    // Let's try fading to a tinted surface or just the theme color implies a strong tint.
    // Let's try: from-black/80 via-black/40 to-{color}/20 (keeping transparency to show image but tinted)
    // But since it connects to next section, 'to-surface' creates the blend.
    // Let's modify the `via` or `to` to include the theme color hint. 
    // Actually, user said "Black gradient to White... make it gradient to Silver/Gold".
    const themeGradient = isSilver
        ? "from-black/80 via-[#a8a8a8]/10 to-surface"
        : "from-black/80 via-[#c9a227]/10 to-surface";

    const statLabels: Record<string, string> = {
        role: "身份",
        status: "狀態",
        ability: "能力"
    };

    return (
        <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-surface text-primary font-serif scroll-smooth">

            {/* Hero Section - Immersive & Cinematic */}
            <section className="relative h-screen w-full flex items-center justify-center overflow-hidden snap-start shrink-0">
                {/* Background Image with Parallax-like feel */}
                <div className="absolute inset-0 z-0 select-none">
                    {heroImage ? (
                        <Image
                            src={heroImage}
                            alt={character.name}
                            fill
                            className="object-cover opacity-90 scale-105"
                            priority
                        />
                    ) : (
                        // Placeholder: Rich dark gradient for premium feel
                        <div className={`absolute inset-0 bg-gradient-to-br from-[#0a0a12] via-primary to-[#0f0f13]`} />
                    )}
                    {/* Gradient Overlays for readability and mood */}
                    <div className={`absolute inset-0 bg-gradient-to-b ${themeGradient} z-10`}></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50 z-10"></div>
                </div>

                {/* Hero Content */}
                <div className="relative z-20 max-w-5xl mx-auto px-6 text-center text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                    >
                        {/* Faction Badge */}
                        <div className={`inline-block mb-6 px-4 py-1 border ${themeColorBorderLight} rounded-full bg-black/40 backdrop-blur-sm text-sm tracking-[0.2em] uppercase font-sans ${themeColorText}`}>
                            {character.race} · {character.faction}
                        </div>

                        {/* Name */}
                        <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-wide drop-shadow-2xl ${themeColorText}`}>
                            {character.name}
                            {/* Reserved space for animation */}
                            <span className="inline-block w-4 h-4 ml-4" />
                        </h1>

                        {/* Quote */}
                        {character.quote && (
                            <p className={`text-xl md:text-2xl italic ${themeColorText} font-light tracking-wider leading-relaxed max-w-3xl mx-auto text-left md:text-center`}>
                                {character.quote}
                            </p>
                        )}
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className={`absolute bottom-10 left-1/2 -translate-x-1/2 z-20 ${themeColorText} animate-bounce`}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </motion.div>
            </section>

            {/* Content Section Container (Stats + Bio) */}
            <section className="min-h-screen bg-surface relative z-30 snap-start flex flex-col">

                {/* Stats / Quick Info Strip */}
                <div className="relative pt-8 mx-4 md:mx-12 lg:mx-24 z-40">
                    <div className={`bg-primary text-white py-8 border-t ${themeColorBorderLight} shadow-2xl rounded-lg`}>
                        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-around gap-8 md:gap-12">
                            {character.stats && Object.entries(character.stats).map(([key, value]) => (
                                <div key={key} className="text-center">
                                    <h3 className={`${themeColorText} text-xs uppercase tracking-[0.15em] mb-1 font-sans opacity-80`}>
                                        {statLabels[key] || key}
                                    </h3>
                                    <p className={`text-lg md:text-xl font-medium tracking-wide ${themeColorText}`}>
                                        {value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Biography Section */}
                <main className="max-w-4xl mx-auto px-6 py-12 md:py-24 flex-grow flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex flex-col gap-12 text-lg md:text-xl leading-loose text-secondary text-justify tracking-wide">
                            {character.fullBio?.map((paragraph, index) => (
                                <p key={index}>
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        <div className="mt-24 pt-12 border-t border-border-base text-center">
                            <p className="text-muted text-sm font-sans mb-8">
                                — {character.alias} —
                            </p>
                            {/* Back Button */}
                            <a href="/characters" className={themeBtnClass}>
                                返回角色列表
                            </a>
                        </div>
                    </motion.div>
                </main>


            </section>
        </div>
    );
}
