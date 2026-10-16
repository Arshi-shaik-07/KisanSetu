import { useAppState } from "../context/AppContext";
import { Hero } from "../components/Hero";
import { SmartMatchesView } from "../components/SmartMatchesView";
import { OrdersFlowView } from "../components/OrdersFlowView";
import { LogisticsView } from "../components/LogisticsView";
import { DirectoryView } from "../components/DirectoryView";
import { ImpactView } from "../components/ImpactView";
import { HowItWorksView } from "../components/HowItWorksView";
import { AboutView } from "../components/AboutView";
import { FarmerDashboard } from "./FarmerDashboard";
import { BuyerMarketplace } from "./BuyerMarketplace";
import {
  Zap,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Building,
  ArrowRight,
  Sprout,
  Users,
} from "lucide-react";
import { M } from "../lib/translations";
import { Link } from "react-router-dom";

export function Home() {
  const {
    lang,
    activeTab,
    setActiveTab,
    sellers,
    buyers,
    listings,
    transactions,
    farmerProduce,
    rankedRecipients,
    topMatch,
    addSeller,
    addBuyer,
    updateTransactionStatus,
    setVerificationModalRecipient,
    setDealModalRecipient,
    setRadarModalOpen,
    setRequestModalProduce,
  } = useAppState();

  const t = M[lang] || M.en;

  // View dispatch based on activeTab
  if (activeTab === "farmer") {
    return <FarmerDashboard />;
  }

  if (activeTab === "buyer") {
    return <BuyerMarketplace />;
  }

  if (activeTab === "matches") {
    return (
      <SmartMatchesView
        farmerProduce={farmerProduce}
        rankedRecipients={rankedRecipients}
        topMatch={topMatch}
        onVerifyRecipient={(r) => setVerificationModalRecipient(r)}
        onContactRecipient={(r, tab) => {
          if (tab === "deal") setDealModalRecipient(r);
          else if (tab === "call") window.open(`tel:${r.phone}`);
          else if (tab === "whatsapp") window.open(`https://wa.me/${r.whatsapp}`);
        }}
        onOpenRadar={() => setRadarModalOpen(true)}
        lang={lang}
      />
    );
  }

  if (activeTab === "transactions") {
    return (
      <OrdersFlowView
        transactions={transactions}
        onUpdateStatus={updateTransactionStatus}
        lang={lang}
      />
    );
  }

  if (activeTab === "logistics") {
    return (
      <LogisticsView
        activeTransaction={transactions[0] || ({} as any)}
        lang={lang}
      />
    );
  }

  if (activeTab === "register") {
    return (
      <DirectoryView
        sellers={sellers}
        buyers={buyers}
        onAddSeller={addSeller}
        onAddBuyer={addBuyer}
        lang={lang}
      />
    );
  }

  if (activeTab === "impact") {
    return (
      <ImpactView
        sellersCount={sellers.length}
        buyersCount={buyers.length}
        listingsCount={listings.length}
        transactionsCount={transactions.length}
        lang={lang}
      />
    );
  }

  if (activeTab === "howItWorks") {
    return <HowItWorksView lang={lang} />;
  }

  if (activeTab === "about") {
    return <AboutView lang={lang} />;
  }

  // Default "home" tab view
  return (
    <div className="space-y-12 animate-fadeIn">
      {/* 1. Hero Section matching the screenshot */}
      <Hero onNavigate={setActiveTab} lang={lang} />

      {/* 2. Live Database Quick Status Bar */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
              {t.quickStatusTitle}
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-1">
              {t.quickStatusHeading}
            </h3>
            <p className="text-xs text-slate-500">{t.quickStatusSub}</p>
          </div>
          <button
            onClick={() => setActiveTab("register")}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer self-start sm:self-auto"
          >
            {t.registerBtn}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div
            onClick={() => setActiveTab("farmer")}
            className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 hover:border-emerald-400 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900">Farmers Registered</span>
              <Users className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition" />
            </div>
            <span className="text-3xl font-black text-emerald-700 mt-1 block">
              {sellers.length}
            </span>
            <span className="text-[10px] text-emerald-600">Active producers</span>
          </div>

          <div
            onClick={() => setActiveTab("buyer")}
            className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 hover:border-amber-400 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900">Buyers & Processors</span>
              <Building className="w-4 h-4 text-amber-600 group-hover:scale-110 transition" />
            </div>
            <span className="text-3xl font-black text-amber-700 mt-1 block">
              {buyers.length}
            </span>
            <span className="text-[10px] text-amber-600">APMC & Mandi partners</span>
          </div>

          <div
            onClick={() => setActiveTab("buyer")}
            className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 hover:border-teal-400 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-900">Active Surplus Lots</span>
              <Sprout className="w-4 h-4 text-teal-600 group-hover:scale-110 transition" />
            </div>
            <span className="text-3xl font-black text-teal-700 mt-1 block">
              {listings.length}
            </span>
            <span className="text-[10px] text-teal-600">Fresh harvest batches</span>
          </div>

          <div
            onClick={() => setActiveTab("transactions")}
            className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200 hover:border-cyan-400 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-900">Lifecycle Orders</span>
              <TrendingUp className="w-4 h-4 text-cyan-600 group-hover:scale-110 transition" />
            </div>
            <span className="text-3xl font-black text-cyan-700 mt-1 block">
              {transactions.length}
            </span>
            <span className="text-[10px] text-cyan-600">Pipeline transactions</span>
          </div>
        </div>
      </div>

      {/* 3. Featured Surplus Produce Highlights */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Featured Surplus Agricultural Lots
            </h3>
            <p className="text-xs text-slate-500">
              Fresh farm lots with high proximity match scores, ready for immediate dispatch
            </p>
          </div>
          <button
            onClick={() => setActiveTab("buyer")}
            className="text-xs font-extrabold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({listings.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {listings.slice(0, 3).map((lot) => (
            <div
              key={lot.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="h-44 w-full overflow-hidden relative bg-slate-100">
                  <img
                    src={lot.image}
                    alt={lot.cropName}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-900/80 text-white backdrop-blur-xs">
                      {lot.category}
                    </span>
                    {lot.listingType === "donate" ? (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-500 text-white">
                        Free Donation
                      </span>
                    ) : (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                        ₹{lot.expectedPrice}/{lot.unit}
                      </span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500 text-white flex items-center gap-1 shadow-xs">
                      <Zap className="w-3 h-3 fill-current" />
                      {lot.topMatchScore}% Match
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h4 className="font-black text-base text-slate-900 line-clamp-1">
                    {lot.cropName}
                  </h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{lot.location}</span>
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2 pt-1 leading-relaxed">
                    {lot.notes}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Available</span>
                  <span className="font-extrabold text-sm text-slate-900">
                    {lot.quantity} {lot.unit}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab("matches")}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-300 text-slate-700 text-xs font-bold transition cursor-pointer"
                  >
                    AI Matches
                  </button>
                  <button
                    onClick={() => setRequestModalProduce(lot)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition cursor-pointer"
                  >
                    Send Request
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. 5-Layer Authentication & Trust Verification Strip */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-emerald-800/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
            ADVANCED PRODUCER AUTHENTICATION
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Verified Identity, Land Parcel & Farm GPS Mapping
          </h3>
          <p className="text-xs text-emerald-200/80 max-w-xl">
            Protecting food buyers and mandi wholesalers with Aadhaar/Govt ID verification, 7/12 RTC land records, geo-pinning, and two-factor authenticator app security.
          </p>
        </div>

        <Link
          to="/verification"
          className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-400/20 hover:scale-102 transition flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0"
        >
          <ShieldCheck className="w-4 h-4 text-slate-950" />
          <span>Open Verification Center</span>
        </Link>
      </div>
    </div>
  );
}
