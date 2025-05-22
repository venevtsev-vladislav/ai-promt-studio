import React, { useState } from 'react';
import styles from './Sidebar.module.css';

interface Prompt {
    id: string | null;
    name: string;
    description: string;
    instruction: string;
    parameters: any[];
}

interface SidebarProps {
    user: any;
    prompts: Prompt[];
    currentPrompt: Prompt;
    setCurrentPrompt: (prompt: Prompt) => void;
    collapsed: boolean;
    toggleSidebar: () => void;
    onAddPrompt: () => void;
    onDeletePrompt: (id: string | null) => void;
    loading: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
                                             user,
                                             prompts,
                                             currentPrompt,
                                             setCurrentPrompt,
                                             collapsed,
                                             toggleSidebar,
                                             onAddPrompt,
                                             onDeletePrompt,
                                             loading,
                                         }) => {
    const [promptToDelete, setPromptToDelete] = useState<string | null>(null);

    const handleSelect = (prompt: Prompt) => {
        setCurrentPrompt({ ...prompt });
    };

    const handleConfirmDelete = () => {
        if (!promptToDelete) return;

        onDeletePrompt(promptToDelete);

        const remaining = prompts.filter(p => p.id !== promptToDelete);
        setCurrentPrompt(
            remaining.length > 0
                ? remaining[0]
                : {
                    id: null,
                    name: '',
                    description: '',
                    instruction: '',
                    parameters: [],
                }
        );

        setPromptToDelete(null);
    };

    return (
        <div className={styles.layout}>
            <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
                <div className={styles.headerRow}>
                    <button className={styles.toggleButton} onClick={toggleSidebar}>☰</button>
                    <button className={styles.addButton} onClick={onAddPrompt}>➕ Add Prompt</button>
                </div>
                {loading && (
                    <div className={styles.loader}>Loading prompts...</div>
                )}
                <ul className={styles.promptList}>
                    {user ? (
                        prompts.map((p) => (
                            <li
                                key={p.id || 'unsaved'}
                                className={p.id === currentPrompt?.id ? styles.active : ''}
                            >
                                <span onClick={() => handleSelect(p)}>{p.name || 'Без названия'}</span>
                                <div className={styles.actions}>
                                    <button title="Edit" onClick={() => setCurrentPrompt(p)}>✏</button>
                                    <button title="Delete" onClick={() => setPromptToDelete(p.id)}>🗑</button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li>{currentPrompt?.name || 'Без названия'}</li>
                    )}
                </ul>
            </aside>

            {/* Модалка подтверждения */}
            {promptToDelete && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <p>Удалить этот промт?</p>
                        <div className={styles.modalButtons}>
                            <button onClick={handleConfirmDelete}>Удалить</button>
                            <button onClick={() => setPromptToDelete(null)}>Отмена</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;