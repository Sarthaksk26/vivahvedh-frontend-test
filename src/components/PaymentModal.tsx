import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { motion } from 'framer-motion';
import { X, Upload, CheckCircle, AlertCircle, Phone } from 'lucide-react';
import apiClient from '../lib/apiClient';
import { SUPPORT_PHONE } from '../lib/constants';
import toast from 'react-hot-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planType: 'SILVER' | 'GOLD';
  price: number;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, planType, price }) => {
  const [txId, setTxId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Full reset on every open — prevents stale state if closed mid-upload
      setSubmitted(false);
      setTxId('');
      setFile(null);
      setLoading(false);
    }
  }, [isOpen]);

  const UPI_VPA = import.meta.env.VITE_UPI_VPA as string | undefined;

  const generateUPIUrl = () => {
    const vpa = UPI_VPA;
    const name = "Vivahvedh Matrimony";
    const txNote = `Plan_${planType}`;
    return vpa 
      ? `upi://pay?pa=${vpa}&pn=${encodeURIComponent(name)}&am=${price}&cu=INR&tn=${encodeURIComponent(txNote)}`
      : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txId || !file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('planType', planType);
    formData.append('amount', price.toString());
    formData.append('transactionId', txId);
    formData.append('screenshot', file);

    try {
      await apiClient.post('/payments/verify', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSubmitted(true);
      toast.success('Payment proof submitted successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-card bg-white w-full max-w-xl overflow-hidden shadow-premium"
      >
        {/* Header */}
        <div className="p-10 pb-6 flex justify-between items-start">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2 block">Premium Upgrade</span>
            <h2 className="text-3xl font-display font-black text-foreground">
              {planType === 'GOLD' ? 'Gold Membership' : 'Silver Membership'}
            </h2>
            <p className="text-sm text-foreground/60 mt-1 font-medium italic">Transform your search into a royal experience</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-[#F2F4F6] rounded-full transition-colors text-foreground/20 hover:text-foreground">
            <X className="w-6 h-6" />
          </button>
        </div>

        {submitted ? (
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-8"
            >
              <CheckCircle className="w-12 h-12 text-primary" />
            </motion.div>
            <h3 className="text-2xl font-display font-black text-foreground mb-4">Submission Received</h3>
            <p className="text-foreground/50 max-w-sm mx-auto font-medium leading-relaxed mb-8">
              Our curators are verifying your transaction. You will be notified once your premium status is active.
            </p>

            {/* Phone CTA — matches InfoModal style */}
            <a
              href={`tel:${SUPPORT_PHONE.replace(/\s/g, '')}`}
              className="flex items-center justify-center gap-4 px-8 py-5 bg-[#F7F9FB] rounded-2xl border border-black/5 hover:bg-primary/5 hover:border-primary/20 transition-all group mb-8 w-full max-w-xs"
            >
              <div className="w-12 h-12 rounded-xl bg-white shadow-ambient flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                <Phone size={20} className="text-primary" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Call Us</span>
                <span className="text-lg font-bold text-foreground">{SUPPORT_PHONE}</span>
              </div>
            </a>

            <button
              onClick={onClose}
              className="clay-button-primary px-12 py-4 text-xs uppercase tracking-widest"
            >
              Back to Community
            </button>
          </div>
        ) : (
          <div className="p-10 pt-0 space-y-10">
            {/* Split Layout for QR and Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              {/* QR Section */}
              <div className="flex flex-col items-center justify-center p-8 bg-[#F2F4F6] rounded-[40px] border border-black/5">
                <div className="p-4 bg-white rounded-3xl shadow-ambient">
                  {generateUPIUrl() ? (
                    <QRCodeCanvas value={generateUPIUrl()!} size={140} />
                  ) : (
                    <div className="w-[140px] h-[140px] flex flex-col items-center justify-center text-center p-3 bg-amber-50 rounded-2xl border border-amber-200">
                      <p className="text-amber-700 text-xs font-bold leading-relaxed">
                        QR Unavailable
                      </p>
                      <p className="text-amber-600 text-[10px] mt-1">
                        Pay manually to UPI ID below
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-8 text-center">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 mb-1">Amount Due</p>
                  <p className="text-3xl font-display font-black silk-gradient bg-clip-text text-transparent">₹{price}</p>
                  {UPI_VPA ? (
                    <p className="text-[10px] font-bold text-foreground/60 mt-3 uppercase tracking-widest">Scan with any UPI App</p>
                  ) : (
                    <p className="text-[10px] font-bold text-primary mt-3 font-mono">{/* fallback shown above */}</p>
                  )}
                </div>
              </div>

              {/* Form Section */}
              <form onSubmit={handleSubmit} className="space-y-8 flex flex-col justify-center">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60">Transaction ID</label>
                  <input
                    type="text"
                    required
                    value={txId}
                    onChange={(e) => setTxId(e.target.value)}
                    placeholder="Enter 12-digit Ref No."
                    className="w-full h-12 bg-transparent border-b-2 border-foreground/10 focus:border-primary transition-all focus:outline-none text-sm font-bold placeholder:font-medium placeholder:text-foreground/20"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60">Payment Proof</label>
                  <div
                    className={`relative group border-2 border-dashed rounded-[24px] p-6 transition-all cursor-pointer flex flex-col items-center justify-center
                      ${file ? 'border-primary/40 bg-primary/5' : 'border-black/10 hover:border-primary bg-transparent text-foreground/60'}`}
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <Upload className={`w-6 h-6 mb-3 ${file ? 'text-primary' : ''}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-center truncate w-full">
                      {file ? file.name : 'Upload Screenshot'}
                    </span>
                  </div>
                </div>
              </form>
            </div>

            <button
              onClick={(e) => handleSubmit(e as any)}
              disabled={loading || !txId || !file}
              className={`w-full py-5 rounded-full font-black text-xs uppercase tracking-[0.3em] transition-all shadow-premium
                ${loading || !txId || !file
                  ? 'bg-foreground/10 text-foreground/30 cursor-not-allowed shadow-none'
                  : 'clay-button-primary silk-gradient'}`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                'Confirm Transaction'
              )}
            </button>

            <div className="flex items-start gap-3 p-6 bg-[#F7F9FB] rounded-3xl border border-black/5 text-foreground/60">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary/40" />
              <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                Curator verification typically takes 24 hours. Your privacy is our priority during processing.
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
