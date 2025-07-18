import { useState, useCallback } from "react";
import { ModernToast } from "@/components/ui/modern-toast";

interface ToastData {
  id: string;
  title: string;
  description?: string;
  variant?: "success" | "error" | "info";
  duration?: number;
}

export function useModernToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback(({ title, description, variant = "success", duration = 3000 }: Omit<ToastData, "id">) => {
    const id = Date.now().toString();
    const newToast: ToastData = { id, title, description, variant, duration };
    
    setToasts(prev => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const ToastContainer = useCallback(() => (
    <>
      {toasts.map(toast => (
        <ModernToast
          key={toast.id}
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          duration={toast.duration}
          show={true}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  ), [toasts, removeToast]);

  return {
    showToast,
    ToastContainer
  };
}