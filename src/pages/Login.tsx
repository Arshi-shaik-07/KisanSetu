import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Phone,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Sprout,
  Store,
  UserCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function Login() {
  const { login, user, pendingTwoFactor, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;

  const [roleTab, setRoleTab] = useState<"farmer" | "buyer">("farmer");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotStep, setForgotStep] = useState<"phone" | "otp" | "done">("phone");
  const [forgotMsg, setForgotMsg] = useState("");

  if (user && !pendingTwoFactor) {
    return <Navigate to={from || (user.role === "farmer" ? "/farmer" : "/marketplace")} replace />;
  }
  if (pendingTwoFactor) {
    return <Navigate to="/login/2fa" replace />;
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const result = await login(identifier, password, rememberMe);
      if (result.needsTwoFactor) {
        navigate("/login/2fa");
      } else {
        navigate(from || (roleTab === "farmer" ? "/farmer" : "/marketplace"));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
    } finally {
      setBusy(false);
    }
  };

  const handleDemoLogin = async (id: string, pass: string, role: "farmer" | "buyer") => {
    setRoleTab(role);
    setIdentifier(id);
    setPassword(pass);
    setError("");
    setBusy(true);
    try {
      const result = await login(id, pass, true);
      if (result.needsTwoFactor) {
        navigate("/login/2fa");
      } else {
        navigate(role === "farmer" ? "/farmer" : "/marketplace");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Demo sign in failed.");
    } finally {
      setBusy(false);
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    setForgotMsg("");
    try {
      if (forgotStep === "phone") {
        if (!forgotIdentifier.trim()) throw new Error("Enter your registered email or 10-digit mobile.");
        setForgotStep("otp");
        setForgotMsg("Simulated 6-digit OTP sent to your mobile: 123456");
      } else if (forgotStep === "otp") {
        if (forgotOtp.trim() !== "123456" && forgotOtp.trim().length !== 6) {
          throw new Error("Invalid OTP. For prototype demo, enter 123456.");
        }
        await resetPassword(forgotIdentifier, newPassword);
        setForgotStep("done");
        setForgotMsg("Password updated successfully! You can now sign in.");
      }
    } catch (err) {
      setForgotMsg(err instanceof Error ? err.message : "Password reset failed.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-slate-50 via-emerald-50/20 to-slate-100 py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb & Intro */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold mb-3 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Kisan Setu Trust & Identity Gateway</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Sign In to Kisan Setu
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Secure role-based authentication for verified Farmers, FPOs, Mandi Traders, and Food Processors.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Main Login Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-emerald-950/5 p-6 sm:p-8">
            {/* Role Switcher */}
            <div className="p-1 bg-slate-100 rounded-2xl flex gap-1 mb-6 border border-slate-200/80">
              <button
                type="button"
                onClick={() => {
                  setRoleTab("farmer");
                  if (identifier === "buyer@kisansetu.app") {
                    setIdentifier("farmer@kisansetu.app");
                    setPassword("Kisan@1234");
                  }
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                  roleTab === "farmer"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <Sprout className="w-4 h-4" />
                Farmer / FPO Producer
              </button>
              <button
                type="button"
                onClick={() => {
                  setRoleTab("buyer");
                  if (identifier === "farmer@kisansetu.app") {
                    setIdentifier("buyer@kisansetu.app");
                    setPassword("Buyer@1234");
                  }
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                  roleTab === "buyer"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <Store className="w-4 h-4" />
                Buyer / Processor / NGO
              </button>
            </div>

            <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address or Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    {/^\d+$/.test(identifier.trim()) ? (
                      <Phone className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <KeyRound className="w-4 h-4" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={
                      roleTab === "farmer"
                        ? "farmer@kisansetu.app or 9845012345"
                        : "buyer@kisansetu.app or 9845098765"
                    }
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium transition"
                    autoComplete="username"
                    required
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  Accepts 10-digit Indian mobile (with or without +91) or registered email.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotIdentifier(identifier);
                      setShowForgotModal(true);
                      setForgotStep("phone");
                      setForgotMsg("");
                    }}
                    className="text-xs font-bold text-emerald-700 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <LockKeyhole className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium transition"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me & Security Info */}
              <div className="flex items-center justify-between py-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  Remember login on this browser
                </label>
                <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  PBKDF2-SHA256
                </span>
              </div>

              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold py-3.5 text-sm transition-all shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {busy ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Credentials…</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to {roleTab === "farmer" ? "Farmer Portal" : "Buyer Marketplace"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Need a new verified account?</span>
              <Link
                to={`/register?role=${roleTab}`}
                className="font-extrabold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
              >
                Register as {roleTab === "farmer" ? "Farmer / FPO" : "Buyer / Business"} →
              </Link>
            </div>
          </div>

          {/* Quick Demo Accounts & Security Column */}
          <div className="lg:col-span-5 space-y-4">
            {/* Quick Demo Access Box */}
            <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/50 p-6 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm mb-1">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Instant 1-Click Demo Accounts</span>
              </div>
              <p className="text-xs text-slate-600 mb-4">
                Click any profile to instantly authenticate with pre-configured verification credentials:
              </p>

              <div className="space-y-2.5">
                {/* Farmer 1 */}
                <button
                  type="button"
                  onClick={() => handleDemoLogin("farmer@kisansetu.app", "Kisan@1234", "farmer")}
                  className="w-full text-left p-3.5 rounded-2xl bg-white border border-emerald-200 hover:border-emerald-400 hover:shadow-md transition group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                      🌾
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-extrabold text-slate-900 group-hover:text-emerald-700">
                          Ramesh Kumar
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300">
                          🥇 Tier 1 Gold
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Farmer · Kolar, KA · Aadhaar + RTC Verified
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 group-hover:translate-x-0.5 transition">
                    Sign in →
                  </span>
                </button>

                {/* Buyer 1 */}
                <button
                  type="button"
                  onClick={() => handleDemoLogin("buyer@kisansetu.app", "Buyer@1234", "buyer")}
                  className="w-full text-left p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 hover:shadow-md transition group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm">
                      🏢
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-extrabold text-slate-900 group-hover:text-blue-700">
                          Sri Lakshmi Agro Mills
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 border border-blue-200">
                          FSSAI Verified
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Wholesale Buyer · Bangalore · GST + FSSAI
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-700 group-hover:translate-x-0.5 transition">
                    Sign in →
                  </span>
                </button>

                {/* New Farmer (Unverified) */}
                <button
                  type="button"
                  onClick={() => handleDemoLogin("newfarmer@kisansetu.app", "Kisan@1234", "farmer")}
                  className="w-full text-left p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition group flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">🌱</span>
                    <div>
                      <p className="font-bold text-slate-800">Kavitha Devi (New / Fresh)</p>
                      <p className="text-[10px] text-slate-500">Test fresh onboarding & verification steps</p>
                    </div>
                  </div>
                  <span className="font-semibold text-slate-600 group-hover:text-slate-900">Try →</span>
                </button>
              </div>
            </div>

            {/* Authentication & Security Standards */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  5-Layer Trust & Verification Architecture
                </h2>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">🔐 Password Authentication (Essential)</strong>
                    <p className="text-slate-500 text-[11px]">Hashed client-side with PBKDF2 (120,000 rounds).</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">🛡️ Two-Factor Authentication (Recommended)</strong>
                    <p className="text-slate-500 text-[11px]">TOTP Authenticator & SMS OTP for sensitive payouts.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">🌍 Farm Location Verification (Recommended)</strong>
                    <p className="text-slate-500 text-[11px]">District, village, and GPS farm pin for proximity matching.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">🪪 Government ID Verification (Advanced)</strong>
                    <p className="text-slate-500 text-[11px]">Privacy-conscious UIDAI / PAN proof without raw ID storage.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">📄 Farmer Document Verification (Advanced)</strong>
                    <p className="text-slate-500 text-[11px]">Land 7/12 RTC, Soil Health Card, FSSAI / GSTIN licenses.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Reset Password via OTP</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {forgotStep === "phone" && (
              <form onSubmit={(e) => void handleResetPassword(e)} className="space-y-4">
                <p className="text-xs text-slate-600">
                  Enter your registered email or 10-digit mobile number. We will send a secure verification code.
                </p>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Mobile or Email
                  </label>
                  <input
                    type="text"
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    placeholder="9845012345 or farmer@kisansetu.app"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
                    required
                  />
                </div>
                {forgotMsg && <p className="text-xs text-amber-700 font-semibold">{forgotMsg}</p>}
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500"
                  >
                    Send Verification Code
                  </button>
                </div>
              </form>
            )}

            {forgotStep === "otp" && (
              <form onSubmit={(e) => void handleResetPassword(e)} className="space-y-4">
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                  <p className="font-bold">Prototype Demo SMS Simulated:</p>
                  <p>Your OTP is <span className="font-mono font-extrabold text-emerald-800">123456</span></p>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Enter 6-Digit OTP
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value.slice(0, 6))}
                      placeholder="123456"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-center tracking-[0.3em] font-bold"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setForgotOtp("123456")}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold whitespace-nowrap"
                    >
                      Fill Demo
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 chars (e.g. Kisan@5678)"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
                    required
                    minLength={8}
                  />
                </div>
                {forgotMsg && <p className="text-xs text-rose-600 font-semibold">{forgotMsg}</p>}
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep("phone")}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500"
                  >
                    Confirm & Update Password
                  </button>
                </div>
              </form>
            )}

            {forgotStep === "done" && (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-base text-slate-900">Password Changed Successfully!</h4>
                <p className="text-xs text-slate-600">
                  You can now sign in with your updated credentials.
                </p>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500"
                >
                  Return to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
