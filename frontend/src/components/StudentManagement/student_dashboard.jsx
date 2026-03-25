import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getStudentSession, isStudentLoggedIn, logoutStudent } from './student_utils';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    if (!isStudentLoggedIn()) {
      navigate('/login/student');
      return;
    }

    const session = getStudentSession();
    setStudent(session?.student || null);
  }, [navigate]);

  const handleLogout = () => {
    logoutStudent();
    navigate('/login/student');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.16),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.14),_transparent_28%),linear-gradient(180deg,_#ffffff_0%,_#f8f7ff_55%,_#eef2ff_100%)]">
      <header className="border-b border-indigo-100 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-indigo-600">
              StepIn Student Portal
            </p>
            <h1 className="mt-2 text-4xl font-black text-slate-900">Student Dashboard</h1>
            <p className="mt-3 text-slate-600">
              {student
                ? `Logged in as ${student.firstName || ''} ${student.lastName || ''}`.trim()
                : 'Your student workspace is ready.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/"
              className="rounded-2xl border border-indigo-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:border-indigo-500 hover:text-indigo-700"
            >
              Back to Home
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-2xl bg-gradient-to-r from-indigo-700 to-violet-600 px-5 py-3 font-semibold text-white transition hover:from-indigo-800 hover:to-violet-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-500">Profile</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900">Student account</h2>
            <p className="mt-3 text-sm text-slate-600">
              Name: {student ? `${student.firstName} ${student.lastName}` : '-'}
            </p>
            <p className="mt-2 text-sm text-slate-600">Email: {student?.email || '-'}</p>
          </div>

          <div className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-500">Applications</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900">Internship flow</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              This separate student dashboard is ready for internship browsing, applications, and status tracking.
            </p>
          </div>

          <div className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-500">Next Step</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900">Extend this portal</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Connect this page to internship listings and application history when you are ready.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;
