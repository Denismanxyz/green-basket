export const currency = (value = 0) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

export const date = (value) => (value ? new Date(value).toLocaleDateString('en-GB') : '-');

export const statusClass = (status = '') => {
  if (['Delivered', 'Completed', 'Active'].includes(status)) return 'bg-emerald-50 text-emerald-700';
  if (['Pending', 'Packed', 'Out for Delivery', 'Low Stock'].includes(status)) return 'bg-amber-50 text-amber-700';
  if (['Cancelled', 'Failed', 'Inactive'].includes(status)) return 'bg-rose-50 text-rose-700';
  return 'bg-slate-100 text-slate-700';
};
