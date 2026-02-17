import { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { Button, TextInput } from 'customMain/components';
import { useZodForm } from '../hooks/useZodForm';
import { mfaEnrollmentSchema, type MFAEnrollmentFormData } from './validations';
import { authService } from '../services/auth.service';

interface MFAEnrollmentPageProps {
    mfaData: {
        setupKey: string;
        qrCode: string;
        authenticatorCode: string;
    };
    setMfaData: (v: { setupKey: string; qrCode: string; authenticatorCode: string }) => void;
    onCancel: () => void;
    onConfirm?: () => void;
}

export const MFAEnrollmentPage: React.FC<MFAEnrollmentPageProps> = ({
    mfaData,
    setMfaData,
    onCancel,
    onConfirm,
}) => {
    const [regenerateCount, setRegenerateCount] = useState(0);

    const {
        control,
        handleSubmit: handleFormSubmit,
        formState: { errors },
        setValue,
    } = useZodForm({
        schema: mfaEnrollmentSchema,
        defaultValues: mfaData,
    });

    const generateSetupKey = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        let key = '';
        for (let i = 0; i < 32; i++) {
            key += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        const newQRCode = `otpauth://totp/InternalApp%3A${encodeURIComponent('user@internal')}?secret=${key}&issuer=InternalApp`;
        setValue('setupKey', key);
        setValue('qrCode', newQRCode);
        setMfaData({
            setupKey: key,
            qrCode: newQRCode,
            authenticatorCode: mfaData.authenticatorCode,
        });
        setRegenerateCount(regenerateCount + 1);
        // Fetch demo code with new setup key
        fetchDemoCode(key);
    };

    const fetchDemoCode = async (setupKey: string) => {
        try {
            const response = await authService.signupMfaEnrollmentAuthenticator({ setUpKey: setupKey });
            setMfaData({
                ...mfaData,
                authenticatorCode: response.data.otp,
            });
        } catch (_error) {
            setMfaData({
                ...mfaData,
                authenticatorCode: 'Error loading code',
            });
        }
    };

    const handleMfaSubmit = (data: MFAEnrollmentFormData) => {
        setMfaData({
            setupKey: data['setupKey'] || '',
            qrCode: data['qrCode'] || '',
            authenticatorCode: data['authenticatorCode'] || ''
        });
        if (onConfirm) onConfirm();
    };

    useEffect(() => {
        if (!mfaData.setupKey) {
            generateSetupKey();
        } else {
            // Fetch demo code for existing setup key
            fetchDemoCode(mfaData.setupKey);
        }
    }, []); // Only on mount

    return (
        <form
            onSubmit={handleFormSubmit(handleMfaSubmit)}
            className="bg-gradient-to-br from-[#232a1e] to-[#232a1e]/80 rounded-2xl p-8 w-full max-w-2xl shadow-2xl border border-[#3a3f2e] mx-auto"
        >
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                        Sign-up — MFA Enrollment (Authenticator)
                    </h2>
                    <p className="text-sm text-gray-300">
                        Mandatory enrollment after OTP verification.
                    </p>
                </div>
                <div className="px-4 py-2 bg-yellow-900/40 border border-yellow-700 rounded-full">
                    <span className="text-xs font-semibold text-yellow-300">MFA: Pending</span>
                </div>
            </div>

            {/* Setup Key Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-gray-300 mb-2 text-sm font-semibold">
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
                    <label className="block text-gray-300 mb-2 text-sm font-semibold">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-gray-300 mb-2">
                        Enter code from Authenticator{' '}
                        <span className="text-yellow-300 text-xs align-top ml-1">required</span>
                    </label>
                    <Controller
                        name="authenticatorCode"
                        control={control}
                        render={({ field }) => (
                            <TextInput
                                {...field}
                                placeholder="6-digit code"
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                    field.onChange(value);
                                }}
                                maxLength={6}
                                error={errors['authenticatorCode']?.message}
                                testId="signup-mfa-code"
                            />
                        )}
                    />
                </div>

                {/* Demo Helper */}
                <div>
                    <label className="block text-gray-300 mb-2 text-sm font-semibold">
                        Demo Helper
                    </label>
                    <TextInput
                        value={`Current valid code (demo): ${mfaData.authenticatorCode || 'Loading...'}`}
                        disabled
                        testId="signup-mfa-demo-helper"
                    />
                </div>
            </div>

            <div className="flex justify-between gap-2 mb-4">
                <div>
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={generateSetupKey}
                        testId="signup-regenerate-setup-key"
                    >
                        Regenerate Setup Key
                    </Button>
                </div>
                <div className="flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={onCancel}
                        testId="signup-back"
                    >
                        Back
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        testId="signup-verify-mfa"
                    >
                        Confirm
                    </Button>
                </div>
            </div>
        </form>
    );
};
