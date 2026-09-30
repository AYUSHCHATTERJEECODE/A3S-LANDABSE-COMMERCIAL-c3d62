import React from 'react';
import { ArrowUp, Phone, Mail, MapPin, Lock } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-luxury-obsidian text-cream-100 pt-16 pb-12 border-t border-creamgreen-800/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-creamgreen-900/80">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-creamgreen-500 to-creamgreen-800 p-0.5 shadow-sm">
                <div className="w-full h-full bg-luxury-obsidian rounded-[10px] flex items-center justify-center">
                  <span className="font-heading font-extrabold text-creamgreen-300 text-lg">A3S</span>
                </div>
              </div>
              <div>
                <span className="font-heading font-bold text-lg text-white tracking-tight block">
                  A3S LANDBASE
                </span>
                <span className="text-[10px] uppercase font-semibold text-creamgreen-400 tracking-wider">
                  Commercial Properties • Gurugram
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-creamgreen-100/80 leading-relaxed">
              Gurugram’s premier commercial real estate agency providing Grade-A office leasing, 
              institutional commercial building rentals, and commercial land acquisition advisory with 
              100% dispute-free title assurance.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-creamgreen-900/60 border border-creamgreen-700/50 text-[11px] font-semibold text-creamgreen-300">
                <span className="w-2 h-2 rounded-full bg-creamgreen-400"></span>
                Open 24/7 Mon-Sun
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-luxury-charcoal border border-creamgreen-900 text-[11px] text-creamgreen-200">
                ★ 4.9 (130+ Reviews)
              </span>
            </div>
          </div>

          {/* Col 2: Commercial Services */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider text-creamgreen-400">
              Core Capabilities
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-creamgreen-100/70">
              <li>
                <a href="#services" className="hover:text-creamgreen-300 transition-colors">
                  Commercial Office Leasing (1k–50k sq ft)
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-creamgreen-300 transition-colors">
                  Commercial Building &amp; Retail Rentals
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-creamgreen-300 transition-colors">
                  Land Acquisition &amp; Investment Advisory
                </a>
              </li>
              <li>
                <a href="#roi-calculator" className="hover:text-creamgreen-300 transition-colors">
                  Commercial Lease Budget Calculator
                </a>
              </li>
              <li>
                <a href="#booking-scheduler" className="hover:text-creamgreen-300 transition-colors">
                  Turnkey Fitout &amp; IT Space Advisory
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Gurugram Locations */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider text-creamgreen-400">
              Prime Corridors
            </h4>
            <ul className="space-y-2 text-xs text-creamgreen-100/60">
              <li>Sector 62 (Pioneer Urban Square)</li>
              <li>Golf Course Extension Road</li>
              <li>DLF Cyber City / Cyber Hub</li>
              <li>Golf Course Road (Grade A)</li>
              <li>Sohna Road Commercial Hub</li>
              <li>Southern Peripheral Road (SPR)</li>
            </ul>
          </div>

          {/* Col 4: Corporate Headquarters & Exclusive Admin Link */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider text-creamgreen-400">
              Gurugram Office
            </h4>
            <div className="space-y-2 text-xs text-creamgreen-100/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-creamgreen-400 flex-shrink-0 mt-0.5" />
                <span>Second Floor, Pioneer Urban Square, C-208, Sector 62, Gurugram, Ghata, Haryana 122098</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Phone className="w-4 h-4 text-creamgreen-400 flex-shrink-0" />
                <a href="tel:+919810653905" className="hover:text-white font-semibold text-creamgreen-300">
                  +91 98106 53905
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-creamgreen-400 flex-shrink-0" />
                <span>advisory@a3slandbase.com</span>
              </div>

              {/* Dedicated Admin Portal Trigger in Footer */}
              {onOpenAdmin && (
                <div className="pt-3 border-t border-creamgreen-900/60">
                  <button
                    onClick={onOpenAdmin}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-creamgreen-950/90 hover:bg-creamgreen-800 text-creamgreen-300 hover:text-white border border-creamgreen-700/60 text-xs font-semibold transition-all shadow-sm"
                  >
                    <Lock className="w-3.5 h-3.5 text-creamgreen-400" />
                    <span>Admin Portal (Sign Up / Login)</span>
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Regulatory & RERA Disclaimer */}
        <div className="py-6 border-b border-creamgreen-900/80 text-[11px] text-creamgreen-200/50 leading-relaxed space-y-2">
          <p>
            <strong>Regulatory Disclaimer &amp; Compliance:</strong> A3S Landbase Commercial Properties operates as an independent commercial real estate advisory and consultancy firm. All property details, architectural renderings, measurements, and pricing indications are subject to contract and formal due diligence. Clients are advised to conduct independent legal verification before executing registered lease deeds.
          </p>
          <p>
            RERA Haryana Registration &amp; Commercial Real Estate Practice Code adheres strictly to the Real Estate (Regulation and Development) Act, 2016.
          </p>
        </div>

        {/* Bottom Bar with Back to Top & Staff Admin link */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-creamgreen-200/60">
          <div>
            &copy; {new Date().getFullYear()} A3S Landbase Commercial Properties. All rights reserved.
          </div>

          <div className="flex items-center gap-5 sm:gap-6 flex-wrap">
            <a href="#services" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#services" className="hover:text-white transition-colors">Terms of Advisory</a>
            
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="hover:text-white text-creamgreen-300 font-semibold transition-colors flex items-center gap-1.5 text-xs bg-creamgreen-900/40 hover:bg-creamgreen-800/80 px-2.5 py-1 rounded-lg border border-creamgreen-700/50"
              >
                <Lock className="w-3 h-3 text-creamgreen-400" />
                <span>Admin Sign Up / Login</span>
              </button>
            )}

            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-creamgreen-900/60 hover:bg-creamgreen-700 text-creamgreen-300 hover:text-white transition-all flex items-center gap-1.5 border border-creamgreen-700/40"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
              <span className="text-[11px] font-bold">Top</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
