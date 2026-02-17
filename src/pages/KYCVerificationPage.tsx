import { useCallback, useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';
import { Button, TextInput } from 'customMain/components';
import { useZodForm } from '../hooks/useZodForm';
import { authService } from '../services/auth.service';
import { kycVerificationSchema, type KYCVerificationFormData } from './validations';

interface KYCVerificationPageProps {
    kycData: { employeeId: string; cnic: string; email: string; mobileNo: string };
    setKycData: (v: { employeeId: string; cnic: string; email: string; mobileNo: string }) => void;
    onCancel: () => void;
    onConfirm?: () => void;
}

export const KYCVerificationPage: React.FC<KYCVerificationPageProps> = ({
    kycData,
    setKycData,
    onCancel,
    onConfirm,
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {
        control,
        handleSubmit: handleFormSubmit,
        formState: { errors },
        setValue,
        clearErrors,
    } = useZodForm({
        schema: kycVerificationSchema,
        defaultValues: kycData,
    });

    const demoData = useMemo(
        () => ({
            employeeId: '100245',
            cnic: '35202-1234567-1',
            email: 'ahmad.khan@dept.gov.pk',
            mobileNo: '03001234567',
        }),
        [],
    );

    const fillDemo = useCallback(() => {
        setValue('employeeId', demoData.employeeId);
        setValue('cnic', demoData.cnic);
        setValue('email', demoData.email);
        setValue('mobileNo', demoData.mobileNo);
        setKycData(demoData);
        clearErrors();
    }, [clearErrors, demoData, setKycData, setValue]);

    const handleKycSubmit = useCallback(async (data: KYCVerificationFormData) => {
        setIsSubmitting(true);
        try {
            const { employeeId, email, cnic, mobileNo } = data;
            await authService.signupKYCVerification({
                employeeID: employeeId,
                emailAddress: email,
                cnicNumber: cnic,
                mobileNumber: mobileNo,
            });
            await authService.sendOTPMobile({
                mobileNo: mobileNo,
            });
            // TEMP: Discard API response and continue for now
            setKycData({
                employeeId: data['employeeId'] || '',
                cnic: data['cnic'] || '',
                email: data['email'] || '',
                mobileNo: data['mobileNo'] || ''
            });
            if (onConfirm) onConfirm();
        } catch (_error) {
            // TEMP: Discard API errors and continue for now
            setKycData({
                employeeId: data['employeeId'] || '',
                cnic: data['cnic'] || '',
                email: data['email'] || '',
                mobileNo: data['mobileNo'] || ''
            });
            if (onConfirm) onConfirm();
        } finally {
            setIsSubmitting(false);
        }
    }, [onConfirm, setKycData]);

    return (
        <form
            onSubmit={handleFormSubmit(handleKycSubmit)}
            className="bg-gradient-to-br from-[#232a1e] to-[#232a1e]/80 rounded-2xl p-8 w-full max-w-2xl shadow-2xl border border-[#3a3f2e] mx-auto"
        >
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                        Sign-up — KYC Verification
                    </h2>
                    <p className="text-sm text-gray-300">
                        Password is not set here. OTP starts immediately after KYC verification.
                    </p>
                </div>
                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="!rounded-full px-4"
                    testId="signup-new-registration"
                >
                    New Registration
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-gray-300 mb-1">
                        Employee ID{' '}
                        <span className="text-yellow-300 text-xs align-top ml-1">required</span>
                    </label>
                    <Controller
                        name="employeeId"
                        control={control}
                        render={({ field }) => (
                            <TextInput
                                {...field}
                                placeholder="e.g., 100245"
                                error={errors['employeeId']?.message}
                                testId="signup-employee-id"
                            />
                        )}
                    />
                </div>
                <div>
                    <label className="block text-gray-300 mb-1">
                        Email Address{' '}
                        <span className="text-yellow-300 text-xs align-top ml-1">required</span>
                    </label>
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <TextInput
                                {...field}
                                placeholder="e.g., ahmad.khan@dept.gov.pk"
                                error={errors['email']?.message}
                                testId="signup-email"
                            />
                        )}
                    />
                </div>
                <div>
                    <label className="block text-gray-300 mb-1">
                        CNIC Number{' '}
                        <span className="text-yellow-300 text-xs align-top ml-1">required</span>
                    </label>
                    <Controller
                        name="cnic"
                        control={control}
                        render={({ field }) => (
                            <TextInput
                                {...field}
                                placeholder="e.g., 35202-1234567-1"
                                error={errors['cnic']?.message}
                                testId="signup-cnic"
                            />
                        )}
                    />
                </div>
                <div>
                    <label className="block text-gray-300 mb-1">
                        Mobile Number{' '}
                        <span className="text-yellow-300 text-xs align-top ml-1">required</span>
                    </label>
                    <Controller
                        name="mobileNo"
                        control={control}
                        render={({ field }) => (
                            <TextInput
                                {...field}
                                placeholder="e.g., 03001234567"
                                error={errors['mobileNo']?.message}
                                testId="signup-mobile"
                            />
                        )}
                    />
                </div>
            </div>
            <div className="flex justify-between gap-2 mb-4 mt-4">
                <div className="flex items-center">
                    <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={fillDemo}
                        testId="signup-fill-demo"
                    >
                        Fill Demo KYC Data
                    </Button>
                </div>
                <div className="flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={onCancel}
                        testId="signup-back"
                        disabled={isSubmitting}
                    >
                        Back
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        testId="signup-submit"
                        loading={isSubmitting}
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </form>
    );
};
