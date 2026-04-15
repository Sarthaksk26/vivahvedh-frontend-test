import { useState, useEffect } from 'react';
import apiClient from '../../lib/apiClient';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'pending' | 'all' | 'enquiries' | 'payments'>('pending');
  const [users, setUsers] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'enquiries') {
        const response = await apiClient.get('/admin/enquiries');
        setEnquiries(response.data);
      } else if (activeTab === 'payments') {
        const response = await apiClient.get('/payments/admin/pending');
        setPayments(response.data);
      } else {
        const endpoint = activeTab === 'pending' ? '/admin/pending' : '/admin/all-users';
        const response = await apiClient.get(endpoint);
        setUsers(response.data);
      }
    } catch (error: any) {
      if (error.response?.status === 403) alert("ACCESS DENIED: You are not an Admin!");
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
      alert(`Payment ${status.toLowerCase()} successfully.`);
      fetchData();
    } catch (error) {
      alert(`Failed to ${status.toLowerCase()} payment.`);
      console.error(error);
    }
  };

  const handleAction = async (action: 'approve' | 'ban' | 'delete', userId: string) => {
    if (action === 'delete') {
      if (!confirm("WARNING: This will permanently delete the user. Proceed?")) return;
    }

    try {
      if (action === 'approve') await apiClient.post('/admin/approve', { targetUserId: userId });
      if (action === 'ban') await apiClient.post('/admin/ban', { targetUserId: userId });
      if (action === 'delete') await apiClient.delete(`/admin/delete/${userId}`);

      alert(`User ${action} action executed successfully.`);
      fetchData();
    } catch (error) {
      alert(`Failed to ${action} user.`);
      console.error(error);
    }
  };

  const handleSetPlan = async (userId: string, planType: string) => {
    const durationMonths = planType === 'SILVER' ? 6 : planType === 'GOLD' ? 12 : 0;
    try {
      await apiClient.post('/admin/set-plan', { targetUserId: userId, planType, durationMonths });
      alert(`Plan set to ${planType} successfully.`);
      fetchData();
    } catch (error) {
      alert('Failed to set plan.');
      console.error(error);
    }
  };

  const planBadge = (plan: string) => {
    const colors: Record<string, string> = {
      FREE: 'bg-gray-100 text-gray-600 border-gray-200',
      SILVER: 'bg-slate-200 text-slate-700 border-slate-300',
      GOLD: 'bg-amber-100 text-amber-700 border-amber-300',
    };
    return colors[plan] || colors.FREE;
  };

  return (
    <div className="max-w-7xl w-full mx-auto p-4 md:p-8 min-h-[80vh] flex flex-col gap-6">

      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-red-600">Admin Console</h1>
          <p className="text-muted-foreground">Manage users, approvals, plans, and enquiries.</p>
        </div>
        <div className="px-4 py-2 bg-red-100 text-red-800 font-bold rounded-lg border border-red-200 shadow-sm">
          Admin Access
        </div>
      </div>

      <div className="flex gap-8 items-start flex-col md:flex-row">

        {/* Sidebar Tabs */}
        <aside className="w-full md:w-64 flex flex-col gap-2 p-6 bg-card rounded-2xl shadow-sm border md:sticky md:top-28">
          <nav className="flex flex-col gap-1">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-3 text-left rounded-md transition-colors text-sm ${activeTab === 'pending' ? 'bg-red-600/10 text-red-600 font-bold border border-red-600/20' : 'hover:bg-muted font-medium text-muted-foreground'}`}
            >
              Pending Approvals
              {activeTab === 'pending' && <span className="ml-2 px-2 py-0.5 bg-red-600 text-white rounded-full text-xs">{users.length}</span>}
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-3 text-left rounded-md transition-colors text-sm ${activeTab === 'all' ? 'bg-primary/10 text-primary font-bold border border-primary/20' : 'hover:bg-muted font-medium text-muted-foreground'}`}
            >
              All Users
            </button>
            <button
              onClick={() => setActiveTab('enquiries')}
              className={`px-4 py-3 text-left rounded-md transition-colors text-sm ${activeTab === 'enquiries' ? 'bg-amber-100 text-amber-800 font-bold border border-amber-300' : 'hover:bg-muted font-medium text-muted-foreground'}`}
            >
              Contact Enquiries
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-4 py-3 text-left rounded-md transition-colors text-sm ${activeTab === 'payments' ? 'bg-green-100 text-green-700 font-bold border border-green-300' : 'hover:bg-muted font-medium text-muted-foreground'}`}
            >
              Payment Verifications
              {payments.length > 0 && activeTab === 'payments' && <span className="ml-2 px-2 py-0.5 bg-green-600 text-white rounded-full text-xs">{payments.length}</span>}
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 bg-card border shadow-xl rounded-2xl overflow-hidden w-full">
          <div className="bg-muted/50 px-6 py-4 border-b">
            <h2 className="font-bold text-lg">
              {activeTab === 'pending' ? 'Users Awaiting Approval' : activeTab === 'all' ? 'All Users' : activeTab === 'payments' ? 'Payment Verifications' : 'Support Inbox'}
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center animate-pulse font-medium text-muted-foreground">Loading...</div>
          ) : activeTab === 'payments' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-muted text-muted-foreground text-sm border-b">
                  <tr>
                    <th className="p-4 font-semibold">User</th>
                    <th className="p-4 font-semibold">Plan</th>
                    <th className="p-4 font-semibold">Amount</th>
                    <th className="p-4 font-semibold">TxID</th>
                    <th className="p-4 font-semibold">Proof</th>
                    <th className="p-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-muted-foreground">No pending payments found.</td>
                    </tr>
                  ) : (
                    payments.map((pay) => (
                      <tr key={pay.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-4">
                          <div className="font-bold">{pay.user.regId}</div>
                          <div className="text-xs text-muted-foreground">{pay.user.mobile}</div>
                        </td>
                        <td className="p-4 font-medium">{pay.planType}</td>
                        <td className="p-4 font-bold">₹{pay.amount}</td>
                        <td className="p-4 font-mono text-xs">{pay.transactionId}</td>
                        <td className="p-4">
                          <a
                            href={`/uploads/${pay.screenshotUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary underline font-medium"
                          >
                            View Proof
                          </a>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handlePaymentVerify(pay.id, 'APPROVED')}
                              className="px-3 py-1.5 bg-green-600 text-white rounded-md font-bold text-xs hover:bg-green-700 transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handlePaymentVerify(pay.id, 'REJECTED')}
                              className="px-3 py-1.5 bg-red-600 text-white rounded-md font-bold text-xs hover:bg-red-700 transition"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'enquiries' ? (
            <div className="divide-y max-h-[80vh] overflow-y-auto">
              {enquiries.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">No enquiries received yet.</div>
              ) : (
                enquiries.map((enq) => (
                  <div key={enq.id} className="p-6 hover:bg-muted/30 transition">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{enq.firstName} {enq.lastName}</h3>
                        <p className="text-sm font-semibold text-primary">{enq.email} | {enq.mobile}</p>
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">{new Date(enq.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="bg-muted p-4 rounded-xl mt-3 text-sm text-foreground/80 leading-relaxed">
                      {enq.message}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-2">
              <span className="text-4xl">✅</span>
              <span className="font-medium">No users found in this section.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted text-muted-foreground text-sm border-b">
                    <th className="p-4 font-semibold whitespace-nowrap">Reg ID</th>
                    <th className="p-4 font-semibold whitespace-nowrap">Name</th>
                    <th className="p-4 font-semibold whitespace-nowrap">Status</th>
                    <th className="p-4 font-semibold whitespace-nowrap">Plan</th>
                    <th className="p-4 font-semibold whitespace-nowrap">Contact</th>
                    <th className="p-4 text-right font-semibold whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 whitespace-nowrap text-primary font-bold">{user.regId}</td>
                      <td className="p-4 font-medium whitespace-nowrap">{user.profile?.firstName} {user.profile?.lastName}</td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full border text-xs font-bold ${user.accountStatus === 'ACTIVE' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                          {user.accountStatus}
                        </span>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full border text-xs font-bold ${planBadge(user.planType)}`}>
                          {user.planType || 'FREE'}
                        </span>
                      </td>
                      <td className="p-4 whitespace-nowrap text-muted-foreground text-xs">{user.mobile}<br/>{user.email || ''}</td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex justify-end gap-2 flex-wrap">
                          {activeTab === 'pending' && (
                            <button onClick={() => handleAction('approve', user.id)} className="px-3 py-1.5 bg-green-600 text-white rounded-md font-bold text-xs hover:bg-green-700 transition">
                              Approve
                            </button>
                          )}

                          {activeTab === 'all' && user.accountStatus === 'ACTIVE' && (
                            <button onClick={() => handleAction('ban', user.id)} className="px-3 py-1.5 bg-amber-600 text-white rounded-md font-bold text-xs hover:bg-amber-700 transition">
                              Ban
                            </button>
                          )}

                          {/* Plan Assignment Dropdown */}
                          {activeTab === 'all' && (
                            <select
                              value={user.planType || 'FREE'}
                              onChange={(e) => handleSetPlan(user.id, e.target.value)}
                              className="px-2 py-1.5 border rounded-md text-xs font-bold bg-background"
                            >
                              <option value="FREE">Free</option>
                              <option value="SILVER">Silver</option>
                              <option value="GOLD">Gold</option>
                            </select>
                          )}

                          <button onClick={() => handleAction('delete', user.id)} className="px-3 py-1.5 bg-red-600 text-white rounded-md font-bold text-xs hover:bg-red-700 transition">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
