import { useState, useEffect, useRef } from 'react';
import apiClient from '../../lib/apiClient';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function Search() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ gender: '', maritalStatus: '', q: '' });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchMatches = async (currentFilters: typeof filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (currentFilters.gender) params.append('gender', currentFilters.gender);
      if (currentFilters.maritalStatus) params.append('maritalStatus', currentFilters.maritalStatus);
      if (currentFilters.q) params.append('q', currentFilters.q);

      const response = await apiClient.get(`/search?${params.toString()}`);
      setResults(response.data.results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
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
    <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8 w-full min-h-[80vh]">
      {/* Left Sidebar Filters */}
      <aside className="w-full md:w-1/4 bg-card border rounded-2xl p-6 h-fit md:sticky md:top-28 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Filter Matches</h2>
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground">Search Name or ID</label>
            <input
              type="text"
              name="q"
              placeholder="e.g. Rahul, VV-123"
              value={filters.q}
              onChange={handleFilterChange}
              className="w-full h-10 border rounded-md px-3 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground">Looking For</label>
            <select name="gender" onChange={handleFilterChange} value={filters.gender} className="w-full h-10 border rounded-md px-3 bg-background text-sm">
              <option value="">Any Gender</option>
              <option value="MALE">Groom (Male)</option>
              <option value="FEMALE">Bride (Female)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground">Marital Status</label>
            <select name="maritalStatus" onChange={handleFilterChange} value={filters.maritalStatus} className="w-full h-10 border rounded-md px-3 bg-background text-sm">
              <option value="">Any Status</option>
              <option value="UNMARRIED">Unmarried</option>
              <option value="DIVORCED">Divorced</option>
              <option value="WIDOWED">Widowed</option>
            </select>
          </div>

          <button onClick={() => fetchMatches(filters)} className="w-full py-2.5 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors">
            Apply Filters
          </button>
        </div>
      </aside>

      {/* Right Content Area: Matches Grid */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight">Your Matches</h1>
          <span className="text-muted-foreground font-medium">{results.length} Profiles Found</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-80 bg-muted/20 animate-pulse rounded-2xl border"></div>
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center p-8 bg-muted/10 border rounded-2xl text-center">
            <h3 className="text-xl font-bold text-muted-foreground mb-2">No matches found</h3>
            <p className="text-muted-foreground">Try broadening your search filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {results.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                onClick={() => window.location.href = `/profile/${user.id}`}
                className="bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col"
              >
                {/* Image Section */}
                <div className="w-full h-56 bg-muted relative overflow-hidden">
                  {user.images && user.images.length > 0 ? (
                    <img src={user.images[0].url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Profile" />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                      <span className="text-4xl text-primary/40 font-bold">{user.profile?.firstName?.[0] || '?'}</span>
                    </div>
                  )}
                  {/* Badges */}
                  <div className="absolute top-3 right-3 flex flex-col gap-1.5">
                    <span className="bg-white/90 backdrop-blur-sm text-green-700 text-xs px-2 py-1 rounded-full font-bold shadow-sm">
                      Verified
                    </span>
                    {user.planType === 'GOLD' && (
                      <span className="bg-amber-400/90 backdrop-blur-sm text-amber-900 text-xs px-2 py-1 rounded-full font-bold shadow-sm flex items-center gap-1">
                        <Star size={10} fill="currentColor" /> Gold
                      </span>
                    )}
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg mb-1 truncate text-foreground">{user.profile?.firstName} {user.profile?.lastName}</h3>
                  <p className="text-xs font-semibold text-primary/80 mb-3">{user.regId}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 text-[11px] font-medium bg-muted rounded-md">{user.profile?.maritalStatus}</span>
                    <span className="px-2 py-1 text-[11px] font-medium bg-muted rounded-md truncate max-w-full">
                      {user.education?.jobBusiness || 'Student/Other'}
                    </span>
                    {user.physical?.height && (
                      <span className="px-2 py-1 text-[11px] font-medium bg-muted rounded-md">{user.physical.height} cm</span>
                    )}
                  </div>

                  <button className="mt-auto w-full py-2 border border-primary/20 bg-primary/5 text-primary text-sm font-semibold rounded-lg hover:bg-primary transition-colors hover:text-white group-hover:border-primary">
                    View Full Profile
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
