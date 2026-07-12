import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 text-center">
      <h1 className="text-4xl font-bold text-slate-900">404</h1>
      <p className="text-sm text-slate-500">The page you are looking for does not exist.</p>
      <Link to="/" className="font-semibold text-brand-600 hover:underline">
        Go back home
      </Link>
    </div>
  );
}