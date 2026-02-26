import React, { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    otpDeliveryPreferenceSchema,
    OTPDeliveryPreferenceFormData,
} from '../../pages/validations';
import { authService } from '../../services/auth.service';
import { Select, Button } from 'customMain/components';
import Stepper from '../common/Stepper';
import CountdownTimer from '../common/CountdownTimer';
import OTPInput from '../common/OTPInput';

interface OTPDeliveryPreferenceFormProps {
    otpPreferenceData: OTPDeliveryPreferenceFormData;
    setOtpPreferenceData: (v: OTPDeliveryPreferenceFormData) => void;
    onCancel: () => void;
    onConfirm?: () => void;
    mobileNo?: string;
    mfaData: {
        setupKey: string;
        authenticatorCode: string;
    };
}

const DELIVERY_OPTIONS = [
    { value: '1', label: 'Authenticator (Fallback)' },
    { value: '2', label: 'SMS OTP (Fallback)' },
    { value: '3', label: 'Email OTP (Fallback)' },
];

const OTPDeliveryPreferenceForm: React.FC<OTPDeliveryPreferenceFormProps> = ({
    otpPreferenceData,
    setOtpPreferenceData,
    onConfirm,
    mobileNo,
    mfaData,
}) => {
    const [deliveryOptions, setDeliveryOptions] = useState(DELIVERY_OPTIONS);
    const [isLoadingOptions, setIsLoadingOptions] = useState(false);
    const [isLoadingSendOtp, setIsLoadingSendOtp] = useState(false);
    const [demoHint, setDemoHint] = useState<string>('Demo hint: 666815');

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<OTPDeliveryPreferenceFormData>({
        resolver: zodResolver(otpDeliveryPreferenceSchema),
        defaultValues: otpPreferenceData,
    });

    const methodValue = watch('method');

    useEffect(() => {
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
        fetchOTPPreferenceMethods();
    }, []);

    const handleSendOtp = async () => {
        if (!methodValue) return;
        setIsLoadingSendOtp(true);
        try {
            await authService.signupSendOtpDeliveryPreference({
                otpPreferenceMethodId: Number(methodValue),
                mobileNo,
            });
            setOtpPreferenceData({
                ...otpPreferenceData,
                method: methodValue,
            });
            setDemoHint('Demo hint: 666815');
        } catch (_error) {
            setDemoHint('Demo hint: Error sending OTP');
        } finally {
            setIsLoadingSendOtp(false);
        }
    };

    const handleDeliverPreferenceSubmit = async (data: OTPDeliveryPreferenceFormData) => {
        try {
            await authService.signupVerifyOtpDeliveryPreference({
                mobileNo,
                otpCode: data.otpCode || '',
                methodId: otpPreferenceData.method,
                setUpKey: mfaData.setupKey,
                authenticatorCode: mfaData.authenticatorCode,
            });
            setOtpPreferenceData({
                ...otpPreferenceData,
                method: data.method,
                otpCode: data.otpCode || '',
            });
            if (onConfirm) onConfirm();
        } catch (error) {
            console.error('OTP delivery preference error:', error);
            onConfirm();
            // Don't auto-advance on error
        }
    };

    return (
        <form onSubmit={handleSubmit(handleDeliverPreferenceSubmit)} className="space-y-4">
            <div className="text-center py-6">
                <h3 className="text-2xl font-semibold text-primary mt-6">
                    OTP Delivery Preference
                </h3>
            </div>
            <div className="flex justify-center">
                <Stepper steps={5} activeStep={4} />
            </div>
            <div className="flex flex-col gap-4">
                <div>
                    <label className="block text-primary text-sm font-semibold mb-2">
                        Delivery Method
                    </label>
                    <Controller
                        name="method"
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={deliveryOptions}
                                value={
                                    deliveryOptions.find((opt) => opt.value === field.value) || ''
                                }
                                onChange={(opt) => field.onChange(opt?.value || '')}
                                isLoading={isLoadingOptions}
                                error={errors.method?.message}
                                placeholder="Select delivery method"
                            />
                        )}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleSendOtp}
                        loading={isLoadingSendOtp}
                    >
                        Send OTP
                    </Button>
                    <span className="text-xs text-gray-500">{demoHint}</span>
                </div>
                <div className="flex justify-center mt-4">
                    <CountdownTimer seconds={60} />
                </div>
                <div>
                    <label className="block text-primary text-sm font-semibold mb-2">
                        OTP Code
                    </label>
                    <Controller
                        name="otpCode"
                        control={control}
                        render={({ field }) => (
                            <OTPInput
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.otpCode?.message}
                                length={6}
                            />
                        )}
                    />
                    {errors.otpCode && (
                        <p className="text-red-500 text-xs mt-1">{errors.otpCode.message}</p>
                    )}
                </div>
            </div>
            <div className="pt-4">
                <Button type="submit" variant="primary" className="w-full">
                    Confirm
                </Button>
            </div>
        </form>
    );
};

export default OTPDeliveryPreferenceForm;
