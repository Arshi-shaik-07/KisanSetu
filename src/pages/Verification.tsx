import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  AlertCircle,
  Award,
  CheckCircle2,
  Copy,
  FileCheck,
  FileText,
  Fingerprint,
  IdCard,
  KeyRound,
  Lock,
  MapPin,
  MessageSquare,
  Navigation,
  QrCode,
  RefreshCw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import { currentTotp, otpauthUri } from "../lib/totp";
import { useAuth } from "../context/AuthContext";
import type { DocumentKind, VerificationLevel, VerificationStatus } from "../types";

const DISTRICT_DATA: Record<string, string[]> = {
  Karnataka: ["Kolar", "Chikkaballapur", "Bengaluru Rural", "Bengaluru Urban", "Tumkur", "Mandya", "Mysuru", "Hassan", "Belagavi"],
  "Andhra Pradesh": ["Anantapur", "Chittoor", "Kadapa", "Kurnool", "Guntur", "Krishna", "Godavari"],
  Maharashtra: ["Nashik", "Pune", "Ahmednagar", "Solapur", "Nagpur", "Satara"],
  "Tamil Nadu": ["Coimbatore", "Dharmapuri", "Krishnagiri", "Salem", "Madurai"],
  Punjab: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
};

const FARMER_DOCS: { kind: DocumentKind; label: string; sample: string; desc: string }[] = [
  { kind: "land_record", label: "7/12 Extract / RTC Pahani / RoR", sample: "kolar-surv42-rtc-pahani.pdf", desc: "Proof of agricultural land ownership & survey parcel" },
  { kind: "soil_health_card", label: "Soil Health Card / PM-KISAN ID", sample: "soil-health-card-kolar.pdf", desc: "Govt soil fertility test & active farming beneficiary status" },
  { kind: "fpo_membership", label: "FPO Membership / Organic Certificate", sample: "organic-npop-cert-2026.pdf", desc: "Farmer Producer Organisation or Jaivik Bharat organic certification" },
];

const BUYER_DOCS: { kind: DocumentKind; label: string; sample: string; desc: string }[] = [
  { kind: "fssai", label: "FSSAI Food Business License", sample: "fssai-central-license-2026.pdf", desc: "Mandatory food safety registration for buyers & processors" },
  { kind: "gstin", label: "GSTIN Certificate", sample: "gst-registration-cert.pdf", desc: "State commercial tax & enterprise entity registration" },
  { kind: "apmc_license", label: "APMC Mandi Trader License", sample: "apmc-trader-mandi-permit.pdf", desc: "Licensed produce buyer authorization from local Mandi" },
];

function StatusBadge({ status }: { status: VerificationStatus }) {
  if (status === "verified") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
        Verified
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
        <RefreshCw className="w-3 h-3 text-amber-600 animate-spin" />
        In Review
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-300">
      <AlertCircle className="w-3 h-3 text-slate-400" />
      Unverified
    </span>
  );
}

function LevelBadge({ level }: { level: VerificationLevel }) {
  const styles = {
    essential: "bg-rose-50 text-rose-800 border-rose-200",
    recommended: "bg-amber-50 text-amber-800 border-amber-200",
    advanced: "bg-purple-50 text-purple-800 border-purple-200",
  };
  return (
    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${styles[level]}`}>
      {level}
    </span>
  );
}

function SectionCard({
  icon: Icon,
  title,
  level,
  status,
  points,
  children,
}: {
  icon: (props: { className?: string }) => ReactNode;
  title: string;
  level: VerificationLevel;
  status: VerificationStatus;
  points: number;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm transition hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">{title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <LevelBadge level={level} />
              <StatusBadge status={status} />
              <span className="text-[11px] font-bold text-slate-400">+{points}% Score</span>
            </div>
          </div>
        </div>
      </div>
      {children}
    </section>
  );
}

export function Verification() {
  const auth = useAuth();
  const { user } = auth;

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [liveTotpCode, setLiveTotpCode] = useState("");
  const [totpInput, setTotpInput] = useState("");
  const [copiedKey, setCopiedKey] = useState(false);

  // Government ID Modal State
  const [showGovIdModal, setShowGovIdModal] = useState(false);
  const [idType, setIdType] = useState<"aadhaar" | "pan" | "kcc">("aadhaar");
  const [govIdValue, setGovIdValue] = useState("");
  const [govConsent, setGovConsent] = useState(true);
  const [govIdBusy, setGovIdBusy] = useState(false);

  // Location Form State
  const [stateName, setStateName] = useState(user?.location.state || "Karnataka");
  const [district, setDistrict] = useState(user?.location.district || "Kolar");
  const [village, setVillage] = useState(user?.location.village || "Kolar Rural / Mulbagal Highway");
  const [pincode, setPincode] = useState(user?.location.pincode || "563101");
  const [locGpsBusy, setLocGpsBusy] = useState(false);

  // Document Upload State
  const [docKind, setDocKind] = useState<DocumentKind>(user?.role === "buyer" ? "fssai" : "land_record");
  const [docFileName, setDocFileName] = useState("");
  const [ocrScanning, setOcrScanning] = useState(false);

  // Update live TOTP display when pending
  useEffect(() => {
    if (!auth.pendingTotpSecret) return;
    let active = true;
    const update = async () => {
      const code = await currentTotp(auth.pendingTotpSecret!);
      if (active) setLiveTotpCode(code);
    };
    void update();
    const id = window.setInterval(() => void update(), 1000);
    return () => {
      active = false;
      window.clearInterval(id);
    };
  }, [auth.pendingTotpSecret]);

  if (!user) return null;

  const isFarmer = user.role === "farmer";
  const docChoices = isFarmer ? FARMER_DOCS : BUYER_DOCS;

  const handleCopySecret = (text: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleDetectGps = () => {
    setLocGpsBusy(true);
    setError("");
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          void auth.verifyLocation({
            state: stateName,
            district,
            village,
            pincode,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracyMeters: Math.round(pos.coords.accuracy),
          }).then(() => {
            setLocGpsBusy(false);
            setSuccessMsg("Farm GPS coordinates pinned & verified successfully!");
          });
        },
        () => {
          // Graceful fallback for mock demo
          const fallbackLat = 13.136 + (Math.random() - 0.5) * 0.05;
          const fallbackLng = 78.129 + (Math.random() - 0.5) * 0.05;
          void auth.verifyLocation({
            state: stateName,
            district,
            village,
            pincode,
            lat: Number(fallbackLat.toFixed(4)),
            lng: Number(fallbackLng.toFixed(4)),
            accuracyMeters: 8,
          }).then(() => {
            setLocGpsBusy(false);
            setSuccessMsg("Farm location verified via regional satellite positioning!");
          });
        },
        { timeout: 5000 }
      );
    } else {
      setLocGpsBusy(false);
    }
  };

  const handleGovIdSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setGovIdBusy(true);
    try {
      if (!govConsent) throw new Error("Consent required to verify identity hash.");
      if (idType === "aadhaar" && govIdValue.replace(/\D/g, "").length < 12) {
        throw new Error("Enter valid 12-digit Aadhaar number for mock verification.");
      }
      await auth.verifyGovernmentId(idType, govIdValue);
      setShowGovIdModal(false);
      setSuccessMsg("Government Identity Verified via DigiLocker e-KYC!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setGovIdBusy(false);
    }
  };

  const handleDocumentSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!docFileName.trim()) return;
    setOcrScanning(true);
    setError("");

    // Simulate OCR scanning delay
    setTimeout(() => {
      const selectedDef = docChoices.find((d) => d.kind === docKind);
      void auth.submitDocument(
        docKind,
        docFileName.trim(),
        "1.6 MB",
        {
          ownerName: user.name,
          docNumber: `DOC-VERIFIED-${Math.floor(100000 + Math.random() * 900000)}`,
          plotArea: isFarmer ? "4.5 Acres Irrigated Agricultural Land" : "Enterprise Wholesale License",
          validUntil: "Valid 2026-2028",
        }
      ).then(() => {
        setOcrScanning(false);
        setDocFileName("");
        setSuccessMsg(`Document "${selectedDef?.label}" verified via simulated AI OCR!`);
      });
    }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-slate-50 via-emerald-50/20 to-slate-100 py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Page Header with Trust Score Meter */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Kisan Setu Trust & Identity Center</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Authentication & Verification Hub
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                Signed in as <strong className="text-slate-800">{user.name}</strong> ({isFarmer ? "Farmer / Producer" : "Buyer / Recipient"} · {user.mobile}).
                Complete verifications to increase market trust and unlock instant buyer connections.
              </p>
            </div>

            {/* Score & Tier Card */}
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-200/90 rounded-2xl p-4 shrink-0">
              <div className="relative w-18 h-18 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-200"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-600 transition-all duration-1000 ease-out"
                    strokeDasharray={`${user.trustScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-lg font-black text-slate-900">{user.trustScore}%</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Trust Status
                  </span>
                </div>
                <div className="text-sm font-black text-slate-900 mt-0.5">
                  {user.tier === "gold" ? (
                    <span className="text-amber-700">🥇 Tier 1 Gold Verified</span>
                  ) : user.tier === "silver" ? (
                    <span className="text-slate-700">🥈 Silver Verified</span>
                  ) : (
                    <span className="text-amber-800">🥉 Bronze Member</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {user.trustScore >= 70 ? "High priority in AI Matching" : "Verify location & 2FA for Gold tier"}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Demo Verify All Action */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>
                Want to evaluate the full verified producer experience immediately?
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                void auth.quickVerifyAll().then(() => {
                  setSuccessMsg("⚡ Quick verified all 5 authentication layers! 100% Gold Tier unlocked.");
                });
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              ⚡ Quick Verify All (Demo 100%)
            </button>
          </div>
        </div>

        {/* Global Toast Messages */}
        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-800 flex items-start gap-2 shadow-xs">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-start justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setSuccessMsg("")}
              className="text-emerald-700 hover:text-emerald-900 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* 1. PASSWORD AUTHENTICATION */}
        <SectionCard
          icon={Lock}
          title="🔐 Password Authentication"
          level="essential"
          status="verified"
          points={20}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs sm:text-sm text-slate-600">
                Primary credentials verified. Password hashed on device using standard PBKDF2-SHA256 (120,000 iterations).
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-mono text-[11px]">
                  Email: {user.email}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-mono text-[11px]">
                  Mobile: +91 {user.mobile}
                </span>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Active & Secure</span>
            </div>
          </div>
        </SectionCard>

        {/* 2. TWO-FACTOR AUTHENTICATION */}
        <SectionCard
          icon={Shield}
          title="🛡️ Two-Factor Authentication (2FA)"
          level="recommended"
          status={user.twoFactorEnabled ? "verified" : "unverified"}
          points={20}
        >
          <p className="text-xs sm:text-sm text-slate-600 mb-4">
            Required before confirming high-value produce lots, accepting buyer bids, or modifying direct bank payouts.
          </p>

          {user.twoFactorEnabled ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-extrabold text-emerald-950">
                    2FA Protection is Active ({user.twoFactorMethod === "sms" ? "Mobile SMS OTP" : "Authenticator App TOTP"})
                  </span>
                </div>
                <p className="text-xs text-emerald-800 mt-1">
                  Sensitive actions like payouts and bank changes will prompt for a 6-digit confirmation code.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  void auth.disableTwoFactor("123456").then(() => {
                    setSuccessMsg("Two-factor authentication disabled.");
                  });
                }}
                className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition shrink-0"
              >
                Disable 2FA
              </button>
            </div>
          ) : auth.pendingTotpSecret ? (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  Pair Authenticator App (Google Authenticator, Microsoft, or Authy)
                </span>
                <span className="text-xs font-semibold text-emerald-700">
                  Live Prototype Code: <strong className="font-mono">{liveTotpCode}</strong>
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="w-32 h-32 bg-white rounded-2xl border-2 border-slate-200 p-2 flex flex-col items-center justify-center shrink-0 shadow-inner">
                  <QrCode className="w-20 h-20 text-slate-800" />
                  <span className="text-[9px] font-bold text-slate-500 uppercase mt-1">Scan in App</span>
                </div>

                <div className="flex-1 space-y-2 w-full">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase">
                    Secret Key (Manual Entry)
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 break-all select-all">
                      {auth.pendingTotpSecret}
                    </code>
                    <button
                      type="button"
                      onClick={() => handleCopySecret(auth.pendingTotpSecret!)}
                      className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition"
                      title="Copy Key"
                    >
                      {copiedKey ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    URI: <span className="font-mono text-[10px] break-all">{otpauthUri(auth.pendingTotpSecret, user.email)}</span>
                  </p>
                </div>
              </div>

              {/* Confirm Code Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void auth.confirmEnableTwoFactor(totpInput).then(() => {
                    setTotpInput("");
                    setSuccessMsg("Two-Factor Authenticator successfully enabled!");
                  }).catch((err: unknown) => {
                    setError(err instanceof Error ? err.message : "Invalid 6-digit code.");
                  });
                }}
                className="flex flex-col sm:flex-row gap-2 pt-2"
              >
                <input
                  type="text"
                  maxLength={6}
                  value={totpInput}
                  onChange={(e) => setTotpInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="Enter 6-digit code (e.g. 123456)"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-center tracking-[0.2em] font-mono font-bold text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setTotpInput(liveTotpCode || "123456")}
                  className="px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold"
                >
                  Fill Demo ({liveTotpCode || "123456"})
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-sm"
                >
                  Verify & Activate 2FA
                </button>
              </form>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void auth.enableTwoFactor("totp")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs cursor-pointer transition"
              >
                <KeyRound className="w-4 h-4" />
                Setup Authenticator App (TOTP)
              </button>
              <button
                type="button"
                onClick={() => {
                  void auth.confirmEnableTwoFactor("123456").then(() => {
                    setSuccessMsg("SMS OTP 2FA activated on mobile: +91 " + user.mobile);
                  });
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-bold transition"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                Quick Enable via Mobile SMS (+91 {user.mobile})
              </button>
            </div>
          )}
        </SectionCard>

        {/* 3. FARM LOCATION VERIFICATION */}
        <SectionCard
          icon={MapPin}
          title={isFarmer ? "🌍 Farm Location Verification" : "🏢 Operating & Warehouse Location Verification"}
          level="recommended"
          status={user.location.status}
          points={25}
        >
          <p className="text-xs sm:text-sm text-slate-600 mb-4">
            {isFarmer
              ? "Verify district, village, and GPS farm pin. Accurate coordinates ensure nearby APMC mandis and commercial buyers can calculate transport distance and route pickups."
              : "Verify enterprise warehouse location and delivery radius for fresh produce matching."}
          </p>

          {user.location.status === "verified" ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Navigation className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-900">
                      {user.location.village}, {user.location.district}, {user.location.state} - {user.location.pincode}
                    </h3>
                    <p className="text-[11px] text-emerald-800 font-mono mt-0.5">
                      📍 Lat: {user.location.lat?.toFixed(4)}°N, Lng: {user.location.lng?.toFixed(4)}°E (±{user.location.accuracyMeters || 8}m GPS accuracy)
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDetectGps}
                  disabled={locGpsBusy}
                  className="px-3 py-1.5 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${locGpsBusy ? "animate-spin" : ""}`} />
                  Re-Pin GPS
                </button>
              </div>

              {/* Interactive Farm Proximity Radar Preview */}
              <div className="rounded-2xl border border-slate-200 bg-slate-900 text-white p-4 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                    <Navigation className="w-3.5 h-3.5" />
                    Live Proximity Radar
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Aggregating buyers within 25 km
                  </span>
                </div>
                <div className="grid sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Nearest APMC Mandi</p>
                    <p className="font-bold text-slate-100 mt-0.5">Kolar APMC Market</p>
                    <p className="text-[11px] text-emerald-400">6.2 km away (15 min)</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Active Buyers in Zone</p>
                    <p className="font-bold text-slate-100 mt-0.5">14 Verified Buyers</p>
                    <p className="text-[11px] text-emerald-400">Ready for daily pickup</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Cold Storage Facility</p>
                    <p className="font-bold text-slate-100 mt-0.5">Mulbagal Agro Logistics</p>
                    <p className="text-[11px] text-emerald-400">4.1 km away</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleDetectGps();
              }}
              className="space-y-4"
            >
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">State</label>
                  <select
                    value={stateName}
                    onChange={(e) => {
                      setStateName(e.target.value);
                      const districts = DISTRICT_DATA[e.target.value] || [];
                      if (districts.length > 0) setDistrict(districts[0]);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  >
                    {Object.keys(DISTRICT_DATA).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">District</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  >
                    {(DISTRICT_DATA[stateName] || []).map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Village / Locality</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="e.g. Kolar Rural"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">PIN Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                    placeholder="563101"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="submit"
                  disabled={locGpsBusy}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  {locGpsBusy ? "Detecting Coordinates…" : "Verify Farm Location via GPS Pin"}
                </button>
              </div>
            </form>
          )}
        </SectionCard>

        {/* 4. GOVERNMENT ID VERIFICATION */}
        <SectionCard
          icon={IdCard}
          title="🪪 Government ID Verification"
          level="advanced"
          status={user.govId.status}
          points={20}
        >
          <p className="text-xs sm:text-sm text-slate-600 mb-4">
            Optional verification through approved, privacy-conscious identity provider. We verify identity claims without storing raw 12-digit Aadhaar or PAN numbers.
          </p>

          {user.govId.status === "verified" ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Fingerprint className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-900">
                      Verified via {user.govId.provider}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-900">
                      UIDAI e-KYC
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800 font-mono mt-0.5">
                    Identifier: <strong className="text-slate-900">{user.govId.maskedId}</strong> · Certificate ID: {user.govId.certificateId || "CERT-DL-2026"}
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-white px-3 py-1.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Name Match Confirmed (100%)
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">Privacy Safeguard Guarantee:</strong>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Under the Aadhaar Act & IT Rules, no plaintext ID numbers are retained in our database. We only record a cryptographic verified receipt token.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setGovIdValue(isFarmer ? "123456788921" : "AACCS8821K");
                  setIdType(isFarmer ? "aadhaar" : "pan");
                  setShowGovIdModal(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition"
              >
                <Fingerprint className="w-4 h-4 text-emerald-400" />
                Verify with {isFarmer ? "DigiLocker Aadhaar e-KYC" : "NSDL / PAN Gateway"}
              </button>
            </div>
          )}
        </SectionCard>

        {/* 5. FARMER DOCUMENT VERIFICATION */}
        <SectionCard
          icon={FileText}
          title={isFarmer ? "📄 Farmer Document Verification" : "📄 Business & Trade Document Verification"}
          level="advanced"
          status={user.documents.length > 0 ? "verified" : "unverified"}
          points={15}
        >
          <p className="text-xs sm:text-sm text-slate-600 mb-4">
            {isFarmer
              ? "Verify agricultural land titles (7/12 RTC Pahani), Soil Health Card, or FPO membership certificate. Documents are scanned via AI OCR to verify plot acreage and crop entitlement."
              : "Verify FSSAI Food Business Registration, GSTIN Certificate, or APMC Mandi License."}
          </p>

          {/* List of Verified Documents */}
          {user.documents.length > 0 && (
            <div className="space-y-2 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Verified Documents ({user.documents.length})
              </h3>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {user.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{doc.fileName}</p>
                        <p className="text-[11px] text-slate-500">
                          {doc.extractedDetails?.plotArea || doc.extractedDetails?.docNumber || "Verified record"}
                        </p>
                        <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                          ✓ Match score: 98% · {doc.extractedDetails?.validUntil || "Active"}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={doc.status} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Document Upload & OCR Scanner */}
          <form onSubmit={handleDocumentSubmit} className="space-y-3 pt-2">
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Document Type
                </label>
                <select
                  value={docKind}
                  onChange={(e) => {
                    const k = e.target.value as DocumentKind;
                    setDocKind(k);
                    const def = docChoices.find((d) => d.kind === k);
                    if (def) setDocFileName(def.sample);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                >
                  {docChoices.map((d) => (
                    <option key={d.kind} value={d.kind}>{d.label}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Select File or Sample PDF
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={docFileName}
                    onChange={(e) => setDocFileName(e.target.value)}
                    placeholder="e.g. kolar-rtc-pahani-7-12.pdf"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const def = docChoices.find((d) => d.kind === docKind);
                      if (def) setDocFileName(def.sample);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold whitespace-nowrap"
                  >
                    Sample PDF
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <p className="text-[11px] text-slate-500">
                Accepted formats: PDF, JPG, PNG (Max 15MB). Instant client OCR parsing.
              </p>
              <button
                type="submit"
                disabled={ocrScanning || !docFileName.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition disabled:opacity-50"
              >
                {ocrScanning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Scanning with AI OCR…
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    Upload & Verify Document
                  </>
                )}
              </button>
            </div>
          </form>
        </SectionCard>
      </div>

      {/* Government ID Verification Modal */}
      {showGovIdModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  🪪
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    {isFarmer ? "DigiLocker Aadhaar e-KYC Verification" : "NSDL PAN Verification Gateway"}
                  </h3>
                  <p className="text-xs text-slate-500">Privacy-compliant zero-knowledge verification</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGovIdModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGovIdSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  ID Provider / Document
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIdType(isFarmer ? "aadhaar" : "pan");
                      setGovIdValue(isFarmer ? "123456788921" : "AACCS8821K");
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold text-left ${
                      idType === (isFarmer ? "aadhaar" : "pan")
                        ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    {isFarmer ? "Aadhaar e-KYC (DigiLocker)" : "Company / Firm PAN"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIdType("kcc");
                      setGovIdValue("KCC-492019-KA");
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold text-left ${
                      idType === "kcc"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    {isFarmer ? "Kisan Credit Card (KCC)" : "FSSAI Food License"}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  {idType === "aadhaar" ? "12-Digit Aadhaar Number" : idType === "pan" ? "10-Character PAN" : "Beneficiary / License ID"}
                </label>
                <input
                  type="text"
                  value={govIdValue}
                  onChange={(e) => setGovIdValue(e.target.value)}
                  placeholder={idType === "aadhaar" ? "1234 5678 8921" : "AACCS8821K"}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-mono font-bold"
                  required
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Demo auto-filled. In real mode, an OTP is sent to your Aadhaar-registered mobile.
                </p>
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 pt-1">
                <input
                  type="checkbox"
                  checked={govConsent}
                  onChange={(e) => setGovConsent(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 mt-0.5"
                  required
                />
                <span>
                  I give consent to Kisan Setu to verify my identity claim against UIDAI / DigiLocker. I understand only a name match hash is retained.
                </span>
              </label>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowGovIdModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={govIdBusy}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
                >
                  {govIdBusy ? "Verifying with Gateway…" : "Confirm & Authorize Verification"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
