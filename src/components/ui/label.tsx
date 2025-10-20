import * as React from "react";

type Props = React.LabelHTMLAttributes<HTMLLabelElement> & {
  className?: string;
};

export function Label({ children, className = "", ...props }: Props) {
  return (
    <label
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}
