"use client";

export function ConfirmButton({
  message,
  className,
  formAction,
  children,
}: {
  message: string;
  className?: string;
  formAction?: (formData: FormData) => void | Promise<void>;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      formAction={formAction}
      className={className}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
