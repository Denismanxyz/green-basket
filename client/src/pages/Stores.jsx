import ResourcePage from './ResourcePage.jsx';
import { currency } from '../utils/format.js';

const Stores = () => (
  <ResourcePage
    title="Store Management"
    subtitle="Fourteen-store supermarket network with manager, inventory, and sales"
    endpoint="/stores"
    columns={[
      { key: 'storeName', label: 'Store', sortable: true },
      { key: 'storeCode', label: 'Code', sortable: true },
      { key: 'manager', label: 'Manager' },
      { key: 'location', label: 'Location' },
      { key: 'inventory', label: 'Inventory', sortable: true },
      { key: 'sales', label: 'Sales', sortable: true, render: (row) => currency(row.sales) }
    ]}
    fields={[
      { name: 'storeName', label: 'Store Name', required: true },
      { name: 'storeCode', label: 'Store Code', required: true },
      { name: 'manager', label: 'Manager', required: true },
      { name: 'location', label: 'Location', required: true },
      { name: 'inventory', label: 'Inventory', type: 'number' },
      { name: 'sales', label: 'Sales', type: 'number' }
    ]}
  />
);

export default Stores;
