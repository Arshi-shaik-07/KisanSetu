import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  authenticate,
  ensureDemoUsers,
  findUserById,
  getSession,
  publicFromUser,
  registerUser,
  resetPasswordWithOtp,
  saveUser,
  setSession,
  type RegisterInput,
} from "../lib/authStore";
import { generateTotpSecret, verifyTotp } from "../lib/totp";
import type { DocumentKind, DocumentRecord, PublicUser, TwoFactorMethod, User } from "../types";

type AuthContextValue = {
  user: PublicUser | null;
  ready: boolean;
  pendingTwoFactor: boolean;
  twoFactorMethod: TwoFactorMethod | null;
  pendingTotpSecret: string | null;
  login: (identifier: string, password: string, rememberMe?: boolean) => Promise<{ needsTwoFactor: boolean }>;
  completeTwoFactor: (code: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
  confirmSensitive: (code: string) => Promise<boolean>;
  enableTwoFactor: (method?: TwoFactorMethod) => Promise<{ secret: string }>;
  confirmEnableTwoFactor: (code: string) => Promise<void>;
  disableTwoFactor: (code?: string) => Promise<void>;
  verifyGovernmentId: (idType: "aadhaar" | "pan" | "kcc", idValue: string) => Promise<void>;
  verifyLocation: (input: {
    state: string;
    district: string;
    village: string;
    pincode: string;
    lat: number;
    lng: number;
    accuracyMeters?: number;
  }) => Promise<void>;
  submitDocument: (
    kind: DocumentKind,
    fileName: string,
    fileSize?: string,
    extractedDetails?: DocumentRecord["extractedDetails"],
  ) => Promise<void>;
  quickVerifyAll: () => Promise<void>;
  resetPassword: (identifier: string, newPass: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function hydrate(userId: string): PublicUser | null {
  const raw = findUserById(userId);
  return raw ? publicFromUser(raw) : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [ready, setReady] = useState(false);
  const [pendingTwoFactor, setPendingTwoFactor] = useState(false);
  const [twoFactorMethod, setTwoFactorMethod] = useState<TwoFactorMethod | null>(null);
  const [pendingTotpSecret, setPendingTotpSecret] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      await ensureDemoUsers();
      const session = getSession();
      if (session?.pendingTwoFactor) {
        setPendingTwoFactor(true);
        const u = hydrate(session.userId);
        setUser(u);
        setTwoFactorMethod(u?.twoFactorMethod || "totp");
      } else if (session?.userId) {
        setUser(hydrate(session.userId));
      }
      setReady(true);
    })();
  }, []);

  const refresh = (raw: User) => {
    saveUser(raw);
    setUser(publicFromUser(raw));
  };

  const requireRaw = (): User => {
    const session = getSession();
    if (!session?.userId) throw new Error("Session expired. Please sign in again.");
    const raw = findUserById(session.userId);
    if (!raw) throw new Error("User account not found.");
    return raw;
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      ready,
      pendingTwoFactor,
      twoFactorMethod,
      pendingTotpSecret,
      login: async (identifier, password, rememberMe = true) => {
        const result = await authenticate(identifier, password);
        if (result.needsTwoFactor) {
          const raw = findUserById(result.user.id);
          const method = raw?.twoFactor.method || "totp";
          setSession({ userId: result.user.id, pendingTwoFactor: true }, rememberMe);
          setPendingTwoFactor(true);
          setTwoFactorMethod(method);
          setUser(result.user);
          return { needsTwoFactor: true };
        }
        setSession({ userId: result.user.id, pendingTwoFactor: false }, rememberMe);
        setPendingTwoFactor(false);
        setUser(result.user);
        return { needsTwoFactor: false };
      },
      completeTwoFactor: async (code) => {
        const raw = requireRaw();
        const trimmed = code.trim();
        // Allow simulated SMS bypass with 123456 or real TOTP verification
        if (raw.twoFactor.method === "sms") {
          if (trimmed !== "123456" && trimmed.length !== 6) {
            throw new Error("Invalid SMS OTP. Enter 123456 for demo test.");
          }
        } else {
          const valid = raw.twoFactor.secret ? await verifyTotp(raw.twoFactor.secret, trimmed) : false;
          if (!valid && trimmed !== "123456") {
            throw new Error("Invalid authenticator code. Check your authenticator app.");
          }
        }
        setSession({ userId: raw.id, pendingTwoFactor: false }, true);
        setPendingTwoFactor(false);
        setUser(publicFromUser(raw));
      },
      register: async (input) => {
        const created = await registerUser(input);
        setSession({ userId: created.id, pendingTwoFactor: false }, true);
        setPendingTwoFactor(false);
        setUser(created);
      },
      logout: () => {
        setSession(null);
        setUser(null);
        setPendingTwoFactor(false);
        setPendingTotpSecret(null);
      },
      confirmSensitive: async (code) => {
        const raw = requireRaw();
        if (!raw.twoFactor.enabled || !raw.twoFactor.secret) return true;
        const trimmed = code.trim();
        if (trimmed === "123456") return true;
        return verifyTotp(raw.twoFactor.secret, trimmed);
      },
      enableTwoFactor: async (method = "totp") => {
        const secret = generateTotpSecret();
        setPendingTotpSecret(secret);
        setTwoFactorMethod(method);
        return { secret };
      },
      confirmEnableTwoFactor: async (code) => {
        const trimmed = code.trim();
        if (!pendingTotpSecret && twoFactorMethod === "totp") {
          throw new Error("Start 2FA setup again.");
        }
        if (twoFactorMethod === "totp") {
          const ok = pendingTotpSecret ? await verifyTotp(pendingTotpSecret, trimmed) : false;
          if (!ok && trimmed !== "123456") {
            throw new Error("Invalid 6-digit authenticator code.");
          }
        } else {
          if (trimmed !== "123456" && trimmed.length !== 6) {
            throw new Error("Invalid SMS code. Use demo code 123456.");
          }
        }
        const raw = requireRaw();
        raw.twoFactor = {
          enabled: true,
          secret: pendingTotpSecret || "JBSWY3DPEHPK3PXP",
          method: twoFactorMethod || "totp",
          enabledAt: new Date().toISOString(),
        };
        refresh(raw);
        setPendingTotpSecret(null);
      },
      disableTwoFactor: async (code) => {
        const raw = requireRaw();
        if (code && raw.twoFactor.secret && code.trim() !== "123456") {
          const ok = await verifyTotp(raw.twoFactor.secret, code.trim());
          if (!ok) throw new Error("Invalid code to disable 2FA.");
        }
        raw.twoFactor = { enabled: false, secret: null, method: "totp", enabledAt: null };
        refresh(raw);
      },
      verifyGovernmentId: async (idType, idValue) => {
        const raw = requireRaw();
        const digits = idValue.replace(/\D/g, "");
        let masked = "";
        let provider = "";

        if (idType === "aadhaar") {
          masked = `XXXX-XXXX-${digits.slice(-4) || "8921"}`;
          provider = "DigiLocker UIDAI e-KYC (ePramaan Gateway)";
        } else if (idType === "pan") {
          masked = idValue.toUpperCase().trim() || "AACCS8821K";
          provider = "NSDL / Income Tax Dept PAN Gateway";
        } else {
          masked = `KCC-${digits.slice(-6) || "492019"}`;
          provider = "PM-KISAN / NABARD KCC Beneficiary Portal";
        }

        raw.govId = {
          status: "verified",
          provider,
          idType,
          maskedId: masked,
          verifiedAt: new Date().toISOString(),
          displayNameMatch: true,
          certificateId: `CERT-${Date.now().toString(36).toUpperCase()}`,
        };
        refresh(raw);
      },
      verifyLocation: async (input) => {
        const raw = requireRaw();
        raw.location = {
          status: "verified",
          state: input.state,
          district: input.district.trim(),
          village: input.village.trim(),
          pincode: input.pincode.trim(),
          lat: input.lat,
          lng: input.lng,
          verifiedAt: new Date().toISOString(),
          accuracyMeters: input.accuracyMeters || 12,
        };
        refresh(raw);
      },
      submitDocument: async (kind, fileName, fileSize = "1.2 MB", extractedDetails) => {
        const raw = requireRaw();
        const newDoc: DocumentRecord = {
          id: `doc_${Date.now().toString(36)}`,
          kind,
          fileName,
          fileSize,
          status: "verified",
          submittedAt: new Date().toISOString(),
          extractedDetails: extractedDetails || {
            ownerName: raw.name,
            docNumber: `DOC-VERIFIED-${Math.floor(100000 + Math.random() * 900000)}`,
            plotArea: raw.role === "farmer" ? "4.2 Acres Agricultural Land" : "Enterprise Processing License",
            validUntil: "Valid 2026-2028",
          },
        };
        raw.documents = [newDoc, ...raw.documents];
        refresh(raw);
      },
      quickVerifyAll: async () => {
        const raw = requireRaw();
        raw.govId = {
          status: "verified",
          provider: raw.role === "farmer" ? "DigiLocker UIDAI e-KYC" : "NSDL PAN Gateway",
          idType: raw.role === "farmer" ? "aadhaar" : "pan",
          maskedId: raw.role === "farmer" ? "XXXX-XXXX-8921" : "AACCS8821K",
          verifiedAt: new Date().toISOString(),
          displayNameMatch: true,
          certificateId: "DL-UID-884920-KA",
        };
        raw.location = {
          status: "verified",
          state: "Karnataka",
          district: "Kolar",
          village: "Kolar Rural / Mulbagal Highway",
          pincode: "563101",
          lat: 13.136,
          lng: 78.129,
          verifiedAt: new Date().toISOString(),
          accuracyMeters: 6,
        };
        raw.twoFactor = {
          enabled: true,
          secret: "JBSWY3DPEHPK3PXP",
          method: "totp",
          enabledAt: new Date().toISOString(),
        };
        if (raw.documents.length === 0) {
          raw.documents = [
            {
              id: "doc_demo_quick",
              kind: raw.role === "farmer" ? "land_record" : "fssai",
              fileName: raw.role === "farmer" ? "kolar-rtc-pahani-7-12.pdf" : "fssai-central-license.pdf",
              fileSize: "1.8 MB",
              status: "verified",
              submittedAt: new Date().toISOString(),
              extractedDetails: {
                ownerName: raw.name,
                docNumber: raw.role === "farmer" ? "RTC-KA-KLR-2026-99" : "FSSAI #10020042000123",
                plotArea: raw.role === "farmer" ? "5.0 Acres (Irrigated)" : "Wholesale Aggregation",
                validUntil: "Valid until Dec 2028",
              },
            },
          ];
        }
        refresh(raw);
      },
      resetPassword: async (identifier, newPass) => {
        return resetPasswordWithOtp(identifier, newPass);
      },
    }),
    [user, ready, pendingTwoFactor, twoFactorMethod, pendingTotpSecret],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// oxlint-disable-next-line react/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
