import { useState } from 'react';
import { KYCVerificationForm, OTPVerificationForm } from '../components/loginForms';
import { AuthLayout } from '../components/layout/AuthLayout';

interface LoginFormProps {
    onNavigateToLogin?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = () => {
    const [step, setStep] = useState<'kyc' | 'otp'>('kyc');
    const [kycData, setKycData] = useState({
        userName: '',
        employeeId: '',
        cnic: '',
        mobileNo: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [otpVerificationData, setOtpVerificationData] = useState({ otpCode: '' });

    const handleNavigateToLogin = () => {
        // if (onNavigateToLogin) {
        //     onNavigateToLogin();
        // } else {
        window.location.href = '/dashboard';
        // }
    };

    return (
        <AuthLayout>
            {step === 'kyc' && (
                <KYCVerificationForm
                    kycData={kycData}
                    setKycData={setKycData}
                    onCancel={handleNavigateToLogin}
                    onConfirm={() => setStep('otp')}
                />
            )}

            {step === 'otp' && (
                <OTPVerificationForm
                    otpVerificationData={otpVerificationData}
                    setOtpVerificationData={setOtpVerificationData}
                    mobileNo={kycData.mobileNo}
                    onCancel={() => setStep('kyc')}
                    onConfirm={handleNavigateToLogin}
                />
            )}
        </AuthLayout>
    );
};

export default LoginForm;
