import React from "react";

type Props = {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
};

export const FormField = ({ label, required, error, children }: Props) => (
  <div className="form-control w-full">
    <label className="label">
      <span className="label-text text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
    </label>
    {children}
    {error && <span className="text-xs text-red-500 pt-1">{error}</span>}
  </div>
);
