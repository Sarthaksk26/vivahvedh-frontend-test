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

export interface AdminUser {
  id: string;
  regId: string;
  email?: string | null;
  mobile?: string | null;
  accountStatus?: string;
  planType?: string;
  profile?: { firstName?: string; lastName?: string; gender?: string; maritalStatus?: string };
  physical?: { height?: string; weight?: number };
  education?: { trade?: string; jobBusiness?: string; annualIncome?: string };
  family?: { fatherName?: string; motherName?: string; familyBackground?: string; motherHometown?: string };
  astrology?: { rashi?: string; gothra?: string; mangal?: string };
  addresses?: Array<{ city?: string; district?: string; state?: string }>;
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
  planType: string;
  transactionId: string;
  screenshotUrl: string;
  user?: { regId?: string; email?: string; mobile?: string };
}

export interface NotificationBucket {
  urgent?: boolean;
  count?: number;
  label?: string;
  tab?: AdminTab;
}

export interface AdminNotifications {
  totalUnread: number;
  notifications: Record<string, NotificationBucket>;
}
