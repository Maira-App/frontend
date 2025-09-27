/**
 * Loading Spinner Component
 * Provides consistent loading indicators across the app
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ 
  size = 'default', 
  className = '', 
  text = '',
  fullScreen = false 
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-500`} />
      {text && (
        <p className="mt-2 text-sm text-gray-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}

export function LoadingPage({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <LoadingSpinner size="xl" text={message} />
    </div>
  );
}

export function LoadingOverlay({ isVisible, message = 'Loading...' }) {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-40">
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <LoadingSpinner size="lg" text={message} />
      </div>
    </div>
  );
}

export default LoadingSpinner;