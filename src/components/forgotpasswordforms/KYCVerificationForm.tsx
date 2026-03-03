import { memo } from 'react';
import { Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
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
}

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

const KYCVerificationForm: React.FC<KYCVerificationFormProps> = memo(
    ({ kycData, setKycData, onConfirm }) => {
        const navigate = useNavigate();
        const {
            control,
            handleSubmit,
            formState: { errors, isSubmitting },
        } = useZodForm({
            schema: kycVerificationSchema,
            defaultValues: kycData,
        });

        const handleCancel = () => {
            navigate('/');
        };

        const handleKycSubmit = async (data: KYCVerificationFormData) => {
            try {
                await authService.signupKYCVerification({
                    employeeID: data.employeeId,
                    cnicNumber: data.cnic,
                    mobileNumber: data.mobileNo,
                    username: data.userName,
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
                    <h3 className="text-2xl font-bold text-primary">Forgot Password</h3>
                    <p className="text-[#9A9A9A] text-sm mb-6">
                        Verify your identity to securely reset your account password.
                    </p>
                    <div className="flex justify-center">
                        <Stepper steps={3} activeStep={1} />
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

                <div className="mt-6 rounded border border-[#2529551A] bg-[#F3F5FC] px-3 py-2">
                    <div className="flex items-center justify-center gap-2">
                        <p className="text-[11px] leading-4 text-[#6D738F] text-center">
                            Enter Mobile Number Registered with FBR HRMS
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex gap-3">
                    <Button
                        type="button"
                        variant="secondary"
                        size="md"
                        onClick={handleCancel}
                        className="w-full"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        loading={isSubmitting}
                        className="w-full"
                    >
                        Confirm
                    </Button>
                </div>
            </form>
        );
    },
);

KYCVerificationForm.displayName = 'KYCVerificationForm';
export default KYCVerificationForm;
