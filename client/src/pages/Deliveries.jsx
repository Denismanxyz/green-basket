import ResourcePage from './ResourcePage.jsx';
import { date, statusClass } from '../utils/format.js';

const Deliveries = () => (
  <ResourcePage
    title="Deliveries"
    subtitle="Delivery assignment, estimated date, and completion status"
    endpoint="/deliveries"
    columns={[
      { key: 'order', label: 'Order', render: (row) => row.order?.orderNumber || row.order || '-' },
      { key: 'deliveryPerson', label: 'Delivery Person', sortable: true },
      { key: 'deliveryAddress', label: 'Address' },
      { key: 'status', label: 'Status', render: (row) => <span className={`status-pill ${statusClass(row.status)}`}>{row.status}</span> },
      { key: 'estimatedDeliveryDate', label: 'Estimated', render: (row) => date(row.estimatedDeliveryDate) },
      { key: 'completedAt', label: 'Completed', render: (row) => date(row.completedAt) }
    ]}
    fields={[
      { name: 'order', label: 'Order ID', required: true },
      { name: 'deliveryPerson', label: 'Delivery Person', required: true },
      { name: 'deliveryAddress', label: 'Delivery Address', required: true },
      { name: 'status', label: 'Status' },
      { name: 'estimatedDeliveryDate', label: 'Estimated Delivery Date', type: 'date', required: true }
    ]}
  />
);

export default Deliveries;
