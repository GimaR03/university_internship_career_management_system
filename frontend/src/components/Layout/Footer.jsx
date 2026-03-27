import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
  { label: 'News', to: '/news' },
  { label: 'Login', to: '/login' },
];

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <h3 className="mb-3 text-2xl font-bold">INTERNIX</h3>
          <p className="text-indigo-100">
            Building a stronger internship ecosystem for students and employers with one smart platform.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-lg font-semibold">Quick Links</h4>
          <div className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm transition ${
                    isActive ? 'bg-white text-indigo-700' : 'bg-white/10 hover:bg-white/20'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-lg font-semibold">Contact</h4>
          <p className="text-sm text-indigo-100">Email: internix26@gmail.com</p>
          <p className="text-sm text-indigo-100">Phone: +94 11 234 5678</p>
          <p className="text-sm text-indigo-100">Address: Colombo, Sri Lanka</p>
          <div className="mt-4">
            <p className="mb-2 text-sm font-semibold text-white">Follow Us</p>
            <div className="flex items-center gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/25"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2H21.5l-7.12 8.136L22.75 22h-6.557l-5.138-6.734L5.16 22H1.9l7.617-8.704L1.5 2h6.723l4.644 6.133L18.244 2Zm-1.15 18h1.816L7.242 3.895H5.294L17.094 20Z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/25"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5H16.7V4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.3v3H10v8h3.5Z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/25"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M6.94 8.5A2.06 2.06 0 1 1 6.94 4.4a2.06 2.06 0 0 1 0 4.1ZM5.2 9.9h3.5V20H5.2V9.9Zm5.5 0h3.3v1.4h.1c.5-.9 1.7-1.8 3.6-1.8 3.8 0 4.5 2.5 4.5 5.8V20h-3.5v-4.2c0-1 0-2.3-1.4-2.3s-1.6 1.1-1.6 2.2V20h-3.5V9.9Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/20 px-4 py-4 text-center text-sm text-indigo-100">
        © {new Date().getFullYear()} INTERNIX Internship Management System. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
