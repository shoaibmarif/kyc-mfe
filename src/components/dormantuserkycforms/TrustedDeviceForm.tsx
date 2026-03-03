import { Controller, useForm } from 'react-hook-form';
import { Button, Checkbox } from 'customMain/components';
import Stepper from '../common/Stepper';
import { Modal } from '../common/Modal';
import { trustedDeviceSchema, TrustedDeviceFormData } from '../../pages/validations';
import { authService } from '../../services/auth.service';
import { useEffect, useState, useTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAssetPath } from '../../utils/assets';

type DeliveryMethodOption = {
    value: string;
    label: string;
};

const DEFAULT_METHOD_OPTIONS: DeliveryMethodOption[] = [
    { value: '1', label: 'Authenticator App' },
    { value: '2', label: 'SMS OTP (Fallback)' },
    { value: '3', label: 'Email OTP (Fallback)' },
];

interface TrustedDeviceFormProps {
    trustedDeviceData: {
        methodId: string;
        registerDevice: boolean;
    };
    setTrustedDeviceData: (v: { methodId: string; registerDevice: boolean }) => void;
    kycData: { employeeId: string; cnic: string; userName: string; mobileNo: string; newPassword: string };
}

const TrustedDeviceForm: React.FC<TrustedDeviceFormProps> = ({
    trustedDeviceData,
    setTrustedDeviceData,
    kycData,
}) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [, startTransition] = useTransition();
    const [methodOptions, setMethodOptions] =
        useState<DeliveryMethodOption[]>(DEFAULT_METHOD_OPTIONS);

    const {
        control,
        handleSubmit,
        formState: { errors },
        clearErrors,
        setError,
        setValue,
        watch,
    } = useForm<TrustedDeviceFormData>({
        defaultValues: {
            methodId: trustedDeviceData.methodId || '',
            registerDevice: trustedDeviceData.registerDevice,
        },
    });

    const selectedMethod = watch('methodId');

    useEffect(() => {
        const mapOptions = (raw: any[]): DeliveryMethodOption[] =>
            raw.map((item: any, idx: number) => ({
                value: String(
                    item?.value ??
                        item?.methodId ??
                        item?.id ??
                        item?.otpPreferenceMethodId ??
                        idx + 1,
                ),
                label: String(
                    item?.label ??
                        item?.methodName ??
                        item?.name ??
                        item?.title ??
                        `Method ${idx + 1}`,
                ),
            }));

        const applyOptions = (options: DeliveryMethodOption[]) => {
            startTransition(() => {
                setMethodOptions(options);
            });
        };

        const fetchOTPPreferenceMethods = async () => {
            try {
                const res = await authService.getOTPPreferenceMethod();
                const raw = res?.data?.data ?? res?.data;
                const options =
                    Array.isArray(raw) && raw.length > 0 ? mapOptions(raw) : DEFAULT_METHOD_OPTIONS;
                applyOptions(options);
            } catch (_error) {
                applyOptions(DEFAULT_METHOD_OPTIONS);
            }
        };

        fetchOTPPreferenceMethods();
    }, [selectedMethod, setValue]);

    const onFormSubmit = async (data: TrustedDeviceFormData) => {
        setSubmitError('');

        const parsed = trustedDeviceSchema.safeParse(data);
        if (!parsed.success) {
            const firstIssue = parsed.error.issues[0];
            if (firstIssue?.path?.[0] === 'methodId') {
                setError('methodId', {
                    type: 'manual',
                    message: firstIssue.message,
                });
            }
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                employeeID: kycData?.employeeId,
                cnicNumber: kycData?.cnic,
                username: kycData?.userName,
                password: kycData?.newPassword,
                mobileNumber: kycData?.mobileNo,
                isForgotPassword: false,
                isDormantUser: true,
            };
            await authService.dormantUserKYC(payload);
            setTrustedDeviceData({
                methodId: data.methodId,
                registerDevice: data.registerDevice,
            });
            setShowSuccessModal(true);
        } catch (_error) {
            setSubmitError('Unable to continue right now. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onFormSubmit)} className="w-full space-y-4">
                <div className="text-center px-2">
                    <h3 className="text-2xl font-bold text-primary">OTP Delivery Preference</h3>
                    <p className="text-[#9A9A9A] text-[12px]">
                        Choose your preferred OTP channel. Authentication remains primary after
                        enrollment; SMS/Email are fallback.
                    </p>
                </div>

                <div className="flex justify-center pt-1">
                    <Stepper steps={3} activeStep={3} />
                </div>

                <div className="space-y-4 pt-1">
                    <div className="space-y-2">
                        <h4 className="text-center text-[25px] leading-8 font-semibold text-primary">
                            Preferred Method
                        </h4>
                        <p className="text-center text-[12px] text-[#9A9A9A]">
                            Choose your preferred method for receiving one-time passwords
                        </p>
                        <div className="pt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                            {methodOptions.map((method) => (
                                <label
                                    key={method.value}
                                    className="flex items-center gap-2.5 text-[13px] leading-4 text-[#9A9A9A]"
                                >
                                    <Checkbox
                                        checked={selectedMethod === method.value}
                                        onChange={() => {
                                            clearErrors('methodId');
                                            setValue('methodId', method.value, {
                                                shouldValidate: true,
                                                shouldDirty: true,
                                            });
                                        }}
                                        className="h-4 w-4"
                                    />
                                    <span className="whitespace-nowrap">{`${method.label}`}</span>
                                </label>
                            ))}
                        </div>
                        {errors['methodId'] && (
                            <p className="text-center text-red-500 text-xs mt-1">
                                {errors['methodId'].message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <h4 className="text-center text-[25px] leading-8 font-semibold text-primary">
                            Trusted Device
                        </h4>
                        <p className="text-center text-[12px] text-[#9A9A9A] px-2">
                            You may register this device as trusted to avoid repeated OTP prompts
                            for account reactivation on new/untrusted devices.
                        </p>
                    </div>

                    <div className="pt-1">
                        <Controller
                            name="registerDevice"
                            control={control}
                            render={({ field }) => (
                                <label className="mx-auto flex max-w-xl items-start gap-3 rounded-md border border-[#E5E7EF] px-4 py-3.5 cursor-pointer">
                                    <Checkbox
                                        checked={field.value}
                                        onChange={field.onChange}
                                        className="mt-0.5 h-5 w-5"
                                    />
                                    <span className="flex flex-col gap-1">
                                        <span className="text-[15px] leading-5 font-medium text-[#1E213E]">
                                            Register this device as Trusted?
                                        </span>
                                        <span className="text-[11px] leading-4 text-[#9A9A9A]">
                                            You won't be asked for OTP on this device for 30 days.
                                        </span>
                                    </span>
                                </label>
                            )}
                        />
                    </div>
                </div>

                <div className="pt-6 flex justify-center">
                    <Button type="submit" variant="primary" size="md" loading={isLoading}>
                        Reactivate Account
                    </Button>
                </div>
                {submitError && <p className="text-center text-red-500 text-xs">{submitError}</p>}
            </form>

            <Modal
                isOpen={showSuccessModal}
                onClose={() => {
                    setShowSuccessModal(false);
                    navigate('/');
                }}
                imageSrc={getAssetPath(`assets/images/user-onboarding.png`)}
                title="User Re-validated Successfully"
                description="Your account has been successfully re-validated and is now active. You can continue using the system normally."
                buttonText="Continue"
            />
        </>
    );
};

export default TrustedDeviceForm;
