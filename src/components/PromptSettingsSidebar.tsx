import React, { ChangeEvent } from 'react';
import './PromptSettingsSidebar.css';

interface Prompt {
    id: string | null;
    name: string;
    description: string;
    instruction: string;
    goal?: string;
    example_response?: string;
    temperature?: string;
    model?: string;
    max_tokens?: string;
    top_p?: string;
    frequency_penalty?: string;
    presence_penalty?: string;
    stop_sequences?: string;
    parameters: { key: string; value: string; }[];
    tools?: {
        structured: boolean;
        code: boolean;
        functions: boolean;
        search: boolean;
        url: boolean;
    };
    tags?: string;
    notes?: string;
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
                <h3>Настройки промпта</h3>
                <div className="header-actions">
                    <button onClick={onSave} title="Сохранить">💾</button>
                    <button onClick={onReset} title="Сбросить">↺</button>
                    <button onClick={onClose} title="Закрыть">×</button>
                </div>
            </div>

            {/* Основные поля */}
            <div className="input-group">
              <input
                type="text"
                placeholder=" "
                value={prompt?.name || ''}
                onChange={handleChange('name')}
                required
              />
              <label>Name *</label>
              <small>For example: "Summarize text", "Generate idea"</small>
            </div>

            <div className="input-group">
              <textarea
                placeholder=" "
                value={prompt.goal || ''}
                onChange={handleChange('goal')}
              ></textarea>
              <label>Goal</label>
              <small>Describe the purpose of this prompt. For example: "Summarize news articles".</small>
            </div>

            <div className="input-group">
              <textarea
                placeholder=" "
                value={prompt.example_response || ''}
                onChange={handleChange('example_response')}
              ></textarea>
              <label>Expected Answer</label>
              <small>Give an example of a good response from the model.</small>
            </div>

            <div className="input-group">
              <textarea
                placeholder=" "
                value={prompt.instruction || ''}
                onChange={handleChange('instruction')}
                required
              ></textarea>
              <label>Instruction *</label>
              <small>Describe what the prompt should do. For example: "Summarize the input text".</small>
            </div>

            <div className="input-group">
              <textarea
                placeholder=" "
                value={prompt.description || ''}
                onChange={handleChange('description')}
              ></textarea>
              <label>Description</label>
              <small>Optional: Add details for your reference.</small>
            </div>

            {/* Настройки генерации */}
            <details>
                <summary>⚙️ Настройки генерации</summary>

                <label>Модель</label>
                <select value={prompt.model || 'gpt-4'} onChange={handleChange('model')}>
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-3.5">GPT-3.5</option>
                </select>

                <label>Temperature</label>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={prompt.temperature || '0.7'}
                    onChange={handleChange('temperature')}
                />

                <label>Max Tokens</label>
                <input
                    type="number"
                    min="1"
                    value={prompt.max_tokens || ''}
                    placeholder="Максимальное количество токенов"
                    onChange={handleChange('max_tokens')}
                />

                <label>Top P</label>
                <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={prompt.top_p || ''}
                    placeholder="Вероятностный порог"
                    onChange={handleChange('top_p')}
                />

                <label>Frequency Penalty</label>
                <input
                    type="number"
                    min="0"
                    max="2"
                    step="0.01"
                    value={prompt.frequency_penalty || ''}
                    placeholder="Штраф за повторения"
                    onChange={handleChange('frequency_penalty')}
                />

                <label>Presence Penalty</label>
                <input
                    type="number"
                    min="0"
                    max="2"
                    step="0.01"
                    value={prompt.presence_penalty || ''}
                    placeholder="Штраф за появление новых тем"
                    onChange={handleChange('presence_penalty')}
                />

                <label>Stop Sequences</label>
                <input
                    type="text"
                    value={prompt.stop_sequences || ''}
                    placeholder="Последовательности для остановки генерации"
                    onChange={handleChange('stop_sequences')}
                />
            </details>

            {/* Инструменты */}
            <details>
                <summary>🧰 Инструменты</summary>
                <label>
                    <input type="checkbox" checked={prompt.tools?.structured || false} onChange={(e) => onChange('tools.structured', String(e.target.checked))}/> Structured Output
                    <button className="star-button" title="В избранное">⭐</button>
                </label><br />
                <label>
                    <input type="checkbox" checked={prompt.tools?.code || false} onChange={(e) => onChange('tools.code', String(e.target.checked))}/> Code Execution
                    <button className="star-button" title="В избранное">⭐</button>
                </label><br />
                <label>
                    <input type="checkbox" checked={prompt.tools?.functions || false} onChange={(e) => onChange('tools.functions', String(e.target.checked))}/> Function Calling
                    <button className="star-button" title="В избранное">⭐</button>
                </label><br />
                <label>
                    <input type="checkbox" checked={prompt.tools?.search || false} onChange={(e) => onChange('tools.search', String(e.target.checked))}/> Google Search
                    <button className="star-button" title="В избранное">⭐</button>
                </label><br />
                <label>
                    <input type="checkbox" checked={prompt.tools?.url || false} onChange={(e) => onChange('tools.url', String(e.target.checked))}/> URL Context
                    <button className="star-button" title="В избранное">⭐</button>
                </label>
            </details>


            {/* Теги и заметки */}
            <details>
                <summary>🏷️ Теги и заметки</summary>
                <label>Теги</label>
                <input
                    type="text"
                    value={prompt.tags || ''}
                    placeholder="Добавьте теги через запятую"
                    onChange={handleChange('tags')}
                />
                <label>Заметки</label>
                <textarea
                    value={prompt.notes || ''}
                    placeholder="Ваши заметки по промпту"
                    onChange={handleChange('notes')}
                    rows={3}
                />
            </details>
        </aside>
    );
};

export default PromptSettingsSidebar;