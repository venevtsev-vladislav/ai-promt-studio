// src/components/PromptEditor.tsx
import React, { useState } from 'react';
import './PromptEditor.css';

interface PromptEditorProps {
    user: any;
    prompt: { id: string | null; instruction: string };
    setPrompt: (prompt: any) => void;
}

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const PromptEditor: React.FC<PromptEditorProps> = ({ user, prompt }) => {
    const [query, setQuery] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);

    const handleSend = async () => {
        if (!query.trim()) return;

        const newMessages = [...messages, { role: 'user', content: query }];
        setMessages(newMessages);
        setQuery('');

        // Эмуляция ответа
        const simulatedResponse = `Ответ на: "${query}"`;
        setMessages([...newMessages, { role: 'assistant', content: simulatedResponse }]);
    };

    return (
        <div className="prompt-editor">
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
            <div className="input-container">
                <input
                    type="text"
                    placeholder="Введите запрос..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button onClick={handleSend}>Отправить</button>
            </div>
        </div>
    );
};

export default PromptEditor;