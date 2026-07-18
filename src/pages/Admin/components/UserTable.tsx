import React from 'react';

import { resolveImageUrl, DEFAULT_USER_AVATAR } from '../../../lib/url';
import type { AdminUser } from '../adminTypes';

interface UserTableProps {
  users: AdminUser[];
  loading: boolean;
  handleAction: (action: 'approve' | 'ban' | 'unban' | 'delete', id: string) => void;
  handleSetPlan: (id: string, plan: string) => void;
  handleToggleKyc: (id: string, currentStatus: boolean) => void;
  setEditModal: (modal: { isOpen: boolean; user: AdminUser }) => void;
  onView: (user: AdminUser) => void;
  onResetPassword?: (user: AdminUser) => void;
}

export const UserTable: React.FC<UserTableProps> = React.memo(({ 
  users, 
  loading, 
  handleAction, 
  handleSetPlan, 
  handleToggleKyc,
  setEditModal,
  onView,
  onResetPassword
}) => {
  if (loading) return null; // Handled in parent

  if (!users?.length) {
    return <div className="p-20 text-center text-foreground/20 font-medium">No citizens found in this segment.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-[#F2F4F6] text-xs font-semibold text-foreground/50 border-b border-black/5">
          <tr>
            <th className="px-10 py-5">Profile</th>
            <th className="px-8 py-5">Status</th>
            <th className="px-8 py-5">KYC</th>
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
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold text-primary ml-2 hover:underline"
                        title="View Full Profile"
                      >
                        View Profile
                      </button>
                    </div>
                    <div className="text-xs font-semibold text-primary mt-1">{user.regId}</div>
                  </div>
                </div>
              </td>
              <td className="px-8 py-6">
                <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold
                  ${user.accountStatus === 'ACTIVE' ? 'bg-green-50 text-green-700' : 
                    user.accountStatus === 'SUSPENDED' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
                  {user.accountStatus}
                </span>
              </td>
              <td className="px-8 py-6">
                <button
                  onClick={() => handleToggleKyc(user.id, user.kycVerified)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    user.kycVerified ? 'bg-green-500/10 text-green-700 hover:bg-green-500/20' : 'bg-amber-500/10 text-amber-700 hover:bg-amber-500/20'
                  }`}
                  title={user.kycVerified ? "Revoke KYC" : "Verify KYC"}
                >
                  {user.kycVerified ? 'Verified' : 'Pending'}
                </button>
              </td>
              <td className="px-8 py-6">
                <select 
                  value={user.planType} 
                  onChange={(e) => handleSetPlan(user.id, e.target.value)}
                  className="bg-transparent border-none text-xs font-semibold text-foreground/60 cursor-pointer focus:ring-0 p-0"
                >
                  <option value="FREE">Basic</option>
                  <option value="SILVER">Silver</option>
                  <option value="GOLD">Gold</option>
                </select>
              </td>
              <td className="px-10 py-6 text-right">
                <div className="flex items-center justify-end gap-2 flex-wrap">
                  {user.accountStatus === 'INACTIVE' && (
                    <button 
                      onClick={() => handleAction('approve', user.id)}
                      className="px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-600 transition-all shadow-sm"
                      title="Approve Profile"
                    >
                      Approve (मंजूर)
                    </button>
                  )}
                  {user.accountStatus === 'ACTIVE' && (
                    <button 
                      onClick={() => handleAction('ban', user.id)}
                      className="px-3 py-1.5 bg-amber-500/10 text-amber-700 text-xs font-bold rounded-lg hover:bg-amber-500/20 transition-all"
                      title="Suspend Profile"
                    >
                      Suspend (स्थगित)
                    </button>
                  )}
                  {user.accountStatus === 'SUSPENDED' && (
                    <button 
                      onClick={() => handleAction('unban', user.id)}
                      className="px-3 py-1.5 bg-green-500/10 text-green-700 text-xs font-bold rounded-lg hover:bg-green-500/20 transition-all"
                      title="Reactivate Profile"
                    >
                      Reactivate (पुन्हा सुरू)
                    </button>
                  )}
                  <button 
                    onClick={() => setEditModal({ isOpen: true, user })}
                    className="px-3 py-1.5 bg-blue-500/10 text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-500/20 transition-all"
                    title="Edit Profile"
                  >
                    Edit (बदल करा)
                  </button>
                  {onResetPassword && (
                    <button 
                      onClick={() => onResetPassword(user)}
                      className="px-3 py-1.5 bg-purple-500/10 text-purple-700 text-xs font-bold rounded-lg hover:bg-purple-500/20 transition-all"
                      title="Reset Password"
                    >
                      Password (पासवर्ड)
                    </button>
                  )}
                  <button 
                    onClick={() => handleAction('delete', user.id)}
                    className="px-3 py-1.5 bg-red-500/10 text-red-600 text-xs font-bold rounded-lg hover:bg-red-500/20 transition-all"
                    title="Permanently Delete"
                  >
                    Delete (काढून टाका)
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
