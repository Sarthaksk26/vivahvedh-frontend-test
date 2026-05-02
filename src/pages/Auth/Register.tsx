import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import apiClient from '../../lib/apiClient';
import { UserPlus, Sparkles, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import type { ApiErrorResponse } from '../../types';
import type { AxiosError } from 'axios';

const registerSchema = z.object({
  firstName: z.string().min(2, "First Name is required"),
  lastName: z.string().min(2, "Last Name is required"),
  mobile: z.string().min(10, "Valid mobile required").max(15),
  email: z.string().email("Valid email required"),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  maritalStatus: z.enum(['UNMARRIED', 'DIVORCED', 'WIDOWED', 'SEPARATED']),
  birthDate: z.string().refine((val) => {
    const dob = new Date(val);
    if (!val || isNaN(dob.getTime())) return false;
    const age = (Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    return age >= 18;
  }, { message: 'You must be at least 18 years old.' }),
  profileCreatedBy: z.enum(['Self', 'Father', 'Mother', 'Sibling', 'Relative', 'Friend', 'Marriage Bureau']).optional(),
  password: z.string().min(6, "Password must be 6+ characters"),
});

type RegisterForm = z.infer<typeof registerSchema>;

// Move impurity outside of render
const MAX_BIRTH_DATE = new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

export default function Register() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { profileCreatedBy: 'Self' }
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      const response = await apiClient.post('/auth/register', data);
      toast.success(() => (
        <span className="flex flex-col">
          <b className="text-sm">🎉 नोंदणी यशस्वी!</b>
          <span className="text-xs mt-1">Your RegID: <b>{response.data.regId}</b></span>
          <span className="text-[10px] opacity-60 mt-0.5">Please wait for admin approval to activate your account.</span>
        </span>
      ), { duration: 10000 });
      navigate('/login');
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const errorData = axiosError.response?.data?.error;
      
      const displayMsg = typeof errorData === 'string'
        ? errorData
        : Array.isArray(errorData)
          ? errorData.map((e: any) => e.message).join(', ')
          : "Check your details and try again.";

      toast.error(displayMsg);
      console.error(err);
    }
  };

  const inputClass = "flex h-12 w-full rounded-xl border border-input bg-background/80 px-4 text-sm placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/50 transition-all";

  return (
    <div className="min-h-[85vh] py-12 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-10 right-[10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-10 left-[10%] w-[300px] h-[300px] bg-amber-300/10 rounded-full blur-[100px]" />

      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8 relative">
        {/* Left - Benefits Panel */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="hidden md:flex flex-col justify-center w-80 flex-shrink-0"
        >
          <h2 className="text-3xl font-extrabold tracking-tight mb-3">
            आपल्या कुटुंबासाठी<br />
            <span className="text-primary">योग्य निवड</span>
          </h2>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
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
                <CheckCircle size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-foreground/80">{item.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right - Registration Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1"
        >
          <div className="bg-card/80 backdrop-blur-xl border shadow-2xl shadow-primary/5 rounded-3xl p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-rose-400 to-amber-400" />

            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UserPlus size={24} className="text-primary" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight mb-1">नोंदणी करा</h1>
              <p className="text-muted-foreground text-sm">Create your profile — It's free & takes 2 minutes</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-foreground/80">First Name *</label>
                  <input {...register("firstName")} className={inputClass} placeholder="पहिले नाव" />
                  {errors.firstName && <p className="text-red-500 text-xs font-medium">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-foreground/80">Last Name *</label>
                  <input {...register("lastName")} className={inputClass} placeholder="आडनाव" />
                  {errors.lastName && <p className="text-red-500 text-xs font-medium">{errors.lastName.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-foreground/80">Mobile Number *</label>
                  <input {...register("mobile")} type="tel" className={inputClass} placeholder="e.g. 9876543210" />
                  {errors.mobile && <p className="text-red-500 text-xs font-medium">{errors.mobile.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-foreground/80">Email *</label>
                  <input {...register("email")} type="email" className={inputClass} placeholder="email@example.com" />
                  {errors.email && <p className="text-red-500 text-xs font-medium">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-foreground/80">Gender *</label>
                  <select {...register("gender")} className={inputClass}>
                    <option value="">लिंग निवडा — Select</option>
                    <option value="MALE">पुरुष — Male</option>
                    <option value="FEMALE">स्त्री — Female</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-xs font-medium">Gender is required</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-foreground/80">Marital Status *</label>
                  <select {...register("maritalStatus")} className={inputClass}>
                    <option value="">वैवाहिक स्थिती — Select</option>
                    <option value="UNMARRIED">अविवाहित — Unmarried</option>
                    <option value="DIVORCED">घटस्फोटित — Divorced</option>
                    <option value="WIDOWED">विधवा/विधुर — Widowed</option>
                    <option value="SEPARATED">विभक्त — Separated</option>
                  </select>
                  {errors.maritalStatus && <p className="text-red-500 text-xs font-medium">Required</p>}
                </div>
              </div>

              {/* Date of Birth */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-foreground/80">
                  Date of Birth * <span className="text-xs font-normal text-muted-foreground">(Must be 18+)</span>
                </label>
                <input
                  {...register("birthDate")}
                  type="date"
                  max={MAX_BIRTH_DATE}
                  className={inputClass}
                />
                {errors.birthDate && <p className="text-red-500 text-xs font-medium">{errors.birthDate.message}</p>}
              </div>

              {/* Profile Created By — New Field */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-foreground/80">Profile Created By</label>
                <select {...register("profileCreatedBy")} className={inputClass}>
                  <option value="Self">स्वतः — Self</option>
                  <option value="Father">वडील — Father</option>
                  <option value="Mother">आई — Mother</option>
                  <option value="Sibling">भाऊ/बहीण — Sibling</option>
                  <option value="Relative">नातेवाईक — Relative</option>
                  <option value="Friend">मित्र — Friend</option>
                  <option value="Marriage Bureau">विवाह संस्था — Marriage Bureau</option>
                </select>
                {errors.profileCreatedBy && <p className="text-red-500 text-xs font-medium">Please select an option</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-foreground/80">Password *</label>
                <input {...register("password")} type="password" className={inputClass} placeholder="Minimum 6 characters" />
                {errors.password && <p className="text-red-500 text-xs font-medium">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white h-12 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-xl transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
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
              <p className="text-sm text-muted-foreground">
                Already registered?{" "}
                <Link to="/login" className="text-primary font-bold hover:underline">
                  लॉगिन करा — Sign In
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center mt-4 text-xs text-muted-foreground/60 flex items-center justify-center gap-1.5">
            <Sparkles size={12} className="text-primary/50" />
            नोंदणी केल्यावर Admin मान्यता आवश्यक • Profile approval within 24 hours
          </p>
        </motion.div>
      </div>
    </div>
  );
}
