import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Menu, X, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: (serviceSlug?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Commercial Spaces', href: '#services' },
    { name: 'Lease Calculator', href: '#roi-calculator' },
    { name: 'Client Proof (4.9★)', href: '#testimonials' },
    { name: 'Sector 62 Office', href: '#location' },
    { name: '24/7 Hours', href: '#hours' },
  ];

  return (
    <>
      {/* Top Advisory Notice Bar */}
      <div className="bg-gradient-to-r from-creamgreen-50 via-white to-creamgreen-100 border-b border-creamgreen-200/80 text-luxury-espresso text-xs sm:text-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <span className="inline-flex items-center gap-1.5 font-medium text-luxury-charcoal">
              <span className="w-2 h-2 rounded-full bg-creamgreen-500 animate-pulse"></span>
              <strong className="text-luxury-obsidian">Open 24 Hours:</strong> Consultations &amp; Site Visits Mon-Sun
            </span>
            <span className="hidden md:inline-block text-creamgreen-400">•</span>
            <span className="hidden md:inline-flex items-center gap-1 text-luxury-muted">
              <MapPin className="w-3.5 h-3.5 text-creamgreen-600" />
              Pioneer Urban Square, Sector 62, Gurugram
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 font-medium">
            <a 
              href="tel:+919810653905" 
              className="inline-flex items-center gap-1.5 text-luxury-obsidian hover:text-creamgreen-700 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-creamgreen-600" />
              <span className="font-semibold">+91 98106 53905</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Glass Navbar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-luxury border-b border-creamgreen-200/80 py-3'
            : 'bg-white/85 backdrop-blur-sm py-4 border-b border-creamgreen-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-creamgreen-600 to-creamgreen-900 p-0.5 shadow-sm group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-creamgreen-50 rounded-[10px] flex items-center justify-center border border-creamgreen-200">
                  <span className="font-heading font-extrabold text-creamgreen-900 text-lg tracking-tight">
                    A3S
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-lg sm:text-xl text-luxury-obsidian tracking-tight leading-none group-hover:text-creamgreen-700 transition-colors">
                  A3S LANDBASE
                </span>
                <span className="text-[10px] sm:text-xs tracking-wider uppercase font-semibold text-creamgreen-700">
                  Commercial Properties • Gurugram
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-luxury-espresso hover:text-creamgreen-700 transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-creamgreen-500 hover:after:w-full after:transition-all"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Right Action Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              <a
                href="tel:+919810653905"
                className="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-luxury-charcoal bg-white hover:bg-creamgreen-50 border border-creamgreen-300 shadow-sm transition-all flex items-center gap-2"
                title="Direct Corporate Hotline"
              >
                <Phone className="w-4 h-4 text-creamgreen-600" />
                <span>Call Hotline</span>
              </a>

              <button
                onClick={() => onOpenBooking()}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-creamgreen-600 via-creamgreen-700 to-creamgreen-800 hover:from-creamgreen-700 hover:to-creamgreen-900 shadow-md hover:shadow-luxury hover:-translate-y-0.5 transition-all flex items-center gap-2 border border-creamgreen-700"
              >
                <span>Book Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                onClick={() => onOpenBooking()}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-creamgreen-700"
              >
                Book
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-luxury-charcoal bg-white border border-creamgreen-300"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/98 border-t border-creamgreen-200 px-4 pt-3 pb-6 shadow-xl space-y-3 animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col space-y-2.5">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-luxury-charcoal hover:bg-creamgreen-50 rounded-lg transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="pt-3 border-t border-creamgreen-200 space-y-2">
              <a
                href="tel:+919810653905"
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl bg-white border border-creamgreen-300 text-luxury-charcoal"
              >
                <Phone className="w-4 h-4 text-creamgreen-600" />
                Call +91 98106 53905
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-3 text-sm font-bold rounded-xl bg-gradient-to-r from-creamgreen-600 to-creamgreen-800 text-white shadow-sm flex items-center justify-center gap-2"
              >
                Schedule Site Visit Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
