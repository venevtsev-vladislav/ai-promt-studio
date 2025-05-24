//AppRouter.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSession } from './hooks/useSession';
import PromptEditorPage from './pages/PromptEditorPage';
import Subscribe from './pages/Subscribe';
import Login from './pages/Login';

export default function AppRouter() {
    const session = useSession();

    return (
        <Routes>
            <Route path="/" element={<PromptEditorPage session={session} />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}