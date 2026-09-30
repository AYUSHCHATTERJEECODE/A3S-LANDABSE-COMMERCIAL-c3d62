import React from 'react';
import { Star, ShieldCheck, CheckCircle } from 'lucide-react';
import type { Review } from '../types/database';

interface TestimonialsSectionProps {
  reviews: Review[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ reviews }) => {
  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-cream-50 via-creamgreen-50/20 to-cream-50 relative border-t border-creamgreen-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Google Social Proof Badge */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-white text-luxury-obsidian px-4 py-2 rounded-full text-xs font-bold border border-creamgreen-300 shadow-sm mb-3">
            <span className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </span>
            <span className="text-luxury-obsidian font-extrabold">4.9 / 5.0 RATING</span>
            <span className="text-creamgreen-400">•</span>
            <span className="text-creamgreen-800 font-semibold">130+ Verified Google Reviews</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-luxury-obsidian tracking-tight">
            Trusted by Gurugram's Top Enterprises &amp; HNI Investors
          </h2>
          <p className="mt-3 text-base text-luxury-muted">
            Read firsthand accounts from Managing Directors, Founders, and Corporate Workplace Heads who 
            secured Grade-A office spaces and commercial land parcels through A3S Landbase.
          </p>

          {/* Social Proof Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 max-w-3xl mx-auto">
            <div className="p-3.5 bg-white rounded-2xl border border-creamgreen-200 shadow-sm">
              <div className="font-heading font-extrabold text-2xl text-luxury-obsidian">4.9 ★</div>
              <div className="text-xs text-luxury-muted">Google Average</div>
            </div>
            <div className="p-3.5 bg-white rounded-2xl border border-creamgreen-200 shadow-sm">
              <div className="font-heading font-extrabold text-2xl text-luxury-obsidian">130+</div>
              <div className="text-xs text-luxury-muted">Verified Reviews</div>
            </div>
            <div className="p-3.5 bg-white rounded-2xl border border-creamgreen-200 shadow-sm">
              <div className="font-heading font-extrabold text-2xl text-creamgreen-700">100%</div>
              <div className="text-xs text-luxury-muted">Dispute-Free Leases</div>
            </div>
            <div className="p-3.5 bg-white rounded-2xl border border-creamgreen-200 shadow-sm">
              <div className="font-heading font-extrabold text-2xl text-creamgreen-900">24/7</div>
              <div className="text-xs text-luxury-muted">Advisory Support</div>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, idx) => (
            <div
              key={review.id || idx}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-creamgreen-200 shadow-card-soft hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Rating and Source Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(review.rating) ? 'fill-current' : 'fill-amber-200 text-amber-200'
                        }`}
                      />
                    ))}
                    <span className="ml-1.5 text-xs font-bold text-luxury-obsidian">{review.rating.toFixed(1)}</span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-creamgreen-900 bg-creamgreen-50 px-2 py-0.5 rounded-full border border-creamgreen-200">
                    <CheckCircle className="w-3 h-3 text-creamgreen-700" />
                    <span>{review.source}</span>
                  </span>
                </div>

                {/* Feedback Comment */}
                <p className="text-xs sm:text-sm text-luxury-charcoal leading-relaxed relative italic">
                  "{review.comment}"
                </p>
              </div>

              {/* Author Details */}
              <div className="mt-6 pt-4 border-t border-creamgreen-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-creamgreen-200 to-creamgreen-100 text-creamgreen-950 flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm border border-creamgreen-300">
                  {review.author_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <h4 className="font-heading font-bold text-xs sm:text-sm text-luxury-obsidian truncate">
                    {review.author_name}
                  </h4>
                  <p className="text-[11px] text-luxury-muted truncate">
                    {review.company_designation || 'Corporate Occupier, Gurugram'}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom Google CTA Box */}
        <div className="mt-12 text-center bg-white rounded-2xl p-6 border border-creamgreen-300 max-w-xl mx-auto shadow-sm">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-luxury-obsidian">
            <ShieldCheck className="w-4 h-4 text-creamgreen-700" />
            <span>All reviews indexed from actual tenant and investor engagements</span>
          </div>
          <p className="text-xs text-luxury-muted mt-1">
            Want to share your corporate leasing experience with A3S Landbase?
          </p>
          <div className="mt-3">
            <a
              href="https://maps.google.com/?q=Pioneer+Urban+Square+C-208+Sector+62+Gurugram+Ghata+Haryana+122098"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-creamgreen-800 hover:text-creamgreen-950 underline"
            >
              <span>View or Post on Google Maps Profile</span>
              <span>→</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
