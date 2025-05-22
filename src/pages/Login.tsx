import { supabase } from '../services/supabaseClient';

export default function Login() {
    const handleLogin = async () => {
        await supabase.auth.signInWithOAuth({ provider: 'google' });
    };

    return (
        <div>
            <h1>Login</h1>
            <button onClick={handleLogin}>Sign in with Google</button>
        </div>
    );
}