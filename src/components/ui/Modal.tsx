'use client';

import { useState, useCallback, createContext, useContext, ReactNode } from 'react';
import styles from './Modal.module.css';

interface ModalOptions {
    title: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    showInput?: boolean;
    inputPlaceholder?: string;
    inputDefaultValue?: string;
    type?: 'info' | 'confirm' | 'prompt' | 'danger';
}

interface ModalContextType {
    alert: (title: string, message?: string) => Promise<void>;
    confirm: (title: string, message?: string) => Promise<boolean>;
    prompt: (title: string, defaultValue?: string) => Promise<string | null>;
    danger: (title: string, message?: string) => Promise<boolean>;
}

const ModalContext = createContext<ModalContextType | null>(null);

export function useModal() {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal 必須在 ModalProvider 內使用');
    }
    return context;
}

interface ModalProviderProps {
    children: ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<ModalOptions>({ title: '' });
    const [inputValue, setInputValue] = useState('');
    const [resolvePromise, setResolvePromise] = useState<((value: unknown) => void) | null>(null);

    const showModal = useCallback((opts: ModalOptions): Promise<unknown> => {
        return new Promise((resolve) => {
            setOptions(opts);
            setInputValue(opts.inputDefaultValue || '');
            setIsOpen(true);
            setResolvePromise(() => resolve);
        });
    }, []);

    const handleConfirm = useCallback(() => {
        setIsOpen(false);
        if (resolvePromise) {
            if (options.showInput) {
                resolvePromise(inputValue);
            } else if (options.type === 'confirm' || options.type === 'danger') {
                resolvePromise(true);
            } else {
                resolvePromise(undefined);
            }
        }
    }, [resolvePromise, options, inputValue]);

    const handleCancel = useCallback(() => {
        setIsOpen(false);
        if (resolvePromise) {
            if (options.showInput) {
                resolvePromise(null);
            } else {
                resolvePromise(false);
            }
        }
    }, [resolvePromise, options]);

    const alert = useCallback((title: string, message?: string): Promise<void> => {
        return showModal({ title, message, type: 'info', confirmText: '確定' }) as Promise<void>;
    }, [showModal]);

    const confirm = useCallback((title: string, message?: string): Promise<boolean> => {
        return showModal({ title, message, type: 'confirm', confirmText: '確定', cancelText: '取消' }) as Promise<boolean>;
    }, [showModal]);

    const prompt = useCallback((title: string, defaultValue?: string): Promise<string | null> => {
        return showModal({
            title,
            showInput: true,
            inputDefaultValue: defaultValue,
            confirmText: '確定',
            cancelText: '取消'
        }) as Promise<string | null>;
    }, [showModal]);

    const danger = useCallback((title: string, message?: string): Promise<boolean> => {
        return showModal({ title, message, type: 'danger', confirmText: '刪除', cancelText: '取消' }) as Promise<boolean>;
    }, [showModal]);

    return (
        <ModalContext.Provider value={{ alert, confirm, prompt, danger }}>
            {children}

            {isOpen && (
                <div className={styles.overlay} onClick={handleCancel}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h3 className={styles.title}>{options.title}</h3>

                        {options.message && (
                            <p className={styles.message}>{options.message}</p>
                        )}

                        {options.showInput && (
                            <input
                                type="text"
                                className={styles.input}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={options.inputPlaceholder}
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleConfirm();
                                    if (e.key === 'Escape') handleCancel();
                                }}
                            />
                        )}

                        <div className={styles.actions}>
                            {options.cancelText && (
                                <button className="btn-outline btn-sm" onClick={handleCancel}>
                                    {options.cancelText}
                                </button>
                            )}
                            <button
                                className={`btn-sm ${options.type === 'danger' ? 'btn-danger' : 'btn-primary'}`}
                                onClick={handleConfirm}
                            >
                                {options.confirmText || '確定'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ModalContext.Provider>
    );
}
