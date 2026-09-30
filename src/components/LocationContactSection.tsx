import React from 'react';
import { MapPin, Phone, Clock, MessageSquare, ExternalLink, Navigation, Compass, Building2 } from 'lucide-react';
import type { BusinessHour } from '../types/database';

interface LocationContactProps {
  businessHours: BusinessHour[];
  onBookConsultation: () => void;
}

export const LocationContactSection: React.FC<LocationContactProps> = ({ businessHours, onBookConsultation }) => {
  const phoneFormatted = "+91 98106 53905";
  const phoneRaw = "+919810653905";

  return (
    <section id="location" className="py-20 bg-cream-50 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-creamgreen-100 text-creamgreen-900 px-3.5 py-1.5 rounded-full text-xs font-bold border border-creamgreen-300 mb-3">
            <span className="w-2 h-2 rounded-full bg-creamgreen-500 animate-pulse"></span>
            <span>OPEN 24 HOURS / 7 DAYS A WEEK</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-luxury-obsidian tracking-tight">
            Corporate Office &amp; Site Visit Coordination
          </h2>
          <p className="mt-3 text-base text-luxury-muted">
            Strategically located at Pioneer Urban Square in the heart of Sector 62 Gurugram, 
            directly accessible via Golf Course Extension Road.
          </p>
        </div>

        {/* 3 Contact Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Card 1: Direct Hotline */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-creamgreen-200 shadow-card-soft hover:shadow-luxury transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-creamgreen-100 text-luxury-obsidian flex items-center justify-center border border-creamgreen-300 shadow-sm">
                <Phone className="w-6 h-6 text-creamgreen-700" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-creamgreen-800">
                  Direct Advisory Line
                </span>
                <h3 className="font-heading font-extrabold text-xl text-luxury-obsidian mt-1">
                  {phoneFormatted}
                </h3>
                <p className="text-xs text-luxury-muted mt-1">
                  Connect immediately with a Senior Commercial Advisor for verified office availability.
                </p>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-creamgreen-100">
              <a
                href={`tel:${phoneRaw}`}
                className="w-full py-3 rounded-xl bg-creamgreen-700 hover:bg-creamgreen-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors border border-creamgreen-800 shadow-sm"
              >
                <Phone className="w-4 h-4" />
                <span>Call Hotline Now</span>
              </a>
            </div>
          </div>

          {/* Card 2: WhatsApp Corporate Desk */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-creamgreen-200 shadow-card-soft hover:shadow-luxury transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-creamgreen-100 text-creamgreen-800 flex items-center justify-center border border-creamgreen-300 shadow-sm">
                <MessageSquare className="w-6 h-6 text-creamgreen-700" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-creamgreen-800">
                  Instant Messaging Desk
                </span>
                <h3 className="font-heading font-extrabold text-xl text-luxury-obsidian mt-1">
                  WhatsApp Support
                </h3>
                <p className="text-xs text-luxury-muted mt-1">
                  Request property brochures, layout floorplans, or rent comparables via instant WhatsApp.
                </p>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-creamgreen-100">
              <a
                href="https://wa.me/919810653905?text=Hello%20A3S%20Landbase,%20I%20am%20looking%20for%20commercial%20property%20options%20in%20Gurugram."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-creamgreen-700 hover:bg-creamgreen-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Card 3: Sector 62 Office */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-creamgreen-200 shadow-card-soft hover:shadow-luxury transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-creamgreen-100 text-luxury-obsidian flex items-center justify-center border border-creamgreen-300 shadow-sm">
                <Building2 className="w-6 h-6 text-creamgreen-700" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-creamgreen-800">
                  Head Office Location
                </span>
                <h3 className="font-heading font-extrabold text-lg text-luxury-obsidian mt-1">
                  Pioneer Urban Square
                </h3>
                <p className="text-xs text-luxury-muted mt-1">
                  Second Floor, C-208, Sector 62, Gurugram, Ghata, Haryana 122098, India.
                </p>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-creamgreen-100">
              <button
                onClick={onBookConsultation}
                className="w-full py-3 rounded-xl bg-creamgreen-50 hover:bg-creamgreen-100 text-creamgreen-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors border border-creamgreen-300"
              >
                <span>Schedule In-Person Visit</span>
              </button>
            </div>
          </div>

        </div>

        {/* Map and Hours Detailed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Embedded Google Maps Container */}
          <div className="lg:col-span-7 bg-white rounded-3xl overflow-hidden border border-creamgreen-200 shadow-luxury">
            <div className="p-4 sm:p-5 bg-gradient-to-r from-creamgreen-50 to-white border-b border-creamgreen-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-luxury-obsidian">
                  <MapPin className="w-4 h-4 text-creamgreen-700" />
                  <span>Sector 62 Gurugram Commercial Hub</span>
                </div>
                <div className="text-xs text-luxury-muted mt-0.5">
                  Second Floor, Pioneer Urban Square, C-208, Sector 62
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=Pioneer+Urban+Square+Sector+62+Gurugram+Ghata+Haryana+122098"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-creamgreen-300 text-xs font-bold text-luxury-obsidian hover:bg-creamgreen-50 transition-colors shadow-sm self-start sm:self-auto"
              >
                <Navigation className="w-3.5 h-3.5 text-creamgreen-700" />
                <span>Get Directions</span>
                <ExternalLink className="w-3 h-3 text-luxury-muted" />
              </a>
            </div>

            {/* Embedded Google Map */}
            <div className="h-[360px] w-full bg-creamgreen-50 relative">
              <iframe
                title="A3S Landbase Pioneer Urban Square Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3509.432658820468!2d77.1026362!3d28.406249!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d226a31c513ab%3A0xc32c9ce224a17937!2sPioneer%20Urban%20Square!5e0!3m2!1sen!2sin!4v1711800000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              ></iframe>
            </div>

            {/* Landmark Distance Bar */}
            <div className="p-4 sm:p-5 bg-white border-t border-creamgreen-100">
              <div className="text-xs font-bold uppercase tracking-wider text-creamgreen-900 mb-2 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-creamgreen-700" />
                <span>Key Connectivity Benchmarks from Office:</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-2.5 rounded-xl bg-creamgreen-50 border border-creamgreen-200">
                  <div className="font-heading font-bold text-sm text-luxury-obsidian">5 Mins</div>
                  <div className="text-[10px] text-luxury-muted">Sector 55-56 Metro</div>
                </div>
                <div className="p-2.5 rounded-xl bg-creamgreen-50 border border-creamgreen-200">
                  <div className="font-heading font-bold text-sm text-luxury-obsidian">0 Mins</div>
                  <div className="text-[10px] text-luxury-muted">Golf Course Ext. Rd</div>
                </div>
                <div className="p-2.5 rounded-xl bg-creamgreen-50 border border-creamgreen-200">
                  <div className="font-heading font-bold text-sm text-luxury-obsidian">15 Mins</div>
                  <div className="text-[10px] text-luxury-muted">Cyber City / DLF</div>
                </div>
                <div className="p-2.5 rounded-xl bg-creamgreen-50 border border-creamgreen-200">
                  <div className="font-heading font-bold text-sm text-luxury-obsidian">30 Mins</div>
                  <div className="text-[10px] text-luxury-muted">Delhi IGI Airport</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right: 24/7 Hours & Operational Schedule Table */}
          <div id="hours" className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-creamgreen-200 shadow-luxury space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-creamgreen-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-creamgreen-800">
                  Operating Schedule
                </span>
                <h3 className="font-heading font-extrabold text-xl text-luxury-obsidian mt-0.5">
                  Business Hours
                </h3>
              </div>

              <div className="inline-flex items-center gap-1.5 bg-creamgreen-50 text-creamgreen-900 border border-creamgreen-300 px-3 py-1 rounded-full text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-creamgreen-500 animate-pulse"></span>
                <span>Open 24 Hours</span>
              </div>
            </div>

            <p className="text-xs text-luxury-warmgray leading-relaxed">
              Commercial real estate decisions often require flexible corporate schedules. 
              Our senior advisory team is on-call 24 hours a day, 7 days a week, including weekend site inspections.
            </p>

            {/* Hours List */}
            <div className="space-y-2 pt-1">
              {businessHours.map((day, dIdx) => (
                <div
                  key={dIdx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-creamgreen-50/50 border border-creamgreen-100 text-xs"
                >
                  <span className="font-bold text-luxury-obsidian">{day.day_of_week}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-creamgreen-900 bg-creamgreen-100 px-2 py-0.5 rounded border border-creamgreen-200">
                      Open 24 Hours
                    </span>
                    <span className="text-[10px] text-luxury-muted hidden sm:inline">
                      {day.day_of_week === 'Saturday' || day.day_of_week === 'Sunday' ? 'Site Visits' : 'On-Call & Advisory'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Consultation CTA */}
            <div className="pt-2">
              <button
                onClick={onBookConsultation}
                className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-creamgreen-600 via-creamgreen-700 to-creamgreen-800 hover:from-creamgreen-700 hover:to-creamgreen-900 shadow-md transition-all text-xs sm:text-sm flex items-center justify-center gap-2 border border-creamgreen-700"
              >
                <Clock className="w-4 h-4 text-white" />
                <span>Reserve a Consultation Slot</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
