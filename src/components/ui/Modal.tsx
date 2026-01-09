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
    type?: 'info' | 'confirm' | 'prompt' | 'danger' | 'form';
    fields?: { label: string; name: string; defaultValue?: string; placeholder?: string }[];
}

interface FormResult {
    [key: string]: string;
}

interface ModalContextType {
    alert: (title: string, message?: string) => Promise<void>;
    confirm: (title: string, message?: string) => Promise<boolean>;
    prompt: (title: string, defaultValue?: string) => Promise<string | null>;
    danger: (title: string, message?: string) => Promise<boolean>;
    form: (title: string, fields: { label: string; name: string; defaultValue?: string; placeholder?: string }[]) => Promise<FormResult | null>;
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
    const [formValues, setFormValues] = useState<FormResult>({});
    const [resolvePromise, setResolvePromise] = useState<((value: unknown) => void) | null>(null);

    const showModal = useCallback((opts: ModalOptions): Promise<unknown> => {
        return new Promise((resolve) => {
            setOptions(opts);
            if (opts.type === 'form' && opts.fields) {
                const initialValues: FormResult = {};
                opts.fields.forEach(f => {
                    initialValues[f.name] = f.defaultValue || '';
                });
                setFormValues(initialValues);
            }
            setInputValue(opts.inputDefaultValue || '');
            setIsOpen(true);
            setResolvePromise(() => resolve);
        });
    }, []);

    const handleConfirm = useCallback(() => {
        setIsOpen(false);
        if (resolvePromise) {
            if (options.type === 'form') {
                resolvePromise(formValues);
            } else if (options.showInput) {
                resolvePromise(inputValue);
            } else if (options.type === 'confirm' || options.type === 'danger') {
                resolvePromise(true);
            } else {
                resolvePromise(undefined);
            }
        }
    }, [resolvePromise, options, inputValue, formValues]);

    const handleCancel = useCallback(() => {
        setIsOpen(false);
        if (resolvePromise) {
            if (options.showInput || options.type === 'form') {
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

    const form = useCallback((title: string, fields: { label: string; name: string; defaultValue?: string; placeholder?: string }[]): Promise<FormResult | null> => {
        return showModal({
            title,
            type: 'form',
            fields,
            confirmText: '儲存',
            cancelText: '取消'
        }) as Promise<FormResult | null>;
    }, [showModal]);

    const handleFormChange = (name: string, value: string) => {
        setFormValues(prev => ({ ...prev, [name]: value }));
    };

    return (
        <ModalContext.Provider value={{ alert, confirm, prompt, danger, form }}>
            {children}

            {isOpen && (
                <div className={styles.overlay} onClick={handleCancel}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        {/* 頂部裝飾條 - 統一卡片風格 */}
                        <div className={`${styles.accentBar} ${options.type === 'danger' ? styles.danger : styles.gold}`} />

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

                        {options.type === 'form' && options.fields && (
                            <div className={styles.form}>
                                {options.fields.map((field) => (
                                    <div key={field.name} className={styles.field}>
                                        <label className={styles.label}>{field.label}</label>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            value={formValues[field.name] || ''}
                                            onChange={(e) => handleFormChange(field.name, e.target.value)}
                                            placeholder={field.placeholder}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleConfirm();
                                                if (e.key === 'Escape') handleCancel();
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
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
