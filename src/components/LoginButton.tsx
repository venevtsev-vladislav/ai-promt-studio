// src/components/LoginButton.tsx
import { supabase } from '../services/supabaseClient';
import './LoginButton.css';

export const LoginButton = () => {
    const signInWithGoogle = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin,
            },
        });
    };

    return (
        <button className="google-auth-btn" onClick={signInWithGoogle}>
            <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="google-auth-icon"
            />
            Продолжить с Google
        </button>
    );
};