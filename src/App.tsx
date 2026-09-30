import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
import { RoiCalculatorSection } from './components/RoiCalculatorSection';
import { BookingScheduler } from './components/BookingScheduler';
import { TestimonialsSection } from './components/TestimonialsSection';
import { LocationContactSection } from './components/LocationContactSection';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { AdminPanel } from './components/AdminPanel';
import type { Service, Review, BusinessHour } from './types/database';
import { 
  fetchServices, 
  fetchReviews, 
  INITIAL_BUSINESS_HOURS, 
  INITIAL_SERVICES, 
  INITIAL_REVIEWS 
} from './lib/supabaseClient';

export function App() {
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [businessHours] = useState<BusinessHour[]>(INITIAL_BUSINESS_HOURS);
  const [preselectedServiceSlug, setPreselectedServiceSlug] = useState<string>('commercial-office-leasing');
  const [prefilledNotes, setPrefilledNotes] = useState<string>('');
  
  // Admin Dashboard Modal State
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  useEffect(() => {
    // Load dynamic data from Supabase if configured
    const loadData = async () => {
      try {
        const [servicesData, reviewsData] = await Promise.all([
          fetchServices(),
          fetchReviews(),
        ]);
        if (servicesData && servicesData.length > 0) setServices(servicesData);
        if (reviewsData && reviewsData.length > 0) setReviews(reviewsData);
      } catch (err) {
        console.warn('Initial data fetch fallback to local seed:', err);
      }
    };
    loadData();
  }, []);

  const handleOpenBooking = (serviceSlug?: string) => {
    if (serviceSlug) {
      setPreselectedServiceSlug(serviceSlug);
    }
    const target = document.getElementById('booking-scheduler');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRequirementFromCalculator = (sqft: number, estimatedRent: number, fitout: string) => {
    const note = `Space Requirement: ~${sqft.toLocaleString('en-IN')} sq. ft. | Est. Budget: ₹${estimatedRent.toLocaleString('en-IN')}/month | Fitout: ${fitout.toUpperCase()} | Preferred Corridors: Sector 62 / Golf Course Ext Road.`;
    setPrefilledNotes(note);
    setPreselectedServiceSlug('commercial-office-leasing');
    handleOpenBooking('commercial-office-leasing');
  };

  return (
    <div className="min-h-screen bg-cream-50 text-luxury-charcoal flex flex-col font-sans selection:bg-creamgreen-200 selection:text-creamgreen-950">
      {/* Sticky Header Navbar */}
      <Navbar 
        onOpenBooking={handleOpenBooking} 
      />

      {/* Main Single Page Application Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection 
          onScheduleClick={() => handleOpenBooking()} 
        />

        {/* Commercial Services & Interactive Pricing */}
        <ServicesSection 
          services={services} 
          onSelectService={(slug) => handleOpenBooking(slug)} 
        />

        {/* Commercial Space ROI & Budget Estimator */}
        <RoiCalculatorSection 
          onScheduleWithRequirement={handleRequirementFromCalculator} 
        />

        {/* Interactive Consultation Scheduler (Supabase Integrated) */}
        <BookingScheduler 
          services={services}
          preselectedServiceSlug={preselectedServiceSlug}
          prefilledNotes={prefilledNotes}
        />

        {/* 4.9★ Social Proof & Google Reviews Section */}
        <TestimonialsSection 
          reviews={reviews} 
        />

        {/* Location, Google Map & 24/7 Hours Section */}
        <LocationContactSection 
          businessHours={businessHours} 
          onBookConsultation={() => handleOpenBooking()} 
        />
      </main>

      {/* Footer with Legal, RERA Disclaimer & Back to Top */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Floating Call & WhatsApp Desk */}
      <FloatingActions />

      {/* Secure Admin Dashboard Modal */}
      <AdminPanel 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
      />
    </div>
  );
}

export default App;
