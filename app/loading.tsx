export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="h-3 w-24 animate-pulse rounded bg-surface-soft" />
      <div className="mt-4 h-10 w-64 max-w-full animate-pulse rounded bg-surface-soft" />
      <div className="mt-6 h-4 w-full max-w-md animate-pulse rounded bg-surface-soft" />
    </div>
  );
}
