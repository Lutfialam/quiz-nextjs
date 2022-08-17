interface Card {
  className?: string;
  background?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const Card: React.FC<Card> = ({
  className,
  background = 'bg-indigo-400',
  onClick,
  children,
}) => {
  return (
    <div onClick={onClick} className='w-full sm:w-4/12 h-40 px-5'>
      <div
        className={`${background} ${className} hover:opacity-75 rounded-lg p-5 flex flex-col justify-between h-full w-full`}
      >
        {children}
      </div>
    </div>
  );
};

export default Card;
