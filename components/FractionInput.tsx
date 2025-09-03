import React from 'react';
import type { FractionObject } from '../types';

interface FractionInputProps {
  value: FractionObject;
  onChange: (value: FractionObject) => void;
  showWhole?: boolean;
  disabled?: boolean;
}

const inputClasses = "w-24 h-20 text-5xl text-center border-4 border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-amber-400 disabled:bg-gray-100 transition-all";
const numInputClasses = `${inputClasses} rounded-b-none`;
const denInputClasses = `${inputClasses} rounded-t-none`;
const wholeInputClasses = `${inputClasses}`;

const FractionInput: React.FC<FractionInputProps> = ({ value, onChange, showWhole = true, disabled = false }) => {
  const handlePartChange = <T,>(part: keyof FractionObject, val: T) => {
    const rawValue = String(val);
    // Allow empty input to be treated as 0
    const numValue = rawValue === '' ? 0 : Math.max(0, Number(rawValue));
    onChange({ ...value, [part]: numValue });
  };
  
  // Display empty string if value is 0, otherwise display the number
  const formatValue = (num: number) => num === 0 ? '' : String(num);


  return (
    <div className="flex items-center gap-3">
      {showWhole && (
        <input
          type="number"
          min="0"
          value={formatValue(value.whole)}
          onChange={(e) => handlePartChange('whole', e.target.value)}
          placeholder="0"
          className={wholeInputClasses}
          disabled={disabled}
        />
      )}
      <div className="flex flex-col items-center">
        <input
          type="number"
          min="0"
          value={formatValue(value.num)}
          onChange={(e) => handlePartChange('num', e.target.value)}
          placeholder="?"
          className={`${numInputClasses} border-b-4 border-slate-700`}
          disabled={disabled}
        />
        <input
          type="number"
          min="1"
          value={formatValue(value.den)}
          onChange={(e) => handlePartChange('den', e.target.value)}
          placeholder="!"
          className={denInputClasses}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default FractionInput;