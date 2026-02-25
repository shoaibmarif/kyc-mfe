const baseURLkyc = process.env['REACT_HOST_APP_URL_KYC'] || 'http://localhost:5231/api';
const baseURLLogin = process.env['REACT_HOST_APP_URL_LOGIN'] || 'http://localhost:5293/api';

const AUTH_BASE = '/kyc/auth';
const OTP_BASE = '/kyc/otp';
const KYC_BASE = '/kyc/kycapi';
const AUTH_USER_BASE_API = '/Auth';

export const AUTH_API_URLS = {
    LOGOUT: `${AUTH_BASE}/logout`,
    POST_SIGNUP_KYC_VERIFICATION: `${baseURLkyc}${KYC_BASE}/signup-kyc-verification`,
    UPDATE_USER_KYC: `${baseURLLogin}${AUTH_USER_BASE_API}/update-user-kyc`,
};

export const OTP_API_URLS = {
    GET_PREFERENCE_METHODS: `${baseURLkyc}${OTP_BASE}/otp-preference-method`,
    SEND_OTP_MOBILE: `${baseURLkyc}${OTP_BASE}/send-otp-mobile`,
    RESEND_OTP_MOBILE: `${baseURLkyc}${OTP_BASE}/resend-otp-mobile`,
    VERIFY_OTP_MOBILE: `${baseURLkyc}${OTP_BASE}/verify-otp-mobile`,
    MFA_ENROLLMENT_AUTHENTICATOR_OTP: `${baseURLkyc}${OTP_BASE}/mfa-enrollment-authenticator-otp`,
    SEND_OTP_DELIVERY_PREFERENCE: `${baseURLkyc}${OTP_BASE}/send-otp-delivery-preference`,
    VERIFY_OTP_DELIVERY_PREFERENCE: `${baseURLkyc}${OTP_BASE}/save-otp-delivery-preference`,
    SIGNUP_TRUSTED_DEVICE: `${baseURLkyc}${AUTH_BASE}/trusted-device`,
};
