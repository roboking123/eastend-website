"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { content } from "@/constants/content";
import { AuthButton } from "@/components/auth";
import { useThemeSafe } from "@/contexts/ThemeContext";

interface HeaderProps {
    sticky?: boolean; // true = relative/sticky (for scroll pages), false = fixed (default)
}

export default function Header({ sticky = false }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const { logo, nav } = content.header;
    const { theme } = useThemeSafe();

    // 根據主題選擇活躍按鈕樣式
    const activeClass = theme === 'silver' ? 'btn-active-silver' : 'btn-active';
    const hoverColor = theme === 'silver' ? 'silver' : 'gold';

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';
        return pathname.startsWith(path);
    };

    const positionClass = sticky
        ? "sticky top-0" // 相對定位，跟隨區塊滾動
        : "fixed top-0 left-0 right-0"; // 固定定位

    return (
        <header className={`${positionClass} z-50 bg-background/95 backdrop-blur-md border-b border-border-base`}>
            <div className="container-base">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2"
                        onClick={(e) => {
                            if (window.location.pathname === '/') {
                                e.preventDefault();
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                        }}
                    >
                        <span className="text-2xl font-bold text-primary">
                            {logo}
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {nav.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`btn-sm transition-all duration-300 ${isActive(item.href)
                                    ? activeClass
                                    : `btn-outline border-transparent hover:bg-primary hover:text-${hoverColor} hover:border-${hoverColor}`
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <AuthButton />
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="切換選單"
                    >
                        <svg
                            className="w-6 h-6 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <nav className="md:hidden py-4 border-t border-border-base">
                        {nav.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`block py-3 px-4 rounded-lg transition-all ${isActive(item.href)
                                    ? `bg-primary text-${hoverColor} font-bold`
                                    : `text-secondary hover:bg-primary hover:text-${hoverColor}`
                                    }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <div className="px-4 py-3 border-t border-border-base mt-2">
                            <AuthButton />
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
}
