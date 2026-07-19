import React, { useState } from 'react';
import { X, Save, User, Heart, GraduationCap, Users, Star, MapPin, Settings } from 'lucide-react';
import { toast } from 'react-hot-toast';
import apiClient from '../../../lib/apiClient';
import type { AdminUser } from '../adminTypes';

interface AdminUserEditModalProps {
  user: AdminUser;
  onClose: () => void;
  onUpdateSuccess: () => void;
}

type TabId = 'account' | 'profile' | 'physical' | 'education' | 'family' | 'astrology' | 'address';

const inputClass = "w-full px-4 py-3 rounded-xl bg-[#F7F9FB] border border-transparent text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all";
const selectClass = inputClass;
const labelClass = "block text-[11px] font-bold uppercase tracking-wider text-foreground/50 mb-1.5";
const textareaClass = "w-full px-4 py-3 rounded-xl bg-[#F7F9FB] border border-transparent text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all min-h-[80px] resize-y";

export const AdminUserEditModal: React.FC<AdminUserEditModalProps> = ({ user, onClose, onUpdateSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('account');

  // Flatten all user data into a single form state
  const [form, setForm] = useState({
    // Account
    mobile: user.mobile || '',
    email: user.email || '',
    accountStatus: user.accountStatus || 'INACTIVE',
    planType: user.planType || 'FREE',
    paymentDone: user.paymentDone ?? false,

    // Profile
    firstName: user.profile?.firstName || '',
    middleName: user.profile?.middleName || '',
    lastName: user.profile?.lastName || '',
    gender: user.profile?.gender || 'MALE',
    maritalStatus: user.profile?.maritalStatus || 'UNMARRIED',
    birthPlace: user.profile?.birthPlace || '',
    aboutMe: user.profile?.aboutMe || '',

    // Physical
    height: user.physical?.height || '',
    weight: user.physical?.weight?.toString() || '',
    bloodGroup: user.physical?.bloodGroup || '',
    complexion: user.physical?.complexion || '',
    disease: user.physical?.disease || '',
    diet: user.physical?.diet || '',
    smoke: user.physical?.smoke === true ? 'true' : user.physical?.smoke === false ? 'false' : '',
    drink: user.physical?.drink === true ? 'true' : user.physical?.drink === false ? 'false' : '',

    // Education
    trade: user.education?.trade || '',
    college: user.education?.college || '',
    jobBusiness: user.education?.jobBusiness || '',
    jobAddress: user.education?.jobAddress || '',
    annualIncome: user.education?.annualIncome || '',
    specialAchievement: user.education?.specialAchievement || '',

    // Family
    fatherName: user.family?.fatherName || '',
    fatherOccupation: user.family?.fatherOccupation || '',
    motherName: user.family?.motherName || '',
    motherOccupation: user.family?.motherOccupation || '',
    motherHometown: user.family?.motherHometown || '',
    maternalUncleName: user.family?.maternalUncleName || '',
    brothers: user.family?.brothers?.toString() || '0',
    marriedBrothers: user.family?.marriedBrothers?.toString() || '0',
    sisters: user.family?.sisters?.toString() || '0',
    marriedSisters: user.family?.marriedSisters?.toString() || '0',
    familyWealth: user.family?.familyWealth || '',

    // Astrology
    gothra: user.astrology?.gothra || '',
    rashi: user.astrology?.rashi || '',
    nakshatra: user.astrology?.nakshatra || '',
    charan: user.astrology?.charan || '',
    nadi: user.astrology?.nadi || '',
    gan: user.astrology?.gan || '',
    mangal: user.astrology?.mangal || '',

    // Address
    city: user.addresses?.[0]?.city || '',
    district: user.addresses?.[0]?.district || '',
    state: user.addresses?.[0]?.state || '',

    // Preferences
    expectations: (user.preferences as any)?.expectations || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: checked }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload: any = {
        mobile: form.mobile,
        email: form.email || null,
        accountStatus: form.accountStatus,
        planType: form.planType,
        paymentDone: form.paymentDone,
        profile: {
          firstName: form.firstName,
          middleName: form.middleName,
          lastName: form.lastName,
          gender: form.gender,
          maritalStatus: form.maritalStatus,
          birthPlace: form.birthPlace || null,
          aboutMe: form.aboutMe || null,
        },
        physical: {
          height: form.height || null,
          weight: form.weight ? parseInt(form.weight) : null,
          bloodGroup: form.bloodGroup || null,
          complexion: form.complexion || null,
          disease: form.disease || null,
          diet: form.diet || null,
          smoke: form.smoke === '' ? null : form.smoke === 'true',
          drink: form.drink === '' ? null : form.drink === 'true',
        },
        education: {
          trade: form.trade || null,
          college: form.college || null,
          jobBusiness: form.jobBusiness || null,
          jobAddress: form.jobAddress || null,
          annualIncome: form.annualIncome || null,
          specialAchievement: form.specialAchievement || null,
        },
        family: {
          fatherName: form.fatherName || null,
          fatherOccupation: form.fatherOccupation || null,
          motherName: form.motherName || null,
          motherOccupation: form.motherOccupation || null,
          motherHometown: form.motherHometown || null,
          maternalUncleName: form.maternalUncleName || null,
          brothers: parseInt(form.brothers) || 0,
          marriedBrothers: parseInt(form.marriedBrothers) || 0,
          sisters: parseInt(form.sisters) || 0,
          marriedSisters: parseInt(form.marriedSisters) || 0,
          familyWealth: form.familyWealth || null,
        },
        astrology: {
          gothra: form.gothra || null,
          rashi: form.rashi || null,
          nakshatra: form.nakshatra || null,
          charan: form.charan || null,
          nadi: form.nadi || null,
          gan: form.gan || null,
          mangal: form.mangal || null,
        },
        address: {
          city: form.city || null,
          district: form.district || null,
          state: form.state || null,
        },
        preferences: {
          expectations: form.expectations || null,
        },
      };

      await apiClient.patch(`/admin/users/${user.id}`, payload);
      toast.success('User updated successfully.');
      onUpdateSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update user.');
    } finally {
      setLoading(false);
    }
  };

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'account', label: 'Account', icon: <Settings size={16} /> },
    { id: 'profile', label: 'Profile', icon: <User size={16} /> },
    { id: 'physical', label: 'Physical', icon: <Heart size={16} /> },
    { id: 'education', label: 'Education', icon: <GraduationCap size={16} /> },
    { id: 'family', label: 'Family', icon: <Users size={16} /> },
    { id: 'astrology', label: 'Astrology', icon: <Star size={16} /> },
    { id: 'address', label: 'Address', icon: <MapPin size={16} /> },
  ];

  const Field = ({ label, name, type = 'text', placeholder = '' }: { label: string; name: string; type?: string; placeholder?: string }) => (
    <div>
      <label className={labelClass}>{label}</label>
      <input type={type} name={name} value={(form as any)[name]} onChange={handleChange} className={inputClass} placeholder={placeholder} />
    </div>
  );

  const SelectField = ({ label, name, options }: { label: string; name: string; options: { value: string; label: string }[] }) => (
    <div>
      <label className={labelClass}>{label}</label>
      <select name={name} value={(form as any)[name]} onChange={handleChange} className={selectClass}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );

  const TextArea = ({ label, name, placeholder = '' }: { label: string; name: string; placeholder?: string }) => (
    <div className="col-span-full">
      <label className={labelClass}>{label}</label>
      <textarea name={name} value={(form as any)[name]} onChange={handleChange} className={textareaClass} placeholder={placeholder} />
    </div>
  );

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: '90vh' }}>
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-black/5 bg-[#F7F9FB] shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Edit User — {user.regId}</h2>
            <p className="text-xs text-foreground/50">{user.profile?.firstName} {user.profile?.middleName} {user.profile?.lastName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 px-4 pt-3 pb-2 overflow-x-auto scrollbar-hide bg-[#F7F9FB] border-b border-black/5 shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-md'
                  : 'text-foreground/50 hover:bg-black/5'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Content — Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* ACCOUNT TAB */}
          {activeTab === 'account' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Mobile Number" name="mobile" placeholder="9876543210" />
              <Field label="Email" name="email" type="email" placeholder="user@email.com" />
              <SelectField label="Account Status" name="accountStatus" options={[
                { value: 'ACTIVE', label: '✅ Active' },
                { value: 'INACTIVE', label: '⏳ Inactive (Pending)' },
                { value: 'SUSPENDED', label: '🚫 Suspended' },
                { value: 'DELETED', label: '🗑️ Deleted' },
              ]} />
              <SelectField label="Plan Type" name="planType" options={[
                { value: 'FREE', label: 'Free' },
                { value: 'SILVER', label: '🥈 Silver' },
                { value: 'GOLD', label: '👑 Gold' },
              ]} />
              <div>
                <label className={labelClass}>Payment Done</label>
                <label className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#F7F9FB] cursor-pointer">
                  <input type="checkbox" name="paymentDone" checked={form.paymentDone} onChange={handleCheckbox} className="w-4 h-4 accent-primary" />
                  <span className="text-sm font-medium">{form.paymentDone ? 'Yes — Paid' : 'No — Not Paid'}</span>
                </label>
              </div>
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="First Name" name="firstName" placeholder="Rajesh" />
              <Field label="Middle Name" name="middleName" placeholder="Kumar" />
              <Field label="Last Name" name="lastName" placeholder="Patil" />
              <SelectField label="Gender" name="gender" options={[
                { value: 'MALE', label: 'Male' },
                { value: 'FEMALE', label: 'Female' },
                { value: 'OTHER', label: 'Other' },
              ]} />
              <SelectField label="Marital Status" name="maritalStatus" options={[
                { value: 'UNMARRIED', label: 'Unmarried' },
                { value: 'DIVORCED', label: 'Divorced' },
                { value: 'WIDOWED', label: 'Widowed' },
                { value: 'SEPARATED', label: 'Separated' },
              ]} />
              <Field label="Birth Place" name="birthPlace" placeholder="Pune" />
              <TextArea label="About Me" name="aboutMe" placeholder="A brief bio..." />
            </div>
          )}

          {/* PHYSICAL TAB */}
          {activeTab === 'physical' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Height (cm)" name="height" placeholder="170" />
              <Field label="Weight (kg)" name="weight" type="number" placeholder="70" />
              <SelectField label="Blood Group" name="bloodGroup" options={[
                { value: '', label: 'Select' },
                ...['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(v => ({ value: v, label: v }))
              ]} />
              <SelectField label="Complexion" name="complexion" options={[
                { value: '', label: 'Select' },
                { value: 'Fair', label: 'Fair' },
                { value: 'Wheatish', label: 'Wheatish' },
                { value: 'Medium', label: 'Medium' },
                { value: 'Dark', label: 'Dark' },
              ]} />
              <SelectField label="Diet" name="diet" options={[
                { value: '', label: 'Select' },
                { value: 'Vegetarian', label: 'Vegetarian' },
                { value: 'Non-Vegetarian', label: 'Non-Vegetarian' },
              ]} />
              <Field label="Disease / Illness" name="disease" placeholder="None" />
              <SelectField label="Smoke" name="smoke" options={[
                { value: '', label: 'Not Set' },
                { value: 'true', label: 'Yes' },
                { value: 'false', label: 'No' },
              ]} />
              <SelectField label="Drink" name="drink" options={[
                { value: '', label: 'Not Set' },
                { value: 'true', label: 'Yes' },
                { value: 'false', label: 'No' },
              ]} />
            </div>
          )}

          {/* EDUCATION TAB */}
          {activeTab === 'education' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Qualification / Trade" name="trade" placeholder="B.E., M.B.A." />
              <Field label="College / University" name="college" placeholder="Name of college" />
              <Field label="Job / Business" name="jobBusiness" placeholder="Software Engineer" />
              <Field label="Job Address" name="jobAddress" placeholder="Mumbai, Maharashtra" />
              <Field label="Annual Income" name="annualIncome" placeholder="15 LPA" />
              <TextArea label="Special Achievements" name="specialAchievement" placeholder="Awards, recognitions..." />
            </div>
          )}

          {/* FAMILY TAB */}
          {activeTab === 'family' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Father's Name" name="fatherName" />
              <Field label="Father's Occupation" name="fatherOccupation" />
              <Field label="Mother's Name" name="motherName" />
              <Field label="Mother's Occupation" name="motherOccupation" />
              <Field label="Mother's Hometown" name="motherHometown" />
              <Field label="Maternal Uncle's Name" name="maternalUncleName" />

              <div className="col-span-full grid grid-cols-2 md:grid-cols-4 gap-4">
                <Field label="Brothers" name="brothers" type="number" />
                <Field label="Married Brothers" name="marriedBrothers" type="number" />
                <Field label="Sisters" name="sisters" type="number" />
                <Field label="Married Sisters" name="marriedSisters" type="number" />
              </div>

              <TextArea label="Family Wealth / Property" name="familyWealth" placeholder="Agriculture land, flats, etc." />
            </div>
          )}

          {/* ASTROLOGY TAB */}
          {activeTab === 'astrology' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Gothra" name="gothra" />
              <SelectField label="Rashi" name="rashi" options={[
                { value: '', label: 'Select' },
                ...['मेष','वृषभ','मिथुन','कर्क','सिंह','कन्या','तूला','वृश्चिक','धनु','मकर','कुंभ','मीन'].map(v => ({ value: v, label: v }))
              ]} />
              <Field label="Nakshatra" name="nakshatra" />
              <Field label="Charan" name="charan" />
              <SelectField label="Nadi" name="nadi" options={[
                { value: '', label: 'Select' },
                { value: 'आद्य', label: 'आद्य' },
                { value: 'मध्य', label: 'मध्य' },
                { value: 'अंत्य', label: 'अंत्य' },
              ]} />
              <SelectField label="Gan" name="gan" options={[
                { value: '', label: 'Select' },
                { value: 'देव', label: 'देव' },
                { value: 'मानव', label: 'मानव' },
                { value: 'राक्षस', label: 'राक्षस' },
              ]} />
              <SelectField label="Mangal" name="mangal" options={[
                { value: '', label: 'Select' },
                { value: 'Yes', label: 'Yes (आहे)' },
                { value: 'No', label: 'No (नाही)' },
                { value: 'Partial', label: 'Partial (अंशतः)' },
              ]} />
            </div>
          )}

          {/* ADDRESS TAB */}
          {activeTab === 'address' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="City / Village" name="city" />
                <Field label="District" name="district" />
                <Field label="State" name="state" />
              </div>
              <TextArea label="Partner Expectations" name="expectations" placeholder="Describe expectations..." />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center gap-3 px-6 py-4 border-t border-black/5 bg-[#F7F9FB] shrink-0">
          <p className="text-[10px] text-foreground/30 font-medium">All changes are saved to the database immediately.</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-foreground/70 hover:bg-black/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-3 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Saving...' : <><Save size={16} /> Save All Changes</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
