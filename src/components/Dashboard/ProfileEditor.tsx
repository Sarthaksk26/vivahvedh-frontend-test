import { useState } from 'react';
import apiClient from '../../lib/apiClient';
import toast from 'react-hot-toast';
import { ChevronRight, Check, ArrowLeft, Save } from 'lucide-react';

/*
 * SIMPLIFIED PROFILE EDITOR
 * ─────────────────────────
 * Designed for parents and elderly users who are not tech-savvy.
 * Uses a card-based, one-section-at-a-time layout with:
 * • Large, readable text and generous spacing
 * • Simple Marathi + English labels
 * • Only one section visible at a time — no overwhelming forms
 * • Clear visual progress indicator
 * • Big, prominent Save button per section
 */

const inputClass =
  "w-full h-14 px-5 border-2 border-gray-200 rounded-2xl bg-white text-base font-medium placeholder:text-gray-300 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all";
const selectClass = inputClass;
const textareaClass =
  "w-full min-h-[120px] p-5 border-2 border-gray-200 rounded-2xl bg-white text-base font-medium placeholder:text-gray-300 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all resize-y";

interface Section {
  id: string;
  title: string;
  marathi: string;
  icon: string;
}

const sections: Section[] = [
  { id: 'basic', title: 'About You', marathi: 'तुमच्याबद्दल', icon: '👤' },
  { id: 'body', title: 'Physical Details', marathi: 'शारीरिक माहिती', icon: '📏' },
  { id: 'education', title: 'Education & Job', marathi: 'शिक्षण आणि नोकरी', icon: '🎓' },
  { id: 'family', title: 'Family Details', marathi: 'कुटुंबाची माहिती', icon: '👨‍👩‍👧‍👦' },
  { id: 'address', title: 'Address', marathi: 'पत्ता', icon: '📍' },
  { id: 'astrology', title: 'Astrology', marathi: 'कुंडली माहिती', icon: '⭐' },
  { id: 'partner', title: 'Partner Expectations', marathi: 'अपेक्षा', icon: '💝' },
];

export default function ProfileEditor({
  currentData,
  onSaveSuccess,
  onCancel
}: {
  currentData: any;
  onSaveSuccess: () => void;
  onCancel: () => void;
}) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedSections, setSavedSections] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState({
    // Basic / About
    aboutMe: currentData.profile?.aboutMe || '',
    // Physical
    height: currentData.physical?.height || '',
    weight: currentData.physical?.weight || '',
    bloodGroup: currentData.physical?.bloodGroup || '',
    complexion: currentData.physical?.complexion || '',
    disease: currentData.physical?.disease || '',
    diet: currentData.physical?.diet || '',
    smoke: currentData.physical?.smoke ?? '',
    drink: currentData.physical?.drink ?? '',
    expectations: currentData.preferences?.expectations || '',
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
    // Address
    city: currentData.addresses?.[0]?.city || '',
    district: currentData.addresses?.[0]?.district || '',
    state: currentData.addresses?.[0]?.state || '',
    // Astrology
    gothra: currentData.astrology?.gothra || '',
    rashi: currentData.astrology?.rashi || '',
    nakshatra: currentData.astrology?.nakshatra || '',
    charan: currentData.astrology?.charan || '',
    nadi: currentData.astrology?.nadi || '',
    gan: currentData.astrology?.gan || '',
    mangal: currentData.astrology?.mangal || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: value === '' ? '' : parseInt(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveSection = async (sectionId: string) => {
    setSaving(true);
    const payload = {
      profile: { aboutMe: formData.aboutMe || null },
      physical: {
        height: formData.height ? String(formData.height) : null,
        weight: parseInt(String(formData.weight)) || null,
        disease: formData.disease || null,
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
      preferences: { expectations: formData.expectations || null },
      addresses: {
        city: formData.city || null,
        district: formData.district || null,
        state: formData.state || null
      }
    };

    try {
      await apiClient.patch('/user/update', payload);
      toast.success('Saved successfully! (जतन केले!)', { icon: '✅' });
      setSavedSections(prev => new Set(prev).add(sectionId));
    } catch (err: any) {
      toast.error('Failed to save. Please try again. (पुन्हा प्रयत्न करा)');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Label helper for bilingual labels
  const Label = ({ en, mr }: { en: string; mr: string }) => (
    <label className="block text-base font-bold text-foreground mb-2">
      {en} <span className="text-muted-foreground font-medium text-sm">({mr})</span>
    </label>
  );

  const SaveButton = ({ sectionId }: { sectionId: string }) => (
    <button
      onClick={() => handleSaveSection(sectionId)}
      disabled={saving}
      className="w-full mt-6 py-4 bg-primary text-white text-lg font-bold rounded-2xl hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg active:scale-[0.98] flex items-center justify-center gap-3"
    >
      {saving ? (
        <span className="animate-pulse">Saving... (जतन होत आहे...)</span>
      ) : (
        <>
          <Save size={22} />
          Save This Section (हे जतन करा)
        </>
      )}
    </button>
  );

  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'basic':
        return (
          <div className="space-y-5">
            <div>
              <Label en="About Me" mr="माझ्याबद्दल" />
              <textarea name="aboutMe" value={formData.aboutMe} onChange={handleChange} className={textareaClass} placeholder="Write a few lines about yourself... (स्वतःबद्दल थोडे लिहा...)" />
            </div>
            <SaveButton sectionId="basic" />
          </div>
        );

      case 'body':
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label en="Height" mr="उंची (inches)" />
                <input type="text" name="height" value={formData.height} onChange={handleChange} className={inputClass} placeholder="e.g. 64 or 5'4" />
              </div>
              <div>
                <Label en="Weight" mr="वजन (kg)" />
                <input type="number" name="weight" value={formData.weight} onChange={handleChange} className={inputClass} placeholder="70" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label en="Blood Group" mr="रक्तगट" />
                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className={selectClass}>
                  <option value="">Select (निवडा)</option>
                  {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </div>
              <div>
                <Label en="Complexion" mr="वर्ण" />
                <select name="complexion" value={formData.complexion} onChange={handleChange} className={selectClass}>
                  <option value="">Select (निवडा)</option>
                  <option value="Fair">Fair (गोरा)</option>
                  <option value="Wheatish">Wheatish (गहू वर्ण)</option>
                  <option value="Medium">Medium (मध्यम)</option>
                  <option value="Dark">Dark (सावळा)</option>
                </select>
              </div>
            </div>
            <div>
              <Label en="Diet" mr="आहार" />
              <select name="diet" value={formData.diet} onChange={handleChange} className={selectClass}>
                <option value="">Select (निवडा)</option>
                <option value="Vegetarian">Vegetarian (शाकाहारी)</option>
                <option value="Non-Vegetarian">Non-Vegetarian (मांसाहारी)</option>
              </select>
            </div>
            <div>
              <Label en="Any Disease / Illness" mr="कोणताही आजार" />
              <input type="text" name="disease" value={formData.disease} onChange={handleChange} className={inputClass} placeholder="None (नाही)" />
            </div>
            <SaveButton sectionId="body" />
          </div>
        );

      case 'education':
        return (
          <div className="space-y-5">
            <div>
              <Label en="Qualification" mr="शिक्षण" />
              <input type="text" name="trade" value={formData.trade} onChange={handleChange} className={inputClass} placeholder="B.E., M.B.A., etc." />
            </div>
            <div>
              <Label en="College / University" mr="महाविद्यालय" />
              <input type="text" name="college" value={formData.college} onChange={handleChange} className={inputClass} placeholder="Name of college" />
            </div>
            <div>
              <Label en="Job / Business" mr="नोकरी / व्यवसाय" />
              <input type="text" name="jobBusiness" value={formData.jobBusiness} onChange={handleChange} className={inputClass} placeholder="Software Engineer, Farmer, etc." />
            </div>
            <div>
              <Label en="Annual Income" mr="वार्षिक उत्पन्न" />
              <input type="text" name="annualIncome" value={formData.annualIncome} onChange={handleChange} className={inputClass} placeholder="e.g. 10 LPA or ₹8,00,000" />
            </div>
            <div>
              <Label en="Special Achievements" mr="विशेष यश" />
              <textarea name="specialAchievement" value={formData.specialAchievement} onChange={handleChange} className={textareaClass} placeholder="Any awards or recognitions... (कोणतेही पारितोषिक...)" />
            </div>
            <SaveButton sectionId="education" />
          </div>
        );

      case 'family':
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label en="Father's Name" mr="वडिलांचे नाव" />
                <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <Label en="Father's Job" mr="वडिलांचा व्यवसाय" />
                <input type="text" name="fatherOccupation" value={formData.fatherOccupation} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <Label en="Mother's Name" mr="आईचे नाव" />
                <input type="text" name="motherName" value={formData.motherName} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <Label en="Mother's Job" mr="आईचा व्यवसाय" />
                <input type="text" name="motherOccupation" value={formData.motherOccupation} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <Label en="Mother's Hometown" mr="आजोळ" />
                <input type="text" name="motherHometown" value={formData.motherHometown} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <Label en="Maternal Uncle" mr="मामाचे नाव" />
                <input type="text" name="maternalUncleName" value={formData.maternalUncleName} onChange={handleChange} className={inputClass} />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-base font-bold mb-4">Siblings (भाऊ-बहीण)</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label en="Brothers" mr="भाऊ" />
                  <input type="number" name="brothers" value={formData.brothers} onChange={handleChange} className={inputClass} min="0" />
                </div>
                <div>
                  <Label en="Married" mr="विवाहित" />
                  <input type="number" name="marriedBrothers" value={formData.marriedBrothers} onChange={handleChange} className={inputClass} min="0" />
                </div>
                <div>
                  <Label en="Sisters" mr="बहीण" />
                  <input type="number" name="sisters" value={formData.sisters} onChange={handleChange} className={inputClass} min="0" />
                </div>
                <div>
                  <Label en="Married" mr="विवाहित" />
                  <input type="number" name="marriedSisters" value={formData.marriedSisters} onChange={handleChange} className={inputClass} min="0" />
                </div>
              </div>
            </div>

            <div>
              <Label en="Family Property / Wealth" mr="कौटुंबिक संपत्ती" />
              <textarea name="familyWealth" value={formData.familyWealth} onChange={handleChange} className={textareaClass} placeholder="Agriculture land, plots, flats... (शेती, प्लॉट, फ्लॅट...)" />
            </div>
            <SaveButton sectionId="family" />
          </div>
        );

      case 'address':
        return (
          <div className="space-y-5">
            <div>
              <Label en="City / Village" mr="गाव / शहर" />
              <input type="text" name="city" value={formData.city} onChange={handleChange} className={inputClass} placeholder="e.g. Gadhinglaj" />
            </div>
            <div>
              <Label en="District" mr="जिल्हा" />
              <input type="text" name="district" value={formData.district} onChange={handleChange} className={inputClass} placeholder="e.g. Kolhapur" />
            </div>
            <div>
              <Label en="State" mr="राज्य" />
              <input type="text" name="state" value={formData.state} onChange={handleChange} className={inputClass} placeholder="e.g. Maharashtra" />
            </div>
            <SaveButton sectionId="address" />
          </div>
        );

      case 'astrology':
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label en="Gothra" mr="गोत्र" />
                <input type="text" name="gothra" value={formData.gothra} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <Label en="Rashi" mr="राशी" />
                <select name="rashi" value={formData.rashi} onChange={handleChange} className={selectClass}>
                  <option value="">Select (निवडा)</option>
                  {['मेष','वृषभ','मिथुन','कर्क','सिंह','कन्या','तूला','वृश्चिक','धनु','मकर','कुंभ','मीन'].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <Label en="Nakshatra" mr="नक्षत्र" />
                <input type="text" name="nakshatra" value={formData.nakshatra} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <Label en="Charan" mr="चरण" />
                <input type="text" name="charan" value={formData.charan} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <Label en="Nadi" mr="नाडी" />
                <select name="nadi" value={formData.nadi} onChange={handleChange} className={selectClass}>
                  <option value="">Select (निवडा)</option>
                  <option value="आद्य">आद्य</option>
                  <option value="मध्य">मध्य</option>
                  <option value="अंत्य">अंत्य</option>
                </select>
              </div>
              <div>
                <Label en="Gan" mr="गण" />
                <select name="gan" value={formData.gan} onChange={handleChange} className={selectClass}>
                  <option value="">Select (निवडा)</option>
                  <option value="देव">देव</option>
                  <option value="मानव">मानव</option>
                  <option value="राक्षस">राक्षस</option>
                </select>
              </div>
              <div>
                <Label en="Mangal" mr="मंगळ" />
                <select name="mangal" value={formData.mangal} onChange={handleChange} className={selectClass}>
                  <option value="">Select (निवडा)</option>
                  <option value="Yes">Yes (आहे)</option>
                  <option value="No">No (नाही)</option>
                  <option value="Partial">Partial (अंशतः)</option>
                </select>
              </div>
            </div>
            <SaveButton sectionId="astrology" />
          </div>
        );

      case 'partner':
        return (
          <div className="space-y-5">
            <div>
              <Label en="What are you looking for in a partner?" mr="जोडीदाराबद्दल तुमच्या अपेक्षा काय आहेत?" />
              <textarea name="expectations" value={formData.expectations} onChange={handleChange} className={textareaClass} placeholder="Describe your ideal partner... (तुमच्या आदर्श जोडीदाराचे वर्णन करा...)" rows={5} />
            </div>
            <SaveButton sectionId="partner" />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-3xl border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-6 md:px-8 border-b bg-gradient-to-r from-primary/5 to-transparent">
        <div>
          <h2 className="text-2xl font-bold">Edit Your Profile</h2>
          <p className="text-base text-muted-foreground mt-1">
            प्रोफाईल बदला — Tap any section below to edit (खाली कोणत्याही विभागावर टॅप करा)
          </p>
        </div>
        <button
          onClick={onCancel}
          className="px-5 py-2.5 border-2 border-gray-200 bg-white rounded-xl font-bold hover:bg-gray-50 transition text-sm flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back (मागे)
        </button>
      </div>

      {/* Progress indicator */}
      <div className="px-6 md:px-8 py-3 bg-muted/30 border-b flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          Completed (पूर्ण): {savedSections.size} / {sections.length}
        </span>
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{ width: `${(savedSections.size / sections.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Section Cards */}
      <div className="p-4 md:p-6 space-y-3">
        {sections.map((section) => {
          const isOpen = openSection === section.id;
          const isSaved = savedSections.has(section.id);

          return (
            <div
              key={section.id}
              className={`rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                isOpen
                  ? 'border-primary/30 bg-white shadow-lg'
                  : isSaved
                    ? 'border-green-200 bg-green-50/50 hover:border-green-300'
                    : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
              }`}
            >
              {/* Section Header — always visible */}
              <button
                onClick={() => setOpenSection(isOpen ? null : section.id)}
                className="w-full flex items-center gap-4 p-5 text-left"
              >
                <span className="text-3xl">{section.icon}</span>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground">{section.title}</h3>
                  <p className="text-sm text-muted-foreground">{section.marathi}</p>
                </div>
                {isSaved && (
                  <span className="flex items-center gap-1.5 text-green-600 text-sm font-bold bg-green-100 px-3 py-1.5 rounded-full">
                    <Check size={14} /> Saved
                  </span>
                )}
                <ChevronRight
                  size={20}
                  className={`text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
                />
              </button>

              {/* Section Content — expandable */}
              {isOpen && (
                <div className="px-5 pb-6 pt-2 border-t border-gray-100">
                  {renderSectionContent(section.id)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Save All */}
      <div className="bg-white border-t p-6 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
        <p className="text-sm text-muted-foreground text-center sm:text-left">
          💡 <strong>Tip:</strong> You can save each section one by one. (प्रत्येक विभाग एक एक करून जतन करा)
        </p>
        <button
          onClick={() => {
            handleSaveSection('all');
            onSaveSuccess();
          }}
          disabled={saving}
          className="px-8 py-4 bg-primary text-white text-lg font-bold rounded-2xl hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg active:scale-[0.98] flex items-center gap-3 whitespace-nowrap"
        >
          {saving ? 'Saving...' : <><Save size={22} /> Save All & Exit (सगळे जतन करा)</>}
        </button>
      </div>
    </div>
  );
}
