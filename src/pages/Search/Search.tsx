import { useState, useEffect, useMemo, useCallback } from 'react';
import apiClient from '../../lib/apiClient';
import { motion } from 'framer-motion';
import { Loader2, Star, Search as SearchIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import OptimizedImage from '../../components/ui/OptimizedImage';
import type { SearchResponse, SearchResultUser } from '../../types';
import type { AxiosError } from 'axios';

interface SearchFilters {
  gender: string;
  maritalStatus: string;
  q: string;
  ageMin: string;
  ageMax: string;
  trade: string;
  location: string;
}

export default function Search() {
  const [filters, setFilters] = useState<SearchFilters>({ 
    gender: '', maritalStatus: '', q: '',
    ageMin: '', ageMax: '', trade: '', location: ''
  });
  const [debouncedFilters, setDebouncedFilters] = useState<SearchFilters>(filters);
  const [cursor, setCursor] = useState<string | null>(null);

  // Debounce filter changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
      setCursor(null); // Reset pagination on filter change
    }, 400);
    return () => clearTimeout(handler);
  }, [filters]);

  const { data, isLoading: queryLoading, isError, error: queryError } = useQuery<SearchResponse>({
    queryKey: ['search', debouncedFilters, cursor],
    queryFn: async ({ signal }) => {
      const params = new URLSearchParams();
      Object.entries(debouncedFilters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      if (cursor) params.append('cursor', cursor);
      params.append('limit', '21');

      const response = await apiClient.get<SearchResponse>(`/search?${params.toString()}`, { signal });
      return response.data;
    },
    // PERFORMANCE: Cache results for 5 minutes, keep stale data for 1 minute
    staleTime: 60 * 1000, 
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Memoize results processing to prevent recalculation on every render
  const { results, hasMore } = useMemo(() => ({
    results: data?.results || [],
    hasMore: data?.pagination?.hasMore ?? false,
  }), [data]);
  
  const restriction = useMemo(() => {
    if (isError) {
      const axiosError = queryError as AxiosError<{ error?: string }>;
      if (axiosError?.response?.status === 403) {
        return { message: axiosError.response.data?.error || 'Search Restricted' };
      }
    }
    return null;
  }, [isError, queryError]);

  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleApplyFilters = useCallback(() => {
    setDebouncedFilters({ ...filters });
    setCursor(null);
  }, [filters]);

  const navigate = useNavigate();

  const navigateToProfile = useCallback((id: string) => {
    navigate(`/profile/${id}`);
  }, [navigate]);

  const nextCursor = data?.pagination?.nextCursor ?? null;

  return (
    <div className="bg-[#F7F9FB] min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-12">
        
        {/* Left Sidebar Filters */}
        <aside className="w-full lg:w-[320px] lg:flex-shrink-0">
          <div className="bg-white rounded-[32px] p-8 shadow-ambient h-fit sticky top-28 border border-black/5">
            <h2 className="text-xl font-display font-extrabold mb-8 tracking-tight">Filters</h2>
            
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/60">Identification</label>
                <input
                  type="text"
                  name="q"
                  placeholder="Rahul or VV-123..."
                  value={filters.q}
                  onChange={handleFilterChange}
                  className="w-full h-12 bg-[#F2F4F6] border-b-2 border-transparent focus:border-primary focus:bg-white rounded-xl px-4 text-sm transition-all focus:outline-none placeholder:text-foreground/20"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/60">Looking For</label>
                <select 
                  name="gender" 
                  onChange={handleFilterChange} 
                  value={filters.gender} 
                  className="w-full h-12 bg-[#F2F4F6] border-b-2 border-transparent focus:border-primary focus:bg-white rounded-xl px-4 text-sm transition-all focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="">Any Gender</option>
                  <option value="MALE">Groom (Male)</option>
                  <option value="FEMALE">Bride (Female)</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/60">Marital Status</label>
                <select 
                  name="maritalStatus" 
                  onChange={handleFilterChange} 
                  value={filters.maritalStatus} 
                  className="w-full h-12 bg-[#F2F4F6] border-b-2 border-transparent focus:border-primary focus:bg-white rounded-xl px-4 text-sm transition-all focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="">Any Status</option>
                  <option value="UNMARRIED">Unmarried</option>
                  <option value="DIVORCED">Divorced</option>
                  <option value="WIDOWED">Widowed</option>
                  <option value="SEPARATED">Separated</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/60">Age Range</label>
                <div className="flex gap-2">
                  <input type="number" name="ageMin" placeholder="Min" value={filters.ageMin} onChange={handleFilterChange} className="w-1/2 h-12 bg-[#F2F4F6] border-b-2 border-transparent focus:border-primary focus:bg-white rounded-xl px-4 text-sm transition-all focus:outline-none" />
                  <input type="number" name="ageMax" placeholder="Max" value={filters.ageMax} onChange={handleFilterChange} className="w-1/2 h-12 bg-[#F2F4F6] border-b-2 border-transparent focus:border-primary focus:bg-white rounded-xl px-4 text-sm transition-all focus:outline-none" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/60">Location (City/State)</label>
                <input type="text" name="location" placeholder="Pune, Maharashtra..." value={filters.location} onChange={handleFilterChange} className="w-full h-12 bg-[#F2F4F6] border-b-2 border-transparent focus:border-primary focus:bg-white rounded-xl px-4 text-sm transition-all focus:outline-none placeholder:text-foreground/20" />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/60">Education / Trade</label>
                <input type="text" name="trade" placeholder="e.g. B.Tech, MBA" value={filters.trade} onChange={handleFilterChange} className="w-full h-12 bg-[#F2F4F6] border-b-2 border-transparent focus:border-primary focus:bg-white rounded-xl px-4 text-sm transition-all focus:outline-none placeholder:text-foreground/20" />
              </div>

              <button 
                onClick={handleApplyFilters} 
                className="clay-button-primary w-full py-4 text-xs uppercase tracking-[0.2em]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </aside>

        {/* Right Content Area */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl md:text-5xl font-display font-black text-foreground flex items-center gap-3">
                <SearchIcon className="text-primary/20" size={32} />
                Search Profiles
              </h1>
              <p className="text-foreground/60 font-medium tracking-wide">Find your perfect match from verified profiles</p>
            </div>
            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-black/5 shadow-sm">
              {queryLoading && <Loader2 className="animate-spin text-primary" size={16} />}
              <span className="text-[10px] font-black uppercase tracking-[3px] text-primary">
                {results.length} Profiles Shown
              </span>
            </div>
          </div>

          {queryLoading && results.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="aspect-[3/4] bg-white rounded-[32px] animate-pulse border border-black/5 shadow-sm"></div>
              ))}
            </div>
          ) : restriction ? (
            <div className="min-h-[400px] flex flex-col items-center justify-center p-12 bg-white rounded-[40px] border border-primary/20 shadow-premium text-center">
              <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center text-3xl mb-6 grayscale-0 animate-pulse">🔒</div>
              <h3 className="text-2xl font-display font-black text-foreground mb-4">Search Restricted</h3>
              <p className="text-foreground/60 max-w-sm font-medium leading-relaxed mb-6">{restriction.message}</p>
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="clay-button-primary px-8 py-3 text-[10px] uppercase tracking-widest"
              >
                Go to Dashboard
              </button>
            </div>
          ) : results.length === 0 ? (
            <div className="min-h-[400px] flex flex-col items-center justify-center p-12 bg-white rounded-[40px] border border-black/5 shadow-ambient text-center">
              <div className="w-20 h-20 bg-[#F2F4F6] rounded-full flex items-center justify-center text-3xl mb-6 grayscale opacity-50">🔍</div>
              <h3 className="text-2xl font-display font-black text-foreground mb-4">No Matches Found</h3>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {results.map((user: SearchResultUser, index: number) => {
                  const isGold = user.planType === 'GOLD';
                  return (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => navigateToProfile(user.id)}
                      className={`group cursor-pointer transition-all duration-500 rounded-[32px] overflow-hidden flex flex-col shadow-ambient border border-black/5 bg-white ${isGold ? 'iridescent-border p-[2px]' : ''}`}
                    >
                      <div className="flex flex-col bg-white rounded-[30px] overflow-hidden">
                        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                          <OptimizedImage 
                            src={user.images?.[0]?.url || ''} 
                            alt={`${user.profile?.firstName} ${user.profile?.lastName}`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        
                        {/* Status Tags */}
                        <div className="absolute top-6 left-6 flex flex-col gap-2">
                          <span className="bg-white/70 backdrop-blur-md text-foreground text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest shadow-sm">
                            Verified
                          </span>
                          {isGold && (
                            <span className="bg-primary text-white text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest shadow-premium border border-white/20 flex items-center gap-1">
                              <Star size={10} fill="currentColor" /> Premium
                            </span>
                          )}
                        </div>
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-70 transition-opacity" />
                        
                        <div className="absolute inset-x-0 bottom-0 p-8">
                          <h3 className="text-white font-display font-black text-2xl truncate leading-tight">
                            {user.profile?.firstName} {user.profile?.lastName}
                          </h3>
                          <div className="mt-2 flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(184,0,53,0.6)]" />
                             <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em]">{user.regId}</p>
                          </div>
                        </div>
                      </div>

                      {/* Info Section */}
                      <div className="p-8 flex-1 flex flex-col justify-between">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-[10px] uppercase font-bold text-foreground/60 tracking-widest">Status</p>
                            <p className="text-sm font-bold text-foreground/80">{user.profile?.maritalStatus}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] uppercase font-bold text-foreground/60 tracking-widest">Height</p>
                            <p className="text-sm font-bold text-foreground/80">{user.physical?.height ? `${user.physical.height} in` : 'N/A'}</p>
                          </div>
                          <div className="col-span-2 space-y-1 mt-2">
                            <p className="text-[10px] uppercase font-bold text-foreground/60 tracking-widest">Profession</p>
                            <p className="text-sm font-bold text-foreground/80 truncate">
                              {user.education?.jobBusiness || 'Student/Professional'}
                            </p>
                          </div>
                        </div>

                        <div className="mt-8">
                          <button className="clay-button-secondary w-full py-4 text-[10px] uppercase font-black tracking-[3px]">
                            View Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  );
                })}
              </div>
              
              {/* Pagination Controls */}
              {hasMore && nextCursor && (
                <div className="mt-12 flex justify-center">
                  <button 
                    onClick={() => setCursor(nextCursor)}
                    className="clay-button-secondary px-12 py-4 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2"
                    disabled={queryLoading}
                  >
                    {queryLoading ? <Loader2 className="animate-spin" size={16} /> : null}
                    Load More Profiles
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
