export type AdminTab =
  | 'pending'
  | 'all'
  | 'enquiries'
  | 'addProfile'
  | 'stories'
  | 'payments'
  | 'birthdays'
  | 'connections'
  | 'reports'
  | 'profit';

export interface ProfileData {
  firstName: string;
  middleName: string;
  lastName: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  maritalStatus: 'UNMARRIED' | 'DIVORCED' | 'WIDOWED' | 'SEPARATED';
  birthDateTime?: string | null;
  birthPlace?: string | null;
  aboutMe?: string | null;
}

export interface PhysicalData {
  height?: string | null;
  weight?: number | null;
  bloodGroup?: string | null;
  complexion?: string | null;
  health?: string | null;
  disease?: string | null;
  diet?: string | null;
  smoke?: boolean | null;
  drink?: boolean | null;
  medicalReportUrl?: string | null;
}

export interface EducationData {
  trade?: string | null;
  college?: string | null;
  jobBusiness?: string | null;
  jobAddress?: string | null;
  annualIncome?: string | null;
  specialAchievement?: string | null;
  incomeProofUrl?: string | null;
}

export interface FamilyData {
  fatherName?: string | null;
  fatherOccupation?: string | null;
  motherName?: string | null;
  motherOccupation?: string | null;
  motherHometown?: string | null;
  maternalUncleName?: string | null;
  brothers?: number;
  marriedBrothers?: number;
  sisters?: number;
  marriedSisters?: number;
  relativesSirnames?: string | null;
  familyBackground?: string | null;
  familyWealth?: string | null;
  agricultureLand?: string | null;
  plot?: string | null;
  flat?: string | null;
}

export interface AstrologyData {
  rashi?: string | null;
  gothra?: string | null;
  nakshatra?: string | null;
  charan?: string | null;
  nadi?: string | null;
  gan?: string | null;
  mangal?: string | null;
}

export interface AddressData {
  addressLine?: string | null;
  city?: string | null;
  district?: string | null;
  state?: string | null;
}

export interface PreferencesData {
  expectations?: string | null;
}

export interface AdminUser {
  id: string;
  regId: string;
  email: string | null;
  mobile: string;
  accountStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'DELETED';
  planType: 'FREE' | 'SILVER' | 'GOLD';
  paymentDone: boolean;
  kycDocumentUrl?: string | null;
  kycType?: string | null;
  kycVerified: boolean;
  profile: ProfileData | null;
  physical: PhysicalData | null;
  education: EducationData | null;
  family: FamilyData | null;
  astrology: AstrologyData | null;
  preferences?: PreferencesData | null;
  addresses: AddressData[];
  images?: { id?: string; url: string; isPrimary: boolean; }[];
}

export interface Enquiry {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  message: string;
  isResolved: boolean;
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  planType: 'FREE' | 'SILVER' | 'GOLD';
  transactionId: string;
  screenshotUrl: string;
  user: {
    regId: string;
    email: string | null;
    mobile: string;
  } | null;
}

export interface NotificationBucket {
  urgent: boolean;
  count: number;
  label: string;
  tab: AdminTab;
}

export interface AdminNotifications {
  totalUnread: number;
  notifications: Record<string, NotificationBucket>;
}
