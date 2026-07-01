import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import PageHeader from '../components/PageHeader.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });

  const updateProfile = async (event) => {
    event.preventDefault();
    const res = await api.put('/auth/profile', profile);
    setUser(res.data.user);
    localStorage.setItem('gbms_user', JSON.stringify(res.data.user));
    toast.success('Profile updated');
  };

  const changePassword = async (event) => {
    event.preventDefault();
    try {
      await api.put('/auth/change-password', passwords);
      setPasswords({ currentPassword: '', newPassword: '' });
      toast.success('Password changed');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password change failed');
    }
  };

  return (
    <>
      <PageHeader title="Profile" subtitle="Update account details and password" />
      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={updateProfile} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="mb-4 text-lg font-bold">Update Profile</h2>
          <label className="mb-4 block text-sm font-semibold text-slate-700">Name<input className="form-input mt-2" value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} /></label>
          <label className="mb-4 block text-sm font-semibold text-slate-700">Phone<input className="form-input mt-2" value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} /></label>
          <button className="btn-primary">Save Profile</button>
        </form>
        <form onSubmit={changePassword} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="mb-4 text-lg font-bold">Change Password</h2>
          <label className="mb-4 block text-sm font-semibold text-slate-700">Current Password<input className="form-input mt-2" type="password" value={passwords.currentPassword} onChange={(event) => setPasswords({ ...passwords, currentPassword: event.target.value })} /></label>
          <label className="mb-4 block text-sm font-semibold text-slate-700">New Password<input className="form-input mt-2" type="password" value={passwords.newPassword} onChange={(event) => setPasswords({ ...passwords, newPassword: event.target.value })} /></label>
          <button className="btn-primary">Change Password</button>
        </form>
      </div>
    </>
  );
};

export default Profile;
