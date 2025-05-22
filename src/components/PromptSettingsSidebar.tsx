import React, { ChangeEvent } from 'react';
import './PromptSettingsSidebar.css';

interface Prompt {
    id: string | null;
    name: string;
    description: string;
    instruction: string;
    parameters: { key: string; value: string; }[];
}

interface PromptSettingsSidebarProps {
    prompt: Prompt;
    onChange: (field: string, value: string) => void;
    onSave: () => void;
    onReset?: () => void;
    onClose?: () => void;
}

const PromptSettingsSidebar: React.FC<PromptSettingsSidebarProps> = ({ prompt, onChange, onSave, onReset, onClose }) => {
    const handleChange = (field: string) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange(field, e.target.value);
    };

    return (
        <aside className="settings-sidebar">
            {/* Header Section with Controls */}
            <div className="sidebar-header">
                <h3>Run settings</h3>
                <div className="header-actions">
                    <button onClick={onSave} title="Сохранить">💾</button>
                    <button onClick={onReset} title="Сбросить">♻️</button>
                    <button onClick={onClose} title="Закрыть">✖️</button>
                </div>
            </div>

            {/* Input Fields */}
            <label>Название *</label>
            <input
                type="text"
                value={prompt?.name || ''}
                placeholder="Введите название промпта"
                onChange={handleChange('name')}
            />

            <label>Описание</label>
            <textarea
                value={prompt?.description || ''}
                placeholder="Описание (необязательно)"
                onChange={handleChange('description')}
                rows={3}
            />

            <label>Инструкция *</label>
            <textarea
                value={prompt?.instruction || ''}
                placeholder="GPT будет использовать эту инструкцию как основу."
                onChange={handleChange('instruction')}
                rows={4}
            />

            <div>
                <h4 style={{ marginBottom: '0.5rem' }}>🍀 Параметры генерации <small>(необязательно)</small></h4>
                {Array.isArray(prompt?.parameters) && prompt.parameters.length > 0 ? (
                    <ul className="params-list">
                        {prompt.parameters.map((param, idx) => (
                            <li key={idx}>
                                <strong>{param.key}</strong>: {param.value}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="no-params">Нет дополнительных параметров.</p>
                )}
            </div>
        </aside>
    );
};

export default PromptSettingsSidebar;