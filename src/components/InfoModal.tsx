import React from 'react';
import { motion } from 'framer-motion';
import { Phone, CheckCircle } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  phoneNumber: string;
  ctaLabel?: string;
}

/**
 * Blocking modal that requires explicit acknowledgment via the CTA button.
 * Will NOT close on backdrop click or Escape — only `onClose` via the button.
 * Matches the visual language of PaymentModal (glass-card, backdrop-blur, clay-button-primary, etc.).
 */
export const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  phoneNumber,
  ctaLabel = 'OK, Got It',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-card bg-white w-full max-w-lg overflow-hidden shadow-premium rounded-3xl p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center flex flex-col items-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6"
          >
            <CheckCircle className="w-10 h-10 text-primary" />
          </motion.div>

          {/* Title */}
          <h3 className="text-2xl font-display font-black text-foreground mb-3">
            {title}
          </h3>

          {/* Message body */}
          <p className="text-foreground/50 max-w-sm mx-auto font-medium leading-relaxed mb-8">
            {message}
          </p>

          {/* Phone number CTA card */}
          <a
            href={`tel:${phoneNumber.replace(/\s/g, '')}`}
            className="flex items-center justify-center gap-4 px-8 py-5 bg-[#F7F9FB] rounded-2xl border border-black/5 hover:bg-primary/5 hover:border-primary/20 transition-all group mb-8 w-full max-w-xs"
          >
            <div className="w-12 h-12 rounded-xl bg-white shadow-ambient flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
              <Phone size={20} className="text-primary" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Call Us</span>
              <span className="text-lg font-bold text-foreground">{phoneNumber}</span>
            </div>
          </a>

          {/* Acknowledgment button */}
          <button
            onClick={onClose}
            className="clay-button-primary px-12 py-4 text-xs uppercase tracking-widest"
          >
            {ctaLabel}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default InfoModal;
