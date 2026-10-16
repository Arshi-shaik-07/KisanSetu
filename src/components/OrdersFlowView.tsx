import { useState } from "react";
import {
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  Building,
  MapPin,
  Sparkles,
} from "lucide-react";
import { M, type Language } from "../lib/translations";
import type { Transaction } from "../lib/seedData";

interface OrdersFlowViewProps {
  transactions: Transaction[];
  onUpdateStatus: (
    transactionId: string,
    newStatus: Transaction["status"],
    newStageIndex: number,
    note: string
  ) => void;
  lang: Language;
}

export function OrdersFlowView({
  transactions,
  onUpdateStatus,
  lang,
}: OrdersFlowViewProps) {
  const [selectedTxnId, setSelectedTxnId] = useState(transactions[0]?.id || "");
  const t = (M[lang] || M.en).transactions;

  const activeTxn = transactions.find((x) => x.id === selectedTxnId) || transactions[0];

  if (!activeTxn) return null;

  const stages = [
    { title: t.stages[0]?.title || "Request Sent", sub: t.stages[0]?.sub || "Buyer sends order" },
    { title: t.stages[1]?.title || "Farmer Accepted", sub: t.stages[1]?.sub || "Farmer verifies lot" },
    { title: t.stages[2]?.title || "Pickup Scheduled", sub: t.stages[2]?.sub || "Mini-truck routed" },
    { title: t.stages[3]?.title || "In Transit", sub: t.stages[3]?.sub || "Produce on road" },
    { title: t.stages[4]?.title || "Delivered", sub: t.stages[4]?.sub || "Impact recorded" },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. View Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t.title}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold border border-emerald-300">
              {t.badge}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Order Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto self-start md:self-auto bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          {transactions.map((txn) => (
            <button
              key={txn.id}
              onClick={() => setSelectedTxnId(txn.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                txn.id === activeTxn.id
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {txn.id} ({txn.cropName.split(" ")[0]})
            </button>
          ))}
        </div>
      </div>

      {/* 2. Order Summary Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t.orderNumber} {activeTxn.id}
            </span>
            <h3 className="text-2xl font-black text-slate-900">
              {activeTxn.cropName} • {activeTxn.quantity}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Rate: <strong className="text-slate-700">{activeTxn.pricePerUnit}</strong>
            </p>
          </div>

          <div className="text-left sm:text-right bg-emerald-50 sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-emerald-200">
            <span className="text-xs font-bold text-slate-500 block">
              {t.totalPayout}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-600">
              {activeTxn.totalAmount}
            </span>
          </div>
        </div>

        {/* 3. 5-Stage Visual Progress Bar */}
        <div className="py-2">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {stages.map((stage, idx) => {
              const isCompleted = idx < activeTxn.stageIndex;
              const isCurrent = idx === activeTxn.stageIndex;
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border transition relative ${
                    isCurrent
                      ? "bg-amber-50 border-amber-400 ring-2 ring-amber-400/20"
                      : isCompleted
                      ? "bg-emerald-50 border-emerald-300"
                      : "bg-slate-50 border-slate-200 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-white/80 border border-slate-200">
                      STAGE {idx + 1}
                    </span>
                    {isCurrent ? (
                      <span className="text-[9px] font-black text-amber-700 uppercase">
                        {t.inProgress}
                      </span>
                    ) : isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                  <h4 className="font-black text-xs text-slate-900">
                    {stage.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-snug mt-0.5">
                    {stage.sub}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Live Simulation Action Triggers */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                {t.simulateLabel}
              </span>
              <p className="text-xs text-slate-300">
                {t.simulateSub}
              </p>
            </div>
            <button
              onClick={() =>
                onUpdateStatus(
                  activeTxn.id,
                  "Request Sent",
                  0,
                  "Reset order to stage 1"
                )
              }
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.btnResetDemo}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {activeTxn.stageIndex === 0 && (
              <>
                <button
                  onClick={() =>
                    onUpdateStatus(
                      activeTxn.id,
                      "Farmer Accepted",
                      1,
                      "Farmer confirmed produce readiness"
                    )
                  }
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.btnAccept}</span>
                </button>
                <button
                  onClick={() =>
                    onUpdateStatus(
                      activeTxn.id,
                      "Rejected",
                      0,
                      "Farmer declined request"
                    )
                  }
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-rose-300 hover:text-rose-200 font-bold text-xs border border-rose-900/40 transition cursor-pointer"
                >
                  <span>{t.btnReject}</span>
                </button>
              </>
            )}

            {activeTxn.stageIndex === 1 && (
              <>
                <button
                  onClick={() =>
                    onUpdateStatus(
                      activeTxn.id,
                      "Pickup Scheduled",
                      2,
                      "Mini-truck (Tata Ace) assigned for collection"
                    )
                  }
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Truck className="w-4 h-4" />
                  <span>{t.btnSchedulePickup}</span>
                </button>
                <button
                  onClick={() =>
                    onUpdateStatus(
                      activeTxn.id,
                      "Request Sent",
                      0,
                      "Reverted to initial request"
                    )
                  }
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  <span>{t.btnRevertRequest}</span>
                </button>
              </>
            )}

            {activeTxn.stageIndex === 2 && (
              <>
                <button
                  onClick={() =>
                    onUpdateStatus(
                      activeTxn.id,
                      "In Transit",
                      3,
                      "Produce loaded from farm yard; now en-route"
                    )
                  }
                  className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Truck className="w-4 h-4" />
                  <span>{t.btnMarkTransit}</span>
                </button>
                <button
                  onClick={() =>
                    onUpdateStatus(
                      activeTxn.id,
                      "Farmer Accepted",
                      1,
                      "Reverted to farmer confirmation"
                    )
                  }
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  <span>{t.btnBack}</span>
                </button>
              </>
            )}

            {activeTxn.stageIndex === 3 && (
              <>
                <button
                  onClick={() =>
                    onUpdateStatus(
                      activeTxn.id,
                      "Delivered",
                      4,
                      "Batch delivered, digital weighment signed, payout released"
                    )
                  }
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.btnMarkDelivered}</span>
                </button>
              </>
            )}

            {activeTxn.stageIndex >= 4 && (
              <div className="flex items-center gap-2 text-xs text-emerald-300 font-extrabold bg-emerald-950/60 px-4 py-2 rounded-xl border border-emerald-500/30">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{t.dealCompletedPill}</span>
              </div>
            )}
          </div>
        </div>

        {/* 5. Stakeholder Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100 text-xs">
          <div className="space-y-1.5">
            <span className="font-extrabold text-slate-400 uppercase tracking-wider block">
              {t.farmerCol}
            </span>
            <p className="font-black text-slate-900 text-sm">{activeTxn.farmerName}</p>
            <p className="text-slate-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{activeTxn.farmerLocation}</span>
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="font-extrabold text-slate-400 uppercase tracking-wider block">
              {t.buyerCol}
            </span>
            <p className="font-black text-slate-900 text-sm">{activeTxn.buyerName}</p>
            <p className="text-slate-500 flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span>{activeTxn.buyerLocation}</span>
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="font-extrabold text-slate-400 uppercase tracking-wider block">
              {t.logisticsCol}
            </span>
            <p className="font-black text-slate-900 text-sm">{activeTxn.vehicleType}</p>
            <p className="text-slate-500">{activeTxn.driverName}</p>
            <p className="text-slate-500">
              {activeTxn.distanceKm} km • ~{activeTxn.transitTimeEst}
            </p>
          </div>
        </div>

        {/* 6. Milestone History Timeline */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          <span className="font-extrabold text-xs text-slate-900 block">
            Milestone Timeline Log
          </span>
          <div className="space-y-2">
            {activeTxn.history.map((h, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{h.step}</span>
                    <span className="text-[11px] text-slate-400">{h.time}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">{h.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
