import React, { useState } from 'react';
import { Building2, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import type { Service } from '../types/database';

interface ServicesSectionProps {
  services: Service[];
  onSelectService: (serviceSlug: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ services, onSelectService }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'office' | 'building' | 'land'>('all');

  const filteredServices = services.filter((service) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'office') return service.slug.includes('office');
    if (selectedFilter === 'building') return service.slug.includes('building');
    if (selectedFilter === 'land') return service.slug.includes('land');
    return true;
  });

  return (
    <section id="services" className="py-20 bg-cream-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-creamgreen-100 text-creamgreen-900 px-3.5 py-1.5 rounded-full text-xs font-bold border border-creamgreen-300 mb-3">
            <Building2 className="w-3.5 h-3.5 text-creamgreen-700" />
            <span>PORTFOLIO &amp; COMMERCIAL CAPABILITIES</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-luxury-obsidian tracking-tight">
            Tailored Commercial Real Estate Solutions
          </h2>
          <p className="mt-3 text-base text-luxury-muted leading-relaxed">
            From managed corporate headquarters in Sector 62 to retail building rentals and institutional land parcels 
            across Gurugram, we deliver transparent, dispute-free commercial transactions.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedFilter === 'all'
                  ? 'bg-creamgreen-700 text-white shadow-sm border border-creamgreen-800 font-bold'
                  : 'bg-white text-luxury-charcoal hover:bg-creamgreen-50 border border-creamgreen-200'
              }`}
            >
              All Offerings ({services.length})
            </button>
            <button
              onClick={() => setSelectedFilter('office')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedFilter === 'office'
                  ? 'bg-creamgreen-700 text-white shadow-sm border border-creamgreen-800 font-bold'
                  : 'bg-white text-luxury-charcoal hover:bg-creamgreen-50 border border-creamgreen-200'
              }`}
            >
              Commercial Office Leasing
            </button>
            <button
              onClick={() => setSelectedFilter('building')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedFilter === 'building'
                  ? 'bg-creamgreen-700 text-white shadow-sm border border-creamgreen-800 font-bold'
                  : 'bg-white text-luxury-charcoal hover:bg-creamgreen-50 border border-creamgreen-200'
              }`}
            >
              Building &amp; Retail Rentals
            </button>
            <button
              onClick={() => setSelectedFilter('land')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedFilter === 'land'
                  ? 'bg-creamgreen-700 text-white shadow-sm border border-creamgreen-800 font-bold'
                  : 'bg-white text-luxury-charcoal hover:bg-creamgreen-50 border border-creamgreen-200'
              }`}
            >
              Land Acquisition &amp; Advisory
            </button>
          </div>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service, index) => {
            const isFeatured = service.slug === 'commercial-office-leasing';

            return (
              <div
                key={service.id || index}
                className={`flex flex-col rounded-3xl overflow-hidden bg-white border transition-all duration-300 hover:shadow-luxury-hover hover:-translate-y-1.5 ${
                  isFeatured
                    ? 'border-2 border-creamgreen-400 shadow-luxury relative'
                    : 'border-creamgreen-200/90 shadow-card-soft'
                }`}
              >
                {/* Visual Header with Image */}
                <div className="relative h-52 overflow-hidden bg-creamgreen-50">
                  <img
                    src={service.image || '/hero_tower.jpg'}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-obsidian/75 via-transparent to-black/20" />

                  {/* Top Badge */}
                  {service.badge && (
                    <div className="absolute top-4 left-4 bg-creamgreen-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-sm border border-creamgreen-500">
                      {service.badge}
                    </div>
                  )}

                  {/* Sq Ft Range Badge */}
                  {service.sqft_range && (
                    <div className="absolute bottom-3 left-4 bg-white/95 backdrop-blur-sm text-luxury-charcoal text-xs font-bold px-3 py-1 rounded-lg border border-creamgreen-200">
                      📐 {service.sqft_range}
                    </div>
                  )}
                </div>

                {/* Card Content Body */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-6">
                  <div>
                    <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-luxury-obsidian leading-snug">
                      {service.name}
                    </h3>
                    <p className="mt-2.5 text-sm text-luxury-warmgray leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features Checklist */}
                    <div className="mt-6 pt-5 border-t border-creamgreen-100 space-y-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-creamgreen-800 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-creamgreen-600" />
                        Key Deliverables &amp; Guarantees:
                      </div>

                      <ul className="space-y-2.5">
                        {service.features?.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-luxury-charcoal">
                            <CheckCircle2 className="w-4 h-4 text-creamgreen-600 flex-shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card Bottom Pricing & Action */}
                  <div className="pt-6 border-t border-creamgreen-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-semibold text-luxury-muted block">Advisory Fee Structure</span>
                        <div className="font-heading font-extrabold text-base sm:text-lg text-luxury-obsidian">
                          {service.price_type === 'free_consultation' ? (
                            <span className="text-creamgreen-700">₹0 Initial Consultation</span>
                          ) : (
                            <span>Custom Lease Quote</span>
                          )}
                        </div>
                      </div>

                      <span className="text-[11px] font-medium text-creamgreen-800 bg-creamgreen-50 px-2.5 py-1 rounded-md border border-creamgreen-200">
                        ⏱ {service.duration_minutes} min advisory
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectService(service.slug)}
                      className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                        isFeatured
                          ? 'bg-gradient-to-r from-creamgreen-600 via-creamgreen-700 to-creamgreen-800 hover:from-creamgreen-700 hover:to-creamgreen-900 text-white shadow-md hover:shadow-lg'
                          : 'bg-creamgreen-50 hover:bg-creamgreen-100 text-creamgreen-900 border border-creamgreen-300'
                      }`}
                    >
                      <span>Book Consultation For This</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* Informative Assurance Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-creamgreen-50 via-white to-creamgreen-100 border border-creamgreen-300 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-creamgreen-300 flex items-center justify-center text-creamgreen-700 shadow-sm flex-shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-base sm:text-lg text-luxury-obsidian">
                Transparent Advisory &amp; RERA / DTCP Certified Verification
              </h4>
              <p className="text-xs sm:text-sm text-luxury-warmgray mt-0.5">
                Every commercial space in our portfolio is pre-vetted for encumbrances, sanctioned building plans, fire NOCs, and municipal clearances.
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/919810653905?text=Hello%20A3S%20Landbase,%20I%20would%20like%20to%20inquire%20about%20commercial%20space%20availability%20in%20Sector%2062%20Gurugram."
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-white hover:bg-creamgreen-50 text-creamgreen-950 font-bold text-xs sm:text-sm border border-creamgreen-300 shadow-sm whitespace-nowrap flex items-center gap-2"
          >
            <span>Inquire on WhatsApp</span>
            <ArrowRight className="w-4 h-4 text-creamgreen-700" />
          </a>
        </div>

      </div>
    </section>
  );
};
