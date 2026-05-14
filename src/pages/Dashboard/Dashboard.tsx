import { useEffect, useState, useCallback, useMemo } from 'react';
import apiClient from '../../lib/apiClient';
import PhotoUpload from '../../components/Dashboard/PhotoUpload';
import OptimizedImage from '../../components/ui/OptimizedImage';
import ProfileEditor from '../../components/Dashboard/ProfileEditor';
import DocumentUpload from '../../components/Dashboard/DocumentUpload';
import ConnectionsList from '../../components/Dashboard/ConnectionsList';
import { Lock, Shield, Eye, EyeOff } from 'lucide-react';
import { resolveImageUrl } from '../../lib/url';
import toast from 'react-hot-toast';
import { authStorage } from '../../lib/authStorage';
import type { FullUserProfile, ShortlistItem, UserImage } from '../../types';

import { formatApiError } from '../../lib/errorUtils';

export default function Dashboard() {
  const [profile, setProfile] = useState<FullUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const isForced = authStorage.getForcePasswordChange();
  const [activeTab, setActiveTab] = useState(() => {
    if (isForced) return 'password';
    const savedTab = sessionStorage.getItem('dashboard_tab');
    if (savedTab) {
      sessionStorage.removeItem('dashboard_tab');
      return savedTab;
    }
    return 'profile';
  });
  const [isEditing, setIsEditing] = useState(false);
  const [shortlist, setShortlist] = useState<ShortlistItem[]>([]);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await apiClient.get<FullUserProfile>('/user/profile');
      setProfile(res.data);
      
      const storedUser = authStorage.getUser();
      if (storedUser && storedUser.status !== res.data.accountStatus) {
        authStorage.setUser({ ...storedUser, status: res.data.accountStatus });
        if (res.data.accountStatus === 'ACTIVE' && storedUser.status !== 'ACTIVE') {
          toast.success('Your account has been approved! You can now send match proposals.');
        }
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchShortlist = useCallback(async () => {
    try {
      const res = await apiClient.get<ShortlistItem[]>('/user/shortlist');
      setShortlist(res.data);
    } catch (err) {
      console.error('Failed to fetch shortlist', err);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (activeTab === 'shortlist') fetchShortlist();
  }, [activeTab, fetchShortlist]);

  const handlePasswordChange = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 6) { 
      toast.error('New password must be at least 6 characters.'); 
      return; 
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match. Please check and try again.');
      return;
    }

    if (newPassword === currentPassword) {
      toast.error('New password must be different from your current password.');
      return;
    }

    setChangingPassword(true);
    try {
      await apiClient.post('/user/change-password', { currentPassword, newPassword });
      toast.success('Password updated successfully! A confirmation email has been sent.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      authStorage.setForcePasswordChange(false);
    } catch (err: unknown) {
      toast.error(formatApiError(err, 'Failed to change password.'));
    } finally {
      setChangingPassword(false);
    }
  }, [newPassword, confirmPassword, currentPassword]);

  const switchTab = useCallback((tab: string) => {
    setActiveTab(tab);
    setIsEditing(false);
  }, []);

  // PERFORMANCE: Memoize plan colors to prevent object recreation
  const planColors: Record<string, string> = useMemo(() => ({
    FREE: 'bg-gray-100 text-gray-600',
    SILVER: 'bg-slate-200 text-slate-700',
    GOLD: 'bg-amber-100 text-amber-700'
  }), []);

  // PERFORMANCE: Memoize tabs list
  const tabs = useMemo(() => [
    { key: 'profile', label: 'Profile Settings' },
    { key: 'documents', label: 'Documents & KYC' },
    { key: 'connections', label: 'My Connections', highlight: true },
    { key: 'shortlist', label: `My Shortlist ${shortlist.length > 0 ? `(${shortlist.length})` : ''}` },
    { key: 'password', label: 'Security' },
  ], [shortlist.length]);

  if (loading) {
    return <div className="min-h-[70vh] flex items-center justify-center font-semibold text-lg text-primary animate-pulse">Loading dashboard...</div>;
  }

  if (!profile) {
    return <div className="min-h-[70vh] flex items-center justify-center text-red-500">Failed to load session. Please log in again.</div>;
  }

  return (
    <div className="max-w-6xl w-full mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0 flex flex-col gap-4">
        <div className="p-6 bg-card rounded-2xl shadow-sm border">
          <div className="mb-4">
            <div className="w-24 h-24 bg-muted rounded-full flex overflow-hidden items-center justify-center mx-auto mb-3 border-4 border-background shadow-lg relative">
              <OptimizedImage 
                src={profile.images?.find((i: UserImage) => i.isPrimary)?.url || profile.images?.[0]?.url || ''} 
                alt="Profile" 
                className="w-full h-full object-cover" 
              />
            </div>
            <h2 className="text-center font-bold text-lg">{profile.profile?.firstName} {profile.profile?.lastName}</h2>
            <p className="text-center text-sm text-primary font-medium">{profile.regId}</p>
          </div>

          {/* Plan Badge */}
          <div className={`text-center text-xs font-bold px-3 py-1.5 rounded-full mb-4 ${planColors[profile.planType] || planColors.FREE}`}>
            {profile.planType === 'GOLD' ? '👑' : profile.planType === 'SILVER' ? '⭐' : '🆓'} {profile.planType === 'FREE' ? 'Basic' : profile.planType} Plan
            {profile.planExpiresAt && (
              <span className="block text-[10px] font-medium mt-0.5 opacity-70">
                Expires: {new Date(profile.planExpiresAt).toLocaleDateString()}
              </span>
            )}
          </div>

          <hr className="my-2 border-border" />
          <nav className="flex flex-col gap-1 mt-2">
            {tabs.map(tab => (
              <button
                key={tab.key}
                disabled={isForced && tab.key !== 'password'}
                onClick={() => switchTab(tab.key)}
                className={`px-4 py-2 text-left rounded-md transition-colors text-sm flex items-center justify-between ${
                  activeTab === tab.key
                    ? tab.highlight
                      ? 'bg-rose-100 text-rose-700 font-bold border border-rose-200'
                      : 'bg-primary/10 text-primary font-bold'
                    : isForced && tab.key !== 'password'
                      ? 'opacity-30 cursor-not-allowed font-medium text-muted-foreground'
                      : 'hover:bg-muted font-medium text-muted-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Account Status */}
        <div className={`p-4 rounded-xl border text-center text-sm font-medium ${
          profile.accountStatus === 'ACTIVE'
            ? 'bg-green-50 text-green-700 border-green-200'
            : 'bg-amber-50 text-amber-700 border-amber-200'
        }`}>
          <Shield size={16} className="inline mr-1" />
          Account: {profile.accountStatus}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        {profile.accountStatus === 'INACTIVE' && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-6 rounded-2xl shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 flex-shrink-0 animate-pulse">
                <Shield size={24} />
              </div>
              <div>
                <h3 className="font-display font-black text-amber-900 text-lg">Verification in Progress</h3>
                <p className="text-amber-800/70 text-sm mt-1 leading-relaxed">
                  Welcome to Vivahvedh! Your profile is currently being reviewed by our administrative team. 
                  During this time, you can <strong>complete your profile details</strong> and <strong>upload photos</strong>, 
                  but searching and sending match proposals will be enabled once your account is verified (usually within 24 hours).
                </p>
              </div>
            </div>
          </div>
        )}

        {isForced && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-xl flex items-center gap-3 font-bold text-sm shadow-sm animate-pulse">
            <Shield size={18} />
            ⚠️ You must change your password before accessing your account.
          </div>
        )}


        {activeTab === 'profile' && (
          <div className="space-y-8">
            {/* Top Section: Photo Management */}
            <div className="bg-card border shadow-sm rounded-3xl overflow-hidden">
               <div className="p-8 border-b bg-rose-50/50">
                  <h2 className="text-xl font-bold">Photo Gallery</h2>
                  <p className="text-sm text-muted-foreground">Manage your profile visibility with high-quality photos.</p>
               </div>
               <div className="p-8">
                  <PhotoUpload existingImages={profile.images} onUploadSuccess={fetchProfile} />
               </div>
            </div>

            {/* Profile Content */}
            {!isEditing ? (
              <div className="space-y-8">
                <div className="bg-card border shadow-sm rounded-3xl p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h1 className="text-2xl font-bold">Primary Details</h1>
                      <p className="text-sm text-muted-foreground mt-1">Basic information shown to other members.</p>
                    </div>
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition shadow-premium active:scale-95 flex items-center gap-2"
                    >
                      ✏️ Edit Information
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Email</p>
                      <p className="font-semibold text-foreground">{profile.email || "Not Provided"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Mobile</p>
                      <p className="font-semibold text-foreground">{profile.mobile}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Gender</p>
                      <p className="font-semibold text-foreground">{profile.profile?.gender}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Marital Status</p>
                      <p className="font-semibold text-foreground">{profile.profile?.maritalStatus}</p>
                    </div>
                    <div className="col-span-full pt-4">
                      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 mb-3">About Me</p>
                      <div className="bg-muted/30 p-6 rounded-2xl border border-dashed border-border/60">
                        <p className="font-medium text-foreground/80 leading-relaxed italic">
                          {profile.profile?.aboutMe || "Describe yourself here to help others know you better."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card border shadow-sm rounded-3xl p-8">
                  <h2 className="text-xl font-bold mb-8">Personal & Astrology Details</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Height</p>
                      <p className="font-bold">{profile.physical?.height ? `${profile.physical.height} in` : "-"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Occupation</p>
                      <p className="font-bold">{profile.education?.jobBusiness || "-"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Income</p>
                      <p className="font-bold">{profile.education?.annualIncome || "-"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Gothra</p>
                      <p className="font-bold">{profile.astrology?.gothra || "-"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Rashi</p>
                      <p className="font-bold">{profile.astrology?.rashi || "-"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Mangal</p>
                      <p className="font-bold">{profile.astrology?.mangal || "-"}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <ProfileEditor 
                currentData={profile} 
                onSaveSuccess={() => { 
                  fetchProfile(); 
                  setIsEditing(false);
                }} 
                onCancel={() => setIsEditing(false)}
              />
            )}
          </div>
        )}

        {activeTab === 'documents' && (
          <section>
            <DocumentUpload profile={profile} onUploadSuccess={fetchProfile} />
          </section>
        )}

        {activeTab === 'photos' && (
          <section>
            <PhotoUpload existingImages={profile.images} onUploadSuccess={fetchProfile} />
          </section>
        )}

        {activeTab === 'connections' && (
          <section>
            <ConnectionsList />
          </section>
        )}

        {activeTab === 'shortlist' && (
          <div className="bg-card border shadow-sm rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b bg-amber-50 flex justify-between items-center">
              <h2 className="font-bold text-lg text-amber-900">My Shortlisted Profiles</h2>
              <span className="px-3 py-1 bg-amber-200 text-amber-800 rounded-full text-xs font-bold">{shortlist.length}</span>
            </div>
            {shortlist.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <p className="text-4xl mb-4">⭐</p>
                <p className="font-semibold">No profiles shortlisted yet.</p>
                <p className="text-sm mt-1">Browse profiles and click the shortlist button to save them here.</p>
              </div>
            ) : (
              <div className="divide-y">
                {shortlist.map((item: ShortlistItem) => (
                  <div key={item.id} className="p-6 flex items-center gap-4 hover:bg-muted/30 transition">
                    <div className="w-16 h-16 rounded-full bg-muted border overflow-hidden flex-shrink-0">
                      {item.target.images?.[0]?.url ? (
                        <img src={resolveImageUrl(item.target.images[0].url)} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-muted-foreground">
                          {item.target.profile?.firstName?.[0] || 'V'}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold">{item.target.profile?.firstName} {item.target.profile?.lastName}</h3>
                      <p className="text-sm text-primary font-medium">{item.target.regId}</p>
                      <p className="text-xs text-muted-foreground">{item.target.profile?.gender} • {item.target.profile?.maritalStatus}</p>
                    </div>
                    <div className="flex gap-2">
                      <a 
                        href={`/profile/${item.target.id}`}
                        className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-muted transition"
                      >
                        View Profile
                      </a>
                      <button
                        onClick={async () => {
                          await apiClient.post('/user/shortlist', { targetUserId: item.target.id });
                          fetchShortlist();
                          toast.success('Removed from shortlist');
                        }}
                        className="px-4 py-2 border border-amber-200 text-amber-600 rounded-md text-sm font-bold hover:bg-amber-50 transition"
                      >
                        ★ Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'password' && (
          <div className="bg-card border shadow-sm rounded-2xl p-6 md:p-8 max-w-lg">
            <div className="flex items-center gap-3 mb-6">
              <Lock size={20} className="text-primary" />
              <h2 className="text-xl font-bold">Change Password</h2>
            </div>
            
            {/* Password Change Form */}
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {/* Current Password */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-muted-foreground">Current Password</label>
                <div className="relative">
                  <input 
                    type={showCurrent ? "text" : "password"} 
                    value={currentPassword} 
                    onChange={e => setCurrentPassword(e.target.value)} 
                    required 
                    className="w-full h-10 px-3 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" 
                    placeholder="Enter your current password" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              
              {/* New Password with strength indicator */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-muted-foreground">New Password</label>
                <div className="relative">
                  <input 
                    type={showNew ? "text" : "password"} 
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)} 
                    required 
                    minLength={6} 
                    className="w-full h-10 px-3 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" 
                    placeholder="Minimum 6 characters" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {/* Password strength bar */}
                {newPassword.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex gap-1 h-1.5">
                      {[1,2,3,4].map(level => {
                        const strength = newPassword.length >= 12 ? 4 : newPassword.length >= 8 ? 3 : newPassword.length >= 6 ? 2 : 1;
                        return (
                          <div key={level} className={`flex-1 rounded-full transition-colors ${
                            level <= strength 
                              ? strength >= 3 ? 'bg-green-500' : strength === 2 ? 'bg-amber-500' : 'bg-red-400'
                              : 'bg-gray-200'
                          }`} />
                        );
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {newPassword.length < 6 ? 'Too short — minimum 6 characters' : 
                       newPassword.length < 8 ? 'Weak — try adding numbers or symbols' : 
                       newPassword.length < 12 ? 'Good strength' : 'Strong password ✓'}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Confirm New Password */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-muted-foreground">Confirm New Password</label>
                <div className="relative">
                  <input 
                    type={showConfirm ? "text" : "password"} 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)} 
                    required 
                    className={`w-full h-10 px-3 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                      confirmPassword && confirmPassword !== newPassword ? 'border-red-400' : ''
                    }`}
                    placeholder="Re-enter new password" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== newPassword && (
                  <p className="text-xs text-red-500 font-medium">Passwords do not match</p>
                )}
                {confirmPassword && confirmPassword === newPassword && newPassword.length >= 6 && (
                  <p className="text-xs text-green-600 font-medium">✓ Passwords match</p>
                )}
              </div>
              
              <button 
                type="submit" 
                disabled={changingPassword || (!!confirmPassword && confirmPassword !== newPassword)}
                className="w-full py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {changingPassword ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
