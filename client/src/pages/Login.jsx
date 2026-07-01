import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LockKeyhole, ShoppingBasket } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const [email, setEmail] = useState('admin@greenbasket.local');
  const [password, setPassword] = useState('Admin@12345');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    try {
      await login(email, password);
      toast.success('Welcome back');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <main className="grid min-h-screen bg-slate-100 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="hidden bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center lg:block">
        <div className="flex h-full items-end bg-slate-950/45 p-12 text-white">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-emerald-200">Existing Local Business System</p>
            <h1 className="mt-3 max-w-xl text-5xl font-black">Green Basket Management System</h1>
            <p className="mt-4 max-w-lg text-lg text-slate-100">Supermarket operations, inventory, delivery, store sales, and reports for an on-premises environment.</p>
          </div>
        </div>
      </section>
      <section className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-soft">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-lg bg-brand-50 p-3 text-brand-700">
              <ShoppingBasket size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-950">Staff Login</h2>
              <p className="text-sm text-slate-500">Admin and store manager access</p>
            </div>
          </div>
          <label className="mb-4 block text-sm font-semibold text-slate-700">
            Email
            <input className="form-input mt-2" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label className="mb-6 block text-sm font-semibold text-slate-700">
            Password
            <input className="form-input mt-2" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            <LockKeyhole size={17} /> Login
          </button>
          <div className="mt-5 rounded bg-slate-50 p-3 text-xs text-slate-500">
            Manager demo: manager1@greenbasket.local / Manager@12345
          </div>
        </form>
      </section>
    </main>
  );
};

export default Login;
