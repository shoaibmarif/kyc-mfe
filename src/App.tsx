import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import SignUpForm from './pages/SignUpForm';
import LoginForm from './pages/LoginForm';
import { Tracer } from './observability/tracer';

const MFE_NAME = 'kyc-mfe';

const App: React.FC = () => {
    useEffect(() => {
        Tracer.mfeMounted(MFE_NAME);
        return () => {
            Tracer.mfeUnmounted(MFE_NAME);
        };
    }, []);

    return (
        <Routes>
            <Route path="/kyc" element={<LoginForm />} />
            <Route path="/sign-up" element={<SignUpForm />} />
            <Route path="*" element={<div>Page not found</div>} />
        </Routes>
    );
};

export default App;
