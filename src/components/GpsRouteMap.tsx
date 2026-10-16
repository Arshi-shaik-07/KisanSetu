import { useState, useEffect } from "react";
import {
  MapPin,
  Radio,
  Play,
  Pause,
  RotateCcw,
  ShieldCheck,
  Crosshair,
  Satellite,
  Wifi
} from "lucide-react";
import type { Transaction } from "../lib/seedData";

interface GpsRouteMapProps {
  transaction: Transaction;
  isDispatchVerified?: boolean;
}

// Route waypoint coordinates on our 800x450 coordinate system
const ROUTE_POINTS = [
  { x: 110, y: 350, name: "Kalyanadurg Farm Gate", lat: 14.6812, lng: 77.5984, type: "origin" },
  { x: 220, y: 310, name: "Kalyanadurg Rural Road Exit", lat: 14.6890, lng: 77.6040, type: "waypoint" },
  { x: 330, y: 270, name: "SH-53 Junction & APMC Yard", lat: 14.6965, lng: 77.6105, type: "checkpoint" },
  { x: 450, y: 220, name: "NH-44 Bypass Flyover", lat: 14.7040, lng: 77.6170, type: "checkpoint" },
  { x: 570, y: 170, name: "Bellary Road Commercial Corridor", lat: 14.7100, lng: 77.6215, type: "waypoint" },
  { x: 690, y: 120, name: "Plot 14-B Industrial Hub", lat: 14.7150, lng: 77.6250, type: "destination" },
];

export function GpsRouteMap({ transaction, isDispatchVerified = true }: GpsRouteMapProps) {
  const [mapMode, setMapMode] = useState<"satellite" | "street" | "radar">("street");
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [progress, setProgress] = useState(0.42); // Start ~42% through the journey
  const [activePoi, setActivePoi] = useState<string | null>("truck");
  const [showGeofence, setShowGeofence] = useState(true);
  const [showRadarSweep] = useState(true);
  const [radarAngle, setRadarAngle] = useState(0);

  // Animate truck movement along route
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 0.003 * playbackSpeed;
        return next > 0.98 ? 0.05 : next; // loop back near start
      });
      setRadarAngle((deg) => (deg + 4 * playbackSpeed) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  // Interpolate current vehicle position along the polyline
  const calculateVehiclePosition = (prog: number) => {
    const totalSegments = ROUTE_POINTS.length - 1;
    const scaled = prog * totalSegments;
    const index = Math.min(Math.floor(scaled), totalSegments - 1);
    const subProg = scaled - index;

    const p1 = ROUTE_POINTS[index];
    const p2 = ROUTE_POINTS[index + 1];

    const currentX = p1.x + (p2.x - p1.x) * subProg;
    const currentY = p1.y + (p2.y - p1.y) * subProg;
    const currentLat = p1.lat + (p2.lat - p1.lat) * subProg;
    const currentLng = p1.lng + (p2.lng - p1.lng) * subProg;

    // Calculate heading angle
    const angleRad = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    const angleDeg = (angleRad * 180) / Math.PI;

    return { x: currentX, y: currentY, lat: currentLat, lng: currentLng, heading: angleDeg };
  };

  const truckPos = calculateVehiclePosition(progress);
  const remainingKm = Math.max(0.4, (transaction.distanceKm * (1 - progress))).toFixed(1);
  const estMinsLeft = Math.max(2, Math.round(18 * (1 - progress)));

  // SVG route path string
  const svgPathData = ROUTE_POINTS.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, "");

  return (
    <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
      {/* Top Map Header & Mode Bar */}
      <div className="bg-slate-900/95 backdrop-blur-md px-4 sm:px-6 py-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="font-extrabold text-white tracking-wide text-xs">
              LIVE SATELLITE & GPS NAVIGATION
            </span>
          </div>
          <span className="hidden sm:inline-block font-mono text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            NavIC / GNSS Dual-Lock (11 Sats)
          </span>
        </div>

        {/* Layer Controls & Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-800/80 p-0.5 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => setMapMode("street")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                mapMode === "street"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🗺️ Street & Transit
            </button>
            <button
              type="button"
              onClick={() => setMapMode("satellite")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                mapMode === "satellite"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🛰️ Satellite
            </button>
            <button
              type="button"
              onClick={() => setMapMode("radar")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                mapMode === "radar"
                  ? "bg-cyan-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🎯 Tactical Radar
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowGeofence(!showGeofence)}
            title="Toggle Geofence Boundaries"
            className={`p-1.5 rounded-lg border text-xs font-bold transition ${
              showGeofence
                ? "bg-amber-400/20 text-amber-300 border-amber-400/40"
                : "bg-slate-800 text-slate-400 border-slate-700"
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Map Canvas (800 x 450 coordinate viewport) */}
      <div className="relative w-full h-[360px] sm:h-[440px] bg-slate-950 overflow-hidden select-none">
        {/* Dynamic Background Styling based on mapMode */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            mapMode === "satellite"
              ? "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-[#0a1a12] to-slate-950"
              : mapMode === "radar"
              ? "bg-[#030d0a]"
              : "bg-gradient-to-br from-slate-950 via-[#0b151a] to-slate-900"
          }`}
        />

        {/* Map Grid / Topo Contours */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #10b981 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />

        {/* Vector SVG Map Container */}
        <svg
          viewBox="0 0 800 450"
          className="w-full h-full absolute inset-0 preserve-3d"
        >
          <defs>
            {/* Pulsing Glow Filters */}
            <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Linear Gradients */}
            <linearGradient id="route-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#2dd4bf" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>

            <linearGradient id="corridor-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Secondary Arterial Road Network (Contextual Map Elements) */}
          <g className="opacity-30 stroke-slate-700" strokeWidth="2" fill="none">
            {/* NH-44 Highway Spine */}
            <path d="M 400 30 L 460 180 L 490 320 L 510 430" strokeDasharray="4 4" />
            <text x="440" y="70" fill="#94a3b8" fontSize="10" fontWeight="bold">NH-44 Corridor</text>

            {/* SH-53 Kalyanadurg Highway */}
            <path d="M 40 400 L 260 300 L 460 180 L 760 80" />
            <text x="180" y="325" fill="#94a3b8" fontSize="9">SH-53 Road</text>

            {/* Secondary Cross-streets */}
            <path d="M 120 180 L 330 270 L 350 420" strokeWidth="1.5" />
            <path d="M 520 80 L 570 170 L 680 290" strokeWidth="1.5" />

            {/* Local River Tributary */}
            <path
              d="M 60 40 Q 240 100 380 70 T 720 30"
              stroke="#0284c7"
              strokeWidth="4"
              strokeOpacity="0.4"
            />
            <text x="260" y="90" fill="#0284c7" fontSize="9" opacity="0.6">Penna Canal Stream</text>
          </g>

          {/* Radar Tactical Sweep Line (if in radar mode) */}
          {mapMode === "radar" && showRadarSweep && (
            <g>
              {/* Range Rings */}
              <circle cx="400" cy="225" r="80" stroke="#065f46" strokeWidth="1" fill="none" opacity="0.4" />
              <circle cx="400" cy="225" r="160" stroke="#065f46" strokeWidth="1" fill="none" opacity="0.3" />
              <circle cx="400" cy="225" r="240" stroke="#065f46" strokeWidth="1" fill="none" opacity="0.2" />

              {/* Sweeping Beam */}
              <line
                x1="400"
                y1="225"
                x2={400 + 300 * Math.cos((radarAngle * Math.PI) / 180)}
                y2={225 + 300 * Math.sin((radarAngle * Math.PI) / 180)}
                stroke="#10b981"
                strokeWidth="2"
                opacity="0.8"
              />
            </g>
          )}

          {/* Geofence Safety Corridors */}
          {showGeofence && (
            <g>
              {/* Farm Gate Geofence Zone (Point A) */}
              <circle
                cx={ROUTE_POINTS[0].x}
                cy={ROUTE_POINTS[0].y}
                r="45"
                fill="#10b981"
                fillOpacity="0.12"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <text
                x={ROUTE_POINTS[0].x - 40}
                y={ROUTE_POINTS[0].y + 60}
                fill="#34d399"
                fontSize="9"
                fontWeight="bold"
              >
                GEOFENCE: 100m FARM YARD
              </text>

              {/* Factory Hub Geofence Zone (Point B) */}
              <circle
                cx={ROUTE_POINTS[5].x}
                cy={ROUTE_POINTS[5].y}
                r="55"
                fill="#06b6d4"
                fillOpacity="0.12"
                stroke="#06b6d4"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <text
                x={ROUTE_POINTS[5].x - 55}
                y={ROUTE_POINTS[5].y - 25}
                fill="#22d3ee"
                fontSize="9"
                fontWeight="bold"
              >
                GEOFENCE: 250m PROCESSING HUB
              </text>

              {/* Safe Transit Corridor Envelope */}
              <path
                d={svgPathData}
                stroke="url(#corridor-gradient)"
                strokeWidth="32"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </g>
          )}

          {/* Active Route Polyline Background Track */}
          <path
            d={svgPathData}
            stroke="#1e293b"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Traveled Route Line (Green Gradient) */}
          <path
            d={svgPathData}
            stroke="url(#route-gradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            filter="url(#glow-green)"
          />

          {/* Waypoint Nodes along route */}
          {ROUTE_POINTS.map((pt, i) => (
            <g
              key={i}
              onClick={() => setActivePoi(pt.name)}
              className="cursor-pointer group"
            >
              {/* Waypoint circle */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={i === 0 || i === ROUTE_POINTS.length - 1 ? 7 : 4}
                fill={
                  i === 0
                    ? "#10b981"
                    : i === ROUTE_POINTS.length - 1
                    ? "#06b6d4"
                    : "#64748b"
                }
                stroke="#0f172a"
                strokeWidth="2"
              />

              {/* Labels for Origin and Destination */}
              {i === 0 && (
                <g>
                  <circle cx={pt.x} cy={pt.y} r="14" stroke="#10b981" strokeWidth="1" fill="none" className="animate-ping opacity-60" />
                  <rect x={pt.x - 70} y={pt.y - 34} width="140" height="22" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
                  <text x={pt.x} y={pt.y - 19} fill="#ecfdf5" fontSize="10" fontWeight="bold" textAnchor="middle">
                    📍 POINT A: FARM GATE
                  </text>
                </g>
              )}

              {i === ROUTE_POINTS.length - 1 && (
                <g>
                  <circle cx={pt.x} cy={pt.y} r="14" stroke="#06b6d4" strokeWidth="1" fill="none" className="animate-ping opacity-60" />
                  <rect x={pt.x - 75} y={pt.y + 14} width="150" height="22" rx="6" fill="#0f172a" stroke="#06b6d4" strokeWidth="1" />
                  <text x={pt.x} y={pt.y + 29} fill="#cffafe" fontSize="10" fontWeight="bold" textAnchor="middle">
                    🏭 POINT B: BUYER FACTORY
                  </text>
                </g>
              )}
            </g>
          ))}

          {/* Real-time Moving Tata Ace Vehicle on Path */}
          <g
            transform={`translate(${truckPos.x}, ${truckPos.y})`}
            onClick={() => setActivePoi("truck")}
            className="cursor-pointer"
          >
            {/* Projected Vehicle Headlight Beam */}
            <polygon
              points="0,0 45,-18 45,18"
              transform={`rotate(${truckPos.heading})`}
              fill="#fef08a"
              opacity="0.25"
            />

            {/* Vehicle Beacon Pulse Circle */}
            <circle
              r="18"
              fill="#f59e0b"
              fillOpacity="0.25"
              className="animate-ping"
            />

            {/* Vehicle Background Chip */}
            <circle
              r="13"
              fill="#0f172a"
              stroke="#f59e0b"
              strokeWidth="2.5"
              filter="url(#glow-amber)"
            />

            {/* Oriented Arrow / Vehicle Body */}
            <g transform={`rotate(${truckPos.heading})`}>
              <polygon
                points="-5,-5 8,0 -5,5"
                fill="#fbbf24"
              />
            </g>

            {/* Floating Live Tag above vehicle */}
            <rect
              x="-65"
              y="-36"
              width="130"
              height="20"
              rx="5"
              fill="#0f172a"
              stroke="#fbbf24"
              strokeWidth="1.2"
              opacity="0.95"
            />
            <text
              x="0"
              y="-22"
              fill="#fbbf24"
              fontSize="9"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="monospace"
            >
              🚛 TATA ACE (34 km/h)
            </text>
          </g>
        </svg>

        {/* Live HUD Floating Telemetry Badge Overlay */}
        <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-700 shadow-xl max-w-xs space-y-1.5 pointer-events-auto">
          <div className="flex items-center justify-between gap-3 text-[11px]">
            <span className="text-slate-400 font-medium">GPS Telematics:</span>
            <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
              <Radio className="w-3 h-3 animate-pulse" />
              4G RTK LOCKED
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800 text-[10px] font-mono">
            <div>
              <span className="text-slate-500 block">COORDINATES</span>
              <span className="text-white font-bold">
                {truckPos.lat.toFixed(4)}°N, {truckPos.lng.toFixed(4)}°E
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">SPEED & HEADING</span>
              <span className="text-amber-300 font-bold">
                34.2 km/h • {Math.round(truckPos.heading)}° NE
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px]">
            <span className="text-slate-400">Remaining to Hub:</span>
            <span className="text-cyan-300 font-bold font-mono">
              {remainingKm} km (~{estMinsLeft} mins)
            </span>
          </div>
        </div>

        {/* Anti-Fraud Geofence Compliance Pill */}
        <div className="absolute bottom-4 left-4 bg-emerald-950/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-emerald-500/40 shadow-xl flex items-center gap-2.5 text-xs text-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <span className="font-extrabold block text-white text-[11px] leading-tight">
              Anti-Tamper Transit Corridor: {isDispatchVerified ? "SECURE" : "PENDING"}
            </span>
            <span className="text-[10px] text-emerald-300/80">
              0m Geofence Deviation • Route Lock Active
            </span>
          </div>
        </div>

        {/* Map Control Buttons (Bottom Right) */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          {/* Play/Pause */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 shadow-lg transition cursor-pointer"
            title={isPlaying ? "Pause Simulation" : "Resume Simulation"}
          >
            {isPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Speed Toggle */}
          <button
            type="button"
            onClick={() => setPlaybackSpeed((s) => (s === 1 ? 2 : s === 2 ? 5 : 1))}
            className="px-2.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 shadow-lg text-xs font-mono font-bold transition cursor-pointer"
            title="Cycle Playback Speed"
          >
            {playbackSpeed}x
          </button>

          {/* Reset Route */}
          <button
            type="button"
            onClick={() => setProgress(0.05)}
            className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 shadow-lg transition cursor-pointer"
            title="Reset Vehicle to Farm Gate"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Selected Waypoint Info Bar */}
      <div className="bg-slate-900 px-4 sm:px-6 py-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">
              Active Monitored Checkpoint
            </span>
            <span className="font-extrabold text-white">
              {activePoi === "truck"
                ? `Vehicle En-Route on SH-53 Commercial Arterial (${truckPos.lat.toFixed(4)}°N, ${truckPos.lng.toFixed(4)}°E)`
                : activePoi}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-mono text-slate-300">
          <span className="flex items-center gap-1.5">
            <Satellite className="w-3.5 h-3.5 text-emerald-400" />
            <span>HDOP: 0.8 (Excellent)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-cyan-400" />
            <span>4G Telemetry Ping: 24ms</span>
          </span>
        </div>
      </div>
    </div>
  );
}
