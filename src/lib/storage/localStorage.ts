import type { GameSave, SaveSlotInfo } from '@/types/game';

const STORAGE_KEY = 'eastend_game_saves';

/** 從 localStorage 取得所有存檔 */
export function getLocalSaves(): Record<number, GameSave> {
    if (typeof window === 'undefined') return {};

    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : {};
    } catch {
        console.error('讀取本地存檔失敗');
        return {};
    }
}

/** 取得特定槽位的存檔 */
export function getLocalSave(slotNumber: 1 | 2 | 3): GameSave | null {
    const saves = getLocalSaves();
    return saves[slotNumber] || null;
}

/** 儲存到特定槽位 */
export function setLocalSave(slotNumber: 1 | 2 | 3, save: GameSave): void {
    if (typeof window === 'undefined') return;

    try {
        const saves = getLocalSaves();
        saves[slotNumber] = {
            ...save,
            slotNumber,
            updatedAt: new Date().toISOString(),
            version: (save.version || 0) + 1,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));
    } catch {
        console.error('儲存本地存檔失敗');
    }
}

/** 刪除特定槽位的存檔 */
export function deleteLocalSave(slotNumber: 1 | 2 | 3): void {
    if (typeof window === 'undefined') return;

    try {
        const saves = getLocalSaves();
        delete saves[slotNumber];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));
    } catch {
        console.error('刪除本地存檔失敗');
    }
}

/** 取得所有槽位資訊 */
export function getLocalSlotInfos(): SaveSlotInfo[] {
    const saves = getLocalSaves();

    return [1, 2, 3].map((slotNumber) => {
        const save = saves[slotNumber];

        if (!save) {
            return {
                slotNumber: slotNumber as 1 | 2 | 3,
                isEmpty: true,
            };
        }

        return {
            slotNumber: slotNumber as 1 | 2 | 3,
            isEmpty: false,
            saveName: save.saveName,
            updatedAt: save.updatedAt,
            characterName: save.characterData?.name,
            characterLevel: save.characterData?.level,
            playTime: save.progressData?.playTime,
        };
    });
}

/** 匯出所有存檔（用於備份） */
export function exportLocalSaves(): string {
    const saves = getLocalSaves();
    return JSON.stringify(saves, null, 2);
}

/** 匯入存檔（用於還原） */
export function importLocalSaves(jsonString: string): boolean {
    try {
        const saves = JSON.parse(jsonString);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));
        return true;
    } catch {
        console.error('匯入存檔失敗');
        return false;
    }
}

/** 清除所有本地存檔 */
export function clearAllLocalSaves(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
}
