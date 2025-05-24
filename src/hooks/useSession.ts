import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Session } from '@supabase/supabase-js';

export function useSession() {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => setSession(data?.session || null));

        const { data: listener } = supabase.auth.onAuthStateChange((_event, sessionData) => {
            setSession(sessionData?.session || null);
        });

        return () => {
            listener?.subscription.unsubscribe();
        };
    }, []);

    return session;
}