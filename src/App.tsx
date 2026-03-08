import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import SignUpForm from './pages/SignUpForm';
import ForgotPasswordForm from './pages/ForgotPasswordForm';
import DormantUserKYCForm from './pages/DormantUserKYCForm';
import PasswordReset from './pages/PasswordReset';
import LoginForm from './pages/LoginForm';
import { Tracer, useMfeRouteTracker } from './observability/tracer';
import { APP_ROUTES } from './routes/pathUrl';

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
            <Route path={APP_ROUTES.LOGIN} element={<LoginForm />} />
            <Route path={APP_ROUTES.SIGN_UP} element={<SignUpForm />} />
            <Route path={APP_ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordForm />} />
            <Route path={APP_ROUTES.DORMANT_USER_KYC} element={<DormantUserKYCForm />} />
            <Route path={APP_ROUTES.PASSWORD_RESET} element={<PasswordReset />} />
            <Route path={APP_ROUTES.NOT_FOUND} element={<div>Page not found</div>} />
        </Routes>
    );
};

export default App;
