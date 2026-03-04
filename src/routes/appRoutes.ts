export const APP_ROUTES = {
    SIGNUP: 'signup',
    FORGOT_PASSWORD: 'forgot-password',
    DORMANT_USER_KYC: 'dormant-user-kyc',
    NOT_FOUND: '/404',
};

export const routeConfig = [
    {
        path: APP_ROUTES.SIGNUP,
        label: 'Sign Up',
    },
    {
        path: APP_ROUTES.FORGOT_PASSWORD,
        label: 'Forgot Password',
    },
    {
        path: APP_ROUTES.DORMANT_USER_KYC,
        label: 'Dormant User KYC',
    },
];
