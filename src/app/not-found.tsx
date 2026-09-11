import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="glass-panel p-12 text-center max-w-md mx-auto my-12">
      <h2 className="text-2xl font-bold text-rose-400 mb-2">404 • Resource Not Found</h2>
      <p className="text-sm text-slate-300 mb-6">
        The requested profile or page route does not exist or has been removed.
      </p>
      <Link href="/" className="btn btn-primary text-xs">
        Return to Overview Matrix
      </Link>
    </div>
  );
}
