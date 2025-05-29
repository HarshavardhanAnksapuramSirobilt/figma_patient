import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline";
};

export const Button = ({ children, variant = "primary", className = "", ...props }: Props) => {
  const base = "btn btn-sm";
  const style = variant === "primary" ? "btn-primary" : "btn-outline";
  return (
    <button {...props} className={`${base} ${style} ${className}`}>
      {children}
    </button>
  );
};
