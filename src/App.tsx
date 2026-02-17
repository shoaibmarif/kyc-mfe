import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {
    SignUpForm,
} from './pages';
import { APP_ROUTES } from './routes/appRoutes';

const App: React.FC = () => {
    return (
        <Routes>
            {/* Main signup route */}
            <Route path={APP_ROUTES.SIGNUP} element={<SignUpForm />} />
            {/* Catch all - 404 Not Found */}
            <Route path="*" element={<div>Page not found</div>} />
        </Routes>
    );
};

export default App;
