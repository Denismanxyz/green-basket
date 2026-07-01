import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = 'Search records' }) => (
  <div className="relative w-full sm:max-w-xs">
    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
    <input className="form-input pl-10" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
  </div>
);

export default SearchBar;
