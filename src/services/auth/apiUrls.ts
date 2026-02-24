const AUTH_BASE = '/kyc/auth';
const OTP_BASE = '/kyc/otp';
const KYC_BASE = '/kyc/kycapi';
const AUTH_USER_BASE_API = '/Auth';

export const AUTH_API_URLS = {
    LOGOUT: `${AUTH_BASE}/logout`,
    POST_SIGNUP_KYC_VERIFICATION: `${KYC_BASE}/signup-kyc-verification`,
    UPDATE_USER_KYC: `${AUTH_USER_BASE_API}/update-user-kyc`,
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

