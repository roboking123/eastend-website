import { createClient } from '@/lib/supabase/client';
import type { GameSave, SaveSlotInfo } from '@/types/game';

/** 從雲端取得所有存檔 */
export async function getCloudSaves(): Promise<Record<number, GameSave>> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('game_saves')
        .select('*')
        .order('slot_number');

    if (error) {
        console.error('取得雲端存檔失敗:', error.message);
        return {};
    }

    const saves: Record<number, GameSave> = {};
    data?.forEach((row) => {
        saves[row.slot_number] = mapRowToGameSave(row);
    });

    return saves;
}

/** 取得特定槽位的雲端存檔 */
export async function getCloudSave(slotNumber: 1 | 2 | 3): Promise<GameSave | null> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('game_saves')
        .select('*')
        .eq('slot_number', slotNumber)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null; // 無資料
        console.error('取得雲端存檔失敗:', error.message);
        return null;
    }

    return mapRowToGameSave(data);
}

/** 儲存到雲端特定槽位（upsert） */
export async function setCloudSave(slotNumber: 1 | 2 | 3, save: GameSave): Promise<boolean> {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        console.error('未登入，無法儲存到雲端');
        return false;
    }

    const row = {
        user_id: user.id,
        slot_number: slotNumber,
        save_name: save.saveName,
        character_data: save.characterData,
        progress_data: save.progressData,
        inventory_data: save.inventoryData,
        is_public: save.isPublic || false,
        share_code: save.shareCode,
    };

    const { error } = await supabase
        .from('game_saves')
        .upsert(row, { onConflict: 'user_id,slot_number' });

    if (error) {
        console.error('儲存到雲端失敗:', error.message);
        return false;
    }

    return true;
}

/** 刪除雲端特定槽位的存檔 */
export async function deleteCloudSave(slotNumber: 1 | 2 | 3): Promise<boolean> {
    const supabase = createClient();

    const { error } = await supabase
        .from('game_saves')
        .delete()
        .eq('slot_number', slotNumber);

    if (error) {
        console.error('刪除雲端存檔失敗:', error.message);
        return false;
    }

    return true;
}

/** 取得雲端槽位資訊 */
export async function getCloudSlotInfos(): Promise<SaveSlotInfo[]> {
    const saves = await getCloudSaves();

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

/** 將資料庫 row 轉換為 GameSave */
function mapRowToGameSave(row: Record<string, unknown>): GameSave {
    return {
        id: row.id as string,
        slotNumber: row.slot_number as 1 | 2 | 3,
        saveName: row.save_name as string,
        createdAt: row.created_at as string,
        updatedAt: row.updated_at as string,
        version: row.version as number,
        characterData: row.character_data as GameSave['characterData'],
        progressData: row.progress_data as GameSave['progressData'],
        inventoryData: row.inventory_data as GameSave['inventoryData'],
        isPublic: row.is_public as boolean,
        shareCode: row.share_code as string | undefined,
    };
}
