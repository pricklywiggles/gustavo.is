interface CalloutProps {
  type?: "info" | "warning" | "error" | "tip";
  title?: string;
  children: React.ReactNode;
}

const styles = {
  info: "border-blue-500 bg-blue-50 dark:bg-blue-950/30",
  warning: "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30",
  error: "border-red-500 bg-red-50 dark:bg-red-950/30",
  tip: "border-green-500 bg-green-50 dark:bg-green-950/30",
};

const icons = {
  info: "ℹ️",
  warning: "⚠️",
  error: "❌",
  tip: "💡",
};

export function Callout({ type = "info", title, children }: CalloutProps) {
  return (
    <div
      className={`my-6 rounded-lg border-l-4 p-4 ${styles[type]}`}
      role="note"
    >
      {title && (
        <p className="mb-2 font-semibold">
          {icons[type]} {title}
        </p>
      )}
      <div className="text-sm">{children}</div>
    </div>
  );
}
