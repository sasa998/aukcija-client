"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps extends Omit<
  React.ComponentPropsWithoutRef<"input">,
  "type"
> {
  label: string;
  error?: string;
  id: string;
  labelRight?: React.ReactNode;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, id, labelRight, ...props }, ref) => {
    const [show, setShow] = useState(false);

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
        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={show ? "text" : "password"}
            className={`w-full px-3 py-2.5 pr-10 border rounded-md text-sm text-[#191919] placeholder-[#999] outline-none transition-all focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] ${
              error
                ? "border-[#b91c1c] focus:ring-[#b91c1c] focus:border-[#b91c1c]"
                : "border-[#c2c2c2] hover:border-[#888]"
            }`}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-[#191919] transition-colors"
            aria-label={show ? "Sakrij lozinku" : "Prikaži lozinku"}
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {error && <p className="text-xs text-[#b91c1c] mt-1">{error}</p>}
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";
