import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button, TextInput } from 'customMain/components';
import { useZodForm } from 'customMain/hooks';
import { authService } from '../services/auth/auth.service';
import { passwordResetSchema, type PasswordResetFormData } from './validations';
import Stepper from '../components/common/Stepper';
import Modal from '../components/common/Modal';
import { getAssetPath } from '../utils/assets';
import { AuthLayout } from '../components/layout';

const FORM_FIELDS = [
    {
        name: 'userName',
        label: 'User Name',
        placeholder: 'User Name',
        icon: 'user-icon.png',
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

const PasswordReset: React.FC = () => {
    const navigate = useNavigate();
    const [submitError, setSubmitError] = useState('');
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useZodForm<PasswordResetFormData>({
        schema: passwordResetSchema,
        defaultValues: {
            userName: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: PasswordResetFormData) => {
        setSubmitError('');
        try {
            const randomId = Math.random().toString(36).slice(2, 10);
            await authService.passwordReset({
                userName: data.userName,
                newPassword: data.newPassword,
                deviceId: `dev_${randomId}`,
            });
            setIsSuccessModalOpen(true);
        } catch (_error) {
            setSubmitError('Unable to reset password right now. Please try again.');
        }
    };

    return (
        <AuthLayout>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full px-4 py-4">
                <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-primary">Password Reset</h3>
                    <p className="text-[#9A9A9A] text-sm mb-6">
                        You have logged in using a temporary password. Set a new password to
                        proceed.
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
                                name={field.name as keyof PasswordResetFormData}
                                control={control}
                                render={({ field: controllerField }) => (
                                    <TextInput
                                        {...controllerField}
                                        type={field.type || 'text'}
                                        placeholder={field.placeholder}
                                        error={
                                            errors[field.name as keyof PasswordResetFormData]
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
                    <p className="text-[11px] leading-4 text-[#6D738F] text-center">
                        Password policy: minimum 8 characters, including uppercase letter, lowercase
                        letter, number, and symbol.
                    </p>
                </div>

                {submitError && (
                    <p className="mt-3 text-center text-red-500 text-xs">{submitError}</p>
                )}

                <div className="mt-6">
                    <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        loading={isSubmitting}
                        className="w-full"
                    >
                        Update Password
                    </Button>
                </div>
            </form>

            <Modal
                isOpen={isSuccessModalOpen}
                onClose={() => {
                    setIsSuccessModalOpen(false);
                    navigate('/');
                }}
                imageSrc={getAssetPath('assets/images/otp-verified.png')}
                title="Password Reset Successfully"
                description="Your password has been updated successfully. Redirecting you to login."
                buttonText="Ok"
            />
        </AuthLayout>
    );
};

export default PasswordReset;
