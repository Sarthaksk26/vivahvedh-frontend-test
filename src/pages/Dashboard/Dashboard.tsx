import { useEffect, useState, useCallback } from 'react';
import apiClient from '../../lib/apiClient';
import PhotoUpload from '../../components/Dashboard/PhotoUpload';
import ProfileEditor from '../../components/Dashboard/ProfileEditor';
import ConnectionsList from '../../components/Dashboard/ConnectionsList';
import { Lock, Shield } from 'lucide-react';
import { resolveImageUrl } from '../../lib/url';

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await apiClient.get('/user/profile');
      setProfile(res.data);
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) { alert('New password must be at least 6 characters.'); return; }
    setChangingPassword(true);
    try {
      await apiClient.post('/user/change-password', { currentPassword, newPassword });
      alert('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to change password.');
    } finally {
      setChangingPassword(false);
    }
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
            {profile.planType === 'GOLD' ? '👑' : profile.planType === 'SILVER' ? '⭐' : '🆓'} {profile.planType} Plan
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
              { key: 'edit', label: 'Edit Details' },
              { key: 'photos', label: 'Photo Gallery' },
              { key: 'connections', label: 'My Connections', highlight: true },
              { key: 'password', label: 'Change Password' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-left rounded-md transition-colors text-sm ${
                  activeTab === tab.key
                    ? tab.highlight
                      ? 'bg-rose-100 text-rose-700 font-bold border border-rose-200'
                      : 'bg-primary/10 text-primary font-bold'
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

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-card border shadow-sm rounded-2xl p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Profile Overview</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${profile.accountStatus === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {profile.accountStatus}
                </span>
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
                <button onClick={() => setActiveTab('edit')} className="text-sm font-bold text-primary hover:underline">Edit</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                <div><p className="text-sm font-semibold text-muted-foreground mb-1">Height</p><p className="font-medium">{profile.physical?.height ? `${profile.physical.height} cm` : "-"}</p></div>
                <div><p className="text-sm font-semibold text-muted-foreground mb-1">Profession</p><p className="font-medium">{profile.education?.jobBusiness || "-"}</p></div>
                <div><p className="text-sm font-semibold text-muted-foreground mb-1">Income</p><p className="font-medium">{profile.education?.annualIncome || "-"}</p></div>
                <div><p className="text-sm font-semibold text-muted-foreground mb-1">Father's Occupation</p><p className="font-medium">{profile.family?.fatherOccupation || "-"}</p></div>
                <div><p className="text-sm font-semibold text-muted-foreground mb-1">Gothra</p><p className="font-medium">{profile.astrology?.gothra || "-"}</p></div>
                <div><p className="text-sm font-semibold text-muted-foreground mb-1">Rashi</p><p className="font-medium">{profile.astrology?.rashi || "-"}</p></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'edit' && (
          <div className="bg-card border shadow-sm rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-2">Edit Your Profile</h2>
            <p className="text-muted-foreground mb-6">Complete your profile to increase visibility and match quality.</p>
            <ProfileEditor currentData={profile} onSaveSuccess={() => { fetchProfile(); setActiveTab('profile'); }} />
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

        {activeTab === 'password' && (
          <div className="bg-card border shadow-sm rounded-2xl p-6 md:p-8 max-w-lg">
            <div className="flex items-center gap-3 mb-6">
              <Lock size={20} className="text-primary" />
              <h2 className="text-xl font-bold">Change Password</h2>
            </div>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-muted-foreground">Current Password</label>
                <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className="w-full h-10 px-3 border rounded-md" placeholder="Enter current password" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-muted-foreground">New Password</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={6} className="w-full h-10 px-3 border rounded-md" placeholder="Minimum 6 characters" />
              </div>
              <button type="submit" disabled={changingPassword} className="w-full py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50">
                {changingPassword ? 'Changing...' : 'Update Password'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
