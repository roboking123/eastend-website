"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { content } from "@/constants/content";

export default function CharactersPage() {
    const { title, subtitle, filters, items: characters } = content.charactersPage;
    const [filterRace, setFilterRace] = useState<"all" | "吸血鬼" | "大精靈" | "人類">("all");

    const filteredCharacters = characters.filter((char) =>
        filterRace === "all" ? true : char.race === filterRace
    );

    return (
        <div className="min-h-screen bg-background text-primary">
            <Header />

            <section className="pt-24 pb-12 px-4 bg-surface">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="text-primary">{title}</span>
                        </h1>
                        <p className="text-muted max-w-2xl mx-auto text-lg leading-relaxed">
                            {subtitle}
                        </p>
                    </div>
                </div>
            </section>

            {/* Characters Section */}
            <section className="py-24 px-4 bg-background">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                        <h2 className="text-3xl font-bold">
                            <span className="text-primary">{title}</span>
                        </h2>

                        {/* Filter */}
                        <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                            {(["all", "吸血鬼", "大精靈", "人類"] as const).map((type) => {
                                // 吸血鬼用銀色，其他用金色
                                const isSilver = type === "吸血鬼";
                                const activeClass = isSilver ? "btn-active-silver" : "btn-active";
                                const hoverClass = isSilver ? "btn-outline-silver" : "";

                                return (
                                    <button
                                        key={type}
                                        onClick={() => setFilterRace(type)}
                                        className={`btn-outline btn-sm ${hoverClass} ${filterRace === type ? activeClass : ""}`}
                                    >
                                        {type === "all" ? filters.all : type === "吸血鬼" ? filters.vampire : type === "大精靈" ? filters.spirit : filters.human}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredCharacters.map((char) => {
                            // 吸血鬼用銀色（月神造物），其他用金色（地神造物）
                            const isVampire = char.race === "吸血鬼";
                            const cardClass = isVampire ? "card card-silver" : "card";
                            const accentColor = isVampire ? "bg-silver" : "bg-gold";

                            return (
                                <Link
                                    href={`/characters/${char.id}`}
                                    key={char.id}
                                    className={`${cardClass} character-card overflow-hidden block transition-transform hover:-translate-y-1 duration-300 group`}
                                >
                                    {/* Top Accent Bar - Dynamic Color */}
                                    <div className={`h-1 w-full ${accentColor}`}></div>

                                    <div className="p-6 h-full flex flex-col">
                                        <div className="flex justify-between items-start mb-4">
                                            {/* Standardized Tag Class */}
                                            <span className="tag">
                                                {char.race}
                                            </span>
                                            <span className="text-xs text-muted py-1">{char.faction}</span>
                                        </div>

                                        <h3 className="text-xl font-bold text-primary mb-1 transition-colors">
                                            {char.name}
                                        </h3>
                                        <p className="text-sm text-muted italic mb-4">{char.alias}</p>

                                        <div className="w-8 h-0.5 bg-border-base mb-4"></div>

                                        {/* Description with tooltip for full text */}
                                        <p
                                            className="text-secondary text-sm leading-relaxed line-clamp-3 flex-grow"
                                            title={char.description}
                                        >
                                            {char.description}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
