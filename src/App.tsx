//App.tsx
import React from 'react';
import AppRouter from './AppRouter';


console.log("⛳️ VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("⛳️ VITE_SUPABASE_ANON_KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY);


export default function App() {
    return <AppRouter />;
}