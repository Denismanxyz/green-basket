import ResourcePage from './ResourcePage.jsx';
import { currency, date, statusClass } from '../utils/format.js';
import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { Save } from 'lucide-react';

const Orders = () => {
  const [form, setForm] = useState({ orderStatus: 'Pending', quantity: 1 });

  const submit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/orders', {
        customer: form.customer,
        store: form.store || undefined,
        orderStatus: form.orderStatus,
        products: [{ product: form.product, quantity: Number(form.quantity) }]
      });
      toast.success('Order created');
      setForm({ orderStatus: 'Pending', quantity: 1 });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Order creation failed');
    }
  };

  return (
    <>
      <div className="mb-6 rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <h2 className="mb-4 text-lg font-bold">Create Order</h2>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-6">
          <input className="form-input" placeholder="Customer ID" value={form.customer || ''} onChange={(event) => setForm({ ...form, customer: event.target.value })} required />
          <input className="form-input" placeholder="Product ID" value={form.product || ''} onChange={(event) => setForm({ ...form, product: event.target.value })} required />
          <input className="form-input" type="number" min="1" placeholder="Quantity" value={form.quantity || ''} onChange={(event) => setForm({ ...form, quantity: event.target.value })} required />
          <input className="form-input" placeholder="Store ID" value={form.store || ''} onChange={(event) => setForm({ ...form, store: event.target.value })} />
          <select className="form-input" value={form.orderStatus} onChange={(event) => setForm({ ...form, orderStatus: event.target.value })}>
            <option>Pending</option>
            <option>Packed</option>
            <option>Dispatched</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
          <button className="btn-primary" type="submit"><Save size={16} /> Create</button>
        </form>
      </div>
      <ResourcePage
        title="Orders"
        subtitle="Order creation, status tracking, and order details"
        endpoint="/orders"
        columns={[
          { key: 'orderNumber', label: 'Order', sortable: true },
          { key: 'customerName', label: 'Customer', sortable: true },
          { key: 'products', label: 'Items', render: (row) => row.products?.length || 0 },
          { key: 'amount', label: 'Amount', sortable: true, render: (row) => currency(row.amount) },
          { key: 'orderStatus', label: 'Status', render: (row) => <span className={`status-pill ${statusClass(row.orderStatus)}`}>{row.orderStatus}</span> },
          { key: 'createdAt', label: 'Date', render: (row) => date(row.createdAt) }
        ]}
      />
    </>
  );
};

export default Orders;
