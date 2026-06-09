"use client";

import {
  forwardRef,
  useState,
  type InputHTMLAttributes,
} from "react";
import { twMerge } from "tailwind-merge";

type PasswordInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  containerClassName?: string;
  showLabel?: string;
  hideLabel?: string;
};

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    {
      className,
      containerClassName,
      showLabel = "Show password",
      hideLabel = "Hide password",
      disabled,
      ...props
    },
    ref,
  ) {
    const [isVisible, setIsVisible] = useState(false);

    return (
      <div className={twMerge("relative", containerClassName)}>
        <input
          {...props}
          ref={ref}
          type={isVisible ? "text" : "password"}
          disabled={disabled}
          className={twMerge(className, "pe-12")}
        />

        <button
          type="button"
          onClick={() => setIsVisible((current) => !current)}
          disabled={disabled}
          className="absolute inset-y-0 right-0 inline-flex w-12 items-center justify-center text-slate-500 transition hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={isVisible ? hideLabel : showLabel}
          aria-pressed={isVisible}
        >
          {isVisible ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
              className="size-5"
            >
              <path
                d="M3 3l18 18"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.58 10.58a2 2 0 0 0 2.84 2.84"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.88 4.24A9.5 9.5 0 0 1 12 4c6 0 9.75 8 9.75 8a18.18 18.18 0 0 1-2.85 4.13"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.61 6.61C3.86 8.48 2.25 12 2.25 12s3.75 8 9.75 8a9.63 9.63 0 0 0 4.36-1.06"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
              className="size-5"
            >
              <path
                d="M2.25 12s3.75-8 9.75-8 9.75 8 9.75 8-3.75 8-9.75 8-9.75-8-9.75-8Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>
    );
  },
);
