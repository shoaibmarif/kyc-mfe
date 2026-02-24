import React from 'react';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  length?: number;
}

export const OTPInput: React.FC<OTPInputProps> = ({ value, onChange, error, length = 6 }) => {
  return (
    <div className="flex justify-center gap-3 px-4">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          className={`w-12 h-14 text-center text-2xl font-bold border rounded-lg focus:outline-none transition-all
            ${error ? 'border-red-500' : 'border-[#D9D9D9] focus:border-[#252955]'}
          `}
          style={{ boxSizing: 'border-box' }}
          onChange={e => {
            const val = e.target.value;
            if (/^\d*$/.test(val)) {
              const currentValue = value || '';
              const newValue =
                currentValue.substring(0, index) +
                val +
                currentValue.substring(index + 1);
              onChange(newValue.substring(0, length));
              if (val && index < length - 1) {
                const nextInput = e.target.nextElementSibling as HTMLInputElement;
                nextInput?.focus();
              }
            }
          }}
          onKeyDown={e => {
            if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
              const prevInput = e.currentTarget.previousElementSibling as HTMLInputElement;
              prevInput?.focus();
            }
          }}
          value={value?.[index] || ''}
        />
      ))}
    </div>
  );
};

export default OTPInput;
