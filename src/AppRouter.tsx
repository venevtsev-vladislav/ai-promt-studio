import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PromptEditorPage from './pages/PromptEditorPage';
import Subscribe from './pages/Subscribe';
import Login from './pages/Login';

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<PromptEditorPage />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}