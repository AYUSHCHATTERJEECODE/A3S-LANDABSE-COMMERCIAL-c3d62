import React, { useState } from 'react';
import { Calculator, Users, Building, Coins, ArrowRight, Sparkles } from 'lucide-react';

interface RoiCalculatorProps {
  onScheduleWithRequirement: (sqft: number, estimatedRent: number, fitout: string) => void;
}

export const RoiCalculatorSection: React.FC<RoiCalculatorProps> = ({ onScheduleWithRequirement }) => {
  const [areaSqFt, setAreaSqFt] = useState<number>(5500);
  const [ratePerSqFt, setRatePerSqFt] = useState<number>(95);
  const [fitoutType, setFitoutType] = useState<'bare' | 'warm' | 'furnished'>('furnished');

  // Calculations
  const fitoutMultiplier = fitoutType === 'bare' ? 0 : fitoutType === 'warm' ? 18 : 35; // additional amortized fitout or maintenance/sqft
  const effectiveRate = ratePerSqFt + fitoutMultiplier;
  const monthlyRent = areaSqFt * effectiveRate;
  const annualOutlay = monthlyRent * 12;
  const estimatedWorkstations = Math.round(areaSqFt / 75); // Standard corporate planning 75 sqft per person
  const estimatedSavings = Math.round(monthlyRent * 0.15); // A3S Landbase pre-negotiated lock-in advisory savings

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleApplyToBooking = () => {
    onScheduleWithRequirement(areaSqFt, monthlyRent, fitoutType);
  };

  return (
    <section id="roi-calculator" className="py-20 bg-gradient-to-b from-cream-50 via-creamgreen-50/30 to-cream-50 border-y border-creamgreen-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-white text-creamgreen-900 px-3.5 py-1.5 rounded-full text-xs font-bold border border-creamgreen-300 shadow-sm mb-3">
            <Calculator className="w-3.5 h-3.5 text-creamgreen-700" />
            <span>INTERACTIVE COMMERCIAL ESTIMATOR</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-luxury-obsidian tracking-tight">
            Commercial Lease Budget &amp; Space Planning Calculator
          </h2>
          <p className="mt-3 text-base text-luxury-muted">
            Model your corporate expansion in Gurugram Sector 62 or Golf Course Ext Road. 
            Estimate seating capacity, monthly commitment, and advisory savings in real-time.
          </p>
        </div>

        {/* Calculator Interactive Box */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-creamgreen-300 shadow-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Controls Column */}
            <div className="lg:col-span-7 space-y-7">
              
              {/* Slider 1: Area (Sq. Ft.) */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-luxury-obsidian flex items-center gap-2">
                    <Building className="w-4 h-4 text-creamgreen-600" />
                    <span>Office / Retail Area (Sq. Ft.)</span>
                  </label>
                  <span className="font-heading font-extrabold text-lg text-creamgreen-900 bg-creamgreen-100 px-3 py-1 rounded-lg border border-creamgreen-300">
                    {areaSqFt.toLocaleString('en-IN')} sq. ft.
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="50000"
                  step="500"
                  value={areaSqFt}
                  onChange={(e) => setAreaSqFt(Number(e.target.value))}
                  className="w-full h-2.5 bg-creamgreen-100 rounded-lg appearance-none cursor-pointer accent-creamgreen-600"
                />
                <div className="flex justify-between text-[11px] text-luxury-muted mt-1">
                  <span>1,000 sq ft (Boutique)</span>
                  <span>15,000 sq ft</span>
                  <span>50,000+ sq ft (Headquarters)</span>
                </div>
              </div>

              {/* Slider 2: Rate per Sq. Ft. */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-luxury-obsidian flex items-center gap-2">
                    <Coins className="w-4 h-4 text-creamgreen-600" />
                    <span>Base Rental Rate (₹ / Sq. Ft. / Month)</span>
                  </label>
                  <span className="font-heading font-extrabold text-lg text-creamgreen-900 bg-creamgreen-100 px-3 py-1 rounded-lg border border-creamgreen-300">
                    ₹{ratePerSqFt} / sq. ft.
                  </span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="220"
                  step="5"
                  value={ratePerSqFt}
                  onChange={(e) => setRatePerSqFt(Number(e.target.value))}
                  className="w-full h-2.5 bg-creamgreen-100 rounded-lg appearance-none cursor-pointer accent-creamgreen-600"
                />
                <div className="flex justify-between text-[11px] text-luxury-muted mt-1">
                  <span>₹60 (Value / Warehousing)</span>
                  <span>₹120 (Grade-A Sector 62)</span>
                  <span>₹220 (Cyber City Trophy)</span>
                </div>
              </div>

              {/* Fitout Type Selector */}
              <div>
                <label className="text-sm font-bold text-luxury-obsidian block mb-2">
                  Space Condition &amp; Fit-out Level
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setFitoutType('bare')}
                    className={`p-3 rounded-xl text-xs font-bold border transition-all text-center ${
                      fitoutType === 'bare'
                        ? 'bg-creamgreen-700 border-creamgreen-800 text-white shadow-sm'
                        : 'bg-creamgreen-50 border-creamgreen-200 text-luxury-charcoal hover:bg-creamgreen-100'
                    }`}
                  >
                    <div>Bare Shell</div>
                    <div className={`text-[10px] font-normal mt-0.5 ${fitoutType === 'bare' ? 'text-creamgreen-100' : 'text-luxury-muted'}`}>Civil Structure</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFitoutType('warm')}
                    className={`p-3 rounded-xl text-xs font-bold border transition-all text-center ${
                      fitoutType === 'warm'
                        ? 'bg-creamgreen-700 border-creamgreen-800 text-white shadow-sm'
                        : 'bg-creamgreen-50 border-creamgreen-200 text-luxury-charcoal hover:bg-creamgreen-100'
                    }`}
                  >
                    <div>Warm Shell</div>
                    <div className={`text-[10px] font-normal mt-0.5 ${fitoutType === 'warm' ? 'text-creamgreen-100' : 'text-luxury-muted'}`}>HVAC + Flooring</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFitoutType('furnished')}
                    className={`p-3 rounded-xl text-xs font-bold border transition-all text-center ${
                      fitoutType === 'furnished'
                        ? 'bg-creamgreen-700 border-creamgreen-800 text-white shadow-sm'
                        : 'bg-creamgreen-50 border-creamgreen-200 text-luxury-charcoal hover:bg-creamgreen-100'
                    }`}
                  >
                    <div>Furnished (IT Grade)</div>
                    <div className={`text-[10px] font-normal mt-0.5 ${fitoutType === 'furnished' ? 'text-creamgreen-100' : 'text-luxury-muted'}`}>Workstations + Conf</div>
                  </button>
                </div>
              </div>

            </div>

            {/* Right Summary Output Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-creamgreen-50 via-white to-creamgreen-100/60 p-6 sm:p-7 rounded-2xl border-2 border-creamgreen-300 shadow-md space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-creamgreen-200">
                <span className="text-xs font-bold uppercase tracking-wider text-creamgreen-800">
                  Estimated Financials
                </span>
                <span className="text-[11px] font-semibold bg-creamgreen-100 text-creamgreen-900 px-2.5 py-0.5 rounded-full border border-creamgreen-200">
                  Gurugram Benchmark
                </span>
              </div>

              {/* Monthly Estimate */}
              <div>
                <span className="text-xs text-luxury-muted block">Estimated Monthly Outlay</span>
                <div className="font-heading font-extrabold text-2xl sm:text-3xl text-luxury-obsidian text-glow">
                  {formatINR(monthlyRent)}
                  <span className="text-xs font-normal text-luxury-muted"> / month</span>
                </div>
              </div>

              {/* Key Metric Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-white p-3 rounded-xl border border-creamgreen-200">
                  <div className="text-xs text-luxury-muted flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-creamgreen-700" />
                    <span>Seating Capacity</span>
                  </div>
                  <div className="font-heading font-extrabold text-lg text-luxury-obsidian mt-0.5">
                    ~{estimatedWorkstations} seats
                  </div>
                  <div className="text-[10px] text-luxury-muted">75 sq.ft / desk</div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-creamgreen-200">
                  <div className="text-xs text-luxury-muted flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-creamgreen-600" />
                    <span>Advisory Savings</span>
                  </div>
                  <div className="font-heading font-extrabold text-lg text-creamgreen-700 mt-0.5">
                    {formatINR(estimatedSavings)}
                  </div>
                  <div className="text-[10px] text-creamgreen-600">via lock-in advisory</div>
                </div>
              </div>

              {/* Annualized commitment note */}
              <div className="text-[11px] text-luxury-muted bg-white/80 p-2.5 rounded-lg border border-creamgreen-200">
                Annual lease commitment: <strong>{formatINR(annualOutlay)}</strong>. Lock-in terms typically structured between 3 to 9 years.
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleApplyToBooking}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-creamgreen-600 via-creamgreen-700 to-creamgreen-800 hover:from-creamgreen-700 hover:to-creamgreen-900 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 border border-creamgreen-700"
              >
                <span>Book Site Visit For This Space</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
