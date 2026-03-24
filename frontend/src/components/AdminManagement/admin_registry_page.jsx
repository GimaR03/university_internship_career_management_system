import React, { useEffect, useState } from 'react';
import AdminLayout from './admin_layout';
import AdminList from './admin_list';
import { ADMIN_ROLES, fetchAdmins, removeAdmin, updateAdmin, updateAdminRole } from './admin_utils';

const AdminRegistryPage = () => {
  const [admins, setAdmins] = useState([]);
  const [message, setMessage] = useState('');
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: ADMIN_ROLES[0],
    department: '',
    status: 'Active',
  });

  useEffect(() => {
    const loadAdmins = async () => {
      const result = await fetchAdmins();
      setAdmins(result.data);
    };

    loadAdmins();
  }, []);

  const handleRoleChange = async (adminId, role) => {
    const result = await updateAdminRole(adminId, role);
    setAdmins((current) =>
      current.map((admin) => (admin.id === adminId ? { ...admin, role: result.data.role } : admin))
    );
    setMessage(
      `Role updated using ${result.source === 'backend' ? 'backend API' : 'local demo storage'}.`
    );
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      fullName: admin.fullName,
      email: admin.email,
      role: admin.role,
      department: admin.department,
      status: admin.status,
    });
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleUpdateSubmit = async (event) => {
    event.preventDefault();
    if (!editingAdmin) {
      return;
    }

    const result = await updateAdmin(editingAdmin.id, formData);
    setAdmins((current) =>
      current.map((admin) => (admin.id === editingAdmin.id ? result.data : admin))
    );
    setEditingAdmin(null);
    setMessage(
      `Admin updated using ${result.source === 'backend' ? 'backend API' : 'local demo storage'}.`
    );
  };

  const handleDelete = async (admin) => {
    const shouldDelete = window.confirm(`Remove admin "${admin.fullName}"?`);
    if (!shouldDelete) {
      return;
    }

    const result = await removeAdmin(admin.id);
    setAdmins((current) => current.filter((item) => item.id !== admin.id));
    if (editingAdmin?.id === admin.id) {
      setEditingAdmin(null);
    }
    setMessage(
      `Admin removed using ${result.source === 'backend' ? 'backend API' : 'local demo storage'}.`
    );
  };

  return (
    <AdminLayout
      title="Admin Team Registry"
      description="Use this page to view all admins and update role assignments."
      allowedRoles={['Super Admin', 'Admin Manager']}
    >
      <div className="space-y-6">
        {message && (
          <div className="rounded-3xl border border-indigo-100 bg-indigo-50 px-6 py-4 text-sm text-indigo-700 shadow-sm">
            {message}
          </div>
        )}
        {editingAdmin && (
          <div className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Update Admin</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Edit admin details and save changes from this page.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingAdmin(null)}
                className="rounded-xl border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:border-indigo-500 hover:text-indigo-800"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Full name</span>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleFormChange}
                  required
                  className="w-full rounded-2xl border border-indigo-100 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Email address</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  className="w-full rounded-2xl border border-indigo-100 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Role</span>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
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
                <span className="mb-2 block text-sm font-medium text-slate-700">Department</span>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleFormChange}
                  className="w-full rounded-2xl border border-indigo-100 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Status</span>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="w-full rounded-2xl border border-indigo-100 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </label>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-indigo-700 to-blue-600 px-5 py-3 font-semibold text-white transition hover:from-indigo-800 hover:to-blue-700"
                >
                  Save Updates
                </button>
              </div>
            </form>
          </div>
        )}
        <AdminList
          admins={admins}
          onRoleChange={handleRoleChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminRegistryPage;
