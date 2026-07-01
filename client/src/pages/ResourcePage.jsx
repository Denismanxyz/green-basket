import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Download, Pencil, Plus, Save, Trash2 } from 'lucide-react';
import api from '../api/axios';
import DataTable from '../components/DataTable.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import Modal from '../components/Modal.jsx';
import PageHeader from '../components/PageHeader.jsx';
import SearchBar from '../components/SearchBar.jsx';

const ResourcePage = ({ title, subtitle, endpoint, columns, fields = [], exportEndpoint }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get(endpoint, { params: { search, sort, page, limit: 10 } });
      setRows(res.data.data || res.data);
      setPages(res.data.pages || 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [search, sort, page, endpoint]);

  const submit = async (event) => {
    event.preventDefault();
    try {
      if (editingId) {
        await api.put(`${endpoint}/${editingId}`, form);
      } else {
        await api.post(endpoint, form);
      }
      toast.success(`${title} record saved`);
      setOpen(false);
      setEditingId(null);
      setForm({});
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Save failed');
    }
  };

  const handleSort = (key) => setSort((current) => (current === key ? `-${key}` : key));
  const editRow = (row) => {
    const next = {};
    fields.forEach((field) => {
      const value = row[field.name];
      next[field.name] = typeof value === 'object' && value?._id ? value._id : value ?? '';
    });
    setForm(next);
    setEditingId(row._id);
    setOpen(true);
  };
  const deleteRow = async (row) => {
    if (!window.confirm(`Delete this ${title} record?`)) return;
    await api.delete(`${endpoint}/${row._id}`);
    toast.success(`${title} record deleted`);
    load();
  };
  const exportCsv = async () => {
    const res = await api.get(exportEndpoint, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'green-basket-report.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <>
      <PageHeader
        title={title}
        subtitle={subtitle}
        action={
          <div className="flex gap-2">
            {exportEndpoint && (
              <button className="btn-secondary" type="button" onClick={exportCsv}>
                <Download size={16} /> CSV
              </button>
            )}
            {fields.length > 0 && (
              <button className="btn-primary" type="button" onClick={() => { setEditingId(null); setForm({}); setOpen(true); }}>
                <Plus size={16} /> New
              </button>
            )}
          </div>
        }
      />
      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <SearchBar value={search} onChange={(value) => { setSearch(value); setPage(1); }} />
        <div className="text-sm text-slate-500">Page {page} of {pages}</div>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <DataTable
          columns={[
            ...columns,
            ...(fields.length
              ? [{
                  key: 'actions',
                  label: 'Actions',
                  render: (row) => (
                    <div className="flex gap-2">
                      <button className="btn-secondary px-2 py-1" type="button" onClick={() => editRow(row)} aria-label="Edit">
                        <Pencil size={14} />
                      </button>
                      <button className="btn-secondary px-2 py-1 text-rose-600" type="button" onClick={() => deleteRow(row)} aria-label="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )
                }]
              : [])
          ]}
          rows={rows}
          onSort={handleSort}
        />
      )}
      <div className="mt-4 flex justify-end gap-2">
        <button className="btn-secondary" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>Previous</button>
        <button className="btn-secondary" disabled={page >= pages} onClick={() => setPage((value) => value + 1)}>Next</button>
      </div>
      <Modal title={`${editingId ? 'Edit' : 'New'} ${title} Record`} open={open} onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <label key={field.name} className="text-sm font-semibold text-slate-700">
              {field.label}
              <input
                className="form-input mt-2"
                type={field.type || 'text'}
                value={form[field.name] || ''}
                onChange={(event) => setForm((current) => ({ ...current, [field.name]: field.type === 'number' ? Number(event.target.value) : event.target.value }))}
                required={field.required}
              />
            </label>
          ))}
          <div className="sm:col-span-2">
            <button className="btn-primary" type="submit">
              <Save size={16} /> Save
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ResourcePage;
