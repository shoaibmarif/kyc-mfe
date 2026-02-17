import { useState, useMemo } from 'react';
import { KYCVerificationPage } from './KYCVerificationPage';
import { OTPVerificationPage } from './OTPVerificationPage';
import { OTPDeliveryPreferencePage } from './OTPDeliveryPreferencePage';
import { TrustedDevicePage } from './TrustedDevicePage';
import { MFAEnrollmentPage } from './MFAEnrollmentPage';

interface SignUpFormProps {
    onNavigateToLogin?: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onNavigateToLogin }) => {
    const [step, setStep] = useState<'kyc' | 'otp' | 'mfa' | 'otpPref' | 'trusted'>('kyc');
    const [kycData, setKycData] = useState({ employeeId: '', cnic: '', email: '', mobileNo: '' });
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

    const handleNavigateToLogin = () => {
        if (onNavigateToLogin) {
            onNavigateToLogin();
        } else {
            // Default behavior - navigate to login route in kyc-mfe or custom-main-shell
            window.location.href = '/login';
        }
    };

    const stepComponents = useMemo(() => {
        switch (step) {
            case 'kyc':
                return (
                    <KYCVerificationPage
                        onCancel={handleNavigateToLogin}
                        onConfirm={() => setStep('otp')}
                        kycData={kycData}
                        setKycData={setKycData}
                    />
                );
            case 'otp':
                return (
                    <OTPVerificationPage
                        onCancel={() => setStep('kyc')}
                        onConfirm={() => setStep('mfa')}
                        otpVerificationData={otpVerificationData}
                        setOtpVerificationData={setOtpVerificationData}
                        mobileNo={kycData.mobileNo}
                    />
                );
            case 'mfa':
                return (
                    <MFAEnrollmentPage
                        onCancel={() => setStep('otp')}
                        onConfirm={() => setStep('otpPref')}
                        mfaData={mfaData}
                        setMfaData={setMfaData}
                    />
                );
            case 'otpPref':
                return (
                    <OTPDeliveryPreferencePage
                        onCancel={() => setStep('mfa')}
                        onConfirm={() => setStep('trusted')}
                        otpPreferenceData={{
                            ...otpPreferenceData,
                            destination: kycData.mobileNo,
                        }}
                        setOtpPreferenceData={setOtpPreferenceData}
                        mfaData={mfaData}
                    />
                );
            case 'trusted':
                return (
                    <TrustedDevicePage
                        onCancel={() => setStep('otpPref')}
                        onConfirm={handleNavigateToLogin}
                        trustedDeviceData={trustedDeviceData}
                        setTrustedDeviceData={setTrustedDeviceData}
                        kycData={kycData}
                        otpPreferenceData={otpPreferenceData}
                        mfaData={mfaData}
                    />
                );
            default:
                return null;
        }
    }, [
        step,
        kycData,
        otpVerificationData,
        mfaData,
        otpPreferenceData,
        trustedDeviceData,
        handleNavigateToLogin,
    ]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0f2226] to-[#2d2a1e]">
            {stepComponents}
        </div>
    );
};

export default SignUpForm;
