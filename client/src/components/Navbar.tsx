import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/analyze', label: 'Analyze Repository' },
  { to: '/compare', label: 'Compare' },
  { to: '/history', label: 'History' },
  { to: '/saved', label: 'Saved' },
];

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout(): Promise<void> {
    await logout();
    navigate('/login');
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <div className="flex items-center gap-6">
          <span className="text-lg font-bold text-brand-600">AI GitHub Assistant</span>

          {isAuthenticated ? (
            <nav className="flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                      isActive
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          ) : null}
        </div>

        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{user?.name}</span>
            <button
              onClick={() => void handleLogout()}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Logout
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
