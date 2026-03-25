import React, { useState } from 'react';
import { ADMIN_ROLES } from './admin_utils';

const initialForm = {
  fullName: '',
  email: '',
  password: '',
  role: ADMIN_ROLES[0],
  department: 'Admin Management',
  status: 'Active',
};

const AdminCreateForm = ({ onCreate, saving }) => {
  const [formData, setFormData] = useState(initialForm);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onCreate(formData);
    setFormData(initialForm);
  };

  return (
    <div className="rounded-3xl border border-indigo-100 bg-white shadow-xl">
      <div className="border-b border-indigo-50 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">
          Admin Setup
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Create a new admin and assign role access
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Use this panel for your Admin Management module without building a separate frontend.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-5 p-6 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Full name</span>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full rounded-2xl border border-indigo-100 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="Enter admin name"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Email address</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded-2xl border border-indigo-100 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="admin@stepin.edu"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Role</span>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full rounded-2xl border border-indigo-100 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            {ADMIN_ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
          <input
            type="text"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full rounded-2xl border border-indigo-100 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="Create a password"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Department</span>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full rounded-2xl border border-indigo-100 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="Review Analytics"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Status</span>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-2xl border border-indigo-100 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </label>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-2xl bg-gradient-to-r from-indigo-700 to-blue-600 px-5 py-3 font-semibold text-white transition hover:from-indigo-800 hover:to-blue-700 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-400"
          >
            {saving ? 'Saving Admin...' : 'Create Admin'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCreateForm;
