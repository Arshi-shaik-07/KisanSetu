import { useEffect, useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, KeyRound, MessageSquare, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { currentTotp } from "../lib/totp";

export function TwoFactor() {
  const { pendingTwoFactor, completeTwoFactor, logout, user, twoFactorMethod, pendingTotpSecret } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [liveOtp, setLiveOtp] = useState("123456");

  // Keep countdown timer synced
  useEffect(() => {
    const interval = window.setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = 30 - (now % 30);
      setSecondsLeft(remaining);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute live TOTP if secret exists
  useEffect(() => {
    if (pendingTotpSecret) {
      void currentTotp(pendingTotpSecret).then(setLiveOtp);
    }
  }, [pendingTotpSecret, secondsLeft]);

  if (!pendingTwoFactor) {
    return <Navigate to="/login" replace />;
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await completeTwoFactor(code);
      navigate(user?.role === "farmer" ? "/farmer" : "/marketplace");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Code rejected. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const isSms = twoFactorMethod === "sms";

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-slate-50 via-emerald-50/20 to-slate-100 py-12 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl shadow-emerald-950/5 p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <ShieldCheck className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Two-Factor Verification
          </h1>
          <p className="text-xs text-slate-600 mt-1.5">
            {isSms ? (
              <span className="flex items-center justify-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                6-digit OTP sent to registered mobile{" "}
                <strong className="text-slate-800">
                  {user?.mobile ? `+91 ${user.mobile.slice(0, 3)}•••••${user.mobile.slice(-2)}` : "number"}
                </strong>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                Enter the 6-digit code from your Authenticator app
              </span>
            )}
          </p>
        </div>

        {/* Prototype Demo Quick Helper Box */}
        <div className="mb-6 rounded-2xl bg-amber-50/90 border border-amber-200 p-3.5 text-xs text-amber-900">
          <div className="flex items-center justify-between font-bold mb-1">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Prototype Test Helper
            </span>
            <span className="flex items-center gap-1 text-[11px] text-amber-700 font-semibold">
              <Clock className="w-3 h-3" />
              Expires in {secondsLeft}s
            </span>
          </div>
          <p className="text-[11px] text-amber-800 mb-2">
            For instant testing without scanning a QR code, you can use the live simulated code:
          </p>
          <div className="flex items-center justify-between bg-white rounded-xl p-2 border border-amber-200">
            <span className="font-mono font-black text-emerald-700 tracking-widest text-sm">
              {liveOtp || "123456"}
            </span>
            <button
              type="button"
              onClick={() => setCode(liveOtp || "123456")}
              className="px-2.5 py-1 rounded-lg bg-amber-200/60 hover:bg-amber-200 text-amber-900 font-bold text-[11px] transition"
            >
              Auto-Fill Code
            </button>
          </div>
        </div>

        <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 text-center">
              Enter 6-Digit Security Code
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              autoComplete="one-time-code"
              className="w-full rounded-2xl border-2 border-slate-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 px-3 py-3.5 text-center text-3xl tracking-[0.5em] font-mono font-black text-slate-800 transition shadow-inner"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              autoFocus
              required
            />
          </div>

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 font-medium text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy || code.length < 6}
            className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold py-3.5 text-sm transition shadow-md shadow-emerald-600/20 disabled:opacity-50 cursor-pointer"
          >
            {busy ? "Verifying Token…" : "Confirm & Access Dashboard"}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Sign in with another account
          </button>

          <button
            type="button"
            onClick={() => {
              setCode("123456");
            }}
            className="text-emerald-700 font-bold hover:underline"
          >
            Use Demo Code 123456
          </button>
        </div>
      </div>
    </div>
  );
}
