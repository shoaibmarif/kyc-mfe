import { useCallback, useState } from 'react';
import { Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from 'customMain/components';
import { useZodForm } from 'customMain/hooks';
import { authService } from '../../services/auth.service';
import { otpVerificationSchema, type OTPVerificationFormData } from '../../pages/validations';
import { OTPInput } from '../common/OTPInput';
import { getAssetPath } from '../../utils/assets';
import CountdownTimer from '../common/CountdownTimer';
import Modal from '../common/OTPModal';
import Stepper from '../common/Stepper';

interface OTPVerificationFormProps {
    otpVerificationData: { otpCode: string };
    setOtpVerificationData: (v: { otpCode: string }) => void;
    kycData: {
        userName: string;
        employeeId: string;
        cnic: string;
        mobileNo: string;
        newPassword: string;
        confirmPassword: string;
    };
    onCancel: () => void;
    onConfirm?: () => void;
}

export const OTPVerificationForm: React.FC<OTPVerificationFormProps> = ({
    otpVerificationData,
    setOtpVerificationData,
    kycData,
    onConfirm,
}) => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const {
        control,
        handleSubmit: handleFormSubmit,
        formState: { errors },
    } = useZodForm({
        schema: otpVerificationSchema,
        defaultValues: otpVerificationData,
    });

    const handleOtpSubmit = useCallback(
        async (data: OTPVerificationFormData) => {
            setIsSubmitting(true);
            try {
                if (kycData.mobileNo) {
                    try {
                        await authService.verifyOTPMobile({
                            mobileNo: kycData.mobileNo,
                            otp: data['otpCode'],
                        });
                        setIsOpen(true); // Only open modal on success
                    } catch (_error) {
                        console.error('OTP verification error:', _error);
                        // Optionally show error to user
                        return;
                    }
                }
                setOtpVerificationData({
                    otpCode: data['otpCode'] || '',
                });
            } finally {
                setIsSubmitting(false);
            }
        },
        [kycData, onConfirm, setOtpVerificationData],
    );

    const handleResendOtp = useCallback(async () => {
        if (!kycData.mobileNo) return;
        try {
            await authService.resendOTPMobile({ mobileNo: kycData.mobileNo });
        } catch (_error) {
            // Handle error
        }
    }, [kycData]);

    const handleModalClose = async () => {
        try {
            await authService.updateUserKYC({
                mobile: kycData.mobileNo,
                cnic: kycData.cnic,
                username: kycData.userName,
            });
        } catch (_error) {
            // Handle error
        } finally {
            setIsOpen(false);
            navigate('/dashboard');
        }
    };

    return (
        <>
            <form onSubmit={handleFormSubmit(handleOtpSubmit)} className="space-y-4">
                {/* OTP Icon and Description */}
                <div className="text-center py-6">
                    <img
                        src={getAssetPath(`assets/images/otp-image.png`)}
                        alt="Otp Image"
                        className="w-30 h-30 mx-auto"
                    />
                    {/* Description */}
                    <h3 className="text-2xl font-semibold text-primary mt-6">OTP Verification</h3>
                    <p className="text-[#9A9A9A] text-sm">
                        Enter the code from the sms we sent{' '}
                        <span className="text-[#252955] font-bold">{kycData.mobileNo}</span>
                    </p>
                </div>

                <div className="flex justify-center">
                    <Stepper steps={3} activeStep={3} />
                </div>

                {/* Timer/Resend Section */}
                <p className="text-center text-primary text-sm font-medium mb-2">
                    <CountdownTimer seconds={120} />
                </p>

                {/* OTP Input Fields */}
                <Controller
                    name="otpCode"
                    control={control}
                    render={({ field }) => (
                        <OTPInput
                            value={field.value || ''}
                            onChange={field.onChange}
                            error={errors['otpCode']?.message}
                            length={6}
                        />
                    )}
                />
                {errors['otpCode'] && (
                    <p className="text-red-500 text-sm text-center">{errors['otpCode'].message}</p>
                )}

                {/* Action Buttons */}
                <div className="flex justify-center gap-4 pt-4">
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        testId="otp-submit"
                        loading={isSubmitting}
                        className="w-full"
                    >
                        Submit
                    </Button>
                </div>

                {/* Footer Links */}
                <div className="text-center mt-6">
                    <p className="text-[#9A9A9A] text-sm">
                        I didn't receive any code.{' '}
                        <button
                            className="text-[#252955] font-bold cursor-pointer"
                            onClick={handleResendOtp}
                        >
                            {' '}
                            RESEND
                        </button>
                    </p>
                </div>
            </form>

            <Modal
                isOpen={isOpen}
                onClose={handleModalClose}
                imageSrc={getAssetPath('assets/images/otp-verified.png')}
                title="OTP Verified"
                description="Your identity has been confirmed. Logging you into the dashboard."
            />
        </>
    );
};
