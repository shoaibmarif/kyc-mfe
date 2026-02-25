import React from 'react';

interface StepperProps {
  steps: number;
  activeStep: number;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({ steps, activeStep, className }) => {
  return (
    <div className={`flex gap-2 ${className || ''}`}>
      {Array.from({ length: steps }).map((_, idx) => (
        <div
          key={idx}
          className={`h-1.5 w-8 md:h-2 md:w-20 rounded-full border border-[#EAF0FF] ${idx < activeStep ? 'bg-[#252955]' : 'bg-[#EAF0FF]'}`}
        />
      ))}
    </div>
  );
};

export default Stepper;
