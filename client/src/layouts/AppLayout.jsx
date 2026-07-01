import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BarChart3, Boxes, Building2, ClipboardList, LayoutDashboard, LogOut, Package, Truck, User, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/inventory', label: 'Inventory', icon: Boxes },
  { to: '/orders', label: 'Orders', icon: ClipboardList },
  { to: '/deliveries', label: 'Deliveries', icon: Truck },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/stores', label: 'Stores', icon: Building2 },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/profile', label: 'Profile', icon: User }
];

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <aside className="border-r border-slate-200 bg-white lg:fixed lg:inset-y-0 lg:w-72">
        <div className="border-b border-slate-200 p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-brand-600">On-Premises System</p>
          <h1 className="mt-1 text-xl font-black text-slate-950">Green Basket</h1>
        </div>
        <nav className="grid grid-cols-2 gap-1 p-3 lg:block">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `mb-1 flex items-center gap-3 rounded px-3 py-2.5 text-sm font-semibold ${
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto border-t border-slate-200 p-4 lg:absolute lg:bottom-0 lg:left-0 lg:right-0">
          <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
          <p className="text-xs capitalize text-slate-500">{user?.role}</p>
          <button type="button" onClick={handleLogout} className="btn-secondary mt-3 w-full">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:ml-72 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
