import { useState } from 'react';
import { AuthLayout } from '../components/layout/AuthLayout';
import KYCVerificationForm from '../components/dormantuserkycforms/KYCVerificationForm';
import OTPVerificationForm from '../components/dormantuserkycforms/OTPVerificationForm';
import TrustedDeviceForm from '../components/dormantuserkycforms/TrustedDeviceForm';

const DormantUserKYCForm: React.FC = () => {
    const [step, setStep] = useState<'kyc' | 'otp' | 'trusted'>('kyc');
    const [kycData, setKycData] = useState({
        userName: '',
        employeeId: '',
        cnic: '',
        mobileNo: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [otpVerificationData, setOtpVerificationData] = useState({ otpCode: '' });
    const [trustedDeviceData, setTrustedDeviceData] = useState({
        methodId: '',
        registerDevice: false,
    });

    return (
        <AuthLayout>
            {step === 'kyc' && (
                <KYCVerificationForm
                    kycData={kycData}
                    setKycData={setKycData}
                    onConfirm={() => setStep('otp')}
                />
            )}

            {step === 'otp' && (
                <OTPVerificationForm
                    otpVerificationData={otpVerificationData}
                    setOtpVerificationData={setOtpVerificationData}
                    mobileNo={kycData.mobileNo}
                    onCancel={() => setStep('kyc')}
                    onConfirm={() => setStep('trusted')}
                />
            )}

            {step === 'trusted' && (
                <TrustedDeviceForm
                    trustedDeviceData={trustedDeviceData}
                    setTrustedDeviceData={setTrustedDeviceData}
                    kycData={kycData}
                />
            )}
        </AuthLayout>
    );
};

export default DormantUserKYCForm;
