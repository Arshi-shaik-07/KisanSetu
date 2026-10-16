// Auto-generated seed data matching original Kisan Setu database
export interface Seller {
  id: string;
  name: string;
  phone: string;
  location: string;
  district: string;
  state: string;
  farmSizeAcres: number;
  primaryCrops: string[];
  storageType: string;
  verified: boolean;
  upiId: string;
  rating: number;
  registeredAt: string;
  activeListingsCount: number;
}

export interface Buyer {
  id: string;
  name: string;
  type: string;
  location: string;
  district: string;
  contactPerson: string;
  phone: string;
  verified: boolean;
  rating: number;
  dealsDone: number;
  demands: string;
  maxRadiusKm: number;
}

export interface ProduceListing {
  id: string;
  cropName: string;
  category: string;
  quantity: number;
  unit: string;
  expectedPrice: number;
  location: string;
  district: string;
  harvestDate: string;
  availableUntil: string;
  listingType: 'sell' | 'donate';
  farmerName: string;
  farmerPhone: string;
  farmerVerified: boolean;
  grade: string;
  storage: string;
  image: string;
  notes: string;
  createdAt: string;
  status: 'active' | 'in_negotiation' | 'sold';
  matchedCount: number;
  topMatchScore: number;
}

export interface TransactionHistory {
  step: string;
  time: string;
  note: string;
}

export interface Transaction {
  id: string;
  produceId: string;
  cropName: string;
  quantity: string;
  pricePerUnit: string;
  totalAmount: string;
  farmerName: string;
  farmerLocation: string;
  buyerName: string;
  buyerType: string;
  buyerLocation: string;
  status: 'Request Sent' | 'Farmer Accepted' | 'Pickup Scheduled' | 'In Transit' | 'Delivered' | 'Rejected';
  stageIndex: number;
  distanceKm: number;
  transitTimeEst: string;
  pickupDate: string;
  pickupTimeSlot: string;
  vehicleType: string;
  driverName: string;
  requestedAt: string;
  acceptedAt?: string;
  deliveredAt?: string;
  history: TransactionHistory[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: 'request' | 'match' | 'pickup' | 'delivered';
  actionTarget?: string;
}

export interface RecipientVerification {
  apmcLicense: string;
  fssaiLicense: string;
  gstNumber: string;
  trustScore: number;
  completedDealsCount: number;
  avgPaymentTimeHours: number;
  memberSince: string;
}

export interface MatchingRecipient {
  id: string;
  name: string;
  businessType: string;
  category: 'Processor' | 'Wholesaler' | 'NGO / Rescue' | 'Retail' | 'Canteen' | 'Retail Chain' | 'Institutional Canteen' | string;
  district: string;
  state: string;
  coordinates: { lat: number; lng: number };
  targetCropIds: string[];
  targetCropNames: string[];
  demandedQuantityKg: number;
  acceptedGrades: string[];
  maxDistanceKmAcceptable: number;
  offeredPricePerKg: number;
  urgencyHoursNeeded: number;
  urgencyLabel: string;
  verified: boolean;
  verificationDetails: RecipientVerification;
  contactPerson: string;
  phone: string;
  whatsapp: string;
  address: string;
  logisticsSupport: string;
}

export const INITIAL_SELLERS: Seller[] = [{id:`seller-001`,name:`Ramesh Kumar`,phone:`+91 98491 23456`,location:`Kalyanadurg Road, Anantapur`,district:`Anantapur`,state:`Andhra Pradesh`,farmSizeAcres:4.5,primaryCrops:[`Tomatoes`,`Groundnut`,`Chillies`],storageType:`Shaded Farm Barn`,verified:!0,upiId:`rameshkumar@upi`,rating:4.9,registeredAt:`2026-08-15`,activeListingsCount:1},{id:`seller-002`,name:`Suresh Reddy`,phone:`+91 94401 98765`,location:`Nandyal Highway, Kurnool`,district:`Kurnool`,state:`Andhra Pradesh`,farmSizeAcres:12,primaryCrops:[`Paddy (Rice)`,`Cotton`,`Maize`],storageType:`Dry Cement Godown`,verified:!0,upiId:`sureshreddy@ybl`,rating:4.85,registeredAt:`2026-08-20`,activeListingsCount:1},{id:`seller-003`,name:`Lakshmi Devi`,phone:`+91 97014 55432`,location:`Pileru Road, Chittoor`,district:`Chittoor`,state:`Andhra Pradesh`,farmSizeAcres:2.5,primaryCrops:[`Assorted Vegetables`,`Spinach`,`Mangoes`],storageType:`Farm Yard Shade`,verified:!0,upiId:`lakshmidevi@okaxis`,rating:4.95,registeredAt:`2026-09-01`,activeListingsCount:1},{id:`seller-004`,name:`Venkat Rao`,phone:`+91 98480 54321`,location:`Near Mirchi Yard, Guntur`,district:`Guntur`,state:`Andhra Pradesh`,farmSizeAcres:8,primaryCrops:[`Red Chillies (Teja)`,`Turmeric`,`Cotton`],storageType:`Ventilated Shed`,verified:!0,upiId:`venkatrao@icici`,rating:4.8,registeredAt:`2026-09-10`,activeListingsCount:1},{id:`seller-005`,name:`Balasaheb Shinde`,phone:`+91 94222 78901`,location:`Dindori Road, Nashik`,district:`Nashik`,state:`Maharashtra`,farmSizeAcres:15,primaryCrops:[`Red Onions`,`Grapes`,`Pomegranate`],storageType:`Ventilated Chawl`,verified:!0,upiId:`balasaheb@oksbi`,rating:4.9,registeredAt:`2026-09-12`,activeListingsCount:1}];
export const INITIAL_BUYERS: Buyer[] = [{id:`buyer-01`,name:`Sri Lakshmi Agri Food Processing Ltd.`,type:`Food Processing Unit`,location:`Anantapur Industrial Estate`,district:`Anantapur`,contactPerson:`S. Ramanjaneyulu`,phone:`+91 94402 81729`,verified:!0,rating:4.9,dealsDone:214,demands:`Needs 800 kg Tomatoes for puree processing batch`,maxRadiusKm:35},{id:`buyer-02`,name:`Subhash Fresh Mart (Local Retailer)`,type:`Local Retailer`,location:`Clock Tower Road, Anantapur`,district:`Anantapur`,contactPerson:`M. Subhash`,phone:`+91 98492 44321`,verified:!0,rating:4.8,dealsDone:96,demands:`Needs 200-400 kg fresh table tomatoes and leafy vegetables daily`,maxRadiusKm:15},{id:`buyer-03`,name:`Rayalaseema Mess & Institutional Canteen`,type:`Restaurant / Canteen`,location:`Engineering College Road, Anantapur`,district:`Anantapur`,contactPerson:`B. Prasad (Caterer)`,phone:`+91 99490 66778`,verified:!0,rating:4.7,dealsDone:74,demands:`Needs 150 kg onions, 200 kg tomatoes per week`,maxRadiusKm:20},{id:`buyer-04`,name:`Anantapur Annapurna Food Rescue & Relief Trust`,type:`NGO / Food Bank`,location:`Old Town, Anantapur`,district:`Anantapur`,contactPerson:`Dr. Padmavati Rao`,phone:`+91 97014 33210`,verified:!0,rating:4.95,dealsDone:89,demands:`Accepts all donated surplus vegetables for community feeding kitchens`,maxRadiusKm:30},{id:`buyer-05`,name:`Rayalaseema Farmers Producer Organization (FPO)`,type:`Farmer Producer Organization`,location:`NH-44 Bypass, Anantapur`,district:`Anantapur`,contactPerson:`K. Mallikarjuna`,phone:`+91 98492 11984`,verified:!0,rating:4.85,dealsDone:380,demands:`Bulk aggregation of grains, pulses and chillies`,maxRadiusKm:70}];
export const INITIAL_LISTINGS: ProduceListing[] = [{id:`prod-001`,cropName:`Tomatoes (Hybrid Red)`,category:`Vegetables`,quantity:500,unit:`kg`,expectedPrice:18,location:`Anantapur, Andhra Pradesh`,district:`Anantapur`,harvestDate:`2026-09-28`,availableUntil:`2026-10-04`,listingType:`sell`,farmerName:`Ramesh Kumar`,farmerPhone:`+91 98491 23456`,farmerVerified:!0,grade:`A`,storage:`Shaded Farm Barn`,image:`https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80`,notes:`Crisp uniform red tomatoes, ready in crates. Looking for quick pickup before shelf-life diminishes.`,createdAt:`2026-09-29T10:30:00Z`,status:`active`,matchedCount:4,topMatchScore:94},{id:`prod-002`,cropName:`Rice (Sona Masoori Raw)`,category:`Grains`,quantity:2,unit:`ton`,expectedPrice:42,location:`Kurnool, Andhra Pradesh`,district:`Kurnool`,harvestDate:`2026-09-22`,availableUntil:`2026-12-30`,listingType:`sell`,farmerName:`Suresh Reddy`,farmerPhone:`+91 94401 98765`,farmerVerified:!0,grade:`A`,storage:`Dry Cement Godown`,image:`https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80`,notes:`Premium aged single-polish grain, bagged in 50 kg gunny bags, moisture level < 12%.`,createdAt:`2026-09-28T09:15:00Z`,status:`active`,matchedCount:3,topMatchScore:89},{id:`prod-003`,cropName:`Assorted Green Vegetables (Spinach & Beans)`,category:`Vegetables`,quantity:300,unit:`kg`,expectedPrice:0,location:`Chittoor, Andhra Pradesh`,district:`Chittoor`,harvestDate:`2026-09-29`,availableUntil:`2026-10-02`,listingType:`donate`,farmerName:`Lakshmi Devi`,farmerPhone:`+91 97014 55432`,farmerVerified:!0,grade:`B`,storage:`Farm Yard Shade`,image:`https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80`,notes:`Surplus yield donated to shelter homes or community canteens. Free pickup requested today.`,createdAt:`2026-09-30T08:00:00Z`,status:`active`,matchedCount:2,topMatchScore:92},{id:`prod-004`,cropName:`Red Chillies (Teja Variety)`,category:`Spices`,quantity:800,unit:`kg`,expectedPrice:148,location:`Guntur, Andhra Pradesh`,district:`Guntur`,harvestDate:`2026-09-25`,availableUntil:`2026-10-25`,listingType:`sell`,farmerName:`Venkat Rao`,farmerPhone:`+91 98480 54321`,farmerVerified:!0,grade:`A`,storage:`Ventilated Shed`,image:`https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80`,notes:`Sun-dried premium spice lot, high capsaicin content, export or oleoresin mill suited.`,createdAt:`2026-09-27T14:20:00Z`,status:`active`,matchedCount:3,topMatchScore:88},{id:`prod-005`,cropName:`Red Onions (Nashik Medium)`,category:`Vegetables`,quantity:2500,unit:`kg`,expectedPrice:23,location:`Nashik, Maharashtra`,district:`Nashik`,harvestDate:`2026-09-24`,availableUntil:`2026-11-15`,listingType:`sell`,farmerName:`Balasaheb Shinde`,farmerPhone:`+91 94222 78901`,farmerVerified:!0,grade:`A`,storage:`Ventilated Chawl`,image:`https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80`,notes:`Fully cured hard onions, perfect for long-haul transport and mandi aggregation.`,createdAt:`2026-09-26T11:00:00Z`,status:`active`,matchedCount:5,topMatchScore:91}];
export const INITIAL_TRANSACTIONS: Transaction[] = [{id:`TXN-2026-081`,produceId:`prod-001`,cropName:`Tomatoes (Hybrid Red)`,quantity:`500 kg`,pricePerUnit:`₹18.00 / kg`,totalAmount:`₹9,000`,farmerName:`Ramesh Kumar`,farmerLocation:`Kalyanadurg Road, Anantapur`,buyerName:`Sri Lakshmi Agri Food Processing Ltd.`,buyerType:`Food Processing Unit`,buyerLocation:`Plot 14-B Industrial Estate, Anantapur`,status:`Farmer Accepted`,stageIndex:1,distanceKm:6.2,transitTimeEst:`18 mins`,pickupDate:`2026-10-01`,pickupTimeSlot:`10:00 AM - 12:00 PM`,vehicleType:`Tata Ace 1.5T Mini-Truck (AP02 TC 4481)`,driverName:`Mohan Lal (+91 98490 11223)`,requestedAt:`2026-09-30 09:15 AM`,acceptedAt:`2026-09-30 10:45 AM`,history:[{step:`Request Sent`,time:`Sep 30, 09:15 AM`,note:`Buyer requested 500 kg Tomatoes at ₹18/kg`},{step:`Farmer Accepted`,time:`Sep 30, 10:45 AM`,note:`Farmer Ramesh Kumar confirmed batch readiness`}]},{id:`TXN-2026-079`,produceId:`prod-003`,cropName:`Assorted Green Vegetables`,quantity:`300 kg`,pricePerUnit:`Donation (₹0)`,totalAmount:`FREE (Donation)`,farmerName:`Lakshmi Devi`,farmerLocation:`Pileru Road, Chittoor`,buyerName:`Anantapur Annapurna Food Rescue & Relief Trust`,buyerType:`NGO / Food Bank`,buyerLocation:`Old Town Community Kitchen, Anantapur`,status:`Delivered`,stageIndex:4,distanceKm:14.5,transitTimeEst:`35 mins`,pickupDate:`2026-09-29`,pickupTimeSlot:`04:00 PM`,vehicleType:`Mahindra Bolero Maxi-Truck`,driverName:`Satish G. (+91 97011 22334)`,requestedAt:`2026-09-29 08:30 AM`,acceptedAt:`2026-09-29 09:15 AM`,deliveredAt:`2026-09-29 05:40 PM`,history:[{step:`Request Sent`,time:`Sep 29, 08:30 AM`,note:`Food Bank initiated pickup request`},{step:`Farmer Accepted`,time:`Sep 29, 09:15 AM`,note:`Lakshmi Devi consented to donation`},{step:`Pickup Scheduled`,time:`Sep 29, 01:00 PM`,note:`Van routed for pickup`},{step:`In Transit`,time:`Sep 29, 04:30 PM`,note:`Loaded 300 kg crates from farm`},{step:`Delivered`,time:`Sep 29, 05:40 PM`,note:`Meals served to 700+ community residents`}]},{id:`TXN-2026-080`,produceId:`prod-002`,cropName:`Rice (Sona Masoori Raw)`,quantity:`2 tons`,pricePerUnit:`₹42.00 / kg`,totalAmount:`₹84,000`,farmerName:`Suresh Reddy`,farmerLocation:`Nandyal Highway, Kurnool`,buyerName:`Rayalaseema Farmers Producer Organization (FPO)`,buyerType:`Farmer Producer Organization`,buyerLocation:`NH-44 Bypass Hub, Anantapur`,status:`Request Sent`,stageIndex:0,distanceKm:42,transitTimeEst:`1.2 hrs`,pickupDate:`2026-10-02`,pickupTimeSlot:`02:00 PM`,vehicleType:`Eicher Pro 3-Ton Truck`,driverName:`Assigned upon confirmation`,requestedAt:`2026-09-30 01:20 PM`,history:[{step:`Request Sent`,time:`Sep 30, 01:20 PM`,note:`FPO aggregation order placed`}]}];
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [{id:`notif-1`,title:`New Buyer Request Received`,message:`Sri Lakshmi Agri Food Processing requested 500 kg Tomatoes at ₹18/kg.`,time:`12 mins ago`,unread:!0,type:`request`,actionTarget:`transactions`},{id:`notif-2`,title:`High 94% Smart Match Found!`,message:`Your Tomato listing in Anantapur matches 800 kg demand just 6 km away.`,time:`45 mins ago`,unread:!0,type:`match`,actionTarget:`matches`},{id:`notif-3`,title:`Pickup Scheduled for Tomorrow`,message:`Driver Mohan Lal (Tata Ace AP02 TC 4481) scheduled for 10:00 AM pickup.`,time:`2 hours ago`,unread:!1,type:`pickup`,actionTarget:`logistics`},{id:`notif-4`,title:`Produce Successfully Delivered`,message:`300 kg vegetables from Lakshmi Devi delivered to Annapurna Food Bank.`,time:`Yesterday`,unread:!1,type:`delivered`,actionTarget:`impact`}];
export const INITIAL_IMPACT_STATS = {farmersConnected:1420,buyersConnected:385,produceRescuedTonnes:128.5,successfulMatches:892,estimatedWasteReducedLakhs:34.8,co2EmissionsSavedTonnes:72.4,monthlyData:[{month:`Jan`,rescuedTonnes:8.2,matches:54,wastePreventedLakhs:2.1},{month:`Feb`,rescuedTonnes:9.6,matches:68,wastePreventedLakhs:2.5},{month:`Mar`,rescuedTonnes:11.4,matches:82,wastePreventedLakhs:3},{month:`Apr`,rescuedTonnes:12,matches:90,wastePreventedLakhs:3.2},{month:`May`,rescuedTonnes:13.8,matches:98,wastePreventedLakhs:3.8},{month:`Jun`,rescuedTonnes:12.4,matches:86,wastePreventedLakhs:3.4},{month:`Jul`,rescuedTonnes:14.2,matches:104,wastePreventedLakhs:3.9},{month:`Aug`,rescuedTonnes:15.6,matches:112,wastePreventedLakhs:4.3},{month:`Sep`,rescuedTonnes:16.8,matches:124,wastePreventedLakhs:4.6},{month:`Oct (est)`,rescuedTonnes:14.5,matches:74,wastePreventedLakhs:4}]};
export const CROP_IMAGES: Record<string, string> = {Tomatoes:`https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80`,Onions:`https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80`,Potatoes:`https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80`,"Red Chillies":`https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80`,Rice:`https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80`,Mangoes:`https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80`,Vegetables:`https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80`,Default:`https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80`};
export const RECIPIENTS_DATABASE: MatchingRecipient[] = [{id:`rec-atp-01`,name:`Sri Lakshmi Agri Food Processing Ltd.`,businessType:`Food Processor (Puree & Sauces)`,category:`Processor`,district:`Anantapur`,state:`Andhra Pradesh`,coordinates:{lat:14.698,lng:77.625},targetCropIds:[`tomatoes`,`mangoes`],targetCropNames:[`Tomatoes`,`Mangoes`],demandedQuantityKg:800,acceptedGrades:[`A`,`B`],maxDistanceKmAcceptable:35,offeredPricePerKg:18.5,urgencyHoursNeeded:24,urgencyLabel:`Urgent (Required within 24 hrs for processing batch)`,verified:!0,verificationDetails:{apmcLicense:`APMC/ATP/2021/B-9441`,fssaiLicense:`10123023000492`,gstNumber:`37AABCS1429P1ZK`,trustScore:98,completedDealsCount:214,avgPaymentTimeHours:12,memberSince:`2021`},contactPerson:`S. Ramanjaneyulu (Procurement Manager)`,phone:`+91 94402 81729`,whatsapp:`919440281729`,address:`Plot 14-B, Industrial Estate, Bellary Road, Anantapur - 515004`,logisticsSupport:`Self Pick-up Available (Buyer sends mini-truck)`},{id:`rec-atp-02`,name:`FreshDirect APMC Wholesale Hub`,businessType:`Mandi Commission Wholesaler`,category:`Wholesaler`,district:`Anantapur`,state:`Andhra Pradesh`,coordinates:{lat:14.652,lng:77.581},targetCropIds:[`tomatoes`,`onions`,`chillies`],targetCropNames:[`Tomatoes`,`Onions`,`Red Chillies`],demandedQuantityKg:1200,acceptedGrades:[`A`,`B`,`C`],maxDistanceKmAcceptable:50,offeredPricePerKg:17.8,urgencyHoursNeeded:48,urgencyLabel:`Standard (Next 48 hrs)`,verified:!0,verificationDetails:{apmcLicense:`APMC/ATP/2019/M-102`,fssaiLicense:`10119022001198`,gstNumber:`37AABCF4592Q1ZR`,trustScore:94,completedDealsCount:380,avgPaymentTimeHours:24,memberSince:`2019`},contactPerson:`K. Mallikarjuna`,phone:`+91 98492 11984`,whatsapp:`919849211984`,address:`Yard No. 8, Agricultural Market Yard, Anantapur`,logisticsSupport:`Farmer delivery required (Unloading assistance provided)`},{id:`rec-atp-03`,name:`Anantapur Annapurna Food Bank & Relief Trust`,businessType:`NGO & Community Feeding Initiative`,category:`NGO / Rescue`,district:`Anantapur`,state:`Andhra Pradesh`,coordinates:{lat:14.675,lng:77.608},targetCropIds:[`tomatoes`,`potatoes`,`onions`],targetCropNames:[`Tomatoes`,`Potatoes`,`Onions`],demandedQuantityKg:350,acceptedGrades:[`A`,`B`,`C`],maxDistanceKmAcceptable:25,offeredPricePerKg:15,urgencyHoursNeeded:12,urgencyLabel:`Critical (Immediate mid-day prep)`,verified:!0,verificationDetails:{apmcLicense:`NGO/AP/ATP/4820`,fssaiLicense:`20121021000843`,gstNumber:`80G-CERT-ATP-198`,trustScore:99,completedDealsCount:89,avgPaymentTimeHours:4,memberSince:`2022`},contactPerson:`Dr. Padmavati Rao (Director)`,phone:`+91 97014 33210`,whatsapp:`919701433210`,address:`Near Old Town Bus Stand, Anantapur`,logisticsSupport:`Volunteer van pickup from farm`},{id:`rec-atp-04`,name:`Reliance Retail Fresh Agri Hub`,businessType:`Modern Supermarket Chain`,category:`Retail Chain`,district:`Anantapur`,state:`Andhra Pradesh`,coordinates:{lat:14.73,lng:77.66},targetCropIds:[`tomatoes`,`capsicum`,`potatoes`],targetCropNames:[`Tomatoes`,`Capsicum`,`Potatoes`],demandedQuantityKg:1500,acceptedGrades:[`A`],maxDistanceKmAcceptable:60,offeredPricePerKg:19.5,urgencyHoursNeeded:36,urgencyLabel:`Semi-urgent (Fresh stock arrival)`,verified:!0,verificationDetails:{apmcLicense:`APMC/CORP/AP/992`,fssaiLicense:`10018021000994`,gstNumber:`37AABCR9911K1Z2`,trustScore:97,completedDealsCount:512,avgPaymentTimeHours:48,memberSince:`2020`},contactPerson:`Vikram Mohan (Regional Agri Sourcing)`,phone:`+91 99880 12093`,whatsapp:`919988012093`,address:`NH-44 Logistics Park, Anantapur Bypass`,logisticsSupport:`Crate exchange provided at gate`},{id:`rec-knl-01`,name:`Rayalaseema Bio-Canning & Puree Works`,businessType:`Food Processor (Bulk Exports)`,category:`Processor`,district:`Kurnool`,state:`Andhra Pradesh`,coordinates:{lat:15.8281,lng:78.0373},targetCropIds:[`tomatoes`,`mangoes`,`chillies`],targetCropNames:[`Tomatoes`,`Mangoes`,`Red Chillies`],demandedQuantityKg:5e3,acceptedGrades:[`B`,`C`],maxDistanceKmAcceptable:200,offeredPricePerKg:16,urgencyHoursNeeded:72,urgencyLabel:`Flexible (Next 3-4 days)`,verified:!0,verificationDetails:{apmcLicense:`APMC/KNL/2018/P-44`,fssaiLicense:`10118021000762`,gstNumber:`37AABCK7720L1ZP`,trustScore:91,completedDealsCount:160,avgPaymentTimeHours:36,memberSince:`2018`},contactPerson:`G. Suresh Kumar`,phone:`+91 94901 88320`,whatsapp:`919490188320`,address:`Tungabhadra Industrial Corridor, Kurnool`,logisticsSupport:`Bulk container truck dispatch for 3+ tonnes`},{id:`rec-nsk-01`,name:`Godavari Valley Agro Processing Co-op`,businessType:`Cooperative Dehydration & Export Unit`,category:`Processor`,district:`Nashik`,state:`Maharashtra`,coordinates:{lat:20.02,lng:73.83},targetCropIds:[`onions`,`tomatoes`],targetCropNames:[`Onions`,`Tomatoes`],demandedQuantityKg:2e3,acceptedGrades:[`A`,`B`],maxDistanceKmAcceptable:40,offeredPricePerKg:22.5,urgencyHoursNeeded:48,urgencyLabel:`Moderate (Batch processing scheduled)`,verified:!0,verificationDetails:{apmcLicense:`MH/NSK/APMC/8821`,fssaiLicense:`11520025000311`,gstNumber:`27AABCG5582R1ZY`,trustScore:96,completedDealsCount:420,avgPaymentTimeHours:18,memberSince:`2019`},contactPerson:`Nitin Patil (Director)`,phone:`+91 98220 44556`,whatsapp:`919822044556`,address:`Ambad MIDC, Phase 2, Nashik - 422010`,logisticsSupport:`Weighbridge & crate handling at site`},{id:`rec-nsk-02`,name:`Lasalgaon Export Aggregators`,businessType:`Export Trading House`,category:`Wholesaler`,district:`Nashik`,state:`Maharashtra`,coordinates:{lat:20.1444,lng:74.2255},targetCropIds:[`onions`,`potatoes`],targetCropNames:[`Onions`,`Potatoes`],demandedQuantityKg:5e3,acceptedGrades:[`A`],maxDistanceKmAcceptable:80,offeredPricePerKg:24,urgencyHoursNeeded:72,urgencyLabel:`High demand for Middle East consignment`,verified:!0,verificationDetails:{apmcLicense:`MH/LASAL/2017/E-12`,fssaiLicense:`11517024000889`,gstNumber:`27AABCL9932M1ZQ`,trustScore:95,completedDealsCount:650,avgPaymentTimeHours:24,memberSince:`2017`},contactPerson:`Prakash Borse`,phone:`+91 94227 12345`,whatsapp:`919422712345`,address:`Mandi Gate 3, Lasalgaon APMC, Nashik`,logisticsSupport:`Direct farm aggregation for lot > 3 MT`},{id:`rec-gtr-01`,name:`Mirchi Seva Spices & Extraction Mills`,businessType:`Oleoresin & Spice Export Plant`,category:`Processor`,district:`Guntur`,state:`Andhra Pradesh`,coordinates:{lat:16.315,lng:80.45},targetCropIds:[`chillies`],targetCropNames:[`Red Chillies`],demandedQuantityKg:1e3,acceptedGrades:[`A`,`B`],maxDistanceKmAcceptable:50,offeredPricePerKg:152,urgencyHoursNeeded:24,urgencyLabel:`Urgent (Export container dispatch tomorrow)`,verified:!0,verificationDetails:{apmcLicense:`APMC/GTR/SPICE/101`,fssaiLicense:`10121028000412`,gstNumber:`37AABCM6721N1ZS`,trustScore:98,completedDealsCount:310,avgPaymentTimeHours:6,memberSince:`2020`},contactPerson:`Ch. Subrahmanyam`,phone:`+91 98481 99001`,whatsapp:`919848199001`,address:`Autonagar, Near Spice Park, Guntur`,logisticsSupport:`Free moisture testing & immediate RTGS`},{id:`rec-inst-01`,name:`Rayalaseema University Mega Canteen`,businessType:`Institutional Bulk Consumer`,category:`Institutional Canteen`,district:`Anantapur`,state:`Andhra Pradesh`,coordinates:{lat:14.67,lng:77.595},targetCropIds:[`tomatoes`,`potatoes`,`onions`],targetCropNames:[`Tomatoes`,`Potatoes`,`Onions`],demandedQuantityKg:400,acceptedGrades:[`A`,`B`],maxDistanceKmAcceptable:20,offeredPricePerKg:18,urgencyHoursNeeded:24,urgencyLabel:`Weekly recurring institutional order`,verified:!0,verificationDetails:{apmcLicense:`GOVT/INST/ATP/2022`,fssaiLicense:`10122021000674`,gstNumber:`37GOVTU1200E1Z4`,trustScore:93,completedDealsCount:74,avgPaymentTimeHours:24,memberSince:`2022`},contactPerson:`Caterer Incharge - B. Prasad`,phone:`+91 99490 66778`,whatsapp:`919949066778`,address:`Campus Dining Block B, Anantapur`,logisticsSupport:`Unloading support at kitchen bay`}];
