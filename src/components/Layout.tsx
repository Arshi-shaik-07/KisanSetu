import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { HeaderBanner } from "./HeaderBanner";
import {
  DemoTourModal,
  NotificationsDrawer,
  RequestModal,
  VerificationModal,
  DealModal,
  RadarModal,
} from "./Modals";
import { useAppState } from "../context/AppContext";
import { M } from "../lib/translations";
import { Sprout } from "lucide-react";

export function Layout() {
  const {
    lang,
    setLang,
    activeTab,
    setActiveTab,
    sellers,
    buyers,
    listings,
    transactions,
    notifications,
    farmerProduce,
    demoTourOpen,
    setDemoTourOpen,
    notificationsDrawerOpen,
    setNotificationsDrawerOpen,
    requestModalProduce,
    setRequestModalProduce,
    verificationModalRecipient,
    setVerificationModalRecipient,
    dealModalRecipient,
    setDealModalRecipient,
    radarModalOpen,
    setRadarModalOpen,
    markAllNotificationsRead,
    updateTransactionStatus,
  } = useAppState();

  const navigate = useNavigate();
  const location = useLocation();
  const t = M[lang] || M.en;
  const footer = t.footer;

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  const handleNotificationClick = (target?: string) => {
    if (target) {
      handleTabChange(target);
    }
  };

  const handleRequestSubmit = (details: {
    produce: typeof listings[0];
    requestedQuantity: string;
    offeredPricePerUnit: string;
    totalAmount: string;
    pickupDate: string;
    pickupTimeSlot: string;
    message: string;
  }) => {
    const newTxn = {
      id: `TXN-${Date.now().toString().slice(-4)}`,
      produceId: details.produce.id,
      cropName: details.produce.cropName,
      quantity: details.requestedQuantity,
      pricePerUnit: details.offeredPricePerUnit,
      totalAmount: details.totalAmount,
      farmerName: details.produce.farmerName,
      farmerLocation: details.produce.location,
      buyerName: "Sri Lakshmi Agri Food Processing Ltd.",
      buyerType: "Food Processing Unit",
      buyerLocation: "Plot 14-B Industrial Estate, Anantapur",
      status: "Request Sent" as const,
      stageIndex: 0,
      distanceKm: 6.2,
      transitTimeEst: "18 mins",
      pickupDate: details.pickupDate,
      pickupTimeSlot: details.pickupTimeSlot,
      vehicleType: "Tata Ace 1.5T Mini-Truck (AP02 TC 4481)",
      driverName: "Mohan Lal (+91 98490 11223)",
      requestedAt: "Just now",
      history: [
        {
          step: "Request Sent",
          time: "Just now",
          note: `Buyer requested ${details.requestedQuantity} at ${details.offeredPricePerUnit}`,
        },
      ],
    };
    updateTransactionStatus(newTxn.id, "Request Sent", 0, "New procurement request sent to farmer");
    handleTabChange("transactions");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* 1. Sticky Navigation & Announcement Header */}
      <HeaderBanner
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        sellersCount={sellers.length}
        buyersCount={buyers.length}
        listingsCount={listings.length}
        transactionsCount={transactions.length}
        lang={lang}
        setLang={setLang}
        notificationsCount={notifications.filter((n) => n.unread).length}
        onOpenNotifications={() => setNotificationsDrawerOpen(true)}
        onStartDemoTour={() => setDemoTourOpen(true)}
      />

      {/* 2. Main Page View Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        <Outlet />
      </main>

      {/* 3. Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-12 border-t border-slate-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Sprout className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-white">
                {t.appName} <span className="text-emerald-400 text-xs">AgriLink™</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {footer.tagline}
            </p>
          </div>

          <div className="text-center sm:text-right space-y-1">
            <p className="font-semibold text-slate-300">{footer.copyright}</p>
            <p className="text-amber-400 text-[11px] font-bold">{footer.disclaimer}</p>
          </div>
        </div>
      </footer>

      {/* 4. Global Modals */}
      <DemoTourModal
        isOpen={demoTourOpen}
        onClose={() => setDemoTourOpen(false)}
        onNavigateSection={handleTabChange}
        lang={lang}
      />

      <NotificationsDrawer
        isOpen={notificationsDrawerOpen}
        onClose={() => setNotificationsDrawerOpen(false)}
        notifications={notifications}
        onMarkAllRead={markAllNotificationsRead}
        onNotificationClick={handleNotificationClick}
        lang={lang}
      />

      <RequestModal
        produce={requestModalProduce}
        isOpen={Boolean(requestModalProduce)}
        onClose={() => setRequestModalProduce(null)}
        onSubmit={handleRequestSubmit}
        lang={lang}
      />

      <VerificationModal
        recipient={verificationModalRecipient}
        isOpen={Boolean(verificationModalRecipient)}
        onClose={() => setVerificationModalRecipient(null)}
        lang={lang}
      />

      <DealModal
        recipient={dealModalRecipient}
        farmerProduce={farmerProduce}
        isOpen={Boolean(dealModalRecipient)}
        onClose={() => setDealModalRecipient(null)}
        lang={lang}
      />

      <RadarModal
        farmerProduce={farmerProduce}
        isOpen={radarModalOpen}
        onClose={() => setRadarModalOpen(false)}
        lang={lang}
      />
    </div>
  );
}
