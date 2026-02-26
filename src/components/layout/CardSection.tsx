interface CardSectionProps {
    children: React.ReactNode;
}

export const CardSection: React.FC<CardSectionProps> = ({ children }) => {
    return (
        <div className="w-full lg:w-[45%] flex flex-col items-center lg:items-end">
            {/* Card External Header */}
            <div className="text-center lg:text-right mb-6 w-full max-w-lg">
                <h2 className="text-4xl font-bold text-white tracking-wide uppercase">
                    WeBOC CENTRAL ACCESS
                </h2>
                <p className="text-white text-md">
                    Unified Authentication For WeBOC 2.0 (Demo)
                </p>
            </div>

            {/* Card */}
            <div className="w-full max-w-lg bg-white rounded-[2rem] shadow-2xl flex flex-col overflow-hidden">
                <div className="p-8 md:p-10 flex flex-col">
                    {/* Form Content */}
                    <div className="max-h-[540px] overflow-y-auto pr-2 custom-scrollbar">
                        <div className="space-y-5">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
