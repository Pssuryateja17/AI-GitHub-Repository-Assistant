interface AlertProps {
  message: string;
  variant?: "success" | "error" | "warning" | "info";
}

export function Alert({
  message,
  variant = "error",
}: AlertProps) {
  const styles = {
    success: "border border-green-300 bg-green-100 text-green-800",
    error: "border border-red-300 bg-red-100 text-red-800",
    warning: "border border-yellow-300 bg-yellow-100 text-yellow-800",
    info: "border border-blue-300 bg-blue-100 text-blue-800",
  };

  return (
    <div
      className={`w-full rounded-lg px-4 py-3 text-sm font-medium ${styles[variant]}`}
      role="alert"
    >
      {message}
    </div>
  );
}