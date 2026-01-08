"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { locations } from "@/constants/locations";
import { content } from "@/constants/content";

export default function WorldMapSection() {
    const [selectedLocation, setSelectedLocation] = useState<typeof locations[0] | null>(null);
    const router = useRouter();

    // 判斷是否為城市類型（可點擊跳轉）
    const isCityType = (loc: typeof locations[0]) => loc.type === "city";

    // 使用資料中定義的 theme 屬性判斷配色
    const isGoldTheme = (loc: typeof locations[0]) => loc.theme === "gold";

    const handleRegionClick = (loc: typeof locations[0]) => {
        router.push(`/locations/${loc.id}`);
    };

    return (
        <section className="pt-24 pb-12 px-4 bg-surface">
            <div className="container-base">
                <div className="text-center mb-12">
                    <h1 className="heading-section mb-4">
                        <span className="text-primary">{content.worldMapSection.title}</span>
                    </h1>
                    <p className="text-body text-muted max-w-2xl mx-auto">
                        {content.worldMapSection.description}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Interactive Map */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:col-span-2 relative aspect-square bg-white rounded-2xl overflow-hidden shadow-xl border border-border-base"
                    >
                        <div
                            className="absolute inset-0 z-0"
                        >
                            {/* Base Map */}
                            <Image
                                src="/images/map_interactive.png"
                                alt="East End World Map"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>

                        {/* Region Image Slices - only show on hover/select */}
                        {locations.map((loc) => (
                            <div
                                key={loc.id}
                                className="absolute inset-0 transition-all duration-300 cursor-pointer"
                                style={{
                                    opacity: selectedLocation?.id === loc.id ? 1 : 0,
                                    transform: selectedLocation?.id === loc.id ? 'translateY(-4px)' : 'translateY(0)',
                                    zIndex: selectedLocation?.id === loc.id ? 20 : 10,
                                    // 城市用金色光暈，其他用銀色光暈
                                    filter: selectedLocation?.id === loc.id
                                        ? (isGoldTheme(loc)
                                            ? 'drop-shadow(0 0 3px #c9a227) drop-shadow(0 0 8px rgba(201, 162, 39, 0.6)) drop-shadow(0 8px 20px rgba(0,0,0,0.4))'
                                            : 'drop-shadow(0 0 3px #a8a8a8) drop-shadow(0 0 8px rgba(168, 168, 168, 0.6)) drop-shadow(0 8px 20px rgba(0,0,0,0.4))')
                                        : 'none',
                                    pointerEvents: 'none',
                                }}
                            >
                                <Image
                                    src={loc.image}
                                    alt={loc.nameTW}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        ))}

                        {/* Invisible hover areas using SVG */}
                        <svg
                            viewBox="0 0 1024 1024"
                            className="absolute inset-0 w-full h-full z-30 pointer-events-none"
                            preserveAspectRatio="xMidYMid meet"
                            style={{
                                width: '100%',
                                height: '100%',
                            }}
                        >
                            {/* 外海 - 最底層 background */}
                            <path
                                d="M1024 1024H0V0H1024V1024ZM366 78L213.5 172.5L85.5 399.5L68.5 545L137 649.5L141.5 720.5L202 816L323 834.5L442 893.5L525.5 889.5L672.5 779.5L786.5 804.5L875 762.5L945 696L939.927 606.5L945 537L932.5 475.5L882.5 468.5L868.5 372L811 367.5L806 343L842 317L852 228.5L814.5 147L672.5 68.5L445.5 58L366 78Z"
                                fill="transparent"
                                className="cursor-pointer pointer-events-auto"
                                onMouseEnter={() => setSelectedLocation(locations[6])}
                                onMouseLeave={() => setSelectedLocation(null)}
                            />
                            {/* 東末城 */}
                            <path
                                d="M759 609V644L742 706L764 724L798 737H830L878 701L870 681L878 631L870 602L844 586H786L759 609Z"
                                fill="transparent"
                                className="cursor-pointer pointer-events-auto"
                                onMouseEnter={() => setSelectedLocation(locations[0])}
                                onMouseLeave={() => setSelectedLocation(null)}
                                onClick={() => handleRegionClick(locations[0])}
                            />
                            {/* 北都城 */}
                            <path
                                d="M446.5 293.5L403.5 276L381.5 279.5L366.5 249L322 204L339 153.5L381.5 132L438 139L489.5 147.5L505.5 132L565 128.5L570.5 110H589L585 139L673 128.5L742.5 169L775.5 226L760 276C763.667 286.167 771.9 307.2 775.5 310C779.1 312.8 777 326.5 775.5 333H710L643.5 327L596 344.5L538.5 315.5L446.5 293.5Z"
                                fill="transparent"
                                className="cursor-pointer pointer-events-auto"
                                onMouseEnter={() => setSelectedLocation(locations[1])}
                                onMouseLeave={() => setSelectedLocation(null)}
                                onClick={() => handleRegionClick(locations[1])}
                            />
                            {/* 西教廷 (聖樹) */}
                            <path
                                d="M258 415L183 399L158 415L134 476L158 547L203 590L282 542L296 447L258 415Z"
                                fill="transparent"
                                className="cursor-pointer pointer-events-auto"
                                onMouseEnter={() => setSelectedLocation(locations[2])}
                                onMouseLeave={() => setSelectedLocation(null)}
                                onClick={() => handleRegionClick(locations[2])}
                            />
                            {/* 荒野地帶 */}
                            <path
                                d="M447 298L536.5 319L596 347.5L647 329L711 336H729V352L737.5 371.5L732 383L697.5 376.5L684.5 393.5L711 424.5L697.5 466L711 476.5L697.5 486.5L673 476.5L641.5 503L615.5 499L573.5 492H546L529.5 503L540.5 528L543 547L524.5 550L519.5 529.5L505.5 509.5L490.5 503L477.5 499L470 503L463 499H452L440 495.5L425.5 503L414 499L425.5 537L401 541.5L380.5 509.5L370 476.5L356.5 437L336.5 386.5L312.5 371.5L325 329L356.5 294.5L374 287L398 280L447 298ZM535.5 386C518.103 386 504 400.103 504 417.5C504 434.897 518.103 449 535.5 449C552.897 449 567 434.897 567 417.5C567 400.103 552.897 386 535.5 386Z"
                                fill="transparent"
                                className="cursor-pointer pointer-events-auto"
                                onMouseEnter={() => setSelectedLocation(locations[4])}
                                onMouseLeave={() => setSelectedLocation(null)}
                            />
                            {/* 內海 */}
                            <path
                                d="M448 598L415 625L397 649V670L415 710V748L454 768L504 760L563 734L570 722L610 678L627 644L610 590L570 565L528 557L497 582L448 598Z"
                                fill="transparent"
                                className="cursor-pointer pointer-events-auto"
                                onMouseEnter={() => setSelectedLocation(locations[5])}
                                onMouseLeave={() => setSelectedLocation(null)}
                            />
                            {/* 首都遺址 - Top layer for easy clicking */}
                            <circle
                                cx="535.5" cy="417.5" r="31.5"
                                fill="transparent"
                                className="cursor-pointer pointer-events-auto"
                                onMouseEnter={() => setSelectedLocation(locations[3])}
                                onMouseLeave={() => setSelectedLocation(null)}
                            />
                        </svg>
                    </motion.div>

                    {/* Location Info Card */}
                    <div className="lg:col-span-1 h-full">
                        <div className="card p-8 h-full min-h-[350px] flex flex-col justify-center">
                            {selectedLocation ? (
                                <>
                                    <div className="flex items-center gap-3 mb-6">
                                        {/* 城市用金色，其他用銀色 */}
                                        <span className={`w-1 h-8 ${isGoldTheme(selectedLocation) ? 'bg-gold' : 'bg-silver'}`}></span>
                                        <div>
                                            <h2 className="text-2xl font-bold text-primary">
                                                {selectedLocation.nameTW}
                                            </h2>
                                            <p className="text-muted italic">
                                                {selectedLocation.name}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-border-base mb-6"></div>

                                    <p className="text-secondary leading-loose text-lg mb-6">
                                        {selectedLocation.description}
                                    </p>

                                    {/* View Details Button - all locations */}
                                    <Link
                                        href={`/locations/${selectedLocation.id}`}
                                        className={`btn-outline btn-sm self-start ${!isGoldTheme(selectedLocation) ? 'btn-outline-silver' : ''}`}
                                    >
                                        查看詳情 →
                                    </Link>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-muted">
                                    <p className="text-xl">{content.worldMapSection.placeholder.title}</p>
                                    <p className="text-sm mt-2">{content.worldMapSection.placeholder.subtitle}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
}

