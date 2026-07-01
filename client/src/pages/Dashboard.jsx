import { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { AlertTriangle, Boxes, CircleDollarSign, Package, ShoppingCart, Truck } from 'lucide-react';
import api from '../api/axios';
import DataTable from '../components/DataTable.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import PageHeader from '../components/PageHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import { currency, date, statusClass } from '../utils/format.js';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/dashboard').then((res) => setData(res.data));
  }, []);

  if (!data) return <LoadingSpinner />;

  const salesChart = {
    labels: data.charts.storeLabels,
    datasets: [{ label: 'Sales', data: data.charts.sales, backgroundColor: '#26845a' }]
  };
  const inventoryChart = {
    labels: data.charts.storeLabels.slice(0, 8),
    datasets: [{ data: data.charts.inventory.slice(0, 8), backgroundColor: ['#26845a', '#2563eb', '#f59e0b', '#dc2626', '#7c3aed', '#0891b2', '#65a30d', '#475569'] }]
  };

  return (
    <>
      <PageHeader title="Operations Dashboard" subtitle="Local supermarket management overview before cloud migration" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard title="Total Products" value={data.totalProducts} icon={Package} />
        <StatCard title="Inventory Count" value={data.inventoryCount} icon={Boxes} tone="blue" />
        <StatCard title="Today's Orders" value={data.todaysOrders} icon={ShoppingCart} />
        <StatCard title="Revenue" value={currency(data.revenue)} icon={CircleDollarSign} tone="blue" />
        <StatCard title="Low Stock" value={data.lowStockProducts.length} icon={AlertTriangle} tone="amber" />
        <StatCard title="Pending Deliveries" value={data.pendingDeliveries} icon={Truck} tone="rose" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="mb-4 text-lg font-bold">Store Sales</h2>
          <Bar data={salesChart} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="mb-4 text-lg font-bold">Inventory Distribution</h2>
          <Doughnut data={inventoryChart} />
        </div>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <DataTable
          columns={[
            { key: 'orderNumber', label: 'Order' },
            { key: 'customerName', label: 'Customer' },
            { key: 'amount', label: 'Amount', render: (row) => currency(row.amount) },
            { key: 'orderStatus', label: 'Status', render: (row) => <span className={`status-pill ${statusClass(row.orderStatus)}`}>{row.orderStatus}</span> },
            { key: 'createdAt', label: 'Date', render: (row) => date(row.createdAt) }
          ]}
          rows={data.recentOrders}
        />
        <DataTable
          columns={[
            { key: 'productName', label: 'Low Stock Product' },
            { key: 'sku', label: 'SKU' },
            { key: 'quantity', label: 'Qty' },
            { key: 'store', label: 'Store', render: (row) => row.store?.storeName || '-' }
          ]}
          rows={data.lowStockProducts}
        />
      </div>
    </>
  );
};

export default Dashboard;
