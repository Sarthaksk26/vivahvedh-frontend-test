import React from 'react';
import { Shield, Users, UserPlus, Heart, CreditCard, Cake, Link2, TrendingUp, Inbox } from 'lucide-react';
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

  const sections: { title: string; items: Tab[] }[] = [
    {
      title: "Approvals & Inbox",
      items: [
        { id: 'pending', label: 'Pending Approvals', icon: <Users size={18} />, badge: notifications?.notifications?.pendingApprovals?.count || stats?.pendingApprovals || 0 },
        { id: 'payments', label: 'Plan Payments', icon: <CreditCard size={18} />, badge: notifications?.notifications?.pendingPayments?.count || stats?.pendingPayments || 0 },
        { id: 'enquiries', label: 'Inbox / Enquiries', icon: <Inbox size={18} />, badge: notifications?.notifications?.unresolvedEnquiries?.count || 0 },
      ]
    },
    {
      title: "Member Directory",
      items: [
        { id: 'all', label: 'All Members', icon: <Shield size={18} /> },
        { id: 'addProfile', label: 'Create Offline Profile', icon: <UserPlus size={18} /> },
        { id: 'connections', label: 'Connection Logs', icon: <Link2 size={18} /> },
      ]
    },
    {
      title: "Marketing & Growth",
      items: [
        { id: 'birthdays', label: 'Upcoming Birthdays', icon: <Cake size={18} />, badge: notifications?.notifications?.upcomingBirthdays?.count || 0 },
        { id: 'stories', label: 'Success Stories', icon: <Heart size={18} />, badge: notifications?.notifications?.pendingStories?.count || 0 },
        { id: 'profit', label: 'Profit Tracker', icon: <TrendingUp size={18} /> },
      ]
    }
  ];

  return (
    <aside className="w-full lg:w-72">
      <div className="bg-white rounded-[32px] p-6 shadow-ambient sticky top-28 border border-black/5 space-y-6">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-2">
            <h4 className="px-3 text-[10px] font-bold tracking-widest text-foreground/40 uppercase">
              {section.title}
            </h4>
            <nav className="space-y-1">
              {section.items.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-semibold tracking-wide
                    ${activeTab === tab.id 
                      ? 'bg-primary text-white shadow-premium' 
                      : 'text-foreground/50 hover:bg-[#F2F4F6] hover:text-foreground'}`}
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
        ))}
      </div>
    </aside>
  );
};
