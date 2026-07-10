import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import apiClient from '../lib/apiClient';
import toast from 'react-hot-toast';
import { formatApiError } from '../lib/errorUtils';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserId: string;
}

const REPORT_REASONS = [
  "Fake or fraudulent profile",
  "Abusive language or harassment",
  "Inappropriate photos",
  "Asking for money",
  "Already married",
  "Other"
];

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, targetUserId }) => {
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await apiClient.post('/user/report', { targetUserId, reason, description });
      toast.success(res.data.message || 'Profile reported successfully');
      onClose();
    } catch (err: unknown) {
      toast.error(formatApiError(err, 'Failed to submit report'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle size={24} />
              <h2 className="text-xl font-bold">Report Profile</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Reason for reporting</label>
              <select 
                value={reason} 
                onChange={(e) => setReason(e.target.value)} 
                className="w-full h-10 px-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500/30"
              >
                {REPORT_REASONS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-1">Additional details (Optional)</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please provide any specific details to help our team investigate..."
                className="w-full p-3 border rounded-lg bg-gray-50 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-red-500/30"
                maxLength={500}
              />
            </div>
            
            <p className="text-xs text-gray-500">
              Your report is strictly confidential. The user will not be notified that you reported them.
            </p>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
