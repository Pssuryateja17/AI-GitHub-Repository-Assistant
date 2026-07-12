import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          to="/dashboard"
          className="text-xl font-bold text-brand-600"
        >
          AI GitHub Repository Assistant
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600">
            {user?.name}
          </span>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}