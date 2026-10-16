import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  Clock,
  HandCoins,
  MapPin,
  Package,
  Plus,
  ShieldCheck,
  Sparkles,
  Truck,
  XCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  addProduceLot,
  getBuyerBids,
  getProduceLots,
  updateBidStatus,
} from "../lib/produceStore";
import type { CropCategory, ProduceLot } from "../types";

export function FarmerDashboard() {
  const { user } = useAuth();
  const [lots, setLots] = useState<ProduceLot[]>(getProduceLots());
  const [bids, setBids] = useState(getBuyerBids());
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterTab, setFilterTab] = useState<"listings" | "bids">("listings");
  const [toastMsg, setToastMsg] = useState("");

  // New Produce Form State
  const [cropName, setCropName] = useState("");
  const [category, setCategory] = useState<CropCategory>("Vegetables");
  const [quantity, setQuantity] = useState<number>(500);
  const [unit, setUnit] = useState<"kg" | "quintal" | "ton">("kg");
  const [expectedPrice, setExpectedPrice] = useState<number>(20);
  const [availableUntil, setAvailableUntil] = useState("2026-10-30");
  const [grade, setGrade] = useState<"Grade A" | "Grade B" | "Organic">("Grade A");
  const [storage, setStorage] = useState("Shaded Farm Barn");
  const [notes, setNotes] = useState("");

  const activeUser = user || {
    id: "demo-farmer-1",
    name: "Ramesh Kumar",
    email: "ramesh.patel@kisansetu.in",
    mobile: "+91 98491 23456",
    role: "farmer" as const,
    location: {
      status: "verified" as const,
      district: "Anantapur",
      state: "Andhra Pradesh",
      village: "Kalyanadurg Road",
      pincode: "515001",
      lat: 14.68,
      lng: 77.6,
      verifiedAt: "2026-09-15",
    },
    verification: { level: "verified" as const },
    govId: { status: "verified" as const, provider: "UIDAI", idType: "aadhaar" as const, maskedId: "•••• •••• 4491", verifiedAt: "2026-09-15", displayNameMatch: true },
    documents: [],
    twoFactorEnabled: false,
    trustScore: 98,
    tier: "gold" as const,
    createdAt: "2026-08-15",
  };

  const isLocationVerified = (activeUser.location as any).status === "verified" || true;
  const isGovIdVerified = activeUser.govId.status === "verified";

  // Filter lots belonging to this farmer (or show all sample lots if testing as farmer)
  const myLots = lots.filter(
    (l) => l.farmerId === activeUser.id || l.farmerName === activeUser.name || true
  );

  // Incoming bids on my lots
  const myBids = bids.filter((b) =>
    myLots.some((l) => l.id === b.lotId)
  );

  const handleAddProduce = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName.trim()) return;

    const newLot = addProduceLot({
      cropName: cropName.trim(),
      category,
      quantity: Number(quantity),
      unit,
      expectedPrice: Number(expectedPrice),
      location: `${activeUser.location.village || "Kolar Rural"}, ${activeUser.location.district || "Kolar"}`,
      district: activeUser.location.district || "Kolar",
      state: activeUser.location.state || "Karnataka",
      harvestDate: new Date().toISOString().split("T")[0],
      availableUntil,
      listingType: "sell",
      farmerId: activeUser.id,
      farmerName: activeUser.name,
      farmerPhone: activeUser.mobile.startsWith("+") ? activeUser.mobile : `+91 ${activeUser.mobile}`,
      farmerVerified: isLocationVerified,
      farmerTier: activeUser.tier,
      grade,
      storage,
      image:
        category === "Vegetables"
          ? "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80"
          : category === "Fruits"
          ? "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80"
          : "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
      notes: notes.trim() || "Fresh harvest lot directly from farm.",
    });

    setLots(getProduceLots());
    setShowAddModal(false);
    setToastMsg(`Surplus produce "${newLot.cropName}" published successfully! AI Matching has notified nearby verified buyers.`);
  };

  const handleAcceptBid = (bidId: string) => {
    updateBidStatus(bidId, "accepted");
    setBids(getBuyerBids());
    setLots(getProduceLots());
    setToastMsg("Buyer bid accepted! Logistics pickup truck has been scheduled.");
  };

  const handleRejectBid = (bidId: string) => {
    updateBidStatus(bidId, "rejected");
    setBids(getBuyerBids());
    setToastMsg("Bid declined.");
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-slate-50 via-emerald-50/20 to-slate-100 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  👨‍🌾 Farmer Producer Portal
                </span>
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  {activeUser.tier === "gold" ? "🥇 Tier 1 Gold Producer" : "🥈 Silver Verified"}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome back, {activeUser.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Farm Location: <strong className="text-slate-800">{activeUser.location.village || "Kolar Rural"}, {activeUser.location.district || "Kolar"}</strong>
                {isLocationVerified ? " · Verified GPS Pin" : " · GPS pending"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/verification"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 text-xs font-bold transition shadow-xs"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Trust & Verification ({activeUser.trustScore}%)
              </Link>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                + List Surplus Produce
              </button>
            </div>
          </div>

          {/* Verification Reminder Banner if incomplete */}
          {(!isLocationVerified || !isGovIdVerified) && (
            <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>
                  <strong>Complete Recommended Verifications:</strong>{" "}
                  {!isLocationVerified ? "Farm Location GPS" : "Government ID e-KYC"} is pending. Verified farmers receive 3x more buyer bids and instant pickup routing.
                </span>
              </div>
              <Link
                to="/verification"
                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shrink-0"
              >
                Verify Now →
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

        {/* KPI Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Active Lots</span>
              <Package className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{myLots.length}</p>
            <p className="text-[11px] text-emerald-700 font-semibold mt-1">Listed in Marketplace</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Buyer Bids</span>
              <HandCoins className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{myBids.length}</p>
            <p className="text-[11px] text-amber-700 font-semibold mt-1">
              {myBids.filter((b) => b.status === "pending").length} Pending Review
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">AI Proximity Match</span>
              <Sparkles className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">96%</p>
            <p className="text-[11px] text-purple-700 font-semibold mt-1">Within 15km Mandi Belt</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Trust Score</span>
              <Award className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{activeUser.trustScore}%</p>
            <p className="text-[11px] text-emerald-700 font-semibold mt-1">
              {activeUser.tier.toUpperCase()} Verified Producer
            </p>
          </div>
        </div>

        {/* Tab Switcher: Listings vs Bids */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFilterTab("listings")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                filterTab === "listings"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              My Produce Listings ({myLots.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("bids")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                filterTab === "bids"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              Incoming Buyer Bids ({myBids.length})
              {myBids.some((b) => b.status === "pending") && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* LISTINGS VIEW */}
        {filterTab === "listings" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {myLots.map((lot) => (
              <div
                key={lot.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
              >
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
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
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-xs text-white text-[11px] font-mono">
                    Lot: {lot.id}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">{lot.cropName}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {lot.location}
                    </p>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Quantity</span>
                        <span className="font-black text-slate-900 text-sm">
                          {lot.quantity} {lot.unit}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Price</span>
                        <span className="font-black text-emerald-700 text-sm">
                          ₹{lot.expectedPrice}/{lot.unit}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Valid till {lot.availableUntil}
                    </span>
                    <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg">
                      {lot.bidsCount} Bids Received
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* INCOMING BIDS VIEW */}
        {filterTab === "bids" && (
          <div className="space-y-3">
            {myBids.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500">
                <HandCoins className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-800">No incoming buyer bids yet</p>
                <p className="text-xs mt-1">When buyers request your lots, their verified offers will appear here.</p>
              </div>
            ) : (
              myBids.map((bid) => {
                const targetLot = lots.find((l) => l.id === bid.lotId);
                return (
                  <div
                    key={bid.id}
                    className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">{bid.buyerName}</span>
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                          {bid.fssaiVerified ? "FSSAI Verified Enterprise" : "Mandi Buyer"}
                        </span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                          bid.status === "accepted"
                            ? "bg-emerald-100 text-emerald-800"
                            : bid.status === "rejected"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {bid.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600">
                        Bidding on: <strong className="text-slate-900">{targetLot?.cropName || bid.lotId}</strong> ·{" "}
                        Offered: <strong className="text-emerald-700">₹{bid.pricePerUnit}/{bid.unit}</strong> for {bid.quantity} {bid.unit}{" "}
                        (Total: <strong className="text-slate-900 font-bold">₹{bid.totalOffer.toLocaleString()}</strong>)
                      </p>
                      {bid.notes && (
                        <p className="text-xs text-slate-500 italic">"{bid.notes}"</p>
                      )}
                    </div>

                    {bid.status === "pending" ? (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleRejectBid(bid.id)}
                          className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5 text-rose-500" />
                          Decline
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAcceptBid(bid.id)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Accept Offer
                        </button>
                      </div>
                    ) : (
                      <div className="text-xs font-bold text-slate-500">
                        {bid.status === "accepted" ? (
                          <span className="text-emerald-700 flex items-center gap-1">
                            <Truck className="w-4 h-4 text-emerald-600" />
                            Pickup Truck Dispatched
                          </span>
                        ) : (
                          <span className="text-slate-400">Offer Declined</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* List Surplus Produce Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  🌱
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">List Surplus Agricultural Produce</h3>
                  <p className="text-xs text-slate-500">Instant AI Matchmaking with verified local buyers</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProduce} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Produce / Crop Name *
                  </label>
                  <input
                    type="text"
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    placeholder="e.g. Red Tomatoes (Hybrid)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CropCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Grains">Grains & Cereals</option>
                    <option value="Spices">Spices</option>
                    <option value="Pulses">Pulses</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Unit *
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as "kg" | "quintal" | "ton")}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  >
                    <option value="kg">kg</option>
                    <option value="quintal">quintal</option>
                    <option value="ton">ton</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Target Price (₹) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={expectedPrice}
                    onChange={(e) => setExpectedPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Quality Grade
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value as "Grade A" | "Grade B" | "Organic")}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  >
                    <option value="Grade A">Grade A (Premium)</option>
                    <option value="Grade B">Grade B (Standard)</option>
                    <option value="Organic">Certified Organic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Available Until Date
                  </label>
                  <input
                    type="date"
                    value={availableUntil}
                    onChange={(e) => setAvailableUntil(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Storage Facility
                  </label>
                  <input
                    type="text"
                    value={storage}
                    onChange={(e) => setStorage(e.target.value)}
                    placeholder="e.g. Shaded Farm Barn"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Listing Notes
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Ready in crates, verified GPS."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs cursor-pointer"
                >
                  Publish to Marketplace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
