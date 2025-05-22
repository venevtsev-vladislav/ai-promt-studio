import React, { useState } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Subscribe() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Оформление подписки для ${user?.email || email}`);
        // здесь можно вставить вызов оплаты
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header
                userEmail={user?.email || 'anonymous@example.com'}
                toggleSidebar={() => {}}
                onLogoClick={() => navigate('/')}
            />

            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '40px 20px' }}>
                <form
                    onSubmit={handleSubmit}
                    style={{
                        maxWidth: 600,
                        width: '100%',
                        background: '#fff',
                        borderRadius: 12,
                        padding: '32px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px'
                    }}
                >
                    <h1 style={{ margin: 0 }}>Оформление подписки</h1>
                    <p style={{ color: '#666', marginTop: -10 }}>Выберите план и продолжите к оплате</p>

                    {!user && (
                        <label>
                            Email:
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    fontSize: '1rem',
                                    marginTop: 6,
                                    border: '1px solid #ccc',
                                    borderRadius: 6
                                }}
                            />
                        </label>
                    )}

                    <label>
                        План:
                        <select style={{ padding: '10px', fontSize: '1rem', marginTop: 6, borderRadius: 6 }}>
                            <option value="basic">Базовый — $9/мес</option>
                            <option value="pro">Про — $19/мес</option>
                            <option value="business">Бизнес — $49/мес</option>
                        </select>
                    </label>

                    <button
                        type="submit"
                        style={{
                            padding: '12px',
                            background: '#10a37f',
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            border: 'none',
                            borderRadius: 8,
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                        }}
                    >
                        Перейти к оплате →
                    </button>
                </form>
            </div>
        </div>
    );
}