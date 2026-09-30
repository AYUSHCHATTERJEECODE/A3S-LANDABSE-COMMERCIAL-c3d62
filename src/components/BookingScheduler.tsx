import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import confetti from 'canvas-confetti';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  X, 
  ExternalLink,
  Share2,
  AlertCircle,
  Loader2,
  Database,
  KeyRound
} from 'lucide-react';
import type { Service, Appointment } from '../types/database';
import { 
  bookAppointment, 
  getActiveSupabaseConfig, 
  updateSupabaseConfig, 
  resetSupabaseConfig 
} from '../lib/supabaseClient';

const appointmentSchema = z.object({
  client_name: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
  client_email: z.string().email({ message: 'Please enter a valid corporate email address' }),
  client_phone: z.string().min(10, { message: 'Please provide a valid 10-digit phone number' }),
  notes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface BookingSchedulerProps {
  services: Service[];
  preselectedServiceSlug?: string;
  prefilledNotes?: string;
}

const TIME_SLOTS = [
  { time: '10:00 AM', label: 'Morning Slot' },
  { time: '11:30 AM', label: 'Morning Slot' },
  { time: '02:00 PM', label: 'Afternoon Slot' },
  { time: '03:30 PM', label: 'Afternoon Slot' },
  { time: '05:00 PM', label: 'Evening Slot' },
  { time: '06:30 PM', label: 'Evening Slot' },
  { time: '08:00 PM', label: 'Executive Late Slot' },
];

export const BookingScheduler: React.FC<BookingSchedulerProps> = ({ 
  services, 
  preselectedServiceSlug,
  prefilledNotes 
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  
  // Date selection state (default: tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(tomorrow.toISOString().split('T')[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('11:30 AM');

  // Submission States
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);
  const [recordSource, setRecordSource] = useState<'supabase' | 'local_demo'>('supabase');

  // Supabase Configuration Modal State
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [supabaseConfig, setSupabaseConfig] = useState(getActiveSupabaseConfig());
  const [inputUrl, setInputUrl] = useState(supabaseConfig.url);
  const [inputKey, setInputKey] = useState(supabaseConfig.key);
  const [configSavedToast, setConfigSavedToast] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      client_name: '',
      client_email: '',
      client_phone: '',
      notes: '',
    },
  });

  // Pre-fill notes or service if passed from parent
  useEffect(() => {
    if (preselectedServiceSlug && services.length > 0) {
      const match = services.find((s) => s.slug === preselectedServiceSlug);
      if (match) {
        setSelectedServiceId(match.id);
      }
    } else if (services.length > 0 && !selectedServiceId) {
      setSelectedServiceId(services[0].id);
    }
  }, [preselectedServiceSlug, services, selectedServiceId]);

  useEffect(() => {
    if (prefilledNotes) {
      setValue('notes', prefilledNotes);
    }
  }, [prefilledNotes, setValue]);

  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0];

  const handleNextStep = () => {
    setSubmissionError(null);
    if (currentStep === 1) {
      if (!selectedServiceId && services.length > 0) {
        setSelectedServiceId(services[0].id);
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!selectedDate || !selectedTimeSlot) return;
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    setSubmissionError(null);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Form submission directly inserting into Supabase
  const onSubmit = async (formData: AppointmentFormData) => {
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const payload: Appointment = {
        client_name: formData.client_name.trim(),
        client_phone: formData.client_phone.trim(),
        client_email: formData.client_email.trim().toLowerCase(),
        customer_name: formData.client_name.trim(),
        customer_phone: formData.client_phone.trim(),
        customer_email: formData.client_email.trim().toLowerCase(),
        service_id: selectedService?.id,
        service_name: selectedService?.name || 'Commercial Office Leasing',
        booking_date: selectedDate,
        booking_time_slot: selectedTimeSlot,
        appointment_date: selectedDate,
        appointment_time: selectedTimeSlot,
        status: 'pending',
        notes: formData.notes?.trim() || '',
      };

      const result = await bookAppointment(payload);

      if (!result.success) {
        setSubmissionError(
          result.error || 'Failed to insert appointment into Supabase. Please verify your table structure and RLS policy.'
        );
        setIsSubmitting(false);
        return;
      }

      // Celebratory Confetti on Success
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#4B935B', '#76B384', '#D0E6D6', '#2A5D37', '#FAF9F5', '#D4AF37']
      });

      setConfirmedBooking(result.data || payload);
      setRecordSource(result.source || 'supabase');
      setSubmissionSuccess(true);
      reset();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred during submission.';
      setSubmissionError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl || !inputKey) return;
    updateSupabaseConfig(inputUrl.trim(), inputKey.trim());
    setSupabaseConfig(getActiveSupabaseConfig());
    setConfigSavedToast(true);
    setTimeout(() => {
      setConfigSavedToast(false);
      setShowConfigModal(false);
    }, 1200);
  };

  const handleResetConfig = () => {
    resetSupabaseConfig();
    const config = getActiveSupabaseConfig();
    setSupabaseConfig(config);
    setInputUrl(config.url);
    setInputKey(config.key);
    setShowConfigModal(false);
  };

  const getWhatsAppShareUrl = () => {
    if (!confirmedBooking) return '#';
    const clientName = confirmedBooking.client_name || confirmedBooking.customer_name;
    const clientPhone = confirmedBooking.client_phone || confirmedBooking.customer_phone;
    const bookingDate = confirmedBooking.booking_date || confirmedBooking.appointment_date;
    const bookingTime = confirmedBooking.booking_time_slot || confirmedBooking.appointment_time;

    const text = encodeURIComponent(
      `Hello A3S Landbase Team,\nI have scheduled a commercial property consultation:\n• Client: ${clientName}\n• Phone: ${clientPhone}\n• Service: ${confirmedBooking.service_name}\n• Date: ${bookingDate}\n• Time: ${bookingTime}\n• Status: ${confirmedBooking.status}\n\nPlease confirm our meeting at Pioneer Urban Square, Sector 62 Gurugram.`
    );
    return `https://wa.me/919810653905?text=${text}`;
  };

  return (
    <section id="booking-scheduler" className="py-20 bg-cream-50 relative scroll-mt-20">
      
      {/* Decorative Warm Creamy Green Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-creamgreen-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header & Live Supabase Status Pill */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="inline-flex items-center gap-2 bg-creamgreen-100 text-creamgreen-900 px-3.5 py-1 rounded-full text-xs font-bold border border-creamgreen-300">
              <Sparkles className="w-3.5 h-3.5 text-creamgreen-700" />
              <span>INSTANT SITE VISIT &amp; LEASE ADVISORY</span>
            </div>

            {/* Direct Supabase Connection Status Badge */}
            <button
              onClick={() => setShowConfigModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors shadow-sm bg-white hover:bg-creamgreen-50 border-creamgreen-300 text-luxury-obsidian"
              title="Click to view or edit Supabase credentials"
            >
              <Database className="w-3.5 h-3.5 text-creamgreen-600" />
              <span>{supabaseConfig.isConnected ? 'Supabase: Live Connected' : 'Supabase: Ready'}</span>
              <span className={`w-2 h-2 rounded-full ${supabaseConfig.isConnected ? 'bg-creamgreen-500 animate-pulse' : 'bg-amber-400'}`}></span>
            </button>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-luxury-obsidian tracking-tight">
            Schedule Your Commercial Consultation
          </h2>
          <p className="mt-2 text-sm sm:text-base text-luxury-muted">
            All appointment bookings are synced directly in real-time to the Supabase database.
          </p>
        </div>

        {/* Stepper Progress Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="grid grid-cols-3 gap-2 text-center">
            
            {/* Step 1 Indicator */}
            <div 
              onClick={() => setCurrentStep(1)} 
              className={`cursor-pointer pb-2 border-b-2 transition-all ${
                currentStep >= 1 
                  ? 'border-creamgreen-600 text-creamgreen-950 font-bold' 
                  : 'border-creamgreen-200 text-luxury-muted'
              }`}
            >
              <div className="text-xs uppercase tracking-wider text-creamgreen-800">Step 1</div>
              <div className="text-xs sm:text-sm font-semibold truncate">Select Service</div>
            </div>

            {/* Step 2 Indicator */}
            <div 
              onClick={() => { if (currentStep > 2) setCurrentStep(2); }} 
              className={`pb-2 border-b-2 transition-all ${
                currentStep >= 2 
                  ? 'border-creamgreen-600 text-creamgreen-950 font-bold' 
                  : 'border-creamgreen-200 text-luxury-muted'
              }`}
            >
              <div className="text-xs uppercase tracking-wider text-creamgreen-800">Step 2</div>
              <div className="text-xs sm:text-sm font-semibold truncate">Date &amp; Time Slot</div>
            </div>

            {/* Step 3 Indicator */}
            <div 
              className={`pb-2 border-b-2 transition-all ${
                currentStep === 3 
                  ? 'border-creamgreen-600 text-creamgreen-950 font-bold' 
                  : 'border-creamgreen-200 text-luxury-muted'
              }`}
            >
              <div className="text-xs uppercase tracking-wider text-creamgreen-800">Step 3</div>
              <div className="text-xs sm:text-sm font-semibold truncate">Corporate Details</div>
            </div>

          </div>
        </div>

        {/* Error Alert Banner */}
        {submissionError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-300 text-red-800 flex items-start justify-between gap-3 animate-in fade-in shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm space-y-1">
                <strong className="font-bold text-red-900 block">Supabase Submission Error:</strong>
                <p>{submissionError}</p>
                <div className="text-[11px] text-red-700 pt-1">
                  Ensure the <code>appointments</code> table has been created with columns: 
                  <code> id, client_name, client_email, client_phone, service_id, booking_date, booking_time_slot, status, created_at</code>.
                </div>
              </div>
            </div>
            <button
              onClick={() => setSubmissionError(null)}
              className="p-1 rounded-lg text-red-500 hover:text-red-800 hover:bg-red-100"
              aria-label="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Main Scheduler Form Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-creamgreen-200 shadow-luxury">

          {/* ================= STEP 1: SERVICE SELECTION ================= */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-xl text-luxury-obsidian">
                    1. Choose the Commercial Service Required
                  </h3>
                  <p className="text-xs sm:text-sm text-luxury-muted mt-0.5">
                    Select the domain of commercial property assistance you need
                  </p>
                </div>
                <span className="text-xs font-semibold text-creamgreen-800 bg-creamgreen-100 px-3 py-1 rounded-full border border-creamgreen-200">
                  ₹0 Advisory Fee
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {services.map((service) => {
                  const isSelected = selectedServiceId === service.id;
                  return (
                    <div
                      key={service.id}
                      onClick={() => setSelectedServiceId(service.id)}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 relative ${
                        isSelected
                          ? 'border-creamgreen-600 bg-creamgreen-50 shadow-md ring-2 ring-creamgreen-300/60'
                          : 'border-creamgreen-100 bg-white hover:bg-creamgreen-50/50 hover:border-creamgreen-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-xl bg-white border border-creamgreen-200 flex items-center justify-center text-creamgreen-700 shadow-sm">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'bg-creamgreen-600 border-creamgreen-700 text-white'
                              : 'border-creamgreen-200 bg-white'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </div>
                      </div>

                      <h4 className="font-heading font-bold text-base text-luxury-obsidian mt-4">
                        {service.name}
                      </h4>
                      <p className="text-xs text-luxury-warmgray mt-1 line-clamp-3">
                        {service.description}
                      </p>

                      <div className="mt-4 pt-3 border-t border-creamgreen-100 flex items-center justify-between text-[11px] font-semibold">
                        <span className="text-luxury-muted">⏱ {service.duration_minutes} Mins</span>
                        <span className="text-creamgreen-700">Free Consultation</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Button */}
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-creamgreen-600 via-creamgreen-700 to-creamgreen-800 hover:from-creamgreen-700 hover:to-creamgreen-900 shadow-md transition-all flex items-center gap-2 border border-creamgreen-700"
                >
                  <span>Continue to Date &amp; Time</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: DATE & TIME SELECTION ================= */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-heading font-bold text-xl text-luxury-obsidian">
                    2. Select Consultation Date &amp; Preferred Time Slot
                  </h3>
                  <p className="text-xs sm:text-sm text-luxury-muted mt-0.5">
                    For Service: <strong>{selectedService?.name}</strong>
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs text-creamgreen-900 bg-creamgreen-100 px-3 py-1.5 rounded-full border border-creamgreen-300 self-start sm:self-auto">
                  <span className="w-2 h-2 rounded-full bg-creamgreen-500"></span>
                  <span>24/7 Mon-Sun Consultations</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                
                {/* Date Picker Column */}
                <div className="md:col-span-5 bg-creamgreen-50/50 p-5 rounded-2xl border border-creamgreen-200 space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-creamgreen-900 flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4 text-creamgreen-700" />
                    <span>Choose Meeting Date</span>
                  </label>
                  <p className="text-xs text-luxury-muted">
                    We accommodate same-day emergency reviews as well as scheduled property visits.
                  </p>
                  <input
                    type="date"
                    min={minDateStr}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-creamgreen-300 bg-white text-luxury-obsidian font-semibold focus:outline-none focus:ring-2 focus:ring-creamgreen-400"
                  />
                  <div className="text-[11px] text-luxury-muted pt-1">
                    * Pioneer Urban Square Office or on-site client location in Gurugram
                  </div>
                </div>

                {/* Time Slots Column */}
                <div className="md:col-span-7 space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-creamgreen-900 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-creamgreen-700" />
                    <span>Available Consultation Slots</span>
                  </label>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {TIME_SLOTS.map((slot) => {
                      const isSelected = selectedTimeSlot === slot.time;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          onClick={() => setSelectedTimeSlot(slot.time)}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            isSelected
                              ? 'bg-creamgreen-700 border-creamgreen-800 text-white font-extrabold shadow-sm'
                              : 'bg-white border-creamgreen-200 text-luxury-charcoal hover:bg-creamgreen-50'
                          }`}
                        >
                          <div className="text-sm">{slot.time}</div>
                          <div className={`text-[10px] font-normal mt-0.5 ${isSelected ? 'text-creamgreen-100' : 'text-luxury-muted'}`}>{slot.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Step Navigation Buttons */}
              <div className="pt-6 border-t border-creamgreen-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-5 py-3 rounded-xl font-bold text-luxury-charcoal bg-white hover:bg-creamgreen-50 border border-creamgreen-200 transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-creamgreen-600 via-creamgreen-700 to-creamgreen-800 hover:from-creamgreen-700 hover:to-creamgreen-900 shadow-md transition-all flex items-center gap-2 border border-creamgreen-700"
                >
                  <span>Continue to Corporate Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: CONTACT FORM & SUBMISSION ================= */}
          {currentStep === 3 && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-heading font-bold text-xl text-luxury-obsidian">
                    3. Corporate Contact &amp; Property Requirements
                  </h3>
                  <p className="text-xs sm:text-sm text-luxury-muted mt-0.5">
                    Will be inserted into the <code>appointments</code> table in real-time.
                  </p>
                </div>
                <div className="text-xs text-creamgreen-900 bg-creamgreen-50 border border-creamgreen-300 px-3 py-1.5 rounded-xl font-semibold">
                  📅 {selectedDate} at {selectedTimeSlot}
                </div>
              </div>

              {/* Inputs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Client Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-luxury-obsidian flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-creamgreen-700" />
                    <span>Client Name *</span>
                  </label>
                  <input
                    {...register('client_name')}
                    placeholder="e.g. Vikramaditya Singhania"
                    className={`w-full px-4 py-3 rounded-xl border bg-white text-sm text-luxury-obsidian focus:outline-none focus:ring-2 ${
                      errors.client_name ? 'border-red-400 focus:ring-red-300' : 'border-creamgreen-300 focus:ring-creamgreen-400'
                    }`}
                  />
                  {errors.client_name && (
                    <p className="text-xs text-red-600">{errors.client_name.message}</p>
                  )}
                </div>

                {/* Client Phone */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-luxury-obsidian flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-creamgreen-700" />
                    <span>Client Phone / WhatsApp *</span>
                  </label>
                  <input
                    {...register('client_phone')}
                    placeholder="+91 98106 XXXXX"
                    className={`w-full px-4 py-3 rounded-xl border bg-white text-sm text-luxury-obsidian focus:outline-none focus:ring-2 ${
                      errors.client_phone ? 'border-red-400 focus:ring-red-300' : 'border-creamgreen-300 focus:ring-creamgreen-400'
                    }`}
                  />
                  {errors.client_phone && (
                    <p className="text-xs text-red-600">{errors.client_phone.message}</p>
                  )}
                </div>

                {/* Client Email */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-luxury-obsidian flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-creamgreen-700" />
                    <span>Corporate Email Address *</span>
                  </label>
                  <input
                    {...register('client_email')}
                    type="email"
                    placeholder="contact@company.com"
                    className={`w-full px-4 py-3 rounded-xl border bg-white text-sm text-luxury-obsidian focus:outline-none focus:ring-2 ${
                      errors.client_email ? 'border-red-400 focus:ring-red-300' : 'border-creamgreen-300 focus:ring-creamgreen-400'
                    }`}
                  />
                  {errors.client_email && (
                    <p className="text-xs text-red-600">{errors.client_email.message}</p>
                  )}
                </div>

                {/* Notes / Space Requirement */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-luxury-obsidian flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-creamgreen-700" />
                    <span>Specific Property Requirements / Notes (Optional)</span>
                  </label>
                  <textarea
                    {...register('notes')}
                    rows={3}
                    placeholder="e.g. Space requirement: ~12,000 sq ft near Pioneer Urban Square / Golf Course Ext Rd..."
                    className="w-full px-4 py-3 rounded-xl border border-creamgreen-300 bg-white text-sm text-luxury-obsidian focus:outline-none focus:ring-2 focus:ring-creamgreen-400"
                  />
                </div>

              </div>

              {/* Privacy and Verification Assurance */}
              <div className="p-3.5 rounded-xl bg-creamgreen-50 border border-creamgreen-200 text-xs text-luxury-muted flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-creamgreen-700 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Data Integrity:</strong> Form values map directly to Supabase schema: 
                  <code> client_name, client_email, client_phone, service_id, booking_date, booking_time_slot, status</code>.
                </span>
              </div>

              {/* Step Navigation & Submit Buttons */}
              <div className="pt-4 border-t border-creamgreen-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={isSubmitting}
                  className="px-5 py-3 rounded-xl font-bold text-luxury-charcoal bg-white hover:bg-creamgreen-50 border border-creamgreen-200 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-creamgreen-600 via-creamgreen-700 to-creamgreen-800 hover:from-creamgreen-700 hover:to-creamgreen-900 shadow-md hover:shadow-lg transition-all flex items-center gap-2 border border-creamgreen-700 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Inserting into Supabase...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm &amp; Insert into Supabase</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>

      </div>

      {/* ================= SUCCESS CONFIRMATION MODAL ================= */}
      {submissionSuccess && confirmedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-luxury-obsidian/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border-2 border-creamgreen-400 shadow-2xl relative space-y-6">
            
            {/* Close Button */}
            <button
              onClick={() => {
                setSubmissionSuccess(false);
                setCurrentStep(1);
              }}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-creamgreen-50 text-luxury-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Success Icon & Header */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-creamgreen-100 text-creamgreen-800 mx-auto flex items-center justify-center border-2 border-creamgreen-300 shadow-sm">
                <CheckCircle2 className="w-9 h-9 text-creamgreen-700" />
              </div>
              <h3 className="font-heading font-extrabold text-2xl text-luxury-obsidian">
                Appointment Booked &amp; Saved!
              </h3>
              <p className="text-xs sm:text-sm text-luxury-muted">
                Your consultation has been saved into the <strong>appointments</strong> table in real-time.
              </p>
            </div>

            {/* Live Database Confirmation Badge */}
            <div className="flex items-center justify-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-creamgreen-50 text-creamgreen-900 border border-creamgreen-200">
              <Database className="w-3.5 h-3.5 text-creamgreen-700" />
              <span>
                {recordSource === 'supabase' 
                  ? 'Real-Time Sync: Live Supabase Database' 
                  : 'Verified Test Mode: Local Sync (Ready for Supabase Keys)'}
              </span>
            </div>

            {/* Booking Summary Ticket Card */}
            <div className="p-4 rounded-2xl bg-creamgreen-50/60 border border-creamgreen-200 space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between items-center pb-2 border-b border-creamgreen-100">
                <span className="text-luxury-muted">Service Name:</span>
                <span className="font-bold text-luxury-obsidian">{confirmedBooking.service_name}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-creamgreen-100">
                <span className="text-luxury-muted">Appointment Date:</span>
                <span className="font-bold text-luxury-obsidian">{confirmedBooking.booking_date || confirmedBooking.appointment_date}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-creamgreen-100">
                <span className="text-luxury-muted">Appointment Time:</span>
                <span className="font-bold text-luxury-obsidian">{confirmedBooking.booking_time_slot || confirmedBooking.appointment_time}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-creamgreen-100">
                <span className="text-luxury-muted">Client Name:</span>
                <span className="font-bold text-luxury-obsidian">{confirmedBooking.client_name || confirmedBooking.customer_name}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-creamgreen-100">
                <span className="text-luxury-muted">Phone Number:</span>
                <span className="font-bold text-luxury-obsidian">{confirmedBooking.client_phone || confirmedBooking.customer_phone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-luxury-muted">Status:</span>
                <span className="font-bold uppercase tracking-wider text-creamgreen-800 bg-creamgreen-100 px-2 py-0.5 rounded text-[11px] border border-creamgreen-200">
                  {confirmedBooking.status || 'pending'}
                </span>
              </div>
            </div>

            {/* Action Buttons: WhatsApp & Close */}
            <div className="space-y-3">
              <a
                href={getWhatsAppShareUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl font-bold text-white bg-creamgreen-700 hover:bg-creamgreen-800 shadow-md transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Share2 className="w-4 h-4" />
                <span>Confirm on WhatsApp (+91 98106 53905)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => {
                  setSubmissionSuccess(false);
                  setCurrentStep(1);
                }}
                className="w-full py-3 rounded-xl font-semibold text-luxury-charcoal bg-white hover:bg-creamgreen-50 border border-creamgreen-300 text-xs transition-colors"
              >
                Close &amp; Return to Page
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= SUPABASE CREDENTIALS CONFIG MODAL ================= */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-luxury-obsidian/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border-2 border-creamgreen-400 shadow-2xl relative space-y-4">
            
            <button
              onClick={() => setShowConfigModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-creamgreen-50 text-luxury-muted"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-creamgreen-100 flex items-center justify-center text-creamgreen-800 border border-creamgreen-300">
                <KeyRound className="w-5 h-5 text-creamgreen-800" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-luxury-obsidian">
                  Supabase Live Connection
                </h3>
                <p className="text-xs text-luxury-muted">
                  Configure your project keys directly in the browser
                </p>
              </div>
            </div>

            {configSavedToast && (
              <div className="p-2.5 rounded-xl bg-creamgreen-100 text-creamgreen-900 text-xs font-semibold flex items-center gap-2 border border-creamgreen-200">
                <CheckCircle2 className="w-4 h-4 text-creamgreen-700" />
                <span>Supabase credentials saved and initialized!</span>
              </div>
            )}

            <form onSubmit={handleSaveConfig} className="space-y-3 pt-2 text-xs">
              <div>
                <label className="font-bold text-luxury-obsidian block mb-1">
                  Supabase Project URL (supabaseUrl)
                </label>
                <input
                  type="url"
                  required
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://your-project.supabase.co"
                  className="w-full px-3 py-2.5 rounded-xl border border-creamgreen-300 bg-white text-luxury-obsidian font-mono text-xs focus:ring-2 focus:ring-creamgreen-400 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-luxury-obsidian block mb-1">
                  Supabase Anon Key (supabaseKey)
                </label>
                <textarea
                  required
                  rows={2}
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full px-3 py-2.5 rounded-xl border border-creamgreen-300 bg-white text-luxury-obsidian font-mono text-xs focus:ring-2 focus:ring-creamgreen-400 outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleResetConfig}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-luxury-muted hover:text-red-700 hover:bg-red-50 border border-transparent"
                >
                  Reset Defaults
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold text-white bg-creamgreen-700 hover:bg-creamgreen-800 shadow-sm"
                >
                  Save &amp; Connect Live
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </section>
  );
};
