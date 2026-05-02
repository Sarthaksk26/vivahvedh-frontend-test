import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../lib/apiClient';
import CarouselLightbox from '../../components/layout/Lightbox';
import { resolveImageUrl } from '../../lib/url';
import toast from 'react-hot-toast';
import { authStorage } from '../../lib/authStorage';
import { Loader2 } from 'lucide-react';
import OptimizedImage from '../../components/ui/OptimizedImage';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse, FullUserProfile, UserImage, ShortlistItem, ConnectionStatus } from '../../types';
import { formatApiError } from '../../lib/errorUtils';

export default function PublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<FullUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('NONE');
  const [connectionRequestId, setConnectionRequestId] = useState<string | null>(null);

  const handleSendInterest = async () => {
    if (!authStorage.isAuthenticated()) {
      return navigate('/login');
    }
    setActionLoading(true);
    try {
      await apiClient.post('/connections/send', { receiverId: id });
      setConnectionStatus('PENDING_SENT');
      toast.success('Match Proposal sent successfully!');
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const code = axiosError.response?.data?.code;
      if (code === 'PLAN_UPGRADE_REQUIRED') {
        toast.error('Upgrade plan to send proposals.');
      } else {
        toast.error(formatApiError(error, 'Failed to send proposal.'));
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateConnection = async (status: 'ACCEPTED' | 'REJECTED') => {
    if (!connectionRequestId) return;
    setActionLoading(true);
    try {
      const endpoint = status === 'ACCEPTED' ? '/connections/accept' : '/connections/reject';
      await apiClient.post(endpoint, { requestId: connectionRequestId });
      setConnectionStatus(status);
      toast.success(status === 'ACCEPTED' ? 'Proposal Accepted!' : 'Proposal Declined');
    } catch (error: unknown) {
      toast.error(formatApiError(error, 'Action failed'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleShortlist = async () => {
    if (!authStorage.isAuthenticated()) {
      return navigate('/login');
    }
    try {
      const { data } = await apiClient.post<{ shortlisted: boolean; message: string }>('/user/shortlist', { targetUserId: id });
      setIsShortlisted(data.shortlisted);
      toast.success(data.shortlisted ? 'Added to shortlist' : 'Removed from shortlist');
    } catch (error: unknown) {
      toast.error(formatApiError(error, 'Shortlist failed'));
    }
  };

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [userRes, statusRes, shortRes] = await Promise.all([
          apiClient.get<FullUserProfile>(`/search/public/${id}`),
          apiClient.get<{ status: ConnectionStatus; requestId: string | null }>(`/connections/status/${id}`),
          apiClient.get<ShortlistItem[]>('/user/shortlist')
        ]);

        setProfile(userRes.data);
        setConnectionStatus(statusRes.data.status);
        setConnectionRequestId(statusRes.data.requestId);
        
        const shortlisted = shortRes.data.some((s: ShortlistItem) => s.targetUserId === id || s.target?.id === id);
        setIsShortlisted(shortlisted);

      } catch (error) {
        console.error(error);
        toast.error("Profile not available.");
        navigate('/search');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, navigate]);

  if (loading) return <div className="h-[80vh] flex items-center justify-center animate-pulse font-medium text-lg text-primary">Loading profile...</div>;
  if (!profile) return null;

  const hasImages = profile.images && profile.images.length > 0;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
      {/* Carousel Lightbox */}
      {carouselOpen && hasImages && (
        <CarouselLightbox
          images={profile.images!}
          startIndex={carouselIndex}
          onClose={() => setCarouselOpen(false)}
        />
      )}

      {/* Hero Header Card */}
      <div className="bg-card rounded-3xl overflow-hidden border shadow-sm flex flex-col md:flex-row">
        <div className="md:w-1/3 bg-muted h-72 md:h-auto relative overflow-hidden group">
          <OptimizedImage 
            src={profile.images?.find((i: UserImage) => i.isPrimary)?.url || profile.images?.[0]?.url || ''} 
            alt="Profile" 
            className="w-full h-full object-cover cursor-zoom-in group-hover:scale-105 transition-transform duration-700" 
            onClick={() => { setCarouselIndex(0); setCarouselOpen(true); }}
          />
          {/* Plan Badge */}
          {profile.planType === 'GOLD' && (
            <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">👑 Gold Member</span>
          )}
        </div>
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
                {profile.profile?.firstName} {profile.profile?.lastName}
              </h1>
              <p className="text-lg text-primary font-bold">{profile.regId}</p>
            </div>
            <span className="px-4 py-1.5 bg-green-100 text-green-800 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
              Verified
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="px-3 py-1 bg-muted rounded-md text-sm font-medium">{profile.profile?.maritalStatus}</span>
            <span className="px-3 py-1 bg-muted rounded-md text-sm font-medium">{profile.profile?.gender}</span>
            {profile.physical?.height && (
              <span className="px-3 py-1 bg-muted rounded-md text-sm font-medium">{profile.physical.height} in</span>
            )}
          </div>

          <p className="mt-6 text-muted-foreground leading-relaxed">
            {profile.profile?.aboutMe || "This member hasn't written a biography yet."}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4 border-t pt-8">
            {connectionStatus === 'NONE' && (
              <button
                onClick={handleSendInterest}
                disabled={actionLoading}
                className="clay-button-primary px-10 py-4 text-xs uppercase tracking-[0.2em] disabled:opacity-50"
              >
                {actionLoading ? 'Sending Request...' : '💌 Send Match Proposal'}
              </button>
            )}
            
            {connectionStatus === 'PENDING_SENT' && (
              <div className="px-8 py-4 bg-amber-50 text-amber-700 rounded-2xl font-bold text-sm border border-amber-200 flex items-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                Proposal Sent — Awaiting Response
              </div>
            )}

            {connectionStatus === 'PENDING_RECEIVED' && (
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button 
                  onClick={() => handleUpdateConnection('ACCEPTED')} 
                  disabled={actionLoading}
                  className="px-8 py-4 bg-green-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-600 transition shadow-lg active:scale-95 disabled:opacity-50"
                >
                  {actionLoading ? 'Approving...' : '✅ Accept Proposal'}
                </button>
                <button 
                  onClick={() => handleUpdateConnection('REJECTED')} 
                  disabled={actionLoading}
                  className="px-8 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-100 transition active:scale-95 disabled:opacity-50"
                >
                  {actionLoading ? 'Declining...' : '❌ Decline'}
                </button>
              </div>
            )}

            {connectionStatus === 'ACCEPTED' && (
              <div className="px-8 py-4 bg-green-50 text-green-700 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border border-green-200 shadow-sm">
                ✅ Connected — Contact info unlocked
              </div>
            )}
            
            {connectionStatus === 'REJECTED' && (
              <div className="px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold text-sm">
                This proposal was declined
              </div>
            )}

            <button
              onClick={handleShortlist}
              className={`px-6 py-3 border-2 rounded-full font-bold transition-all ${
                isShortlisted
                  ? 'border-amber-400 bg-amber-50 text-amber-700'
                  : 'border-border hover:border-primary/30 hover:bg-primary/5 text-foreground'
              }`}
            >
              {isShortlisted ? '⭐ Shortlisted' : '☆ Shortlist'}
            </button>
          </div>
        </div>
      </div>

      {/* Thumbnail Strip */}
      {hasImages && profile.images!.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {profile.images!.map((img: UserImage, idx: number) => (
            <button
              key={img.id || idx}
              onClick={() => { setCarouselIndex(idx); setCarouselOpen(true); }}
              className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer hover:border-primary ${
                idx === 0 ? 'border-primary' : 'border-transparent'
              }`}
            >
              <img src={resolveImageUrl(img.url)} className="w-full h-full object-cover" alt={`Photo ${idx + 1}`} />
            </button>
          ))}
        </div>
      )}

      {/* Grid Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Physical Stats */}
        <section className="bg-card border rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6 border-b pb-4">Physical Attributes</h2>
          <ul className="space-y-4">
            <li className="flex justify-between"><span className="text-muted-foreground font-medium">Height</span><span className="font-semibold">{profile.physical?.height ? `${profile.physical.height} in` : '-'}</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground font-medium">Weight</span><span className="font-semibold">{profile.physical?.weight ? `${profile.physical.weight} kg` : '-'}</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground font-medium">Diet</span><span className="font-semibold">{profile.physical?.diet || '-'}</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground font-medium">Blood Group</span><span className="font-semibold">{profile.physical?.bloodGroup || '-'}</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground font-medium">Complexion</span><span className="font-semibold">{profile.physical?.complexion || '-'}</span></li>
            {profile.physical?.disease && (
              <li className="flex justify-between"><span className="text-muted-foreground font-medium">Medical / Disease</span><span className="font-semibold text-amber-600">{profile.physical.disease}</span></li>
            )}
          </ul>
        </section>

        {/* Education & Income */}
        <section className="bg-card border rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6 border-b pb-4">Education & Career</h2>
          <ul className="space-y-4">
            <li className="flex justify-between"><span className="text-muted-foreground font-medium">Qualification</span><span className="font-semibold">{profile.education?.trade || '-'}</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground font-medium">Profession</span><span className="font-semibold">{profile.education?.jobBusiness || '-'}</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground font-medium">Annual Income</span><span className="font-semibold">{profile.education?.annualIncome || '-'}</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground font-medium">College</span><span className="font-semibold">{profile.education?.college || '-'}</span></li>
          </ul>
        </section>

        {/* Astrology */}
        {profile.astrology && (
          <section className="bg-card border rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6 border-b pb-4">Astrology (कुंडली)</h2>
            <ul className="space-y-4">
              <li className="flex justify-between"><span className="text-muted-foreground font-medium">Gothra</span><span className="font-semibold">{profile.astrology.gothra || '-'}</span></li>
              <li className="flex justify-between"><span className="text-muted-foreground font-medium">Rashi</span><span className="font-semibold">{profile.astrology.rashi || '-'}</span></li>
              <li className="flex justify-between"><span className="text-muted-foreground font-medium">Nakshatra</span><span className="font-semibold">{profile.astrology.nakshatra || '-'}</span></li>
              <li className="flex justify-between"><span className="text-muted-foreground font-medium">Mangal</span><span className="font-semibold">{profile.astrology.mangal || '-'}</span></li>
              <li className="flex justify-between"><span className="text-muted-foreground font-medium">Nadi</span><span className="font-semibold">{profile.astrology.nadi || '-'}</span></li>
            </ul>
          </section>
        )}

        {/* Family Background */}
        <section className="bg-card border rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6 border-b pb-4">Family Background</h2>
          <div className="grid grid-cols-2 gap-6">
            <div><p className="text-sm font-semibold text-muted-foreground mb-1">Father</p><p className="font-medium">{profile.family?.fatherOccupation || '-'}</p></div>
            <div><p className="text-sm font-semibold text-muted-foreground mb-1">Mother</p><p className="font-medium">{profile.family?.motherOccupation || '-'}</p></div>
            <div><p className="text-sm font-semibold text-muted-foreground mb-1">Brothers</p><p className="font-medium">{profile.family?.brothers ?? '0'}</p></div>
            <div><p className="text-sm font-semibold text-muted-foreground mb-1">Sisters</p><p className="font-medium">{profile.family?.sisters ?? '0'}</p></div>
          </div>
        </section>
        {/* Contact Info (If conditionally provided by backend) */}
        {profile.mobile && (
          <section className="bg-green-50 border border-green-200 rounded-2xl p-8 shadow-sm md:col-span-2">
            <h2 className="text-xl font-bold mb-4 text-green-900 border-b border-green-200 pb-4">Contact Information</h2>
            <div className="flex flex-col md:flex-row gap-8">
              <div>
                <p className="text-sm font-semibold text-green-700 mb-1">Mobile Number</p>
                <p className="font-bold text-lg text-green-950">{profile.mobile}</p>
              </div>
              {profile.email && (
                <div>
                  <p className="text-sm font-semibold text-green-700 mb-1">Email Address</p>
                  <p className="font-bold text-lg text-green-950">{profile.email}</p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
