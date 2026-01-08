"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { content } from "@/constants/content";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const { logo, nav } = content.header;

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';
        return pathname.startsWith(path);
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border-base">
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
                                    ? "btn-active" // High Contrast (Dark/Gold) for Active
                                    : "btn-outline border-transparent hover:bg-primary hover:text-gold hover:border-gold"
                                    // Explicit override for Dark/Gold Hover using system tokens
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
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
                                    ? "bg-primary text-gold font-bold" // Mobile Active
                                    : "text-secondary hover:bg-primary hover:text-gold"
                                    }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                )}
            </div>
        </header>
    );
}
