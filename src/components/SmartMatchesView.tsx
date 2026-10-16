import { useState } from "react";
import {
  Radio,
  CheckCircle2,
  Phone,
  MessageSquare,
  FileText,
  ShieldCheck,
  Building,
  Sparkles,
} from "lucide-react";
import { M, type Language } from "../lib/translations";
import type { TargetProduce, ScoredRecipient } from "../lib/matchingEngine";
import type { MatchingRecipient } from "../lib/seedData";

interface SmartMatchesViewProps {
  farmerProduce: TargetProduce;
  rankedRecipients: ScoredRecipient[];
  topMatch: ScoredRecipient | null;
  onVerifyRecipient: (recipient: MatchingRecipient) => void;
  onContactRecipient: (recipient: MatchingRecipient, tab: "deal" | "call" | "whatsapp") => void;
  onOpenRadar: () => void;
  lang: Language;
}

export function SmartMatchesView({
  farmerProduce,
  rankedRecipients,
  topMatch,
  onVerifyRecipient,
  onContactRecipient,
  onOpenRadar,
  lang,
}: SmartMatchesViewProps) {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sortOrder, setSortOrder] = useState<"SCORE_DESC" | "DISTANCE_ASC" | "PRICE_DESC" | "DEMAND_DESC">("SCORE_DESC");
  const [searchQuery, setSearchQuery] = useState("");
  const [radarCardOpen] = useState(true);

  const t = (M[lang] || M.en).matches;

  const categories = [
    { id: "ALL", label: t.catAll },
    { id: "Processor", label: t.catProcessor },
    { id: "Wholesaler", label: t.catWholesaler },
    { id: "NGO / Rescue", label: t.catNGO },
    { id: "Retail", label: t.catRetail },
    { id: "Canteen", label: t.catCanteen },
  ];

  const filteredRecipients = rankedRecipients
    .filter((r) => {
      if (selectedCategory !== "ALL" && r.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.name.toLowerCase().includes(q) ||
          r.district.toLowerCase().includes(q) ||
          r.contactPerson.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "DISTANCE_ASC") return a.matchAnalysis.distanceKm - b.matchAnalysis.distanceKm;
      if (sortOrder === "PRICE_DESC") return b.offeredPricePerKg - a.offeredPricePerKg;
      if (sortOrder === "DEMAND_DESC") return b.demandedQuantityKg - a.demandedQuantityKg;
      return b.score - a.score;
    });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t.title}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold border border-amber-300">
              {t.badge}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        <button
          onClick={onOpenRadar}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <Radio className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>{t.btnRadar}</span>
        </button>
      </div>

      {/* 2. Canonical Tomato / Target Produce AI Matching Engine Card */}
      {topMatch && radarCardOpen && (
        <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-emerald-600/40 shadow-xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-emerald-800/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {t.canonicalNotice}
                </span>
                <span className="text-xs text-slate-400">
                  {t.canonicalEvaluationFor} <strong className="text-white">{farmerProduce.quantityKg} kg {farmerProduce.cropName}</strong> ({farmerProduce.location})
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-2">
                {t.engineTitle}
              </h3>
              <p className="text-xs text-emerald-200/80 mt-1">
                {t.engineSub}
              </p>
            </div>

            <div className="flex items-center gap-4 bg-emerald-900/60 p-4 rounded-2xl border border-emerald-500/30">
              <div className="text-right">
                <span className="text-xs text-emerald-200 font-bold block">{t.scoreLabel}</span>
                <span className="text-3xl sm:text-4xl font-black text-amber-300">
                  {topMatch.score}%
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-amber-300 animate-spin" style={{ animationDuration: "8s" }} />
              </div>
            </div>
          </div>

          {/* 4 Decision Questions Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-6">
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <span className="text-[11px] font-bold text-slate-400 block mb-1">
                {t.q1.replace("{crop}", farmerProduce.cropName)}
              </span>
              <span className="font-extrabold text-sm text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {t.q1Ans}
              </span>
              <p className="text-[11px] text-slate-300 mt-1">
                Exact grade readiness: Grade {farmerProduce.grade || "A"}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <span className="text-[11px] font-bold text-slate-400 block mb-1">
                {t.q2}
              </span>
              <span className="font-extrabold text-sm text-amber-300">
                {t.q2Ans.replace("{demanded}", String(topMatch.demandedQuantityKg))}
              </span>
              <p className="text-[11px] text-slate-300 mt-1">
                {t.q2Sub.replace("{pct}", String(Math.round((topMatch.demandedQuantityKg / farmerProduce.quantityKg) * 100)))}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <span className="text-[11px] font-bold text-slate-400 block mb-1">
                {t.q3}
              </span>
              <span className="font-extrabold text-sm text-teal-300">
                {t.q3Ans.replace("{distance}", String(topMatch.matchAnalysis.distanceKm))}
              </span>
              <p className="text-[11px] text-slate-300 mt-1">
                {t.q3Sub}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <span className="text-[11px] font-bold text-slate-400 block mb-1">
                {t.q4}
              </span>
              <span className="font-extrabold text-sm text-cyan-300">
                {t.q4Ans.replace("{hours}", String(topMatch.urgencyHoursNeeded))}
              </span>
              <p className="text-[11px] text-slate-300 mt-1">
                {t.q4Sub.replace("{days}", String(farmerProduce.shelfLifeDaysRemaining || 4))}
              </p>
            </div>
          </div>

          {/* 5-Dimensional Weights Breakdown */}
          <div className="pt-4 border-t border-emerald-900/60">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <span className="font-bold text-emerald-300">{t.weightsHeading}</span>
              <span>{t.weightsSub}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-semibold">
              <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700">
                <span className="text-slate-400 block text-[10px]">{t.wCrop} (30%)</span>
                <span className="text-emerald-300 font-extrabold">{topMatch.matchAnalysis.breakdown.crop.score} / 30 pts</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700">
                <span className="text-slate-400 block text-[10px]">{t.wDistance} (25%)</span>
                <span className="text-teal-300 font-extrabold">{Math.round(topMatch.matchAnalysis.breakdown.distance.score)} / 25 pts</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700">
                <span className="text-slate-400 block text-[10px]">{t.wVolume} (20%)</span>
                <span className="text-amber-300 font-extrabold">{topMatch.matchAnalysis.breakdown.quantity.score} / 20 pts</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700">
                <span className="text-slate-400 block text-[10px]">{t.wFreshness} (15%)</span>
                <span className="text-cyan-300 font-extrabold">{Math.round(topMatch.matchAnalysis.breakdown.urgency.score)} / 15 pts</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700">
                <span className="text-slate-400 block text-[10px]">{t.wPrice} (10%)</span>
                <span className="text-rose-300 font-extrabold">{topMatch.matchAnalysis.breakdown.priceAndTrust.score} / 10 pts</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Filter Bar & Recipient Count */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              {t.matchingRecipients.replace("{count}", String(filteredRecipients.length))}
            </h3>
            <p className="text-xs text-slate-500">
              {t.sortedForProduce
                .replace("{quantity}", String(farmerProduce.quantityKg))
                .replace("{crop}", farmerProduce.cropName)
                .replace("{location}", farmerProduce.location)}
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <input
              type="text"
              placeholder={t.searchRecipientPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs w-full sm:w-60 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white cursor-pointer"
            >
              <option value="SCORE_DESC">{t.sortAgriLink}</option>
              <option value="DISTANCE_ASC">{t.sortDistance}</option>
              <option value="PRICE_DESC">{t.sortPrice}</option>
              <option value="DEMAND_DESC">{t.sortDemand}</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === c.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Ranked Recipient Cards List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredRecipients.map((rec, index) => {
          const isPrime = index === 0 && rec.score >= 90;
          return (
            <div
              key={rec.id}
              className={`bg-white rounded-2xl p-6 border transition shadow-sm hover:shadow-md ${
                isPrime
                  ? "border-amber-400 ring-2 ring-amber-400/20 bg-gradient-to-r from-amber-50/30 via-white to-white"
                  : "border-slate-200"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left Info */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-base sm:text-lg font-black text-slate-900">
                      {rec.name}
                    </h4>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {rec.businessType}
                    </span>
                    {rec.verified && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        {t.apmcVerified}
                      </span>
                    )}
                    {isPrime && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-xs">
                        {t.primeMatch}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{rec.address}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                    <span className="text-slate-600">
                      <strong className="text-slate-900">{t.distance}:</strong> {rec.matchAnalysis.distanceKm} km
                    </span>
                    <span className="text-slate-600">
                      <strong className="text-slate-900">{t.demand}:</strong> {rec.demandedQuantityKg} kg
                    </span>
                    <span className="text-slate-600">
                      <strong className="text-slate-900">{t.offeredPrice}:</strong> ₹{rec.offeredPricePerKg}/kg
                    </span>
                    <span className="text-slate-600">
                      <strong className="text-slate-900">{t.neededIn}:</strong> {rec.urgencyLabel}
                    </span>
                  </div>

                  <p className="text-xs text-emerald-700 font-medium">
                    {rec.matchAnalysis.reasons[0]}
                  </p>
                </div>

                {/* Right Actions & Score */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-end sm:items-center lg:items-end justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        AgriLink Score
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-emerald-600">
                        {rec.score}%
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => onVerifyRecipient(rec)}
                      className="px-3 py-2 rounded-xl border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{t.btnVerifyKYC}</span>
                    </button>

                    <button
                      onClick={() => onContactRecipient(rec, "call")}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-600" />
                      <span>{t.btnCall}</span>
                    </button>

                    <button
                      onClick={() => onContactRecipient(rec, "whatsapp")}
                      className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition cursor-pointer flex items-center gap-1 border border-emerald-200"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t.btnWhatsApp}</span>
                    </button>

                    <button
                      onClick={() => onContactRecipient(rec, "deal")}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs transition shadow-sm cursor-pointer flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{t.btnLockDeal}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
