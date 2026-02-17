import { useCallback, useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';
import { Button, TextInput } from 'customMain/components';
import { useZodForm } from 'customMain/hooks';
import { authService } from '../services/auth.service';
import { otpVerificationSchema, type OTPVerificationFormData } from './validations';

interface OTPVerificationPageProps {
    otpVerificationData: { otpCode: string };
    setOtpVerificationData: (v: { otpCode: string }) => void;
    mobileNo?: string;
    onCancel: () => void;
    onConfirm?: () => void;
}

export const OTPVerificationPage: React.FC<OTPVerificationPageProps> = ({
    otpVerificationData,
    setOtpVerificationData,
    mobileNo,
    onCancel,
    onConfirm,
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const {
        control,
        handleSubmit: handleFormSubmit,
        formState: { errors },
    } = useZodForm({
        schema: otpVerificationSchema,
        defaultValues: otpVerificationData,
    });

    const demoSmsText = useMemo(() => `SMS sent to ${mobileNo} (demo OTP: 35)`, [mobileNo]);

    const handleOtpSubmit = useCallback(
        async (data: OTPVerificationFormData) => {
            setIsSubmitting(true);
            try {
                if (mobileNo) {
                    try {
                        await authService.verifyOTPMobile({
                            mobileNo,
                            otp: data['otpCode'],
                        });
                    } catch (_error) {
                        console.error('OTP verification error:', _error);
                        return;
                    }
                }

                setOtpVerificationData({
                    otpCode: data['otpCode'] || ''
                });
                if (onConfirm) onConfirm();
            } finally {
                setIsSubmitting(false);
            }
        },
        [mobileNo, onConfirm, setOtpVerificationData],
    );

    const handleResendOtp = useCallback(async () => {
        if (!mobileNo) return;
        setIsResending(true);
        try {
            await authService.resendOTPMobile({ mobileNo });
        } catch (_error) {
            // TEMP: Discard API errors and continue for now
        } finally {
            setIsResending(false);
        }
    }, [mobileNo]);

    return (
        <form
            onSubmit={handleFormSubmit(handleOtpSubmit)}
            className="bg-gradient-to-br from-[#232a1e] to-[#232a1e]/80 rounded-2xl p-8 w-full max-w-2xl shadow-2xl border border-[#3a3f2e] mx-auto"
        >
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                        Sign-up — OTP Verification
                    </h2>
                    <p className="text-sm text-gray-300">
                        A 6-digit OTP has been sent to the KYC-verified mobile number.
                    </p>
                </div>
            </div>

            {/* OTP Input Section */}
            <div className="mb-6">
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-gray-300 mb-2">
                            Enter OTP{' '}
                            <span className="text-yellow-300 text-xs align-top ml-1">required</span>
                        </label>
                        <Controller
                            name="otpCode"
                            control={control}
                            render={({ field }) => (
                                <TextInput
                                    {...field}
                                    placeholder="6-digit OTP"
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                        field.onChange(value);
                                    }}
                                    maxLength={6}
                                    error={errors['otpCode']?.message}
                                    testId="signup-otp-code"
                                />
                            )}
                        />
                    </div>
                </div>
            </div>

            {/* Demo SMS Info */}
            <div className="mb-6 p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                <p className="text-xs text-gray-400">
                    <span className="font-semibold">SMS Delivery (Demo)</span>
                </p>
                <p className="text-xs text-gray-300 mt-1">{demoSmsText}</p>
            </div>

            <div className="flex justify-between gap-2 mb-4">
                <div>
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleResendOtp}
                        loading={isResending}
                        testId="signup-resend-otp"
                    >
                        Resend OTP
                    </Button>
                </div>
                <div className="flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={onCancel}
                        testId="signup-back"
                        disabled={isSubmitting || isResending}
                    >
                        Back
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        testId="signup-verify-otp"
                        loading={isSubmitting}
                    >
                        Submit
                    </Button>
                </div>
            </div>

        </form>
    );
};
