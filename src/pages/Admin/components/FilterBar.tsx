import React from 'react';

interface FilterState {
  q: string;
  gender: string;
  ageMin: string;
  ageMax: string;
  accountStatus: string;
}

interface FilterBarProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const inputClass = "h-11 rounded-xl border border-black/10 bg-white px-4 text-xs focus:ring-2 focus:ring-primary/20 transition-all outline-none";

  return (
    <div className="px-10 py-6 border-b border-black/[0.03] bg-white grid grid-cols-2 md:grid-cols-5 gap-4">
      <input 
        name="q" 
        value={filters.q} 
        onChange={handleChange} 
        placeholder="Search RegID or Name..." 
        className={`${inputClass} col-span-2`} 
      />
      <select name="gender" value={filters.gender} onChange={handleChange} className={inputClass}>
        <option value="">All Genders</option>
        <option value="MALE">Male</option>
        <option value="FEMALE">Female</option>
      </select>
      <div className="grid grid-cols-2 gap-2">
        <input name="ageMin" value={filters.ageMin} onChange={handleChange} placeholder="Min Age" className={`${inputClass} w-full min-w-[80px]`} />
        <input name="ageMax" value={filters.ageMax} onChange={handleChange} placeholder="Max Age" className={`${inputClass} w-full min-w-[80px]`} />
      </div>
      <select name="accountStatus" value={filters.accountStatus} onChange={handleChange} className={inputClass}>
        <option value="">All Status</option>
        <option value="ACTIVE">Active</option>
        <option value="INACTIVE">Pending</option>
        <option value="SUSPENDED">Suspended</option>
      </select>
    </div>
  );
};
