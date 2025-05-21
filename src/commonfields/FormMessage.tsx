import React from "react";

type Props = {
  children: React.ReactNode;
};

const FormMessage: React.FC<Props> = ({ children }) => {
  if (!children) return null;

  return (
    <p className="text-xs text-red-500 mt-1">
      {children}
    </p>
  );
};

export default FormMessage;