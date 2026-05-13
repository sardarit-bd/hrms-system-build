import React from 'react';

export const Button = React.forwardRef(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500';

    const variantStyles = {
      primary:
        'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80',
      secondary:
        'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70 border border-border',
      outline:
        'border-2 border-primary text-primary bg-transparent hover:bg-primary/5 active:bg-primary/10',
      danger:
        'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80',
      ghost:
        'text-primary bg-transparent hover:bg-muted active:bg-muted/80',
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const buttonClassName = `${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size] || sizeStyles.md} ${className}`;

    return (
      <button
        ref={ref}
        className={buttonClassName}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
