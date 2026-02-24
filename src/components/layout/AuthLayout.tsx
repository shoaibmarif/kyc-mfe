import React from 'react';
import { getAssetPath } from '../../utils/assets';
import { BrandingSection } from './BrandingSection';
import { CardSection } from './CardSection';

interface AuthLayoutProps {
    children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen relative font-sans">
            {/* Background Image Overlay */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url(${getAssetPath('assets/images/backgroung-login.png')})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />

            {/* Main Content Container */}
            <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex flex-row gap-12 lg:gap-2 items-center justify-between">
                        {/* Left Side: Branding */}
                        <BrandingSection />

                        {/* Right Side: KYC Card Section */}
                        <CardSection>{children}</CardSection>
                    </div>
                </div>
            </div>
        </div>
    );
};