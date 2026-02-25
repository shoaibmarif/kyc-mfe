import React from 'react';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  length?: number;
}

export const OTPInput: React.FC<OTPInputProps> = ({ value, onChange, length = 6 }) => {
  // Handler for pasting OTP
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('Text').replace(/\D/g, '').slice(0, length);
    if (pasted.length) {
      onChange(pasted.padEnd(length, ''));
      e.preventDefault();
    }
  };

  return (
    <div className="flex justify-center gap-3 px-4">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          className={`w-12 h-14 text-center text-2xl font-bold border rounded-lg focus:outline-none transition-all`}
          style={{ boxSizing: 'border-box' }}
          onPaste={handlePaste}
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
