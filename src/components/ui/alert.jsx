import React from 'react';

const Alert = React.forwardRef(({ className = '', variant = 'default', children, ...props }, ref) => {
  const baseClasses = 'relative w-full rounded-lg border p-4';
  
  const variants = {
    default: 'bg-gray-800 border-gray-700 text-gray-100',
    destructive: 'bg-red-900/20 border-red-800 text-red-100',
    warning: 'bg-yellow-900/20 border-yellow-800 text-yellow-100',
    success: 'bg-green-900/20 border-green-800 text-green-100',
  };
  
  const variantClasses = variants[variant] || variants.default;
  
  return (
    <div
      ref={ref}
      role="alert"
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

Alert.displayName = 'Alert';

const AlertDescription = React.forwardRef(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`text-sm [&_p]:leading-relaxed ${className}`}
    {...props}
  />
));

AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertDescription };