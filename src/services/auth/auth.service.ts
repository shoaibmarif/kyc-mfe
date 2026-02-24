import apiService from 'customMain/api';
import { AUTH_API_URLS, OTP_API_URLS } from './apiUrls';
import type { ApiSuccessResponse, ApiErrorResponse } from 'customMain/api/api.service.types';

type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

export const authService = {
    // signup API calls
    getOTPPreferenceMethod: () =>
        apiService.get<ApiResponse<any>>(OTP_API_URLS.GET_PREFERENCE_METHODS),

    signupKYCVerification: (data: {
        userName: string;
        employeeID: string;
        cnicNumber: string;
        mobileNumber: string;
        password: string;
    }) => apiService.post<ApiResponse>(AUTH_API_URLS.POST_SIGNUP_KYC_VERIFICATION, data),

    sendOTPMobile: (data: { mobileNo: string }) =>
        apiService.post<ApiResponse>(OTP_API_URLS.SEND_OTP_MOBILE, data),

    verifyOTPMobile: (data: { mobileNo: string; otp: string }) =>
        apiService.post<ApiResponse>(OTP_API_URLS.VERIFY_OTP_MOBILE, data),

    resendOTPMobile: (data: { mobileNo: string }) =>
        apiService.post<ApiResponse>(OTP_API_URLS.RESEND_OTP_MOBILE, data),

    signupMfaEnrollmentAuthenticator: (data: { setUpKey: string }) =>
        apiService.post<ApiResponse>(OTP_API_URLS.MFA_ENROLLMENT_AUTHENTICATOR_OTP, data),

    signupSendOtpDeliveryPreference: (data: { otpPreferenceMethodId: string; mobileNo?: string }) =>
        apiService.post<ApiResponse>(OTP_API_URLS.SEND_OTP_DELIVERY_PREFERENCE, data),

    signupVerifyOtpDeliveryPreference: (data: {
        mobileNo?: string;
        otpCode?: string;
        methodId?: string;
        setUpKey?: string;
        authenticatorCode?: string;
    }) => apiService.post<ApiResponse>(OTP_API_URLS.VERIFY_OTP_DELIVERY_PREFERENCE, data),

    signupTrustedDevice: (data: {
        employeeId?: string;
        cnic?: string;
        email?: string;
        mobileNo?: string;
        setUpKey?: string;
        methodId?: string;
        isRegisterDevice: boolean;
        deviceId?: string;
        validityPeriod?: string;
    }) => apiService.post<ApiResponse>(OTP_API_URLS.SIGNUP_TRUSTED_DEVICE, data),

};

