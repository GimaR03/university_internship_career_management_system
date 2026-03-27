import React, { useState } from 'react';
import AdminCreateForm from './admin_create_form';
import AdminLayout from './admin_layout';
import { buildAdminInvitationLink, createAdmin } from './admin_utils';

const AdminCreatePage = () => {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [createdAdmin, setCreatedAdmin] = useState(null);
  const [emailSent, setEmailSent] = useState(false);

  const handleCreateAdmin = async (formData) => {
    try {
      setSaving(true);
      setError('');
      setMessage('');

      const result = await createAdmin(formData);
      setCreatedAdmin(result.data);
      setEmailSent(false);
      setMessage(
        `Admin created successfully using ${result.source === 'backend' ? 'backend API' : 'local demo storage'}.`
      );
      window.alert('Admin created successfully.');
      return true;
    } catch (err) {
      setCreatedAdmin(null);
      setEmailSent(false);
      const errorMessage = err.response?.data?.message || 'Failed to create admin';
      setError(errorMessage);
      window.alert(errorMessage);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Create Admin"
      description="Use this page to create a new admin and assign role access."
      allowedRoles={['Super Admin', 'Admin Manager']}
    >
      <div className="mx-auto max-w-3xl space-y-6">
        <AdminCreateForm onCreate={handleCreateAdmin} saving={saving} />

        {message && (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-6 py-4 text-sm text-emerald-700 shadow-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-4 text-sm text-rose-700 shadow-sm">
            {error}
          </div>
        )}

        {createdAdmin && !emailSent && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900">Admin email details</h2>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p>
                <span className="font-semibold text-slate-900">Email:</span> {createdAdmin.email}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Position:</span> {createdAdmin.role}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Password:</span> {createdAdmin.password}
              </p>
            </div>
            <a
              href={buildAdminInvitationLink(createdAdmin)}
              onClick={() => setEmailSent(true)}
              className="mt-5 inline-flex rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              Send details by email
            </a>
            <p className="mt-3 text-xs text-slate-500">
              This opens your email app with the role and password filled in. Automatic email sending
              needs a backend mail service.
            </p>
          </div>
        )}

        {createdAdmin && emailSent && (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-6 py-4 text-sm text-emerald-700 shadow-sm">
            Email details were opened once for {createdAdmin.email}. This panel is now hidden.
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCreatePage;
