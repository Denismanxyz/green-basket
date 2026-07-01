import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import Products from './pages/Products.jsx';
import Inventory from './pages/Inventory.jsx';
import Orders from './pages/Orders.jsx';
import Deliveries from './pages/Deliveries.jsx';
import Customers from './pages/Customers.jsx';
import Stores from './pages/Stores.jsx';
import Reports from './pages/Reports.jsx';
import Profile from './pages/Profile.jsx';

const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'products', element: <Products /> },
      { path: 'inventory', element: <Inventory /> },
      { path: 'orders', element: <Orders /> },
      { path: 'deliveries', element: <Deliveries /> },
      { path: 'customers', element: <Customers /> },
      { path: 'stores', element: <Stores /> },
      { path: 'reports', element: <Reports /> },
      { path: 'profile', element: <Profile /> }
    ]
  },
  { path: '*', element: <Navigate to="/" replace /> }
]);

export default router;
