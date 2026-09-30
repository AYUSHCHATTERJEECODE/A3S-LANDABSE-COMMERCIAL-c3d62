import React, { useState } from 'react';
import { Phone, MessageSquare, X } from 'lucide-react';

export const FloatingActions: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {/* 24/7 Advisory Pulse Tooltip */}
      {showTooltip && (
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-creamgreen-300 text-xs text-luxury-obsidian flex items-center gap-2 animate-bounce hidden sm:flex">
          <span className="w-2 h-2 rounded-full bg-creamgreen-500 animate-pulse"></span>
          <span><strong>24/7 Advisory:</strong> We're online to assist!</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-luxury-muted hover:text-luxury-obsidian ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2.5">
        {/* Direct Call Button */}
        <a
          href="tel:+919810653905"
          className="w-12 h-12 rounded-full bg-white hover:bg-creamgreen-50 text-luxury-obsidian flex items-center justify-center shadow-lg border border-creamgreen-300 hover:scale-105 transition-all"
          title="Call Corporate Hotline"
        >
          <Phone className="w-5 h-5 text-creamgreen-700" />
        </a>

        {/* WhatsApp Floating Pill */}
        <a
          href="https://wa.me/919810653905?text=Hello%20A3S%20Landbase,%20I%20would%20like%20to%20inquire%20about%20commercial%20spaces%20in%20Sector%2062%20Gurugram."
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-3 rounded-full bg-creamgreen-700 hover:bg-creamgreen-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xl hover:scale-105 transition-all border border-creamgreen-800"
          title="Chat on WhatsApp"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="hidden sm:inline">WhatsApp Us</span>
        </a>
      </div>
    </div>
  );
};
