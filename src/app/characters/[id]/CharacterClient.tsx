"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useThemeSafe, Theme } from "@/contexts/ThemeContext";

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
    // 設置頁面主題
    const { setTheme } = useThemeSafe();
    useEffect(() => {
        setTheme((character.theme as Theme) || "gold");
        return () => setTheme("gold"); // 離開頁面時重置為金色
    }, [character.theme, setTheme]);

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

    // 自訂滾動邏輯：第一頁有阻力，第二頁自由滾動
    const containerRef = useRef<HTMLDivElement>(null);
    const accumulatedRef = useRef(0);
    const isAnimatingRef = useRef(false);
    const inSecondPageRef = useRef(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const heroHeight = window.innerHeight;
        const threshold = 80; // 阻力閾值

        const handleWheel = (e: WheelEvent) => {
            if (isAnimatingRef.current) {
                e.preventDefault();
                return;
            }

            const scrollTop = container.scrollTop;

            // 在第一頁
            if (scrollTop < heroHeight - 10) {
                inSecondPageRef.current = false;

                // 往下滾
                if (e.deltaY > 0) {
                    e.preventDefault();
                    accumulatedRef.current += e.deltaY;

                    // 超過閾值，跳到第二頁
                    if (accumulatedRef.current >= threshold) {
                        isAnimatingRef.current = true;
                        container.scrollTo({ top: heroHeight, behavior: 'smooth' });
                        accumulatedRef.current = 0;
                        setTimeout(() => {
                            isAnimatingRef.current = false;
                            inSecondPageRef.current = true;
                        }, 500);
                    }
                }
            }
            // 在第二頁
            else {
                inSecondPageRef.current = true;

                // 往上滾：檢查是否接近第二頁頂部
                if (e.deltaY < 0) {
                    // 如果已經在頂部附近（距離 heroHeight 不超過 200px），直接跳回
                    if (scrollTop <= heroHeight + 200) {
                        e.preventDefault();
                        isAnimatingRef.current = true;
                        container.scrollTo({ top: 0, behavior: 'smooth' });
                        setTimeout(() => {
                            isAnimatingRef.current = false;
                            inSecondPageRef.current = false;
                        }, 500);
                    }
                    // 否則正常滾動
                }
            }
        };

        // 滾動結束時重置累積
        let wheelTimeout: NodeJS.Timeout;
        const handleWheelEnd = () => {
            clearTimeout(wheelTimeout);
            wheelTimeout = setTimeout(() => {
                accumulatedRef.current = 0;
            }, 150);
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        container.addEventListener('wheel', handleWheelEnd);

        return () => {
            container.removeEventListener('wheel', handleWheel);
            container.removeEventListener('wheel', handleWheelEnd);
            clearTimeout(wheelTimeout);
        };
    }, []);

    return (
        <div ref={containerRef} className="h-screen w-full overflow-y-scroll bg-surface text-primary font-serif">
            <div>

                {/* Hero Section - Immersive & Cinematic */}
                <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
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

                {/* Content Section Container (Stats + Bio) - 不限制最小高度，允許內容自然撐高 */}
                <section className="bg-surface relative z-30 flex flex-col" style={{ scrollSnapAlign: 'start' }}>
                    {/* Header 在第二頁顯示 - 使用 sticky 模式 */}
                    <Header sticky />

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

                    {/* Footer */}
                    <Footer />

                </section>
            </div>
        </div>
    );
}
