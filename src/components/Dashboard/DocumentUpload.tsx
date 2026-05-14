import { useState } from 'react';
import { UploadCloud, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import apiClient from '../../lib/apiClient';
import toast from 'react-hot-toast';
import type { FullUserProfile } from '../../types';

interface DocumentUploadProps {
  profile: FullUserProfile;
  onUploadSuccess: () => void;
}

export default function DocumentUpload({ profile, onUploadSuccess }: DocumentUploadProps) {
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);
  const [kycType, setKycType] = useState<'AADHAR' | 'PAN' | 'PASSPORT'>('AADHAR');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, target: 'kyc' | 'income' | 'medical') => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB.');
      return;
    }

    setUploadingTarget(target);
    const formData = new FormData();
    formData.append('document', file);

    try {
      if (target === 'kyc') {
        formData.append('kycType', kycType);
        await apiClient.post('/user/upload-kyc', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else if (target === 'income') {
        await apiClient.post('/user/upload-income-proof', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else if (target === 'medical') {
        await apiClient.post('/user/upload-medical-report', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      toast.success('Document uploaded successfully!');
      onUploadSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to upload document.');
    } finally {
      setUploadingTarget(null);
      if (event.target) event.target.value = '';
    }
  };

  const getStatusBadge = (isUploaded: boolean, isVerified: boolean = false) => {
    if (isVerified) {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
          <CheckCircle size={14} /> Verified
        </span>
      );
    }
    if (isUploaded) {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
          <Clock size={14} /> Pending Verification
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold">
        <AlertCircle size={14} /> Not Uploaded
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border shadow-sm rounded-3xl p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2 mb-2">
          <FileText className="text-primary" /> Identity Verification (KYC)
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          Upload a valid government ID. This builds trust and ensures the authenticity of profiles on our platform.
        </p>

        <div className="bg-muted/30 border rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="font-bold text-lg mb-2">Government ID</h3>
            <div className="flex items-center gap-4 mb-4">
              <label className="text-sm font-semibold text-foreground/80">Select ID Type:</label>
              <select 
                value={kycType}
                onChange={(e) => setKycType(e.target.value as any)}
                className="px-3 py-1.5 border rounded-lg bg-background text-sm font-medium"
                disabled={!!profile.kycDocumentUrl}
              >
                <option value="AADHAR">Aadhar Card</option>
                <option value="PAN">PAN Card</option>
                <option value="PASSPORT">Passport</option>
              </select>
            </div>
            {getStatusBadge(!!profile.kycDocumentUrl, profile.kycVerified)}
          </div>

          <div className="relative">
            <input 
              type="file" 
              accept="image/*,.pdf" 
              onChange={(e) => handleFileUpload(e, 'kyc')}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              disabled={uploadingTarget === 'kyc'}
            />
            <button 
              disabled={uploadingTarget === 'kyc'}
              className="px-6 py-3 bg-primary text-white font-bold rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50"
            >
              <UploadCloud size={18} />
              {uploadingTarget === 'kyc' ? 'Uploading...' : profile.kycDocumentUrl ? 'Update Document' : 'Upload Document'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card border shadow-sm rounded-3xl p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">Optional Verification Documents</h2>
        <p className="text-muted-foreground text-sm mb-6">
          While optional, adding these documents drastically increases the credibility of your profile.
        </p>

        <div className="space-y-4">
          <div className="bg-muted/30 border rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="font-bold text-lg mb-2">Income Proof <span className="text-xs font-normal text-muted-foreground ml-2">(Optional)</span></h3>
              <p className="text-sm text-foreground/60 mb-3">Salary slip, Form 16, or ITR.</p>
              {getStatusBadge(!!profile.education?.incomeProofUrl)}
            </div>

            <div className="relative">
              <input 
                type="file" 
                accept="image/*,.pdf" 
                onChange={(e) => handleFileUpload(e, 'income')}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                disabled={uploadingTarget === 'income'}
              />
              <button 
                disabled={uploadingTarget === 'income'}
                className="px-6 py-3 bg-white border-2 border-primary text-primary font-bold rounded-xl flex items-center gap-2 hover:bg-primary/5 transition-all disabled:opacity-50"
              >
                <UploadCloud size={18} />
                {uploadingTarget === 'income' ? 'Uploading...' : profile.education?.incomeProofUrl ? 'Update Proof' : 'Upload Proof'}
              </button>
            </div>
          </div>

          <div className="bg-muted/30 border rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="font-bold text-lg mb-2">Medical Report <span className="text-xs font-normal text-muted-foreground ml-2">(Optional)</span></h3>
              <p className="text-sm text-foreground/60 mb-3">General health checkup or fitness certificate.</p>
              {getStatusBadge(!!profile.physical?.medicalReportUrl)}
            </div>

            <div className="relative">
              <input 
                type="file" 
                accept="image/*,.pdf" 
                onChange={(e) => handleFileUpload(e, 'medical')}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                disabled={uploadingTarget === 'medical'}
              />
              <button 
                disabled={uploadingTarget === 'medical'}
                className="px-6 py-3 bg-white border-2 border-primary text-primary font-bold rounded-xl flex items-center gap-2 hover:bg-primary/5 transition-all disabled:opacity-50"
              >
                <UploadCloud size={18} />
                {uploadingTarget === 'medical' ? 'Uploading...' : profile.physical?.medicalReportUrl ? 'Update Report' : 'Upload Report'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
