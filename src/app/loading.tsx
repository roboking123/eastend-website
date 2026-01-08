export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
            <div className="relative flex flex-col items-center">
                {/* 呼吸動畫圓圈 */}
                <div className="w-16 h-16 rounded-full border-2 border-gold animate-[ping_2s_linear_infinite] opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                <div className="w-12 h-12 rounded-full border-2 border-gold animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] mb-4"></div>

                {/* 載入文字 */}
                <div className="text-primary font-serif tracking-[0.2em] text-sm animate-pulse">
                    LOADING
                </div>
            </div>
        </div>
    );
}
