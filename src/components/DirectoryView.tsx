import { useState, type FormEvent } from "react";
import {
  Search,
  CheckCircle2,
  Sparkles,
  MapPin,
  Building,
} from "lucide-react";
import { M, type Language } from "../lib/translations";
import type { Seller, Buyer } from "../lib/seedData";

interface DirectoryViewProps {
  sellers: Seller[];
  buyers: Buyer[];
  onAddSeller: (seller: Seller) => void;
  onAddBuyer: (buyer: Buyer) => void;
  lang: Language;
}

export function DirectoryView({
  sellers,
  buyers,
  onAddSeller,
  onAddBuyer,
  lang,
}: DirectoryViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<"seller" | "buyer" | "directory">("seller");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const t = (M[lang] || M.en).register;

  // Seller Form State
  const [sellerName, setSellerName] = useState("");
  const [sellerPhone, setSellerPhone] = useState("");
  const [sellerLoc, setSellerLoc] = useState("");
  const [sellerAcres, setSellerAcres] = useState(5);
  const [sellerCrops, setSellerCrops] = useState("Tomatoes, Chillies");
  const [sellerStorage, setSellerStorage] = useState("Farm Yard Shade");

  // Buyer Form State
  const [buyerName, setBuyerName] = useState("");
  const [buyerType, setBuyerType] = useState("Food Processing Unit");
  const [buyerContact, setBuyerContact] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerLoc, setBuyerLoc] = useState("");
  const [buyerApmc, setBuyerApmc] = useState("APMC/ATP/2026/D-8821");
  const [buyerDemands, setBuyerDemands] = useState("Needs 500-1000 kg Tomatoes weekly");

  const handlePrefillFarmer = () => {
    setSellerName("Anand Gowda");
    setSellerPhone("+91 98450 77123");
    setSellerLoc("Mulbagal Road, Kolar");
    setSellerAcres(6.5);
    setSellerCrops("Tomatoes, Mangoes, Cabbage");
    setSellerStorage("Shaded Cement Barn");
  };

  const handlePrefillBuyer = () => {
    setBuyerName("Deccan Agro Food Processing Ltd.");
    setBuyerType("Food Processing Unit");
    setBuyerContact("K. Venkatesh (Manager)");
    setBuyerPhone("+91 94401 33456");
    setBuyerLoc("KIADB Industrial Area, Kolar");
    setBuyerApmc("APMC/KLR/2026/P-4402");
    setBuyerDemands("Daily 1,500 kg fresh table tomatoes and onions");
  };

  const handleSubmitSeller = (e: FormEvent) => {
    e.preventDefault();
    if (!sellerName || !sellerPhone || !sellerLoc) return;

    const newSeller: Seller = {
      id: `seller-${Date.now()}`,
      name: sellerName,
      phone: sellerPhone,
      location: sellerLoc,
      district: sellerLoc.split(",")[0].trim(),
      state: "Karnataka",
      farmSizeAcres: Number(sellerAcres),
      primaryCrops: sellerCrops.split(",").map((s) => s.trim()),
      storageType: sellerStorage,
      verified: true,
      upiId: `${sellerName.toLowerCase().replace(/\s+/g, "")}@upi`,
      rating: 4.9,
      registeredAt: new Date().toISOString().split("T")[0],
      activeListingsCount: 0,
    };

    onAddSeller(newSeller);
    setToastMessage(`Farmer ${sellerName} registered successfully!`);
    setTimeout(() => setToastMessage(""), 4000);
    setSellerName("");
    setSellerPhone("");
    setSellerLoc("");
  };

  const handleSubmitBuyer = (e: FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerPhone || !buyerLoc) return;

    const newBuyer: Buyer = {
      id: `buyer-${Date.now()}`,
      name: buyerName,
      type: buyerType,
      location: buyerLoc,
      district: buyerLoc.split(",")[0].trim(),
      contactPerson: buyerContact || "Procurement Manager",
      phone: buyerPhone,
      verified: true,
      rating: 4.85,
      dealsDone: 1,
      demands: buyerDemands,
      maxRadiusKm: 35,
    };

    onAddBuyer(newBuyer);
    setToastMessage(`Buyer ${buyerName} registered successfully!`);
    setTimeout(() => setToastMessage(""), 4000);
    setBuyerName("");
    setBuyerPhone("");
    setBuyerLoc("");
  };

  const filteredSellers = sellers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBuyers = buyers.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t.title}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold border border-amber-300">
              {t.badge}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">
              {t.sellersCountLabel}
            </span>
            <span className="text-xl font-black text-emerald-700">{sellers.length}</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">
              {t.buyersCountLabel}
            </span>
            <span className="text-xl font-black text-amber-700">{buyers.length}</span>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="bg-emerald-600 text-white p-4 rounded-xl flex items-center justify-between shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
            <span className="font-bold text-sm">{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage("")}
            className="text-xs text-emerald-100 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab("seller")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === "seller"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {t.tabSeller}
        </button>
        <button
          onClick={() => setActiveSubTab("buyer")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === "buyer"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {t.tabBuyer}
        </button>
        <button
          onClick={() => setActiveSubTab("directory")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === "directory"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {t.tabDirectory} ({sellers.length + buyers.length})
        </button>
      </div>

      {/* 3. Tab Contents */}
      {activeSubTab === "seller" && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900">{t.farmerHeading}</h3>
              <p className="text-xs text-slate-500">
                {t.farmerSub.replace("{count}", String(sellers.length))}
              </p>
            </div>
            <button
              type="button"
              onClick={handlePrefillFarmer}
              className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{t.prefillFarmerBtn}</span>
            </button>
          </div>

          <form onSubmit={handleSubmitSeller} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t.farmerName}
              </label>
              <input
                required
                type="text"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t.farmerPhone}
              </label>
              <input
                required
                type="text"
                value={sellerPhone}
                onChange={(e) => setSellerPhone(e.target.value)}
                placeholder="+91 98491 XXXXX"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t.districtVillage}
              </label>
              <input
                required
                type="text"
                value={sellerLoc}
                onChange={(e) => setSellerLoc(e.target.value)}
                placeholder="e.g. Kalyanadurg Road, Anantapur"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t.landholding}
              </label>
              <input
                type="number"
                step="0.5"
                value={sellerAcres}
                onChange={(e) => setSellerAcres(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t.primaryCrops}
              </label>
              <input
                type="text"
                value={sellerCrops}
                onChange={(e) => setSellerCrops(e.target.value)}
                placeholder="e.g. Tomatoes, Chillies, Groundnut"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t.storageCondition}
              </label>
              <input
                type="text"
                value={sellerStorage}
                onChange={(e) => setSellerStorage(e.target.value)}
                placeholder="e.g. Shaded Barn"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">{t.kycNote}</span>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                {t.saveFarmerBtn
                  .replace("{prev}", String(sellers.length))
                  .replace("{next}", String(sellers.length + 1))}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeSubTab === "buyer" && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900">{t.buyerHeading}</h3>
              <p className="text-xs text-slate-500">
                {t.buyerSub.replace("{count}", String(buyers.length))}
              </p>
            </div>
            <button
              type="button"
              onClick={handlePrefillBuyer}
              className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{t.prefillBuyerBtn}</span>
            </button>
          </div>

          <form onSubmit={handleSubmitBuyer} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t.buyerName}
              </label>
              <input
                required
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="e.g. Sri Lakshmi Food Processing Ltd."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t.buyerCategory}
              </label>
              <select
                value={buyerType}
                onChange={(e) => setBuyerType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white cursor-pointer"
              >
                <option value="Food Processing Unit">Food Processing Unit</option>
                <option value="Wholesale Mandi Buyer">Wholesale Mandi Buyer</option>
                <option value="Local Retailer">Local Retailer</option>
                <option value="NGO / Food Bank">NGO / Food Bank</option>
                <option value="Restaurant / Canteen">Restaurant / Canteen</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t.contactPerson}
              </label>
              <input
                type="text"
                value={buyerContact}
                onChange={(e) => setBuyerContact(e.target.value)}
                placeholder="e.g. S. Ramanjaneyulu (Manager)"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t.buyerPhone}
              </label>
              <input
                required
                type="text"
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                placeholder="+91 94402 XXXXX"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t.facilityAddress}
              </label>
              <input
                required
                type="text"
                value={buyerLoc}
                onChange={(e) => setBuyerLoc(e.target.value)}
                placeholder="e.g. Industrial Estate, Anantapur"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t.apmcLicense}
              </label>
              <input
                type="text"
                value={buyerApmc}
                onChange={(e) => setBuyerApmc(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t.demandSpecs}
              </label>
              <input
                type="text"
                value={buyerDemands}
                onChange={(e) => setBuyerDemands(e.target.value)}
                placeholder="e.g. Needs 800 kg Tomatoes for puree processing batch"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">{t.buyerNote}</span>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition cursor-pointer"
              >
                {t.saveBuyerBtn
                  .replace("{prev}", String(buyers.length))
                  .replace("{next}", String(buyers.length + 1))}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeSubTab === "directory" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h3 className="font-black text-sm text-slate-900">{t.directoryTitle}</h3>
              <p className="text-xs text-slate-500">{t.directorySub}</p>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none w-full sm:w-64"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Farmers List */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h4 className="font-black text-sm text-slate-900 flex items-center justify-between">
                <span>{t.registeredFarmersHeading.replace("{count}", String(filteredSellers.length))}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {t.liveDatabaseBadge}
                </span>
              </h4>

              <div className="space-y-3">
                {filteredSellers.map((s) => (
                  <div key={s.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900">{s.name}</span>
                      <span className="text-[10px] text-emerald-700 font-bold">★ {s.rating}</span>
                    </div>
                    <p className="text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{s.location} ({s.farmSizeAcres} Acres)</span>
                    </p>
                    <p className="text-slate-500">
                      Crops: <strong className="text-slate-700">{s.primaryCrops.join(", ")}</strong>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Buyers List */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h4 className="font-black text-sm text-slate-900 flex items-center justify-between">
                <span>{t.registeredBuyersHeading.replace("{count}", String(filteredBuyers.length))}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                  {t.liveDatabaseBadge}
                </span>
              </h4>

              <div className="space-y-3">
                {filteredBuyers.map((b) => (
                  <div key={b.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900">{b.name}</span>
                      <span className="text-[10px] text-amber-800 font-bold">{b.type}</span>
                    </div>
                    <p className="text-slate-600 flex items-center gap-1">
                      <Building className="w-3 h-3 text-slate-400" />
                      <span>{b.location}</span>
                    </p>
                    <p className="text-slate-500 line-clamp-1">{b.demands}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
