import React from 'react';
import { UserPlus, Check, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

interface OfflineForm {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  gender: string;
  maritalStatus: string;
  profileCreatedBy: string;
}

interface OfflineUserFormProps {
  offlineForm: OfflineForm;
  handleOfflineFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleOfflineSubmit: (e: React.FormEvent) => void;
  offlineSubmitting: boolean;
  offlineSuccess: { regId: string; name: string; email: string; tempPassword?: string } | null;
  offlineError: string;
}

export const OfflineUserForm: React.FC<OfflineUserFormProps> = ({
  offlineForm,
  handleOfflineFormChange,
  handleOfflineSubmit,
  offlineSubmitting,
  offlineSuccess,
  offlineError,
}) => {
  const inputClass = "w-full h-12 rounded-xl border border-black/10 bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all";

  return (
    <div className="p-10 max-w-2xl mx-auto">
      {offlineSuccess && (
        <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-2xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
              <Check size={20} />
            </div>
            <div>
              <h3 className="font-black text-green-800 text-lg">Profile Created Successfully!</h3>
              <p className="text-green-700 text-sm font-medium">RegID: <strong>{offlineSuccess.regId}</strong></p>
            </div>
          </div>
          <p className="text-green-700 text-sm leading-relaxed mb-4">
            Login credentials have been sent to <strong>{offlineSuccess.email}</strong>. 
            It is recommended that the user ({offlineSuccess.name}) changes their password on first login.
          </p>
          {offlineSuccess.tempPassword && (
            <div className="mt-4 p-4 bg-white rounded-xl border border-green-200 flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-green-700 uppercase tracking-widest mb-1">Temporary Password</span>
                <span className="font-mono text-lg font-black text-green-900">{offlineSuccess.tempPassword}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(offlineSuccess.tempPassword || '');
                  toast.success('Password copied to clipboard');
                }}
                className="p-3 bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 rounded-xl transition-colors"
                title="Copy Password"
              >
                <Copy size={18} />
              </button>
            </div>
          )}
          <div className="mt-4 p-3 bg-amber-50 rounded-xl text-amber-800 text-xs font-bold border border-amber-200">
            ⚠️ Save this password now. It will not be shown again.
          </div>
        </div>
      )}

      {offlineError && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-medium">
          ❌ {offlineError}
        </div>
      )}

      <form onSubmit={handleOfflineSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground/70">First Name *</label>
            <input name="firstName" value={offlineForm.firstName} onChange={handleOfflineFormChange} required className={inputClass} placeholder="पहिले नाव" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground/70">Last Name *</label>
            <input name="lastName" value={offlineForm.lastName} onChange={handleOfflineFormChange} required className={inputClass} placeholder="आडनाव" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground/70">Mobile Number *</label>
            <input name="mobile" type="tel" value={offlineForm.mobile} onChange={handleOfflineFormChange} required className={inputClass} placeholder="e.g. 9876543210" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground/70">Email *</label>
            <input name="email" type="email" value={offlineForm.email} onChange={handleOfflineFormChange} required className={inputClass} placeholder="email@example.com" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground/70">Gender *</label>
            <select name="gender" value={offlineForm.gender} onChange={handleOfflineFormChange} required className={inputClass}>
              <option value="">लिंग निवडा — Select</option>
              <option value="MALE">पुरुष — Male</option>
              <option value="FEMALE">स्त्री — Female</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground/70">Marital Status *</label>
            <select name="maritalStatus" value={offlineForm.maritalStatus} onChange={handleOfflineFormChange} required className={inputClass}>
              <option value="">वैवाहिक स्थिती — Select</option>
              <option value="UNMARRIED">अविवाहित — Unmarried</option>
              <option value="DIVORCED">घटस्फोटित — Divorced</option>
              <option value="WIDOWED">विधवा/विधुर — Widowed</option>
              <option value="SEPARATED">विभक्त — Separated</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground/70">Profile Created By</label>
          <select name="profileCreatedBy" value={offlineForm.profileCreatedBy} onChange={handleOfflineFormChange} className={inputClass}>
            <option value="Marriage Bureau">विवाह संस्था — Marriage Bureau</option>
            <option value="Self">स्वतः — Self</option>
            <option value="Father">वडील — Father</option>
            <option value="Mother">आई — Mother</option>
            <option value="Sibling">भाऊ/बहीण — Sibling</option>
            <option value="Relative">नातेवाईक — Relative</option>
            <option value="Friend">मित्र — Friend</option>
          </select>
        </div>

        <div className="pt-4 border-t border-black/5">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6">
            <p className="text-amber-800 text-sm font-medium">
              ⚡ A secure temporary password will be auto-generated and emailed to the customer. 
              They can change it later if they prefer.
            </p>
          </div>

          <button
            type="submit"
            disabled={offlineSubmitting}
            className="w-full bg-primary text-white h-14 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-xl transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-widest"
          >
            {offlineSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating Profile...
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Create & Send Credentials
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
