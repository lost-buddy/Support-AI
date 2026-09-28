// src/components/common/SearchBar.jsx
import { Search } from 'lucide-react';

export const SearchBar = ({ value, onChange, placeholder = "Search tickets..." }) => (
  <div className="search-box">
    <Search size={14} />
    <input
      type="text"
      aria-label={placeholder}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);
