import { forwardRef } from "react";

interface FormInputProps extends React.ComponentPropsWithoutRef<"input"> {
  label: string;
  error?: string;
  id: string;
  labelRight?: React.ReactNode;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, id, labelRight, className, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label
            htmlFor={id}
            className="block text-sm font-medium text-[#191919]"
          >
            {label}
          </label>
          {labelRight}
        </div>
        <input
          ref={ref}
          id={id}
          className={`w-full px-3 py-2.5 border rounded-md text-sm text-[#191919] placeholder-[#999] outline-none transition-all focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] ${
            error
              ? "border-[#b91c1c] focus:ring-[#b91c1c] focus:border-[#b91c1c]"
              : "border-[#c2c2c2] hover:border-[#888]"
          } ${className ?? ""}`}
          {...props}
        />
        {error && <p className="text-xs text-[#b91c1c] mt-1">{error}</p>}
      </div>
    );
  },
);

FormInput.displayName = "FormInput";
