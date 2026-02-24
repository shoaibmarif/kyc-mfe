import React, { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { mfaEnrollmentSchema, MFAEnrollmentFormData } from '../../pages/validations';
import { authService } from '../../services/auth.service';
import { TextInput, Button } from 'customMain/components';
import CountdownTimer from '../common/CountdownTimer';
import Stepper from '../common/Stepper';
import { getAssetPath } from '../../utils/assets';
import OTPInput from '../common/OTPInput';

interface MFAEnrollmentFormProps {
    setupKey: string;
    qrCode: string;
    authenticatorCode?: string;
    mfaData: {
        setupKey: string;
        qrCode: string;
        authenticatorCode: string;
    };
    setMfaData: (v: { setupKey: string; qrCode: string; authenticatorCode: string }) => void;
    onSuccess?: () => void;
}

const MFAEnrollmentForm: React.FC<MFAEnrollmentFormProps> = ({
    setupKey,
    qrCode,
    mfaData,
    setMfaData,
    onSuccess,
}) => {
    const [isSubmitting] = useState(false);

    // Provide a static setupKey if not passed
    const staticSetupKey = setupKey || mfaData.setupKey || 'JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP';
    const staticQrCode =
        qrCode ||
        mfaData.qrCode ||
        `otpauth://totp/InternalApp%3Auser@internal?secret=${staticSetupKey}&issuer=InternalApp`;

    const {
        control,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<MFAEnrollmentFormData>({
        resolver: zodResolver(mfaEnrollmentSchema),
        defaultValues: {
            setupKey: staticSetupKey,
            qrCode: staticQrCode,
            authenticatorCode: mfaData.authenticatorCode || '',
        },
    });

    // Fetch demo code for current setup key
    const fetchDemoCode = async (setupKey: string) => {
        try {
            await authService.signupMfaEnrollmentAuthenticator({
                setUpKey: setupKey,
            });
        } catch (_e) {
            // Optionally log or handle error
        }
    };

    useEffect(() => {
        fetchDemoCode(getValues('setupKey'));
    }, []);

     const handleMfaSubmit = (data: MFAEnrollmentFormData) => {
        setMfaData({
            setupKey: data['setupKey'] || '',
            qrCode: data['qrCode'] || '',
            authenticatorCode: data['authenticatorCode'] || ''
        });
        if (onSuccess) onSuccess();
    };

    return (
        <form onSubmit={handleSubmit(handleMfaSubmit)} className="space-y-4">
            <div className="text-center py-6">
                <img
                    src={getAssetPath(`assets/images/otp-image.png`)}
                    alt="Otp Image"
                    className="w-30 h-30 mx-auto"
                />
                {/* Description */}
                <h3 className="text-2xl font-semibold text-primary mt-6">MFA Enrollment</h3>
            </div>

            <div className="flex justify-center mb-4">
                <Stepper steps={5} activeStep={3} />
            </div>

            {/* Setup Key Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-primary text-sm font-semibold mb-2">
                        Setup Key (Base32)
                    </label>
                    <Controller
                        name="setupKey"
                        control={control}
                        render={({ field }) => (
                            <TextInput
                                {...field}
                                disabled
                                error={errors['setupKey']?.message}
                                testId="signup-mfa-setup-key"
                            />
                        )}
                    />
                </div>

                <div>
                    <label className="block text-primary mb-2 text-sm font-semibold">
                        QR Payload (otpauth URI)
                    </label>
                    <Controller
                        name="qrCode"
                        control={control}
                        render={({ field }) => (
                            <TextInput
                                {...field}
                                disabled
                                error={errors['qrCode']?.message}
                                testId="signup-mfa-qr-payload"
                            />
                        )}
                    />
                </div>
            </div>

            {/* Authenticator Code Input */}
            <div className="flex justify-center mt-4">
                <CountdownTimer seconds={60} />
            </div>
            <div>
                <label className="block text-primary mb-2 text-base font-semibold">
                    Enter the authenticator code
                </label>
                <Controller
                    name="authenticatorCode"
                    control={control}
                    render={({ field }) => (
                        <OTPInput
                            value={field.value}
                            onChange={field.onChange}
                            error={errors['authenticatorCode']?.message}
                            length={6}
                        />
                    )}
                />
                {errors['authenticatorCode'] && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors['authenticatorCode'].message}
                    </p>
                )}
            </div>

            {/* error display removed as error state is unused */}

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pt-4">
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    testId="mfa-submit"
                    loading={isSubmitting}
                    className="w-full"
                >
                    Confirm
                </Button>
            </div>
        </form>
    );
};

export default MFAEnrollmentForm;
