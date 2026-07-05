import React from 'react';
import { Check, X as CloseIcon } from 'lucide-react';
import { resolveImageUrl } from '../../../lib/url';
import type { PaymentRecord } from '../adminTypes';

interface PaymentListProps {
  payments: PaymentRecord[];
  paymentFilter: string;
  setPaymentFilter: (filter: string) => void;
  handleVerifyPayment: (id: string, status: 'APPROVED' | 'REJECTED') => void;
}

export const PaymentList: React.FC<PaymentListProps> = ({ 
  payments, 
  paymentFilter, 
  setPaymentFilter, 
  handleVerifyPayment 
}) => {
  return (
    <div>
      <div className="px-10 py-6 border-b border-black/[0.03] flex gap-4 bg-white">
        {['PENDING', 'APPROVED', 'REJECTED'].map(f => (
          <button
            key={f}
            onClick={() => setPaymentFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all
              ${paymentFilter === f ? 'bg-primary text-white shadow-md' : 'bg-black/5 text-foreground/40 hover:bg-black/10'}`}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="divide-y divide-black/[0.03]">
        {!payments?.length ? (
          <div className="p-20 text-center text-foreground/20 font-medium">No payments found for this filter.</div>
        ) : (
          payments?.map((pay) => (
            <div key={pay.id} className="p-10 flex flex-col md:flex-row gap-8 hover:bg-[#F7F9FB] transition-colors">
              <div className="w-full md:w-64 h-80 bg-black/5 rounded-3xl overflow-hidden border border-black/5 flex-shrink-0 group relative">
                <img src={resolveImageUrl(pay.screenshotUrl)} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <a href={resolveImageUrl(pay.screenshotUrl)} target="_blank" rel="noreferrer" className="bg-white text-black px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest">View Full Size</a>
                </div>
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-display font-black text-foreground">{pay.user?.regId}</h3>
                      <p className="text-xs font-bold text-primary tracking-widest uppercase">{pay.user?.email} • {pay.user?.mobile}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-2xl font-black text-sm ${pay.status === 'APPROVED' ? 'bg-green-100 text-green-700' : pay.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-primary/10 text-primary'}`}>₹{pay.amount}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-white rounded-2xl border border-black/5 shadow-premium">
                      <p className="text-xs font-semibold text-foreground/50 mb-1">Plan Requested</p>
                      <p className="text-sm font-bold text-foreground">{pay.planType} <span className="text-primary text-xs">(₹{pay.amount} claimed)</span></p>
                    </div>
                    <div className="p-4 bg-white rounded-2xl border border-black/5 shadow-premium">
                      <p className="text-xs font-semibold text-foreground/50 mb-1">Transaction ID</p>
                      <p className="text-sm font-bold text-foreground font-mono">{pay.transactionId}</p>
                    </div>
                  </div>
                </div>
                {pay.status === 'PENDING' && (
                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleVerifyPayment(pay.id, 'APPROVED')}
                      className="flex-1 h-14 bg-green-500 text-white rounded-2xl font-display font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-green-500/20 hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                    >
                      <Check size={18} /> Approve Plan
                    </button>
                    <button 
                      onClick={() => handleVerifyPayment(pay.id, 'REJECTED')}
                      className="flex-1 h-14 bg-red-500/10 text-red-500 rounded-2xl font-display font-black text-xs uppercase tracking-[0.2em] hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <CloseIcon size={18} /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
