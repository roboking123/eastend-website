"use client";

import { useEffect } from "react";
import { useThemeSafe, Theme } from "@/contexts/ThemeContext";

/**
 * 主題設置器 - 在頁面中設置主題，用於服務端組件頁面
 */
export default function ThemeSetter({ theme }: { theme: Theme }) {
    const { setTheme } = useThemeSafe();

    useEffect(() => {
        setTheme(theme);
        return () => setTheme("gold"); // 離開頁面時重置為金色
    }, [theme, setTheme]);

    return null; // 不渲染任何 UI
}
