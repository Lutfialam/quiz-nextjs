export interface Button {
  title: string;
  rounded?: boolean;
  disabled?: boolean;
  className?: string;
  textColor?: string;
  background?: string;
  onClick?: () => void;
}

const Button: React.FC<Button> = ({
  title,
  background,
  textColor,
  disabled,
  onClick,
  className,
  rounded,
}) => {
  const backgroundColor = () => {
    if (background) return background;
    if (disabled) return 'bg-disabled';

    return 'bg-primary';
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${backgroundColor()} ${className} ${
        textColor ?? 'text-white'
      } ${rounded ? 'rounded-full' : 'rounded-md'} px-4 py-2 self-end`}
    >
      {title}
    </button>
  );
};

export default Button;
