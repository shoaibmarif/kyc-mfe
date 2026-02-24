import { memo } from 'react';
import { Controller } from 'react-hook-form';
import { Button, TextInput } from 'customMain/components';
import { useZodForm } from 'customMain/hooks';
import { authService } from '../../services/auth.service';
import { kycVerificationSchema, type KYCVerificationFormData } from '../../pages/validations';
import Stepper from '../common/Stepper';
import { getAssetPath } from '../../utils/assets';

interface KYCVerificationFormProps {
    kycData: KYCVerificationFormData;
    setKycData: (v: KYCVerificationFormData) => void;
    onConfirm?: () => void;
    onCancel?: () => void;
}

// Field configuration
const FORM_FIELDS = [
    {
        name: 'userName',
        label: 'User Name',
        placeholder: 'User Name',
        icon: 'user-icon.png',
        type: 'text',
    },
    {
        name: 'employeeId',
        label: 'Employee ID',
        placeholder: 'Employee ID',
        icon: 'user-icon.png',
        type: 'text',
    },
    {
        name: 'cnic',
        label: 'CNIC Number',
        placeholder: 'CNIC Number',
        icon: 'user-cnic.png',
        type: 'text',
    },
    {
        name: 'mobileNo',
        label: 'Mobile Number',
        placeholder: 'Mobile Number',
        icon: 'user-phone.png',
        type: 'text',
    },
    {
        name: 'newPassword',
        label: 'Create New Password',
        placeholder: 'Min. 8 Characters',
        icon: 'user-password.png',
        type: 'password',
    },
    {
        name: 'confirmPassword',
        label: 'Re-type Password',
        placeholder: 'Min. 8 Characters',
        icon: 'user-password.png',
        type: 'password',
    },
] as const;

export const KYCVerificationForm: React.FC<KYCVerificationFormProps> = memo(
    ({ kycData, setKycData, onConfirm }) => {
        const {
            control,
            handleSubmit,
            formState: { errors, isSubmitting },
        } = useZodForm({
            schema: kycVerificationSchema,
            defaultValues: kycData,
        });

        const handleKycSubmit = async (data: KYCVerificationFormData) => {
            try {
                await authService.signupKYCVerification({
                    employeeID: data.employeeId,
                    cnicNumber: data.cnic,
                    mobileNumber: data.mobileNo,
                    userName: data.userName,
                    password: data.newPassword,
                });
                await authService.sendOTPMobile({ mobileNo: data.mobileNo });
                setKycData(data);
                onConfirm?.();
            } catch (error) {
                console.error('KYC submission error:', error);
            }
        };

        return (
            <form onSubmit={handleSubmit(handleKycSubmit)} className="w-full px-4 py-4">
                <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-primary mb-4">Verify Identity (KYC)</h3>
                    <div className="flex justify-center">
                        <Stepper steps={3} activeStep={2} />
                    </div>
                </div>

                <div className="space-y-4">
                    {FORM_FIELDS.map((field) => (
                        <div key={field.name}>
                            <label className="block text-primary text-sm font-semibold mb-2">
                                {field.label}
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <Controller
                                name={field.name as keyof KYCVerificationFormData}
                                control={control}
                                render={({ field: controllerField }) => (
                                    <TextInput
                                        {...controllerField}
                                        type={field.type || 'text'}
                                        placeholder={field.placeholder}
                                        error={
                                            errors[field.name as keyof KYCVerificationFormData]
                                                ?.message
                                        }
                                        prefixIcon={
                                            <img
                                                src={getAssetPath(`assets/images/${field.icon}`)}
                                                alt=""
                                                className="w-4 h-4 opacity-70"
                                            />
                                        }
                                        className="bg-gray-50 border-gray-200 focus:bg-white transition-all"
                                    />
                                )}
                            />
                        </div>
                    ))}
                </div>

                <div className="mt-6">
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        loading={isSubmitting}
                        className="w-full"
                    >
                        Confirm And Request OTP
                    </Button>
                </div>
            </form>
        );
    },
);

KYCVerificationForm.displayName = 'KYCVerificationForm';
