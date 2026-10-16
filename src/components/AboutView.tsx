import { AlertTriangle, Info, Sprout, HeartHandshake } from "lucide-react";
import { M, type Language } from "../lib/translations";

export function AboutView({ lang }: { lang: Language }) {
  const t = (M[lang] || M.en).about;

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* 1. Header Banner */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
          {t.tag}
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {t.title}
        </h2>
      </div>

      {/* 2. Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex items-start gap-3.5 text-xs text-amber-900">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-extrabold text-sm text-amber-950 mb-1">
            {t.disclaimerTitle}
          </h4>
          <p className="leading-relaxed">{t.disclaimerDesc}</p>
        </div>
      </div>

      {/* 3. Three Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <Info className="w-5 h-5" />
          </div>
          <h3 className="font-black text-base text-slate-900">{t.p1Title}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">{t.p1Desc}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Sprout className="w-5 h-5" />
          </div>
          <h3 className="font-black text-base text-slate-900">{t.p2Title}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">{t.p2Desc}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="font-black text-base text-slate-900">{t.p3Title}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">{t.p3Desc}</p>
        </div>
      </div>
    </div>
  );
}
