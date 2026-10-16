export type Role = "farmer" | "buyer";

export type VerificationLevel = "essential" | "recommended" | "advanced";

export type VerificationStatus = "unverified" | "pending" | "verified";

export type GovIdRecord = {
  status: VerificationStatus;
  provider: string | null;
  idType: "aadhaar" | "pan" | "kcc" | null;
  maskedId: string | null;
  verifiedAt: string | null;
  displayNameMatch: boolean;
  certificateId?: string;
};

export type FarmLocationRecord = {
  status: VerificationStatus;
  state: string;
  district: string;
  village: string;
  pincode: string;
  lat: number | null;
  lng: number | null;
  verifiedAt: string | null;
  accuracyMeters?: number;
};

export type DocumentKind =
  | "land_record"
  | "soil_health_card"
  | "fpo_membership"
  | "fssai"
  | "gstin"
  | "apmc_license";

export type DocumentRecord = {
  id: string;
  kind: DocumentKind;
  fileName: string;
  fileSize?: string;
  status: VerificationStatus;
  submittedAt: string;
  extractedDetails?: {
    ownerName?: string;
    docNumber?: string;
    plotArea?: string;
    validUntil?: string;
  };
};

export type TwoFactorMethod = "totp" | "sms";

export type TwoFactorRecord = {
  enabled: boolean;
  secret: string | null;
  method?: TwoFactorMethod;
  enabledAt: string | null;
};

export type User = {
  id: string;
  role: Role;
  name: string;
  email: string;
  mobile: string;
  passwordSalt: string;
  passwordHash: string;
  createdAt: string;
  govId: GovIdRecord;
  location: FarmLocationRecord;
  documents: DocumentRecord[];
  twoFactor: TwoFactorRecord;
  fssaiNumber?: string;
  gstin?: string;
};

export type PublicUser = Omit<User, "passwordSalt" | "passwordHash" | "twoFactor"> & {
  twoFactorEnabled: boolean;
  twoFactorMethod?: TwoFactorMethod;
  trustScore: number;
  tier: "bronze" | "silver" | "gold";
};

export type Session = {
  userId: string;
  pendingTwoFactor: boolean;
  requiresTwoFactorForAction?: boolean;
};

export type CropCategory = "Vegetables" | "Fruits" | "Grains" | "Spices" | "Pulses";

export type ProduceLot = {
  id: string;
  cropName: string;
  category: CropCategory;
  quantity: number;
  unit: "kg" | "quintal" | "ton";
  expectedPrice: number;
  location: string;
  district: string;
  state: string;
  harvestDate: string;
  availableUntil: string;
  listingType: "sell" | "donate";
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmerVerified: boolean;
  farmerTier: "bronze" | "silver" | "gold";
  grade: "Grade A" | "Grade B" | "Organic";
  storage: string;
  image: string;
  notes: string;
  status: "available" | "matched" | "sold";
  bidsCount: number;
  highestBid?: number;
};

export type BuyerBid = {
  id: string;
  lotId: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerTier: "bronze" | "silver" | "gold";
  fssaiVerified: boolean;
  pricePerUnit: number;
  quantity: number;
  unit: string;
  totalOffer: number;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  notes?: string;
};
