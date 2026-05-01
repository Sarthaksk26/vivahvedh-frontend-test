import { useState, useEffect, useRef } from 'react';
import apiClient from '../../lib/apiClient';
import { resolveImageUrl } from '../../lib/url';
import { Mail, Shield, Users, Trash2, Check, X as CloseIcon, UserPlus, Heart, CreditCard, Cake, Link2, Edit, AlertCircle, Eye, TrendingUp } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { AdminTab, AdminUser, Enquiry, PaymentRecord, AdminNotifications } from './adminTypes';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>('pending');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [stories, setStories] = useState<Array<Record<string, unknown>>>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [birthdays, setBirthdays] = useState<Array<Record<string, unknown>>>([]);
  const [connections, setConnections] = useState<Array<Record<string, unknown>>>([]);
  const [profitData, setProfitData] = useState<Record<string, any> | null>(null);
  const [notifications, setNotifications] = useState<AdminNotifications | null>(null);
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);
  const [wishesSent, setWishesSent] = useState<Set<string>>(new Set());

  // Filters
  const [paymentFilter, setPaymentFilter] = useState('PENDING');
  const [connectionFilter, setConnectionFilter] = useState('ALL');
  const [allUsersFilters, setAllUsersFilters] = useState({ q: '', gender: '', ageMin: '', ageMax: '', accountStatus: '' });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Enquiry Reply State
  const [replyModal, setReplyModal] = useState<{ isOpen: boolean; enquiryId: string | null; email: string; message: string }>({ isOpen: false, enquiryId: null, email: '', message: '' });
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  // Offline user creation state
  const [offlineForm, setOfflineForm] = useState({
    firstName: '', lastName: '', mobile: '', email: '',
    gender: '', maritalStatus: '', profileCreatedBy: 'Marriage Bureau'
  });
  const [offlineSubmitting, setOfflineSubmitting] = useState(false);
  const [offlineSuccess, setOfflineSuccess] = useState<{ regId: string; name: string; email: string } | null>(null);
  const [offlineError, setOfflineError] = useState('');

  // Modals
  const [editModal, setEditModal] = useState<{ isOpen: boolean; user: any }>({ isOpen: false, user: null });
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void; loading?: boolean }>({ 
    isOpen: false, title: '', message: '', onConfirm: () => {} 
  });

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/admin/stats');
      setStats(response.data);
    } catch (e) { console.error("Stats Fetch Error", e); }
  };

  const fetchData = async () => {
    if (activeTab === 'addProfile') return;
    setLoading(true);
    try {
      if (activeTab === 'enquiries') {
        const response = await apiClient.get('/admin/enquiries');
        setEnquiries(response.data);
      } else if (activeTab === 'stories') {
        const response = await apiClient.get('/stories/admin/all');
        setStories(response.data);
      } else if (activeTab === 'payments') {
        const response = await apiClient.get(`/payments/admin/pending?status=${paymentFilter}`);
        setPayments(response.data);
      } else if (activeTab === 'birthdays') {
        const response = await apiClient.get('/admin/birthdays');
        setBirthdays(response.data);
      } else if (activeTab === 'connections') {
        const response = await apiClient.get(`/admin/connections?status=${connectionFilter === 'ALL' ? '' : connectionFilter}`);
        setConnections(response.data);
      } else if (activeTab === 'profit') {
        const response = await apiClient.get('/admin/profit');
        setProfitData(response.data);
      } else if (activeTab === 'pending') {
        const response = await apiClient.get('/admin/pending');
        setUsers(response.data);
      } else {
        const params = new URLSearchParams();
        if (allUsersFilters.q) params.append('q', allUsersFilters.q);
        if (allUsersFilters.gender) params.append('gender', allUsersFilters.gender);
        if (allUsersFilters.ageMin) params.append('ageMin', allUsersFilters.ageMin);
        if (allUsersFilters.ageMax) params.append('ageMax', allUsersFilters.ageMax);
        if (allUsersFilters.accountStatus) params.append('accountStatus', allUsersFilters.accountStatus);
        
        const response = await apiClient.get(`/admin/all-users?${params.toString()}`);
        setUsers(response.data);
      }
    } catch (error: any) {
      if (error.response?.status === 403) toast.error("ACCESS DENIED");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch notifications on mount and every 60 seconds
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await apiClient.get('/admin/notifications');
        setNotifications(res.data);
      } catch (e) { console.error(e); }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchStats();
    if (activeTab !== 'all') {
      fetchData();
    }
  }, [activeTab, paymentFilter, connectionFilter]);

  useEffect(() => {
    if (activeTab !== 'all') return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchData();
    }, 500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [allUsersFilters, activeTab]);

  const handleReplyEnquiry = async () => {
    if (!replyModal.enquiryId || !replyText.trim()) return;
    setReplying(true);
    try {
      await apiClient.post('/admin/enquiries/reply', { enquiryId: replyModal.enquiryId, replyMessage: replyText });
      toast.success("Reply sent successfully.");
      setReplyModal({ isOpen: false, enquiryId: null, email: '', message: '' });
      setReplyText('');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to send reply.");
    } finally {
      setReplying(false);
    }
  };

  const handleResolveEnquiry = async (enquiryId: string, isResolved: boolean) => {
    try {
      await apiClient.patch('/admin/enquiries/resolve', { enquiryId, isResolved });
      toast.success(isResolved ? "Enquiry marked as resolved" : "Enquiry marked as unresolved");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  const handleVerifyPayment = async (paymentId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await apiClient.patch(`/payments/admin/verify/${paymentId}`, { status });
      toast.success(`Payment ${status.toLowerCase()} successfully.`);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to verify payment.");
    }
  };

  const handleAction = async (action: 'approve' | 'ban' | 'unban' | 'delete', userId: string) => {
    if (action === 'delete') {
      setConfirmModal({
        isOpen: true,
        title: 'Permanent Deletion',
        message: 'Are you absolutely sure? This will permanently remove all user data including profile, images, and history.',
        onConfirm: async () => {
          try {
            await apiClient.delete(`/admin/delete/${userId}`);
            toast.success("User deleted permanently.");
            setConfirmModal(prev => ({ ...prev, isOpen: false }));
            fetchData();
            fetchStats();
          } catch (e: any) { toast.error(e.response?.data?.error || "Delete failed"); }
        }
      });
      return;
    }

    if (action === 'approve') {
      setConfirmModal({
        isOpen: true,
        title: 'Approve Profile',
        message: `Approve this member's profile? They will receive an email and gain full access to the platform.`,
        onConfirm: async () => {
          try {
            await apiClient.post('/admin/approve', { targetUserId: userId });
            toast.success('User approved successfully. Approval email sent.');
            setConfirmModal(prev => ({ ...prev, isOpen: false }));
            fetchData();
            fetchStats();
          } catch (e: any) {
            toast.error(e.response?.data?.error || 'Approval failed');
          }
        }
      });
      return;
    }

    try {
      if (action === 'ban') await apiClient.post('/admin/ban', { targetUserId: userId, action: 'ban' });
      if (action === 'unban') await apiClient.post('/admin/ban', { targetUserId: userId, action: 'unban' });
      toast.success(`Action "${action}" completed successfully.`);
      fetchData();
      fetchStats();
    } catch (error: any) {
      toast.error(error.response?.data?.error || `Failed to ${action} user.`);
    }
  };

  const handleSendWish = async (userId: string) => {
    try {
      await apiClient.post(`/admin/birthdays/send-wishes/${userId}`);
      toast.success("Birthday wishes sent via email!");
      setWishesSent(prev => new Set([...prev, userId]));
    } catch (e) { toast.error("Failed to send wishes"); }
  };

  const handleSetPlan = async (userId: string, planType: string) => {
    const durationMonths = planType === 'SILVER' ? 6 : planType === 'GOLD' ? 12 : 0;
    try {
      await apiClient.post('/admin/set-plan', { targetUserId: userId, planType, durationMonths });
      toast.success(`Plan updated to ${planType}`);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update plan");
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
          <div className="flex items-center gap-3">
            <button
              onClick={async () => {
                try {
                  const email = prompt('Enter email address to test:');
                  if (!email) return;
                  await apiClient.post('/admin/test-email', { email });
                  toast.success('Test email sent! Check inbox.');
                } catch (err: any) {
                  toast.error('Email test failed: ' + (err.response?.data?.details || err.message));
                }
              }}
              className="px-4 py-2 text-xs font-bold border border-black/10 rounded-xl hover:bg-muted transition text-foreground/40"
            >
              📧 Test Email
            </button>
            <div className="px-6 py-3 bg-white shadow-ambient rounded-2xl flex items-center gap-3 border border-black/5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest text-foreground/40 font-display">Systems Active</span>
            </div>
          </div>
        </div>

        {/* Stats Summary Block */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {[
            { label: 'Total Users', value: stats?.totalUsers || 0, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Active', value: stats?.activeUsers || 0, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Pending', value: stats?.pendingApprovals || 0, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Payments', value: stats?.pendingPayments || 0, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Connections', value: stats?.totalConnections || 0, color: 'text-rose-600', bg: 'bg-rose-50' },
            { label: 'New This Month', value: stats?.thisMonthRegs || 0, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          ].map((s, i) => (
            <div key={i} className={`${s.bg} p-6 rounded-[24px] border border-black/5 shadow-sm`}>
              <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-2">{s.label}</p>
              <p className={`text-2xl font-display font-black ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Notification Action Panel */}
        {notifications && notifications.totalUnread > 0 && (
          <div className="mb-8 bg-white rounded-[32px] p-6 shadow-ambient border border-black/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-black text-sm uppercase tracking-widest text-foreground/40">
                Action Required
              </h3>
              <span className="px-3 py-1 bg-red-500 text-white text-xs font-black rounded-full animate-pulse">
                {notifications.totalUnread} Pending
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(notifications.notifications)
                .filter(([, v]: [string, any]) => v.urgent)
                .map(([key, v]: [string, any]) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(v.tab as any)}
                    className="p-4 bg-red-50 border border-red-100 rounded-2xl text-left hover:bg-red-100 transition-colors group"
                  >
                    <p className="text-2xl font-display font-black text-red-600">{v.count}</p>
                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider mt-1 leading-tight">{v.label}</p>
                  </button>
                ))}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Navigation Sidebar */}
          <aside className="w-full lg:w-72">
            <div className="bg-white rounded-[32px] p-6 shadow-ambient sticky top-28 border border-black/5">
              <nav className="space-y-2">
                {[
                  { id: 'pending', label: 'Approvals', icon: <Users size={18} />, badge: notifications?.notifications?.pendingApprovals?.count || stats?.pendingApprovals || 0 },
                  { id: 'all', label: 'Community', icon: <Shield size={18} /> },
                  { id: 'enquiries', label: 'Inbox', icon: <Mail size={18} />, badge: notifications?.notifications?.unresolvedEnquiries?.count || 0 },
                  { id: 'birthdays', label: 'Birthdays', icon: <Cake size={18} />, badge: notifications?.notifications?.upcomingBirthdays?.count || 0 },
                  { id: 'connections', label: 'Connections', icon: <Link2 size={18} /> },
                  { id: 'payments', label: 'Payments', icon: <CreditCard size={18} />, badge: notifications?.notifications?.pendingPayments?.count || stats?.pendingPayments || 0 },
                  { id: 'addProfile', label: 'Add Profile', icon: <UserPlus size={18} /> },
                  { id: 'stories', label: 'Stories', icon: <Heart size={18} />, badge: notifications?.notifications?.pendingStories?.count || 0 },
                  { id: 'profit', label: 'Profit Tracker', icon: <TrendingUp size={18} /> },
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
                  {activeTab === 'pending' ? 'Curation Queue' : 
                   activeTab === 'all' ? 'All Citizens' : 
                   activeTab === 'addProfile' ? 'Onboard Offline Customer' : 
                   activeTab === 'stories' ? 'Stories Manager' : 
                   activeTab === 'payments' ? 'Payment Approvals' : 
                   'Communication Log'}
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
                ) : activeTab === 'enquiries' ? (
                  <div className="divide-y divide-black/[0.03]">
                    {enquiries.length === 0 ? (
                      <div className="p-20 text-center text-foreground/20 font-medium">No voices from the community today.</div>
                    ) : (
                      enquiries.map((enq: any) => (
                        <div key={enq.id} className={`p-10 transition-all group ${enq.isResolved ? 'bg-[#F2F4F6]/50 opacity-60' : 'hover:bg-[#F7F9FB]'}`}>
                          <div className="flex justify-between items-start mb-6">
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-xl font-display font-black text-foreground">{enq.firstName} {enq.lastName}</h3>
                                {enq.isResolved && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-black uppercase rounded-full">Resolved</span>}
                              </div>
                              <p className="text-xs font-bold text-primary tracking-widest uppercase">{enq.email} • {enq.mobile}</p>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground/20">{new Date(enq.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="p-8 bg-white rounded-3xl border border-black/5 shadow-premium text-foreground/60 leading-relaxed font-medium mb-4">
                            {enq.message}
                          </div>
                          <div className="flex gap-3">
                            <button 
                              onClick={() => setReplyModal({ isOpen: true, enquiryId: enq.id, email: enq.email, message: enq.message })}
                              className="px-6 py-2 bg-primary/10 text-primary rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary/20 transition-colors"
                            >
                              Reply via Email
                            </button>
                            <button 
                              onClick={() => handleResolveEnquiry(enq.id, !enq.isResolved)}
                              className={`px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors ${enq.isResolved ? 'bg-black/5 text-foreground/50 hover:bg-black/10' : 'bg-green-500/10 text-green-600 hover:bg-green-500/20'}`}
                            >
                              {enq.isResolved ? 'Mark Unresolved' : 'Mark Resolved'}
                            </button>
                          </div>
                        </div>
                      ))
                    )}

                    {/* Reply Modal */}
                    {replyModal.isOpen && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl border border-black/10">
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-foreground">Reply to Enquiry</h3>
                            <button onClick={() => setReplyModal({ isOpen: false, enquiryId: null, email: '', message: '' })} className="p-2 text-foreground/40 hover:text-foreground bg-black/5 rounded-full"><CloseIcon size={16} /></button>
                          </div>
                          <p className="text-xs font-bold text-foreground/50 mb-2 uppercase tracking-widest">To: {replyModal.email}</p>
                          <div className="p-4 bg-black/5 rounded-xl text-sm text-foreground/70 mb-6 max-h-32 overflow-y-auto italic border-l-4 border-primary/20">
                            "{replyModal.message}"
                          </div>
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Type your response here... (This will be emailed to the user)"
                            className="w-full min-h-[150px] p-4 bg-white border border-black/10 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/50 text-sm mb-6 resize-y"
                          />
                          <div className="flex justify-end gap-3">
                            <button onClick={() => setReplyModal({ isOpen: false, enquiryId: null, email: '', message: '' })} className="px-6 py-3 font-bold text-xs uppercase tracking-widest text-foreground/50 hover:bg-black/5 rounded-xl transition-colors">Cancel</button>
                            <button onClick={handleReplyEnquiry} disabled={replying || !replyText.trim()} className="px-8 py-3 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-2">
                              {replying ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Mail size={16} />}
                              Send Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : activeTab === 'payments' ? (
                  <div>
                    {/* Payment Status Filter */}
                    <div className="px-10 py-6 border-b border-black/[0.03] flex gap-4 bg-white">
                      {['PENDING', 'APPROVED', 'REJECTED'].map(f => (
                        <button
                          key={f}
                          onClick={() => setPaymentFilter(f)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                            ${paymentFilter === f ? 'bg-primary text-white shadow-md' : 'bg-black/5 text-foreground/40 hover:bg-black/10'}`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                    <div className="divide-y divide-black/[0.03]">
                      {payments.length === 0 ? (
                        <div className="p-20 text-center text-foreground/20 font-medium">No payments found for this filter.</div>
                      ) : (
                        payments.map((pay: any) => (
                          <div key={pay.id} className="p-10 flex flex-col md:flex-row gap-8 hover:bg-[#F7F9FB] transition-colors">
                            <div className="w-full md:w-64 h-80 bg-black/5 rounded-3xl overflow-hidden border border-black/5 flex-shrink-0 group relative">
                              <img src={resolveImageUrl(pay.screenshotUrl)} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <a href={resolveImageUrl(pay.screenshotUrl)} target="_blank" rel="noreferrer" className="bg-white text-black px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest">View Full Size</a>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-start mb-4">
                                  <div>
                                    <h3 className="text-2xl font-display font-black text-foreground">{pay.user?.regId}</h3>
                                    <p className="text-xs font-bold text-primary tracking-widest uppercase">{pay.user?.email} • {pay.user?.mobile}</p>
                                  </div>
                                  <span className={`px-4 py-2 rounded-2xl font-black text-sm ${pay.status === 'APPROVED' ? 'bg-green-100 text-green-700' : pay.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-primary/10 text-primary'}`}>₹{pay.amount}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                  <div className="p-4 bg-white rounded-2xl border border-black/5 shadow-premium">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-1">Plan Requested</p>
                                    <p className="text-sm font-bold text-foreground">{pay.planType} <span className="text-primary text-xs">(₹{pay.amount} claimed)</span></p>
                                  </div>
                                  <div className="p-4 bg-white rounded-2xl border border-black/5 shadow-premium">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-1">Transaction ID</p>
                                    <p className="text-sm font-bold text-foreground font-mono">{pay.transactionId}</p>
                                  </div>
                                </div>
                              </div>
                              {pay.status === 'PENDING' && (
                                <div className="flex gap-4">
                                  <button 
                                    onClick={() => handleVerifyPayment(pay.id, 'APPROVED')}
                                    className="flex-1 h-14 bg-green-500 text-white rounded-2xl font-display font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-green-500/20 hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                                  >
                                    <Check size={18} /> Approve Plan
                                  </button>
                                  <button 
                                    onClick={() => handleVerifyPayment(pay.id, 'REJECTED')}
                                    className="flex-1 h-14 bg-red-500/10 text-red-500 rounded-2xl font-display font-black text-xs uppercase tracking-[0.2em] hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
                                  >
                                    <CloseIcon size={18} /> Reject
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ) : activeTab === 'birthdays' ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-[#F2F4F6] text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">
                        <tr>
                          <th className="px-10 py-5">Member</th>
                          <th className="px-8 py-5">Birth Date</th>
                          <th className="px-8 py-5">Days Left</th>
                          <th className="px-10 py-5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {birthdays.length === 0 ? (
                          <tr><td colSpan={4} className="p-20 text-center text-foreground/20 font-medium">No upcoming birthdays in the next 30 days.</td></tr>
                        ) : (
                          birthdays.map((b: any) => (
                            <tr key={b.id} className="border-b border-black/[0.03] hover:bg-[#F7F9FB] transition-colors">
                              <td className="px-10 py-6">
                                <div className="font-black text-foreground">{b.firstName} {b.lastName}</div>
                                <div className="text-[10px] font-bold text-primary uppercase">{b.regId}</div>
                              </td>
                              <td className="px-8 py-6 text-sm font-medium text-foreground/60">{new Date(b.birthDate).toLocaleDateString()}</td>
                              <td className="px-8 py-6">
                                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${b.daysUntil === 0 ? 'bg-rose-500 text-white animate-pulse' : 'bg-amber-100 text-amber-700'}`}>
                                  {b.daysUntil === 0 ? 'TODAY!' : `In ${b.daysUntil} Days`}
                                </span>
                              </td>
                              <td className="px-10 py-6 text-right">
                                <button 
                                  onClick={() => handleSendWish(b.id)} 
                                  disabled={wishesSent.has(b.id)}
                                  className={`px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 ml-auto transition-all
                                    ${wishesSent.has(b.id) 
                                      ? 'bg-green-100 text-green-700 cursor-default' 
                                      : 'bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105'
                                    }`}
                                >
                                  <Cake size={14} /> 
                                  {wishesSent.has(b.id) ? '✓ Wish Sent' : 'Send Wish'}
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : activeTab === 'connections' ? (
                  <div>
                    <div className="px-10 py-6 border-b border-black/[0.03] flex gap-4 bg-white">
                      {['ALL', 'PENDING', 'ACCEPTED', 'REJECTED'].map(f => (
                        <button
                          key={f}
                          onClick={() => setConnectionFilter(f)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                            ${connectionFilter === f ? 'bg-primary text-white shadow-md' : 'bg-black/5 text-foreground/40 hover:bg-black/10'}`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-[#F2F4F6] text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">
                          <tr>
                            <th className="px-10 py-5">Sender</th>
                            <th className="px-8 py-5">Receiver</th>
                            <th className="px-8 py-5">Status</th>
                            <th className="px-10 py-5 text-right">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {connections.length === 0 ? (
                            <tr><td colSpan={4} className="p-20 text-center text-foreground/20 font-medium">No connection logs found.</td></tr>
                          ) : (
                            connections.map((c: any) => (
                              <tr key={c.id} className="border-b border-black/[0.03] hover:bg-[#F7F9FB] transition-colors">
                                <td className="px-10 py-6">
                                  <div className="font-bold text-foreground">
                                    {c.sender?.profile 
                                      ? `${c.sender.profile.firstName} ${c.sender.profile.lastName}` 
                                      : c.sender?.regId || 'Unknown'}
                                  </div>
                                  <div className="text-[10px] font-medium text-foreground/30 uppercase">{c.sender?.regId}</div>
                                </td>
                                <td className="px-8 py-6">
                                  <div className="font-bold text-foreground">
                                    {c.receiver?.profile 
                                      ? `${c.receiver.profile.firstName} ${c.receiver.profile.lastName}` 
                                      : c.receiver?.regId || 'Unknown'}
                                  </div>
                                  <div className="text-[10px] font-medium text-foreground/30 uppercase">{c.receiver?.regId}</div>
                                </td>
                                <td className="px-8 py-6">
                                  <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest
                                    ${c.status === 'ACCEPTED' ? 'bg-green-50 text-green-700' : c.status === 'REJECTED' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
                                    {c.status}
                                  </span>
                                </td>
                                <td className="px-10 py-6 text-right text-[10px] font-black text-foreground/20 uppercase">
                                  {new Date(c.createdAt).toLocaleDateString()}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
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
                          toast.success('Story published successfully!');
                          (e.target as HTMLFormElement).reset();
                          fetchData();
                        } catch (err: any) { toast.error(err.response?.data?.error || 'Failed to publish story'); }
                      }} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                          <input name="groomName" required placeholder="Groom Name" className="h-11 rounded-xl border border-black/10 bg-white px-4 text-sm w-full" />
                          <input name="brideName" required placeholder="Bride Name" className="h-11 rounded-xl border border-black/10 bg-white px-4 text-sm w-full" />
                          <input name="message" required placeholder="Testimonial..." className="h-11 rounded-xl border border-black/10 bg-white px-4 text-sm w-full" />
                        </div>
                        <div className="flex w-full md:w-auto gap-4 items-end">
                          <div className="flex-1">
                            <input name="photo" type="file" accept="image/*" className="w-full text-xs file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-bold file:text-xs" />
                          </div>
                          <button type="submit" className="h-11 px-8 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary/90 transition-all flex-shrink-0 shadow-lg shadow-primary/20">
                            Publish
                          </button>
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
                                  <button onClick={async () => { try { await apiClient.post('/stories/admin/review', { storyId: s.id, status: 'APPROVED' }); toast.success('Story Approved!'); fetchData(); } catch(e) { toast.error('Failed'); } }} className="w-8 h-8 rounded-full bg-green-500 text-white inline-flex items-center justify-center hover:scale-110 transition-transform" title="Approve"><Check size={14} /></button>
                                  <button onClick={async () => { try { await apiClient.post('/stories/admin/review', { storyId: s.id, status: 'REJECTED' }); toast.success('Story Rejected.'); fetchData(); } catch(e) { toast.error('Failed'); } }} className="w-8 h-8 rounded-full bg-amber-500 text-white inline-flex items-center justify-center hover:scale-110 transition-transform" title="Reject"><CloseIcon size={14} /></button>
                                </>
                              )}
                              <button onClick={() => {
                                setConfirmModal({
                                  isOpen: true,
                                  title: 'Delete Story',
                                  message: "This will permanently remove this couple's success story. This action cannot be undone.",
                                  onConfirm: async () => {
                                    try {
                                      await apiClient.delete(`/stories/admin/${s.id}`);
                                      toast.success('Story deleted permanently.');
                                      setConfirmModal(prev => ({ ...prev, isOpen: false }));
                                      fetchData();
                                    } catch (e) {
                                      toast.error('Failed to delete story.');
                                    }
                                  }
                                });
                              }} className="w-8 h-8 rounded-full bg-red-500 text-white inline-flex items-center justify-center hover:scale-110 transition-transform" title="Delete"><Trash2 size={14} /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : activeTab === 'profit' ? (
                  <div className="p-10 space-y-8">
                    {!profitData ? (
                      <div className="text-center text-muted-foreground">Loading profit data...</div>
                    ) : (
                      <>
                        {/* Revenue Summary Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          {[
                            { label: 'Total Revenue', value: `₹${profitData.totalRevenue.toLocaleString('en-IN')}`, color: 'text-green-600', bg: 'bg-green-50' },
                            { label: 'Gold Revenue', value: `₹${profitData.goldRevenue.toLocaleString('en-IN')}`, color: 'text-amber-600', bg: 'bg-amber-50' },
                            { label: 'Silver Revenue', value: `₹${profitData.silverRevenue.toLocaleString('en-IN')}`, color: 'text-slate-600', bg: 'bg-slate-50' },
                            { label: 'Total Transactions', value: profitData.totalTransactions, color: 'text-blue-600', bg: 'bg-blue-50' },
                          ].map((s, i) => (
                            <div key={i} className={`${s.bg} p-6 rounded-[24px] border border-black/5`}>
                              <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-2">{s.label}</p>
                              <p className={`text-2xl font-display font-black ${s.color}`}>{s.value}</p>
                            </div>
                          ))}
                        </div>

                        {/* Online vs Offline Users */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-[#F7F9FB] rounded-[24px] p-6 border border-black/5">
                            <h3 className="font-black text-sm uppercase tracking-widest text-foreground/40 mb-4">User Registration Type</h3>
                            <div className="flex gap-6">
                              <div>
                                <p className="text-3xl font-display font-black text-blue-600">{profitData.onlineUsers}</p>
                                <p className="text-xs font-bold text-foreground/40 uppercase tracking-wider mt-1">Online (Self-Registered)</p>
                              </div>
                              <div>
                                <p className="text-3xl font-display font-black text-purple-600">{profitData.offlineUsers}</p>
                                <p className="text-xs font-bold text-foreground/40 uppercase tracking-wider mt-1">Offline (Admin-Created)</p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-[#F7F9FB] rounded-[24px] p-6 border border-black/5">
                            <h3 className="font-black text-sm uppercase tracking-widest text-foreground/40 mb-4">Plan Distribution</h3>
                            <div className="flex gap-6">
                              {profitData.planDistribution.map((p: any) => (
                                <div key={p.plan}>
                                  <p className={`text-3xl font-display font-black ${p.plan === 'GOLD' ? 'text-amber-600' : p.plan === 'SILVER' ? 'text-slate-600' : 'text-gray-400'}`}>
                                    {p.count}
                                  </p>
                                  <p className="text-xs font-bold text-foreground/40 uppercase tracking-wider mt-1">{p.plan}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Monthly Revenue */}
                        <div className="bg-[#F7F9FB] rounded-[24px] p-6 border border-black/5">
                          <h3 className="font-black text-sm uppercase tracking-widest text-foreground/40 mb-4">Monthly Revenue (Last 12 Months)</h3>
                          <div className="overflow-x-auto">
                            <div className="flex gap-3 min-w-max">
                              {Object.entries(profitData.monthlyRevenue)
                                .sort(([a], [b]) => a.localeCompare(b))
                                .slice(-12)
                                .map(([month, amount]: [string, any]) => {
                                  const maxAmount = Math.max(...Object.values(profitData.monthlyRevenue) as number[]);
                                  const heightPercent = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
                                  return (
                                    <div key={month} className="flex flex-col items-center gap-2">
                                      <p className="text-xs font-bold text-primary">₹{(amount/1000).toFixed(0)}k</p>
                                      <div className="w-12 bg-white rounded-lg overflow-hidden border border-black/5" style={{ height: '80px' }}>
                                        <div 
                                          className="w-full bg-primary/70 rounded-lg transition-all"
                                          style={{ height: `${heightPercent}%`, marginTop: `${100 - heightPercent}%` }}
                                        />
                                      </div>
                                      <p className="text-[10px] font-bold text-foreground/30">{month.slice(5)}/{month.slice(2,4)}</p>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        </div>

                        {/* Recent Transactions Table */}
                        <div className="bg-white rounded-[24px] border border-black/5 overflow-hidden">
                          <div className="px-6 py-4 border-b bg-[#F7F9FB]">
                            <h3 className="font-black text-sm uppercase tracking-widest text-foreground/40">Recent Approved Transactions</h3>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left">
                              <thead className="text-[10px] font-black uppercase tracking-widest text-foreground/30 border-b">
                                <tr>
                                  <th className="px-6 py-4">Member</th>
                                  <th className="px-4 py-4">Type</th>
                                  <th className="px-4 py-4">Plan</th>
                                  <th className="px-4 py-4">Amount</th>
                                  <th className="px-6 py-4">Date</th>
                                </tr>
                              </thead>
                              <tbody>
                                {profitData.recentPayments.map((p: any) => (
                                  <tr key={p.id} className="border-b border-black/[0.03] hover:bg-[#F7F9FB] transition">
                                    <td className="px-6 py-4">
                                      <div className="font-bold text-sm">{p.name || 'Unknown'}</div>
                                      <div className="text-[10px] text-primary font-bold">{p.regId}</div>
                                    </td>
                                    <td className="px-4 py-4">
                                      <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full ${p.isOffline ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                                        {p.isOffline ? 'Offline' : 'Online'}
                                      </span>
                                    </td>
                                    <td className="px-4 py-4">
                                      <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full ${p.planType === 'GOLD' ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-700'}`}>
                                        {p.planType}
                                      </span>
                                    </td>
                                    <td className="px-4 py-4 font-black text-green-700">₹{p.amount.toLocaleString('en-IN')}</td>
                                    <td className="px-6 py-4 text-[10px] text-foreground/30">{new Date(p.createdAt).toLocaleDateString('en-IN')}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {activeTab === 'all' && (
                      <>
                        {/* Location Filter Bar */}
                        <div className="px-10 py-6 border-b border-black/[0.03] bg-[#F7F9FB] flex flex-wrap gap-4 items-end">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">City / Town</label>
                            <input
                              type="text"
                              placeholder="e.g. Pune, Nashik..."
                              className="h-10 rounded-xl border border-black/10 bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-48"
                              onChange={async (e) => {
                                const city = e.target.value;
                                if (city.length < 2) { fetchData(); return; }
                                try {
                                  const res = await apiClient.get(`/admin/users/by-location?city=${city}`);
                                  setUsers(res.data);
                                } catch { }
                              }}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Gender</label>
                            <select
                              className="h-10 rounded-xl border border-black/10 bg-white px-4 text-sm focus:outline-none w-36"
                              onChange={async (e) => {
                                try {
                                  const res = await apiClient.get(`/admin/users/by-location?gender=${e.target.value}`);
                                  setUsers(res.data);
                                } catch { }
                              }}
                            >
                              <option value="">All</option>
                              <option value="MALE">Male</option>
                              <option value="FEMALE">Female</option>
                            </select>
                          </div>
                          <button
                            onClick={() => fetchData()}
                            className="h-10 px-6 bg-black/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:bg-black/10 transition"
                          >
                            Reset
                          </button>
                        </div>

                        {/* Existing search filters */}
                        <div className="p-6 bg-white border-b border-black/5 flex flex-wrap gap-4 items-center">
                          <input 
                            placeholder="Search RegID or Name..." 
                            value={allUsersFilters.q}
                            onChange={(e) => setAllUsersFilters(p => ({ ...p, q: e.target.value }))}
                            className="h-10 rounded-xl border border-black/10 bg-[#F7F9FB] px-4 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-[200px]"
                          />
                          <select 
                            value={allUsersFilters.gender}
                            onChange={(e) => setAllUsersFilters(p => ({ ...p, gender: e.target.value }))}
                            className="h-10 rounded-xl border border-black/10 bg-[#F7F9FB] px-4 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                          >
                            <option value="">Any Gender</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                          </select>
                          <div className="flex items-center gap-2">
                            <input 
                              placeholder="Min Age" type="number" 
                              value={allUsersFilters.ageMin}
                              onChange={(e) => setAllUsersFilters(p => ({ ...p, ageMin: e.target.value }))}
                              className="h-10 w-24 rounded-xl border border-black/10 bg-[#F7F9FB] px-4 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            <span className="text-foreground/30 text-xs">-</span>
                            <input 
                              placeholder="Max Age" type="number" 
                              value={allUsersFilters.ageMax}
                              onChange={(e) => setAllUsersFilters(p => ({ ...p, ageMax: e.target.value }))}
                              className="h-10 w-24 rounded-xl border border-black/10 bg-[#F7F9FB] px-4 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                          <select 
                            value={allUsersFilters.accountStatus}
                            onChange={(e) => setAllUsersFilters(p => ({ ...p, accountStatus: e.target.value }))}
                            className="h-10 rounded-xl border border-black/10 bg-[#F7F9FB] px-4 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                          >
                            <option value="">All Statuses</option>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive (Pending)</option>
                            <option value="SUSPENDED">Suspended</option>
                          </select>
                        </div>
                      </>
                    )}
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
                                  <>
                                    <button onClick={() => window.open(`/profile/${user.id}`, '_blank')} className="w-8 h-8 rounded-full bg-indigo-500 text-white inline-flex items-center justify-center hover:scale-110 transition-transform" title="Preview Profile"><Eye size={14} /></button>
                                    <button onClick={() => handleAction('approve', user.id)} className="w-8 h-8 rounded-full bg-green-500 text-white inline-flex items-center justify-center hover:scale-110 transition-transform" title="Approve"><Check size={14} /></button>
                                  </>
                                )}
                                {activeTab === 'all' && (
                                  <>
                                    <button onClick={() => window.open(`/profile/${user.id}`, '_blank')} className="w-8 h-8 rounded-full bg-indigo-500 text-white inline-flex items-center justify-center hover:scale-110 transition-transform" title="View Profile"><Eye size={14} /></button>
                                    <button onClick={() => setEditModal({ isOpen: true, user })} className="w-8 h-8 rounded-full bg-blue-500 text-white inline-flex items-center justify-center hover:scale-110 transition-transform" title="Edit Profile"><Edit size={14} /></button>
                                    {user.accountStatus === 'SUSPENDED' ? (
                                      <button onClick={() => handleAction('unban', user.id)} className="w-8 h-8 rounded-full bg-green-500 text-white inline-flex items-center justify-center hover:scale-110 transition-transform" title="Reactivate"><Check size={14} /></button>
                                    ) : (
                                      <button onClick={() => handleAction('ban', user.id)} className="w-8 h-8 rounded-full bg-amber-500 text-white inline-flex items-center justify-center hover:scale-110 transition-transform" title="Suspend"><Shield size={14} /></button>
                                    )}
                                  </>
                                )}
                                <button onClick={() => handleAction('delete', user.id)} className="w-8 h-8 rounded-full bg-red-500 text-white inline-flex items-center justify-center hover:scale-110 transition-transform" title="Delete"><Trash2 size={14} /></button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Edit User Modal */}
      {editModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-white rounded-[40px] p-10 max-w-4xl w-full shadow-2xl border border-black/10 relative">
            <button onClick={() => setEditModal({ isOpen: false, user: null })} className="absolute top-8 right-8 p-3 text-foreground/40 hover:text-foreground bg-black/5 rounded-full transition-colors"><CloseIcon size={20} /></button>
            
            <div className="mb-8">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2 block">Administrative Override</span>
              <h3 className="text-3xl font-display font-black text-foreground">Edit Profile: {editModal.user.regId}</h3>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const data: any = { profile: {}, physical: {}, education: {}, family: {}, astrology: {}, addresses: {} };
              
              const birthDate = fd.get('birthDate') as string;
              const birthTime = fd.get('birthTime') as string;

              if (birthDate && birthTime) {
                // Combine into valid ISO string
                try {
                   data.profile.birthDateTime = new Date(`${birthDate}T${birthTime}:00Z`).toISOString();
                } catch(e) {
                   console.warn("Invalid date/time combination");
                }
              } else if (birthDate) {
                 try {
                   data.profile.birthDateTime = new Date(`${birthDate}T12:00:00Z`).toISOString();
                 } catch(e) {
                   console.warn("Invalid date");
                 }
              }

              fd.forEach((value, key) => {
                if (key === 'email' || key === 'mobile') {
                   data[key] = value;
                } else if (['firstName', 'lastName', 'gender', 'maritalStatus', 'birthPlace'].includes(key)) {
                   data.profile[key] = value;
                } else if (['height', 'weight', 'bloodGroup', 'complexion', 'diet'].includes(key)) {
                   if (key === 'weight' && value) {
                       data.physical[key] = parseInt(value as string);
                   } else {
                       data.physical[key] = value;
                   }
                } else if (['education', 'occupation', 'income'].includes(key)) {
                   if (key === 'education') data.education['trade'] = value;
                   if (key === 'occupation') data.education['jobBusiness'] = value;
                   if (key === 'income') data.education['annualIncome'] = value;
                } else if (['fatherName', 'motherName', 'familyType', 'motherHometown'].includes(key)) {
                   if (key === 'familyType') data.family['familyBackground'] = value;
                   else if (key === 'motherHometown') data.family['motherHometown'] = value;
                   else data.family[key] = value;
                } else if (['rashi', 'gotra', 'manglik'].includes(key)) {
                   if (key === 'gotra') data.astrology['gothra'] = value;
                   else if (key === 'manglik') data.astrology['mangal'] = value;
                   else data.astrology[key] = value;
                } else if (['address_city', 'address_district', 'address_state'].includes(key)) {
                   if (key === 'address_city') data.addresses['city'] = value;
                   if (key === 'address_district') data.addresses['district'] = value;
                   if (key === 'address_state') data.addresses['state'] = value;
                }
              });

              // Clean up empty objects so we don't send empty updates
              if (Object.keys(data.profile).length === 0) delete data.profile;
              if (Object.keys(data.physical).length === 0) delete data.physical;
              if (Object.keys(data.education).length === 0) delete data.education;
              if (Object.keys(data.family).length === 0) delete data.family;
              if (Object.keys(data.astrology).length === 0) delete data.astrology;
              if (Object.keys(data.addresses).length === 0) delete data.addresses;

              try {
                await apiClient.patch(`/admin/users/${editModal.user.id}`, data);
                toast.success('User updated successfully!');
                setEditModal({ isOpen: false, user: null });
                fetchData();
              } catch (err: any) { toast.error(err.response?.data?.error || 'Update failed'); }
            }} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[60vh] overflow-y-auto pr-4 scrollbar-thin">
              
              {/* Account Section */}
              <div className="col-span-full border-b border-black/5 pb-4"><h4 className="text-xs font-black uppercase tracking-widest text-primary">Account Credentials</h4></div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Email Address</label>
                <input name="email" defaultValue={editModal.user.email} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Mobile Number</label>
                <input name="mobile" defaultValue={editModal.user.mobile} className={inputClass} />
              </div>

              {/* Profile Section */}
              <div className="col-span-full border-b border-black/5 pb-4 pt-4"><h4 className="text-xs font-black uppercase tracking-widest text-primary">Personal Details</h4></div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">First Name</label>
                <input name="firstName" defaultValue={editModal.user.profile?.firstName} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Last Name</label>
                <input name="lastName" defaultValue={editModal.user.profile?.lastName} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Gender</label>
                <select name="gender" defaultValue={editModal.user.profile?.gender} className={inputClass}>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Marital Status</label>
                <select name="maritalStatus" defaultValue={editModal.user.profile?.maritalStatus} className={inputClass}>
                  <option value="UNMARRIED">Unmarried</option>
                  <option value="DIVORCED">Divorced</option>
                  <option value="WIDOWED">Widowed</option>
                  <option value="SEPARATED">Separated</option>
                </select>
              </div>

              {/* Physical Section */}
              <div className="col-span-full border-b border-black/5 pb-4 pt-4"><h4 className="text-xs font-black uppercase tracking-widest text-primary">Physical Details</h4></div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Height</label>
                <input name="height" defaultValue={editModal.user.physical?.height} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Weight (kg)</label>
                <input name="weight" type="number" defaultValue={editModal.user.physical?.weight} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Blood Group</label>
                <input name="bloodGroup" defaultValue={editModal.user.physical?.bloodGroup} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Complexion</label>
                <input name="complexion" defaultValue={editModal.user.physical?.complexion} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Diet</label>
                <input name="diet" defaultValue={editModal.user.physical?.diet} className={inputClass} />
              </div>

              {/* Education Section */}
              <div className="col-span-full border-b border-black/5 pb-4 pt-4"><h4 className="text-xs font-black uppercase tracking-widest text-primary">Education & Career</h4></div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Education</label>
                <input name="education" defaultValue={editModal.user.education?.trade} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Occupation</label>
                <input name="occupation" defaultValue={editModal.user.education?.jobBusiness} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Income</label>
                <input name="income" defaultValue={editModal.user.education?.annualIncome} className={inputClass} />
              </div>

              {/* Family Section */}
              <div className="col-span-full border-b border-black/5 pb-4 pt-4"><h4 className="text-xs font-black uppercase tracking-widest text-primary">Family Details</h4></div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Father's Name</label>
                <input name="fatherName" defaultValue={editModal.user.family?.fatherName} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Mother's Name</label>
                <input name="motherName" defaultValue={editModal.user.family?.motherName} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Family Type</label>
                <input name="familyType" defaultValue={editModal.user.family?.familyBackground} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Hometown</label>
                <input name="motherHometown" defaultValue={editModal.user.family?.motherHometown} className={inputClass} />
              </div>

              {/* Address Section */}
              <div className="col-span-full border-b border-black/5 pb-4 pt-4"><h4 className="text-xs font-black uppercase tracking-widest text-primary">Current Address</h4></div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">City / Village</label>
                <input name="address_city" defaultValue={editModal.user.addresses?.[0]?.city} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">District</label>
                <input name="address_district" defaultValue={editModal.user.addresses?.[0]?.district} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">State</label>
                <input name="address_state" defaultValue={editModal.user.addresses?.[0]?.state} className={inputClass} />
              </div>

              {/* Astrology Section */}
              <div className="col-span-full border-b border-black/5 pb-4 pt-4"><h4 className="text-xs font-black uppercase tracking-widest text-primary">Astrology Details</h4></div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Birth Date</label>
                <input name="birthDate" type="date" defaultValue={editModal.user.profile?.birthDateTime ? new Date(editModal.user.profile.birthDateTime).toISOString().split('T')[0] : ''} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Birth Time</label>
                <input name="birthTime" type="time" defaultValue={editModal.user.profile?.birthDateTime ? new Date(editModal.user.profile.birthDateTime).toISOString().split('T')[1].substring(0, 5) : ''} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Birth Place</label>
                <input name="birthPlace" defaultValue={editModal.user.profile?.birthPlace} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Rashi</label>
                <input name="rashi" defaultValue={editModal.user.astrology?.rashi} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Gotra</label>
                <input name="gotra" defaultValue={editModal.user.astrology?.gothra} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Manglik</label>
                <select name="manglik" defaultValue={editModal.user.astrology?.mangal === 'Yes' ? 'Yes' : 'No'} className={inputClass}>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              <div className="col-span-full flex gap-4 mt-8">
                <button type="button" onClick={() => setEditModal({ isOpen: false, user: null })} className="flex-1 h-14 rounded-2xl font-black text-xs uppercase tracking-widest text-foreground/40 hover:bg-black/5 transition-all">Discard</button>
                <button type="submit" className="flex-2 px-12 h-14 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all">Save All Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl border border-black/10 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-2xl font-display font-black text-foreground mb-2">{confirmModal.title}</h3>
            <p className="text-sm font-medium text-foreground/50 leading-relaxed mb-8">{confirmModal.message}</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} className="flex-1 h-12 rounded-xl font-bold text-xs uppercase tracking-widest text-foreground/40 hover:bg-black/5 transition-all">Cancel</button>
              <button onClick={confirmModal.onConfirm} className="flex-1 h-12 bg-red-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
