// ✅ usePrompts.ts
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

export interface Prompt {
    id: string;
    name: string;
    instruction: string;
    description?: string;
    param1: string;
    param2: string;
    created_at: string;
    updated_at: string;
    is_draft?: boolean;
    type?: 'default' | 'user' | 'premium';
}

export function usePrompts(userId: string | null) {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(null);
    const [loading, setLoading] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);

    const loadPrompts = async (force = false) => {
        if (hasLoaded && !force) return;
        console.log('loadPrompts called');
        setLoading(true);
        try {
            let headers: Record<string, string> = {};
            let queryUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/prompts`;

            const token = (await supabase.auth.getSession()).data.session?.access_token;
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const res = await fetch(queryUrl, { headers });

            if (!res.ok) {
                const errorText = await res.text();
                console.error('Ошибка загрузки промтов:', res.status, errorText);
                return;
            }

            const data = await res.json();
            setPrompts(data);
            setHasLoaded(true);
            if (data.length > 0) {
                setCurrentPrompt(data[0]); // 👈 выбираем первый промт
            }
        } catch (err) {
            console.error('Ошибка при загрузке промтов:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (hasLoaded) return;
        console.log('useEffect triggered', { userId });
        loadPrompts();
    }, [userId, hasLoaded]);

    const addPrompt = async (
        prompt: Omit<Prompt, 'id' | 'created_at' | 'updated_at'>,
        parameters: { key: string; value: string }[] = []
    ) => {
        try {
            const token = (await supabase.auth.getSession()).data.session?.access_token;
            const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/prompts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ...prompt, parameters }),
            });

            const createdPrompt = await res.json();
            setPrompts((prev) => [...prev, createdPrompt]);
            return createdPrompt;
        } catch (err) {
            console.error('Ошибка добавления промта:', err);
            return null;
        }
    };

    const updatePrompt = async (id: string, updates: Partial<Prompt>) => {
        try {
            const token = (await supabase.auth.getSession()).data.session?.access_token;
            await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/prompts/${encodeURIComponent(id)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updates),
            });
            console.log('updatePrompt: refreshing prompts after update');
            await loadPrompts();
        } catch (err) {
            console.error('Ошибка обновления промта:', err);
        }
    };

    const deletePrompt = async (id: string) => {
        try {
            const token = (await supabase.auth.getSession()).data.session?.access_token;
            await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/prompts/${encodeURIComponent(id)}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('deletePrompt: refreshing prompts after deletion');
            await loadPrompts();
        } catch (err) {
            console.error('Ошибка удаления промта:', err);
        }
    };

    const readyPrompts = prompts.filter(p => !p.is_draft && (p.type === 'user' || p.type === 'default'));
    const draftPrompts = prompts.filter(p => p.is_draft);

    const savePrompt = async (prompt: Prompt) => {
        if (!prompt.id) return;

        try {
            await updatePrompt(prompt.id, {
                name: prompt.name,
                description: prompt.description,
                instruction: prompt.instruction,
                param1: prompt.param1,
                param2: prompt.param2,
            });
            console.log('✅ Prompt saved');
        } catch (err) {
            console.error('❌ Failed to save prompt', err);
        }
    };


    return {
        prompts,
        loading,
        addPrompt,
        deletePrompt,
        updatePrompt,
        setPrompts,
        readyPrompts,
        draftPrompts,
        currentPrompt,
        setCurrentPrompt,
        savePrompt,
        reload: (force = false) => loadPrompts(force),
    };
}
