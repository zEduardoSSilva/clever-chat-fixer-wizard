import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ModernToastProps {
  title: string;
  description?: string;
  variant?: "success" | "error" | "info";
  duration?: number;
  onClose?: () => void;
  show: boolean;
}

export function ModernToast({
  title,
  description,
  variant = "success",
  duration = 3000,
  onClose,
  show
}: ModernToastProps) {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
    
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300); // Wait for animation to complete
  };

  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none">
      <div
        className={cn(
          "pointer-events-auto bg-card/95 backdrop-blur-sm border border-border/50 rounded-2xl shadow-2xl p-4 min-w-[320px] max-w-md",
          "transition-all duration-300 ease-out",
          isVisible 
            ? "transform translate-x-0 opacity-100 scale-100" 
            : "transform translate-x-full opacity-0 scale-95"
        )}
      >
        <div className="flex items-start gap-3">
          {/* Success Icon */}
          <div
            className={cn(
              "flex-shrink-0 rounded-full p-1.5",
              variant === "success" && "bg-green-500/20",
              variant === "error" && "bg-red-500/20",
              variant === "info" && "bg-blue-500/20"
            )}
          >
            {variant === "success" && (
              <Check className="h-4 w-4 text-green-500" />
            )}
            {variant === "error" && (
              <X className="h-4 w-4 text-red-500" />
            )}
            {variant === "info" && (
              <Check className="h-4 w-4 text-blue-500" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-foreground">
              {title}
            </h4>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>

          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-6 w-6 p-0 hover:bg-muted/50 flex-shrink-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}