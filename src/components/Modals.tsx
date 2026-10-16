import { useState, type FormEvent } from "react";
import {
  X,
  Zap,
  ArrowRight,
  ArrowLeft,
  Bell,
  FileText,
  Copy,
  Printer,
} from "lucide-react";
import { M, type Language } from "../lib/translations";
import type { NotificationItem, MatchingRecipient, ProduceListing } from "../lib/seedData";
import type { TargetProduce } from "../lib/matchingEngine";

// 1. 30-Sec Demo Tour Modal
export function DemoTourModal({
  isOpen,
  onClose,
  onNavigateSection,
  lang,
}: {
  isOpen: boolean;
  onClose: () => void;
  onNavigateSection: (section: string) => void;
  lang: Language;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const t = (M[lang] || M.en).modals.demoTour;

  if (!isOpen) return null;

  const steps = t.steps;
  const step = steps[currentStep] || steps[0];
  const sectionTargets = ["farmer", "matches", "buyer", "matches", "logistics", "impact"];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      onNavigateSection(sectionTargets[next]);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      onNavigateSection(sectionTargets[prev]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden space-y-6 p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-slate-950">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <h3 className="font-black text-base text-slate-900">{t.title}</h3>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {t.badge.replace("{step}", String(currentStep + 1)).replace("{total}", String(steps.length))}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
            {step.subtitle}
          </span>
          <h4 className="text-xl font-black text-slate-900">{step.title}</h4>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
            {step.content}
          </p>
          <div className="pt-2">
            <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-600 text-white shadow-xs">
              ★ {step.highlight}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              currentStep === 0
                ? "text-slate-300 cursor-not-allowed"
                : "text-slate-700 hover:bg-slate-100 cursor-pointer"
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.btnPrev}</span>
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>{currentStep === steps.length - 1 ? t.btnFinish : t.btnNext}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// 2. Notifications Drawer
export function NotificationsDrawer({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onNotificationClick,
  lang,
}: {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onNotificationClick: (target?: string) => void;
  lang: Language;
}) {
  const t = (M[lang] || M.en).modals.notifications;
  const unreadCount = notifications.filter((n) => n.unread).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-md h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between animate-slideInRight">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-600" />
            <h3 className="font-black text-base text-slate-900">{t.title}</h3>
            {unreadCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                className="text-xs text-emerald-700 hover:underline font-bold cursor-pointer"
              >
                {t.markAllRead}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                onNotificationClick(n.actionTarget);
                onClose();
              }}
              className={`p-4 rounded-xl border text-xs space-y-1 transition cursor-pointer ${
                n.unread
                  ? "bg-amber-50/50 border-amber-200 hover:bg-amber-50"
                  : "bg-slate-50 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900">{n.title}</span>
                <span className="text-[10px] text-slate-400">{n.time}</span>
              </div>
              <p className="text-slate-600 leading-relaxed">{n.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 3. Send Procurement Request Modal
export function RequestModal({
  produce,
  isOpen,
  onClose,
  onSubmit,
  lang,
}: {
  produce: ProduceListing | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: {
    produce: ProduceListing;
    requestedQuantity: string;
    offeredPricePerUnit: string;
    totalAmount: string;
    pickupDate: string;
    pickupTimeSlot: string;
    message: string;
  }) => void;
  lang: Language;
}) {
  const [qty, setQty] = useState("");
  const [offeredPrice, setOfferedPrice] = useState("");
  const [pickupDate, setPickupDate] = useState(() =>
    new Date(Date.now() + 864e5).toISOString().split("T")[0]
  );
  const [timeSlot, setTimeSlot] = useState("10:00 AM - 12:00 PM");
  const [message, setMessage] = useState("");

  const t = (M[lang] || M.en).modals.requestModal;

  if (!isOpen || !produce) return null;

  const currentQty = Number(qty || produce.quantity);
  const currentPrice = Number(offeredPrice || produce.expectedPrice);
  const totalVal =
    produce.listingType === "donate"
      ? "FREE (Rescue)"
      : `₹${(currentQty * currentPrice).toLocaleString()}`;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      produce,
      requestedQuantity: `${currentQty} ${produce.unit}`,
      offeredPricePerUnit: produce.listingType === "donate" ? "FREE" : `₹${currentPrice} / ${produce.unit}`,
      totalAmount: totalVal,
      pickupDate,
      pickupTimeSlot: timeSlot,
      message,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              {t.tag}
            </span>
            <h3 className="font-black text-xl text-slate-900 mt-1">
              {t.title.replace("{crop}", produce.cropName)}
            </h3>
            <p className="text-xs text-slate-500">
              {t.supplier} {produce.farmerName} ({produce.location})
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t.reqQty.replace("{unit}", produce.unit)}
              </label>
              <input
                type="number"
                defaultValue={produce.quantity}
                onChange={(e) => setQty(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-[10px] text-slate-400">
                {t.maxAvail.replace("{qty}", String(produce.quantity)).replace("{unit}", produce.unit)}
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t.offeredPrice.replace("{unit}", produce.unit)}
              </label>
              <input
                type="number"
                disabled={produce.listingType === "donate"}
                defaultValue={produce.expectedPrice}
                onChange={(e) => setOfferedPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100"
              />
              <span className="text-[10px] text-slate-400">
                {produce.listingType === "donate"
                  ? t.freeDonation
                  : t.basePrice.replace("{price}", String(produce.expectedPrice)).replace("{unit}", produce.unit)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t.pickupDate}
              </label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t.timeSlot}
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
              >
                <option value="08:00 AM - 10:00 AM">08:00 AM - 10:00 AM</option>
                <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {t.note.replace("{farmer}", produce.farmerName)}
            </label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Sourcing batch for canning unit. Will bring 40 plastic crates."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">{t.totalValue}:</span>
            <span className="text-lg font-black text-emerald-700">{totalVal}</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              {t.cancelBtn}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
            >
              {t.sendBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 4. Verify Recipient & KYC Modal
export function VerificationModal({
  recipient,
  isOpen,
  onClose,
  lang,
}: {
  recipient: MatchingRecipient | null;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}) {
  const t = (M[lang] || M.en).modals.verificationModal;

  if (!isOpen || !recipient) return null;
  const kyc = recipient.verificationDetails;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              {t.badge}
            </span>
            <h3 className="font-black text-xl text-slate-900 mt-1">{recipient.name}</h3>
            <p className="text-xs text-slate-500">{t.sub}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[10px]">{t.trustRating}</span>
            <span className="text-xl font-black text-emerald-700">{kyc.trustScore}%</span>
            <span className="text-[10px] text-slate-400 block">{t.topPct}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[10px]">{t.dealsCompleted}</span>
            <span className="text-xl font-black text-slate-900">{kyc.completedDealsCount}</span>
            <span className="text-[10px] text-emerald-600 block">{t.zeroDefault}</span>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <h4 className="font-extrabold text-slate-900">{t.regLicenses}</h4>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 font-mono">
            <p className="flex justify-between">
              <span className="text-slate-500 font-sans">APMC License:</span>
              <strong className="text-slate-900">{kyc.apmcLicense}</strong>
            </p>
            <p className="flex justify-between">
              <span className="text-slate-500 font-sans">FSSAI License:</span>
              <strong className="text-slate-900">{kyc.fssaiLicense}</strong>
            </p>
            <p className="flex justify-between">
              <span className="text-slate-500 font-sans">GSTIN:</span>
              <strong className="text-slate-900">{kyc.gstNumber}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
        >
          Close Certificate
        </button>
      </div>
    </div>
  );
}

// 5. Lock Deal / Sauda Parcha Modal
export function DealModal({
  recipient,
  farmerProduce,
  isOpen,
  onClose,
  lang,
}: {
  recipient: MatchingRecipient | null;
  farmerProduce: TargetProduce;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}) {
  const [copied, setCopied] = useState(false);
  const t = (M[lang] || M.en).modals.contactModal;

  if (!isOpen || !recipient) return null;

  const agreementText = `=========================================
KISAN SETU AGRILINK™ - SAUDA PARCHA
Digital Trade Memorandum #SP-2026-081
=========================================
SUPPLIER (FARMER): ${farmerProduce.farmerName || "Ramesh Kumar"}
LOCATION: ${farmerProduce.location}
CONTACT: ${farmerProduce.farmerPhone || "+91 98491 23456"}

BUYER (RECIPIENT): ${recipient.name}
CATEGORY: ${recipient.businessType}
CONTACT PERSON: ${recipient.contactPerson}
PHONE: ${recipient.phone}

COMMODITY: ${farmerProduce.cropName} (Grade ${farmerProduce.grade || "A"})
QUANTITY: ${Math.min(recipient.demandedQuantityKg, farmerProduce.quantityKg)} kg
LOCKED RATE: ₹${recipient.offeredPricePerKg}.00 / kg
ESTIMATED LOT VALUE: ₹${(Math.min(recipient.demandedQuantityKg, farmerProduce.quantityKg) * recipient.offeredPricePerKg).toLocaleString()}

LOGISTICS: Buyer-assisted dispatch (Mini-truck routed)
WEIGHMENT: Digital scale slip at gate
PAYMENT TERMS: Released within 12 hours of delivery
STATUS: VERIFIED & CONFIRMED
=========================================`;

  const handleCopy = () => {
    void navigator.clipboard.writeText(agreementText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            <h3 className="font-black text-lg text-slate-900">{t.dealTitle}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-80 border border-slate-800">
          {agreementText}
        </pre>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? t.copied : t.copyAgreement}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 transition shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.printAgreement}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// 6. Geographic Radar Modal
export function RadarModal({
  farmerProduce,
  isOpen,
  onClose,
  lang,
}: {
  farmerProduce: TargetProduce;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}) {
  const t = (M[lang] || M.en).modals.radarModal;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 text-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-700 overflow-hidden p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              {t.liveSimulation}
            </span>
            <h3 className="font-black text-xl text-white mt-1">{t.title}</h3>
            <p className="text-xs text-slate-400">{t.sub.replace("{location}", farmerProduce.location)}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Radar Rings Visualization */}
        <div className="relative w-full h-72 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
          {/* Concentric rings */}
          <div className="absolute w-64 h-64 rounded-full border border-emerald-900/60" />
          <div className="absolute w-44 h-44 rounded-full border border-emerald-700/50" />
          <div className="absolute w-24 h-24 rounded-full border border-emerald-500/40" />

          {/* Radar sweeping beam */}
          <div className="absolute w-36 h-36 border-r border-t border-emerald-400/80 rounded-tl-full origin-bottom-right animate-spin" style={{ animationDuration: "4s" }} />

          {/* Center: Farmer Hub */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-5 h-5 rounded-full bg-amber-400 border-2 border-white shadow-lg animate-ping" />
            <span className="text-[10px] font-black text-amber-300 mt-1">Farm Center</span>
          </div>

          {/* Simulated Nearby Blips */}
          <div className="absolute top-16 left-28 flex items-center gap-1 z-10">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] font-bold text-emerald-200 bg-slate-900/80 px-1 rounded">Sri Lakshmi (6.2 km)</span>
          </div>

          <div className="absolute bottom-16 right-24 flex items-center gap-1 z-10">
            <span className="w-3 h-3 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-[9px] font-bold text-teal-200 bg-slate-900/80 px-1 rounded">FreshDirect Mandi (9.4 km)</span>
          </div>

          <div className="absolute top-20 right-28 flex items-center gap-1 z-10">
            <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[9px] font-bold text-cyan-200 bg-slate-900/80 px-1 rounded">Annapurna Trust (14.5 km)</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>● Concentric distance bands: 5 km • 15 km • 35 km</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold"
          >
            Close Radar
          </button>
        </div>
      </div>
    </div>
  );
}
