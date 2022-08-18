export interface AlertType {
  message: string;
  className?: string;
  status?: 'success' | 'failed' | 'info';
}

const Alert: React.FC<AlertType> = ({
  message,
  className,
  status = 'success',
}) => {
  const alertColor = () => {
    if (status === 'failed') return 'bg-red-400';
    if (status === 'info') return 'bg-indigo-400';

    return 'bg-green-400';
  };

  return (
    <div
      className={`${className} ${
        message && message.length > 0 ? 'flex' : 'hidden'
      } w-full mb-4`}
    >
      <div className={`w-full p-5 shadow-lg rounded-lg ${alertColor()}`}>
        <h1 className='text-white'>{message}</h1>
      </div>
    </div>
  );
};

export default Alert;
