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

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AdminCreateForm = ({ onCreate, saving }) => {
  const [formData, setFormData] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setFieldErrors((current) => ({
      ...current,
      [name]: '',
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.fullName.trim()) {
      nextErrors.fullName = 'Full name is required.';
    } else if (formData.fullName.trim().length < 3) {
      nextErrors.fullName = 'Full name must be at least 3 characters.';
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Email address is required.';
    } else if (!emailPattern.test(formData.email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!formData.role.trim()) {
      nextErrors.role = 'Role is required.';
    }

    if (!formData.password.trim()) {
      nextErrors.password = 'Password is required.';
    } else if (formData.password.trim().length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.';
    }

    if (!formData.status.trim()) {
      nextErrors.status = 'Status is required.';
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      window.alert('Please fix the highlighted admin form fields before submitting.');
      return;
    }

    const didCreate = await onCreate({
      ...formData,
      fullName: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password.trim(),
      department: initialForm.department,
    });

    if (!didCreate) {
      return;
    }

    setFormData(initialForm);
    setFieldErrors({});
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

      <form noValidate onSubmit={handleSubmit} className="grid gap-5 p-6 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Full name</span>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            aria-invalid={Boolean(fieldErrors.fullName)}
            className="w-full rounded-2xl border border-indigo-100 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="Enter admin name"
          />
          {fieldErrors.fullName && (
            <p className="mt-2 text-sm text-rose-600">{fieldErrors.fullName}</p>
          )}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Email address</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            aria-invalid={Boolean(fieldErrors.email)}
            className="w-full rounded-2xl border border-indigo-100 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="admin@stepin.edu"
          />
          {fieldErrors.email && (
            <p className="mt-2 text-sm text-rose-600">{fieldErrors.email}</p>
          )}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Role</span>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.role)}
            className="w-full rounded-2xl border border-indigo-100 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            {ADMIN_ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          {fieldErrors.role && (
            <p className="mt-2 text-sm text-rose-600">{fieldErrors.role}</p>
          )}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
            aria-invalid={Boolean(fieldErrors.password)}
            className="w-full rounded-2xl border border-indigo-100 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="Create a password"
          />
          {fieldErrors.password && (
            <p className="mt-2 text-sm text-rose-600">{fieldErrors.password}</p>
          )}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Department</span>
          <input
            type="text"
            name="department"
            value={formData.department}
            readOnly
            disabled
            className="w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500 outline-none"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Status</span>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.status)}
            className="w-full rounded-2xl border border-indigo-100 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          {fieldErrors.status && (
            <p className="mt-2 text-sm text-rose-600">{fieldErrors.status}</p>
          )}
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
