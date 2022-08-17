import { HTMLInputTypeAttribute } from 'react';

interface Input {
  value: any;
  name: string;
  info?: string;
  label?: string;
  error?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<Input> = ({
  name,
  label,
  value,
  onChange,
  className,
  info = '',
  error = '',
  type = 'text',
  required = true,
  disabled = false,
  autoFocus = false,
  placeholder = '',
}) => {
  return (
    <div className={className}>
      {label && (
        <label className={error.length > 0 ? 'text-red-500' : 'text-gray-600'}>
          {label}
        </label>
      )}
      <div className='flex flex-col'>
        <input
          min={0}
          name={name}
          type={type}
          value={value}
          required={required}
          onChange={onChange}
          disabled={disabled}
          autoFocus={autoFocus}
          placeholder={placeholder}
          className={`${
            error.length > 0 ? 'border-red-500' : 'border-gray-300'
          } focus:border-indigo-300 focus:ring-indigo-200 focus:ring focus:ring-opacity-50 rounded-md shadow-sm`}
        />
        {error && (
          <small className='text-red-500 text-wrap mt-2'>{error}</small>
        )}
        {info && <small className='text-gray-500 text-wrap mt-2'>{info}</small>}
      </div>
    </div>
  );
};

export default Input;
