interface Select {
  name: string;
  label?: string;
  value: string;
  option: string[];
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Select: React.FC<Select> = ({
  name,
  label,
  value,
  option,
  className,
  onChange,
}) => {
  return (
    <div className={className}>
      <label className='text-gray-600'>{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className='border-gray-300 focus:border-indigo-300 focus:ring-indigo-200 focus:ring focus:ring-opacity-50 rounded-md shadow-sm w-full'
      >
        {option.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
