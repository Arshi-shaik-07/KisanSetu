import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  HandCoins,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getProduceLots, placeBuyerBid } from "../lib/produceStore";
import type { ProduceLot } from "../types";

export function BuyerMarketplace() {
  const { user } = useAuth();
  const [lots] = useState<ProduceLot[]>(getProduceLots());
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [onlyVerifiedFarmers, setOnlyVerifiedFarmers] = useState(false);
  const [sortBy, setSortBy] = useState<"distance" | "price_asc" | "quantity_desc">("distance");

  // Place Bid Modal State
  const [selectedLot, setSelectedLot] = useState<ProduceLot | null>(null);
  const [bidPrice, setBidPrice] = useState<number>(0);
  const [bidQuantity, setBidQuantity] = useState<number>(0);
  const [bidNotes, setBidNotes] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  const isBuyerVerified = user
    ? user.govId.status === "verified" || user.documents.length > 0
    : false;

  // Filter lots
  const filteredLots = lots.filter((lot) => {
    if (selectedCategory !== "All" && lot.category !== selectedCategory) return false;
    if (onlyVerifiedFarmers && !lot.farmerVerified && lot.farmerTier === "bronze") return false;
    if (
      searchTerm &&
      !lot.cropName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !lot.location.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !lot.farmerName.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // Sort lots
  const sortedLots = [...filteredLots].sort((a, b) => {
    if (sortBy === "price_asc") return a.expectedPrice - b.expectedPrice;
    if (sortBy === "quantity_desc") return b.quantity - a.quantity;
    return 0; // Default distance
  });

  const handleOpenBidModal = (lot: ProduceLot) => {
    setSelectedLot(lot);
    setBidPrice(lot.expectedPrice);
    setBidQuantity(lot.quantity);
    setBidNotes("Ready for farm-gate pickup within 24 hours. Digital escrow payment.");
  };

  const handleSubmitBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLot) return;

    placeBuyerBid({
      lotId: selectedLot.id,
      buyerId: user?.id || "buyer-01",
      buyerName: user?.name || "Sri Lakshmi Agri Food Processing Ltd.",
      buyerPhone: user?.mobile ? `+91 ${user.mobile}` : "+91 94402 81729",
      buyerTier: user?.tier || "gold",
      fssaiVerified: isBuyerVerified,
      pricePerUnit: Number(bidPrice),
      quantity: Number(bidQuantity),
      unit: selectedLot.unit,
      totalOffer: Number(bidPrice) * Number(bidQuantity),
      notes: bidNotes.trim(),
    });

    setSelectedLot(null);
    setToastMsg(`Bid submitted for ${selectedLot.cropName}! Farmer ${selectedLot.farmerName} has been notified via SMS & WhatsApp.`);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-slate-50 via-emerald-50/20 to-slate-100 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Marketplace Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                  🏢 Wholesale & Enterprise Procurement
                </span>
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {isBuyerVerified ? "✓ FSSAI & GST Verified Enterprise" : "Standard Buyer Account"}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Surplus Produce Marketplace
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                Source directly from verified farmers and FPOs. AI matching compares crop perishability, harvest dates, and regional freight corridors.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/verification"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 text-xs font-bold transition shadow-xs"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Trust & Verification ({user?.trustScore ?? 96}%)
              </Link>
            </div>
          </div>

          {/* Verification Callout if Buyer Unverified */}
          {!isBuyerVerified && (
            <div className="mt-5 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                <span>
                  <strong>Unlock Direct Farmer Contact & WhatsApp:</strong> Verify your FSSAI Food License or GSTIN in the Trust Hub to reveal producer mobile numbers and secure direct procurement contracts.
                </span>
              </div>
              <Link
                to="/verification"
                className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shrink-0"
              >
                Verify Enterprise →
              </Link>
            </div>
          )}
        </div>

        {/* Global Toast */}
        {toastMsg && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-900 flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMsg("")}
              className="text-emerald-700 font-bold hover:text-emerald-900"
            >
              ✕
            </button>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search crop, farmer, or district…"
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5 overflow-x-auto w-full md:w-auto">
              {["All", "Vegetables", "Fruits", "Grains", "Spices"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    selectedCategory === cat
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Toggle Verified Only & Sort */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={onlyVerifiedFarmers}
                  onChange={(e) => setOnlyVerifiedFarmers(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>Verified Farmers Only</span>
              </label>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700"
              >
                <option value="distance">Nearest Farm Distance</option>
                <option value="price_asc">Lowest Price First</option>
                <option value="quantity_desc">Highest Volume First</option>
              </select>
            </div>
          </div>
        </div>

        {/* PRODUCE LOTS GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedLots.map((lot) => (
            <div
              key={lot.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={lot.image}
                    alt={lot.cropName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold">
                      {lot.category}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                      {lot.grade}
                    </span>
                  </div>

                  {lot.farmerTier === "gold" && (
                    <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold shadow-sm">
                      🥇 Gold Verified Farm
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-base text-slate-900">{lot.cropName}</h3>
                      <span className="text-sm font-black text-emerald-700">
                        ₹{lot.expectedPrice}/{lot.unit}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {lot.location}
                    </p>
                  </div>

                  {/* Quantity and Storage details */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Available Volume</span>
                      <span className="font-bold text-slate-900">
                        {lot.quantity} {lot.unit}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Harvest Date</span>
                      <span className="font-bold text-slate-900">{lot.harvestDate}</span>
                    </div>
                  </div>

                  {/* Producer Trust Badge */}
                  <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {lot.farmerName}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800">
                        {lot.district} Mandi Cluster
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">{lot.notes}</p>
                  </div>

                  {/* Direct Contact Reveal (if verified) */}
                  {isBuyerVerified ? (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 text-[11px]">
                      <span className="text-slate-600 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        {lot.farmerPhone}
                      </span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <MessageCircle className="w-3 h-3 text-emerald-600" />
                        WhatsApp Direct
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={() => handleOpenBidModal(lot)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <HandCoins className="w-4 h-4" />
                  Request Lot / Submit Buyer Bid
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Place Bid / Request Modal */}
      {selectedLot && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  Direct Producer Procurement
                </span>
                <h3 className="font-extrabold text-base text-slate-900 mt-0.5">
                  Submit Bid for {selectedLot.cropName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLot(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitBid} className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs flex justify-between">
                <div>
                  <span className="text-slate-500 block">Producer:</span>
                  <span className="font-bold text-slate-800">{selectedLot.farmerName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Target Price:</span>
                  <span className="font-bold text-emerald-700">₹{selectedLot.expectedPrice}/{selectedLot.unit}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Location:</span>
                  <span className="font-bold text-slate-800">{selectedLot.district}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Your Bid Price (₹/{selectedLot.unit}) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={bidPrice}
                    onChange={(e) => setBidPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Procurement Quantity ({selectedLot.unit}) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedLot.quantity}
                    value={bidQuantity}
                    onChange={(e) => setBidQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                    required
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-semibold">Total Escrow Commitment:</span>
                <span className="text-base font-black text-emerald-800">
                  ₹{(bidPrice * bidQuantity).toLocaleString()}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Logistics & Pickup Terms
                </label>
                <textarea
                  rows={2}
                  value={bidNotes}
                  onChange={(e) => setBidNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedLot(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs cursor-pointer"
                >
                  Confirm & Dispatch Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
