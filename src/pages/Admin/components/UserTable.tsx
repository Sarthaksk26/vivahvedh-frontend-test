import React from 'react';
import { Trash2, Check, Shield, ShieldOff, Edit } from 'lucide-react';
import { resolveImageUrl, DEFAULT_USER_AVATAR } from '../../../lib/url';
import type { AdminUser } from '../adminTypes';

interface UserTableProps {
  users: AdminUser[];
  loading: boolean;
  handleAction: (action: 'approve' | 'ban' | 'unban' | 'delete', id: string) => void;
  handleSetPlan: (id: string, plan: string) => void;
  setEditModal: (modal: { isOpen: boolean; user: AdminUser }) => void;
  onView: (user: AdminUser) => void;
}

export const UserTable: React.FC<UserTableProps> = React.memo(({ 
  users, 
  loading, 
  handleAction, 
  handleSetPlan, 
  setEditModal,
  onView
}) => {
  if (loading) return null; // Handled in parent

  if (!users?.length) {
    return <div className="p-20 text-center text-foreground/20 font-medium">No citizens found in this segment.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-[#F2F4F6] text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">
          <tr>
            <th className="px-10 py-5">Profile</th>
            <th className="px-8 py-5">Status</th>
            <th className="px-8 py-5">Plan</th>
            <th className="px-10 py-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/[0.03]">
          {users?.map((user) => (
            <tr key={user.id} className="hover:bg-[#F7F9FB] transition-colors group">
              <td className="px-10 py-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-black/5 overflow-hidden border border-black/5 flex-shrink-0">
                    <img 
                      src={resolveImageUrl((user as any).images?.[0]?.url || '')} 
                      className="w-full h-full object-cover" 
                      alt="Avatar"
                      onError={(e) => (e.currentTarget.src = DEFAULT_USER_AVATAR)}
                    />
                  </div>
                  <div>
                    <div className="font-display font-black text-foreground flex items-center gap-2">
                      {user.profile?.firstName} {user.profile?.middleName ? `${user.profile.middleName} ` : ''}{user.profile?.lastName}
                      <button 
                        onClick={() => onView(user)} 
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-black uppercase tracking-widest text-primary ml-2 hover:underline"
                        title="View Full Profile"
                      >
                        View Profile
                      </button>
                    </div>
                    <div className="text-[10px] font-bold text-primary uppercase tracking-widest">{user.regId}</div>
                  </div>
                </div>
              </td>
              <td className="px-8 py-6">
                <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest
                  ${user.accountStatus === 'ACTIVE' ? 'bg-green-50 text-green-700' : 
                    user.accountStatus === 'SUSPENDED' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
                  {user.accountStatus}
                </span>
              </td>
              <td className="px-8 py-6">
                <select 
                  value={user.planType} 
                  onChange={(e) => handleSetPlan(user.id, e.target.value)}
                  className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-foreground/40 cursor-pointer focus:ring-0 p-0"
                >
                  <option value="FREE">Basic</option>
                  <option value="SILVER">Silver</option>
                  <option value="GOLD">Gold</option>
                </select>
              </td>
              <td className="px-10 py-6 text-right">
                <div className="flex items-center justify-end gap-2">
                  {user.accountStatus === 'INACTIVE' && (
                    <button 
                      onClick={() => handleAction('approve', user.id)}
                      className="p-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all shadow-lg shadow-green-500/10"
                      title="Approve"
                    >
                      <Check size={16} />
                    </button>
                  )}
                  {user.accountStatus === 'ACTIVE' && (
                    <button 
                      onClick={() => handleAction('ban', user.id)}
                      className="p-2.5 bg-amber-500/10 text-amber-600 rounded-xl hover:bg-amber-500/20 transition-all"
                      title="Suspend"
                    >
                      <ShieldOff size={16} />
                    </button>
                  )}
                  {user.accountStatus === 'SUSPENDED' && (
                    <button 
                      onClick={() => handleAction('unban', user.id)}
                      className="p-2.5 bg-green-500/10 text-green-600 rounded-xl hover:bg-green-500/20 transition-all"
                      title="Reactivate"
                    >
                      <Shield size={16} />
                    </button>
                  )}
                  <button 
                    onClick={() => setEditModal({ isOpen: true, user })}
                    className="p-2.5 bg-blue-500/10 text-blue-600 rounded-xl hover:bg-blue-500/20 transition-all"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleAction('delete', user.id)}
                    className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all"
                    title="Permanently Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
