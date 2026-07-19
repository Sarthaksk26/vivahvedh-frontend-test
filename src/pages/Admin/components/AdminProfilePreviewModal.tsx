import React, { useState } from 'react';
import { X, User, Ruler, BookOpen, Users, MapPin, Phone, Image as ImageIcon, ShieldCheck } from 'lucide-react';
import { resolveImageUrl, DEFAULT_USER_AVATAR } from '../../../lib/url';
import type { AdminUser } from '../adminTypes';
import apiClient from '../../../lib/apiClient';
import { toast } from 'react-hot-toast';

interface AdminProfilePreviewModalProps {
  user: AdminUser;
  onClose: () => void;
}

const Section = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
  <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
        <Icon size={16} />
      </div>
      <h3 className="text-sm font-semibold text-foreground/70">{title}</h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {children}
    </div>
  </div>
);

const DataPoint = ({ label, value }: { label: string, value?: string | number | null }) => (
  <div className="space-y-1">
    <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/30">{label}</p>
    <p className="text-sm font-semibold text-foreground/80">{value || '—'}</p>
  </div>
);

export const AdminProfilePreviewModal: React.FC<AdminProfilePreviewModalProps> = ({ user: initialUser, onClose }) => {
  const [user, setUser] = useState(initialUser);
  const images = user.images || [];

  const handleToggleKyc = async () => {
    try {
      const response = await apiClient.patch(`/admin/users/${user.id}/kyc`, { kycVerified: !user.kycVerified });
      setUser((prev) => ({ ...prev, kycVerified: !prev.kycVerified }));
      toast.success(response.data.message || 'KYC status updated.');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update KYC status.');
    }
  };

  const handleViewDocument = async (type: 'kyc' | 'income' | 'medical') => {
    try {
      const res = await apiClient.get(`/documents/${type}?userId=${user.id}`);
      if (res.data.url) {
        window.open(res.data.url, '_blank');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to view document');
    }
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-start justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#F7F9FB] rounded-[40px] w-full max-w-4xl my-auto shadow-2xl border border-white/20">
        
        {/* Header */}
        <div className="sticky top-0 z-10 px-8 py-6 bg-white/80 backdrop-blur-xl border-b border-black/5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 overflow-hidden border border-primary/20">
              <img 
                src={resolveImageUrl(images[0]?.url || '')} 
                className="w-full h-full object-cover"
                alt="Avatar"
                onError={(e) => (e.currentTarget.src = DEFAULT_USER_AVATAR)}
              />
            </div>
            <div>
              <h2 className="text-xl font-display font-black text-foreground">
                {user.profile?.firstName} {user.profile?.middleName ? `${user.profile.middleName} ` : ''}{user.profile?.lastName}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary uppercase tracking-widest">{user.regId}</span>
                <span className="w-1 h-1 rounded-full bg-foreground/20" />
                <span className="text-xs font-semibold text-foreground/50">{user.accountStatus}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-black/5 hover:bg-black/10 rounded-2xl text-foreground/40 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          
          {/* Quick Stats / Images */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-4">
               <h3 className="text-sm font-semibold text-foreground/60 px-2 flex items-center gap-2">
                 <ImageIcon size={14} /> Photo Gallery
               </h3>
               <div className="grid grid-cols-2 gap-3">
                 {images.length > 0 ? images.map((img: any, i: number) => (
                   <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-black/5 shadow-sm group relative">
                     <img src={resolveImageUrl(img.url)} className="w-full h-full object-cover" alt="" />
                     <a href={resolveImageUrl(img.url)} target="_blank" rel="noreferrer" className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold uppercase">View Large</a>
                   </div>
                 )) : (
                   <div className="col-span-2 aspect-video bg-black/5 rounded-2xl flex flex-col items-center justify-center text-foreground/20">
                     <ImageIcon size={32} strokeWidth={1} />
                     <p className="text-[10px] font-bold mt-2">No photos uploaded</p>
                   </div>
                 )}
               </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Section title="Basic Profile" icon={User}>
                <DataPoint label="Full Name" value={`${user.profile?.firstName} ${user.profile?.middleName ? user.profile.middleName + ' ' : ''}${user.profile?.lastName}`} />
                <DataPoint label="Gender" value={user.profile?.gender} />
                <DataPoint label="Marital Status" value={user.profile?.maritalStatus} />
                <DataPoint label="Plan Type" value={user.planType} />
                <DataPoint label="Created By" value={(user as any).profileCreatedBy} />
              </Section>

              <Section title="Contact Information" icon={Phone}>
                <DataPoint label="Mobile Number" value={user.mobile} />
                <DataPoint label="Email Address" value={user.email} />
                <DataPoint label="Registration ID" value={user.regId} />
                <DataPoint label="Account Status" value={user.accountStatus} />
              </Section>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Section title="Physical & Lifestyle" icon={Ruler}>
              <DataPoint label="Height" value={user.physical?.height ? `${user.physical.height} in` : '—'} />
              <DataPoint label="Weight" value={user.physical?.weight ? `${user.physical.weight} kg` : '—'} />
            </Section>

            <Section title="Education & Career" icon={BookOpen}>
              <DataPoint label="Trade/Degree" value={user.education?.trade} />
              <DataPoint label="Occupation" value={user.education?.jobBusiness} />
              <DataPoint label="Annual Income" value={user.education?.annualIncome} />
            </Section>
          </div>

          <Section title="Family Background" icon={Users}>
            <DataPoint label="Father's Name" value={user.family?.fatherName} />
            <DataPoint label="Mother's Name" value={user.family?.motherName} />
            <DataPoint label="Mother's Hometown" value={user.family?.motherHometown} />
            <DataPoint label="Background" value={user.family?.familyBackground} />
          </Section>

          <Section title="Location" icon={MapPin}>
            {user.addresses && user.addresses.length > 0 ? user.addresses.map((addr, i) => (
              <React.Fragment key={i}>
                <DataPoint label="City" value={addr.city} />
                <DataPoint label="District/State" value={`${addr.district || ''}, ${addr.state || ''}`} />
              </React.Fragment>
            )) : <p className="text-sm text-foreground/40 italic col-span-2">No address provided</p>}
          </Section>

          <Section title="Verification & Documents" icon={ShieldCheck}>
            <div className="space-y-4 col-span-2">
              <div className="flex items-center justify-between p-4 bg-[#F7F9FB] rounded-2xl border border-black/5">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">KYC Verification</h4>
                  <p className="text-xs text-foreground/50 mt-1">Status: {user.kycVerified ? <span className="text-green-600 font-bold">Verified</span> : <span className="text-amber-600 font-bold">Unverified</span>}</p>
                </div>
                <button
                  onClick={handleToggleKyc}
                  className={`px-6 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    user.kycVerified ? 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20' : 'bg-green-500/10 text-green-600 hover:bg-green-500/20'
                  }`}
                >
                  {user.kycVerified ? 'Revoke KYC' : 'Verify KYC'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-black/5 rounded-2xl">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-2">KYC Document</p>
                  {user.kycDocumentUrl ? (
                    <button onClick={() => handleViewDocument('kyc')} className="text-primary text-xs font-bold hover:underline">View Document ({user.kycType || 'Unknown'})</button>
                  ) : (
                    <p className="text-xs text-foreground/40 mb-1">Not uploaded</p>
                  )}
                  {user.kycNumber && (
                    <p className="text-xs font-mono font-semibold text-foreground/80 mt-1">{user.kycNumber}</p>
                  )}
                </div>
                <div className="p-4 border border-black/5 rounded-2xl">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-2">Income Proof</p>
                  {user.education?.incomeProofUrl ? (
                    <button onClick={() => handleViewDocument('income')} className="text-primary text-xs font-bold hover:underline">View Document</button>
                  ) : (
                    <p className="text-xs text-foreground/40">Not uploaded</p>
                  )}
                </div>
                <div className="p-4 border border-black/5 rounded-2xl">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-2">Medical Report</p>
                  {user.physical?.medicalReportUrl ? (
                    <button onClick={() => handleViewDocument('medical')} className="text-primary text-xs font-bold hover:underline">View Document</button>
                  ) : (
                    <p className="text-xs text-foreground/40">Not uploaded</p>
                  )}
                </div>
              </div>
            </div>
          </Section>

          <div className="flex justify-center pt-8">
             <button 
               onClick={onClose}
               className="clay-button-secondary px-12 py-4 text-[10px] uppercase font-black tracking-[4px]"
             >
               Close Preview
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
