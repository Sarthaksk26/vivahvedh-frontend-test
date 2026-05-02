export type AdminTab =
  | 'pending'
  | 'all'
  | 'enquiries'
  | 'addProfile'
  | 'stories'
  | 'payments'
  | 'birthdays'
  | 'connections'
  | 'profit';

export interface ProfileData {
  firstName: string;
  lastName: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  maritalStatus: 'UNMARRIED' | 'DIVORCED' | 'WIDOWED' | 'SEPARATED';
}

export interface PhysicalData {
  height?: string;
  weight?: number;
}

export interface EducationData {
  trade?: string;
  jobBusiness?: string;
  annualIncome?: string;
}

export interface FamilyData {
  fatherName?: string;
  motherName?: string;
  familyBackground?: string;
  motherHometown?: string;
}

export interface AstrologyData {
  rashi?: string;
  gothra?: string;
  mangal?: string;
}

export interface AddressData {
  city?: string;
  district?: string;
  state?: string;
}

export interface AdminUser {
  id: string;
  regId: string;
  email: string | null;
  mobile: string;
  accountStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'DELETED';
  planType: 'FREE' | 'SILVER' | 'GOLD';
  profile: ProfileData | null;
  physical: PhysicalData | null;
  education: EducationData | null;
  family: FamilyData | null;
  astrology: AstrologyData | null;
  addresses: AddressData[];
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
