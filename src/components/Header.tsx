// src/components/Header.tsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Settings as Gear, ChevronDown } from 'lucide-react';
import styles from './Header.module.css'; // убедись, что используешь .module.css
import { LoginButton } from './LoginButton'; // ✅

const Header: React.FC<{ toggleSidebar: () => void }> = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);

    return (
        <header className={styles.header}>
            <div className={styles.headerLeft}>
                <button className={styles.titleButton} onClick={() => navigate('/')}>
                    AI Prompt Builder
                </button>
                <button className={styles.toggleSidebarBtn} onClick={toggleSidebar}>☰</button>
            </div>

            <div className={styles.headerRight}>
                <button className={styles.settingsButton} title="Настройки">
                    <Gear size={20} />
                </button>
                <button className={styles.toggleSettingsBtn} title="Панель параметров">⇋</button>

                {user ? (
                    <div className={styles.userAvatarWrapper}>
                        <div className={styles.avatarTrigger} onClick={() => setShowMenu(!showMenu)}>
                            <img src={user.user_metadata?.avatar_url} alt="avatar" className={styles.avatar} />
                            <ChevronDown size={16} />
                        </div>
                        {showMenu && (
                            <div className={styles.dropdownMenu}>
                                <div className={styles.dropdownItem}>Сменить аккаунт</div>
                                <div className={styles.dropdownItem} onClick={logout}>Выйти</div>
                                <div className={styles.dropdownItem} onClick={() => navigate('/subscribe')}>Подписка</div>
                            </div>
                        )}
                    </div>
                ) : (
                    <LoginButton /> // ✅ заменили кнопку на Google OAuth
                )}
            </div>
        </header>
    );
};

export default Header;