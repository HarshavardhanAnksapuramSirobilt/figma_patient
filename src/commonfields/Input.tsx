import {forwardRef } from "react";
import type{ InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, Props>((props, ref) => (
  <input
    ref={ref}
    {...props}
    className={`input input-bordered input-sm w-full ${props.className || ""}`}
  />
));

Input.displayName = "Input";
