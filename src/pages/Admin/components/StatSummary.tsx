import React from 'react';

interface StatItem {
  label: string;
  value: number;
  color: string;
  bg: string;
}

interface StatSummaryProps {
  stats: Record<string, number> | null;
}

export const StatSummary: React.FC<StatSummaryProps> = ({ stats }) => {
  const statItems: StatItem[] = [
    { label: 'Total Users', value: stats?.totalUsers || 0, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active', value: stats?.activeUsers || 0, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pending', value: stats?.pendingApprovals || 0, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Payments', value: stats?.pendingPayments || 0, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Connections', value: stats?.totalConnections || 0, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'New This Month', value: stats?.thisMonthRegs || 0, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
      {statItems.map((s, i) => (
        <div key={i} className={`${s.bg} p-6 rounded-[24px] border border-black/5 shadow-sm`}>
          <p className="text-[10px] font-black uppercase tracking-widest text-foreground/60 mb-2">{s.label}</p>
          <p className={`text-2xl font-display font-black ${s.color}`}>{s.value}</p>
        </div>
      ))}
    </div>
  );
};
