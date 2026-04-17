import { useState, useEffect } from 'react';
import apiClient from '../../lib/apiClient';
import { resolveImageUrl } from '../../lib/url';
import { Mail, Shield, CreditCard, Users, Trash2, Check, X as CloseIcon, MoreVertical, UserPlus, Heart } from 'lucide-react';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'pending' | 'all' | 'enquiries' | 'payments' | 'addProfile' | 'stories'>('pending');
  const [users, setUsers] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Offline user creation state
  const [offlineForm, setOfflineForm] = useState({
    firstName: '', lastName: '', mobile: '', email: '',
    gender: '', maritalStatus: '', profileCreatedBy: 'Marriage Bureau'
  });
  const [offlineSubmitting, setOfflineSubmitting] = useState(false);
  const [offlineSuccess, setOfflineSuccess] = useState<{ regId: string; name: string; email: string } | null>(null);
  const [offlineError, setOfflineError] = useState('');

  const fetchData = async () => {
    if (activeTab === 'addProfile') return;
    setLoading(true);
    try {
      if (activeTab === 'enquiries') {
        const response = await apiClient.get('/admin/enquiries');
        setEnquiries(response.data);
      } else if (activeTab === 'payments') {
        const response = await apiClient.get('/payments/admin/pending');
        setPayments(response.data);
      } else if (activeTab === 'stories') {
        const response = await apiClient.get('/stories/admin/all');
        setStories(response.data);
      } else {
        const endpoint = activeTab === 'pending' ? '/admin/pending' : '/admin/all-users';
        const response = await apiClient.get(endpoint);
        setUsers(response.data);
      }
    } catch (error: any) {
      if (error.response?.status === 403) alert("ACCESS DENIED");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handlePaymentVerify = async (paymentId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await apiClient.patch(`/payments/admin/verify/${paymentId}`, { status });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAction = async (action: 'approve' | 'ban' | 'unban' | 'delete', userId: string) => {
    if (action === 'delete' && !confirm("Permanently delete user?")) return;
    try {
      if (action === 'approve') await apiClient.post('/admin/approve', { targetUserId: userId });
      if (action === 'ban') await apiClient.post('/admin/ban', { targetUserId: userId, action: 'ban' });
      if (action === 'unban') await apiClient.post('/admin/ban', { targetUserId: userId, action: 'unban' });
      if (action === 'delete') await apiClient.delete(`/admin/delete/${userId}`);
      alert(`Action "${action}" completed successfully.`);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.error || `Failed to ${action} user.`);
    }
  };

  const handleSetPlan = async (userId: string, planType: string) => {
    const durationMonths = planType === 'SILVER' ? 6 : planType === 'GOLD' ? 12 : 0;
    try {
      await apiClient.post('/admin/set-plan', { targetUserId: userId, planType, durationMonths });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleOfflineFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setOfflineForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOfflineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOfflineSubmitting(true);
    setOfflineError('');
    setOfflineSuccess(null);
    try {
      const response = await apiClient.post('/admin/users/create', offlineForm);
      setOfflineSuccess({
        regId: response.data.regId,
        name: response.data.userName,
        email: offlineForm.email
      });
      // Reset form
      setOfflineForm({ firstName: '', lastName: '', mobile: '', email: '', gender: '', maritalStatus: '', profileCreatedBy: 'Marriage Bureau' });
    } catch (error: any) {
      const msg = error.response?.data?.error;
      setOfflineError(typeof msg === 'string' ? msg : 'Failed to create user. Please check all fields.');
    } finally {
      setOfflineSubmitting(false);
    }
  };

  const inputClass = "w-full h-12 rounded-xl border border-black/10 bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all";

  return (
    <div className="bg-[#F7F9FB] min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 pt-8">
          <div className="max-w-xl">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-3 block">Command Center</span>
            <h1 className="display-md text-foreground">Royal Curation Dash.</h1>
            <p className="text-foreground/40 mt-4 font-medium leading-relaxed">Oversee the platform's integrity, manage premium members, and respond to community enquiries.</p>
          </div>
          <div className="px-6 py-3 bg-white shadow-ambient rounded-2xl flex items-center gap-3 border border-black/5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-foreground/40 font-display">Systems Active</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Navigation Sidebar */}
          <aside className="w-full lg:w-72">
            <div className="bg-white rounded-[32px] p-6 shadow-ambient sticky top-28 border border-black/5">
              <nav className="space-y-2">
                {[
                  { id: 'pending', label: 'Approvals', icon: <Users size={18} />, badge: users.length },
                  { id: 'all', label: 'Community', icon: <Shield size={18} /> },
                  { id: 'payments', label: 'Revenue', icon: <CreditCard size={18} />, badge: payments.length },
                  { id: 'enquiries', label: 'Inbox', icon: <Mail size={18} /> },
                  { id: 'addProfile', label: 'Add Profile', icon: <UserPlus size={18} /> },
                  { id: 'stories', label: 'Stories', icon: <Heart size={18} /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-display font-black text-xs uppercase tracking-widest
                      ${activeTab === tab.id 
                        ? 'bg-primary text-white shadow-premium' 
                        : 'text-foreground/30 hover:bg-[#F2F4F6] hover:text-foreground'}`}
                  >
                    {tab.icon}
                    <span className="flex-1 text-left">{tab.label}</span>
                    {tab.badge !== undefined && tab.badge > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? 'bg-white/20' : 'bg-primary text-white'}`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Activity Pane */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-[40px] shadow-ambient overflow-hidden border border-black/5">
              <div className="px-10 py-8 bg-[#F7F9FB]/50 border-b border-black/5 flex justify-between items-center">
                <h2 className="text-xl font-display font-black text-foreground">
                  {activeTab === 'pending' ? 'Curation Queue' : activeTab === 'all' ? 'All Citizens' : activeTab === 'payments' ? 'Verification Desk' : activeTab === 'addProfile' ? 'Onboard Offline Customer' : activeTab === 'stories' ? 'Stories Manager' : 'Communication Log'}
                </h2>
              </div>

              <div className="min-h-[500px]">

                {/* ===== ADD PROFILE TAB ===== */}
                {activeTab === 'addProfile' ? (
                  <div className="p-10 max-w-2xl mx-auto">
                    {offlineSuccess && (
                      <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-2xl">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                            <Check size={20} />
                          </div>
                          <div>
                            <h3 className="font-black text-green-800 text-lg">Profile Created Successfully!</h3>
                            <p className="text-green-700 text-sm font-medium">RegID: <strong>{offlineSuccess.regId}</strong></p>
                          </div>
                        </div>
                        <p className="text-green-700 text-sm leading-relaxed">
                          Login credentials have been sent to <strong>{offlineSuccess.email}</strong>. 
                          The user ({offlineSuccess.name}) must change their password on first login.
                        </p>
                      </div>
                    )}

                    {offlineError && (
                      <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-medium">
                        ❌ {offlineError}
                      </div>
                    )}

                    <form onSubmit={handleOfflineSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-foreground/70">First Name *</label>
                          <input name="firstName" value={offlineForm.firstName} onChange={handleOfflineFormChange} required className={inputClass} placeholder="पहिले नाव" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-foreground/70">Last Name *</label>
                          <input name="lastName" value={offlineForm.lastName} onChange={handleOfflineFormChange} required className={inputClass} placeholder="आडनाव" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-foreground/70">Mobile Number *</label>
                          <input name="mobile" type="tel" value={offlineForm.mobile} onChange={handleOfflineFormChange} required className={inputClass} placeholder="e.g. 9876543210" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-foreground/70">Email *</label>
                          <input name="email" type="email" value={offlineForm.email} onChange={handleOfflineFormChange} required className={inputClass} placeholder="email@example.com" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-foreground/70">Gender *</label>
                          <select name="gender" value={offlineForm.gender} onChange={handleOfflineFormChange} required className={inputClass}>
                            <option value="">लिंग निवडा — Select</option>
                            <option value="MALE">पुरुष — Male</option>
                            <option value="FEMALE">स्त्री — Female</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-foreground/70">Marital Status *</label>
                          <select name="maritalStatus" value={offlineForm.maritalStatus} onChange={handleOfflineFormChange} required className={inputClass}>
                            <option value="">वैवाहिक स्थिती — Select</option>
                            <option value="UNMARRIED">अविवाहित — Unmarried</option>
                            <option value="DIVORCED">घटस्फोटित — Divorced</option>
                            <option value="WIDOWED">विधवा/विधुर — Widowed</option>
                            <option value="SEPARATED">विभक्त — Separated</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground/70">Profile Created By</label>
                        <select name="profileCreatedBy" value={offlineForm.profileCreatedBy} onChange={handleOfflineFormChange} className={inputClass}>
                          <option value="Marriage Bureau">विवाह संस्था — Marriage Bureau</option>
                          <option value="Self">स्वतः — Self</option>
                          <option value="Father">वडील — Father</option>
                          <option value="Mother">आई — Mother</option>
                          <option value="Sibling">भाऊ/बहीण — Sibling</option>
                          <option value="Relative">नातेवाईक — Relative</option>
                          <option value="Friend">मित्र — Friend</option>
                        </select>
                      </div>

                      <div className="pt-4 border-t border-black/5">
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6">
                          <p className="text-amber-800 text-sm font-medium">
                            ⚡ A secure temporary password will be auto-generated and emailed to the customer. 
                            They will be required to change it on first login.
                          </p>
                        </div>

                        <button
                          type="submit"
                          disabled={offlineSubmitting}
                          className="w-full bg-primary text-white h-14 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-xl transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-widest"
                        >
                          {offlineSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Creating Profile...
                            </>
                          ) : (
                            <>
                              <UserPlus size={18} />
                              Create & Send Credentials
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                ) : loading ? (
                  <div className="p-20 flex flex-col items-center justify-center grayscale opacity-20">
                     <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin mb-6" />
                     <p className="font-display font-black uppercase text-xs tracking-widest text-foreground">Syncing Repository</p>
                  </div>
                ) : activeTab === 'payments' ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-[#F2F4F6] text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">
                        <tr>
                          <th className="px-10 py-5">Initiator</th>
                          <th className="px-8 py-5">Membership</th>
                          <th className="px-8 py-5">Investment</th>
                          <th className="px-8 py-5">Evidence</th>
                          <th className="px-10 py-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.length === 0 ? (
                          <tr><td colSpan={5} className="p-20 text-center text-foreground/20 font-medium">All ledgers are balanced.</td></tr>
                        ) : (
                          payments.map((pay: any) => (
                            <tr key={pay.id} className="border-b border-black/[0.03] hover:bg-[#F7F9FB] transition-colors group">
                              <td className="px-10 py-6">
                                <div className="font-display font-black text-foreground">{pay.user.regId}</div>
                                <div className="text-[10px] font-bold text-foreground/30 uppercase mt-1">{pay.user.mobile}</div>
                              </td>
                              <td className="px-8 py-6">
                                <span className="px-3 py-1 bg-white border border-black/5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm">{pay.planType}</span>
                              </td>
                              <td className="px-8 py-6 font-display font-black text-primary">₹{pay.amount}</td>
                              <td className="px-8 py-6">
                                <a href={resolveImageUrl(`/uploads/${pay.screenshotUrl}`)} target="_blank" className="text-xs font-black uppercase tracking-widest text-primary/40 hover:text-primary transition-colors flex items-center gap-2">
                                  Proof <MoreVertical size={12} />
                                </a>
                              </td>
                              <td className="px-10 py-6 text-right space-x-3">
                                <button onClick={() => handlePaymentVerify(pay.id, 'APPROVED')} className="w-8 h-8 rounded-full bg-green-500 text-white inline-flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-green-500/20"><Check size={14} /></button>
                                <button onClick={() => handlePaymentVerify(pay.id, 'REJECTED')} className="w-8 h-8 rounded-full bg-red-500 text-white inline-flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-red-500/20"><CloseIcon size={14} /></button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : activeTab === 'enquiries' ? (
                  <div className="divide-y divide-black/[0.03]">
                    {enquiries.length === 0 ? (
                      <div className="p-20 text-center text-foreground/20 font-medium">No voices from the community today.</div>
                    ) : (
                      enquiries.map((enq: any) => (
                        <div key={enq.id} className="p-10 hover:bg-[#F7F9FB] transition-all group">
                          <div className="flex justify-between items-start mb-6">
                            <div>
                              <h3 className="text-xl font-display font-black text-foreground mb-1">{enq.firstName} {enq.lastName}</h3>
                              <p className="text-xs font-bold text-primary tracking-widest uppercase">{enq.email} • {enq.mobile}</p>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground/20">{new Date(enq.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="p-8 bg-white rounded-3xl border border-black/5 shadow-premium text-foreground/60 leading-relaxed font-medium">
                            {enq.message}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : activeTab === 'stories' ? (
                  <div className="p-8 space-y-8">
                    {/* Create Story Form */}
                    <div className="bg-[#F7F9FB] rounded-2xl p-6 border border-black/5">
                      <h3 className="font-black text-sm uppercase tracking-widest text-foreground/40 mb-4">Publish New Story</h3>
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        const fd = new FormData(e.currentTarget);
                        try {
                          await apiClient.post('/stories/admin/create', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                          alert('Story published!');
                          (e.target as HTMLFormElement).reset();
                          fetchData();
                        } catch (err: any) { alert(err.response?.data?.error || 'Failed'); }
                      }} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <input name="groomName" required placeholder="Groom Name" className="h-11 rounded-xl border border-black/10 bg-white px-4 text-sm" />
                        <input name="brideName" required placeholder="Bride Name" className="h-11 rounded-xl border border-black/10 bg-white px-4 text-sm" />
                        <input name="message" required placeholder="Short testimonial (min 10 chars)" className="h-11 rounded-xl border border-black/10 bg-white px-4 text-sm" />
                        <div className="flex gap-2">
                          <input name="photo" type="file" accept="image/*" className="h-11 text-xs file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-bold file:text-xs" />
                          <button type="submit" className="h-11 px-6 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest whitespace-nowrap hover:bg-primary/90 transition-colors">Publish</button>
                        </div>
                      </form>
                    </div>

                    {/* Stories List */}
                    {stories.length === 0 ? (
                      <div className="p-16 text-center text-foreground/20 font-medium">No stories yet.</div>
                    ) : (
                      <div className="divide-y divide-black/[0.03]">
                        {stories.map((s: any) => (
                          <div key={s.id} className="p-6 flex gap-6 items-center hover:bg-[#F7F9FB] transition-colors">
                            <div className="w-20 h-20 rounded-2xl bg-primary/5 overflow-hidden flex-shrink-0">
                              {s.photoUrl ? (
                                <img src={resolveImageUrl(s.photoUrl)} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center"><Heart size={24} className="text-primary/20" /></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-black text-foreground">{s.groomName} & {s.brideName}</h4>
                              <p className="text-sm text-foreground/50 truncate">{s.message}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${s.status === 'APPROVED' ? 'bg-green-50 text-green-700' : s.status === 'PENDING' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>{s.status}</span>
                                <span className="text-[10px] text-foreground/20">{new Date(s.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              {s.status === 'PENDING' && (
                                <>
                                  <button onClick={async () => { await apiClient.post('/stories/admin/review', { storyId: s.id, status: 'APPROVED' }); alert('Approved!'); fetchData(); }} className="w-8 h-8 rounded-full bg-green-500 text-white inline-flex items-center justify-center hover:scale-110 transition-transform" title="Approve"><Check size={14} /></button>
                                  <button onClick={async () => { await apiClient.post('/stories/admin/review', { storyId: s.id, status: 'REJECTED' }); alert('Rejected.'); fetchData(); }} className="w-8 h-8 rounded-full bg-amber-500 text-white inline-flex items-center justify-center hover:scale-110 transition-transform" title="Reject"><CloseIcon size={14} /></button>
                                </>
                              )}
                              <button onClick={async () => { if (!confirm('Delete this story?')) return; await apiClient.delete(`/stories/admin/${s.id}`); alert('Deleted.'); fetchData(); }} className="w-8 h-8 rounded-full bg-red-500 text-white inline-flex items-center justify-center hover:scale-110 transition-transform" title="Delete"><Trash2 size={14} /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-[#F2F4F6] text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">
                        <tr>
                          <th className="px-10 py-5">Register ID</th>
                          <th className="px-8 py-5">Identity</th>
                          <th className="px-8 py-5">Status</th>
                          <th className="px-8 py-5">Curated Plan</th>
                          <th className="px-10 py-5 text-right">Curation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.length === 0 ? (
                          <tr><td colSpan={5} className="p-20 text-center text-foreground/20 font-medium">The halls are quiet. No souls found.</td></tr>
                        ) : (
                          users.map((user: any) => (
                            <tr key={user.id} className="border-b border-black/[0.03] hover:bg-[#F7F9FB] transition-colors">
                              <td className="px-10 py-6 font-display font-black text-primary">{user.regId}</td>
                              <td className="px-8 py-6">
                                <div className="font-bold text-foreground">{user.profile?.firstName} {user.profile?.lastName}</div>
                                <div className="text-[10px] font-medium text-foreground/30 uppercase mt-1 tracking-tighter">{user.mobile}</div>
                              </td>
                              <td className="px-8 py-6">
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm border
                                  ${user.accountStatus === 'ACTIVE' ? 'bg-green-50 text-green-700 border-green-200' : user.accountStatus === 'SUSPENDED' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                  {user.accountStatus}
                                </span>
                              </td>
                              <td className="px-8 py-6">
                                <select
                                  value={user.planType || 'FREE'}
                                  onChange={(e) => handleSetPlan(user.id, e.target.value)}
                                  className="bg-white border border-black/5 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                                >
                                  <option value="FREE">Basic</option>
                                  <option value="SILVER">Silver</option>
                                  <option value="GOLD">Gold</option>
                                </select>
                              </td>
                              <td className="px-10 py-6 text-right space-x-2">
                                {activeTab === 'pending' && (
                                  <button onClick={() => handleAction('approve', user.id)} className="w-8 h-8 rounded-full bg-green-500 text-white inline-flex items-center justify-center hover:scale-110 transition-transform" title="Approve"><Check size={14} /></button>
                                )}
                                {activeTab === 'all' && (
                                  user.accountStatus === 'SUSPENDED' ? (
                                    <button onClick={() => handleAction('unban', user.id)} className="w-8 h-8 rounded-full bg-green-500 text-white inline-flex items-center justify-center hover:scale-110 transition-transform" title="Reactivate"><Check size={14} /></button>
                                  ) : (
                                    <button onClick={() => handleAction('ban', user.id)} className="w-8 h-8 rounded-full bg-amber-500 text-white inline-flex items-center justify-center hover:scale-110 transition-transform" title="Suspend"><Shield size={14} /></button>
                                  )
                                )}
                                <button onClick={() => handleAction('delete', user.id)} className="w-8 h-8 rounded-full bg-red-500 text-white inline-flex items-center justify-center hover:scale-110 transition-transform" title="Delete"><Trash2 size={14} /></button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
