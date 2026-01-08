"use client";

import Link from "next/link";
import { Noto_Serif_TC } from "next/font/google";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const notoSerif = Noto_Serif_TC({
    subsets: ["latin"],
    weight: ["700"],
});

export default function NotFound() {
    const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; duration: number }[]>([]);

    useEffect(() => {
        setParticles([...Array(30)].map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 1,
            duration: Math.random() * 10 + 10,
        })));
    }, []);

    return (
        <div className="min-h-screen bg-primary flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
            {/* 虛無粒子特效 */}
            <div className="absolute inset-0 pointer-events-none">
                {particles.map((p) => (
                    <motion.div
                        key={p.id}
                        className="absolute bg-white/20 rounded-full blur-[1px]"
                        style={{
                            left: `${p.x}%`,
                            top: `${p.y}%`,
                            width: p.size,
                            height: p.size,
                        }}
                        animate={{
                            y: [0, -100],
                            opacity: [0, 0.5, 0],
                        }}
                        transition={{
                            duration: p.duration,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 5,
                        }}
                    />
                ))}
            </div>

            {/* 裝飾背景 */}
            <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-gold rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>
            </div>

            <div className="relative z-10 max-w-lg mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 0.2, y: 0 }}
                    transition={{ duration: 1 }}
                    className={`${notoSerif.className} text-[120px] leading-none text-gold font-bold select-none`}
                >
                    404
                </motion.h1>

                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="heading-section text-white mb-6 -mt-10"
                >
                    迷失在虛無之海
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="text-body text-muted mb-12"
                >
                    你已經偏離了已知的世界邊界。<br />
                    前方只有無盡的虛無與吞噬一切的黑暗。
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                >
                    <Link
                        href="/"
                        className="btn-inverse"
                    >
                        回到火的庇護 (首頁)
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
