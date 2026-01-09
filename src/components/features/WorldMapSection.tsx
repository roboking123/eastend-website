"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { locations } from "@/constants/locations";
import { content } from "@/constants/content";

export default function WorldMapSection() {
    // 狀態管理
    const [selectedLocation, setSelectedLocation] = useState<typeof locations[0] | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false); // 手機版底部抽屜
    const router = useRouter();

    // 判斷配色
    const isGoldTheme = (loc: typeof locations[0]) => loc.theme === "gold";

    // 點擊地點
    const handleMarkerClick = useCallback((loc: typeof locations[0]) => {
        // 如果點擊的是已選中的地點，導航到詳情頁
        if (selectedLocation?.id === loc.id) {
            router.push(`/locations/${loc.id}`);
            return;
        }
        // 否則選中該地點
        setSelectedLocation(loc);
        setIsDrawerOpen(true);
    }, [selectedLocation, router]);

    // 關閉詳情（點擊空白處）
    const handleClickOutside = useCallback(() => {
        setSelectedLocation(null);
        setIsDrawerOpen(false);
    }, []);

    // 判斷標記點是否為當前顯示的
    const isMarkerActive = (loc: typeof locations[0]) => selectedLocation?.id === loc.id;

    return (
        <main className="pt-24 pb-16" onClick={handleClickOutside}>
            <div className="container-base">
                {/* Page Header - 與種族頁面完全一致 */}
                <section className="pb-12 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center">
                            <h1 className="heading-section mb-4">
                                <span className="text-primary">{content.worldMapSection.title}</span>
                            </h1>
                            <p className="text-muted max-w-2xl mx-auto text-lg leading-relaxed">
                                {content.worldMapSection.description}
                            </p>
                        </div>
                    </div>
                </section>

                {/* 三欄佈局：列表 | 地圖 | 詳情 */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* 左側：地點列表（桌面版） */}
                    <div className="hidden lg:block lg:col-span-2">
                        <div className={`card overflow-hidden sticky top-24 ${selectedLocation && !isGoldTheme(selectedLocation) ? "card-silver" : ""}`}>
                            {/* 頂部裝飾條 - 根據選中地點變色 */}
                            <div className={`h-1 w-full ${selectedLocation ? (isGoldTheme(selectedLocation) ? "bg-gold" : "bg-silver") : "bg-gold"}`} />
                            <div className="p-4">
                                <h3 className="heading-item text-primary mb-4">地點列表</h3>
                                <div className="space-y-1">
                                    {locations.map((loc) => (
                                        <button
                                            key={loc.id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleMarkerClick(loc);
                                            }}
                                            className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${selectedLocation?.id === loc.id
                                                ? isGoldTheme(loc)
                                                    ? "bg-primary text-gold"
                                                    : "bg-primary text-silver"
                                                : isGoldTheme(loc)
                                                    ? "text-secondary hover:bg-gold/10 hover:border-gold/30"
                                                    : "text-secondary hover:bg-silver/10 hover:border-silver/30"
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isGoldTheme(loc) ? "bg-gold" : "bg-silver"}`} />
                                                <span className="font-medium truncate">{loc.nameTW}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 中間：地圖區域 */}
                    <div className="lg:col-span-7">
                        <div className={`card overflow-hidden ${selectedLocation && !isGoldTheme(selectedLocation) ? "card-silver" : ""}`}>
                            {/* 頂部裝飾條 - 根據選中地點變色 */}
                            <div className={`h-1 w-full ${selectedLocation ? (isGoldTheme(selectedLocation) ? "bg-gold" : "bg-silver") : "bg-gold"}`} />
                            <div className="p-4">
                                {/* 地圖容器 - 自適應大小 */}
                                <div className="relative w-full" style={{ aspectRatio: '1/1' }}>
                                    <Image
                                        src="/images/map_interactive.png"
                                        alt="East End World Map"
                                        fill
                                        className="object-contain"
                                        priority
                                    />

                                    {/* 標記點 - 百分比定位，跟著地圖縮放 */}
                                    {locations.map((loc) => (
                                        <button
                                            key={loc.id}
                                            className={`absolute transform -translate-x-1/2 -translate-y-full z-10 transition-all duration-300 group cursor-pointer ${isMarkerActive(loc) ? "scale-125 z-20" : "scale-100 hover:scale-110"
                                                }`}
                                            style={{
                                                left: `${loc.position.x}%`,
                                                top: `${loc.position.y}%`,
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleMarkerClick(loc);
                                            }}
                                            aria-label={loc.nameTW}
                                        >
                                            <div className="relative flex flex-col items-center">
                                                {/* 定位針圖示 */}
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                    stroke="rgba(0,0,0,0.8)"
                                                    strokeWidth="1"
                                                    className={`w-8 h-8 sm:w-10 sm:h-10 drop-shadow-lg transition-colors ${isMarkerActive(loc)
                                                        ? isGoldTheme(loc) ? "text-gold" : "text-silver"
                                                        : isGoldTheme(loc) ? "text-gold/80 hover:text-gold" : "text-silver/80 hover:text-silver"
                                                        }`}
                                                >
                                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                                </svg>

                                                {/* 地點名稱標籤 */}
                                                <div className={`absolute bottom-full mb-1 whitespace-nowrap text-sm font-bold px-2 py-0.5 rounded backdrop-blur-sm shadow-sm transition-all
                                                    ${isMarkerActive(loc)
                                                        ? "opacity-100 bg-background/90 translate-y-0"
                                                        : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
                                                    } 
                                                    ${isGoldTheme(loc) ? "text-primary border border-gold/30" : "text-primary border border-silver/30"}`}>
                                                    {loc.nameTW}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 右側：詳情面板（桌面版） */}
                    <div className="hidden lg:block lg:col-span-3">
                        <div
                            className={`card overflow-hidden sticky top-24 ${selectedLocation && !isGoldTheme(selectedLocation) ? "card-silver" : ""}`}
                            style={{ minHeight: '300px' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* 頂部裝飾條 - 根據選中地點變色 */}
                            <div className={`h-1 w-full ${selectedLocation ? (isGoldTheme(selectedLocation) ? "bg-gold" : "bg-silver") : "bg-gold"}`} />

                            <div className="p-6">
                                {selectedLocation ? (
                                    <>
                                        <div className="flex items-center gap-3 mb-6">
                                            <span className={`w-1 h-8 ${isGoldTheme(selectedLocation) ? "bg-gold" : "bg-silver"}`} />
                                            <div>
                                                <h2 className="text-2xl font-bold text-primary">
                                                    {selectedLocation.nameTW}
                                                </h2>
                                                <p className="text-muted italic text-sm">
                                                    {selectedLocation.name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="w-full h-px bg-border-base mb-6" />
                                        <p className="text-secondary leading-relaxed mb-6">
                                            {selectedLocation.description}
                                        </p>
                                        <Link
                                            href={`/locations/${selectedLocation.id}`}
                                            className={`btn-outline btn-sm ${!isGoldTheme(selectedLocation) ? "btn-outline-silver" : ""}`}
                                        >
                                            查看詳情 →
                                        </Link>
                                    </>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center text-muted py-12">
                                        <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                        </svg>
                                        <p className="text-lg font-medium mb-2">請選擇地圖區域</p>
                                        <p className="text-sm">點擊地圖上的標記點查看詳情</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 手機版：底部抽屜 */}
                {selectedLocation && (
                    <div
                        className={`lg:hidden fixed inset-x-0 bottom-0 z-50 transform transition-transform duration-300 ${isDrawerOpen ? "translate-y-0" : "translate-y-full"
                            }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 抽屜內容 */}
                        <div className="relative bg-background rounded-t-2xl shadow-xl border-t border-border-base max-h-[60vh] overflow-y-auto">
                            {/* 頂部裝飾條 */}
                            <div className={`h-1 w-full rounded-t-2xl ${isGoldTheme(selectedLocation) ? "bg-gold" : "bg-silver"}`} />

                            {/* 拖曳把手 */}
                            <div className="pt-3 pb-2 flex justify-center">
                                <div className="w-12 h-1 bg-border-base rounded-full" />
                            </div>

                            <div className="px-6 pb-6">
                                {/* 標題 */}
                                <div className="flex items-center gap-3 mb-4">
                                    <span className={`w-1 h-6 ${isGoldTheme(selectedLocation) ? "bg-gold" : "bg-silver"}`} />
                                    <div>
                                        <h2 className="text-xl font-bold text-primary">
                                            {selectedLocation.nameTW}
                                        </h2>
                                        <p className="text-muted italic text-sm">
                                            {selectedLocation.name}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-secondary leading-relaxed mb-4">
                                    {selectedLocation.description}
                                </p>

                                <Link
                                    href={`/locations/${selectedLocation.id}`}
                                    className={`btn-outline btn-sm w-full text-center ${!isGoldTheme(selectedLocation) ? "btn-outline-silver" : ""}`}
                                >
                                    查看詳情
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
