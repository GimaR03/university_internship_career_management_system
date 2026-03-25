import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginStudent } from './student_utils';

const StudentLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await loginStudent(formData.email, formData.password);
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Student login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.18),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.18),_transparent_30%),linear-gradient(180deg,_#ffffff_0%,_#f8f7ff_50%,_#eef2ff_100%)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden rounded-[2.5rem] border border-indigo-100 bg-white/80 p-10 shadow-2xl backdrop-blur lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-indigo-600">
            Student Portal
          </p>
          <h1 className="mt-4 text-5xl font-black leading-tight text-slate-900">
            Student access for internship applications and progress tracking
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Use your student account to log in, review internship opportunities, and continue your application flow from one dedicated workspace.
          </p>
        </div>

        <div className="w-full rounded-[2.5rem] border border-indigo-100 bg-white p-8 shadow-2xl md:p-10">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-indigo-600">
              Student Login
            </p>
            <h2 className="mt-3 text-3xl font-black text-slate-900">Sign in to continue</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              This login is separate from the company and admin portals.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Email address</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="student@example.com"
                className="w-full rounded-2xl border border-indigo-100 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full rounded-2xl border border-indigo-100 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-indigo-700 to-violet-600 px-5 py-3 font-semibold text-white transition hover:from-indigo-800 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Login as Student'}
            </button>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
            <Link to="/" className="font-semibold text-slate-700 hover:text-indigo-700">
              Back to main site
            </Link>
            <Link to="/register/student" className="font-semibold text-indigo-600 hover:text-indigo-700">
              Register Student
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
