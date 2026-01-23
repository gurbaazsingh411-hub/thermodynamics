import * as React from "react";
import { motion } from "framer-motion";

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  animationType?: "pulse" | "scale" | "bounce";
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, animationType = "pulse", className, disabled, ...props }, ref) => {
    const baseAnimation = {
      rest: { scale: 1 },
      hover: { 
        scale: animationType === "scale" ? 1.05 : 
               animationType === "bounce" ? 1.05 : 1.03,
      },
      tap: { scale: 0.98 }
    };

    if (disabled) {
      return (
        <button 
          ref={ref} 
          className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 ${className || ''}`}
          disabled
          {...props}
        >
          {children}
        </button>
      );
    }

    return (
      <motion.button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 ${className || ''}`}
        variants={baseAnimation}
        whileHover={!disabled ? "hover" : undefined}
        whileTap={!disabled ? "tap" : undefined}
        initial="rest"
        animate="rest"
        disabled={disabled}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton };