"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";

// Animated sport bike SVG built purely from paths
function AnimatedBike() {
  return (
    <motion.div
      className="relative"
      animate={{ x: [-4, 4, -4], y: [-2, 2, -2] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Neon glow behind bike */}
      <div className="absolute inset-0 bg-purple-500/30 blur-3xl rounded-full scale-150" />

      <svg
        viewBox="0 0 200 110"
        width="280"
        height="154"
        className="relative z-10 drop-shadow-[0_0_20px_rgba(168,85,247,0.9)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ---- Rear Wheel ---- */}
        <circle cx="42" cy="80" r="24" fill="none" stroke="#7c3aed" strokeWidth="5" />
        <circle cx="42" cy="80" r="14" fill="none" stroke="#a855f7" strokeWidth="3" opacity="0.5" />
        <circle cx="42" cy="80" r="5" fill="#c084fc" />
        {/* spokes */}
        {[0,45,90,135].map((deg) => (
          <motion.line
            key={deg}
            x1={42 + 24 * Math.cos((deg * Math.PI) / 180)}
            y1={80 + 24 * Math.sin((deg * Math.PI) / 180)}
            x2={42 - 24 * Math.cos((deg * Math.PI) / 180)}
            y2={80 - 24 * Math.sin((deg * Math.PI) / 180)}
            stroke="#9333ea"
            strokeWidth="1.5"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "42px 80px" }}
          />
        ))}

        {/* ---- Front Wheel ---- */}
        <circle cx="162" cy="80" r="24" fill="none" stroke="#7c3aed" strokeWidth="5" />
        <circle cx="162" cy="80" r="14" fill="none" stroke="#a855f7" strokeWidth="3" opacity="0.5" />
        <circle cx="162" cy="80" r="5" fill="#c084fc" />
        {[0,45,90,135].map((deg) => (
          <motion.line
            key={deg}
            x1={162 + 24 * Math.cos((deg * Math.PI) / 180)}
            y1={80 + 24 * Math.sin((deg * Math.PI) / 180)}
            x2={162 - 24 * Math.cos((deg * Math.PI) / 180)}
            y2={80 - 24 * Math.sin((deg * Math.PI) / 180)}
            stroke="#9333ea"
            strokeWidth="1.5"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "162px 80px" }}
          />
        ))}

        {/* ---- Frame ---- */}
        {/* Swing arm */}
        <line x1="42" y1="80" x2="90" y2="62" stroke="#a855f7" strokeWidth="5" strokeLinecap="round" />
        {/* Main frame top */}
        <line x1="90" y1="62" x2="155" y2="52" stroke="#c084fc" strokeWidth="4" strokeLinecap="round" />
        {/* Down tube */}
        <line x1="90" y1="62" x2="110" y2="85" stroke="#a855f7" strokeWidth="4" strokeLinecap="round" />
        {/* Front fork */}
        <line x1="155" y1="52" x2="162" y2="80" stroke="#c084fc" strokeWidth="4" strokeLinecap="round" />
        {/* Engine block */}
        <rect x="90" y="62" width="35" height="20" rx="4" fill="#1e1b4b" stroke="#7c3aed" strokeWidth="2" />

        {/* ---- Fuel tank (body) ---- */}
        <path
          d="M95 62 Q110 30 145 38 L155 52 Q130 50 110 62 Z"
          fill="url(#tankGrad)"
          stroke="#c084fc"
          strokeWidth="1.5"
        />
        <defs>
          <linearGradient id="tankGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>

        {/* ---- Fairing (front nose) ---- */}
        <path
          d="M148 38 Q170 30 178 50 Q168 55 155 52 Z"
          fill="url(#tankGrad)"
          stroke="#c084fc"
          strokeWidth="1"
        />
        {/* Headlight */}
        <ellipse cx="174" cy="46" rx="5" ry="4" fill="#fef3c7" opacity="0.9" />
        <motion.ellipse
          cx="174" cy="46" rx="5" ry="4"
          fill="#fef9c3"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />

        {/* ---- Rider silhouette ---- */}
        {/* body */}
        <path d="M110 62 Q115 38 130 32 L142 38 Q128 44 118 62 Z" fill="#1e1b4b" stroke="#7c3aed" strokeWidth="1" />
        {/* helmet */}
        <ellipse cx="132" cy="28" rx="11" ry="10" fill="#1e1b4b" stroke="#a855f7" strokeWidth="2" />
        <ellipse cx="136" cy="31" rx="5" ry="3" fill="#312e81" stroke="#c084fc" strokeWidth="1" />

        {/* ---- Exhaust pipe ---- */}
        <path d="M90 78 Q70 82 55 80" stroke="#a855f7" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* ---- Road ---- */}
        <line x1="0" y1="104" x2="200" y2="104" stroke="#3b0764" strokeWidth="2" />
      </svg>
    </motion.div>
  );
}

import { useEffect, useState } from "react";

// Exhaust smoke particles
function SmokeParticles() {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    setParticles([...Array(6)].map((_, i) => ({
      i,
      yOffset: (Math.random() - 0.5) * 30
    })));
  }, []);

  return (
    <div className="absolute left-8 bottom-16 pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.i}
          className="absolute w-3 h-3 rounded-full bg-slate-400/40 blur-sm"
          initial={{ x: 0, y: 0, scale: 0.5, opacity: 0.7 }}
          animate={{ x: -(40 + p.i * 15), y: p.yOffset, scale: 3, opacity: 0 }}
          transition={{ duration: 0.8, repeat: Infinity, delay: p.i * 0.13, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

// Speed lines in background
function SpeedLines() {
  const lines = [
    { top: "20%", w: "35%", delay: 0 },
    { top: "32%", w: "50%", delay: 0.15 },
    { top: "44%", w: "28%", delay: 0.05 },
    { top: "56%", w: "42%", delay: 0.25 },
    { top: "68%", w: "20%", delay: 0.1 },
    { top: "78%", w: "55%", delay: 0.3 },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
      {lines.map((l, i) => (
        <motion.div
          key={i}
          className="absolute h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full"
          style={{ top: l.top, width: l.w }}
          initial={{ left: "110%" }}
          animate={{ left: "-60%" }}
          transition={{ duration: 0.7, repeat: Infinity, delay: l.delay, ease: "linear" }}
        />
      ))}
    </div>
  );
}

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 overflow-hidden">
        {/* Background ambient glows */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="text-center w-full max-w-2xl space-y-8">
          {/* Huge 404 text */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <span className="text-[120px] sm:text-[160px] font-black leading-none gradient-text select-none opacity-10 absolute inset-0 flex items-center justify-center blur-sm">
              404
            </span>
            <span className="text-[120px] sm:text-[160px] font-black leading-none gradient-text select-none relative">
              404
            </span>
          </motion.div>

          {/* Bike scene */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative mx-auto w-full max-w-sm h-40 glass rounded-3xl border border-white/10 flex items-center justify-center overflow-hidden shadow-[0_0_60px_rgba(124,58,237,0.2)]"
          >
            <SpeedLines />
            <SmokeParticles />
            <AnimatedBike />

            {/* Road surface */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-900/60 to-transparent" />
            {/* Road dashes */}
            <div className="absolute bottom-3 left-0 right-0 flex gap-4 px-4 overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-[2px] flex-1 bg-slate-600/60 rounded-full"
                  initial={{ x: "200%" }}
                  animate={{ x: "-200%" }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1, ease: "linear" }}
                />
              ))}
            </div>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-3"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Lost Your Way, Rider?
            </h1>
            <p className="text-slate-400 text-lg max-w-sm mx-auto leading-relaxed">
              Looks like you&apos;ve ridden off the map. This page doesn&apos;t exist — but your garage is still intact!
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 btn-glow px-7 py-3.5 rounded-2xl text-white font-bold text-base transition-all hover:scale-105 active:scale-95"
            >
              <ArrowLeft size={18} />
              Back to Garage
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 glass border border-white/10 hover:border-purple-500/40 px-7 py-3.5 rounded-2xl text-slate-300 font-semibold text-base transition-all hover:scale-105 active:scale-95"
            >
              Go to Home
            </Link>
          </motion.div>
        </div>
      </main>
    </>
  );
}
