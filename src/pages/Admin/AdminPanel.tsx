import { useState, useEffect, useRef, useCallback } from 'react';
import apiClient from '../../lib/apiClient';
import { Mail, X as CloseIcon, TrendingUp, Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatApiError } from '../../lib/errorUtils';
import type { AdminTab, AdminUser, Enquiry, PaymentRecord, AdminNotifications } from './adminTypes';

// Extracted Components
import { StatSummary } from './components/StatSummary';
import { NotificationPanel } from './components/NotificationPanel';
import { Sidebar } from './components/Sidebar';
import { OfflineUserForm } from './components/OfflineUserForm';
import { EnquiryList } from './components/EnquiryList';
import { PaymentList } from './components/PaymentList';
import { BirthdayList } from './components/BirthdayList';
import { ConnectionList } from './components/ConnectionList';
import { StoryManager } from './components/StoryManager';
import { UserTable } from './components/UserTable';
import { FilterBar } from './components/FilterBar';
import { AdminProfilePreviewModal } from './components/AdminProfilePreviewModal';
import { AdminUserEditModal } from './components/AdminUserEditModal';
import { ReportList } from './components/ReportList';
import { AuditLogList } from './components/AuditLogList';

interface Story {
  id: string;
  groomName: string;
  brideName: string;
  message: string;
  photoUrl?: string;
}

interface BirthdayUser {
  id: string;
  firstName: string;
  lastName: string;
  regId: string;
  birthDate: string;
  daysUntil: number;
}

interface ConnectionLog {
  id: string;
  sender: AdminUser;
  receiver: AdminUser;
  status: string;
  createdAt: string;
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>('pending');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [birthdays, setBirthdays] = useState<BirthdayUser[]>([]);
  const [connections, setConnections] = useState<ConnectionLog[]>([]);
  const [profitData, setProfitData] = useState<Record<string, any> | null>(null);
  const [notifications, setNotifications] = useState<AdminNotifications | null>(null);
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [paymentFilter, setPaymentFilter] = useState('PENDING');
  const [connectionFilter, setConnectionFilter] = useState('ALL');
  const [allUsersFilters, setAllUsersFilters] = useState({ q: '', gender: '', ageMin: '', ageMax: '', accountStatus: '', page: 1 });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Enquiry Reply State
  const [replyModal, setReplyModal] = useState<{ isOpen: boolean; enquiryId: string | null; email: string; message: string }>({ isOpen: false, enquiryId: null, email: '', message: '' });
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  // Offline user creation state
  const [offlineForm, setOfflineForm] = useState({
    firstName: '', lastName: '', mobile: '', email: '',
    gender: '', maritalStatus: '', profileCreatedBy: 'Marriage Bureau',
    kycType: 'AADHAR', kycNumber: ''
  });
  const [offlineSubmitting, setOfflineSubmitting] = useState(false);
  const [offlineSuccess, setOfflineSuccess] = useState<{ regId: string; name: string; email: string; tempPassword?: string } | null>(null);
  const [offlineError, setOfflineError] = useState('');

  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void; loading?: boolean }>({ 
    isOpen: false, title: '', message: '', onConfirm: () => {} 
  });
  const [previewUser, setPreviewUser] = useState<AdminUser | null>(null);
  const [editModal, setEditModal] = useState<{ isOpen: boolean; user: AdminUser | null }>({ isOpen: false, user: null });
  const [resetPasswordModal, setResetPasswordModal] = useState<{ isOpen: boolean; user: AdminUser | null }>({ isOpen: false, user: null });
  const [tempPasswordDisplay, setTempPasswordDisplay] = useState<{ isOpen: boolean; password: string; regId: string; name: string } | null>(null);
  const [resettingPassword, setResettingPassword] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const response = await apiClient.get('/admin/stats');
      setStats(response.data);
    } catch (e: unknown) { console.error("Stats Fetch Error", e); }
  }, []);

  const fetchData = useCallback(async () => {
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
      } else if (['all', 'activeProfiles', 'paidProfiles', 'unpaidProfiles', 'deletedProfiles', 'incompleteProfiles'].includes(activeTab)) {
        const params = new URLSearchParams();
        if (allUsersFilters.q) params.append('q', allUsersFilters.q);
        if (allUsersFilters.gender) params.append('gender', allUsersFilters.gender);
        if (allUsersFilters.ageMin) params.append('ageMin', allUsersFilters.ageMin);
        if (allUsersFilters.ageMax) params.append('ageMax', allUsersFilters.ageMax);
        
        if (activeTab === 'activeProfiles') params.append('accountStatus', 'ACTIVE');
        else if (activeTab === 'deletedProfiles') params.append('accountStatus', 'DELETED');
        else if (activeTab === 'incompleteProfiles') params.append('accountStatus', 'INCOMPLETE');
        else if (allUsersFilters.accountStatus) params.append('accountStatus', allUsersFilters.accountStatus);

        if (activeTab === 'paidProfiles') params.append('planType', 'PAID');
        else if (activeTab === 'unpaidProfiles') params.append('planType', 'FREE');

        params.append('page', allUsersFilters.page.toString());
        const response = await apiClient.get(`/admin/all-users?${params.toString()}`);
        setUsers(response.data.users);
        setPagination(response.data.pagination);
      }
    } catch (error: unknown) {
      if ((error as { response?: { status?: number } })?.response?.status === 403) toast.error("ACCESS DENIED");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, paymentFilter, connectionFilter, allUsersFilters]);

  const handleAllUsersFiltersChange = useCallback((filters: typeof allUsersFilters) => {
    setAllUsersFilters({ ...filters, page: 1 });
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await apiClient.get('/admin/notifications');
        setNotifications(res.data);
      } catch (e: unknown) { console.error(e); }
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
  }, [activeTab, paymentFilter, connectionFilter, fetchStats, fetchData]);

  useEffect(() => {
    if (activeTab !== 'all') return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchData();
    }, 500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [allUsersFilters, activeTab, fetchData]);

  const handleReplyEnquiry = async () => {
    if (!replyModal.enquiryId || !replyText.trim()) return;
    setReplying(true);
    try {
      await apiClient.post('/admin/enquiries/reply', { enquiryId: replyModal.enquiryId, replyMessage: replyText });
      toast.success("Reply sent and enquiry resolved.");
      // Optimistic UI update
      setEnquiries(prev => prev.map(e => e.id === replyModal.enquiryId ? { ...e, isResolved: true } : e));
      setReplyModal({ isOpen: false, enquiryId: null, email: '', message: '' });
      setReplyText('');
    } catch (error: unknown) {
      toast.error(formatApiError(error, "Failed to send reply."));
    } finally {
      setReplying(false);
    }
  };

  const handleResolveEnquiry = async (enquiryId: string, isResolved: boolean) => {
    // Optimistic UI update — instant feedback
    setEnquiries(prev => prev.map(e => e.id === enquiryId ? { ...e, isResolved } : e));
    try {
      await apiClient.patch('/admin/enquiries/resolve', { enquiryId, isResolved });
      toast.success(isResolved ? "Marked as resolved" : "Marked as unresolved");
    } catch (error: unknown) {
      // Revert on failure
      setEnquiries(prev => prev.map(e => e.id === enquiryId ? { ...e, isResolved: !isResolved } : e));
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  const handleVerifyPayment = async (paymentId: string, status: 'APPROVED' | 'REJECTED') => {
    // Optimistic UI update
    setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status } : p));
    try {
      await apiClient.patch(`/payments/admin/verify/${paymentId}`, { status });
      toast.success(`Payment ${status.toLowerCase()} successfully.`);
      fetchStats();
    } catch (error: unknown) {
      // Revert on failure
      setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'PENDING' } : p));
      toast.error(formatApiError(error, "Failed to verify payment."));
    }
  };

  const handleAction = useCallback(async (action: 'approve' | 'ban' | 'unban' | 'delete', userId: string) => {
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
          } catch (e: unknown) { toast.error(formatApiError(e, "Delete failed")); }
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
            toast.success('User approved. Approval email sent.');
            setConfirmModal(prev => ({ ...prev, isOpen: false }));
            fetchData();
            fetchStats();
          } catch (e: unknown) {
            toast.error(formatApiError(e, 'Approval failed'));
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
    } catch (error: unknown) {
      toast.error(formatApiError(error, `Failed to ${action} user.`));
    }
  }, [fetchData, fetchStats]);



  const handleSetPlan = useCallback(async (userId: string, planType: string) => {
    try {
      // Duration is hardcoded server-side (12 months for both SILVER and GOLD)
      await apiClient.post('/admin/set-plan', { targetUserId: userId, planType });
      toast.success(`Plan updated to ${planType} (12 months)`);
      fetchData();
      fetchStats();
    } catch (error: unknown) {
      console.error(error);
      toast.error("Failed to update plan");
    }
  }, [fetchData, fetchStats]);

  const handleToggleKyc = useCallback(async (userId: string, currentStatus: boolean) => {
    try {
      const response = await apiClient.patch(`/admin/users/${userId}/kyc`, { kycVerified: !currentStatus });
      toast.success(response.data.message || 'KYC status updated.');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update KYC status.');
    }
  }, [fetchData]);

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
        email: offlineForm.email,
        tempPassword: response.data.tempPassword
      });
      setOfflineForm({
        firstName: '', lastName: '', mobile: '', email: '',
        gender: '', maritalStatus: '', profileCreatedBy: 'Marriage Bureau', kycType: 'AADHAR', kycNumber: ''
      });
    } catch (error: unknown) {
      const msg = (error as { response?: { data?: { error?: unknown } } })?.response?.data?.error;
      setOfflineError(typeof msg === 'string' ? msg : 'Failed to create user. Please check all fields.');
    } finally {
      setOfflineSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F7F9FB] min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 pt-8">
          <div className="max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-3 block">Admin Dashboard</span>
            <h1 className="display-md text-foreground">Admin Dashboard.</h1>
            <p className="text-foreground/60 mt-4 font-medium leading-relaxed">Oversee the platform's integrity, manage premium members, and respond to community enquiries.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={async () => {
                const email = prompt('Enter email address to test:');
                if (!email) return;
                try {
                  await apiClient.post('/admin/test-email', { email });
                  toast.success('Test email sent!');
                } catch (err: unknown) { toast.error('Email test failed'); }
              }}
              className="px-4 py-2 text-xs font-bold border border-black/10 rounded-xl hover:bg-muted transition text-foreground/60"
            >
              📧 Test Email
            </button>
            <div className="px-6 py-3 bg-white shadow-ambient rounded-2xl flex items-center gap-3 border border-black/5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium uppercase tracking-wide text-foreground/60">System Status Active</span>
            </div>
          </div>
        </div>

        <StatSummary stats={stats} />
        <NotificationPanel notifications={notifications} setActiveTab={setActiveTab} />

        <div className="flex flex-col lg:flex-row gap-12">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} notifications={notifications} stats={stats} />

          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-[40px] shadow-ambient overflow-hidden border border-black/5">
              <div className="px-10 py-8 bg-[#F7F9FB]/50 border-b border-black/5 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-foreground tracking-wide">
                  {activeTab === 'pending' ? 'Pending Approvals' : 
                   activeTab === 'all' ? 'All Members' : 
                   activeTab === 'addProfile' ? 'Onboard Offline Customer' : 
                   activeTab === 'stories' ? 'Stories Manager' : 
                   activeTab === 'payments' ? 'Payment Approvals' :
                   activeTab === 'enquiries' ? 'Enquiries & Support' :
                   activeTab === 'birthdays' ? 'Birthday Wishes' :
                   activeTab === 'connections' ? 'Connection Logs' :
                   activeTab === 'profit' ? 'Revenue Analytics' :
                   activeTab === 'auditLogs' ? 'Audit Logs' :
                   ['activeProfiles', 'paidProfiles', 'unpaidProfiles', 'deletedProfiles', 'incompleteProfiles'].includes(activeTab) ? 'Profile Directory' :
                   'Dashboard'}
                </h2>
              </div>

              <div className="min-h-[500px]">
                {loading && activeTab !== 'addProfile' ? (
                  <div className="p-20 flex flex-col items-center justify-center grayscale opacity-20">
                     <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin mb-6" />
                     <p className="font-semibold text-xs tracking-wide text-foreground">Loading Data...</p>
                  </div>
                ) : (
                  <>
                    {activeTab === 'addProfile' && (
                      <OfflineUserForm 
                        offlineForm={offlineForm} 
                        handleOfflineFormChange={handleOfflineFormChange} 
                        handleOfflineSubmit={handleOfflineSubmit} 
                        offlineSubmitting={offlineSubmitting} 
                        offlineSuccess={offlineSuccess} 
                        offlineError={offlineError} 
                      />
                    )}
                    {activeTab === 'enquiries' && (
                      <EnquiryList 
                        enquiries={enquiries} 
                        setReplyModal={(m: any) => setReplyModal(m)} 
                        handleResolveEnquiry={handleResolveEnquiry} 
                      />
                    )}
                    {activeTab === 'payments' && (
                      <PaymentList 
                        payments={payments} 
                        paymentFilter={paymentFilter} 
                        setPaymentFilter={setPaymentFilter} 
                        handleVerifyPayment={handleVerifyPayment} 
                      />
                    )}
                    {activeTab === 'birthdays' && (
                      <BirthdayList 
                        birthdays={birthdays} 
                        fetchData={fetchData} 
                      />
                    )}
                    {activeTab === 'connections' && (
                      <ConnectionList 
                        connections={connections} 
                        connectionFilter={connectionFilter} 
                        setConnectionFilter={setConnectionFilter} 
                      />
                    )}
                    {activeTab === 'stories' && (
                      <StoryManager 
                        stories={stories} 
                        fetchData={fetchData} 
                      />
                    )}
                    {activeTab === 'profit' && (
                      <div className="p-10">
                        <div className="flex items-center gap-4 mb-8">
                          <div className="w-12 h-12 bg-green-500/10 text-green-600 rounded-2xl flex items-center justify-center">
                            <TrendingUp size={24} />
                          </div>
                          <div>
                            <h3 className="text-xl font-display font-black text-foreground">Revenue Analytics (उत्पन्न आणि माहिती)</h3>
                            <p className="text-sm text-foreground/60 font-medium">Tracking platform growth and subscription performance.</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="p-6 bg-[#F7F9FB] rounded-3xl border border-black/5">
                            <p className="text-xs font-medium text-foreground/50 mb-1">Total Revenue (एकूण उत्पन्न)</p>
                            <p className="text-3xl font-display font-black text-foreground">₹{profitData?.totalRevenue || 0}</p>
                          </div>
                          <div className="p-6 bg-[#F7F9FB] rounded-3xl border border-black/5">
                            <p className="text-xs font-medium text-foreground/50 mb-1">Subscriptions (एकूण सबस्क्रिप्शन्स)</p>
                            <p className="text-3xl font-display font-black text-foreground">{profitData?.subscriptionCount || 0}</p>
                          </div>
                          <div className="p-6 bg-[#F7F9FB] rounded-3xl border border-black/5">
                            <p className="text-xs font-medium text-foreground/50 mb-1">Avg Order (सरासरी पेमेंट)</p>
                            <p className="text-3xl font-display font-black text-foreground">₹{Math.round(profitData?.avgOrderValue || 0)}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {activeTab === 'reports' && (
                      <ReportList />
                    )}
                    {activeTab === 'auditLogs' && (
                      <AuditLogList />
                    )}
                    {(['pending', 'all', 'activeProfiles', 'paidProfiles', 'unpaidProfiles', 'deletedProfiles', 'incompleteProfiles'].includes(activeTab)) && (
                      <>
                        {activeTab === 'all' && <FilterBar filters={allUsersFilters} setFilters={handleAllUsersFiltersChange} />}
                        <UserTable
                          users={users}
                          loading={loading}
                          handleAction={handleAction}
                          handleSetPlan={handleSetPlan}
                          handleToggleKyc={handleToggleKyc}
                          setEditModal={setEditModal}
                          onView={(u) => setPreviewUser(u)}
                          onResetPassword={(u) => setResetPasswordModal({ isOpen: true, user: u })}
                        />
                        {activeTab === 'all' && pagination.totalPages > 1 && (
                          <div className="flex items-center justify-center gap-6 px-10 py-6 border-t border-black/5">
                            <button
                              onClick={() => setAllUsersFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                              disabled={allUsersFilters.page <= 1}
                              className="px-6 h-10 rounded-xl border border-black/10 text-xs font-semibold text-foreground/70 hover:bg-black/5 disabled:opacity-30 disabled:pointer-events-none transition-all"
                            >
                              Previous
                            </button>
                            <span className="text-xs font-bold text-foreground/40 tracking-wider">
                              Page {pagination.page} of {pagination.totalPages}
                            </span>
                            <button
                              onClick={() => setAllUsersFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                              disabled={allUsersFilters.page >= pagination.totalPages}
                              className="px-6 h-10 rounded-xl border border-black/10 text-xs font-semibold text-foreground/70 hover:bg-black/5 disabled:opacity-30 disabled:pointer-events-none transition-all"
                            >
                              Next
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[32px] p-10 max-w-md w-full shadow-2xl border border-black/10">
            <h3 className="text-2xl font-display font-black text-foreground mb-4">{confirmModal.title}</h3>
            <p className="text-foreground/60 font-medium leading-relaxed mb-8">{confirmModal.message}</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} 
                className="flex-1 h-14 rounded-2xl font-display font-black text-xs uppercase tracking-widest text-foreground/60 hover:bg-black/5 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={confirmModal.onConfirm} 
                className="flex-1 h-14 bg-primary text-white rounded-2xl font-display font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {replyModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl border border-black/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-foreground">Reply to Enquiry</h3>
              <button onClick={() => setReplyModal({ isOpen: false, enquiryId: null, email: '', message: '' })} className="p-2 text-foreground/60 hover:text-foreground bg-black/5 rounded-full"><CloseIcon size={16} /></button>
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

      {/* Profile Preview Modal */}
      {previewUser && (
        <AdminProfilePreviewModal 
          user={previewUser} 
          onClose={() => setPreviewUser(null)} 
        />
      )}

      {/* Edit User Modal */}
      {editModal.isOpen && editModal.user && (
        <AdminUserEditModal 
          user={editModal.user} 
          onClose={() => setEditModal({ isOpen: false, user: null })} 
          onUpdateSuccess={() => {
            fetchData();
          }}
        />
      )}

      {/* Reset Password Confirmation Modal */}
      {resetPasswordModal.isOpen && resetPasswordModal.user && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[32px] p-10 max-w-md w-full shadow-2xl border border-black/10">
            <h3 className="text-2xl font-display font-black text-foreground mb-4">Reset Password</h3>
            <p className="text-foreground/60 font-medium leading-relaxed mb-8">
              Generate a new temporary password for <strong>{resetPasswordModal.user.profile?.firstName} {resetPasswordModal.user.profile?.lastName}</strong> ({resetPasswordModal.user.regId})?
              <br /><br />
              They can change it later if they prefer. This will also log them out of all current sessions.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setResetPasswordModal({ isOpen: false, user: null })} 
                className="flex-1 h-14 rounded-2xl font-display font-black text-xs uppercase tracking-widest text-foreground/60 hover:bg-black/5 transition-all"
                disabled={resettingPassword}
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  setResettingPassword(true);
                  try {
                    const res = await apiClient.post(`/admin/users/${resetPasswordModal.user?.id}/reset-password`);
                    setTempPasswordDisplay({
                      isOpen: true,
                      password: res.data.tempPassword,
                      regId: resetPasswordModal.user?.regId || '',
                      name: `${resetPasswordModal.user?.profile?.firstName} ${resetPasswordModal.user?.profile?.lastName}`
                    });
                    setResetPasswordModal({ isOpen: false, user: null });
                  } catch (e: unknown) {
                    toast.error(formatApiError(e, "Failed to reset password"));
                  } finally {
                    setResettingPassword(false);
                  }
                }} 
                className="flex-1 h-14 bg-primary text-white rounded-2xl font-display font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                disabled={resettingPassword}
              >
                {resettingPassword ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Temp Password Display Modal */}
      {tempPasswordDisplay?.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[32px] p-10 max-w-md w-full shadow-2xl border border-black/10">
            <h3 className="text-2xl font-display font-black text-green-700 mb-2">Password Reset Successful</h3>
            <p className="text-foreground/60 font-medium leading-relaxed mb-6">
              A temporary password has been generated for <strong>{tempPasswordDisplay.name}</strong> ({tempPasswordDisplay.regId}).
            </p>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center justify-between mb-6">
              <div>
                <span className="block text-xs font-bold text-green-700 uppercase tracking-widest mb-1">Temporary Password</span>
                <span className="font-mono text-xl font-black text-green-900">{tempPasswordDisplay.password}</span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(tempPasswordDisplay.password);
                  toast.success('Password copied to clipboard');
                }}
                className="p-3 bg-white text-green-700 hover:bg-green-100 rounded-xl transition-colors shadow-sm"
                title="Copy Password"
              >
                <Copy size={20} />
              </button>
            </div>
            
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl mb-8">
              <p className="text-amber-800 text-sm font-bold">
                ⚠️ This password will NOT be shown again. Please copy and communicate it to the user now.
              </p>
            </div>
            
            <button 
              onClick={() => setTempPasswordDisplay(null)} 
              className="w-full h-14 bg-black text-white rounded-2xl font-display font-black text-xs uppercase tracking-widest hover:bg-black/80 transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
