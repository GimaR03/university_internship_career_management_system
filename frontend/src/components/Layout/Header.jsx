import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../../assets/logo.png';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
  { label: 'News', to: '/news' },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const shouldUseDark =
      savedTheme === 'dark' ||
      (!savedTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

    setIsDarkMode(shouldUseDark);
    document.documentElement.classList.toggle('dark', shouldUseDark);
  }, []);

  const setTheme = (mode) => {
    const useDark = mode === 'dark';
    setIsDarkMode(useDark);
    document.documentElement.classList.toggle('dark', useDark);
    localStorage.setItem('theme', mode);
  };

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  const renderThemeToggle = (compact = false) => (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle light and dark mode"
      className={`inline-flex items-center gap-2 rounded-lg border px-2 py-1.5 transition ${compact ? 'scale-95' : ''} ${
        isDarkMode
          ? 'border-slate-600 bg-slate-800 text-cyan-200 hover:bg-slate-700'
          : 'border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50'
      }`}
    >
      <span className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${isDarkMode ? 'bg-slate-950' : 'bg-slate-200'}`}>
        <span
          className={`absolute h-5 w-5 rounded-full shadow transition-transform ${
            isDarkMode ? 'translate-x-5 bg-cyan-200' : 'translate-x-1 bg-white'
          }`}
        />
      </span>
      <span className="text-[10px] font-bold uppercase tracking-[0.15em] sm:text-xs">
        {isDarkMode ? 'Dark Mode' : 'Light Mode'}
      </span>
    </button>
  );

  return (
    <header className={`sticky top-0 z-50 border-b backdrop-blur-md ${
      isDarkMode ? 'border-slate-700 bg-slate-900/90' : 'border-indigo-100 bg-white/90'
    }`}>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-300">
          <img 
            src={logo} 
            alt="INTERNIX Logo" 
            className="h-10 w-10 object-contain"
          />
          <div>
            <p className={`text-sm font-bold leading-tight ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>INTERNIX</p>
            <p className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-gray-500'}`}>Career Portal</p>
          </div>
        </Link>

        <div className="flex items-center gap-2 md:hidden">
          {renderThemeToggle(true)}

          <button
            type="button"
            className={`rounded-md p-2 ${isDarkMode ? 'text-slate-100 hover:bg-slate-800' : 'text-indigo-700 hover:bg-indigo-50'}`}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <nav className="hidden items-center gap-2 md:flex">
          {renderThemeToggle()}

          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-lg px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? isDarkMode
                      ? 'bg-slate-800 text-indigo-300'
                      : 'bg-indigo-100 text-indigo-700'
                    : isDarkMode
                      ? 'text-slate-200 hover:bg-slate-800 hover:text-indigo-300'
                      : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `ml-2 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                  : isDarkMode
                    ? 'border border-slate-600 text-slate-100 hover:bg-slate-800'
                    : 'border border-indigo-200 text-indigo-700 hover:bg-indigo-50'
              }`
            }
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A9 9 0 1118.88 6.197M15 11h4m0 0l-1.5-1.5M19 11l-1.5 1.5" />
            </svg>
            Login
          </NavLink>
        </nav>
      </div>

      {menuOpen && (
        <div className={`border-t px-4 py-3 md:hidden ${isDarkMode ? 'border-slate-700 bg-slate-900' : 'border-indigo-100 bg-white'}`}>
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive
                      ? isDarkMode
                        ? 'bg-slate-800 text-indigo-300'
                        : 'bg-indigo-100 text-indigo-700'
                      : isDarkMode
                        ? 'text-slate-200 hover:bg-slate-800'
                        : 'text-gray-700 hover:bg-indigo-50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            <NavLink
              to="/login"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `mt-1 inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                    : isDarkMode
                      ? 'border border-slate-600 text-slate-100 hover:bg-slate-800'
                      : 'border border-indigo-200 text-indigo-700 hover:bg-indigo-50'
                }`
              }
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A9 9 0 1118.88 6.197M15 11h4m0 0l-1.5-1.5M19 11l-1.5 1.5" />
              </svg>
              Login
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
