
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignUpForm from './pages/SignUpForm';
import ForgotPasswordForm from './pages/ForgotPasswordForm';
import DormantUserKYCForm from './pages/DormantUserKYCForm';
import PasswordReset from './pages/PasswordReset';
import LoginForm from './pages/LoginForm';

const App: React.FC = () => {
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
