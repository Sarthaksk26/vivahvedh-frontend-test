import { useEffect, useState, useCallback } from 'react';
import apiClient from '../../lib/apiClient';
import PhotoUpload from '../../components/Dashboard/PhotoUpload';
import ProfileEditor from '../../components/Dashboard/ProfileEditor';
import ConnectionsList from '../../components/Dashboard/ConnectionsList';
import { Lock, Shield } from 'lucide-react';
import { resolveImageUrl } from '../../lib/url';
import toast from 'react-hot-toast';
import { authStorage } from '../../lib/authStorage';

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isForced = authStorage.getForcePasswordChange();
  const [activeTab, setActiveTab] = useState(isForced ? 'password' : 'profile');
  const [isEditing, setIsEditing] = useState(false);
  const [shortlist, setShortlist] = useState<any[]>([]);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await apiClient.get('/user/profile');
      setProfile(res.data);
      
      // Update local storage status if it changed (e.g. from PENDING to ACTIVE)
      // Update local storage status if it changed (e.g. from INACTIVE to ACTIVE)
      const storedUser = authStorage.getUser();
      if (storedUser && storedUser.status !== res.data.accountStatus) {
        authStorage.setUser({ ...storedUser, status: res.data.accountStatus });
        // Optional: toast if status changed to ACTIVE
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
      const res = await apiClient.get('/user/shortlist');
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

  const handlePasswordChange = async (e: React.FormEvent) => {
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
      // Clear force password change flag if set
      authStorage.setForcePasswordChange(false);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to change password.');
    } finally {
      setChangingPassword(false);
    }
  };

  const switchTab = (tab: string) => {
    setActiveTab(tab);
    setIsEditing(false); // Reset editing mode when switching tabs
  };

  const planColors: Record<string, string> = {
    FREE: 'bg-gray-100 text-gray-600',
    SILVER: 'bg-slate-200 text-slate-700',
    GOLD: 'bg-amber-100 text-amber-700'
  };

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
            <div className="w-20 h-20 bg-muted rounded-full flex overflow-hidden items-center justify-center mx-auto mb-3 border-4 border-background shadow-md">
              {profile.images && profile.images.length > 0 ? (
                <img src={resolveImageUrl(profile.images[0].url)} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-muted-foreground">{profile.profile?.firstName?.[0] || 'V'}</span>
              )}
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
            {[
              { key: 'profile', label: 'My Profile' },
              { key: 'photos', label: 'Photo Gallery' },
              { key: 'connections', label: 'My Connections', highlight: true },
              { key: 'shortlist', label: `My Shortlist ${shortlist.length > 0 ? `(${shortlist.length})` : ''}` },
              { key: 'password', label: 'Change Password' },
            ].map(tab => (
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
          <div className="space-y-6">
            {!isEditing ? (
              <>
                <div className="bg-card border shadow-sm rounded-2xl p-6 md:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Profile Overview</h1>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${profile.accountStatus === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {profile.accountStatus}
                      </span>
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition shadow-sm active:scale-95"
                      >
                        ✏️ Edit Profile
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                    <div><p className="text-sm font-semibold text-muted-foreground mb-1">Email</p><p className="font-medium">{profile.email || "Not Provided"}</p></div>
                    <div><p className="text-sm font-semibold text-muted-foreground mb-1">Mobile</p><p className="font-medium">{profile.mobile}</p></div>
                    <div><p className="text-sm font-semibold text-muted-foreground mb-1">Gender</p><p className="font-medium">{profile.profile?.gender}</p></div>
                    <div><p className="text-sm font-semibold text-muted-foreground mb-1">Marital Status</p><p className="font-medium">{profile.profile?.maritalStatus}</p></div>
                    <div className="col-span-full">
                      <p className="text-sm font-semibold text-muted-foreground mb-1">About Me</p>
                      <p className="font-medium text-foreground/80 leading-relaxed bg-muted/30 p-4 rounded-lg">{profile.profile?.aboutMe || "No description provided yet."}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border shadow-sm rounded-2xl p-6 md:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Extended Details</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                    <div><p className="text-sm font-semibold text-muted-foreground mb-1">Height</p><p className="font-medium">{profile.physical?.height ? `${profile.physical.height} in` : "-"}</p></div>
                    <div><p className="text-sm font-semibold text-muted-foreground mb-1">Profession</p><p className="font-medium">{profile.education?.jobBusiness || "-"}</p></div>
                    <div><p className="text-sm font-semibold text-muted-foreground mb-1">Income</p><p className="font-medium">{profile.education?.annualIncome || "-"}</p></div>
                    <div><p className="text-sm font-semibold text-muted-foreground mb-1">Father's Occupation</p><p className="font-medium">{profile.family?.fatherOccupation || "-"}</p></div>
                    <div><p className="text-sm font-semibold text-muted-foreground mb-1">Gothra</p><p className="font-medium">{profile.astrology?.gothra || "-"}</p></div>
                    <div><p className="text-sm font-semibold text-muted-foreground mb-1">Rashi</p><p className="font-medium">{profile.astrology?.rashi || "-"}</p></div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-card border shadow-sm rounded-2xl p-6 md:p-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Edit Your Profile</h2>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border text-sm font-bold rounded-lg hover:bg-muted transition"
                  >
                    ← Cancel
                  </button>
                </div>
                <p className="text-muted-foreground mb-6">Complete your profile to increase visibility and match quality.</p>
                <ProfileEditor 
                  currentData={profile} 
                  onSaveSuccess={() => { 
                    fetchProfile(); 
                    setIsEditing(false); // Return to view mode after save
                  }} 
                />
              </div>
            )}
          </div>
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
                {shortlist.map((item: any) => (
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
                <input 
                  type="password" 
                  value={currentPassword} 
                  onChange={e => setCurrentPassword(e.target.value)} 
                  required 
                  className="w-full h-10 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" 
                  placeholder="Enter your current password" 
                />
              </div>
              
              {/* New Password with strength indicator */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-muted-foreground">New Password</label>
                <input 
                  type="password" 
                  value={newPassword} 
                  onChange={e => setNewPassword(e.target.value)} 
                  required 
                  minLength={6} 
                  className="w-full h-10 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" 
                  placeholder="Minimum 6 characters" 
                />
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
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                  required 
                  className={`w-full h-10 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                    confirmPassword && confirmPassword !== newPassword ? 'border-red-400' : ''
                  }`}
                  placeholder="Re-enter new password" 
                />
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
