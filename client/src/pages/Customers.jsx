import ResourcePage from './ResourcePage.jsx';

const Customers = () => (
  <ResourcePage
    title="Customers"
    subtitle="Customer contact records and order history lookup"
    endpoint="/customers"
    columns={[
      { key: 'name', label: 'Customer', sortable: true },
      { key: 'phone', label: 'Phone' },
      { key: 'email', label: 'Email', sortable: true },
      { key: 'address', label: 'Address' },
      { key: 'loyaltyPoints', label: 'Points', sortable: true }
    ]}
    fields={[
      { name: 'name', label: 'Name', required: true },
      { name: 'phone', label: 'Phone', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'address', label: 'Address', required: true }
    ]}
  />
);

export default Customers;
