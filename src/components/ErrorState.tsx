interface ErrorStateProps {
  title: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ title, message, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-destructive/30 bg-destructive/10 px-6 py-12 text-center"
    >
      <h2 className="text-lg font-semibold text-destructive">{title}</h2>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 min-h-10 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          Try again
        </button>
      )}
    </div>
  );
}
