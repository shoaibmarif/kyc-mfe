import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import SignUpForm from './pages/SignUpForm';
import ForgotPasswordForm from './pages/ForgotPasswordForm';
import DormantUserKYCForm from './pages/DormantUserKYCForm';
import PasswordReset from './pages/PasswordReset';
import LoginForm from './pages/LoginForm';
import { Tracer, useMfeRouteTracker } from './observability/tracer';

const MFE_NAME = 'kyc-mfe';

const App: React.FC = () => {
    useMfeRouteTracker();

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
            <Route path="/forgot-password" element={<ForgotPasswordForm />} />
            <Route path="/dormant-user-kyc" element={<DormantUserKYCForm />} />
            <Route path="/password-reset" element={<PasswordReset />} />
            <Route path="*" element={<div>Page not found</div>} />
        </Routes>
    );
};

export default App;
