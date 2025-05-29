import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";

type Props = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, Props>((props, ref) => (
  <div className="relative w-full">
    <select
      ref={ref}
      {...props}
      className={`w-full appearance-none bg-white px-3 py-2 pr-10 text-sm rounded-md border border-gray-300 focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-all duration-150 ${props.className || ""}`}
    />
    {/* Dropdown arrow */}
    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
      <svg
        className="w-4 h-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  </div>
));

Select.displayName = "Select";
