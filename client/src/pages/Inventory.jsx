import { useState } from 'react';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import api from '../api/axios';
import ResourcePage from './ResourcePage.jsx';
import { date } from '../utils/format.js';

const Inventory = () => {
  const [form, setForm] = useState({ type: 'Stock In' });

  const submit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/inventory/movement', form);
      toast.success('Inventory movement recorded');
      setForm({ type: 'Stock In' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Inventory update failed');
    }
  };

  return (
    <>
      <div className="mb-6 rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <h2 className="mb-4 text-lg font-bold">Stock In / Stock Out</h2>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-5">
          <input className="form-input" placeholder="Product ID" value={form.product || ''} onChange={(event) => setForm({ ...form, product: event.target.value })} required />
          <select className="form-input" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
            <option>Stock In</option>
            <option>Stock Out</option>
          </select>
          <input className="form-input" type="number" min="1" placeholder="Quantity" value={form.quantity || ''} onChange={(event) => setForm({ ...form, quantity: Number(event.target.value) })} required />
          <input className="form-input" placeholder="Note" value={form.note || ''} onChange={(event) => setForm({ ...form, note: event.target.value })} />
          <button className="btn-primary" type="submit"><Save size={16} /> Record</button>
        </form>
      </div>
      <ResourcePage
        title="Inventory"
        subtitle="Current stock movements, low-stock alerts, and inventory history"
        endpoint="/inventory"
        columns={[
          { key: 'product', label: 'Product', render: (row) => row.product?.productName || '-' },
          { key: 'store', label: 'Store', render: (row) => row.store?.storeName || '-' },
          { key: 'type', label: 'Movement', sortable: true },
          { key: 'quantity', label: 'Qty', sortable: true },
          { key: 'previousQuantity', label: 'Previous' },
          { key: 'currentQuantity', label: 'Current' },
          { key: 'createdAt', label: 'Date', render: (row) => date(row.createdAt) }
        ]}
      />
    </>
  );
};

export default Inventory;
