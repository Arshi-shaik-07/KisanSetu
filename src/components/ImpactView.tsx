import { TrendingUp } from "lucide-react";
import { M, type Language } from "../lib/translations";
import { INITIAL_IMPACT_STATS } from "../lib/seedData";

interface ImpactViewProps {
  sellersCount: number;
  buyersCount: number;
  listingsCount: number;
  transactionsCount: number;
  lang: Language;
}

export function ImpactView({
  sellersCount,
  buyersCount,
  listingsCount,
  transactionsCount,
  lang,
}: ImpactViewProps) {
  const t = (M[lang] || M.en).impact;
  const s = INITIAL_IMPACT_STATS;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t.title}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold border border-emerald-300">
              {t.liveBadge}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* 2. Real-Time Database Dynamic Counters */}
      <div className="bg-gradient-to-br from-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-emerald-800/40 shadow-xl space-y-4">
        <div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
            {t.realSummaryTitle}
          </span>
          <p className="text-xs text-slate-300 mt-1">{t.realSummarySub}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-xs text-slate-400 block">{t.realSellers}</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-black text-amber-300">{sellersCount}</span>
              <span className="text-xs text-slate-400">{t.farmersUnit}</span>
            </div>
            <span className="text-[10px] text-emerald-400 mt-1 block">● {t.sellerFormUpdateNote}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-xs text-slate-400 block">{t.realBuyers}</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-black text-teal-300">{buyersCount}</span>
              <span className="text-xs text-slate-400">{t.buyersUnit}</span>
            </div>
            <span className="text-[10px] text-teal-400 mt-1 block">● {t.buyerFormUpdateNote}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-xs text-slate-400 block">{t.realListings}</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-black text-cyan-300">{listingsCount}</span>
              <span className="text-xs text-slate-400">{t.lotsUnit}</span>
            </div>
            <span className="text-[10px] text-cyan-400 mt-1 block">● {t.produceUpdateNote}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-xs text-slate-400 block">{t.realOrders}</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-black text-emerald-300">{transactionsCount}</span>
              <span className="text-xs text-slate-400">{t.dealsUnit}</span>
            </div>
            <span className="text-[10px] text-amber-300 mt-1 block">● {t.orderUpdateNote}</span>
          </div>
        </div>
      </div>

      {/* 3. Cumulative Regional Impact Model */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-lg font-black text-slate-900">{t.cumulativeModelTitle}</h3>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {t.demoFiguresBadge}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-2xl font-black text-slate-900">{s.farmersConnected}</span>
            <span className="text-xs font-bold text-slate-700 block mt-0.5">{t.netFarmers}</span>
            <span className="text-[10px] text-slate-400">{t.netFarmersSub}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-2xl font-black text-slate-900">{s.buyersConnected}</span>
            <span className="text-xs font-bold text-slate-700 block mt-0.5">{t.netBuyers}</span>
            <span className="text-[10px] text-slate-400">{t.netBuyersSub}</span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-2xl font-black text-emerald-700">{s.produceRescuedTonnes} MT</span>
            <span className="text-xs font-bold text-emerald-900 block mt-0.5">{t.netRescued}</span>
            <span className="text-[10px] text-emerald-600">{t.netRescuedSub}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-2xl font-black text-slate-900">{s.successfulMatches}</span>
            <span className="text-xs font-bold text-slate-700 block mt-0.5">{t.netMatches}</span>
            <span className="text-[10px] text-slate-400">{t.netMatchesSub}</span>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-2xl font-black text-amber-700">₹{s.estimatedWasteReducedLakhs}L</span>
            <span className="text-xs font-bold text-amber-900 block mt-0.5">{t.netSavings}</span>
            <span className="text-[10px] text-amber-600">{t.netSavingsSub}</span>
          </div>

          <div className="p-4 rounded-xl bg-teal-50 border border-teal-200">
            <span className="text-2xl font-black text-teal-700">{s.co2EmissionsSavedTonnes} MT</span>
            <span className="text-xs font-bold text-teal-900 block mt-0.5">{t.ecoTitle}</span>
            <span className="text-[10px] text-teal-600">{t.ecoSub}</span>
          </div>
        </div>

        {/* 4. Monthly Trend Chart Bars */}
        <div className="pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">{t.monthlyChartTitle}</h4>
              <p className="text-xs text-slate-500">{t.monthlyChartSub}</p>
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="h-44 flex items-end gap-2 pt-4 px-2">
            {s.monthlyData.map((d, i) => {
              const maxVal = 20;
              const heightPct = Math.round((d.rescuedTonnes / maxVal) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[10px] font-bold text-emerald-800 opacity-0 group-hover:opacity-100 transition">
                    {d.rescuedTonnes}
                  </span>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-lg transition-all group-hover:from-emerald-500 group-hover:to-teal-300"
                  />
                  <span className="text-[10px] font-bold text-slate-500">{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
