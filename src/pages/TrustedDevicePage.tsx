import { Controller } from 'react-hook-form';
import { Button, TextInput, Select, SelectOption } from 'customMain/components';
import { useZodForm } from 'customMain/hooks';
import { trustedDeviceSchema, type TrustedDeviceFormData } from './validations';
import { authService } from '../services/auth.service';
import { useState } from 'react';

interface TrustedDevicePageProps {
    trustedDeviceData: {
        registerDevice: boolean;
        validityPeriod: string;
    };
    setTrustedDeviceData: (v: { registerDevice: boolean; validityPeriod: string }) => void;
    onCancel: () => void;
    onConfirm?: () => void;
    kycData: { employeeId: string; cnic: string; email: string; mobileNo: string };
    mfaData: {
        setupKey: string;
        authenticatorCode: string;
    };
    otpPreferenceData: {
        method: string;
        destination: string;
        otpCode: string;
    };
}

const TRUST_OPTIONS: SelectOption[] = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
];

export const TrustedDevicePage: React.FC<TrustedDevicePageProps> = ({
    trustedDeviceData,
    setTrustedDeviceData,
    onCancel,
    onConfirm,
    kycData,
    mfaData,
    otpPreferenceData,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const {
        control,
        handleSubmit: handleFormSubmit,
        formState: { errors },
        watch,
    } = useZodForm({
        schema: trustedDeviceSchema,
        defaultValues: trustedDeviceData,
    });

    const registerDevice = watch('registerDevice');
    const selectedTrust = TRUST_OPTIONS.find(
        (opt) => opt.value === (registerDevice ? 'yes' : 'no'),
    );

    const handleFinish = () => {
        if (onConfirm) {
            onConfirm();
            return;
        }
        window.location.href = '/login';
    };

    const handleSubmit = async (data: TrustedDeviceFormData) => {
        setIsLoading(true);
        try {
            const payload = {
                employeeId: kycData?.employeeId,
                cnic: kycData?.cnic,
                email: kycData?.email,
                mobileNo: kycData?.mobileNo,
                setUpKey: mfaData?.setupKey,
                methodId: otpPreferenceData?.method,
                isRegisterDevice: data.registerDevice,
                deviceId: "dev_23233232",
                validityPeriod: data.validityPeriod || '',
            };

            await authService.signupTrustedDevice(payload);

            setTrustedDeviceData({
                registerDevice: data.registerDevice,
                validityPeriod: data.validityPeriod || '',
            });
            handleFinish();
        } catch (error) {
            console.error('Error registering trusted device:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleFormSubmit(handleSubmit)}
            className="bg-gradient-to-br from-[#232a1e] to-[#232a1e]/80 rounded-2xl p-8 w-full max-w-2xl shadow-2xl border border-[#3a3f2e] mx-auto"
        >
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                        Trusted Device (Optional)
                    </h2>
                    <p className="text-sm text-gray-300">
                        Register this device as trusted for a validity period.
                    </p>
                </div>
                <div className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-full">
                    <span className="text-xs font-semibold text-gray-300">Device: Current</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-gray-300 mb-2 text-sm font-semibold">
                        Register this device as Trusted?
                    </label>
                    <Controller
                        name="registerDevice"
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={TRUST_OPTIONS}
                                value={selectedTrust}
                                onChange={(opt: SelectOption) =>
                                    field.onChange(String(opt.value) === 'yes')
                                }
                                placeholder="Select option"
                                isSearchable={false}
                            />
                        )}
                    />
                </div>

                <div>
                    <label className="block text-gray-300 mb-2 text-sm font-semibold">
                        Validity Period (Days)
                    </label>
                    <Controller
                        name="validityPeriod"
                        control={control}
                        render={({ field }) => (
                            <TextInput
                                {...field}
                                value={field.value || ''}
                                placeholder="30"
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    field.onChange(value);
                                }}
                                error={errors['validityPeriod']?.message}
                                testId="signup-validity-period"
                            />
                        )}
                    />
                </div>
            </div>

            <div className="mb-6 p-3 bg-gray-700/40 border border-gray-600 rounded">
                <p className="text-xs text-gray-400">
                    Trusted device reduces future challenges (policy)
                </p>
            </div>

            <div className="flex justify-between gap-2">
                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={onCancel}
                    testId="signup-trusted-back"
                    disabled={isLoading}
                >
                    Back
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    testId="signup-complete"
                    disabled={isLoading}
                >
                    {isLoading ? 'Processing...' : 'Finish & Issue Credentials'}
                </Button>
            </div>
        </form>
    );
};
