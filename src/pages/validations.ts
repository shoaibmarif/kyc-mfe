import { z } from 'zod';

// ==================== LOCAL REGEX PATTERNS ====================
export const REGEX_PATTERNS = {
    employeeId: /^[0-9]+$/,
    cnic: /^\d{5}-\d{7}-\d{1}$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    mobileNo: /^03\d{9}$/,
    otpCode: /^\d{6}$/,
    base32: /^[A-Z2-7]{32}$/,
} as const;

// ==================== LOCAL VALIDATION SCHEMAS ====================
const localValidations = {
    employeeId: z
        .string()
        .min(1, 'Employee ID is required')
        .max(20, 'Employee ID must not exceed 20 characters')
        .regex(REGEX_PATTERNS.employeeId, 'Employee ID can only contain numbers'),
    
    cnic: z
        .string()
        .min(1, 'CNIC is required')
        .regex(REGEX_PATTERNS.cnic, 'CNIC must be in format: 35202-1234567-1'),
    
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email format')
        .regex(REGEX_PATTERNS.email, 'Please enter a valid email address'),
    
    mobileNo: z
        .string()
        .min(1, 'Mobile number is required')
        .regex(REGEX_PATTERNS.mobileNo, 'Mobile number must be in format: 03001234567'),
    
    otpCode: z
        .string()
        .min(1, 'OTP is required')
        .length(6, 'OTP must be exactly 6 digits')
        .regex(REGEX_PATTERNS.otpCode, 'OTP must contain only digits'),
    
    setupKey: z
        .string()
        .min(1, 'Setup key is required')
        .regex(REGEX_PATTERNS.base32, 'Setup key must be a valid Base32 string'),
    
    qrCode: z
        .string()
        .min(1, 'QR code URI is required')
        .startsWith('otpauth://totp/', 'Invalid QR code URI format'),
} as const;

// KYC Verification Schema
export const kycVerificationSchema = z.object({
    employeeId: localValidations.employeeId,
    cnic: localValidations.cnic,
    email: localValidations.email,
    mobileNo: localValidations.mobileNo,
});

export type KYCVerificationFormData = z.infer<typeof kycVerificationSchema>;

// OTP Verification Schema
export const otpVerificationSchema = z.object({
    otpCode: localValidations.otpCode,
});

export type OTPVerificationFormData = z.infer<typeof otpVerificationSchema>;

// MFA Enrollment Schema
export const mfaEnrollmentSchema = z.object({
    setupKey: localValidations.setupKey,
    qrCode: localValidations.qrCode,
    authenticatorCode: localValidations.otpCode,
});

export type MFAEnrollmentFormData = z.infer<typeof mfaEnrollmentSchema>;

// OTP Delivery Preference Schema
export const otpDeliveryPreferenceSchema = z.object({
    method: z
        .string()
        .min(1, 'Delivery method is required'),
    destination: z
        .string()
        .min(1, 'Destination is required'),
    otpCode: z
        .string()
        .optional()
        .refine((val) => !val || REGEX_PATTERNS.otpCode.test(val), {
            message: 'OTP code must be 6 digits',
        }),
});

export type OTPDeliveryPreferenceFormData = z.infer<typeof otpDeliveryPreferenceSchema>;

// Trusted Device Schema
export const trustedDeviceSchema = z.object({
    registerDevice: z.boolean(),
    validityPeriod: z
        .string()
        .refine(
            (val) => {
                if (!val) return true; // Optional when registerDevice is false
                const num = parseInt(val);
                return !isNaN(num) && num > 0 && num <= 365;
            },
            {
                message: 'Validity period must be between 1 and 365 days',
            }
        )
        .optional()
        .or(z.literal('')),
}).refine(
    (data) => {
        if (data.registerDevice) {
            return data.validityPeriod && data.validityPeriod !== '';
        }
        return true;
    },
    {
        message: 'Validity period is required when registering device',
        path: ['validityPeriod'],
    }
);

export type TrustedDeviceFormData = z.infer<typeof trustedDeviceSchema>;
