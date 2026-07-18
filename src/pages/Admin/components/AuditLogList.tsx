import React, { useEffect, useState } from 'react';
import apiClient from '../../../lib/apiClient';

interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  targetUserId: string;
  targetUserName: string;
  action: string;
  details: string;
  createdAt: string;
}

export const AuditLogList: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await apiClient.get('/admin/audit-logs');
        setLogs(res.data);
      } catch (err) {
        console.error('Failed to fetch audit logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center grayscale opacity-20">
         <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin mb-6" />
         <p className="font-semibold text-xs tracking-wide text-foreground">Loading Logs...</p>
      </div>
    );
  }

  if (logs.length === 0) {
    return <div className="p-20 text-center text-foreground/20 font-medium">No audit logs found.</div>;
  }

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true
    }).format(d);
  };

  return (
    <div className="overflow-x-auto p-4">
      <table className="w-full text-left">
        <thead className="bg-[#F2F4F6] text-xs font-semibold text-foreground/50 border-b border-black/5">
          <tr>
            <th className="px-6 py-4">Date & Time</th>
            <th className="px-6 py-4">Admin</th>
            <th className="px-6 py-4">Action</th>
            <th className="px-6 py-4">Target User</th>
            <th className="px-6 py-4">Details</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/[0.03]">
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-[#F7F9FB] transition-colors">
              <td className="px-6 py-4 text-xs font-medium text-foreground/70">
                {formatDate(log.createdAt)}
              </td>
              <td className="px-6 py-4 text-sm font-semibold">{log.adminName}</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-primary/10 text-primary">
                  {log.action}
                </span>
              </td>
              <td className="px-6 py-4 text-sm font-medium">{log.targetUserName}</td>
              <td className="px-6 py-4 text-xs text-foreground/60">{log.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
