"use client";
import { motion } from "framer-motion";

const VARIANTS = {
  dashboard: {
    icon: (
      <svg viewBox="0 0 80 80" width="80" height="80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="36" stroke="#7c3aed" strokeWidth="4" strokeDasharray="226" strokeLinecap="round"/>
        <motion.circle cx="40" cy="40" r="36" stroke="#c084fc" strokeWidth="4" strokeDasharray="226" strokeLinecap="round"
          animate={{ strokeDashoffset: [226, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} />
        <line x1="40" y1="40" x2="40" y2="12" stroke="#f9a8d4" strokeWidth="3" strokeLinecap="round"/>
        <motion.line x1="40" y1="40" x2="40" y2="12" stroke="#c084fc" strokeWidth="3" strokeLinecap="round"
          animate={{ rotate: [0, 270] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "40px 40px" }} />
        <circle cx="40" cy="40" r="4" fill="#c084fc" />
        {[30,60,90,120,150,180,210,240,270].map((a, i) => (
          <line key={i} x1={40 + 28 * Math.cos((a - 90) * Math.PI / 180)} y1={40 + 28 * Math.sin((a - 90) * Math.PI / 180)}
            x2={40 + 32 * Math.cos((a - 90) * Math.PI / 180)} y2={40 + 32 * Math.sin((a - 90) * Math.PI / 180)}
            stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
        ))}
      </svg>
    ),
    label: "Loading Dashboard",
    sub: "Fetching your garage stats...",
    color: "from-purple-500 to-blue-600",
  },
  maintenance: {
    icon: (
      <svg viewBox="0 0 80 80" width="80" height="80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.g animate={{ rotate: [0, 30, 0, -30, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ transformOrigin: "40px 40px" }}>
          <path d="M40 10 L46 28 L64 22 L52 36 L70 40 L52 44 L64 58 L46 52 L40 70 L34 52 L16 58 L28 44 L10 40 L28 36 L16 22 L34 28 Z"
            fill="none" stroke="#a855f7" strokeWidth="3" strokeLinejoin="round" />
        </motion.g>
        <motion.circle cx="40" cy="40" r="12" fill="#1e1b4b" stroke="#c084fc" strokeWidth="3"
          animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1, repeat: Infinity }} />
        <circle cx="40" cy="40" r="5" fill="#c084fc" />
      </svg>
    ),
    label: "Loading Maintenance",
    sub: "Checking your service schedule...",
    color: "from-amber-500 to-orange-600",
  },
  fuel: {
    icon: (
      <svg viewBox="0 0 80 80" width="80" height="80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="15" width="32" height="50" rx="6" stroke="#f59e0b" strokeWidth="3" />
        <rect x="52" y="22" width="8" height="6" rx="2" stroke="#f59e0b" strokeWidth="2" />
        <line x1="60" y1="25" x2="66" y2="20" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        <circle cx="66" cy="18" r="3" fill="#f59e0b" />
        <motion.rect x="24" y="45" width="24" height="16" rx="3" fill="#f59e0b" opacity="0.8"
          animate={{ height: [4, 16, 4], y: [57, 45, 57] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} />
        <text x="28" y="38" fontSize="11" fill="#fbbf24" fontWeight="bold" fontFamily="monospace">FUEL</text>
      </svg>
    ),
    label: "Loading Fuel Logs",
    sub: "Calculating your fuel efficiency...",
    color: "from-amber-400 to-yellow-600",
  },
  history: {
    icon: (
      <svg viewBox="0 0 80 80" width="80" height="80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="28" stroke="#06b6d4" strokeWidth="3" strokeDasharray="4 4" />
        <motion.path d="M40 18 A22 22 0 1 1 18 40" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" fill="none"
          animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "40px 40px" }} />
        <circle cx="40" cy="40" r="4" fill="#22d3ee" />
        <line x1="40" y1="40" x2="40" y2="24" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
        <motion.line x1="40" y1="40" x2="54" y2="40" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round"
          animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "40px 40px" }} />
      </svg>
    ),
    label: "Loading History",
    sub: "Retrieving your ride records...",
    color: "from-cyan-500 to-blue-600",
  },
  analytics: {
    icon: (
      <svg viewBox="0 0 80 80" width="80" height="80" fill="none" xmlns="http://www.w3.org/2000/svg">
        {[
          { x: 10, h: 20, delay: 0, color: "#a855f7" },
          { x: 24, h: 40, delay: 0.15, color: "#8b5cf6" },
          { x: 38, h: 30, delay: 0.3, color: "#c084fc" },
          { x: 52, h: 55, delay: 0.45, color: "#7c3aed" },
          { x: 66, h: 35, delay: 0.6, color: "#a855f7" },
        ].map((b, i) => (
          <motion.rect key={i} x={b.x} y={70 - b.h} width="10" height={b.h} rx="3" fill={b.color}
            animate={{ scaleY: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: b.delay, ease: "easeInOut" }}
            style={{ transformOrigin: `${b.x + 5}px 70px` }} />
        ))}
        <line x1="5" y1="70" x2="78" y2="70" stroke="#4c1d95" strokeWidth="2" />
      </svg>
    ),
    label: "Loading Analytics",
    sub: "Crunching your riding data...",
    color: "from-violet-500 to-purple-700",
  },
  bikes: {
    icon: (
      <svg viewBox="0 0 80 80" width="80" height="80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.circle cx="20" cy="55" r="16" stroke="#a855f7" strokeWidth="4" fill="none"
          animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "20px 55px" }} />
        <circle cx="20" cy="55" r="5" fill="#c084fc" />
        <motion.circle cx="60" cy="55" r="16" stroke="#a855f7" strokeWidth="4" fill="none"
          animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "60px 55px" }} />
        <circle cx="60" cy="55" r="5" fill="#c084fc" />
        {[0,60,120,180,240,300].map((a,i) => (
          <line key={i} x1={20} y1={55} x2={20 + 11 * Math.cos(a * Math.PI / 180)} y2={55 + 11 * Math.sin(a * Math.PI / 180)} stroke="#7c3aed" strokeWidth="2" />
        ))}
        {[0,60,120,180,240,300].map((a,i) => (
          <line key={i} x1={60} y1={55} x2={60 + 11 * Math.cos(a * Math.PI / 180)} y2={55 + 11 * Math.sin(a * Math.PI / 180)} stroke="#7c3aed" strokeWidth="2" />
        ))}
        <path d="M20 55 L35 35 L50 30 L60 38 L60 55" stroke="#c084fc" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M35 35 L40 55" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    label: "Loading Bikes",
    sub: "Fetching your vehicle profiles...",
    color: "from-purple-500 to-pink-600",
  },
  documents: {
    icon: (
      <svg viewBox="0 0 80 80" width="80" height="80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="18" y="10" width="44" height="56" rx="5" stroke="#06b6d4" strokeWidth="3" />
        <line x1="28" y1="28" x2="52" y2="28" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="28" y1="38" x2="52" y2="38" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />
        <motion.line x1="28" y1="48" x2="52" y2="48" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round"
          animate={{ x2: [28, 52, 28] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }} />
        <motion.line x1="28" y1="58" x2="44" y2="58" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round"
          animate={{ x2: [28, 44, 28] }} transition={{ duration: 1.4, repeat: Infinity, delay: 0.3, ease: "easeInOut" }} />
        <path d="M46 10 L62 10 L62 26 L46 26 Z" fill="#0e7490" stroke="#22d3ee" strokeWidth="2" />
      </svg>
    ),
    label: "Loading Documents",
    sub: "Fetching your document vault...",
    color: "from-cyan-500 to-teal-600",
  },
  settings: {
    icon: (
      <svg viewBox="0 0 80 80" width="80" height="80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.g animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "40px 40px" }}>
          <path d="M40 12 L44 22 L54 16 L54 28 L64 28 L58 38 L68 44 L58 50 L64 60 L54 60 L54 72 L44 66 L40 76 L36 66 L26 72 L26 60 L16 60 L22 50 L12 44 L22 38 L16 28 L26 28 L26 16 L36 22 Z"
            fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinejoin="round" />
        </motion.g>
        <motion.circle cx="40" cy="40" r="12" fill="#0f172a" stroke="#6366f1" strokeWidth="3"
          animate={{ rotate: -360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "40px 40px" }} />
        <circle cx="40" cy="40" r="5" fill="#818cf8" />
      </svg>
    ),
    label: "Loading Settings",
    sub: "Applying your preferences...",
    color: "from-slate-500 to-indigo-600",
  },
  expenses: {
    icon: (
      <svg viewBox="0 0 80 80" width="80" height="80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="12" y="25" width="56" height="38" rx="6" stroke="#10b981" strokeWidth="3" />
        <rect x="12" y="35" width="56" height="10" fill="#064e3b" opacity="0.6" />
        <text x="27" y="47" fontSize="14" fill="#34d399" fontWeight="900" fontFamily="monospace">₹</text>
        <motion.circle cx="58" cy="40" r="7" fill="none" stroke="#34d399" strokeWidth="2.5"
          animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
        <path d="M22 58 L22 25 M22 15 L22 22" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="22" cy="12" r="3" fill="#10b981" />
      </svg>
    ),
    label: "Loading Expenses",
    sub: "Tallying your maintenance costs...",
    color: "from-emerald-500 to-green-700",
  },
  services: {
    icon: (
      <svg viewBox="0 0 80 80" width="80" height="80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.g animate={{ rotate: [0, -20, 20, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "30px 50px" }}>
          <rect x="14" y="36" width="36" height="10" rx="5" fill="#f97316" stroke="#fb923c" strokeWidth="2" />
          <rect x="42" y="38" width="18" height="6" rx="3" fill="#ea580c" stroke="#fb923c" strokeWidth="1.5" />
        </motion.g>
        <motion.g animate={{ rotate: [0, 20, -20, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          style={{ transformOrigin: "55px 35px" }}>
          <rect x="40" y="22" width="32" height="8" rx="4" fill="#f97316" stroke="#fb923c" strokeWidth="2" transform="rotate(-45 55 26)" />
        </motion.g>
        <circle cx="40" cy="40" r="8" fill="#431407" stroke="#fb923c" strokeWidth="2" />
        <circle cx="40" cy="40" r="3" fill="#fb923c" />
      </svg>
    ),
    label: "Loading Services",
    sub: "Loading your service history...",
    color: "from-orange-500 to-red-600",
  },
  checklists: {
    icon: (
      <svg viewBox="0 0 80 80" width="80" height="80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="16" y="10" width="48" height="60" rx="6" stroke="#6366f1" strokeWidth="3" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x="24" y={24 + i * 13} width="10" height="10" rx="2" stroke="#818cf8" strokeWidth="2" fill="none" />
            <motion.path d={`M26 ${29 + i * 13} L29 ${32 + i * 13} L33 ${27 + i * 13}`}
              stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
              initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, times: [0, 0.3, 0.7, 1] }} />
            <line x1="40" y1={29 + i * 13} x2="56" y2={29 + i * 13} stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" />
          </g>
        ))}
      </svg>
    ),
    label: "Loading Checklists",
    sub: "Preparing your maintenance tasks...",
    color: "from-indigo-500 to-violet-700",
  },
  advisor: {
    icon: (
      <svg viewBox="0 0 80 80" width="80" height="80" fill="none" xmlns="http://www.w3.org/2000/svg">
        {[...Array(6)].map((_, i) => (
          <motion.circle key={i} cx={40 + 22 * Math.cos((i * 60) * Math.PI / 180)}
            cy={40 + 22 * Math.sin((i * 60) * Math.PI / 180)} r="4" fill="#fbbf24"
            animate={{ scale: [0.5, 1.4, 0.5], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.25 }} />
        ))}
        <motion.circle cx="40" cy="40" r="14" fill="#1c1917" stroke="#fbbf24" strokeWidth="3"
          animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1, repeat: Infinity }} />
        <text x="33" y="46" fontSize="16" fill="#fde68a" fontWeight="900">AI</text>
      </svg>
    ),
    label: "Loading AI Advisor",
    sub: "Waking up your mechanic AI...",
    color: "from-yellow-500 to-amber-600",
  },
};

const SPEED_LINES = [
  { top: "18%", w: "40%", delay: 0 }, { top: "32%", w: "55%", delay: 0.12 },
  { top: "48%", w: "30%", delay: 0.06 }, { top: "62%", w: "48%", delay: 0.2 },
  { top: "76%", w: "22%", delay: 0.08 }, { top: "88%", w: "35%", delay: 0.16 },
];

export default function PageLoader({ variant = "dashboard" }) {
  const v = VARIANTS[variant] || VARIANTS.dashboard;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050508]/90 backdrop-blur-md">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Speed lines in background */}
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
        {SPEED_LINES.map((l, i) => (
          <motion.div key={i} className="absolute h-[1.5px] bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full"
            style={{ top: l.top, width: l.w }}
            initial={{ left: "110%" }} animate={{ left: "-60%" }}
            transition={{ duration: 0.8, repeat: Infinity, delay: l.delay, ease: "linear" }} />
        ))}
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative flex flex-col items-center gap-6 glass rounded-3xl border border-white/10 p-10 w-72 shadow-2xl"
      >
        {/* Gradient top bar */}
        <div className={`absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r ${v.color} rounded-full`} />

        {/* Icon */}
        <motion.div
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full scale-150" />
          <div className="relative z-10">{v.icon}</div>
        </motion.div>

        {/* Text */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-white font-bold tracking-wide text-sm">{v.label}</span>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.span key={i} className="w-1 h-1 rounded-full bg-purple-400"
                  animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.3, 0.8] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-500">{v.sub}</p>
        </div>

        {/* Progress bar */}
        <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden">
          <motion.div className={`h-full bg-gradient-to-r ${v.color} rounded-full`}
            initial={{ x: "-100%" }} animate={{ x: "100%" }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }} />
        </div>
      </motion.div>
    </div>
  );
}
