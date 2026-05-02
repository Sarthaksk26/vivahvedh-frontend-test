import React, { useState, useEffect } from 'react';
import { Cake, Mail, X, Loader2, Calendar } from 'lucide-react';
import apiClient from '../../../lib/apiClient';
import toast from 'react-hot-toast';

interface BirthdayUser {
  id: string;
  firstName: string;
  lastName: string;
  regId: string;
  birthDate: string;
  daysUntil: number;
}

interface BirthdayWishLog {
  id: string;
  emailSentTo: string;
  message: string;
  createdAt: string;
  user: {
    profile: {
      firstName: string;
      lastName: string;
    }
  }
}

interface BirthdayListProps {
  birthdays: BirthdayUser[];
  fetchData: () => void;
}

export const BirthdayList: React.FC<BirthdayListProps> = React.memo(({ birthdays, fetchData }) => {
  const [view, setView] = useState<'upcoming' | 'history'>('upcoming');
  const [logs, setLogs] = useState<BirthdayWishLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [previewModal, setPreviewModal] = useState<{ isOpen: boolean; userId: string | null; name: string; email: string; message: string }>({
    isOpen: false, userId: null, name: '', email: '', message: ''
  });
  const [sending, setSending] = useState(false);

  const fetchLogs = async () => {
    setLoadingLogs(true);
    try {
      const { data } = await apiClient.get('/admin/birthdays/logs');
      setLogs(data);
    } catch (e) {
      toast.error("Failed to fetch wish history");
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    if (view === 'history') fetchLogs();
  }, [view]);

  const handleOpenPreview = async (id: string) => {
    try {
      const { data } = await apiClient.get(`/admin/birthdays/preview/${id}`);
      setPreviewModal({
        isOpen: true,
        userId: id,
        name: data.name,
        email: data.email,
        message: data.defaultMessage
      });
    } catch (e) {
      toast.error("Failed to load preview");
    }
  };

  const handleSendFinalWish = async () => {
    if (!previewModal.userId) return;
    setSending(true);
    try {
      await apiClient.post(`/admin/birthdays/send-wishes/${previewModal.userId}`, {
        message: previewModal.message
      });
      toast.success(`Birthday wish sent to ${previewModal.name}!`);
      setPreviewModal(prev => ({ ...prev, isOpen: false }));
      fetchData();
    } catch (e) {
      toast.error("Failed to send wishes");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Tabs */}
      <div className="px-10 py-6 border-b border-black/5 flex gap-8">
        <button 
          onClick={() => setView('upcoming')}
          className={`pb-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${view === 'upcoming' ? 'text-primary border-primary' : 'text-foreground/30 border-transparent hover:text-foreground/60'}`}
        >
          Upcoming Birthdays
        </button>
        <button 
          onClick={() => setView('history')}
          className={`pb-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${view === 'history' ? 'text-primary border-primary' : 'text-foreground/30 border-transparent hover:text-foreground/60'}`}
        >
          Sent History
        </button>
      </div>

      <div className="overflow-x-auto">
        {view === 'upcoming' ? (
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
                birthdays.map((b) => (
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
                        onClick={() => handleOpenPreview(b.id)} 
                        className="px-4 py-2 bg-primary text-white shadow-lg shadow-primary/20 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 ml-auto transition-all hover:scale-105 active:scale-95"
                      >
                        <Cake size={14} /> 
                        Send Wish
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-[#F2F4F6] text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">
              <tr>
                <th className="px-10 py-5">Recipient</th>
                <th className="px-8 py-5">Email</th>
                <th className="px-8 py-5">Sent At</th>
                <th className="px-10 py-5">Message Preview</th>
              </tr>
            </thead>
            <tbody>
              {loadingLogs ? (
                <tr><td colSpan={4} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-primary" /></td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={4} className="p-20 text-center text-foreground/20 font-medium">No history found.</td></tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-b border-black/[0.03] hover:bg-[#F7F9FB] transition-colors">
                    <td className="px-10 py-6">
                      <div className="font-bold text-foreground">{log.user?.profile?.firstName} {log.user?.profile?.lastName}</div>
                    </td>
                    <td className="px-8 py-6 text-sm text-foreground/60 font-medium">{log.emailSentTo}</td>
                    <td className="px-8 py-6 text-sm text-foreground/40">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="px-10 py-6">
                      <div className="text-xs text-foreground/50 truncate max-w-[200px] italic">"{log.message}"</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Birthday Preview Modal */}
      {previewModal.isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[40px] p-10 max-w-2xl w-full shadow-2xl border border-black/10 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center shadow-inner">
                  <Cake size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-black text-foreground">Birthday Preview</h3>
                  <p className="text-sm text-foreground/40 font-medium">Personalize your message for {previewModal.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setPreviewModal(prev => ({ ...prev, isOpen: false }))}
                className="p-3 text-foreground/20 hover:text-foreground bg-black/5 rounded-2xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary bg-primary/5 w-fit px-4 py-2 rounded-full">
                <Mail size={12} /> Sending to: {previewModal.email}
              </div>

              <div className="relative">
                <textarea
                  value={previewModal.message}
                  onChange={(e) => setPreviewModal(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full min-h-[200px] p-6 bg-[#F9FBFC] border border-black/5 rounded-[24px] focus:ring-4 focus:ring-primary/10 focus:border-primary/30 text-base leading-relaxed transition-all resize-none font-medium"
                  placeholder="Type a special birthday message..."
                />
                <div className="absolute top-4 right-4 opacity-10">
                  <Calendar size={48} />
                </div>
              </div>

              <div className="bg-amber-50 rounded-2xl p-4 flex gap-3 border border-amber-100">
                <div className="text-amber-500 pt-0.5">⚠️</div>
                <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
                  This message will be wrapped in a premium HTML template. Use plain text here; formatting (like bold/italic) is handled by the system.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setPreviewModal(prev => ({ ...prev, isOpen: false }))}
                  className="flex-1 h-14 rounded-2xl font-display font-black text-xs uppercase tracking-widest text-foreground/40 hover:bg-black/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSendFinalWish}
                  disabled={sending || !previewModal.message.trim()}
                  className="flex-[2] h-14 bg-rose-500 text-white rounded-2xl font-display font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-500/20 hover:bg-rose-600 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {sending ? <Loader2 className="animate-spin" size={18} /> : <Mail size={18} />}
                  Dispatch Birthday Wish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
