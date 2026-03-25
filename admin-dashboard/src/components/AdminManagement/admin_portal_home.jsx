import React from 'react';
import { Link } from 'react-router-dom';

const AdminPortalHome = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.16),_transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.18),_transparent_28%),linear-gradient(180deg,_#ffffff_0%,_#f7f7ff_48%,_#eef4ff_100%)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2.5rem] border border-indigo-100 bg-white/85 p-8 shadow-2xl backdrop-blur md:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.34em] text-indigo-600">
            StepIn Admin Portal
          </p>
          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[1] text-slate-900 md:text-6xl">
            Separate admin dashboard for system control and protected data access
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            This frontend is reserved for admin users only. Use it to sign in, manage admin accounts, and open the role-based workspaces for company, internship, and payment data.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/login"
              className="rounded-2xl bg-gradient-to-r from-indigo-700 to-blue-600 px-7 py-4 font-semibold text-white transition hover:from-indigo-800 hover:to-blue-700"
            >
              Continue to Admin Login
            </Link>
            <a
              href="http://localhost:3000/"
              className="rounded-2xl border border-indigo-200 bg-white px-7 py-4 font-semibold text-slate-700 transition hover:border-indigo-500 hover:text-indigo-700"
            >
              Back to Client App
            </a>
          </div>
        </div>

        <div className="grid gap-5">
          <div className="rounded-[2rem] border border-indigo-100 bg-white p-6 shadow-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-500">01</p>
            <h2 className="mt-3 text-2xl font-black text-slate-900">Admin-only entry</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              This page is the first screen before the login form and keeps the admin app separate from the student and company frontend.
            </p>
          </div>

          <div className="rounded-[2rem] border border-indigo-100 bg-white p-6 shadow-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-500">02</p>
            <h2 className="mt-3 text-2xl font-black text-slate-900">Protected modules</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              After login, admins are sent to the separate dashboard and can only see modules allowed by their role.
            </p>
          </div>

          <div className="rounded-[2rem] border border-indigo-100 bg-white p-6 shadow-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-500">03</p>
            <h2 className="mt-3 text-2xl font-black text-slate-900">Standalone frontend</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              This app runs independently on its own port, so your project now has a separate admin frontend and a separate client frontend.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPortalHome;
