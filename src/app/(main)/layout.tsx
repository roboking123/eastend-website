import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-surface text-primary">
            <Header />
            <main>{children}</main>
            <Footer />
        </div>
    );
}
