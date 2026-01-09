import { SaveSlots } from '@/components/game';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '存檔管理 | 東末世界',
    description: '管理你的遊戲存檔，支援雲端同步',
};

export default function SavesPage() {
    return (
        <>
            {/* 標題區塊 */}
            <section className="pt-24 pb-12 px-4 bg-surface">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <h1 className="heading-section mb-4">
                            <span className="text-primary">存檔管理</span>
                        </h1>
                        <p className="text-muted max-w-2xl mx-auto text-lg leading-relaxed">
                            管理你的冒險記錄，支援雲端同步跨裝置遊玩
                        </p>
                    </div>
                </div>
            </section>

            {/* 存檔區塊 */}
            <section className="py-12 px-4 bg-background">
                <SaveSlots />
            </section>
        </>
    );
}
