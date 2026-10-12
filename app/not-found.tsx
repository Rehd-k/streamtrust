import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-start px-4 py-24 sm:px-6">
      <p className="text-sm font-medium uppercase tracking-wider text-teal-soft">
        404
      </p>
      <h1 className="font-display mt-2 text-4xl text-teal-deep">Page not found</h1>
      <p className="mt-3 text-muted">
        That page does not exist. Try the services catalogue or return home.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="rounded-md bg-teal px-4 py-2.5 text-sm font-semibold text-white"
        >
          Home
        </Link>
        <Link
          href="/services"
          className="rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-teal"
        >
          Services
        </Link>
      </div>
    </div>
  );
}
