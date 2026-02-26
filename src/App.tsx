
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignUpForm from './pages/SignUpForm';
import LoginForm from './pages/LoginForm';

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/kyc" element={<LoginForm />} />
            <Route path="/sign-up" element={<SignUpForm />} />
            <Route path="*" element={<div>Page not found</div>} />
        </Routes>
    );
};

export default App;
