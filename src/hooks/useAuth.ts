import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { User } from '@supabase/supabase-js';

const ensureUserInDB = async (user: User) => {
    const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

    if (!data && (!error || error.code === 'PGRST116')) {
        await supabase.from('users').insert([{
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || '',
            avatar_url: user.user_metadata?.avatar_url || '',
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString()
        }]);
    }
};

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const accessToken = new URLSearchParams(window.location.search).get('access_token');

        if (accessToken) {
            supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: '',
            });
        }

        const loadUser = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            const currentUser = session?.user || null;
            setUser(currentUser);

            if (currentUser) {
                await ensureUserInDB(currentUser);
            }
        };

        loadUser();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            const currentUser = session?.user || null;
            setUser(currentUser);

            if (currentUser) {
                (async () => {
                    await ensureUserInDB(currentUser);
                })(); // обернуто в самовызывающуюся async-функцию
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    return { user };
}