import { forwardRef } from "react";
import type{ SelectHTMLAttributes } from "react";

type Props = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, Props>((props, ref) => (
  <select
    ref={ref}
    {...props}
    className={`select select-bordered select-sm w-full ${props.className || ""}`}
  />
));

Select.displayName = "Select";
