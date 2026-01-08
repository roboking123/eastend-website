/** 遊戲存檔資料結構 */
export interface GameSave {
    id?: string;
    slotNumber: 1 | 2 | 3;
    saveName: string;
    createdAt: string;
    updatedAt: string;
    version: number;

    /** 角色資料 */
    characterData: CharacterData;
    /** 遊戲進度 */
    progressData: ProgressData;
    /** 物品欄 */
    inventoryData: InventoryData;

    /** 是否公開（用於分享） */
    isPublic?: boolean;
    /** 分享碼 */
    shareCode?: string;
}

/** 角色資料 */
export interface CharacterData {
    name: string;
    race: string;
    class: string;
    level: number;
    experience: number;
    stats: {
        strength: number;
        agility: number;
        intelligence: number;
        vitality: number;
    };
    appearance?: {
        hairColor?: string;
        eyeColor?: string;
        skinTone?: string;
    };
}

/** 遊戲進度 */
export interface ProgressData {
    currentChapter: number;
    currentLocation: string;
    completedQuests: string[];
    unlockedAreas: string[];
    decisions: Record<string, string>;
    flags: Record<string, boolean>;
    playTime: number; // 秒
}

/** 物品欄 */
export interface InventoryData {
    items: InventoryItem[];
    gold: number;
    maxSlots: number;
}

export interface InventoryItem {
    id: string;
    name: string;
    quantity: number;
    type: 'weapon' | 'armor' | 'consumable' | 'quest' | 'misc';
}

/** 存檔槽資訊（用於列表顯示） */
export interface SaveSlotInfo {
    slotNumber: 1 | 2 | 3;
    isEmpty: boolean;
    saveName?: string;
    updatedAt?: string;
    characterName?: string;
    characterLevel?: number;
    playTime?: number;
}

/** 存檔來源 */
export type SaveSource = 'local' | 'cloud';

/** 存檔衝突資訊 */
export interface SaveConflict {
    slotNumber: 1 | 2 | 3;
    localSave: GameSave;
    cloudSave: GameSave;
    recommendation: 'use_local' | 'use_cloud' | 'manual';
}
