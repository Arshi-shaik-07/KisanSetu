import { hashPassword, passwordsMatch, randomSalt, uid } from "./crypto";
import type { GovIdRecord, FarmLocationRecord, PublicUser, Session, User, TwoFactorRecord } from "../types";

const USERS_KEY = "kisan-setu-users-v2";
const SESSION_KEY = "kisan-setu-session-v2";

export function calculateTrust(user: User): { score: number; tier: "bronze" | "silver" | "gold" } {
  let score = 20; // Password Authentication (Essential)
  if (user.location.status === "verified") score += 25;
  if (user.twoFactor.enabled) score += 20;
  if (user.govId.status === "verified") score += 20;
  if (user.documents.some((d) => d.status === "verified")) score += 15;

  let tier: "bronze" | "silver" | "gold" = "bronze";
  if (score >= 70) tier = "gold";
  else if (score >= 40) tier = "silver";

  return { score, tier };
}

function emptyGovId(): GovIdRecord {
  return {
    status: "unverified",
    provider: null,
    idType: null,
    maskedId: null,
    verifiedAt: null,
    displayNameMatch: false,
  };
}

function emptyLocation(): FarmLocationRecord {
  return {
    status: "unverified",
    state: "Karnataka",
    district: "Kolar",
    village: "",
    pincode: "",
    lat: null,
    lng: null,
    verifiedAt: null,
  };
}

function emptyTwoFactor(): TwoFactorRecord {
  return { enabled: false, secret: null, method: "totp", enabledAt: null };
}

export function readUsers(): User[] {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as User[];
  } catch {
    return [];
  }
}

export function writeUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function toPublic(user: User): PublicUser {
  const { passwordHash: _h, passwordSalt: _s, twoFactor, ...rest } = user;
  const { score, tier } = calculateTrust(user);
  return {
    ...rest,
    twoFactorEnabled: twoFactor.enabled,
    twoFactorMethod: twoFactor.method,
    trustScore: score,
    tier,
  };
}

export function getSession(): Session | null {
  const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function setSession(session: Session | null, persist = true) {
  if (!session) {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
  } else {
    const serialized = JSON.stringify(session);
    if (persist) {
      localStorage.setItem(SESSION_KEY, serialized);
    }
    sessionStorage.setItem(SESSION_KEY, serialized);
  }
}

export function findUserById(id: string): User | undefined {
  return readUsers().find((u) => u.id === id);
}

export function findByLogin(identifier: string): User | undefined {
  const needle = identifier.trim().toLowerCase();
  const digits = identifier.replace(/\D/g, "");
  return readUsers().find(
    (u) =>
      u.email.toLowerCase() === needle ||
      (digits.length >= 10 && u.mobile.replace(/\D/g, "").endsWith(digits.slice(-10))),
  );
}

export async function ensureDemoUsers(): Promise<void> {
  const users = readUsers();
  if (users.some((u) => u.email === "farmer@kisansetu.app")) return;

  const farmerSalt = randomSalt();
  const buyerSalt = randomSalt();
  const freshSalt = randomSalt();

  const seeded: User[] = [
    {
      id: "usr_farmer_ramesh",
      role: "farmer",
      name: "Ramesh Kumar",
      email: "farmer@kisansetu.app",
      mobile: "9845012345",
      passwordSalt: farmerSalt,
      passwordHash: await hashPassword("Kisan@1234", farmerSalt),
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      govId: {
        status: "verified",
        provider: "DigiLocker UIDAI e-KYC",
        idType: "aadhaar",
        maskedId: "XXXX-XXXX-8921",
        verifiedAt: new Date(Date.now() - 25 * 86400000).toISOString(),
        displayNameMatch: true,
        certificateId: "DL-UID-884920-KA",
      },
      location: {
        status: "verified",
        state: "Karnataka",
        district: "Kolar",
        village: "Kolar Rural / Mulbagal Rd",
        pincode: "563101",
        lat: 13.136,
        lng: 78.129,
        verifiedAt: new Date(Date.now() - 25 * 86400000).toISOString(),
        accuracyMeters: 8,
      },
      documents: [
        {
          id: "doc_rtc_01",
          kind: "land_record",
          fileName: "kolar-7-12-rtc-surv42.pdf",
          fileSize: "1.4 MB",
          status: "verified",
          submittedAt: new Date(Date.now() - 24 * 86400000).toISOString(),
          extractedDetails: {
            ownerName: "Ramesh Kumar S/O Muniyappa",
            docNumber: "RTC-KA-KLR-2026-4412",
            plotArea: "4.5 Acres (Irrigated)",
            validUntil: "Active 2026-2027",
          },
        },
        {
          id: "doc_shc_01",
          kind: "soil_health_card",
          fileName: "soil-health-card-kolar.pdf",
          fileSize: "820 KB",
          status: "verified",
          submittedAt: new Date(Date.now() - 20 * 86400000).toISOString(),
          extractedDetails: {
            ownerName: "Ramesh Kumar",
            docNumber: "SHC-2026-09211",
            plotArea: "High Organic Carbon (0.78%)",
            validUntil: "Valid 3 Years",
          },
        },
      ],
      twoFactor: {
        enabled: true,
        secret: "JBSWY3DPEHPK3PXP",
        method: "totp",
        enabledAt: new Date(Date.now() - 20 * 86400000).toISOString(),
      },
    },
    {
      id: "usr_buyer_lakshmi",
      role: "buyer",
      name: "Sri Lakshmi Agri Food Processing Ltd.",
      email: "buyer@kisansetu.app",
      mobile: "9845098765",
      passwordSalt: buyerSalt,
      passwordHash: await hashPassword("Buyer@1234", buyerSalt),
      createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
      govId: {
        status: "verified",
        provider: "NSDL / Income Tax Dept PAN Verification",
        idType: "pan",
        maskedId: "AACCS8821K",
        verifiedAt: new Date(Date.now() - 40 * 86400000).toISOString(),
        displayNameMatch: true,
        certificateId: "NSDL-PAN-2026-00412",
      },
      location: {
        status: "verified",
        state: "Karnataka",
        district: "Bengaluru Urban",
        village: "KR Market & Yeshwanthpur Terminal",
        pincode: "560002",
        lat: 12.965,
        lng: 77.576,
        verifiedAt: new Date(Date.now() - 40 * 86400000).toISOString(),
        accuracyMeters: 5,
      },
      documents: [
        {
          id: "doc_fssai_01",
          kind: "fssai",
          fileName: "fssai-central-license-2026.pdf",
          fileSize: "2.1 MB",
          status: "verified",
          submittedAt: new Date(Date.now() - 38 * 86400000).toISOString(),
          extractedDetails: {
            ownerName: "Sri Lakshmi Agri Food Processing Ltd.",
            docNumber: "FSSAI #10020042000123",
            plotArea: "Cold Storage & Processing (120 MT/Day)",
            validUntil: "Valid 31-Dec-2028",
          },
        },
        {
          id: "doc_gst_01",
          kind: "gstin",
          fileName: "gst-registration-cert.pdf",
          fileSize: "950 KB",
          status: "verified",
          submittedAt: new Date(Date.now() - 35 * 86400000).toISOString(),
          extractedDetails: {
            ownerName: "Sri Lakshmi Agri Food Processing Ltd.",
            docNumber: "29AABCS1429B1Z2",
            plotArea: "Karnataka State Regular Taxpayer",
            validUntil: "Active Status",
          },
        },
      ],
      twoFactor: {
        enabled: true,
        secret: "JBSWY3DPEHPK3PXP",
        method: "sms",
        enabledAt: new Date(Date.now() - 35 * 86400000).toISOString(),
      },
      fssaiNumber: "10020042000123",
      gstin: "29AABCS1429B1Z2",
    },
    {
      id: "usr_farmer_kavitha",
      role: "farmer",
      name: "Kavitha Devi (New Farmer)",
      email: "newfarmer@kisansetu.app",
      mobile: "9812345678",
      passwordSalt: freshSalt,
      passwordHash: await hashPassword("Kisan@1234", freshSalt),
      createdAt: new Date().toISOString(),
      govId: emptyGovId(),
      location: emptyLocation(),
      documents: [],
      twoFactor: emptyTwoFactor(),
    },
  ];
  writeUsers(seeded);
}

export type RegisterInput = {
  role: User["role"];
  name: string;
  email: string;
  mobile: string;
  password: string;
  state?: string;
  district?: string;
};

export async function registerUser(input: RegisterInput): Promise<PublicUser> {
  const email = input.email.trim().toLowerCase();
  const mobile = input.mobile.replace(/\D/g, "");
  if (!email.includes("@")) throw new Error("Enter a valid email address.");
  if (mobile.length < 10) throw new Error("Enter a valid 10-digit mobile number.");
  if (input.password.length < 8) throw new Error("Password must be at least 8 characters.");
  if (!/[A-Za-z]/.test(input.password) || !/\d/.test(input.password)) {
    throw new Error("Password must include both letters and numbers.");
  }
  const users = readUsers();
  if (users.some((u) => u.email.toLowerCase() === email || u.mobile.replace(/\D/g, "").endsWith(mobile.slice(-10)))) {
    throw new Error("An account already exists with this email or mobile.");
  }
  const salt = randomSalt();
  const loc = emptyLocation();
  if (input.state) loc.state = input.state;
  if (input.district) loc.district = input.district;

  const user: User = {
    id: uid("usr"),
    role: input.role,
    name: input.name.trim(),
    email,
    mobile: mobile.slice(-10),
    passwordSalt: salt,
    passwordHash: await hashPassword(input.password, salt),
    createdAt: new Date().toISOString(),
    govId: emptyGovId(),
    location: loc,
    documents: [],
    twoFactor: emptyTwoFactor(),
  };
  writeUsers([...users, user]);
  return toPublic(user);
}

export async function authenticate(
  identifier: string,
  password: string,
): Promise<{ user: PublicUser; needsTwoFactor: boolean }> {
  await ensureDemoUsers();
  const user = findByLogin(identifier);
  if (!user) {
    throw new Error("No account found for that email or mobile number.");
  }
  const ok = await passwordsMatch(password, user.passwordSalt, user.passwordHash);
  if (!ok) {
    throw new Error("Incorrect password. Please verify and try again.");
  }
  return { user: toPublic(user), needsTwoFactor: user.twoFactor.enabled };
}

export function saveUser(next: User) {
  const users = readUsers().map((u) => (u.id === next.id ? next : u));
  writeUsers(users);
}

export function publicFromUser(user: User): PublicUser {
  return toPublic(user);
}

// Reset password simulation with OTP
export async function resetPasswordWithOtp(identifier: string, newPassword: string): Promise<boolean> {
  const user = findByLogin(identifier);
  if (!user) throw new Error("Account not found.");
  if (newPassword.length < 8) throw new Error("New password must be at least 8 characters.");
  const salt = randomSalt();
  user.passwordSalt = salt;
  user.passwordHash = await hashPassword(newPassword, salt);
  saveUser(user);
  return true;
}
