import { content } from "@/constants/content";
import CharacterClient from "./CharacterClient";
import { notFound } from "next/navigation";

// Helper to get character data
function getCharacter(id: string) {
    return content.charactersPage.items.find((item) => item.id === id);
}

// Generate static params for SSG
export async function generateStaticParams() {
    return content.charactersPage.items.map((item) => ({
        id: item.id,
    }));
}

export default async function CharacterDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const character = getCharacter(id);

    if (!character) {
        notFound();
    }

    return <CharacterClient character={character} />;
}
