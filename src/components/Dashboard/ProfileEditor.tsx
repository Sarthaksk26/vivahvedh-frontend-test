import { useState } from 'react';
import apiClient from '../../lib/apiClient';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SectionProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({ title, icon, children, defaultOpen = false }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
      >
        <span className="font-bold text-sm flex items-center gap-2">
          <span>{icon}</span> {title}
        </span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && <div className="p-5 space-y-4">{children}</div>}
    </div>
  );
}

const inputClass = "w-full h-10 px-3 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";
const selectClass = inputClass;
const textareaClass = "w-full min-h-[100px] p-3 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

export default function ProfileEditor({
  currentData,
  onSaveSuccess
}: {
  currentData: any;
  onSaveSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    // Personal
    aboutMe: currentData.profile?.aboutMe || '',
    // Physical
    height: currentData.physical?.height || '',
    weight: currentData.physical?.weight || '',
    bloodGroup: currentData.physical?.bloodGroup || '',
    complexion: currentData.physical?.complexion || '',
    diet: currentData.physical?.diet || '',
    smoke: currentData.physical?.smoke ?? '',
    drink: currentData.physical?.drink ?? '',
    // Education
    trade: currentData.education?.trade || '',
    college: currentData.education?.college || '',
    jobBusiness: currentData.education?.jobBusiness || '',
    annualIncome: currentData.education?.annualIncome || '',
    specialAchievement: currentData.education?.specialAchievement || '',
    // Family
    fatherName: currentData.family?.fatherName || '',
    fatherOccupation: currentData.family?.fatherOccupation || '',
    motherName: currentData.family?.motherName || '',
    motherOccupation: currentData.family?.motherOccupation || '',
    motherHometown: currentData.family?.motherHometown || '',
    maternalUncleName: currentData.family?.maternalUncleName || '',
    brothers: currentData.family?.brothers || 0,
    marriedBrothers: currentData.family?.marriedBrothers || 0,
    sisters: currentData.family?.sisters || 0,
    marriedSisters: currentData.family?.marriedSisters || 0,
    familyWealth: currentData.family?.familyWealth || '',
    // Astrology
    gothra: currentData.astrology?.gothra || '',
    rashi: currentData.astrology?.rashi || '',
    nakshatra: currentData.astrology?.nakshatra || '',
    charan: currentData.astrology?.charan || '',
    nadi: currentData.astrology?.nadi || '',
    gan: currentData.astrology?.gan || '',
    mangal: currentData.astrology?.mangal || '',
    // Preferences
    expectations: currentData.preferences?.expectations || '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: value === '' ? '' : parseInt(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      profile: {
        aboutMe: formData.aboutMe || null
      },
      physical: {
        height: parseInt(String(formData.height)) || null,
        weight: parseInt(String(formData.weight)) || null,
        bloodGroup: formData.bloodGroup || null,
        complexion: formData.complexion || null,
        diet: formData.diet || null,
        smoke: formData.smoke === '' ? null : formData.smoke === 'true',
        drink: formData.drink === '' ? null : formData.drink === 'true'
      },
      education: {
        trade: formData.trade || null,
        college: formData.college || null,
        jobBusiness: formData.jobBusiness || null,
        annualIncome: formData.annualIncome || null,
        specialAchievement: formData.specialAchievement || null
      },
      family: {
        fatherName: formData.fatherName || null,
        fatherOccupation: formData.fatherOccupation || null,
        motherName: formData.motherName || null,
        motherOccupation: formData.motherOccupation || null,
        motherHometown: formData.motherHometown || null,
        maternalUncleName: formData.maternalUncleName || null,
        brothers: parseInt(String(formData.brothers)) || 0,
        marriedBrothers: parseInt(String(formData.marriedBrothers)) || 0,
        sisters: parseInt(String(formData.sisters)) || 0,
        marriedSisters: parseInt(String(formData.marriedSisters)) || 0,
        familyWealth: formData.familyWealth || null
      },
      astrology: {
        gothra: formData.gothra || null,
        rashi: formData.rashi || null,
        nakshatra: formData.nakshatra || null,
        charan: formData.charan || null,
        nadi: formData.nadi || null,
        gan: formData.gan || null,
        mangal: formData.mangal || null
      },
      preferences: {
        expectations: formData.expectations || null
      }
    };

    try {
      await apiClient.patch('/user/update', payload);
      alert('Profile updated successfully!');
      onSaveSuccess();
    } catch (err: any) {
      alert("Failed to save changes.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <CollapsibleSection title="About Me" icon="✍️" defaultOpen={true}>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-muted-foreground">Tell us about yourself</label>
          <textarea name="aboutMe" value={formData.aboutMe} onChange={handleChange} className={textareaClass} placeholder="Write a brief description about yourself, your hobbies, what you're looking for..." />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Physical Attributes" icon="📏">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground">Height (cm)</label>
            <input type="number" name="height" value={formData.height} onChange={handleChange} className={inputClass} placeholder="175" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground">Weight (kg)</label>
            <input type="number" name="weight" value={formData.weight} onChange={handleChange} className={inputClass} placeholder="70" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground">Blood Group</label>
            <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className={selectClass}>
              <option value="">Select</option>
              {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground">Complexion</label>
            <select name="complexion" value={formData.complexion} onChange={handleChange} className={selectClass}>
              <option value="">Select</option>
              <option value="Fair">Fair</option>
              <option value="Wheatish">Wheatish</option>
              <option value="Medium">Medium</option>
              <option value="Dark">Dark</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground">Diet</label>
            <select name="diet" value={formData.diet} onChange={handleChange} className={selectClass}>
              <option value="">Select</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Eggetarian">Eggetarian</option>
              <option value="Vegan">Vegan</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground">Smoke</label>
            <select name="smoke" value={String(formData.smoke)} onChange={handleChange} className={selectClass}>
              <option value="">Select</option>
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground">Drink</label>
            <select name="drink" value={String(formData.drink)} onChange={handleChange} className={selectClass}>
              <option value="">Select</option>
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Education & Career" icon="🎓">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground">Qualification / Trade</label>
            <input type="text" name="trade" value={formData.trade} onChange={handleChange} className={inputClass} placeholder="B.E., M.B.A., etc." />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground">College / University</label>
            <input type="text" name="college" value={formData.college} onChange={handleChange} className={inputClass} placeholder="Name of college" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground">Profession / Business</label>
            <input type="text" name="jobBusiness" value={formData.jobBusiness} onChange={handleChange} className={inputClass} placeholder="Software Engineer" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground">Annual Income</label>
            <input type="text" name="annualIncome" value={formData.annualIncome} onChange={handleChange} className={inputClass} placeholder="15 LPA" />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-semibold text-muted-foreground">Special Achievement</label>
            <textarea name="specialAchievement" value={formData.specialAchievement} onChange={handleChange} className={textareaClass} placeholder="Any awards, achievements, or special skills..." />
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Family Details" icon="👨‍👩‍👧‍👦">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground">Father&apos;s Name</label>
            <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground">Father&apos;s Occupation</label>
            <input type="text" name="fatherOccupation" value={formData.fatherOccupation} onChange={handleChange} className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground">Mother&apos;s Name</label>
            <input type="text" name="motherName" value={formData.motherName} onChange={handleChange} className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground">Mother&apos;s Occupation</label>
            <input type="text" name="motherOccupation" value={formData.motherOccupation} onChange={handleChange} className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground">Mother&apos;s Hometown</label>
            <input type="text" name="motherHometown" value={formData.motherHometown} onChange={handleChange} className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground">Maternal Uncle&apos;s Name</label>
            <input type="text" name="maternalUncleName" value={formData.maternalUncleName} onChange={handleChange} className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground">Brothers</label>
            <input type="number" name="brothers" value={formData.brothers} onChange={handleChange} className={inputClass} min="0" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground">Married Brothers</label>
            <input type="number" name="marriedBrothers" value={formData.marriedBrothers} onChange={handleChange} className={inputClass} min="0" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground">Sisters</label>
            <input type="number" name="sisters" value={formData.sisters} onChange={handleChange} className={inputClass} min="0" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground">Married Sisters</label>
            <input type="number" name="marriedSisters" value={formData.marriedSisters} onChange={handleChange} className={inputClass} min="0" />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-semibold text-muted-foreground">Family Wealth / Property</label>
            <textarea name="familyWealth" value={formData.familyWealth} onChange={handleChange} className={textareaClass} placeholder="Agriculture land, plots, flats, etc." />
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Astrology (कुंडली)" icon="⭐">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground">Gothra (गोत्र)</label>
            <input type="text" name="gothra" value={formData.gothra} onChange={handleChange} className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground">Rashi (राशी)</label>
            <select name="rashi" value={formData.rashi} onChange={handleChange} className={selectClass}>
              <option value="">Select</option>
              {['मेष','वृषभ','मिथुन','कर्क','सिंह','कन्या','तूला','वृश्चिक','धनु','मकर','कुंभ','मीन'].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground">Nakshatra (नक्षत्र)</label>
            <input type="text" name="nakshatra" value={formData.nakshatra} onChange={handleChange} className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground">Charan (चरण)</label>
            <input type="text" name="charan" value={formData.charan} onChange={handleChange} className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground">Nadi (नाडी)</label>
            <select name="nadi" value={formData.nadi} onChange={handleChange} className={selectClass}>
              <option value="">Select</option>
              <option value="आद्य">आद्य</option>
              <option value="मध्य">मध्य</option>
              <option value="अंत्य">अंत्य</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground">Gan (गण)</label>
            <select name="gan" value={formData.gan} onChange={handleChange} className={selectClass}>
              <option value="">Select</option>
              <option value="देव">देव</option>
              <option value="मानव">मानव</option>
              <option value="राक्षस">राक्षस</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground">Mangal (मंगळ)</label>
            <select name="mangal" value={formData.mangal} onChange={handleChange} className={selectClass}>
              <option value="">Select</option>
              <option value="Yes">Yes (आहे)</option>
              <option value="No">No (नाही)</option>
              <option value="Partial">Partial (अंशतः)</option>
            </select>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Partner Preferences" icon="💑">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-muted-foreground">Expectations (अपेक्षा)</label>
          <textarea name="expectations" value={formData.expectations} onChange={handleChange} className={textareaClass} placeholder="Describe your expectations about your life partner — education, values, family background, location preferences, etc." />
        </div>
      </CollapsibleSection>

      <button
        type="submit"
        disabled={saving}
        className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 shadow-md"
      >
        {saving ? 'Saving Changes...' : '💾 Save All Profile Changes'}
      </button>
    </form>
  );
}
