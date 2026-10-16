import { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  QrCode,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Scale,
  FileCheck,
  Copy,
  RefreshCw,
  BadgeCheck
} from "lucide-react";
import type { Transaction } from "../lib/seedData";

interface LogisticsSecurityCenterProps {
  transaction: Transaction;
  onVerifyDispatch?: () => void;
}

export function LogisticsSecurityCenter({ transaction }: LogisticsSecurityCenterProps) {
  // Authentication states
  const [farmerOtp] = useState("784 219");
  const [driverInputOtp, setDriverInputOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(true);
  const [showQrModal, setShowQrModal] = useState(false);
  const [sealVerified, setSealVerified] = useState(true);
  const [isVerifyingSeal, setIsVerifyingSeal] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"handover" | "weighment" | "kyc" | "escrow">("handover");
  const [showSosModal, setShowSosModal] = useState(false);
  const [sosSent, setSosSent] = useState(false);

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Verify OTP handler
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (driverInputOtp.replace(/\s+/g, "") === "784219" || driverInputOtp.trim().length === 6) {
      setIsOtpVerified(true);
    }
  };

  // Verify Electronic Seal handler
  const handleVerifySeal = () => {
    setIsVerifyingSeal(true);
    setTimeout(() => {
      setIsVerifyingSeal(false);
      setSealVerified(true);
    }, 800);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
      {/* Header with Anti-Fraud Shield Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Anti-Fraud & Dispatch Security Shield
            </h3>
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              5-Tier Protected
            </span>
          </div>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            Eliminates counterfeit truck pickups, en-route produce skimming, location spoofing, and payment default through cryptographic handover authentication.
          </p>
        </div>

        {/* SOS Emergency Hotline Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSosModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-extrabold transition cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Report Route Deviation / SOS</span>
          </button>
        </div>
      </div>

      {/* Security Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("handover")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === "handover"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>1. Mutual Gate OTP & QR</span>
          {isOtpVerified && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("weighment")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === "weighment"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>2. Digital Weighment & Tamper Seal</span>
          {sealVerified && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("kyc")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === "kyc"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <BadgeCheck className="w-3.5 h-3.5" />
          <span>3. Transporter Aadhaar & APMC KYC</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("escrow")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === "escrow"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>4. Escrow Payment Guarantee</span>
        </button>
      </div>

      {/* Tab 1: Mutual Gate OTP & Dynamic QR Handover */}
      {activeTab === "handover" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Farmer's Cryptographic Dispatch Code */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white border border-emerald-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                FARMER DISPATCH PASSKEY
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Dynamic (Valid 04:12)
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-600 block mb-1">
                Share this 6-digit OTP with Driver <strong>Mohan Lal</strong> upon truck arrival at your farm gate:
              </span>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2.5 rounded-xl bg-white border-2 border-emerald-500 font-mono text-2xl font-black text-slate-900 tracking-widest shadow-xs">
                  {farmerOtp}
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(farmerOtp, "otp")}
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                  title="Copy Dispatch OTP"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Show QR Pass</span>
                </button>
              </div>
              {copiedText === "otp" && (
                <span className="text-[11px] text-emerald-600 font-bold block mt-1">
                  ✓ OTP copied to clipboard!
                </span>
              )}
            </div>

            <div className="p-3 rounded-xl bg-white/80 border border-emerald-200 text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Anti-Imposter Protection:</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Loading is locked until the driver verifies this code. Do NOT hand over produce crates to any driver who cannot show an active Kisan Setu digital trip order for <strong>AP02 TC 4481</strong>.
              </p>
            </div>
          </div>

          {/* Transporter / Driver Handover Verification Widget */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800">
                DRIVER AT-GATE AUTHENTICATION
              </span>
              <span className="text-xs font-bold text-slate-700">
                Tata Ace (AP02 TC 4481)
              </span>
            </div>

            {isOtpVerified ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-black text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Mutual Gate Handover Authenticated!</span>
                </div>
                <div className="text-xs text-emerald-900 space-y-0.5">
                  <p>• Driver Mohan Lal authenticated at Kalyanadurg Farm Yard</p>
                  <p>• Geofence Proximity: <strong>18 meters</strong> (Within 50m collection radius)</p>
                  <p>• Timestamp: <strong>10:14 AM (GPS Hardware Verified)</strong></p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOtpVerified(false);
                      setDriverInputOtp("");
                    }}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
                  >
                    Simulate Re-Authentication
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <span className="text-xs text-slate-600 block">
                  Driver enters Farmer OTP or scans Gate QR:
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={driverInputOtp}
                    onChange={(e) => setDriverInputOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 font-mono font-bold text-sm tracking-wider text-slate-900 focus:outline-emerald-500"
                    maxLength={7}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition cursor-pointer"
                  >
                    Authorize
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDriverInputOtp("784 219");
                    setIsOtpVerified(true);
                  }}
                  className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 block cursor-pointer"
                >
                  ⚡ Auto-fill Demo Farmer OTP (784 219)
                </button>
              </form>
            )}

            {/* Hardware Geofence Verification Status */}
            <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-semibold">Hardware Geofence Check:</span>
                <span className="text-emerald-600 font-bold font-mono">18m from Farm GPS (PASS)</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-semibold">Anti-Spoofing GNSS Guard:</span>
                <span className="text-emerald-600 font-bold font-mono">Mock GPS Disabled (PASS)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Digital Weighment & Tamper Seal */}
      {activeTab === "weighment" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Digital Weighbridge Certification Slip */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800">
                CERTIFIED SCALE WEIGHMENT SLIP
              </span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Digital Scale Calibrated
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-bold">GROSS WEIGHT</span>
                <span className="text-base font-black text-slate-900">2,420 kg</span>
                <span className="text-[9px] text-slate-500 block">Truck + Load</span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-bold">TARE WEIGHT</span>
                <span className="text-base font-black text-slate-900">1,420 kg</span>
                <span className="text-[9px] text-slate-500 block">Empty Vehicle + Crates</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300">
                <span className="text-[10px] text-emerald-800 block font-bold">NET PRODUCE</span>
                <span className="text-base font-black text-emerald-700">1,000 kg</span>
                <span className="text-[9px] text-emerald-700 block">50 Crates @ 20kg</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-bold">Scale Terminal ID:</span>
                <span className="font-mono text-slate-900 font-bold">APMC-WB-ATP-04</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-bold">Calibration Validity:</span>
                <span className="text-emerald-700 font-semibold">Valid till Dec 2026</span>
              </div>
            </div>
          </div>

          {/* Cryptographic Electronic Seal (#SEAL-AP02-8841) */}
          <div className="p-5 rounded-2xl bg-slate-950 text-white border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                CRYPTOGRAPHIC TAMPER SEAL
              </span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Sensor Wire Intact
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Electronic Seal Serial #:</span>
                <span className="font-mono font-black text-amber-300 text-sm">
                  #SEAL-AP02-8841
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block mb-1">
                  SHA-256 Digital Seal Verification Hash:
                </span>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-emerald-400 break-all select-all">
                  e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div className="text-[11px] text-slate-400">
                Status: <strong className="text-emerald-300">0 Crate Latch Opens En-Route</strong>
              </div>
              <button
                type="button"
                onClick={handleVerifySeal}
                disabled={isVerifyingSeal}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                {isVerifyingSeal ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Verify Seal Hash</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Transporter Aadhaar & APMC KYC */}
      {activeTab === "kyc" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center font-bold text-emerald-800 text-base">
                ML
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  Mohan Lal (Designated Fleet Transporter)
                </h4>
                <p className="text-xs text-slate-500">Contact: +91 98490 11223</p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-semibold">Aadhaar e-KYC:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  UIDAI Verified (•••• •••• 3912)
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-semibold">Commercial Driving License:</span>
                <span className="font-mono font-bold text-slate-900">AP02-2019-009841</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-semibold">APMC Transport Permit:</span>
                <span className="font-mono font-bold text-emerald-700">#AP-TR-2024-8182</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-semibold">Trip Safety Rating:</span>
                <span className="font-bold text-slate-900">⭐ 4.96 / 5.0 (284 Trips)</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Vehicle & Cargo Transit Insurance</span>
            </h4>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-semibold">Registered Vehicle:</span>
                <span className="font-mono font-bold text-slate-900">Tata Ace 1.5T (AP02 TC 4481)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-semibold">Fitness Certificate:</span>
                <span className="text-emerald-700 font-bold">Valid till Oct 2027</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-semibold">Agricultural Transit Cover:</span>
                <span className="font-bold text-slate-900">National Insurance #BA-994120-GIC</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-semibold">Max Loss Coverage:</span>
                <span className="font-bold text-emerald-700">₹5,00,000 per consignment</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Escrow Payment Guarantee */}
      {activeTab === "escrow" && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950 text-white border border-emerald-800/40 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 block">
                  RBI-REGULATED ESCROW MANDATE
                </span>
                <h4 className="text-lg font-black text-white">
                  ₹9,000.00 Pre-Locked in Axis Bank Escrow
                </h4>
              </div>
            </div>

            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-400 text-slate-950 self-start sm:self-auto">
              ESCROW STATUS: PRE-FUNDED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700">
              <span className="text-slate-400 block text-[10px]">ESCROW IDENTIFIER</span>
              <span className="font-mono text-white font-bold">ESC-AXIS-2026-9921</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700">
              <span className="text-slate-400 block text-[10px]">PAYMENT TRIGGER</span>
              <span className="text-emerald-300 font-bold">Electronic Proof of Delivery (e-PoD)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700">
              <span className="text-slate-400 block text-[10px]">DIRECT SETTLEMENT TIME</span>
              <span className="text-amber-300 font-bold">&lt; 120 Mins to Farmer Bank Account</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800">
            🔒 <strong>Zero Default Guarantee:</strong> The buyer (Sri Lakshmi Agri Food Processing Ltd.) cannot cancel or deduct payments after the truck is loaded at the farm gate. Payout is automatically wired to Farmer Ramesh Kumar upon digital weighbridge signoff.
          </p>
        </div>
      )}

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-extrabold text-slate-900 text-base">
                Farm Gate Dynamic QR Pass
              </h4>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center">
              <div className="w-48 h-48 bg-white p-3 rounded-xl border-2 border-slate-900 flex items-center justify-center relative">
                {/* Visual QR Pattern */}
                <div className="grid grid-cols-6 gap-1 w-full h-full p-1 bg-slate-900/5 rounded">
                  {Array.from({ length: 36 }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`rounded-xs ${
                        (idx % 2 === 0 && idx % 3 !== 1) || idx === 0 || idx === 5 || idx === 30 || idx === 35
                          ? "bg-slate-900"
                          : "bg-transparent"
                      }`}
                    />
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="px-2 py-1 bg-emerald-600 text-white font-mono font-black text-[10px] rounded shadow-md">
                    KISAN SETU
                  </span>
                </div>
              </div>
              <span className="font-mono text-xl font-black text-slate-900 mt-3 tracking-widest">
                {farmerOtp}
              </span>
              <span className="text-[10px] text-slate-500 mt-1">
                Signed Token • AP02 TC 4481 • Ramesh Kumar
              </span>
            </div>

            <p className="text-xs text-slate-600">
              Ask driver to scan this code with the Kisan Setu Transporter App to authorize vehicle loading.
            </p>

            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
            >
              Close Pass
            </button>
          </div>
        </div>
      )}

      {/* SOS Route Deviation Modal */}
      {showSosModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-rose-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-rose-600 font-black">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h4 className="text-base text-slate-900 font-black">
                  Report Route Deviation / Suspicious Activity
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowSosModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {sosSent ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h5 className="font-black text-emerald-900 text-sm">
                  APMC Agro-Vigilance Alert Dispatched!
                </h5>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Incident ticket <strong>#INC-2026-ATP-0841</strong> logged. The APMC Market Inspector and Highway Patrol have been notified with live GPS coordinates.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSosSent(false);
                    setShowSosModal(false);
                  }}
                  className="mt-3 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs"
                >
                  Dismiss Alert
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  If you suspect an unassigned vehicle, unauthorized cargo loading, off-corridor detour, or produce theft, trigger an instant security freeze.
                </p>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Trip ID:</span>
                    <span className="font-mono font-bold text-slate-800">{transaction.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Assigned Vehicle:</span>
                    <span className="font-bold text-slate-800">{transaction.vehicleType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Helpline:</span>
                    <span className="font-bold text-rose-600">1800-425-AGRI (24x7)</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSosModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setSosSent(true)}
                    className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/20 cursor-pointer"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Trigger Security Alert</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
