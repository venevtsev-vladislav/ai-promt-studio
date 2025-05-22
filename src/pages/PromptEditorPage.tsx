import React, { useEffect, useRef, useState } from 'react';
import isEqual from 'lodash.isequal';
import { useAuth } from '../hooks/useAuth';
import { usePrompts } from '../hooks/usePrompts';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import PromptEditor from '../components/PromptEditor';
import PromptSettingsSidebar from '../components/PromptSettingsSidebar';

const PromptEditorPage: React.FC = () => {
    const { user } = useAuth();
    const {
        prompts,
        currentPrompt,
        setCurrentPrompt,
        reload,
        savePrompt,
        deletePrompt,
        addPrompt,
    } = usePrompts();

    const saveTimeout = useRef<NodeJS.Timeout | null>(null);
    const lastSavedPrompt = useRef(currentPrompt);
    const [isNew, setIsNew] = useState(false);

    useEffect(() => {
        reload();
    }, [user]);

    const handleManualSave = async () => {
        if (!currentPrompt) return;

        try {
            if (!currentPrompt.id) {
                const newPrompt = await addPrompt({
                    name: currentPrompt.name,
                    instruction: currentPrompt.instruction,
                    description: currentPrompt.description,
                    param1: currentPrompt.param1,
                    param2: currentPrompt.param2,
                    is_draft: currentPrompt.is_draft ?? true,
                    type: currentPrompt.type ?? 'user',
                }, []);
                if (newPrompt) {
                    setCurrentPrompt(newPrompt);
                    lastSavedPrompt.current = newPrompt;
                    setIsNew(false);
                    await reload();
                }
            } else {
                await savePrompt(currentPrompt);
                lastSavedPrompt.current = currentPrompt;
            }
            console.log('✅ Сохранено вручную');
        } catch (err) {
            console.error('❌ Ошибка при сохранении', err);
        }
    };

    const handleAddPrompt = () => {
        const newPrompt = {
            id: null,
            name: 'Новый промт',
            instruction: '',
            description: '',
            param1: '',
            param2: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_draft: true,
            type: 'user',
        };
        setIsNew(true);
        setCurrentPrompt(newPrompt);
    };

    const handleDeletePrompt = async (id: string | null) => {
        if (!id) return;
        const confirmed = window.confirm('Вы уверены, что хотите удалить этот промт?');
        if (!confirmed) return;

        await deletePrompt(id);
        await reload();

        const remaining = prompts.filter(p => p.id !== id);
        setCurrentPrompt(remaining[0] || null);
    };

    return (
        <div className="app-container" style={{ height: '100vh', overflow: 'hidden' }}>
            <Header />
            <div style={{ paddingTop: '72px' }}>
                <Sidebar
                    user={user}
                    prompts={prompts}
                    currentPrompt={currentPrompt}
                    setCurrentPrompt={setCurrentPrompt}
                    savePrompt={savePrompt}
                    collapsed={false}
                    toggleSidebar={() => {}}
                    onAddPrompt={handleAddPrompt}
                    onDeletePrompt={handleDeletePrompt}
                />

                {currentPrompt && (
                    <PromptSettingsSidebar
                        prompt={currentPrompt}
                        onChange={(field, value) => {
                            setCurrentPrompt({ ...currentPrompt, [field]: value });
                        }}
                        onSave={handleManualSave}
                    />
                )}

                <div
                    style={{
                        marginLeft: '280px',
                        marginRight: '320px',
                        flexGrow: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: 'calc(100vh - 72px)',
                        padding: '2rem',
                        boxSizing: 'border-box'
                    }}
                >
                    <PromptEditor
                        user={user}
                        prompt={currentPrompt}
                        setPrompt={setCurrentPrompt}
                    />
                </div>
            </div>
        </div>
    );
};

export default PromptEditorPage;