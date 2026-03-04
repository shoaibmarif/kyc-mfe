import React from 'react';
import Stepper from '../common/Stepper';
import { getAssetPath } from '../../utils/assets';

interface MFAEnrollmentFormProps {
    onSuccess?: () => void;
}

const MFAEnrollmentForm: React.FC<MFAEnrollmentFormProps> = ({ onSuccess }) => {
    const handleMfaSubmit = () => {
        if (onSuccess) onSuccess();
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleMfaSubmit();
            }}
            className="w-full"
        >
            {/* Header */}
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-primary">
                    Multi-Factor Authentication Setup
                </h3>
                <p className="text-[#9A9A9A] text-sm">
                    Secure your account with third-party authenticator
                </p>
            </div>

            {/* Stepper */}
            <div className="flex justify-center mb-6">
                <Stepper steps={5} activeStep={3} />
            </div>

            {/* QR Code Section */}
            <div className="text-center py-8">
                <div className="inline-flex items-center justify-center">
                    <img
                        src={getAssetPath(`assets/images/qrCodeImage.png`)}
                        alt="QR Code"
                        className="w-40 h-40 object-contain cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={handleMfaSubmit}
                    />
                </div>

                <h4 className="text-lg font-semibold text-primary mt-6">Scan QR Code</h4>
                <p className="text-[#9A9A9A] text-sm">
                    Scan this QR code with your authenticator app (Google Authenticator, Microsoft
                    Authenticator, etc.)
                </p>
            </div>
        </form>
    );
};

export default MFAEnrollmentForm;
