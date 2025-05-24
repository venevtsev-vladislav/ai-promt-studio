import React, { useState } from 'react';
import './PromptEditor.css';
import { supabase } from '../services/supabaseClient';

interface PromptEditorProps {
    prompt: { id: string | null; instruction: string };
    setPrompt: (prompt: any) => void;
}

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const PromptEditor: React.FC<PromptEditorProps> = ({ prompt }) => {
    const [query, setQuery] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        console.log('handleSend вызван!', { query });

        if (!query.trim()) {
            console.error('Пустой запрос');
            return;
        }

        setLoading(true);

        try {
            // Получаем accessToken из Supabase
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            const accessToken = session?.access_token;

            if (!accessToken) {
                console.error('Нет accessToken');
                setMessages(prev => [...prev, { role: 'user', content: query }, { role: 'assistant', content: 'Ошибка авторизации' }]);
                return;
            }

            // Вызов Edge Function (замени 'openai' на актуальное имя функции в Supabase)
            const { data, error: funcError } = await supabase.functions.invoke('openai', {
                headers: { Authorization: `Bearer ${accessToken}` },
                body: {
                    prompt: query,
                    instruction: prompt.instruction,
                    promptId: prompt.id,
                },
            });

            console.log('Ответ от invoke:', { data, funcError });

            if (funcError || !data?.text) {
                console.error('Ошибка invoke:', funcError);
                setMessages(prev => [...prev, { role: 'user', content: query }, { role: 'assistant', content: 'Ошибка при получении ответа' }]);
            } else {
                setMessages(prev => [...prev, { role: 'user', content: query }, { role: 'assistant', content: data.text }]);
                setQuery('');
            }
        } catch (err) {
            console.error('Ошибка в try-catch:', err);
            setMessages(prev => [...prev, { role: 'user', content: query }, { role: 'assistant', content: 'Ошибка запроса' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="prompt-editor">
            <div className="preview-window">
                <div className="preview-header">
                    <div className="window-controls">
                        <span className="dot red" />
                        <span className="dot yellow" />
                        <span className="dot green" />
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
                    <span>📎 Вложения</span>
                </div>
                <div className="input-tags">
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
                        disabled={loading}
                    >
                        ➤
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PromptEditor;
