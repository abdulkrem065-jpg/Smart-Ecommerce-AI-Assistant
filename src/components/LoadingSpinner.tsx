import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  text?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ text, fullScreen }: LoadingSpinnerProps) {
  const containerClass = fullScreen 
    ? "fixed inset-0 bg-[#0a0f1e]/80 backdrop-blur-sm z-[200] flex flex-col items-center justify-center"
    : "flex flex-col items-center justify-center p-12";

  return (
    <div className={containerClass}>
      <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
      {text && <p className="text-slate-300 font-medium">{text}</p>}
    </div>
  );
}
