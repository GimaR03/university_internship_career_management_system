import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getAdminNavigation,
  getAdminSession,
  isAdminLoggedIn,
  isRoleAllowed,
  logoutAdmin,
} from './admin_utils';

const AdminLayout = ({ title, description, children, allowedRoles }) => {
  const navigate = useNavigate();
  const [sessionAdmin, setSessionAdmin] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate('/login');
      return;
    }

    const session = getAdminSession();
    setSessionAdmin(session?.admin || null);

    const savedTheme = localStorage.getItem('theme');
    const shouldUseDark = savedTheme === 'dark';
    setIsDarkMode(shouldUseDark);
    document.documentElement.classList.toggle('dark', shouldUseDark);

    if (allowedRoles && session?.admin?.role && !isRoleAllowed(session.admin.role, allowedRoles)) {
      navigate('/dashboard');
    }
  }, [allowedRoles, navigate]);

  const handleLogout = () => {
    logoutAdmin();
    navigate('/login');
  };

  const setTheme = (mode) => {
    const useDark = mode === 'dark';
    setIsDarkMode(useDark);
    document.documentElement.classList.toggle('dark', useDark);
    localStorage.setItem('theme', mode);
  };

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  return (
    <div className={`min-h-screen ${
      isDarkMode
        ? 'bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.14),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(37,99,235,0.22),_transparent_30%),linear-gradient(180deg,_#0b1f43_0%,_#0d2957_48%,_#0f2f62_100%)]'
        : 'bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.18),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.16),_transparent_30%),linear-gradient(180deg,_#ffffff_0%,_#f7f7ff_48%,_#eff4ff_100%)]'
    }`}>
      <header className={`border-b backdrop-blur ${isDarkMode ? 'border-sky-800/50 bg-[#112d5b]/85' : 'border-indigo-100 bg-white/85'}`}>
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className={`text-sm font-semibold uppercase tracking-[0.28em] ${isDarkMode ? 'text-cyan-300' : 'text-indigo-600'}`}>
              StepIn Admin Management
            </p>
            <h1 className={`mt-2 text-4xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h1>
            <p className={`mt-3 max-w-3xl ${isDarkMode ? 'text-slate-200' : 'text-slate-600'}`}>{description}</p>
            {sessionAdmin && (
              <p className={`mt-4 text-sm font-semibold ${isDarkMode ? 'text-cyan-100' : 'text-indigo-950'}`}>
                Logged in as {sessionAdmin.fullName} ({sessionAdmin.role})
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={toggleTheme}
              className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-semibold transition ${
                isDarkMode
                  ? 'border-sky-700 bg-[#0f294f] text-cyan-200 hover:bg-[#123564]'
                  : 'border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50'
              }`}
            >
              <span className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${isDarkMode ? 'bg-sky-950' : 'bg-slate-200'}`}>
                <span className={`absolute h-5 w-5 rounded-full shadow transition-transform ${isDarkMode ? 'translate-x-5 bg-cyan-200' : 'translate-x-1 bg-white'}`} />
              </span>
              <span className="text-xs uppercase tracking-[0.12em]">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
            {sessionAdmin && getAdminNavigation(sessionAdmin.role).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`rounded-2xl border px-5 py-3 font-semibold transition ${
                  isDarkMode
                    ? 'border-sky-700 bg-[#123564] text-slate-100 hover:border-cyan-400 hover:text-cyan-200'
                    : 'border-indigo-200 bg-white text-slate-700 hover:border-indigo-500 hover:text-indigo-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className={`rounded-2xl px-5 py-3 font-semibold text-white transition ${
                isDarkMode
                  ? 'bg-gradient-to-r from-sky-700 to-blue-700 hover:from-sky-800 hover:to-blue-800'
                  : 'bg-gradient-to-r from-indigo-700 to-blue-600 hover:from-indigo-800 hover:to-blue-700'
              }`}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
};

export default AdminLayout;
