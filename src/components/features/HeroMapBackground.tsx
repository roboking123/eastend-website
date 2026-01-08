"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroMapBackground() {
    return (
        <motion.div
            className="absolute inset-0 z-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 0.8 }}
        >
            <div
                className="relative w-full h-full"
            >
                <Image
                    src="/images/map_interactive.png"
                    alt="Background Map"
                    fill
                    className="object-cover"
                    style={{ filter: "blur(8px)" }}
                    priority
                />
            </div>
        </motion.div>
    );
}
