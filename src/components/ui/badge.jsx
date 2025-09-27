import React from 'react';

const Badge = React.forwardRef(({ className = '', variant = 'default', children, ...props }, ref) => {
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    default: 'bg-gray-700 text-gray-100 hover:bg-gray-600',
    secondary: 'bg-gray-600 text-gray-100 hover:bg-gray-500',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border border-gray-600 text-gray-300 hover:bg-gray-800',
    success: 'bg-green-600 text-white hover:bg-green-700',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700',
  };
  
  const variantClasses = variants[variant] || variants.default;
  
  return (
    <div
      ref={ref}
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

Badge.displayName = 'Badge';

export { Badge };