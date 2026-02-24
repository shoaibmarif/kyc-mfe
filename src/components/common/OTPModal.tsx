import React from 'react';
import { Button } from 'customMain/components';

interface OTPModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageSrc: string;
    title: string;
    description: string;
    buttonText?: string;
}

export const OTPModal: React.FC<OTPModalProps> = ({
    isOpen,
    onClose,
    imageSrc,
    title,
    description,
    buttonText = 'Ok',
}) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Blurred background overlay */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-xl shadow-lg p-8 w-full max-w-sm text-center z-10">
                <img
                    src={imageSrc}
                    alt="OTPModal Visual"
                    className="mx-auto mb-6 w-24 h-24 object-contain"
                />
                <h2 className="text-2xl font-bold text-primary mb-2">{title}</h2>
                <p className="text-[#9A9A9A] text-sm mb-6">{description}</p>
                <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    onClick={onClose}
                    className="w-full"
                >
                    {buttonText}
                </Button>
            </div>
        </div>
    );
};

export default OTPModal;
