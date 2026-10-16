import { useState } from "react";
import {
  Truck,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  Radio,
  Map as MapIcon,
  Activity
} from "lucide-react";
import { M, type Language } from "../lib/translations";
import type { Transaction } from "../lib/seedData";
import { GpsRouteMap } from "./GpsRouteMap";
import { LogisticsSecurityCenter } from "./LogisticsSecurityCenter";

interface LogisticsViewProps {
  activeTransaction: Transaction;
  lang: Language;
}

export function LogisticsView({ activeTransaction, lang }: LogisticsViewProps) {
  const t = (M[lang] || M.en).logistics;
  const [navMode, setNavMode] = useState<"gps_map" | "schematic">("gps_map");

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. View Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t.title}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-extrabold border border-teal-300">
              {t.badge}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold border border-emerald-300 flex items-center gap-1">
              <Radio className="w-3 h-3 animate-pulse" />
              Live Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{t.guarantee}</span>
          </div>
        </div>
      </div>

      {/* 2. Primary Navigation Display: GPS Live Map & Corridor Schematic */}
      <div className="space-y-4">
        {/* Toggle between Live GPS Satellite Map & Linear Schematic */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Transit Visualizer:
            </span>
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setNavMode("gps_map")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  navMode === "gps_map"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>🛰️ Live GPS Map & Geofence</span>
              </button>
              <button
                type="button"
                onClick={() => setNavMode("schematic")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  navMode === "schematic"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>📊 Route Corridor Summary</span>
              </button>
            </div>
          </div>

          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 hidden sm:inline-block">
            Vehicle AP02 TC 4481 • Distance: {activeTransaction.distanceKm} km
          </span>
        </div>

        {/* GPS Map View */}
        {navMode === "gps_map" && (
          <GpsRouteMap transaction={activeTransaction} isDispatchVerified={true} />
        )}

        {/* Linear Schematic View (Retained and enhanced for instant clarity) */}
        {navMode === "schematic" && (
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700/80">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {t.activeSchedule}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {t.schematicTitle}
                </h3>
              </div>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-cyan-400 text-slate-950 shadow-xs">
                {t.inTransitPill}
              </span>
            </div>

            {/* Route Visualizer: Point A to Point B */}
            <div className="relative py-8 px-4 sm:px-8 bg-slate-950/60 rounded-2xl border border-slate-800">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                {/* Origin */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                      {t.origin}
                    </span>
                    <h4 className="font-black text-white text-base">
                      {activeTransaction.farmerLocation}
                    </h4>
                    <p className="text-xs text-slate-400">{t.pickupAccessibility}</p>
                  </div>
                </div>

                {/* In-Between Route Specs with Mini-truck icon */}
                <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                  <div className="flex items-center gap-2 text-amber-400 mb-1">
                    <Truck className="w-6 h-6 animate-bounce" />
                    <span className="text-xs font-mono font-bold tracking-wider">
                      {activeTransaction.vehicleType}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
                    <div className="w-2/3 h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 animate-pulse" />
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-slate-300 font-semibold mt-2">
                    <span>{activeTransaction.distanceKm} km ({t.negligibleFreight})</span>
                    <span>•</span>
                    <span>~{activeTransaction.transitTimeEst} ({t.trafficClear})</span>
                  </div>
                </div>

                {/* Destination */}
                <div className="flex items-center gap-3 text-right md:text-left">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400 flex items-center justify-center text-teal-300">
                    <Navigation className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">
                      {t.destinationDrop}
                    </span>
                    <h4 className="font-black text-white text-base">
                      {activeTransaction.buyerLocation}
                    </h4>
                    <p className="text-xs text-slate-400">{t.destinationFacility}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Assigned Dispatch Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                <span className="text-slate-400 block text-[10px]">{t.pickupDateLabel}</span>
                <span className="text-white font-bold">{activeTransaction.pickupDate} ({activeTransaction.pickupTimeSlot})</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                <span className="text-slate-400 block text-[10px]">{t.assignedVehicle}</span>
                <span className="text-white font-bold">{activeTransaction.vehicleType}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                <span className="text-slate-400 block text-[10px]">{t.driverLabel}</span>
                <span className="text-white font-bold">{activeTransaction.driverName}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Anti-Fraud & Dispatch Security Shield Center */}
      <LogisticsSecurityCenter transaction={activeTransaction} />

      {/* 4. Operational Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1.5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h4 className="font-black text-sm text-slate-900">{t.term1Title}</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">{t.term1Desc}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1.5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h4 className="font-black text-sm text-slate-900">{t.term2Title}</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">{t.term2Desc}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1.5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h4 className="font-black text-sm text-slate-900">{t.term3Title}</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">{t.term3Desc}</p>
        </div>
      </div>
    </div>
  );
}
