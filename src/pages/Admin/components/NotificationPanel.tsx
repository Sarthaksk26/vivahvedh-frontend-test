import React from 'react';
import type { AdminNotifications, AdminTab } from '../adminTypes';

interface NotificationPanelProps {
  notifications: AdminNotifications | null;
  setActiveTab: (tab: AdminTab) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, setActiveTab }) => {
  if (!notifications || notifications.totalUnread === 0) return null;

  return (
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
          .filter(([, v]) => v.urgent || v.tab === 'birthdays')
          .map(([key, v]) => (
            <button
              key={key}
              onClick={() => setActiveTab(v.tab)}
              className={`p-4 border rounded-2xl text-left transition-colors group ${
                v.urgent ? 'bg-red-50 border-red-100 hover:bg-red-100' : 'bg-amber-50 border-amber-100 hover:bg-amber-100'
              }`}
            >
              <p className={`text-2xl font-display font-black ${v.urgent ? 'text-red-600' : 'text-amber-600'}`}>{v.count}</p>
              <p className={`text-[10px] font-bold uppercase tracking-wider mt-1 leading-tight ${v.urgent ? 'text-red-400' : 'text-amber-400'}`}>{v.label}</p>
            </button>
          ))}
      </div>
    </div>
  );
};
