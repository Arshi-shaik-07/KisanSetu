import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Sprout,
  Store,
  UserPlus,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../types";

const DISTRICT_DATA: Record<string, string[]> = {
  Karnataka: ["Kolar", "Chikkaballapur", "Bengaluru Rural", "Bengaluru Urban", "Tumkur", "Mandya", "Mysuru", "Hassan"],
  "Andhra Pradesh": ["Anantapur", "Chittoor", "Kadapa", "Kurnool", "Guntur"],
  Maharashtra: ["Nashik", "Pune", "Ahmednagar", "Solapur"],
  "Tamil Nadu": ["Coimbatore", "Dharmapuri", "Krishnagiri", "Salem"],
};

export function Register() {
  const { register, user, pendingTwoFactor } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const preset = params.get("role") === "buyer" ? "buyer" : "farmer";

  const [role, setRole] = useState<Role>(preset);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [stateName, setStateName] = useState("Karnataka");
  const [district, setDistrict] = useState("Kolar");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user && !pendingTwoFactor) {
    return <Navigate to="/verification" replace />;
  }

  // Password strength check
  const hasMinLen = password.length >= 8;
  const hasLetters = /[A-Za-z]/.test(password);
  const hasDigits = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const strengthScore = [hasMinLen, hasLetters, hasDigits, hasSpecial].filter(Boolean).length;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register({
        role,
        name,
        email,
        mobile,
        password,
        state: stateName,
        district,
      });
      navigate("/verification");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create account.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-slate-50 via-emerald-50/20 to-slate-100 py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold mb-3 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Kisan Setu Verified Producer Network</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Create Verified Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-lg mx-auto">
            Join thousands of verified farmers and buyers redistributing surplus agricultural harvest directly.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-emerald-950/5 p-6 sm:p-8">
          {/* Role Picker */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl mb-6 border border-slate-200/80">
            <button
              type="button"
              onClick={() => setRole("farmer")}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
                role === "farmer"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sprout className="w-4 h-4" />
              Farmer / FPO Producer
            </button>
            <button
              type="button"
              onClick={() => setRole("buyer")}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
                role === "buyer"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Store className="w-4 h-4" />
              Buyer / Processor / Mandi
            </button>
          </div>

          <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                {role === "farmer" ? "Full Name of Farmer / FPO" : "Enterprise / Organization Name"} *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === "farmer" ? "e.g. Ramesh Kumar" : "e.g. Sri Lakshmi Agro Mills Pvt Ltd"}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium"
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Mobile Number (WhatsApp) *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs font-bold text-slate-400">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                    placeholder="98450 12345"
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  State
                </label>
                <select
                  value={stateName}
                  onChange={(e) => {
                    setStateName(e.target.value);
                    const dists = DISTRICT_DATA[e.target.value] || [];
                    if (dists.length) setDistrict(dists[0]);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                >
                  {Object.keys(DISTRICT_DATA).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  District
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                >
                  {(DISTRICT_DATA[stateName] || []).map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Checklist */}
              {password && (
                <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-500">Password Strength:</span>
                    <span className={
                      strengthScore >= 3 ? "text-emerald-700 font-extrabold" : "text-amber-700"
                    }>
                      {strengthScore >= 4 ? "Very Strong 🔒" : strengthScore === 3 ? "Good 👍" : "Weak ⚠️"}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-600">
                    <span className={`flex items-center gap-1 ${hasMinLen ? "text-emerald-700 font-bold" : ""}`}>
                      {hasMinLen ? "✓" : "○"} 8+ chars
                    </span>
                    <span className={`flex items-center gap-1 ${hasLetters ? "text-emerald-700 font-bold" : ""}`}>
                      {hasLetters ? "✓" : "○"} Letters
                    </span>
                    <span className={`flex items-center gap-1 ${hasDigits ? "text-emerald-700 font-bold" : ""}`}>
                      {hasDigits ? "✓" : "○"} Numbers
                    </span>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold py-3.5 text-sm transition shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {busy ? (
                <span>Generating Cryptographic Keys…</span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account & Continue to Verification</span>
                </>
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-slate-600">
            Already have an account?{" "}
            <Link to="/login" className="font-extrabold text-emerald-700 hover:underline">
              Sign In here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
