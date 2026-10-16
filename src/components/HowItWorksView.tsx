import { Sprout, Zap, Truck, Phone } from "lucide-react";
import { M, type Language } from "../lib/translations";

export function HowItWorksView({ lang }: { lang: Language }) {
  const t = (M[lang] || M.en).howItWorks;
  const trust = (M[lang] || M.en).trust;

  const stepIcons = [Sprout, Zap, Phone, Truck];

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* 1. How It Works Section */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            {t.tag}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {t.steps.map((s: any, idx: number) => {
            const Icon = stepIcons[idx] || Sprout;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-400 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-emerald-600 font-mono">
                      {s.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-700 shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-black text-slate-900 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Trust & Security Architecture */}
      <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white p-6 sm:p-10 rounded-3xl border border-emerald-800/40 shadow-xl space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
            {trust.zeroDefaultRating}
          </span>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {trust.title}
          </h3>
          <p className="text-xs sm:text-sm text-emerald-200/80">{trust.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {trust.pillars.map((p: any, idx: number) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2 inline-block">
                  {p.badge}
                </span>
                <h4 className="font-extrabold text-sm text-white mb-1.5">{p.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
