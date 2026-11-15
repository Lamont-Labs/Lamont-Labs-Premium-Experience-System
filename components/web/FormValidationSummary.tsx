import { useId } from "react";
import "./form-validation-summary.css";

export type FormValidationIssue = {
  fieldId: string;
  label: string;
  message: string;
};

/** Links submitted form errors to their inputs; validation remains caller-owned. */
export function FormValidationSummary({
  errors,
  title = "Please review these fields",
  className = "",
}: {
  errors: FormValidationIssue[];
  title?: string;
  className?: string;
}) {
  const headingId = useId();
  if (errors.length === 0) return null;

  return (
    <section
      className={["pes-validation-summary", className].filter(Boolean).join(" ")}
      role="alert"
      aria-labelledby={headingId}
    >
      <h3 className="pes-validation-summary__title" id={headingId}>{title}</h3>
      <ul className="pes-validation-summary__list">
        {errors.map((error) => (
          <li key={error.fieldId}>
            <a
              className="pes-validation-summary__link"
              href={`#${encodeURIComponent(error.fieldId)}`}
              onClick={(event) => {
                const field = document.getElementById(error.fieldId);
                if (!field) return;
                event.preventDefault();
                field.focus();
                field.scrollIntoView({ block: "nearest" });
              }}
            >
              <span className="pes-validation-summary__label">{error.label}:</span>{" "}
              {error.message}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
