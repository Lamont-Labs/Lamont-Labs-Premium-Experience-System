import { useId, type InputHTMLAttributes } from "react";
import "./form-field.css";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  id?: string;
  label: string;
  hint?: string;
  error?: string;
  className?: string;
};

/** Labeled input with linked hint/error text and caller-owned validation. */
export function FormField({
  id,
  label,
  hint,
  error,
  required = false,
  className = "",
  ...inputProps
}: Props) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [inputProps["aria-describedby"], hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={["pes-form-field", className].filter(Boolean).join(" ")} data-invalid={Boolean(error) || undefined}>
      <label className="pes-form-field__label" htmlFor={inputId}>
        <span>{label}</span>
        {required && <span className="pes-form-field__required">Required</span>}
      </label>
      <input
        {...inputProps}
        id={inputId}
        className="pes-form-field__input"
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
      />
      {hint && <p className="pes-form-field__hint" id={hintId}>{hint}</p>}
      {error && <p className="pes-form-field__error" id={errorId} role="alert">{error}</p>}
    </div>
  );
}
