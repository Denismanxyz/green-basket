import { useEffect, useState } from 'react';
import api from '../api/axios';
import ResourcePage from './ResourcePage.jsx';
import StatCard from '../components/StatCard.jsx';
import { currency } from '../utils/format.js';
import { BarChart3, ClipboardList, Package } from 'lucide-react';

const Reports = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get('/reports/summary').then((res) => setSummary(res.data));
  }, []);

  return (
    <>
      {summary && (
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <StatCard title="Sales Report" value={currency(summary.sales.total)} icon={BarChart3} />
          <StatCard title="Total Orders" value={summary.sales.orders} icon={ClipboardList} tone="blue" />
          <StatCard title="Top Products" value={summary.topProducts.length} icon={Package} tone="amber" />
        </div>
      )}
      <ResourcePage
        title="Reports"
        subtitle="Sales, inventory, daily, monthly, and top-selling product reports"
        endpoint="/reports"
        exportEndpoint="/reports/export-csv"
        columns={[
          { key: 'title', label: 'Report', sortable: true },
          { key: 'type', label: 'Type', sortable: true },
          { key: 'totalSales', label: 'Sales', render: (row) => currency(row.totalSales) },
          { key: 'totalOrders', label: 'Orders' }
        ]}
        fields={[
          { name: 'title', label: 'Title', required: true },
          { name: 'type', label: 'Type', required: true },
          { name: 'totalSales', label: 'Total Sales', type: 'number' },
          { name: 'totalOrders', label: 'Total Orders', type: 'number' }
        ]}
      />
    </>
  );
};

export default Reports;
