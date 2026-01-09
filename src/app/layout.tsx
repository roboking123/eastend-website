import type { Metadata } from "next";
import { Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import { ModalProvider } from "@/components/ui";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "./globals.css";

const notoSans = Noto_Sans_TC({
    subsets: ["latin"],
    variable: "--font-noto-sans",
    weight: ["400", "500", "600", "700"],
});

const notoSerif = Noto_Serif_TC({
    subsets: ["latin"],
    variable: "--font-noto-serif",
    weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
    title: "東末世界 | East End World",
    description: "一個被虛無之海包圍的獨特世界。人類與吸血鬼在脆弱的平衡中共存。",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh-TW">
            <body className={`${notoSans.variable} ${notoSerif.variable} antialiased`}>
                <ThemeProvider>
                    <ModalProvider>
                        {children}
                    </ModalProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}

