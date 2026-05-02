import React from 'react';
import type { AdminUser } from '../adminTypes';

interface ConnectionLog {
  id: string;
  sender: AdminUser;
  receiver: AdminUser;
  status: string;
  createdAt: string;
}

interface ConnectionListProps {
  connections: ConnectionLog[];
  connectionFilter: string;
  setConnectionFilter: (filter: string) => void;
}

export const ConnectionList: React.FC<ConnectionListProps> = ({ 
  connections, 
  connectionFilter, 
  setConnectionFilter 
}) => {
  return (
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
              connections.map((c) => (
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
  );
};
