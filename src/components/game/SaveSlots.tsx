'use client';

import { useGameSave } from '@/hooks/useGameSave';
import { useAuth } from '@/hooks/useAuth';
import { useModal } from '@/components/ui';
import styles from './SaveSlots.module.css';
import type { SaveSlotInfo } from '@/types/game';

/** 格式化遊戲時間 */
function formatPlayTime(seconds?: number): string {
    if (!seconds) return '--:--:--';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/** 格式化日期 */
function formatDate(dateString?: string): string {
    if (!dateString) return '---';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}

interface SaveSlotCardProps {
    slot: SaveSlotInfo;
    onLoad: () => void;
    onSave: () => void;
    onDelete: () => void;
    onEdit: () => void;
}

function SaveSlotCard({ slot, onLoad, onSave, onDelete, onEdit }: SaveSlotCardProps) {
    return (
        <div className={`card overflow-hidden h-full flex flex-col ${slot.isEmpty ? 'opacity-70 border-dashed' : ''}`}>
            {/* 頂部裝飾條 */}
            <div className="h-1 w-full bg-gold"></div>

            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <span className="tag">存檔 {slot.slotNumber}</span>
                    {!slot.isEmpty && (
                        <button
                            className="text-muted hover:text-red-500 transition-colors p-1"
                            onClick={onDelete}
                            aria-label="刪除存檔"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {slot.isEmpty ? (
                    <div className="flex flex-col items-center justify-center flex-1 gap-4">
                        <span className="text-muted">空存檔槽</span>
                        <button className="btn-outline btn-sm" onClick={onSave}>
                            新建存檔
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-primary mb-1">
                                {slot.saveName || '未命名存檔'}
                            </h3>
                            <div className="flex justify-between text-sm text-secondary mb-3">
                                <span>{slot.characterName || '未知角色'}</span>
                                <span>Lv.{slot.characterLevel || 1}</span>
                            </div>
                            <div className="text-xs text-muted space-y-1 mb-4">
                                <div>遊戲時間: {formatPlayTime(slot.playTime)}</div>
                                <div>{formatDate(slot.updatedAt)}</div>
                            </div>
                        </div>

                        <div className="mt-auto pt-4">
                            <div className="flex gap-2 mb-2">
                                <button className="btn-outline btn-sm flex-1" onClick={onLoad}>
                                    讀取
                                </button>
                                <button className="btn-outline btn-sm flex-1" onClick={onSave}>
                                    覆蓋
                                </button>
                            </div>
                            <button className="btn-outline btn-sm w-full" onClick={onEdit}>
                                編輯名稱
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export function SaveSlots() {
    const { slots, loading, error, isCloudEnabled, save, getSave, deleteSave, conflicts, refresh } = useGameSave();
    const { isAuthenticated } = useAuth();
    const modal = useModal();

    const handleLoad = async (slotNumber: 1 | 2 | 3) => {
        // 讀取存檔（實際遊戲會在這裡載入角色資料）
        await modal.alert('讀取存檔', `存檔 ${slotNumber}\n\n此功能需要遊戲系統整合後才能使用。\n目前僅展示存檔 UI。`);
    };

    const handleSave = async (slotNumber: 1 | 2 | 3) => {
        const slot = slots.find(s => s.slotNumber === slotNumber);

        // 如果是空槽位，建立新存檔（測試用）
        if (slot?.isEmpty) {
            const result = await modal.form('建立新冒險', [
                {
                    label: '存檔名稱',
                    name: 'saveName',
                    defaultValue: '新冒險',
                    placeholder: '輸入存檔名稱'
                },
                {
                    label: '角色名稱',
                    name: 'characterName',
                    defaultValue: '冒險者',
                    placeholder: '輸入角色名稱'
                }
            ]);

            if (!result) return;

            const testSave = {
                slotNumber,
                saveName: result.saveName,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                version: 1,
                characterData: {
                    name: result.characterName,
                    race: '人類',
                    class: '冒險者',
                    level: 1,
                    experience: 0,
                    stats: { strength: 10, agility: 10, intelligence: 10, vitality: 10 },
                },
                progressData: {
                    currentChapter: 1,
                    currentLocation: '東末城',
                    completedQuests: [],
                    unlockedAreas: ['東末城'],
                    decisions: {},
                    flags: {},
                    playTime: 0,
                },
                inventoryData: {
                    items: [],
                    gold: 100,
                    maxSlots: 20,
                },
            };

            const success = await save(slotNumber, testSave);
            if (success) {
                // 自動刷新，不顯示確認對話框
                refresh();
            }
        } else {
            // 覆蓋現有存檔
            const confirmed = await modal.confirm('覆蓋存檔', `確定要覆蓋存檔 ${slotNumber}「${slot?.saveName}」嗎？`);
            if (confirmed) {
                await modal.alert('功能開發中', '覆蓋功能需要遊戲系統整合後才能使用。');
            }
        }
    };

    const handleDelete = async (slotNumber: 1 | 2 | 3) => {
        const slot = slots.find(s => s.slotNumber === slotNumber);
        const confirmed = await modal.danger('刪除存檔', `確定要刪除存檔 ${slotNumber}「${slot?.saveName}」嗎？\n此操作無法復原。`);
        if (confirmed) {
            const success = await deleteSave(slotNumber);
            if (success) {
                // 自動刷新，不顯示確認對話框
                refresh();
            }
        }
    };

    const handleEdit = async (slotNumber: 1 | 2 | 3) => {
        const currentSave = await getSave(slotNumber);
        if (!currentSave) return;

        const result = await modal.form('編輯存檔資料', [
            {
                label: '存檔名稱',
                name: 'saveName',
                defaultValue: currentSave.saveName,
                placeholder: '輸入存檔名稱'
            },
            {
                label: '角色名稱',
                name: 'characterName',
                defaultValue: currentSave.characterData.name,
                placeholder: '輸入角色名稱'
            }
        ]);

        if (!result) return;

        const updatedSave = {
            ...currentSave,
            saveName: result.saveName,
            characterData: {
                ...currentSave.characterData,
                name: result.characterName,
            },
        };

        const success = await save(slotNumber, updatedSave);
        if (success) {
            refresh();
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto">
                {/* 骨架屏雲端狀態 */}
                <div className="flex justify-center mb-6">
                    <div className="h-6 w-40 bg-border-base rounded-full animate-pulse"></div>
                </div>

                {/* 骨架屏卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="card overflow-hidden">
                            {/* 頂部金條 */}
                            <div className="h-1 w-full bg-border-base animate-pulse"></div>

                            <div className="p-6">
                                {/* 標籤骨架 */}
                                <div className="h-5 w-16 bg-border-base rounded-full animate-pulse mb-4"></div>

                                {/* 標題骨架 */}
                                <div className="h-6 w-32 bg-border-base rounded animate-pulse mb-2"></div>

                                {/* 內容骨架 */}
                                <div className="space-y-2 mb-4">
                                    <div className="h-4 w-full bg-border-base rounded animate-pulse"></div>
                                    <div className="h-4 w-3/4 bg-border-base rounded animate-pulse"></div>
                                </div>

                                {/* 按鈕骨架 */}
                                <div className="flex gap-2">
                                    <div className="h-9 flex-1 bg-border-base rounded-full animate-pulse"></div>
                                    <div className="h-9 flex-1 bg-border-base rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* 雲端狀態 */}
            <div className={styles.cloudStatus}>
                {isCloudEnabled ? (
                    <span className={styles.cloudEnabled}>☁️ 雲端同步已啟用</span>
                ) : (
                    <span className={styles.cloudDisabled}>📱 本地存檔模式</span>
                )}
            </div>

            {!isAuthenticated && (
                <div className={styles.loginHint}>
                    登入後可啟用雲端存檔，跨裝置同步你的遊戲進度
                </div>
            )}

            {error && <div className={styles.error}>{error}</div>}

            {conflicts.length > 0 && (
                <div className={styles.conflictWarning}>
                    ⚠️ 發現 {conflicts.length} 個存檔衝突，請前往衝突解決頁面處理
                </div>
            )}

            <div className={styles.slotsGrid}>
                {slots.map((slot) => (
                    <SaveSlotCard
                        key={slot.slotNumber}
                        slot={slot}
                        onLoad={() => handleLoad(slot.slotNumber)}
                        onSave={() => handleSave(slot.slotNumber)}
                        onDelete={() => handleDelete(slot.slotNumber)}
                        onEdit={() => handleEdit(slot.slotNumber)}
                    />
                ))}
            </div>
        </div>
    );
}
