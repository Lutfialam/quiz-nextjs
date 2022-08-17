interface TextArea {
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
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextArea: React.FC<TextArea> = ({
  name,
  label,
  value,
  onChange,
  className,
  info = '',
  error = '',
  required = true,
  disabled = false,
  autoFocus = false,
  placeholder = '',
}) => {
  return (
    <div className={className}>
      {label && (
        <label className={error.length > 0 ? 'text-red-500' : 'text-gray-600'}>
          {label + ' ' + error}
        </label>
      )}
      <div className='flex flex-col'>
        <textarea
          name={name}
          value={value}
          required={required}
          onChange={onChange}
          disabled={disabled}
          autoFocus={autoFocus}
          placeholder={placeholder}
          className={`${
            error.length > 0 ? 'border-red-500' : 'border-gray-300'
          } focus:border-indigo-300 focus:ring-indigo-200 focus:ring focus:ring-opacity-50 rounded-md shadow-sm h-56`}
        />
        {error && (
          <small className='text-red-500 text-wrap mt-2'>{error}</small>
        )}
        {info && <small className='text-gray-500 text-wrap mt-2'>{info}</small>}
      </div>
    </div>
  );
};

export default TextArea;
