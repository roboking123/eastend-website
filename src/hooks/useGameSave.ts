'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import type { GameSave, SaveSlotInfo, SaveConflict, SaveSource } from '@/types/game';
import {
    getLocalSaves,
    getLocalSave,
    setLocalSave,
    deleteLocalSave,
    getLocalSlotInfos,
} from '@/lib/storage/localStorage';
import {
    getCloudSaves,
    getCloudSave,
    setCloudSave,
    deleteCloudSave,
    getCloudSlotInfos,
} from '@/lib/storage/cloudStorage';

interface UseGameSaveReturn {
    /** 存檔槽位資訊 */
    slots: SaveSlotInfo[];
    /** 是否正在載入 */
    loading: boolean;
    /** 錯誤訊息 */
    error: string | null;
    /** 存檔衝突列表 */
    conflicts: SaveConflict[];
    /** 是否使用雲端存檔 */
    isCloudEnabled: boolean;

    /** 取得特定槽位存檔 */
    getSave: (slotNumber: 1 | 2 | 3) => Promise<GameSave | null>;
    /** 儲存到特定槽位 */
    save: (slotNumber: 1 | 2 | 3, data: GameSave) => Promise<boolean>;
    /** 刪除特定槽位 */
    deleteSave: (slotNumber: 1 | 2 | 3) => Promise<boolean>;
    /** 重新載入槽位資訊 */
    refresh: () => Promise<void>;
    /** 解決存檔衝突 */
    resolveConflict: (slotNumber: 1 | 2 | 3, choice: 'local' | 'cloud') => Promise<void>;
    /** 將本地存檔遷移到雲端 */
    migrateToCloud: () => Promise<boolean>;
}

export function useGameSave(): UseGameSaveReturn {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const [slots, setSlots] = useState<SaveSlotInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [conflicts, setConflicts] = useState<SaveConflict[]>([]);

    const isCloudEnabled = isAuthenticated;

    /** 載入槽位資訊 */
    const loadSlots = useCallback(async () => {
        // 等待認證狀態確認後再開始載入
        if (authLoading) return;

        setLoading(true);
        setError(null);

        // 最小載入時間，避免骨架屏閃爍
        const minLoadTime = new Promise(resolve => setTimeout(resolve, 500));

        try {
            if (isCloudEnabled) {
                // 登入狀態：優先使用雲端存檔
                const [cloudSlots] = await Promise.all([
                    getCloudSlotInfos(),
                    minLoadTime, // 確保至少等待 500ms
                ]);
                const localSlots = getLocalSlotInfos();

                // 檢查衝突
                const newConflicts: SaveConflict[] = [];
                for (const slot of [1, 2, 3] as const) {
                    const localSave = getLocalSave(slot);
                    const cloudSave = await getCloudSave(slot);

                    if (localSave && cloudSave) {
                        // 兩邊都有存檔，檢查版本
                        const localTime = new Date(localSave.updatedAt).getTime();
                        const cloudTime = new Date(cloudSave.updatedAt).getTime();

                        if (Math.abs(localTime - cloudTime) > 1000) {
                            // 時間差超過 1 秒，視為衝突
                            newConflicts.push({
                                slotNumber: slot,
                                localSave,
                                cloudSave,
                                recommendation: localTime > cloudTime ? 'use_local' : 'use_cloud',
                            });
                        }
                    }
                }

                setConflicts(newConflicts);
                setSlots(cloudSlots);
            } else {
                // 訪客狀態：使用本地存檔（仍等待最小時間）
                await minLoadTime;
                setSlots(getLocalSlotInfos());
                setConflicts([]);
            }
        } catch (err) {
            setError('載入存檔失敗');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [isCloudEnabled, authLoading]);

    /** 取得特定槽位存檔 */
    const getSave = useCallback(async (slotNumber: 1 | 2 | 3): Promise<GameSave | null> => {
        if (isCloudEnabled) {
            return await getCloudSave(slotNumber);
        }
        return getLocalSave(slotNumber);
    }, [isCloudEnabled]);

    /** 儲存 */
    const save = useCallback(async (slotNumber: 1 | 2 | 3, data: GameSave): Promise<boolean> => {
        try {
            // 本地一定會存（作為備份）
            setLocalSave(slotNumber, data);

            // 如果登入，也存到雲端
            if (isCloudEnabled) {
                const success = await setCloudSave(slotNumber, data);
                if (!success) {
                    setError('雲端存檔失敗，已儲存到本地');
                    return false;
                }
            }

            await loadSlots();
            return true;
        } catch (err) {
            setError('儲存失敗');
            console.error(err);
            return false;
        }
    }, [isCloudEnabled, loadSlots]);

    /** 刪除 */
    const deleteSave = useCallback(async (slotNumber: 1 | 2 | 3): Promise<boolean> => {
        try {
            deleteLocalSave(slotNumber);

            if (isCloudEnabled) {
                await deleteCloudSave(slotNumber);
            }

            await loadSlots();
            return true;
        } catch (err) {
            setError('刪除失敗');
            console.error(err);
            return false;
        }
    }, [isCloudEnabled, loadSlots]);

    /** 解決衝突 */
    const resolveConflict = useCallback(async (slotNumber: 1 | 2 | 3, choice: 'local' | 'cloud') => {
        const conflict = conflicts.find(c => c.slotNumber === slotNumber);
        if (!conflict) return;

        if (choice === 'local') {
            // 用本地覆蓋雲端
            await setCloudSave(slotNumber, conflict.localSave);
        } else {
            // 用雲端覆蓋本地
            setLocalSave(slotNumber, conflict.cloudSave);
        }

        setConflicts(prev => prev.filter(c => c.slotNumber !== slotNumber));
        await loadSlots();
    }, [conflicts, loadSlots]);

    /** 遷移本地存檔到雲端 */
    const migrateToCloud = useCallback(async (): Promise<boolean> => {
        if (!isCloudEnabled) return false;

        try {
            const localSaves = getLocalSaves();

            for (const [slot, save] of Object.entries(localSaves)) {
                const slotNumber = parseInt(slot) as 1 | 2 | 3;
                const cloudSave = await getCloudSave(slotNumber);

                // 只有雲端沒有存檔時才遷移
                if (!cloudSave) {
                    await setCloudSave(slotNumber, save);
                }
            }

            await loadSlots();
            return true;
        } catch (err) {
            setError('遷移失敗');
            console.error(err);
            return false;
        }
    }, [isCloudEnabled, loadSlots]);

    // 初始載入和認證狀態變化時重新載入
    useEffect(() => {
        if (!authLoading) {
            loadSlots();
        }
    }, [loadSlots, user, authLoading]);

    return {
        slots,
        loading,
        error,
        conflicts,
        isCloudEnabled,
        getSave,
        save,
        deleteSave,
        refresh: loadSlots,
        resolveConflict,
        migrateToCloud,
    };
}
