import ResourcePage from './ResourcePage.jsx';
import { currency, statusClass } from '../utils/format.js';

const Products = () => (
  <ResourcePage
    title="Products"
    subtitle="CRUD product master with search, pagination, and sorting"
    endpoint="/products"
    columns={[
      { key: 'productName', label: 'Product', sortable: true },
      { key: 'category', label: 'Category', sortable: true },
      { key: 'sku', label: 'SKU', sortable: true },
      { key: 'price', label: 'Price', sortable: true, render: (row) => currency(row.price) },
      { key: 'quantity', label: 'Qty', sortable: true },
      { key: 'supplier', label: 'Supplier' },
      { key: 'store', label: 'Store', render: (row) => row.store?.storeName || row.store || '-' },
      { key: 'status', label: 'Status', render: (row) => <span className={`status-pill ${statusClass(row.status)}`}>{row.status}</span> }
    ]}
    fields={[
      { name: 'productName', label: 'Product Name', required: true },
      { name: 'category', label: 'Category', required: true },
      { name: 'sku', label: 'SKU', required: true },
      { name: 'price', label: 'Price', type: 'number', required: true },
      { name: 'quantity', label: 'Quantity', type: 'number', required: true },
      { name: 'supplier', label: 'Supplier', required: true },
      { name: 'store', label: 'Store ID', required: true },
      { name: 'status', label: 'Status' }
    ]}
  />
);

export default Products;
