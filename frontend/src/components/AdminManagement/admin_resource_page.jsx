import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from './admin_layout';
import { downloadFilteredPdfReport } from './admin_pdf_utils';
import {
  RESOURCE_CONFIGS,
  createResourceRecord,
  deleteResourceRecord,
  fetchResourceRecords,
  updateResourceRecord,
} from './admin_utils';

const AdminResourcePage = ({ resourceKey }) => {
  const config = RESOURCE_CONFIGS[resourceKey];
  const initialForm = useMemo(
    () =>
      config.fields.reduce((acc, field) => {
        acc[field.name] = field.type === 'select' ? field.options[0] : '';
        return acc;
      }, {}),
    [config.fields]
  );

  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const loadRecords = async () => {
      try {
        const data = await fetchResourceRecords(resourceKey);
        setRecords(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load records');
      }
    };

    loadRecords();
  }, [resourceKey]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      if (editingId) {
        const updated = await updateResourceRecord(resourceKey, editingId, formData);
        setRecords((current) => current.map((item) => (item._id === editingId ? updated : item)));
        setMessage(`${config.title} record updated successfully.`);
      } else {
        const created = await createResourceRecord(resourceKey, formData);
        setRecords((current) => [created, ...current]);
        setMessage(`${config.title} record created successfully.`);
      }
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed');
    }
  };

  const handleEdit = (record) => {
    const nextForm = config.fields.reduce((acc, field) => {
      acc[field.name] = record[field.name] ?? (field.type === 'select' ? field.options[0] : '');
      return acc;
    }, {});
    setFormData(nextForm);
    setEditingId(record._id);
  };

  const handleDelete = async (record) => {
    const confirmed = window.confirm(`Delete this ${config.title.toLowerCase()} record?`);
    if (!confirmed) {
      return;
    }

    try {
      await deleteResourceRecord(resourceKey, record._id);
      setRecords((current) => current.filter((item) => item._id !== record._id));
      if (editingId === record._id) {
        resetForm();
      }
      setMessage(`${config.title} record deleted successfully.`);
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const statusField = config.fields.find((field) => field.name === 'status');

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      !searchTerm ||
      config.columns.some((column) =>
        String(record[column] ?? '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );

    const matchesStatus =
      statusFilter === 'All' || String(record.status ?? '') === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDownloadReport = () => {
    downloadFilteredPdfReport({
      fileName: `${config.endpoint}-report.pdf`,
      title: `${config.title} Report`,
      subtitle: 'This report contains only the records visible after the current filter and search settings.',
      filters: {
        Search: searchTerm || 'All',
        Status: statusFilter,
      },
      columns: config.columns.map((column) => ({ key: column, label: column })),
      rows: filteredRecords,
    });
  };

  return (
    <AdminLayout
      title={config.title}
      description={config.description}
      allowedRoles={config.allowedRoles}
    >
      <div className="space-y-6">
        {message && (
          <div className="rounded-3xl border border-indigo-100 bg-indigo-50 px-6 py-4 text-sm text-indigo-700 shadow-sm">
            {message}
          </div>
        )}
        {error && (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-4 text-sm text-rose-700 shadow-sm">
            {error}
          </div>
        )}

        <div className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-xl">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {editingId ? `Update ${config.title}` : `Add ${config.title}`}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {editingId ? 'Edit the selected record and save changes.' : 'Create a new record in this table.'}
              </p>
            </div>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:border-indigo-500 hover:text-indigo-800"
              >
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
            {config.fields.map((field) => (
              <label key={field.name} className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">{field.label}</span>
                {field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full rounded-2xl border border-indigo-100 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={editingId && field.name === 'password' ? false : field.required}
                    className="w-full rounded-2xl border border-indigo-100 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                )}
              </label>
            ))}

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-indigo-700 to-blue-600 px-5 py-3 font-semibold text-white transition hover:from-indigo-800 hover:to-blue-700"
              >
                {editingId ? 'Save Changes' : `Add ${config.title}`}
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-xl overflow-x-auto">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{config.title} Table</h2>
              <p className="mt-2 text-sm text-slate-600">View all records and manage them from one place.</p>
            </div>

            <div className="flex flex-col gap-3 lg:items-end">
              <button
                type="button"
                onClick={handleDownloadReport}
                disabled={filteredRecords.length === 0}
                className="rounded-2xl bg-gradient-to-r from-violet-700 to-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:from-violet-800 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Download PDF Report
              </button>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-indigo-500">
                    Search
                  </span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder={`Search ${config.title.toLowerCase()}...`}
                    className="w-full rounded-2xl border border-indigo-100 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </label>

                {statusField && (
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-indigo-500">
                      Status
                    </span>
                    <select
                      value={statusFilter}
                      onChange={(event) => setStatusFilter(event.target.value)}
                      className="w-full rounded-2xl border border-indigo-100 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    >
                      <option value="All">All</option>
                      {statusField.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm font-medium text-slate-500">
            Showing {filteredRecords.length} of {records.length} records
          </p>

          <table className="mt-6 min-w-full divide-y divide-indigo-100">
            <thead className="bg-indigo-50/80">
              <tr className="text-left text-xs uppercase tracking-[0.2em] text-slate-500">
                {config.columns.map((column) => (
                  <th key={column} className="px-4 py-3">{column}</th>
                ))}
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((record) => (
                <tr key={record._id} className="hover:bg-indigo-50/40">
                  {config.columns.map((column) => (
                    <td key={`${record._id}-${column}`} className="px-4 py-4 text-sm text-slate-700">
                      {String(record[column] ?? '-')}
                    </td>
                  ))}
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(record)}
                        className="rounded-xl bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(record)}
                        className="rounded-xl bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRecords.length === 0 && (
                <tr>
                  <td
                    colSpan={config.columns.length + 1}
                    className="px-4 py-8 text-center text-sm text-slate-500"
                  >
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminResourcePage;
