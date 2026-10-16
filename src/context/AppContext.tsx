import { createContext, useContext, useState, useMemo, type ReactNode } from "react";
import type { Language } from "../lib/translations";
import {
  INITIAL_SELLERS,
  INITIAL_BUYERS,
  INITIAL_LISTINGS,
  INITIAL_TRANSACTIONS,
  INITIAL_NOTIFICATIONS,
  RECIPIENTS_DATABASE,
  type Seller,
  type Buyer,
  type ProduceListing,
  type Transaction,
  type NotificationItem,
  type MatchingRecipient,
} from "../lib/seedData";
import { rankRecipients, type TargetProduce, type ScoredRecipient } from "../lib/matchingEngine";

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sellers: Seller[];
  buyers: Buyer[];
  listings: ProduceListing[];
  transactions: Transaction[];
  notifications: NotificationItem[];
  farmerProduce: TargetProduce;
  setFarmerProduce: (p: TargetProduce) => void;
  rankedRecipients: ScoredRecipient[];
  topMatch: ScoredRecipient | null;
  addSeller: (seller: Seller) => void;
  addBuyer: (buyer: Buyer) => void;
  addListing: (listing: ProduceListing) => void;
  updateTransactionStatus: (
    id: string,
    status: Transaction["status"],
    stageIndex: number,
    note: string
  ) => void;
  markAllNotificationsRead: () => void;
  // Modals
  demoTourOpen: boolean;
  setDemoTourOpen: (open: boolean) => void;
  notificationsDrawerOpen: boolean;
  setNotificationsDrawerOpen: (open: boolean) => void;
  requestModalProduce: ProduceListing | null;
  setRequestModalProduce: (p: ProduceListing | null) => void;
  verificationModalRecipient: MatchingRecipient | null;
  setVerificationModalRecipient: (r: MatchingRecipient | null) => void;
  dealModalRecipient: MatchingRecipient | null;
  setDealModalRecipient: (r: MatchingRecipient | null) => void;
  radarModalOpen: boolean;
  setRadarModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("en");
  const [activeTab, setActiveTab] = useState("home");

  const [sellers, setSellers] = useState<Seller[]>(INITIAL_SELLERS);
  const [buyers, setBuyers] = useState<Buyer[]>(INITIAL_BUYERS);
  const [listings, setListings] = useState<ProduceListing[]>(INITIAL_LISTINGS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Default canonical produce: 1,000 kg Tomatoes in Anantapur (matches 94% with Sri Lakshmi)
  const [farmerProduce, setFarmerProduce] = useState<TargetProduce>({
    cropId: "tomatoes",
    cropName: "Tomatoes",
    quantityKg: 1000,
    location: "Anantapur, Andhra Pradesh",
    state: "Andhra Pradesh",
    shelfLifeDaysRemaining: 4,
    expectedPricePerKg: 19,
    grade: "A",
    storage: "Shaded Farm Barn",
    farmerName: "Ramesh Kumar",
    farmerPhone: "+91 98491 23456",
    coordinates: { lat: 14.6819, lng: 77.6006 },
  });

  // Modals state
  const [demoTourOpen, setDemoTourOpen] = useState(false);
  const [notificationsDrawerOpen, setNotificationsDrawerOpen] = useState(false);
  const [requestModalProduce, setRequestModalProduce] = useState<ProduceListing | null>(null);
  const [verificationModalRecipient, setVerificationModalRecipient] = useState<MatchingRecipient | null>(null);
  const [dealModalRecipient, setDealModalRecipient] = useState<MatchingRecipient | null>(null);
  const [radarModalOpen, setRadarModalOpen] = useState(false);

  const rankedRecipients = useMemo(
    () => rankRecipients(farmerProduce, RECIPIENTS_DATABASE),
    [farmerProduce]
  );
  const topMatch = rankedRecipients[0] || null;

  const addSeller = (seller: Seller) => {
    setSellers((prev) => [seller, ...prev]);
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: "New Farmer Registered",
      message: `${seller.name} registered from ${seller.location} (${seller.farmSizeAcres} Acres).`,
      time: "Just now",
      unread: true,
      type: "request",
      actionTarget: "register",
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const addBuyer = (buyer: Buyer) => {
    setBuyers((prev) => [buyer, ...prev]);
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: "New Buyer Partner Registered",
      message: `${buyer.name} (${buyer.type}) registered from ${buyer.location}.`,
      time: "Just now",
      unread: true,
      type: "match",
      actionTarget: "register",
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const addListing = (listing: ProduceListing) => {
    setListings((prev) => [listing, ...prev]);
    setFarmerProduce({
      cropId: listing.cropName.toLowerCase().includes("tomato")
        ? "tomatoes"
        : listing.cropName.toLowerCase().includes("rice")
        ? "rice"
        : "onions",
      cropName: listing.cropName,
      quantityKg: listing.quantity,
      location: listing.location,
      state: "Andhra Pradesh",
      shelfLifeDaysRemaining: 5,
      expectedPricePerKg: listing.expectedPrice || 20,
      grade: listing.grade || "A",
      storage: listing.storage || "Farm Barn",
      farmerName: listing.farmerName,
      farmerPhone: listing.farmerPhone,
      coordinates: { lat: 14.6819, lng: 77.6006 },
    });
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: "New Produce Batch Listed",
      message: `${listing.quantity} ${listing.unit} of ${listing.cropName} listed by ${listing.farmerName}.`,
      time: "Just now",
      unread: true,
      type: "match",
      actionTarget: "buyer",
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const updateTransactionStatus = (
    id: string,
    status: Transaction["status"],
    stageIndex: number,
    note: string
  ) => {
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const newHistory = [
          ...t.history,
          {
            step: status,
            time: "Just now",
            note,
          },
        ];
        return {
          ...t,
          status,
          stageIndex,
          history: newHistory,
        };
      })
    );

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Order ${id} Updated: ${status}`,
      message: note,
      time: "Just now",
      unread: true,
      type: "pickup",
      actionTarget: "transactions",
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <AppContext.Provider
      value={{
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
        setFarmerProduce,
        rankedRecipients,
        topMatch,
        addSeller,
        addBuyer,
        addListing,
        updateTransactionStatus,
        markAllNotificationsRead,
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// oxlint-disable-next-line react/only-export-components
export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider");
  }
  return context;
}
