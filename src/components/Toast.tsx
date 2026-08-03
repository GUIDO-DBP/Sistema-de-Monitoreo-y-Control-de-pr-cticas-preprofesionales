import { useEffect } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onDismiss: () => void;
}

export function Toast({ message, type = 'info', onDismiss }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500);
    return () => clearTimeout(t);
  }, [message]);

  const config = {
    success: { bg: '#172033', icon: <CheckCircle size={15} style={{ color: '#0F9F92' }} /> },
    error: { bg: '#C43D4D', icon: <AlertCircle size={15} style={{ color: '#FFFFFF' }} /> },
    info: { bg: '#172033', icon: <AlertCircle size={15} style={{ color: '#2563EB' }} /> },
  }[type];

  if (!message) return null;

  return (
    <div
      className="fixed top-4 right-4 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-in"
      style={{ backgroundColor: config.bg, color: '#FFFFFF', maxWidth: 380 }}
    >
      {config.icon}
      {message}
    </div>
  );
}
