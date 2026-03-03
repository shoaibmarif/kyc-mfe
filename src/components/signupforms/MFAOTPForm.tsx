import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { mfaOtpFormSchema, MFAOTPFormData } from '../../pages/validations';
import { Button } from 'customMain/components';
import { useZodForm } from 'customMain/hooks';
import { showToast } from 'customMain/utils';
import Stepper from '../common/Stepper';
import OTPInput from '../common/OTPInput';
import { getAssetPath } from '../../utils/assets';

interface MFAOTPFormProps {
    mfaOTPData: MFAOTPFormData;
    setMfaOTPData: (v: MFAOTPFormData) => void;
    onCancel: () => void;
    onConfirm?: () => void;
    mobileNo?: string;
}

const MFAOTPForm: React.FC<MFAOTPFormProps> = ({ mfaOTPData, setMfaOTPData, onConfirm }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        control,
        handleSubmit: handleFormSubmit,
        formState: { errors },
    } = useZodForm({
        schema: mfaOtpFormSchema,
        defaultValues: mfaOTPData,
    });

    const handleDeliverPreferenceSubmit = async (data: MFAOTPFormData) => {
        setIsSubmitting(true);
        try {
            setMfaOTPData({ otpCode: data.otpCode });
            showToast.success('MFA OTP verified successfully');
            onConfirm?.();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleFormSubmit(handleDeliverPreferenceSubmit)} className="w-full">
            {/* Header */}
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-primary">
                    Multi-Factor Authentication Setup
                </h3>
                <p className="text-[#9A9A9A] text-sm">
                    Secure your account with third-party authenticator
                </p>
            </div>

            {/* Stepper */}
            <div className="flex justify-center mb-6">
                <Stepper steps={5} activeStep={4} />
            </div>

            {/* MFA Icon and Asterisks */}
            <div className="text-center py-8">
                <div className="inline-flex items-center justify-center mb-4">
                    <img
                        src={getAssetPath(`assets/images/otp-image.png`)}
                        alt="MFA Icon"
                        className="w-26 h-26 object-contain"
                    />
                </div>

                <h4 className="text-xl font-semibold text-primary">Enter Verification Code</h4>
                <p className="text-[#9A9A9A] text-sm">
                    Enter the 6-digit code from your authenticator app
                </p>
            </div>

            {/* OTP Input */}
            <div className="mb-6">
                <Controller
                    name="otpCode"
                    control={control}
                    render={({ field }) => (
                        <OTPInput
                            value={field.value || ''}
                            onChange={field.onChange}
                            error={errors.otpCode?.message}
                            length={6}
                        />
                    )}
                />
                {errors.otpCode && (
                    <p className="text-red-500 text-sm text-center mt-2">
                        {errors.otpCode.message}
                    </p>
                )}
            </div>

            {/* Verify Button */}
            <div className="flex justify-center pt-4">
                <Button type="submit" variant="primary" size="md" loading={isSubmitting}>
                    Verify MFA
                </Button>
            </div>
        </form>
    );
};

export default MFAOTPForm;
