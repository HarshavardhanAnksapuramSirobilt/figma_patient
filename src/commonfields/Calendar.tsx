import {  forwardRef } from "react";
import type{ InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;

export const Calendar = forwardRef<HTMLInputElement, Props>((props, ref) => (
  <input
    ref={ref}
    type="date"
    {...props}
    className={`input input-bordered input-sm w-full ${props.className || ""}`}
  />
));

Calendar.displayName = "Calendar";
