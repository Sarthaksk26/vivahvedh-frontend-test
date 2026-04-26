import { useState, useEffect, useRef } from 'react';
import apiClient from '../../lib/apiClient';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { resolveImageUrl } from '../../lib/url';

export default function Search() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ 
    gender: '', maritalStatus: '', q: '',
    ageMin: '', ageMax: '', height: '', trade: '', occupation: '', location: '', diet: ''
  });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [restriction, setRestriction] = useState<{ code: string; message: string } | null>(null);

  const fetchMatches = async (currentFilters: typeof filters) => {
    setLoading(true);
    setRestriction(null);
    try {
      const params = new URLSearchParams();
      if (currentFilters.gender) params.append('gender', currentFilters.gender);
      if (currentFilters.maritalStatus) params.append('maritalStatus', currentFilters.maritalStatus);
      if (currentFilters.q) params.append('q', currentFilters.q);
      if (currentFilters.ageMin) params.append('ageMin', currentFilters.ageMin);
      if (currentFilters.ageMax) params.append('ageMax', currentFilters.ageMax);
      if (currentFilters.height) params.append('height', currentFilters.height);
      if (currentFilters.trade) params.append('trade', currentFilters.trade);
      if (currentFilters.occupation) params.append('occupation', currentFilters.occupation);
      if (currentFilters.location) params.append('location', currentFilters.location);
      if (currentFilters.diet) params.append('diet', currentFilters.diet);

      const response = await apiClient.get(`/search?${params.toString()}`);
      setResults(response.data.results);
    } catch (error: any) {
      if (error.response?.status === 403) {
        setRestriction({ 
          code: error.response.data.code, 
          message: error.response.data.error 
        });
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchMatches(filters);
    }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [filters]);

  const handleFilterChange = (e: any) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-[#F7F9FB] min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-12">
        
        {/* Left Sidebar Filters */}
        <aside className="w-full lg:w-1/3 xl:w-1/4">
          <div className="bg-white rounded-[32px] p-8 shadow-ambient h-fit sticky top-28 border border-black/5">
            <h2 className="text-xl font-display font-extrabold mb-8 tracking-tight">Refine Discovery</h2>
            
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Identification</label>
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
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Looking For</label>
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
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Marital Status</label>
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
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Age Range</label>
                <div className="flex gap-2">
                  <input type="number" name="ageMin" placeholder="Min" value={filters.ageMin} onChange={handleFilterChange} className="w-1/2 h-12 bg-[#F2F4F6] border-b-2 border-transparent focus:border-primary focus:bg-white rounded-xl px-4 text-sm transition-all focus:outline-none" />
                  <input type="number" name="ageMax" placeholder="Max" value={filters.ageMax} onChange={handleFilterChange} className="w-1/2 h-12 bg-[#F2F4F6] border-b-2 border-transparent focus:border-primary focus:bg-white rounded-xl px-4 text-sm transition-all focus:outline-none" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Height</label>
                <input type="text" name="height" placeholder="e.g. 5'8&quot; or 170cm" value={filters.height} onChange={handleFilterChange} className="w-full h-12 bg-[#F2F4F6] border-b-2 border-transparent focus:border-primary focus:bg-white rounded-xl px-4 text-sm transition-all focus:outline-none placeholder:text-foreground/20" />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Location (City/State)</label>
                <input type="text" name="location" placeholder="Pune, Maharashtra..." value={filters.location} onChange={handleFilterChange} className="w-full h-12 bg-[#F2F4F6] border-b-2 border-transparent focus:border-primary focus:bg-white rounded-xl px-4 text-sm transition-all focus:outline-none placeholder:text-foreground/20" />
              </div>
              
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Education / Trade</label>
                <input type="text" name="trade" placeholder="e.g. B.Tech, MBA" value={filters.trade} onChange={handleFilterChange} className="w-full h-12 bg-[#F2F4F6] border-b-2 border-transparent focus:border-primary focus:bg-white rounded-xl px-4 text-sm transition-all focus:outline-none placeholder:text-foreground/20" />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Occupation</label>
                <input type="text" name="occupation" placeholder="Software Engineer..." value={filters.occupation} onChange={handleFilterChange} className="w-full h-12 bg-[#F2F4F6] border-b-2 border-transparent focus:border-primary focus:bg-white rounded-xl px-4 text-sm transition-all focus:outline-none placeholder:text-foreground/20" />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Diet</label>
                <select name="diet" onChange={handleFilterChange} value={filters.diet} className="w-full h-12 bg-[#F2F4F6] border-b-2 border-transparent focus:border-primary focus:bg-white rounded-xl px-4 text-sm transition-all focus:outline-none appearance-none cursor-pointer">
                  <option value="">Any Diet</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Jain">Jain</option>
                </select>
              </div>

              <button 
                onClick={() => fetchMatches(filters)} 
                className="clay-button-primary w-full py-4 text-xs uppercase tracking-[0.2em]"
              >
                Apply Curation
              </button>
            </div>
          </div>
        </aside>

        {/* Right Content Area */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 gap-4">
            <div>
              <h1 className="display-md text-foreground">Discovery Engine</h1>
              <p className="text-foreground/40 mt-2 font-medium tracking-wide">Find your perfect soulmate in our verified community</p>
            </div>
            <span className="text-xs font-black uppercase tracking-[3px] text-primary/40 bg-white px-4 py-2 rounded-full border border-black/5">
              {results.length} Profiles
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-[450px] bg-white rounded-[32px] animate-pulse border border-black/5 shadow-sm"></div>
              ))}
            </div>
          ) : restriction ? (
            <div className="min-h-[400px] flex flex-col items-center justify-center p-12 bg-white rounded-[40px] border border-primary/20 shadow-premium text-center">
              <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center text-3xl mb-6 grayscale-0 animate-pulse">🔒</div>
              <h3 className="text-2xl font-display font-black text-foreground mb-4">Discovery Locked</h3>
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
              <p className="text-foreground/40 max-w-sm font-medium leading-relaxed">We couldn't find any profiles matching your specific filters. Try expanding your search criteria.</p>
            </div>
          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {results.map((user, index) => {
                const isGold = user.planType === 'GOLD';
                return (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => window.location.href = `/profile/${user.id}`}
                    className={`group cursor-pointer transition-all duration-500 rounded-[32px] overflow-hidden flex flex-col shadow-ambient border border-black/5 bg-white ${isGold ? 'iridescent-border p-[2px]' : ''}`}
                  >
                    <div className="flex flex-col h-full bg-white rounded-[30px] overflow-hidden">
                      {/* Image Section */}
                      <div className="w-full h-72 relative bg-[#eceef0] overflow-hidden">
                        {user.images && user.images.length > 0 ? (
                          <img src={resolveImageUrl(user.images[0].url)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Profile" />
                        ) : (
                          <div className="w-full h-full bg-primary/5 flex items-center justify-center">
                            <span className="text-6xl font-display font-black text-primary/10">{user.profile?.firstName?.[0] || '?'}</span>
                          </div>
                        )}
                        
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
                            <p className="text-[10px] uppercase font-bold text-foreground/40 tracking-widest">Status</p>
                            <p className="text-sm font-bold text-foreground/80">{user.profile?.maritalStatus}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] uppercase font-bold text-foreground/40 tracking-widest">Height</p>
                            <p className="text-sm font-bold text-foreground/80">{user.physical?.height ? `${user.physical.height} cm` : 'N/A'}</p>
                          </div>
                          <div className="col-span-2 space-y-1 mt-2">
                            <p className="text-[10px] uppercase font-bold text-foreground/40 tracking-widest">Profession</p>
                            <p className="text-sm font-bold text-foreground/80 truncate">
                              {user.education?.jobBusiness || 'Student/Professional'}
                            </p>
                          </div>
                        </div>

                        <div className="mt-8">
                          <button className="clay-button-secondary w-full py-4 text-[10px] uppercase font-black tracking-[3px]">
                            Curate Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
