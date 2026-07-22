import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import apiClient from '../../lib/apiClient';
import { UserPlus, CheckCircle, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatApiError } from '../../lib/errorUtils';
import { InfoModal } from '../../components/InfoModal';
import { SUPPORT_PHONE } from '../../lib/constants';
import { SEO } from '../../components/common/SEO';

const registerSchema = z.object({
  firstName: z.string().min(2, "First Name is required"),
  middleName: z.string().min(2, "Middle Name is required"),
  lastName: z.string().min(2, "Last Name is required"),
  mobile: z.string().min(10, "Valid mobile required").max(15),
  email: z.string().email("Valid email required"),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  maritalStatus: z.enum(['UNMARRIED', 'DIVORCED', 'WIDOWED', 'SEPARATED']),
  birthDate: z.string().refine((val) => {
    const dob = new Date(val);
    return val && !isNaN(dob.getTime());
  }, { message: 'Valid Date of Birth is required' }),
  profileCreatedBy: z.enum(['Self', 'Father', 'Mother', 'Sibling', 'Relative', 'Friend', 'Marriage Bureau']).optional(),
  kycType: z.enum(['AADHAR', 'PAN']),
  kycNumber: z.string().min(1, "KYC number is required"),
  password: z.string().min(8, "Password must be 8+ characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
}).refine((data) => {
  const dob = new Date(data.birthDate);
  const age = (Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  if (data.gender === 'MALE' && age < 21) return false;
  if (data.gender === 'FEMALE' && age < 18) return false;
  return true;
}, {
  message: "Legal marriage age in India is 21+ for Men and 18+ for Women.",
  path: ["birthDate"],
}).refine((data) => {
  if (data.kycType === 'AADHAR') {
    return /^\d{12}$/.test(data.kycNumber.trim());
  }
  return true;
}, {
  message: "Aadhaar number must be exactly 12 numbers",
  path: ["kycNumber"],
}).refine((data) => {
  if (data.kycType === 'PAN') {
    return /^[A-Za-z0-9]{10}$/.test(data.kycNumber.trim());
  }
  return true;
}, {
  message: "PAN number must be exactly 10 characters (e.g. ABCDE1234F)",
  path: ["kycNumber"],
});

type RegisterForm = z.infer<typeof registerSchema>;

// Move impurity outside of render
const MAX_BIRTH_DATE = new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { profileCreatedBy: 'Self' }
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      const { confirmPassword: _confirmPassword, ...payload } = data;
      const response = await apiClient.post('/auth/register', payload);
      toast.success(() => (
        <span className="flex flex-col">
          <b className="text-sm">🎉 नोंदणी यशस्वी!</b>
          <span className="text-xs mt-1">Your RegID: <b>{response.data.regId}</b></span>
          <span className="text-[10px] opacity-60 mt-0.5">Please wait for admin approval to activate your account.</span>
        </span>
      ), { duration: 10000 });
      setShowInfoModal(true);
    } catch (err: unknown) {
      toast.error(formatApiError(err, "Check your details and try again."));
      console.error(err);
    }
  };

  const inputClass = "input-cultural";

  return (
    <>
      <SEO 
        title="Register | Vivahvedh" 
        description="Create your free Vivahvedh profile to start your search for the perfect Maharashtrian bride or groom."
      />
      <div className="min-h-[85vh] py-12 flex items-center justify-center p-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #FFFCF5 0%, #FFF8EB 50%, #FFFCF5 100%)' }}
      >
      {/* Background */}
      <div className="absolute top-10 right-[10%] w-[400px] h-[400px] bg-kumkum-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-[10%] w-[300px] h-[300px] bg-haldi-400/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8 relative">
        {/* Left - Benefits Panel */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="hidden md:flex flex-col justify-center w-80 flex-shrink-0"
        >
          {/* Logo on benefits side */}
          <Link to="/" className="mb-8 inline-block">
            <img src="/logo.png" alt="विवाहवेध" className="w-44 h-auto object-contain mix-blend-multiply" />
          </Link>
          
          <h2 className="text-3xl font-display font-bold tracking-tight mb-3">
            आपल्या कुटुंबासाठी<br />
            <span className="text-primary">योग्य निवड</span>
          </h2>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed font-sans">
            Join Vivahvedh and get access to verified, trusted profiles from Maharashtrian families.
          </p>

          <div className="space-y-5">
            {[
              { text: 'मोफत नोंदणी — Registration is 100% free' },
              { text: 'सुरक्षित — All profiles manually verified' },
              { text: 'वैयक्तिक सेवा — Personal matchmaking available' },
              { text: 'गोपनीय — Your data is private & encrypted' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle size={18} className="text-paan-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-foreground/70 font-sans">{item.text}</p>
              </div>
            ))}
          </div>

          {/* Cultural decoration */}
          <div className="mt-10 flex items-center gap-3">
            <div className="w-8 h-px bg-haldi-500/30" />
            <span className="text-xs text-haldi-500/60 font-display italic">॥ शुभ विवाह ॥</span>
            <div className="w-8 h-px bg-haldi-500/30" />
          </div>
        </motion.div>

        {/* Right - Registration Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1"
        >
          <div className="bg-white/90 backdrop-blur-xl border border-border shadow-premium rounded-3xl p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-kumkum-500 via-haldi-500 to-kumkum-500" />

            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UserPlus size={24} className="text-primary" />
              </div>
              <h1 className="text-2xl font-display font-bold tracking-tight mb-1">नोंदणी करा</h1>
              <p className="text-muted-foreground text-sm font-ui">Create your profile — It's free & takes 2 minutes</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-foreground/80 font-ui">First Name *</label>
                  <input {...register("firstName")} className={inputClass} placeholder="पहिले नाव" />
                  {errors.firstName && <p className="text-red-500 text-xs font-medium font-ui">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-foreground/80 font-ui">Middle Name *</label>
                  <input {...register("middleName")} className={inputClass} placeholder="मधले नाव" />
                  {errors.middleName && <p className="text-red-500 text-xs font-medium font-ui">{errors.middleName.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-foreground/80 font-ui">Last Name *</label>
                  <input {...register("lastName")} className={inputClass} placeholder="आडनाव" />
                  {errors.lastName && <p className="text-red-500 text-xs font-medium font-ui">{errors.lastName.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-foreground/80 font-ui">Mobile Number *</label>
                  <input {...register("mobile")} type="tel" className={inputClass} placeholder="e.g. 9876543210" />
                  {errors.mobile && <p className="text-red-500 text-xs font-medium font-ui">{errors.mobile.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-foreground/80 font-ui">Email *</label>
                  <input {...register("email")} type="email" className={inputClass} placeholder="email@example.com" />
                  {errors.email && <p className="text-red-500 text-xs font-medium font-ui">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-foreground/80 font-ui">Gender *</label>
                  <select {...register("gender")} className={inputClass}>
                    <option value="">लिंग निवडा — Select</option>
                    <option value="MALE">पुरुष — Male</option>
                    <option value="FEMALE">स्त्री — Female</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-xs font-medium font-ui">Gender is required</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-foreground/80 font-ui">Marital Status *</label>
                  <select {...register("maritalStatus")} className={inputClass}>
                    <option value="">वैवाहिक स्थिती — Select</option>
                    <option value="UNMARRIED">अविवाहित — Unmarried</option>
                    <option value="DIVORCED">घटस्फोटित — Divorced</option>
                    <option value="WIDOWED">विधवा/विधुर — Widowed</option>
                    <option value="SEPARATED">विभक्त — Separated</option>
                  </select>
                  {errors.maritalStatus && <p className="text-red-500 text-xs font-medium font-ui">Required</p>}
                </div>
              </div>

              {/* Date of Birth */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-foreground/80 font-ui">
                  Date of Birth * <span className="text-xs font-normal text-muted-foreground">(Must be 18+)</span>
                </label>
                <input
                  {...register("birthDate")}
                  type="date"
                  max={MAX_BIRTH_DATE}
                  className={inputClass}
                />
                {errors.birthDate && <p className="text-red-500 text-xs font-medium font-ui">{errors.birthDate.message}</p>}
              </div>

              {/* Profile Created By — New Field */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-foreground/80 font-ui">Profile Created By</label>
                <select {...register("profileCreatedBy")} className={inputClass}>
                  <option value="Self">स्वतः — Self</option>
                  <option value="Father">वडील — Father</option>
                  <option value="Mother">आई — Mother</option>
                  <option value="Sibling">भाऊ/बहीण — Sibling</option>
                  <option value="Relative">नातेवाईक — Relative</option>
                  <option value="Friend">मित्र — Friend</option>
                  <option value="Marriage Bureau">विवाह संस्था — Marriage Bureau</option>
                </select>
                {errors.profileCreatedBy && <p className="text-red-500 text-xs font-medium font-ui">Please select an option</p>}
              </div>

              {/* KYC Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-foreground/80 font-ui">KYC Type *</label>
                  <select {...register("kycType")} className={inputClass}>
                    <option value="AADHAR">Aadhar Card</option>
                    <option value="PAN">PAN Card</option>
                  </select>
                  {errors.kycType && <p className="text-red-500 text-xs font-medium font-ui">{errors.kycType.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-foreground/80 font-ui">KYC Number *</label>
                  <input 
                    {...register("kycNumber")} 
                    type="text" 
                    className={inputClass} 
                    placeholder="Aadhar or PAN number" 
                  />
                  {errors.kycNumber && <p className="text-red-500 text-xs font-medium font-ui">{errors.kycNumber.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-foreground/80 font-ui">Password *</label>
                  <div className="relative">
                    <input 
                      {...register("password")} 
                      type={showPassword ? "text" : "password"} 
                      className={`${inputClass} pr-12`} 
                      placeholder="Minimum 8 characters" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs font-medium font-ui">{errors.password.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-foreground/80 font-ui">Confirm Password *</label>
                  <div className="relative">
                    <input 
                      {...register("confirmPassword")} 
                      type={showConfirmPassword ? "text" : "password"} 
                      className={`${inputClass} pr-12`} 
                      placeholder="Re-enter password" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs font-medium font-ui">{errors.confirmPassword.message}</p>}
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    required 
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary" 
                  />
                  <span className="text-xs text-muted-foreground leading-relaxed font-sans">
                    I agree to the <Link to="/terms-of-service" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl font-ui font-bold text-sm text-white shadow-kumkum transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #C41E2A 0%, #8B1218 100%)' }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Profile...
                  </>
                ) : (
                  'नोंदणी करा — Register Now'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground font-sans">
                Already registered?{" "}
                <Link to="/login" className="text-primary font-bold hover:underline">
                  लॉगिन करा — Sign In
                </Link>
              </p>
            </div>
          </div>

          <div className="text-center mt-4 flex items-center justify-center gap-3">
            <div className="w-6 h-px bg-haldi-500/30" />
            <p className="text-xs text-muted-foreground/50 font-ui">
              नोंदणी केल्यावर Admin मान्यता आवश्यक • Profile approval within 24 hours
            </p>
            <div className="w-6 h-px bg-haldi-500/30" />
          </div>
        </motion.div>
      </div>
    </div>

    <InfoModal
      isOpen={showInfoModal}
      onClose={() => {
        setShowInfoModal(false);
        navigate('/login');
      }}
      title="Registration Submitted for Review"
      message="Your profile has been submitted for review. Our team typically approves new profiles within 24 hours. Need help sooner?"
      phoneNumber={SUPPORT_PHONE}
      ctaLabel="OK, Got It"
    />
    </>
  );
}
