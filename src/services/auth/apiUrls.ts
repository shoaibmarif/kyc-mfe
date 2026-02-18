const AUTH_BASE = '/Auth';
const OTP_BASE = '/otp';
const KYC_BASE = '/kyc';

export const AUTH_API_URLS = {
    LOGOUT: `${AUTH_BASE}/logout`,
    POST_SIGNUP_KYC_VERIFICATION: `${KYC_BASE}/signup-kyc-verification`,
};

export const OTP_API_URLS = {
    GET_PREFERENCE_METHODS: `${OTP_BASE}/otp-preference-method`,
    SEND_OTP_MOBILE: `${OTP_BASE}/send-otp-mobile`,
    RESEND_OTP_MOBILE: `${OTP_BASE}/resend-otp-mobile`,
    VERIFY_OTP_MOBILE: `${OTP_BASE}/verify-otp-mobile`,
    MFA_ENROLLMENT_AUTHENTICATOR_OTP: `${OTP_BASE}/mfa-enrollment-authenticator-otp`,
    SEND_OTP_DELIVERY_PREFERENCE: `${OTP_BASE}/send-otp-delivery-preference`,
    VERIFY_OTP_DELIVERY_PREFERENCE: `${OTP_BASE}/save-otp-delivery-preference`,
    SIGNUP_TRUSTED_DEVICE: `${AUTH_BASE}/trusted-device`,
};

