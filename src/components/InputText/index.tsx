import clsx from "clsx";
import { useId } from "react";

type InputTextProps = {
  labelText?: string;
  helperText?: string;
  error?: string;
} & React.ComponentProps<"input">;

export function InputText({
  labelText = "",
  helperText,
  error,
  className,
  ...props
}: InputTextProps) {
  const id = useId();

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {labelText && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-700 tracking-tight"
        >
          {labelText}
        </label>
      )}

      <input
        {...props}
        id={id}
        className={clsx(
          "w-full px-3 py-2 rounded-md text-sm transition-all",
          "border border-gray-300 bg-white shadow-sm",
          "focus:border-blue-500 focus:ring-4 focus:ring-blue-100",
          "placeholder:text-gray-400",
          "disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200",
          "read-only:bg-gray-100 read-only:text-gray-500",
          error && "border-red-500 focus:border-red-500 focus:ring-red-100",
          className
        )}
      />

      {error && <p className="text-xs text-red-600">{error}</p>}

      {!error && helperText && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
}
