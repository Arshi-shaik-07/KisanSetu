import type { BuyerBid, ProduceLot } from "../types";

const LOTS_KEY = "kisan-setu-produce-lots-v2";
const BIDS_KEY = "kisan-setu-buyer-bids-v2";

export const INITIAL_LOTS: ProduceLot[] = [
  {
    id: "lot-001",
    cropName: "Tomatoes (Hybrid Red)",
    category: "Vegetables",
    quantity: 500,
    unit: "kg",
    expectedPrice: 18,
    location: "Kolar Rural, Mulbagal Highway",
    district: "Kolar",
    state: "Karnataka",
    harvestDate: "2026-10-12",
    availableUntil: "2026-10-22",
    listingType: "sell",
    farmerId: "usr_farmer_ramesh",
    farmerName: "Ramesh Kumar",
    farmerPhone: "+91 98450 12345",
    farmerVerified: true,
    farmerTier: "gold",
    grade: "Grade A",
    storage: "Shaded Farm Barn (Ventilated)",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=700&q=80",
    notes: "Crisp uniform red tomatoes, ready in 25kg crates. Farm pin verified via GPS.",
    status: "available",
    bidsCount: 2,
    highestBid: 19.5,
  },
  {
    id: "lot-002",
    cropName: "Nashik Red Onions",
    category: "Vegetables",
    quantity: 1200,
    unit: "kg",
    expectedPrice: 24,
    location: "Chikkaballapur APMC Belt",
    district: "Chikkaballapur",
    state: "Karnataka",
    harvestDate: "2026-10-10",
    availableUntil: "2026-11-05",
    listingType: "sell",
    farmerId: "usr_farmer_ramesh",
    farmerName: "Ramesh Kumar",
    farmerPhone: "+91 98450 12345",
    farmerVerified: true,
    farmerTier: "gold",
    grade: "Grade A",
    storage: "Dry Onion Chawl Storage",
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=700&q=80",
    notes: "Sun-cured medium pungent bulbs, zero rotting. High storage stability.",
    status: "available",
    bidsCount: 1,
    highestBid: 24,
  },
  {
    id: "lot-003",
    cropName: "G4 Green Chillies (Spicy Hot)",
    category: "Spices",
    quantity: 350,
    unit: "kg",
    expectedPrice: 42,
    location: "Anantapur Rural Farm Cluster",
    district: "Anantapur",
    state: "Andhra Pradesh",
    harvestDate: "2026-10-14",
    availableUntil: "2026-10-25",
    listingType: "sell",
    farmerId: "usr_farmer_kavitha",
    farmerName: "Kavitha Devi",
    farmerPhone: "+91 98123 45678",
    farmerVerified: false,
    farmerTier: "bronze",
    grade: "Grade B",
    storage: "Ambient farm shed",
    image: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=700&q=80",
    notes: "Freshly plucked dark green chillies, high capsaicin level.",
    status: "available",
    bidsCount: 0,
  },
  {
    id: "lot-004",
    cropName: "Jyoti Cold-Storage Potatoes",
    category: "Vegetables",
    quantity: 25,
    unit: "quintal",
    expectedPrice: 1600,
    location: "Hassan District Agro Hub",
    district: "Hassan",
    state: "Karnataka",
    harvestDate: "2026-10-08",
    availableUntil: "2026-11-20",
    listingType: "sell",
    farmerId: "usr_farmer_ramesh",
    farmerName: "Ramesh Kumar",
    farmerPhone: "+91 98450 12345",
    farmerVerified: true,
    farmerTier: "gold",
    grade: "Grade A",
    storage: "Controlled Atmosphere Storage",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=700&q=80",
    notes: "Grade A uniform size table potatoes, minimal soil residue.",
    status: "available",
    bidsCount: 1,
    highestBid: 1650,
  },
  {
    id: "lot-005",
    cropName: "Banganapalli Sweet Mangoes (Late Harvest)",
    category: "Fruits",
    quantity: 800,
    unit: "kg",
    expectedPrice: 65,
    location: "Srinivaspur Orchard Belt",
    district: "Kolar",
    state: "Karnataka",
    harvestDate: "2026-10-15",
    availableUntil: "2026-10-24",
    listingType: "sell",
    farmerId: "usr_farmer_ramesh",
    farmerName: "Ramesh Kumar",
    farmerPhone: "+91 98450 12345",
    farmerVerified: true,
    farmerTier: "gold",
    grade: "Organic",
    storage: "Natural ripening hay chambers",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=700&q=80",
    notes: "Naturally ripened, carbide-free organic GI-tagged orchard harvest.",
    status: "available",
    bidsCount: 3,
    highestBid: 68,
  },
  {
    id: "lot-006",
    cropName: "Sona Masoori Paddy (Raw Rice)",
    category: "Grains",
    quantity: 40,
    unit: "quintal",
    expectedPrice: 2850,
    location: "Mandya Cauvery Basin",
    district: "Mandya",
    state: "Karnataka",
    harvestDate: "2026-10-05",
    availableUntil: "2026-12-31",
    listingType: "sell",
    farmerId: "usr_farmer_ramesh",
    farmerName: "Ramesh Kumar",
    farmerPhone: "+91 98450 12345",
    farmerVerified: true,
    farmerTier: "gold",
    grade: "Grade A",
    storage: "Elevated Dry Silo",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=700&q=80",
    notes: "Moisture content strictly 12.5%. Ideal for premium rice milling.",
    status: "available",
    bidsCount: 1,
    highestBid: 2900,
  },
];

export const INITIAL_BIDS: BuyerBid[] = [
  {
    id: "bid-001",
    lotId: "lot-001",
    buyerId: "usr_buyer_lakshmi",
    buyerName: "Sri Lakshmi Agri Food Processing Ltd.",
    buyerPhone: "+91 98450 98765",
    buyerTier: "gold",
    fssaiVerified: true,
    pricePerUnit: 19.5,
    quantity: 500,
    unit: "kg",
    totalOffer: 9750,
    status: "pending",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    notes: "Can dispatch mini-truck pickup from Kolar within 4 hours. Immediate UPI payout upon quality check.",
  },
  {
    id: "bid-002",
    lotId: "lot-001",
    buyerId: "usr_buyer_ngo",
    buyerName: "Annapurna Food Rescue Foundation",
    buyerPhone: "+91 98888 77665",
    buyerTier: "silver",
    fssaiVerified: true,
    pricePerUnit: 18.0,
    quantity: 250,
    unit: "kg",
    totalOffer: 4500,
    status: "pending",
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    notes: "For community kitchen distribution. 100% upfront digital payment.",
  },
  {
    id: "bid-003",
    lotId: "lot-002",
    buyerId: "usr_buyer_lakshmi",
    buyerName: "Sri Lakshmi Agri Food Processing Ltd.",
    buyerPhone: "+91 98450 98765",
    buyerTier: "gold",
    fssaiVerified: true,
    pricePerUnit: 24.0,
    quantity: 1200,
    unit: "kg",
    totalOffer: 28800,
    status: "pending",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    notes: "Ready to procure complete 1.2 Ton harvest lot. Multi-axle truck ready in Bangalore.",
  },
];

export function getProduceLots(): ProduceLot[] {
  const raw = localStorage.getItem(LOTS_KEY);
  if (!raw) {
    localStorage.setItem(LOTS_KEY, JSON.stringify(INITIAL_LOTS));
    return INITIAL_LOTS;
  }
  try {
    return JSON.parse(raw) as ProduceLot[];
  } catch {
    return INITIAL_LOTS;
  }
}

export function saveProduceLots(lots: ProduceLot[]) {
  localStorage.setItem(LOTS_KEY, JSON.stringify(lots));
}

export function getBuyerBids(): BuyerBid[] {
  const raw = localStorage.getItem(BIDS_KEY);
  if (!raw) {
    localStorage.setItem(BIDS_KEY, JSON.stringify(INITIAL_BIDS));
    return INITIAL_BIDS;
  }
  try {
    return JSON.parse(raw) as BuyerBid[];
  } catch {
    return INITIAL_BIDS;
  }
}

export function saveBuyerBids(bids: BuyerBid[]) {
  localStorage.setItem(BIDS_KEY, JSON.stringify(bids));
}

export function addProduceLot(lot: Omit<ProduceLot, "id" | "status" | "bidsCount">): ProduceLot {
  const lots = getProduceLots();
  const created: ProduceLot = {
    ...lot,
    id: `lot-${Date.now().toString(36)}`,
    status: "available",
    bidsCount: 0,
  };
  saveProduceLots([created, ...lots]);
  return created;
}

export function placeBuyerBid(bid: Omit<BuyerBid, "id" | "status" | "createdAt">): BuyerBid {
  const bids = getBuyerBids();
  const created: BuyerBid = {
    ...bid,
    id: `bid-${Date.now().toString(36)}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  saveBuyerBids([created, ...bids]);

  // Update lot bid count & highest bid
  const lots = getProduceLots();
  const lot = lots.find((l) => l.id === bid.lotId);
  if (lot) {
    lot.bidsCount = (lot.bidsCount || 0) + 1;
    if (!lot.highestBid || bid.pricePerUnit > lot.highestBid) {
      lot.highestBid = bid.pricePerUnit;
    }
    saveProduceLots(lots);
  }

  return created;
}

export function updateBidStatus(bidId: string, status: "accepted" | "rejected") {
  const bids = getBuyerBids();
  const target = bids.find((b) => b.id === bidId);
  if (target) {
    target.status = status;
    saveBuyerBids(bids);

    if (status === "accepted") {
      const lots = getProduceLots();
      const lot = lots.find((l) => l.id === target.lotId);
      if (lot) {
        lot.status = "matched";
        saveProduceLots(lots);
      }
    }
  }
}
