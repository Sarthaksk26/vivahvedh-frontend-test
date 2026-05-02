import React from 'react';
import { Mail, Shield, Users, UserPlus, Heart, CreditCard, Cake, Link2, TrendingUp } from 'lucide-react';
import type { AdminTab, AdminNotifications } from '../adminTypes';

interface SidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  notifications: AdminNotifications | null;
  stats: Record<string, number> | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, notifications, stats }) => {
  interface Tab {
    id: AdminTab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }

  const tabs: Tab[] = [
    { id: 'pending', label: 'Approvals', icon: <Users size={18} />, badge: notifications?.notifications?.pendingApprovals?.count || stats?.pendingApprovals || 0 },
    { id: 'all', label: 'Community', icon: <Shield size={18} /> },
    { id: 'enquiries', label: 'Inbox', icon: <Mail size={18} />, badge: notifications?.notifications?.unresolvedEnquiries?.count || 0 },
    { id: 'birthdays', label: 'Birthdays', icon: <Cake size={18} />, badge: notifications?.notifications?.upcomingBirthdays?.count || 0 },
    { id: 'connections', label: 'Connections', icon: <Link2 size={18} /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard size={18} />, badge: notifications?.notifications?.pendingPayments?.count || stats?.pendingPayments || 0 },
    { id: 'addProfile', label: 'Add Profile', icon: <UserPlus size={18} /> },
    { id: 'stories', label: 'Stories', icon: <Heart size={18} />, badge: notifications?.notifications?.pendingStories?.count || 0 },
    { id: 'profit', label: 'Profit Tracker', icon: <TrendingUp size={18} /> },
  ];

  return (
    <aside className="w-full lg:w-72">
      <div className="bg-white rounded-[32px] p-6 shadow-ambient sticky top-28 border border-black/5">
        <nav className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
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
  );
};
