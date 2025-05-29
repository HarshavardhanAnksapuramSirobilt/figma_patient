import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, Props>((props, ref) => (
  <input
    ref={ref}
    {...props}
    className={`w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-all duration-150 ${props.className || ""}`}
  />
));

Input.displayName = "Input";
