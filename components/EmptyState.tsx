import { SearchX } from "lucide-react";

export default function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-earth-border bg-earth-surface px-6 py-16 text-center">
      <SearchX
        className="mx-auto h-10 w-10 text-earth-muted"
        aria-hidden="true"
      />
      <h3 className="mt-4 text-lg font-semibold text-sawnee-700">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-earth-muted">{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
