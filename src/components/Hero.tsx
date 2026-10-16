import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { M, type Language } from "../lib/translations";

interface HeroProps {
  onNavigate: (tab: string) => void;
  lang: Language;
}

export function Hero({ onNavigate, lang }: HeroProps) {
  const t = (M[lang] || M.en).hero;
  const appName = (M[lang] || M.en).appName;

  const stages = [
    {
      step: "01",
      title: t.stages[0]?.title || "Farmer",
      desc: t.stages[0]?.sub || "Lists perishable surplus volume & harvest date",
      actionText: t.stages[0]?.action || "Explore Stage",
      icon: "🧑‍🌾",
      action: () => onNavigate("farmer"),
    },
    {
      step: "02",
      title: t.stages[1]?.title || "Kisan Setu",
      desc: t.stages[1]?.sub || "Digital bridge verifies credentials & quality grade",
      actionText: t.stages[1]?.action || "Explore Stage",
      icon: "🌱",
      action: () => onNavigate("buyer"),
    },
    {
      step: "03",
      title: t.stages[2]?.title || "Smart Matching",
      desc: t.stages[2]?.sub || "5-factor AI evaluates commodity, volume & 6km proximity",
      actionText: t.stages[2]?.action || "Explore Stage",
      icon: "⚡",
      action: () => onNavigate("matches"),
      highlight: true,
    },
    {
      step: "04",
      title: t.stages[3]?.title || "Buyer / Recipient",
      desc: t.stages[3]?.sub || "Processors, Mandis, NGOs & Canteens confirm demand",
      actionText: t.stages[3]?.action || "Explore Stage",
      icon: "🏭",
      action: () => onNavigate("buyer"),
    },
    {
      step: "05",
      title: t.stages[4]?.title || "Pickup & Impact",
      desc: t.stages[4]?.sub || "Mini-truck routed, waste saved, payout released",
      actionText: t.stages[4]?.action || "Explore Stage",
      icon: "🚚",
      action: () => onNavigate("logistics"),
    },
  ];

  return (
    <div className="relative bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 text-white overflow-hidden py-12 sm:py-16 px-4 sm:px-8 rounded-3xl shadow-2xl border border-emerald-800/40">
      {/* Background ambient glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-10">
        {/* Main Hero Header */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold tracking-wide shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{t.tag}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
            <span className="block text-white mb-2">{appName}</span>
            <span className="block leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-300">
                Connecting Surplus Produce to{" "}
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-200">
                the Right Buyer
              </span>
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-emerald-100/90 max-w-3xl mx-auto font-normal leading-relaxed italic">
            {t.subtitle}
          </p>

          {/* Action CTAs */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3.5">
            <button
              onClick={() => onNavigate("farmer")}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-sm sm:text-base shadow-lg shadow-amber-500/20 hover:scale-102 transition flex items-center gap-2 cursor-pointer"
            >
              <span>{t.btnList}</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
            <button
              onClick={() => onNavigate("buyer")}
              className="px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm sm:text-base border border-emerald-500/40 shadow-sm hover:scale-102 transition flex items-center gap-2 cursor-pointer"
            >
              <span>{t.btnFind}</span>
            </button>
            <button
              onClick={() => onNavigate("buyer")}
              className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-emerald-200 font-bold text-sm sm:text-base border border-slate-700 hover:scale-102 transition flex items-center gap-2 cursor-pointer"
            >
              <span>{t.btnExplore}</span>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-3 text-xs text-emerald-300/80">
            {t.trustBadges.map((badge: string, idx: number) => (
              <span key={idx} className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{badge}</span>
              </span>
            ))}
          </div>
        </div>

        {/* End-to-End Lifecycle Visualizer */}
        <div className="bg-slate-900/85 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-emerald-600/30 shadow-2xl">
          <div className="text-center mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
              {t.flowHeading}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
              {stages.map((s) => s.title).join(" → ")}
            </h3>
            <p className="text-xs text-slate-400 mt-1">{t.flowSub}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 relative">
            {stages.map((s) => (
              <div
                key={s.step}
                onClick={s.action}
                className={`p-4 rounded-xl border transition cursor-pointer relative group flex flex-col justify-between ${
                  s.highlight
                    ? "bg-amber-950/40 border-amber-400/60 ring-2 ring-amber-400/20 hover:bg-amber-900/40"
                    : "bg-slate-800/60 border-slate-700 hover:border-emerald-500 hover:bg-slate-800"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{s.icon}</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">
                      STEP {s.step}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-white group-hover:text-emerald-300 transition">
                    {s.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1.5 leading-snug">
                    {s.desc}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] font-semibold text-emerald-400 group-hover:text-amber-300">
                  <span>{s.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
