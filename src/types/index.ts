// ═══════════════════════════════════════════════════════════════════
//  Enum-Like Union Types (mirror Prisma enums)
// ═══════════════════════════════════════════════════════════════════

export type Role = 'USER' | 'ADMIN';
export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'DELETED';
export type PlanType = 'FREE' | 'SILVER' | 'GOLD';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type MaritalStatus = 'UNMARRIED' | 'DIVORCED' | 'WIDOWED' | 'SEPARATED';
export type ConnectionStatus = 'NONE' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'ACCEPTED' | 'REJECTED';

// ═══════════════════════════════════════════════════════════════════
//  Data Transfer Objects
// ═══════════════════════════════════════════════════════════════════

export interface UserImage {
  id: string;
  url: string;
  isPrimary: boolean;
  createdAt?: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  middleName?: string | null;
  gender: Gender;
  maritalStatus: MaritalStatus;
  birthDateTime?: string | null;
  birthPlace?: string | null;
  aboutMe?: string | null;
  religionId?: number | null;
  casteId?: number | null;
  subCasteId?: number | null;
}

export interface UserPhysical {
  height?: string | null;
  weight?: number | null;
  bloodGroup?: string | null;
  complexion?: string | null;
  health?: string | null;
  disease?: string | null;
  diet?: string | null;
  smoke?: boolean | null;
  drink?: boolean | null;
}

export interface UserEducation {
  qualificationId?: number | null;
  trade?: string | null;
  college?: string | null;
  jobBusiness?: string | null;
  jobAddress?: string | null;
  annualIncome?: string | null;
  specialAchievement?: string | null;
}

export interface UserFamily {
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

export interface UserAstrology {
  gothra?: string | null;
  rashi?: string | null;
  nakshatra?: string | null;
  charan?: string | null;
  nadi?: string | null;
  gan?: string | null;
  mangal?: string | null;
}

export interface UserPreferences {
  expectations?: string | null;
}

export interface UserAddress {
  id?: string;
  addressType: string;
  addressLine?: string | null;
  city?: string | null;
  district?: string | null;
  state?: string | null;
  talukaId?: number | null;
  districtId?: number | null;
  stateId?: number | null;
}

// ═══════════════════════════════════════════════════════════════════
//  Composite / Full Profile
// ═══════════════════════════════════════════════════════════════════

export interface FullUserProfile {
  id: string;
  regId: string;
  email?: string;
  mobile?: string;
  planType: PlanType;
  accountStatus: AccountStatus;
  planExpiresAt?: string | null;
  profileCreatedBy?: string | null;
  profile?: UserProfile | null;
  family?: UserFamily | null;
  physical?: UserPhysical | null;
  education?: UserEducation | null;
  astrology?: UserAstrology | null;
  preferences?: UserPreferences | null;
  images?: UserImage[];
  addresses?: UserAddress[];
}

// ═══════════════════════════════════════════════════════════════════
//  Search Types
// ═══════════════════════════════════════════════════════════════════

export interface SearchResultUser {
  id: string;
  regId: string;
  planType: PlanType;
  accountStatus: AccountStatus;
  profile: UserProfile | null;
  images: UserImage[];
  education: UserEducation | null;
  physical: UserPhysical | null;
}

export interface SearchPagination {
  nextCursor: string | null;
  hasMore: boolean;
  pageSize: number;
}

export interface SearchResponse {
  results: SearchResultUser[];
  pagination: SearchPagination;
}

// ═══════════════════════════════════════════════════════════════════
//  Auth Types
// ═══════════════════════════════════════════════════════════════════

export interface StoredUser {
  regId: string;
  role: Role;
  status: AccountStatus;
  planType: PlanType;
  requiresPasswordChange: boolean;
}

export interface LoginResponse {
  message: string;
  user: StoredUser;
}

// ═══════════════════════════════════════════════════════════════════
//  Shortlist
// ═══════════════════════════════════════════════════════════════════

export interface ShortlistItem {
  id: string;
  targetUserId: string;
  createdAt: string;
  target: {
    id: string;
    regId: string;
    profile?: UserProfile | null;
    images?: UserImage[];
  };
}

// ═══════════════════════════════════════════════════════════════════
//  Axios Error Helper
// ═══════════════════════════════════════════════════════════════════

export interface ApiErrorResponse {
  error: string | Array<{ message: string; [key: string]: any }>;
  code?: string;
  details?: Array<{ field: string; message: string }>;
}
