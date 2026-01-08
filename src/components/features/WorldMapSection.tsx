"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { locations } from "@/constants/locations";
import { content } from "@/constants/content";

export default function WorldMapSection() {
    // 狀態管理
    const [isListOpen, setIsListOpen] = useState(true);          // 左側列表是否展開
    const [isRightPanelOpen, setIsRightPanelOpen] = useState(true); // 右側詳情是否展開
    const [lockedLocation, setLockedLocation] = useState<typeof locations[0] | null>(null);  // 鎖定的地點
    const [hoveredLocation, setHoveredLocation] = useState<typeof locations[0] | null>(null); // Hover 中的地點

    // 實際顯示的地點：優先顯示 hover 的，否則顯示鎖定的
    const displayLocation = hoveredLocation || lockedLocation;
    // 面板可見性：有 hover 或者 (有鎖定且右側開啟)
    const showRightPanel = hoveredLocation || (lockedLocation && isRightPanelOpen);

    // 判斷配色
    const isGoldTheme = (loc: typeof locations[0]) => loc.theme === "gold";

    // 標記點互動邏輯
    const handleMarkerHover = useCallback((loc: typeof locations[0]) => {
        setHoveredLocation(loc);
    }, []);

    const handleMarkerLeave = useCallback(() => {
        setHoveredLocation(null);
    }, []);

    const handleMarkerClick = useCallback((loc: typeof locations[0]) => {
        setLockedLocation(loc);
        setHoveredLocation(null); // 點擊後清除 hover 狀態
        setIsRightPanelOpen(true); // 點擊時確保展開

        // 手機版：點擊地點時自動收起左側列表
        if (typeof window !== 'undefined' && window.innerWidth < 1024) {
            setIsListOpen(false);
        }
    }, []);

    const handleMapClick = useCallback(() => {
        // 點擊地圖空白處：解除鎖定
        setLockedLocation(null);
    }, []);

    const handleListItemClick = useCallback((loc: typeof locations[0]) => {
        // 列表點擊邏輯同標記點
        handleMarkerClick(loc);
    }, [handleMarkerClick]);

    const toggleList = useCallback(() => {
        setIsListOpen(prev => !prev);
        // 手機版：展開列表時收起詳情
        if (typeof window !== 'undefined' && window.innerWidth < 1024 && !isListOpen) {
            // 注意：這裡我們只收起右側面板，而不是清除鎖定，這樣用戶切回來時還能看到
            setIsRightPanelOpen(false);
        }
    }, [isListOpen]);

    const toggleRightPanel = useCallback(() => {
        // 如果沒有鎖定地點，則無法切換（或無效）
        if (!lockedLocation && !hoveredLocation) return;

        setIsRightPanelOpen(prev => !prev);

        // 手機版：展開詳情時收起列表
        // 注意：如果是要展開 (!isRightPanelOpen 為 true)
        if (typeof window !== 'undefined' && window.innerWidth < 1024 && !isRightPanelOpen) {
            setIsListOpen(false);
        }
    }, [isRightPanelOpen, lockedLocation, hoveredLocation]);

    // 動畫配置
    // 直接在元素上使用 animate={{ x: ... }}，不再需要複雜的 variants

    // 判斷標記點是否為當前顯示的
    const isMarkerActive = (loc: typeof locations[0]) => displayLocation?.id === loc.id;

    return (
        <section className="h-[calc(100vh)] bg-surface overflow-hidden flex flex-col pt-16 relative">
            {/* 左側列表面板容器 - 移至根層級，跨越標題與地圖 */}
            <motion.div
                className="absolute left-0 top-16 bottom-0 z-20 flex items-center"
                initial={false}
                animate={{ x: isListOpen ? 0 : -256 }} // 256px 是 w-64 的寬度
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                {/* 列表面板 */}
                <div className="h-full w-64 bg-background/95 backdrop-blur-sm border-r border-border-base overflow-y-auto">
                    <div className="p-4">
                        <h3 className="text-lg font-bold text-primary mb-4">地點列表</h3>
                        <div className="space-y-2">
                            {locations.map((loc) => (
                                <button
                                    key={loc.id}
                                    onClick={() => handleListItemClick(loc)}
                                    className={`w-full text-left px-3 py-2 rounded-lg transition-all ${lockedLocation?.id === loc.id
                                        ? isGoldTheme(loc)
                                            ? "bg-primary text-gold"
                                            : "bg-primary text-silver"
                                        : "text-secondary hover:bg-surface"
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${isGoldTheme(loc) ? "bg-gold" : "bg-silver"
                                            }`} />
                                        <span className="font-medium">{loc.nameTW}</span>
                                    </div>
                                    <span className="text-xs text-muted ml-4">{loc.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 展開/收合按鈕 */}
                <button
                    onClick={toggleList}
                    className="w-6 h-12 rounded-r-full bg-primary/90 backdrop-blur-sm flex items-center justify-center hover:bg-primary transition-colors shadow-lg"
                    aria-label={isListOpen ? "收合列表" : "展開列表"}
                >
                    <span className="text-gold text-xs pl-1">
                        {isListOpen ? "◀" : "▶"}
                    </span>
                </button>
            </motion.div>

            {/* 右側詳情面板容器 - 移至根層級，跨越標題與地圖 */}
            <motion.div
                className="absolute right-0 top-16 bottom-0 z-20 flex items-center"
                initial={false}
                animate={{ x: (showRightPanel && displayLocation) ? 0 : 320 }} // 320px 是 w-80 的寬度
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                {/* 展開/收合按鈕 */}
                <button
                    onClick={toggleRightPanel}
                    className={`w-6 h-12 rounded-l-full bg-primary/90 backdrop-blur-sm flex items-center justify-center transition-colors shadow-lg z-30 ${displayLocation ? "hover:bg-primary cursor-pointer" : "opacity-50 cursor-not-allowed"
                        }`}
                    aria-label={showRightPanel ? "收合詳情" : "展開詳情"}
                    disabled={!displayLocation}
                >
                    <span className={`text-xs pr-1 ${displayLocation
                        ? (isGoldTheme(displayLocation) ? "text-gold" : "text-silver")
                        : "text-muted"
                        }`}>
                        {showRightPanel ? "▶" : "◀"}
                    </span>
                </button>

                {/* 詳情面板內容 */}
                <div className="h-full w-80 bg-background/95 backdrop-blur-sm border-l border-border-base overflow-y-auto">
                    {displayLocation ? (
                        <div className="p-6">
                            {/* 標題區 */}
                            <div className="flex items-center gap-3 mb-6">
                                <span className={`w-1 h-8 ${isGoldTheme(displayLocation) ? "bg-gold" : "bg-silver"}`} />
                                <div>
                                    <h2 className="text-2xl font-bold text-primary">
                                        {displayLocation.nameTW}
                                    </h2>
                                    <p className="text-muted italic text-sm">
                                        {displayLocation.name}
                                    </p>
                                </div>
                            </div>

                            <div className="w-full h-px bg-border-base mb-6" />

                            {/* 描述 */}
                            <p className="text-secondary leading-relaxed mb-6">
                                {displayLocation.description}
                            </p>

                            {/* 鎖定狀態指示 */}
                            {lockedLocation?.id === displayLocation.id ? (
                                <p className="text-xs text-muted mb-4">
                                    📌 已固定顯示 · 點擊地圖空白處取消
                                </p>
                            ) : (
                                <p className="text-xs text-muted mb-4">
                                    👆 點擊標記點可固定顯示
                                </p>
                            )}

                            {/* 查看詳情按鈕 */}
                            <Link
                                href={`/locations/${displayLocation.id}`}
                                className={`btn-outline btn-sm ${!isGoldTheme(displayLocation) ? "btn-outline-silver" : ""
                                    }`}
                            >
                                查看詳情 →
                            </Link>
                        </div>
                    ) : (
                        <div className="p-6 text-center text-muted mt-20">
                            請選擇地點以查看詳情
                        </div>
                    )}
                </div>
            </motion.div>

            {/* 標題區域 - 靜態定位，不與地圖重疊 */}
            <div className="flex-none py-4 text-center z-10 w-full bg-surface/50 backdrop-blur-sm pointer-events-none">
                <h1 className="text-3xl md:text-5xl font-bold text-primary drop-shadow-xl opacity-90">
                    {content.worldMapSection.title}
                </h1>
                <p className="text-muted mt-2 text-lg drop-shadow-md opacity-80">
                    {content.worldMapSection.description}
                </p>
            </div>

            {/* 地圖與面板的主容器 - 佔據剩餘空間 */}
            <div className="flex-1 relative w-full h-full overflow-hidden">
                {/* 中央地圖區域 */}
                <div
                    className="absolute inset-0 flex items-center justify-center bg-surface"
                    onClick={handleMapClick}
                >
                    {/* 底圖 */}
                    <div className="relative w-full h-full max-w-4xl max-h-full p-4 mx-auto">
                        <Image
                            src="/images/map_interactive.png"
                            alt="East End World Map"
                            fill
                            className="object-contain"
                            priority
                        />

                        {/* 標記點 */}
                        {locations.map((loc) => (
                            <button
                                key={loc.id}
                                className={`absolute transform -translate-x-1/2 -translate-y-full z-10 transition-all duration-300 group cursor-pointer ${isMarkerActive(loc) ? "scale-125 z-20" : "scale-100 hover:scale-110 z-10"
                                    }`}
                                style={{
                                    left: `${loc.position.x}%`,
                                    top: `${loc.position.y}%`,
                                }}
                                onMouseEnter={() => handleMarkerHover(loc)}
                                onMouseLeave={handleMarkerLeave}
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
                                        className={`w-10 h-10 drop-shadow-lg filter transition-colors ${isMarkerActive(loc)
                                            ? isGoldTheme(loc) ? "text-gold" : "text-silver"
                                            : isGoldTheme(loc) ? "text-gold/80 hover:text-gold" : "text-silver/80 hover:text-silver"
                                            }`}
                                    >
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                    </svg>

                                    {/* 懸浮動畫效果 - 針尖陰影 */}
                                    <div className="absolute -bottom-1 w-4 h-1 bg-black/30 rounded-[100%] blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity" />

                                    {/* 地點名稱標籤 - 移到針的上方或旁邊比較清楚，這裡設在上方 */}
                                    <div className={`absolute bottom-full mb-1 whitespace-nowrap text-sm font-bold px-2 py-0.5 rounded backdrop-blur-sm shadow-sm transition-all
                                        ${isMarkerActive(loc)
                                            ? "opacity-100 bg-background/80 translate-y-0"
                                            : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
                                        } 
                                        ${isGoldTheme(loc) ? "text-black border border-gold/30" : "text-black border border-silver/30"}`}>
                                        {loc.nameTW}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
