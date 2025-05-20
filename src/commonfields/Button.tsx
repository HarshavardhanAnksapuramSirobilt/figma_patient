import type{ ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline";
};

export const Button = ({ children, variant = "primary", ...props }: Props) => {
  const base = "btn btn-sm w-full";
  const style = variant === "primary" ? "btn-primary" : "btn-outline";
  return (
    <button {...props} className={`${base} ${style} ${props.className || ""}`}>
      {children}
    </button>
  );
};
