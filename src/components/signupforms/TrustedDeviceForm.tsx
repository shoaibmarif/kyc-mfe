import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextInput, Select, Button } from 'customMain/components';
import Stepper from '../common/Stepper';
import { trustedDeviceSchema, TrustedDeviceFormData } from '../../pages/validations';
import { authService } from '../../services/auth.service';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TRUST_OPTIONS = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
];

interface TrustedDeviceFormProps {
    trustedDeviceData: {
        registerDevice: boolean;
        validityPeriod: string;
    };
    setTrustedDeviceData: (v: { registerDevice: boolean; validityPeriod: string }) => void;
    onConfirm?: () => void;
    kycData: { employeeId: string; cnic: string; email: string; mobileNo: string };
    mfaData: { setupKey: string; authenticatorCode: string };
    otpPreferenceData: { method: string; destination: string; otpCode: string };
}

const TrustedDeviceForm: React.FC<TrustedDeviceFormProps> = ({
    trustedDeviceData,
    setTrustedDeviceData,
    kycData,
    mfaData,
    otpPreferenceData,
}) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<TrustedDeviceFormData>({
        resolver: zodResolver(trustedDeviceSchema),
        defaultValues: trustedDeviceData,
    });
    const registerDevice = watch('registerDevice');
    const selectedTrust = TRUST_OPTIONS.find(
        (opt) => opt.value === (registerDevice ? 'yes' : 'no'),
    );

    const onFormSubmit = async (data: TrustedDeviceFormData) => {
        setIsLoading(true);
        try {
            // Generate a new deviceId for each submission
            const randomId = Math.random().toString(36).substring(2, 10);
            const deviceId = `dev_${randomId}`;
            const payload = {
                employeeId: kycData?.employeeId,
                cnic: kycData?.cnic,
                email: kycData?.email,
                mobileNo: kycData?.mobileNo,
                setUpKey: mfaData?.setupKey,
                methodId: otpPreferenceData?.method,
                isRegisterDevice: data.registerDevice,
                deviceId,
                validityPeriod: data.validityPeriod && data.validityPeriod !== '' ? Number(data.validityPeriod) : 0,
            };
            await authService.signupTrustedDevice(payload);
            setTrustedDeviceData({
                registerDevice: data.registerDevice,
                validityPeriod: data.validityPeriod || '',
            });
            navigate('/');
        } catch (error) {
            // Optionally show error to user
            console.error('Error registering trusted device:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <div className="text-center py-6">
                <h3 className="text-2xl font-semibold text-primary mt-6">
                    Trusted Device (Optional)
                </h3>
                <p className="text-[#9A9A9A] text-sm">
                    Register this device as trusted for a validity period.
                </p>
            </div>
            <div className="flex justify-center">
                <Stepper steps={5} activeStep={5} />
            </div>
            <div className="flex flex-col gap-4">
                <div>
                    <label className="block text-primary text-sm font-semibold mb-2">
                        Register this device as Trusted?
                    </label>
                    <Controller
                        name="registerDevice"
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={TRUST_OPTIONS}
                                value={selectedTrust}
                                onChange={(opt: any) => field.onChange(opt.value === 'yes')}
                                placeholder="Select option"
                                isSearchable={false}
                                error={errors['registerDevice']?.message}
                            />
                        )}
                    />
                    {errors['registerDevice'] && (
                        <p className="text-red-500 text-xs mt-1">{errors['registerDevice'].message}</p>
                    )}
                </div>
                <div>
                    <label className="block text-primary text-sm font-semibold mb-2">
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
                    {errors['validityPeriod'] && (
                        <p className="text-red-500 text-xs mt-1">{errors['validityPeriod'].message}</p>
                    )}
                </div>
            </div>
            <div className="pt-4">
                <Button type="submit" variant="primary" className="w-full" loading={isLoading}>
                    Confirm
                </Button>
            </div>
        </form>
    );
};

export default TrustedDeviceForm;
