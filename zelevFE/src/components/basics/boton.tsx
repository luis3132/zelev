import React from 'react';

type ButtonVariant = 'accept' | 'info' | 'cancel' | 'outline';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: ButtonVariant;
  disabled?: boolean;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  accept: 'bg-green-500 text-white hover:bg-green-600',
  info: 'bg-amber-500 text-white hover:bg-amber-600',
  cancel: 'bg-red-600 text-white hover:bg-red-700',
  outline: 'border border-gray-300 bg-transparent hover:bg-gray-50'
};

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'accept',
  disabled = false,
  className = ''
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md duration-300 transition-colors ${variantStyles[variant]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;