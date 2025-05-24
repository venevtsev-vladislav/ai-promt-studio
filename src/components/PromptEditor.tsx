// src/components/PromptEditor.tsx
import React, { useState } from 'react';
import './PromptEditor.css';

interface PromptEditorProps {
    user: any;
    accessToken: string;
    prompt: { id: string | null; instruction: string };
    setPrompt: (prompt: any) => void;
}

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const PromptEditor: React.FC<PromptEditorProps> = ({ user, accessToken, prompt }) => {
    const [query, setQuery] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);

    const handleSend = async () => {
        if (!query.trim()) return;

        try {
            const response = await fetch('/api/edge-function-endpoint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ prompt: query })
            });

            const data = await response.json();
            if (response.ok && data.text) {
                setMessages([...messages, { role: 'user', content: query }, { role: 'assistant', content: data.text }]);
                setQuery('');
            } else {
                setMessages([...messages, { role: 'user', content: query }, { role: 'assistant', content: 'Ошибка при получении ответа' }]);
            }
        } catch (error) {
            console.error(error);
            setMessages([...messages, { role: 'user', content: query }, { role: 'assistant', content: 'Ошибка запроса' }]);
        }
    };

    return (
        <div className="prompt-editor">
            <div className="preview-window">
                <div className="preview-header">
                    <div className="window-controls">
                        <span className="dot red"/>
                        <span className="dot yellow"/>
                        <span className="dot green"/>
                    </div>
                    <span className="title">Превью ответа</span>
                </div>
                <div className="preview-body">
                    {messages.length > 0 && messages[messages.length - 1].role === 'assistant'
                        ? messages[messages.length - 1].content
                        : '—'}
                </div>
            </div>
            <div className="chat-container">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`chat-message ${msg.role === 'user' ? 'user-msg' : 'assistant-msg'}`}
                    >
                        {msg.content}
                    </div>
                ))}
            </div>
            <div className="input-block">
                <div className="input-attachments">
                    {/* Добавь здесь компонент или иконку загрузки вложений */}
                    <span>📎 Вложения</span>
                </div>
                <div className="input-tags">
                    {/* Здесь будут теги, можно позже реализовать */}
                    <span className="tag">Здесь будут теги, можно позже реализовать</span>
                </div>
                <div className="input-textarea-wrapper">
                    <textarea
                        className="chat-textarea"
                        placeholder="Введите свой запрос..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <div className="input-buttons">
                    <button
                        className="send-button"
                        onClick={handleSend}
                        title="Отправить"
                    >
                        ➤
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PromptEditor;