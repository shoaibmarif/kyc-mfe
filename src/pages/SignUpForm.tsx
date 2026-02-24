import { useState } from 'react';
import { AuthLayout } from '../components/layout/AuthLayout';
import KYCVerificationForm from '../components/signupforms/KYCVerificationForm';
import OTPVerificationForm from '../components/signupforms/OTPVerificationForm';
import MFAEnrollmentForm from '../components/signupforms/MFAEnrollmentForm';
import OTPDeliveryPreferenceForm from '../components/signupforms/OTPDeliveryPreferenceForm';
import TrustedDeviceForm from '../components/signupforms/TrustedDeviceForm';

interface SignUpFormProps {
    onNavigateToSignUp?: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = () => {
    const [step, setStep] = useState<'kyc' | 'otp' | 'mfa' | 'otpPref' | 'trusted'>('kyc');
    const [kycData, setKycData] = useState({
        userName: '',
        employeeId: '',
        cnic: '',
        mobileNo: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [otpVerificationData, setOtpVerificationData] = useState({ otpCode: '' });
    const [mfaData, setMfaData] = useState({
        setupKey: '',
        qrCode: '',
        authenticatorCode: '',
    });
    const [otpPreferenceData, setOtpPreferenceData] = useState({
        method: 'sms',
        destination: '',
        otpCode: '',
    });
    const [trustedDeviceData, setTrustedDeviceData] = useState({
        validityPeriod: '',
        registerDevice: false,
    });

    const handleNavigateToSignUp = () => {
        window.location.href = '/dashboard';
    };

    return (
        <AuthLayout>
            {step === 'kyc' && (
                <KYCVerificationForm
                    kycData={kycData}
                    setKycData={setKycData}
                    onCancel={handleNavigateToSignUp}
                    onConfirm={() => setStep('otp')}
                />
            )}

            {step === 'otp' && (
                <OTPVerificationForm
                    otpVerificationData={otpVerificationData}
                    setOtpVerificationData={setOtpVerificationData}
                    mobileNo={kycData.mobileNo}
                    onCancel={() => setStep('kyc')}
                    onConfirm={() => setStep('mfa')}
                />
            )}

            {step === 'mfa' && (
                <MFAEnrollmentForm
                    setupKey={mfaData.setupKey}
                    qrCode={mfaData.qrCode}
                    authenticatorCode={mfaData.authenticatorCode}
                    setMfaData={setMfaData}
                    mfaData={mfaData}
                    onSuccess={() => setStep('otpPref')}
                />
            )}

            {step === 'otpPref' && (
                <OTPDeliveryPreferenceForm
                    otpPreferenceData={otpPreferenceData}
                    setOtpPreferenceData={setOtpPreferenceData}
                    onCancel={() => setStep('mfa')}
                    mobileNo={kycData.mobileNo}
                    onConfirm={() => setStep('trusted')}
                    mfaData={mfaData}
                />
            )}

            {step === 'trusted' && (
                <TrustedDeviceForm
                    trustedDeviceData={trustedDeviceData}
                    setTrustedDeviceData={setTrustedDeviceData}
                    kycData={kycData}
                    mfaData={mfaData}
                    otpPreferenceData={otpPreferenceData}
                />
            )}
        </AuthLayout>
    );
};

export default SignUpForm;

