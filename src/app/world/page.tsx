import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WorldMapSection from "@/components/features/WorldMapSection";

export default function WorldPage() {
    return (
        <div className="min-h-screen bg-background text-primary">
            <Header />

            <main>
                <WorldMapSection />
            </main>

            <Footer />
        </div>
    );
}
