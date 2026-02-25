import React from 'react';
import { getAssetPath } from '../../utils/assets';

export const BrandingSection: React.FC = () => {
    return (
        <div className="w-full lg:w-1/2 text-white space-y-6">
            <img
                src={getAssetPath('assets/images/weboc-logo.svg')}
                alt="WeBOC 2.0"
                className="hidden md:block h-10 md:h-16 mb-6"
            />
            <h2 className="hidden md:block text-6xl font-bold">
                Pakistan Customs <br />
                Web Portal
            </h2>
            <p className="hidden md:block text-xl">
                Facilitating Trade, Protecting Revenue, Securing Borders.
            </p>
        </div>
    );
};
