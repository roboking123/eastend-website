"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// 支援的主題類型
export type Theme = "gold" | "silver";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * 主題 Provider - 在 layout 中包裹整個應用
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>("gold"); // 預設金色

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

/**
 * 取得當前主題的 Hook
 */
export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}

/**
 * 安全版本：在非 Provider 內也不會報錯，返回預設金色
 */
export function useThemeSafe(): ThemeContextType {
    const context = useContext(ThemeContext);
    return context ?? { theme: "gold", setTheme: () => { } };
}
