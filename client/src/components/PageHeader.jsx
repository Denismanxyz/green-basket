const PageHeader = ({ title, subtitle, action }) => (
  <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
    <div>
      <h1 className="text-2xl font-bold text-slate-950">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export default PageHeader;
