import React from 'react';

export const Card = React.forwardRef(
  ({ className = '', variant = 'default', children, ...props }, ref) => {
    const baseStyles = 'rounded-md transition-all duration-200';

    const variantStyles = {
      default:
        'bg-card border border-border shadow-sm hover:shadow-md text-card-foreground',
      elevated:
        'bg-card shadow-lg text-card-foreground hover:shadow-xl',
      flat: 'bg-secondary text-secondary-foreground',
      outlined:
        'bg-transparent border-2 border-primary text-primary',
    };

    const cardClassName = `${baseStyles} ${variantStyles[variant] || variantStyles.default} ${className}`;

    return (
      <div ref={ref} className={cardClassName} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = React.forwardRef(
  ({ className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      className={`p-6 border-b border-border ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef(
  ({ className = '', children, ...props }, ref) => (
    <h2
      ref={ref}
      className={`text-2xl font-bold text-foreground ${className}`}
      {...props}
    >
      {children}
    </h2>
  )
);

CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef(
  ({ className = '', children, ...props }, ref) => (
    <p
      ref={ref}
      className={`text-sm text-muted-foreground mt-1 ${className}`}
      {...props}
    >
      {children}
    </p>
  )
);

CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef(
  ({ className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      className={`px-6 py-4 border-t border-border flex gap-3 justify-end ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';
