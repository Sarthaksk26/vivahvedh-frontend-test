import React from 'react';
import type { Enquiry } from '../adminTypes';

interface EnquiryListProps {
  enquiries: Enquiry[];
  setReplyModal: (modal: { isOpen: boolean; enquiryId: string; email: string; message: string }) => void;
  handleResolveEnquiry: (id: string, resolved: boolean) => void;
}

export const EnquiryList: React.FC<EnquiryListProps> = ({ enquiries, setReplyModal, handleResolveEnquiry }) => {
  if (!enquiries?.length) {
    return <div className="p-20 text-center text-foreground/20 font-medium">No voices from the community today.</div>;
  }

  return (
    <div className="divide-y divide-black/[0.03]">
      {enquiries?.map((enq) => (
        <div key={enq.id} className={`p-10 transition-all group ${enq.isResolved ? 'bg-[#F2F4F6]/50 opacity-60' : 'hover:bg-[#F7F9FB]'}`}>
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-xl font-display font-black text-foreground">{enq.firstName} {enq.lastName}</h3>
                {enq.isResolved && <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Resolved</span>}
              </div>
              <p className="text-xs font-bold text-primary tracking-widest uppercase">{enq.email} • {enq.mobile}</p>
            </div>
            <span className="text-xs font-semibold text-foreground/40">{new Date(enq.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="p-8 bg-white rounded-3xl border border-black/5 shadow-premium text-foreground/60 leading-relaxed font-medium mb-4">
            {enq.message}
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setReplyModal({ isOpen: true, enquiryId: enq.id, email: enq.email, message: enq.message })}
              className="px-6 py-2 bg-primary/10 text-primary rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary/20 transition-colors"
            >
              Reply via Email
            </button>
            <button 
              onClick={() => handleResolveEnquiry(enq.id, !enq.isResolved)}
              className={`px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors ${enq.isResolved ? 'bg-black/5 text-foreground/50 hover:bg-black/10' : 'bg-green-500/10 text-green-600 hover:bg-green-500/20'}`}
            >
              {enq.isResolved ? 'Mark Unresolved' : 'Mark Resolved'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
