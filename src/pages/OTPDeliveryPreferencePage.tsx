import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { Button, TextInput,Select, SelectOption } from 'customMain/components';
import { useZodForm } from 'customMain/hooks';
import { otpDeliveryPreferenceSchema, type OTPDeliveryPreferenceFormData } from './validations';
import { authService } from '../services/auth.service';

interface OTPDeliveryPreferencePageProps {
    mfaData: {
        setupKey: string;
        authenticatorCode: string;
    };
    otpPreferenceData: {
        method: string;
        destination: string;
        otpCode: string;
    };
    setOtpPreferenceData: (v: { method: string; destination: string; otpCode: string }) => void;
    onCancel: () => void;
    onConfirm?: () => void;
}

const DELIVERY_OPTIONS: SelectOption[] = [
    { value: '1', label: 'Authenticator (Fallback)' },
    { value: '2', label: 'SMS OTP (Fallback)' },
    { value: '3', label: 'Email OTP (Fallback)' },
];

export const OTPDeliveryPreferencePage: React.FC<OTPDeliveryPreferencePageProps> = ({
    mfaData,
    otpPreferenceData,
    setOtpPreferenceData,
    onCancel,
    onConfirm,
}) => {
    const [deliveryOptions, setDeliveryOptions] = useState<any[]>(DELIVERY_OPTIONS);
    const [isLoadingOptions, setIsLoadingOptions] = useState(false);
    const [isLoadingSendOtp, setIsLoadingSendOtp] = useState(false);
    const [demoHint, setDemoHint] = useState<string>('Demo hint: 666815');
    const {
        control,
        handleSubmit: handleFormSubmit,
        formState: { errors },
        watch,
    } = useZodForm({
        schema: otpDeliveryPreferenceSchema,
        defaultValues: otpPreferenceData,
    });

    const methodValue = watch('method');

    const fetchOTPPreferenceMethods = async () => {
        setIsLoadingOptions(true);
        try {
            const res = await authService.getOTPPreferenceMethod();
            const raw = res?.data?.data ?? res?.data ?? [];
            setDeliveryOptions(Array.isArray(raw) && raw.length > 0 ? raw : DELIVERY_OPTIONS);
        } catch (_error) {
            setDeliveryOptions(DELIVERY_OPTIONS);
        } finally {
            setIsLoadingOptions(false);
        }
    };

    useEffect(() => {
        fetchOTPPreferenceMethods();
    }, []);

    const handleSendOtp = async () => {
        if (!methodValue) {
            return;
        }
        setIsLoadingSendOtp(true);
        try {
            await authService.signupSendOtpDeliveryPreference({
                otpPreferenceMethodId: otpPreferenceData.method,
                mobileNo: otpPreferenceData.destination,
            });
        } catch (_error) {
            setDemoHint('Demo hint: Error sending OTP');
        } finally {
            setIsLoadingSendOtp(false);
        }
    };

    const handleSubmit = async (data: OTPDeliveryPreferenceFormData) => {
        try {
            await authService.signupVerifyOtpDeliveryPreference({
                mobileNo: data.destination,
                otpCode: data.otpCode || '',
                methodId: otpPreferenceData.method,
                setUpKey: mfaData.setupKey,
                authenticatorCode: mfaData.authenticatorCode,
            });
            setOtpPreferenceData({
                method: data.method,
                destination: data.destination,
                otpCode: data.otpCode || '',
            });
            if (onConfirm) onConfirm();
        } catch (error) {
            console.error('OTP delivery preference error:', error);
            // Don't auto-advance on error
        }
    };

    return (
        <form
            onSubmit={handleFormSubmit(handleSubmit)}
            className="bg-gradient-to-br from-[#232a1e] to-[#232a1e]/80 rounded-2xl p-8 w-full max-w-2xl shadow-2xl border border-[#3a3f2e] mx-auto"
        >
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">OTP Delivery Preference</h2>
                    <p className="text-sm text-gray-300">
                        Authenticator remains primary. SMS/Email are fallback only.
                    </p>
                </div>
                <div className="px-4 py-2 bg-yellow-900/40 border border-yellow-700 rounded-full">
                    <span className="text-xs font-semibold text-yellow-300">Mode: ONBOARDING</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-gray-300 mb-2 text-sm font-semibold">
                        Preferred Method
                    </label>
                    <Controller
                        name="method"
                        control={control}
                        render={({ field }) => (
                            <>
                                <Select
                                    options={deliveryOptions}
                                    onChange={(opt: SelectOption) => {
                                        field.onChange(String(opt.value));
                                        setOtpPreferenceData({
                                            ...otpPreferenceData,
                                            method: String(opt.value),
                                        });
                                    }}
                                    placeholder="Select method"
                                    isLoading={isLoadingOptions}
                                    isSearchable={false}
                                />
                                {errors['method'] && (
                                    <span className="text-red-500 text-sm mt-1">
                                        {errors['method'].message}
                                    </span>
                                )}
                            </>
                        )}
                    />
                </div>
                <div>
                    <label className="block text-gray-300 mb-2 text-sm font-semibold">
                        Destination (KYC-verified)
                    </label>
                    <Controller
                        name="destination"
                        control={control}
                        render={({ field }) => (
                            <TextInput {...field} disabled testId="signup-otp-destination" />
                        )}
                    />
                </div>
            </div>

            <div className="mb-3">
                <label className="block text-gray-300 mb-2 text-sm font-semibold">SMS OTP</label>
                <Controller
                    name="otpCode"
                    control={control}
                    render={({ field }) => (
                        <TextInput
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                field.onChange(value);
                            }}
                            placeholder="6-digit OTP"
                            maxLength={6}
                            error={errors['otpCode']?.message}
                            testId="signup-otp-preference-code"
                        />
                    )}
                />
            </div>

            <p className="text-xs text-gray-400 mb-4">
                Send a 6-digit code to your KYC-verified mobile and enter it to confirm.
            </p>

            <div className="flex flex-wrap gap-2 items-center mb-4">
                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleSendOtp}
                    loading={isLoadingSendOtp}
                    testId="signup-send-otp"
                >
                    Send OTP
                </Button>
                <p className="text-xs text-gray-400">{demoHint}</p>
            </div>

            <div className="flex justify-between gap-2 mb-4">
                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={onCancel}
                    testId="signup-otp-pref-back"
                >
                    Back
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    testId="signup-otp-pref-confirm"
                >
                    Confirm
                </Button>
            </div>
        </form>
    );
};
