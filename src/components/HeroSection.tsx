import React from 'react';
import { Star, ShieldCheck, Phone, Calendar, ArrowRight, Building, Award, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onScheduleClick: (serviceSlug?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onScheduleClick }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-cream-50 via-creamgreen-50/40 to-cream-50 border-b border-creamgreen-200/70">
      {/* Ambient Creamy Green Glow Background Elements */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[750px] h-[380px] bg-creamgreen-200/35 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-40 right-[-10%] w-[420px] h-[420px] bg-creamgreen-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Trust Pill & Google Review Badge */}
            <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2.5 bg-white/95 border border-creamgreen-300 px-4 py-2 rounded-full shadow-sm">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-xs font-bold text-luxury-obsidian tracking-tight">
                4.9 ★ (130+ Google Verified Reviews)
              </span>
              <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-creamgreen-400"></span>
              <span className="text-xs font-semibold text-creamgreen-800">
                Gurugram Sector 62 &amp; Golf Course Ext. Rd
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-5xl tracking-tight text-luxury-obsidian leading-[1.15]">
              Prime Commercial Real Estate{' '}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-creamgreen-700 via-creamgreen-600 to-creamgreen-800">
                  in Gurugram
                </span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-creamgreen-200/70 -z-0 rounded-sm"></span>
              </span>{' '}
              Leasing &amp; Advisory.
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-luxury-warmgray max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Specialized advisory for Grade-A corporate office leasing (1,000 to 50,000+ sq. ft.), 
              commercial building rentals, and high-yield commercial land acquisition. Zero brokerage disputes, 
              100% verified titles, and seamless turnkey execution.
            </p>

            {/* Quick Action Badges Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 pb-1 max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-creamgreen-200 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-creamgreen-100 flex items-center justify-center text-creamgreen-700 flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-luxury-obsidian">₹0 Initial Advisory</div>
                  <div className="text-[11px] text-creamgreen-800">Free Consultation</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-creamgreen-200 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-creamgreen-100 flex items-center justify-center text-creamgreen-700 flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-luxury-obsidian">24/7 Availability</div>
                  <div className="text-[11px] text-creamgreen-800">Mon–Sun Support</div>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-creamgreen-200 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-creamgreen-100 flex items-center justify-center text-creamgreen-700 flex-shrink-0">
                  <Building className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-luxury-obsidian">1,000–50k+ Sq Ft</div>
                  <div className="text-[11px] text-creamgreen-800">Grade-A Inventory</div>
                </div>
              </div>
            </div>

            {/* Primary & Secondary Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onScheduleClick()}
                className="w-full sm:w-auto px-7 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-creamgreen-600 via-creamgreen-700 to-creamgreen-800 hover:from-creamgreen-700 hover:to-creamgreen-900 shadow-lg hover:shadow-luxury hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 border border-creamgreen-700"
              >
                <Calendar className="w-5 h-5 text-white" />
                <span>Schedule Site Visit</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="tel:+919810653905"
                className="w-full sm:w-auto px-6 py-4 rounded-xl text-base font-bold text-luxury-charcoal bg-white hover:bg-creamgreen-50 border-2 border-creamgreen-300 shadow-sm hover:shadow transition-all flex items-center justify-center gap-2.5"
              >
                <Phone className="w-5 h-5 text-creamgreen-700" />
                <span>Call Hotline: +91 98106 53905</span>
              </a>
            </div>

            {/* Quick Micro-Review / Proof note */}
            <div className="flex items-center justify-center lg:justify-start gap-3 pt-3 text-xs text-luxury-muted">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-creamgreen-200 border-2 border-white flex items-center justify-center font-bold text-[10px] text-creamgreen-900">VS</div>
                <div className="w-7 h-7 rounded-full bg-creamgreen-300 border-2 border-white flex items-center justify-center font-bold text-[10px] text-creamgreen-900">AK</div>
                <div className="w-7 h-7 rounded-full bg-creamgreen-100 border-2 border-white flex items-center justify-center font-bold text-[10px] text-creamgreen-900">RM</div>
              </div>
              <span>Trusted by 130+ Corporate Founders &amp; Fund Managers in Gurugram</span>
            </div>

          </div>

          {/* Right Column: Architectural Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer decorative glow frame */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-creamgreen-300 via-creamgreen-200 to-creamgreen-100 rounded-3xl blur-lg opacity-75"></div>
              
              {/* Main Image Container */}
              <div className="relative rounded-2xl overflow-hidden bg-white border-2 border-creamgreen-200 shadow-2xl">
                <img
                  src="/hero_tower.jpg"
                  alt="A3S Landbase Commercial Corporate Tower Gurugram"
                  className="w-full h-[400px] sm:h-[460px] object-cover hover:scale-105 transition-transform duration-700"
                />

                {/* Gradient Overlay for card legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-obsidian/85 via-transparent to-black/20 pointer-events-none" />

                {/* Top Badge: Featured Location */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-creamgreen-300 shadow-sm flex items-center gap-1.5 text-xs font-bold text-luxury-charcoal">
                  <span className="w-2 h-2 rounded-full bg-creamgreen-500 animate-pulse"></span>
                  <span>Pioneer Urban Square • Sector 62</span>
                </div>

                {/* Bottom Floating Stats Overlay Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-creamgreen-200 shadow-lg text-luxury-charcoal space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-creamgreen-800">
                        Prime Corporate Inventory
                      </span>
                      <h3 className="font-heading font-bold text-sm sm:text-base text-luxury-obsidian">
                        Golf Course Ext. Road &amp; Cyber City
                      </h3>
                    </div>
                    <span className="bg-creamgreen-100 text-creamgreen-900 font-extrabold text-xs px-2.5 py-1 rounded-md border border-creamgreen-300">
                      Grade-A
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-creamgreen-100 text-center">
                    <div>
                      <div className="text-xs font-extrabold text-luxury-obsidian">50,000+</div>
                      <div className="text-[10px] text-luxury-muted">Sq. Ft. Available</div>
                    </div>
                    <div className="border-x border-creamgreen-100">
                      <div className="text-xs font-extrabold text-luxury-obsidian">100%</div>
                      <div className="text-[10px] text-luxury-muted">Title Verified</div>
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-luxury-obsidian">24/7</div>
                      <div className="text-[10px] text-luxury-muted">Access &amp; Security</div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Floating Accent Pill */}
              <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-white px-4 py-2.5 rounded-2xl shadow-xl border border-creamgreen-300 flex items-center gap-3 animate-float hidden sm:flex">
                <div className="w-9 h-9 rounded-xl bg-creamgreen-600 flex items-center justify-center font-bold text-white shadow-sm">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-luxury-obsidian">130+ Positive Reviews</div>
                  <div className="text-[10px] text-luxury-muted">Gurugram's Top Commercial Advisory</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
