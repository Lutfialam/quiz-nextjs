interface InputRadio {
  label: string;
  value: string;
  isActive: boolean;
  onClick?: () => void;
}

const InputRadio: React.FC<InputRadio> = ({
  label,
  value,
  isActive,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center rounded-md p-2 ${
        isActive && 'bg-indigo-500'
      }`}
    >
      <input
        type='radio'
        value={value}
        checked={isActive ? true : false}
        onChange={() => {}}
        className='w-4 h-4 checked:border-indigo-500 checked:ring-2 checked:ring-white'
      />

      <label
        className={`block ml-2 text-sm font-medium ${
          isActive ? 'text-white' : 'text-gray-600'
        }`}
      >
        {label}
      </label>
    </div>
  );
};

export default InputRadio;
