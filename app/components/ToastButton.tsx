'use client';

import { useState } from 'react';
import toast, { Toast, ToastOptions } from 'react-hot-toast';

type ToastType = 'success' | 'error' | 'loading' | 'custom';

interface ToastButtonProps {
  type: ToastType;
  message: string;
  buttonText?: string;
  options?: ToastOptions;
}

export default function ToastButton({ type, message, buttonText = 'Show Toast', options = {} }: ToastButtonProps) {
  const showToast = () => {
    switch (type) {
      case 'success':
        toast.success(message, options);
        break;
      case 'error':
        toast.error(message, options);
        break;
      case 'loading':
        toast.loading(message, options);
        break;
      case 'custom':
        toast(message, options);
        break;
      default:
        toast(message, options);
    }
  };

  return (
    <button onClick={showToast}>
      {buttonText}
    </button>
  );
}