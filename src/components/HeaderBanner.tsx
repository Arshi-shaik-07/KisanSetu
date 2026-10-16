import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  Home,
  Sprout,
  Store,
  Zap,
  ClipboardList,
  Truck,
  UserPlus,
  BarChart3,
  HelpCircle,
  Info,
  Menu,
  X,
  Languages,
  ShieldCheck,
  UserCheck,
  LogOut,
  LogIn,
} from "lucide-react";
import { M, type Language } from "../lib/translations";
import { useAuth } from "../context/AuthContext";

interface HeaderBannerProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sellersCount: number;
  buyersCount: number;
  listingsCount: number;
  transactionsCount: number;
  lang: Language;
  setLang: (lang: Language) => void;
  notificationsCount: number;
  onOpenNotifications: () => void;
  onStartDemoTour: () => void;
}

export function HeaderBanner({
  activeTab,
  setActiveTab,
  sellersCount,
  buyersCount,
  listingsCount,
  transactionsCount,
  lang,
  setLang,
  notificationsCount,
  onOpenNotifications,
  onStartDemoTour,
}: HeaderBannerProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const t = M[lang] || M.en;

  const navItems = [
    { id: "home", label: t.nav.home, icon: Home },
    {
      id: "farmer",
      label: t.nav.farmer,
      icon: Sprout,
      badge: t.produceLotsBadge.replace("{count}", String(listingsCount)),
    },
    {
      id: "buyer",
      label: t.nav.buyer,
      icon: Store,
      badge: "Market",
    },
    {
      id: "matches",
      label: t.nav.matches,
      icon: Zap,
      badge: "94% AI",
    },
    {
      id: "transactions",
      label: t.nav.transactions,
      icon: ClipboardList,
      badge: t.ordersBadge.replace("{count}", String(transactionsCount)),
    },
    {
      id: "logistics",
      label: t.nav.logistics,
      icon: Truck,
    },
    {
      id: "register",
      label: t.nav.register,
      icon: UserPlus,
      badge: t.realRecordsCount.replace("{count}", String(sellersCount + buyersCount)),
      highlight: true,
    },
    {
      id: "impact",
      label: t.nav.impact,
      icon: BarChart3,
    },
    {
      id: "howItWorks",
      label: t.nav.howItWorks,
      icon: HelpCircle,
    },
    {
      id: "about",
      label: t.nav.about,
      icon: Info,
    },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* 1. Top Prototype Announcement Bar */}
      <div className="bg-emerald-950 text-white px-4 py-1.5 text-xs border-b border-emerald-900/60">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Prototype Notice */}
          <div className="flex items-center gap-2 text-emerald-200">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-extrabold text-[11px] uppercase tracking-wider text-amber-300">
              {t.prototypeNotice}
            </span>
            <span className="hidden md:inline text-emerald-400/80">•</span>
            <span className="hidden md:inline text-[11px] text-emerald-200 font-medium">
              {t.prototypeBanner
                .replace("{sellers}", String(sellersCount))
                .replace("{buyers}", String(buyersCount))
                .replace("{listings}", String(listingsCount))}
            </span>
          </div>

          {/* Right: Demo Tour & Language Switcher */}
          <div className="flex items-center gap-3">
            <button
              onClick={onStartDemoTour}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] transition shadow-xs cursor-pointer active:scale-95"
              title="Click for 30-Second Judge Presentation Walkthrough"
            >
              <Zap className="w-3.5 h-3.5 fill-current text-slate-950" />
              <span>{t.demoTourBtn}</span>
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-emerald-900/80 rounded-lg p-0.5 border border-emerald-800 text-[11px] font-medium">
              <Languages className="w-3.5 h-3.5 text-emerald-300 ml-1.5 mr-1" />
              <button
                onClick={() => setLang("en")}
                className={`px-1.5 py-0.5 rounded transition ${
                  lang === "en"
                    ? "bg-emerald-700 text-white font-bold"
                    : "text-emerald-300 hover:text-white"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang("te")}
                className={`px-1.5 py-0.5 rounded transition ${
                  lang === "te"
                    ? "bg-emerald-700 text-white font-bold"
                    : "text-emerald-300 hover:text-white"
                }`}
              >
                తెలుగు
              </button>
              <button
                onClick={() => setLang("hi")}
                className={`px-1.5 py-0.5 rounded transition ${
                  lang === "hi"
                    ? "bg-emerald-700 text-white font-bold"
                    : "text-emerald-300 hover:text-white"
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Branding Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-emerald-700 transition">
                  {t.appName}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  AgriLink™
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium line-clamp-1">
                {t.appTagline}
              </p>
            </div>
          </div>

          {/* Right Actions: Register Button, Notifications, Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => handleNavClick("register")}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                activeTab === "register"
                  ? "bg-amber-400 text-slate-950 border-amber-500 shadow-sm"
                  : "bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 text-amber-700" />
              <span>{t.registerBtn}</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition cursor-pointer"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {notificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white">
                  {notificationsCount}
                </span>
              )}
            </button>

            {/* Authentication & User Status */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/verification"
                  className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition"
                  title="Open Verification Center"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="capitalize">{user.tier} Tier</span>
                </Link>

                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-xs font-extrabold text-slate-800 leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-slate-400 capitalize">
                    {user.role}
                  </span>
                </div>

                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* 3. Navigation Tabs Bar (Desktop) */}
        <div className="hidden lg:flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 text-xs font-semibold scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-emerald-600 text-white font-bold shadow-xs"
                    : item.highlight
                    ? "bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100"
                    : "text-slate-600 hover:text-emerald-700 hover:bg-slate-100"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive
                      ? "text-white"
                      : item.highlight
                      ? "text-amber-600"
                      : "text-slate-500"
                  }`}
                />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-0.5 ${
                      isActive
                        ? "bg-white/20 text-white"
                        : item.highlight
                        ? "bg-amber-200 text-amber-950"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {user && (
            <Link
              to="/verification"
              className="ml-auto inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-bold transition text-xs"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verification Center</span>
            </Link>
          )}
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 py-3 px-2 space-y-1 bg-white animate-fadeIn">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-between cursor-pointer ${
                    isActive
                      ? "bg-emerald-600 text-white font-bold"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {user && (
              <Link
                to="/verification"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold bg-emerald-50 text-emerald-800 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verification Center ({user.tier} Tier)</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
