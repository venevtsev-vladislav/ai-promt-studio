import React, { ChangeEvent } from 'react';
import './PromptSettingsSidebar.css';

interface Prompt {
    id: string | null;
    name: string;
    description: string;
    instruction: string;
    temperature?: string;
    model?: string;
    parameters: { key: string; value: string; }[];
    tools?: {
        structured: boolean;
        code: boolean;
        functions: boolean;
        search: boolean;
        url: boolean;
    };
}

interface PromptSettingsSidebarProps {
    prompt: Prompt;
    onChange: (field: string, value: string) => void;
    onSave: () => void;
    onReset?: () => void;
    onClose?: () => void;
}

const PromptSettingsSidebar: React.FC<PromptSettingsSidebarProps> = ({ prompt, onChange, onSave, onReset, onClose }) => {
    const handleChange = (field: string) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        onChange(field, e.target.value);
    };

    return (
        <aside className="settings-sidebar">
            <div className="sidebar-header">
                <h3>Run settings</h3>
                <div className="header-actions">
                    <button onClick={onSave} title="Сохранить">💾</button>
                    <button onClick={onReset} title="Сбросить">↺</button>
                    <button onClick={onClose} title="Закрыть">×</button>
                </div>
            </div>

            <label>Model</label>
            <select value={prompt.model || 'gpt-4'} onChange={handleChange('model')}>
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5">GPT-3.5</option>
            </select>

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

            <label>Temperature</label>
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={prompt.temperature || '0.7'}
                onChange={handleChange('temperature')}
            />

            <details>
                <summary>🧰 Tools</summary>
                <label><input type="checkbox" checked={prompt.tools?.structured || false} onChange={(e) => onChange('tools.structured', String(e.target.checked))}/> Structured Output</label><br />
                <label><input type="checkbox" checked={prompt.tools?.code || false} onChange={(e) => onChange('tools.code', String(e.target.checked))}/> Code Execution</label><br />
                <label><input type="checkbox" checked={prompt.tools?.functions || false} onChange={(e) => onChange('tools.functions', String(e.target.checked))}/> Function Calling</label><br />
                <label><input type="checkbox" checked={prompt.tools?.search || false} onChange={(e) => onChange('tools.search', String(e.target.checked))}/> Google Search</label><br />
                <label><input type="checkbox" checked={prompt.tools?.url || false} onChange={(e) => onChange('tools.url', String(e.target.checked))}/> URL Context</label>
            </details>

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