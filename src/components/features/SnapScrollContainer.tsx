"use client";

import { useEffect, useRef, useState, ReactNode, useCallback } from "react";

interface SnapScrollContainerProps {
    children: ReactNode;
    resistanceThreshold?: number; // 阻力閾值，需要累積多少滾動量才觸發跳轉（像素）
}

export default function SnapScrollContainer({
    children,
    resistanceThreshold = 80, // 預設 80px 阻力
}: SnapScrollContainerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [showTopIndicator, setShowTopIndicator] = useState(false);
    const [showBottomIndicator, setShowBottomIndicator] = useState(false);
    const [indicatorProgress, setIndicatorProgress] = useState(0);

    // 累積的滾動量（用於阻力計算）
    const accumulatedDeltaRef = useRef(0);
    const isAnimatingRef = useRef(false);
    const currentSectionRef = useRef(0);
    const sectionsRef = useRef<HTMLElement[]>([]);

    // 計算區塊資訊
    const getSectionInfo = useCallback(() => {
        const container = containerRef.current;
        if (!container) return [];

        const sections = Array.from(container.querySelectorAll<HTMLElement>('.snap-section'));
        sectionsRef.current = sections;

        let cumulativeTop = 0;
        return sections.map((section, index) => {
            const height = section.offsetHeight;
            const top = cumulativeTop;
            cumulativeTop += height;
            return { index, top, height, bottom: top + height };
        });
    }, []);

    // 滾動到指定區塊
    const scrollToSection = useCallback((index: number, alignToBottom = false) => {
        const container = containerRef.current;
        const sectionInfo = getSectionInfo();
        if (!container || !sectionInfo[index]) return;

        isAnimatingRef.current = true;
        const section = sectionInfo[index];
        const viewportHeight = container.clientHeight;

        let targetScroll = section.top;

        // 如果區塊比視窗大且需要對齊底部
        if (alignToBottom && section.height > viewportHeight) {
            targetScroll = section.bottom - viewportHeight;
        }

        container.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
        });

        currentSectionRef.current = index;

        // 等待動畫完成
        setTimeout(() => {
            isAnimatingRef.current = false;
            accumulatedDeltaRef.current = 0;
        }, 500);
    }, [getSectionInfo]);

    // 處理滾輪事件
    const handleWheel = useCallback((e: WheelEvent) => {
        if (isAnimatingRef.current) {
            e.preventDefault();
            return;
        }

        const container = containerRef.current;
        const sectionInfo = getSectionInfo();
        if (!container || sectionInfo.length === 0) return;

        const scrollTop = container.scrollTop;
        const viewportHeight = container.clientHeight;
        const currentSection = sectionInfo[currentSectionRef.current];
        if (!currentSection) return;

        // 計算當前區塊的可滾動範圍
        const sectionScrollableTop = currentSection.top;
        const sectionScrollableBottom = Math.max(
            currentSection.top,
            currentSection.bottom - viewportHeight
        );

        const isAtSectionTop = scrollTop <= sectionScrollableTop + 1;
        const isAtSectionBottom = scrollTop >= sectionScrollableBottom - 1;

        // 向下滾動
        if (e.deltaY > 0) {
            if (isAtSectionBottom) {
                const nextIndex = currentSectionRef.current + 1;
                const isLastSection = nextIndex >= sectionInfo.length;

                // 到達區塊底部，開始累積阻力
                e.preventDefault();
                accumulatedDeltaRef.current += e.deltaY;
                const progress = Math.min(accumulatedDeltaRef.current / resistanceThreshold, 1);
                setIndicatorProgress(progress);
                setShowBottomIndicator(true);
                setShowTopIndicator(false);

                // 超過閾值，跳到下一區塊
                if (accumulatedDeltaRef.current >= resistanceThreshold) {
                    setShowBottomIndicator(false);
                    if (!isLastSection) {
                        scrollToSection(nextIndex, false); // 對齊上緣
                    } else {
                        // 已經是最後一個區塊，滾動到內容末尾
                        const container = containerRef.current;
                        if (container) {
                            isAnimatingRef.current = true;
                            container.scrollTo({
                                top: container.scrollHeight - container.clientHeight,
                                behavior: 'smooth'
                            });
                            setTimeout(() => {
                                isAnimatingRef.current = false;
                                accumulatedDeltaRef.current = 0;
                            }, 500);
                        }
                    }
                }
            } else {
                // 區塊內正常滾動
                accumulatedDeltaRef.current = 0;
                setShowBottomIndicator(false);
                setShowTopIndicator(false);
            }
        }
        // 向上滾動
        else if (e.deltaY < 0) {
            if (isAtSectionTop) {
                // 到達區塊頂部，開始累積阻力
                e.preventDefault();
                accumulatedDeltaRef.current += Math.abs(e.deltaY);
                const progress = Math.min(accumulatedDeltaRef.current / resistanceThreshold, 1);
                setIndicatorProgress(progress);
                setShowTopIndicator(true);
                setShowBottomIndicator(false);

                // 超過閾值，跳到上一區塊
                if (accumulatedDeltaRef.current >= resistanceThreshold) {
                    const prevIndex = currentSectionRef.current - 1;
                    if (prevIndex >= 0) {
                        setShowTopIndicator(false);
                        scrollToSection(prevIndex, true); // 對齊下緣
                    } else {
                        // 已經是第一個區塊
                        accumulatedDeltaRef.current = 0;
                        setShowTopIndicator(false);
                    }
                }
            } else {
                // 區塊內正常滾動
                accumulatedDeltaRef.current = 0;
                setShowBottomIndicator(false);
                setShowTopIndicator(false);
            }
        }
    }, [getSectionInfo, resistanceThreshold, scrollToSection]);

    // 放開時重置並自動校正
    const handleWheelEnd = useCallback(() => {
        if (accumulatedDeltaRef.current > 0 && accumulatedDeltaRef.current < resistanceThreshold) {
            // 沒達到閾值，重置
            accumulatedDeltaRef.current = 0;
            setShowBottomIndicator(false);
            setShowTopIndicator(false);
            setIndicatorProgress(0);
        }

        // 自動校正：檢測當前位置並吸附到最近的區塊
        if (!isAnimatingRef.current) {
            const container = containerRef.current;
            const sectionInfo = getSectionInfo();
            if (!container || sectionInfo.length === 0) return;

            const scrollTop = container.scrollTop;
            const viewportHeight = container.clientHeight;

            // 找出當前滾動位置對應的區塊
            let currentIndex = 0;
            let minDistance = Infinity;

            for (let i = 0; i < sectionInfo.length; i++) {
                const section = sectionInfo[i];
                // 檢查區塊頂部的距離
                const distanceToTop = Math.abs(scrollTop - section.top);
                // 檢查區塊底部對齊視窗底部的距離
                const distanceToBottom = Math.abs(scrollTop - (section.bottom - viewportHeight));

                const distance = Math.min(distanceToTop, distanceToBottom);
                if (distance < minDistance) {
                    minDistance = distance;
                    currentIndex = i;
                }
            }

            // 如果偏離超過 5px，則自動校正
            if (minDistance > 5 && minDistance < viewportHeight * 0.5) {
                const section = sectionInfo[currentIndex];
                const distanceToTop = Math.abs(scrollTop - section.top);
                const distanceToBottom = Math.abs(scrollTop - (section.bottom - viewportHeight));

                isAnimatingRef.current = true;
                const targetScroll = distanceToTop <= distanceToBottom ? section.top : Math.max(section.top, section.bottom - viewportHeight);

                container.scrollTo({
                    top: targetScroll,
                    behavior: 'smooth'
                });

                currentSectionRef.current = currentIndex;

                setTimeout(() => {
                    isAnimatingRef.current = false;
                }, 500);
            }
        }
    }, [resistanceThreshold, getSectionInfo]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // 初始化區塊資訊
        getSectionInfo();

        container.addEventListener('wheel', handleWheel, { passive: false });

        // 使用 timeout 模擬 wheel end
        let wheelTimeout: NodeJS.Timeout;
        const wheelEndHandler = () => {
            clearTimeout(wheelTimeout);
            wheelTimeout = setTimeout(handleWheelEnd, 150);
        };
        container.addEventListener('wheel', wheelEndHandler);

        return () => {
            container.removeEventListener('wheel', handleWheel);
            container.removeEventListener('wheel', wheelEndHandler);
            clearTimeout(wheelTimeout);
        };
    }, [handleWheel, handleWheelEnd, getSectionInfo]);

    return (
        <div
            ref={containerRef}
            className="h-screen overflow-y-auto relative"
            style={{ scrollBehavior: 'auto' }}
        >
            {children}

            {/* 頂部弧形指示器 */}
            <div
                className={`fixed top-0 left-0 right-0 h-16 pointer-events-none transition-opacity duration-200 ${showTopIndicator ? 'opacity-100' : 'opacity-0'
                    }`}
                style={{
                    background: `radial-gradient(ellipse 100% 200% at 50% -50%, rgba(201, 162, 39, ${indicatorProgress * 0.3}) 0%, transparent 70%)`,
                }}
            />

            {/* 底部弧形指示器 */}
            <div
                className={`fixed bottom-0 left-0 right-0 h-16 pointer-events-none transition-opacity duration-200 ${showBottomIndicator ? 'opacity-100' : 'opacity-0'
                    }`}
                style={{
                    background: `radial-gradient(ellipse 100% 200% at 50% 150%, rgba(201, 162, 39, ${indicatorProgress * 0.3}) 0%, transparent 70%)`,
                }}
            />
        </div>
    );
}
