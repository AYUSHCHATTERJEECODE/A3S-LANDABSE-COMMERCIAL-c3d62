import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  LogOut, 
  RefreshCw, 
  Search, 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  AlertTriangle, 
  FileSpreadsheet, 
  Database, 
  MessageSquare,
  X,
  User,
  UserPlus,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Appointment } from '../types/database';
import { 
  fetchAppointments, 
  updateAppointmentStatus, 
  deleteAppointment,
  checkAdminAccountExists,
  registerMasterAdmin,
  authenticateAdmin,
  getActiveAdminSession,
  clearAdminSession
} from '../lib/supabaseClient';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  // Single-Slot Admin State
  const [adminSlotClaimed, setAdminSlotClaimed] = useState<boolean | null>(null);
  const [claimedAccount, setClaimedAccount] = useState<{ full_name: string; email: string } | null>(null);
  const [isCheckingSlot, setIsCheckingSlot] = useState<boolean>(true);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Active Session & Admin Details
  const [currentAdmin, setCurrentAdmin] = useState<{ full_name: string; email: string } | null>(() => {
    return getActiveAdminSession();
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!getActiveAdminSession();
  });

  // Registration Form State (One-Time Creation)
  const [registerName, setRegisterName] = useState<string>('');
  const [registerEmail, setRegisterEmail] = useState<string>('');
  const [registerPassword, setRegisterPassword] = useState<string>('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState<string>('');

  // Login Form State
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');

  // Common Auth UI State
  const [isSubmittingAuth, setIsSubmittingAuth] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessMessage, setAuthSuccessMessage] = useState<string | null>(null);

  // Bookings Data States
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLiveDatabase, setIsLiveDatabase] = useState<boolean>(false);
  const [databaseNotice, setDatabaseNotice] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');

  // Delete Confirmation Modal State
  const [deleteCandidate, setDeleteCandidate] = useState<Appointment | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Status Update Loading tracking
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Verify single slot availability on open or mount
  const checkSlotStatus = useCallback(async () => {
    setIsCheckingSlot(true);
    try {
      const res = await checkAdminAccountExists();
      setAdminSlotClaimed(res.exists);
      if (res.exists && res.account) {
        setClaimedAccount(res.account);
        setLoginEmail(res.account.email);
        // If not already logged in and slot exists, default to login
        if (!getActiveAdminSession()) {
          setAuthMode('login');
        }
      } else {
        setClaimedAccount(null);
        // If slot is free and not logged in, default to register mode
        if (!getActiveAdminSession()) {
          setAuthMode('register');
        }
      }
    } catch {
      // fallback
    } finally {
      setIsCheckingSlot(false);
    }
  }, []);

  // Load appointments from Supabase
  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setDatabaseNotice(null);
    try {
      const res = await fetchAppointments();
      setAppointments(res.data);
      setIsLiveDatabase(res.isLive);
      if (res.error) {
        setDatabaseNotice(res.error);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch appointments';
      setDatabaseNotice(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // When modal opens, verify session, check single slot, and load data if logged in
  useEffect(() => {
    if (isOpen) {
      const session = getActiveAdminSession();
      if (session) {
        setCurrentAdmin(session);
        setIsAuthenticated(true);
        loadAppointments();
      } else {
        setIsAuthenticated(false);
        setCurrentAdmin(null);
      }
      checkSlotStatus();
    }
  }, [isOpen, checkSlotStatus, loadAppointments]);

  // Handle Master Admin Registration (Single-Slot)
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccessMessage(null);

    // Guard: Validate single slot
    if (adminSlotClaimed) {
      setAuthError('The single admin account slot has already been claimed. Additional registrations are blocked.');
      return;
    }

    if (!registerName.trim()) {
      setAuthError('Please enter your full name or title.');
      return;
    }

    if (!registerEmail.trim() || !registerEmail.includes('@')) {
      setAuthError('Please provide a valid corporate email address.');
      return;
    }

    if (registerPassword.length < 6) {
      setAuthError('Master password must be at least 6 characters.');
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setAuthError('Passwords do not match. Please verify.');
      return;
    }

    setIsSubmittingAuth(true);

    try {
      const res = await registerMasterAdmin(registerName, registerEmail, registerPassword);
      if (res.success && res.account) {
        // Confetti celebration for claiming the exclusive admin slot!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        setCurrentAdmin(res.account);
        setIsAuthenticated(true);
        setAdminSlotClaimed(true);
        setClaimedAccount(res.account);
        setAuthSuccessMessage('Master Admin account created successfully! The single registration slot is now permanently locked.');

        // Clear sensitive inputs
        setRegisterPassword('');
        setRegisterConfirmPassword('');

        // Load appointments
        loadAppointments();
      } else {
        setAuthError(res.error || 'Failed to create master admin account.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error during admin registration';
      setAuthError(msg);
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  // Handle Master Admin Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccessMessage(null);

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setAuthError('Please enter both your email address and password.');
      return;
    }

    setIsSubmittingAuth(true);

    try {
      const res = await authenticateAdmin(loginEmail, loginPassword);
      if (res.success && res.account) {
        setCurrentAdmin(res.account);
        setIsAuthenticated(true);
        setLoginPassword('');
        loadAppointments();
      } else {
        setAuthError(res.error || 'Invalid credentials. Please verify your password.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication network error';
      setAuthError(msg);
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  // Handle Admin Logout
  const handleLogout = () => {
    clearAdminSession();
    setIsAuthenticated(false);
    setCurrentAdmin(null);
    setLoginPassword('');
    setAuthError(null);
    setAuthSuccessMessage(null);
    setAuthMode('login');
    checkSlotStatus();
  };

  // Status Change Handler
  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    // Optimistic Update
    setAppointments((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );

    try {
      const res = await updateAppointmentStatus(id, newStatus);
      if (!res.success) {
        setDatabaseNotice(`Status update notice: ${res.error}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating status';
      setDatabaseNotice(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete Confirmation and Execution
  const confirmDelete = async () => {
    if (!deleteCandidate?.id) return;
    setIsDeleting(true);
    const targetId = deleteCandidate.id;

    // Optimistic delete
    setAppointments((prev) => prev.filter((item) => item.id !== targetId));

    try {
      const res = await deleteAppointment(targetId);
      if (!res.success) {
        setDatabaseNotice(`Delete notice: ${res.error}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error deleting appointment';
      setDatabaseNotice(msg);
    } finally {
      setIsDeleting(false);
      setDeleteCandidate(null);
    }
  };

  // Export to CSV helper
  const exportToCSV = () => {
    if (appointments.length === 0) return;
    const headers = ['ID', 'Client Name', 'Phone', 'Email', 'Service Name', 'Booking Date', 'Time Slot', 'Status', 'Notes', 'Created At'];
    const rows = appointments.map((a) => [
      `"${a.id || ''}"`,
      `"${(a.client_name || a.customer_name || '').replace(/"/g, '""')}"`,
      `"${a.client_phone || a.customer_phone || ''}"`,
      `"${a.client_email || a.customer_email || ''}"`,
      `"${(a.service_name || '').replace(/"/g, '""')}"`,
      `"${a.booking_date || a.appointment_date || ''}"`,
      `"${a.booking_time_slot || a.appointment_time || ''}"`,
      `"${a.status || 'pending'}"`,
      `"${(a.notes || '').replace(/"/g, '""')}"`,
      `"${a.created_at || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `A3S_Appointments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy quick SQL helper
  const handleCopySql = () => {
    const quickSql = `-- Quick Setup SQL for Supabase Editor
CREATE TABLE IF NOT EXISTS admin_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_master BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE admin_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public check admin" ON admin_accounts FOR SELECT USING (TRUE);
CREATE POLICY "Public insert admin" ON admin_accounts FOR INSERT WITH CHECK (TRUE);

CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(50) NOT NULL,
  service_id UUID,
  booking_date DATE NOT NULL,
  booking_time_slot VARCHAR(50) NOT NULL,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert appointments" ON appointments FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Public read appointments" ON appointments FOR SELECT USING (TRUE);
CREATE POLICY "Public update appointments" ON appointments FOR UPDATE USING (TRUE);
CREATE POLICY "Public delete appointments" ON appointments FOR DELETE USING (TRUE);`;

    navigator.clipboard.writeText(quickSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  // Metric Computations
  const todayStr = new Date().toISOString().split('T')[0];
  const metrics = useMemo(() => {
    const total = appointments.length;
    const today = appointments.filter((a) => (a.booking_date || a.appointment_date) === todayStr).length;
    const pending = appointments.filter((a) => a.status === 'pending').length;
    const confirmed = appointments.filter((a) => a.status === 'confirmed').length;
    const completed = appointments.filter((a) => a.status === 'completed').length;
    return { total, today, pending, confirmed, completed };
  }, [appointments, todayStr]);

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      // Status filter
      if (statusFilter !== 'all' && apt.status !== statusFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const clientName = (apt.client_name || apt.customer_name || '').toLowerCase();
        const clientPhone = (apt.client_phone || apt.customer_phone || '').toLowerCase();
        const clientEmail = (apt.client_email || apt.customer_email || '').toLowerCase();
        const serviceName = (apt.service_name || '').toLowerCase();
        const notes = (apt.notes || '').toLowerCase();
        return clientName.includes(q) || clientPhone.includes(q) || clientEmail.includes(q) || serviceName.includes(q) || notes.includes(q);
      }
      return true;
    });
  }, [appointments, statusFilter, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-luxury-obsidian/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="bg-cream-50 rounded-3xl max-w-7xl w-full my-auto border-2 border-creamgreen-300 shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* ================= HEADER BAR ================= */}
        <div className="bg-gradient-to-r from-creamgreen-50 via-white to-creamgreen-100 px-5 sm:px-6 py-4 border-b border-creamgreen-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-creamgreen-600 to-creamgreen-900 p-0.5 shadow-sm">
              <div className="w-full h-full bg-luxury-obsidian rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-creamgreen-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-extrabold text-base sm:text-lg text-luxury-obsidian leading-tight">
                  A3S Landbase • Staff Executive Portal
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-creamgreen-100 text-creamgreen-900 px-2 py-0.5 rounded-full border border-creamgreen-300">
                  {isAuthenticated ? 'Master Admin' : 'Admin Gateway'}
                </span>
              </div>
              <p className="text-xs text-luxury-muted">
                {isAuthenticated 
                  ? `Logged in as ${currentAdmin?.full_name || 'Admin'} (${currentAdmin?.email || ''})`
                  : 'Exclusive Single-Slot Master Admin Authentication'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-luxury-charcoal bg-white hover:bg-red-50 hover:text-red-700 border border-creamgreen-200 transition-colors shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-luxury-muted hover:text-luxury-obsidian hover:bg-white transition-colors"
              aria-label="Close Admin Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= BODY CONTENT ================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* 1. AUTHENTICATION & SINGLE SLOT REGISTRATION VIEW */}
          {!isAuthenticated ? (
            isCheckingSlot ? (
              <div className="py-24 flex flex-col items-center justify-center gap-3 text-luxury-muted">
                <RefreshCw className="w-8 h-8 text-creamgreen-700 animate-spin" />
                <span className="text-xs font-semibold">Verifying single admin slot status...</span>
              </div>
            ) : (
            <div className="max-w-lg mx-auto py-6 px-4 space-y-6">
              
              {/* Single Slot Badge / Notice Banner */}
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-creamgreen-100 border-2 border-creamgreen-300 text-creamgreen-800 flex items-center justify-center mx-auto shadow-md">
                  {adminSlotClaimed ? (
                    <Lock className="w-8 h-8 text-creamgreen-700" />
                  ) : (
                    <Sparkles className="w-8 h-8 text-creamgreen-700" />
                  )}
                </div>

                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border shadow-xs bg-creamgreen-100 text-creamgreen-900 border-creamgreen-300">
                    {adminSlotClaimed ? (
                      <>
                        <Lock className="w-3 h-3 text-creamgreen-700" />
                        <span>Single Slot Claimed • Registration Locked</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-creamgreen-700" />
                        <span>1 Exclusive Admin Slot Available</span>
                      </>
                    )}
                  </div>

                  <h3 className="font-heading font-extrabold text-2xl text-luxury-obsidian">
                    {adminSlotClaimed
                      ? 'Master Admin Secure Login'
                      : 'Create Master Admin Account'}
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-luxury-muted mt-1 leading-relaxed">
                    {adminSlotClaimed
                      ? 'The single master admin slot has been claimed. Sign in to view and manage client consultations and bookings.'
                      : 'Set up your master admin credentials. Once created, no other accounts can ever be registered on this website.'}
                  </p>
                </div>
              </div>

              {/* Mode Toggle Pills (If slot is NOT claimed, allow toggling, or if claimed show permanent lock notice) */}
              {adminSlotClaimed ? (
                <div className="p-3.5 rounded-2xl bg-creamgreen-100/60 border border-creamgreen-300 text-xs text-creamgreen-950 flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-creamgreen-800 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Registration Slot Closed:</strong> The single master admin account for A3S Landbase is already registered ({claimedAccount ? claimedAccount.email.replace(/(.{2})(.*)(?=@)/, '$1***') : 'Secured'}). Only the registered master admin can sign in.
                  </div>
                </div>
              ) : (
                <div className="flex p-1 bg-creamgreen-200/50 rounded-2xl border border-creamgreen-300">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('register'); setAuthError(null); }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      authMode === 'register'
                        ? 'bg-creamgreen-700 text-white shadow-sm'
                        : 'text-luxury-charcoal hover:text-luxury-obsidian'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Create Admin Account (1 Slot)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('login'); setAuthError(null); }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      authMode === 'login'
                        ? 'bg-creamgreen-700 text-white shadow-sm'
                        : 'text-luxury-charcoal hover:text-luxury-obsidian'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Admin Login</span>
                  </button>
                </div>
              )}

              {/* Alert Feedback Messages */}
              {authError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-600" />
                  <span>{authError}</span>
                </div>
              )}

              {authSuccessMessage && (
                <div className="p-3.5 rounded-xl bg-creamgreen-100 border border-creamgreen-300 text-xs text-creamgreen-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-creamgreen-700" />
                  <span>{authSuccessMessage}</span>
                </div>
              )}

              {/* FORM A: REGISTER SINGLE MASTER ADMIN ACCOUNT */}
              {authMode === 'register' && !adminSlotClaimed && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4 bg-white p-6 rounded-2xl border border-creamgreen-200 shadow-sm">
                  
                  <div>
                    <label className="block text-xs font-bold text-luxury-obsidian mb-1.5">
                      Master Admin Full Name &amp; Title
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        autoFocus
                        placeholder="e.g. Vikram Sharma (Executive Director)"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-creamgreen-200 text-xs text-luxury-obsidian bg-creamgreen-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-creamgreen-400"
                      />
                      <User className="w-4 h-4 text-luxury-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-luxury-obsidian mb-1.5">
                      Official Admin Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="admin@a3slandbase.com"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-creamgreen-200 text-xs text-luxury-obsidian bg-creamgreen-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-creamgreen-400"
                      />
                      <Mail className="w-4 h-4 text-luxury-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-luxury-obsidian mb-1.5">
                        Master Password
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          required
                          placeholder="Min. 6 chars"
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-creamgreen-200 text-xs text-luxury-obsidian bg-creamgreen-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-creamgreen-400"
                        />
                        <Lock className="w-4 h-4 text-luxury-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-luxury-obsidian mb-1.5">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          required
                          placeholder="Repeat password"
                          value={registerConfirmPassword}
                          onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-creamgreen-200 text-xs text-luxury-obsidian bg-creamgreen-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-creamgreen-400"
                        />
                        <Lock className="w-4 h-4 text-luxury-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-creamgreen-900 bg-creamgreen-50 p-3 rounded-xl border border-creamgreen-200">
                    🛡️ <strong>Single Slot Guarantee:</strong> Submitting this form permanently creates the 1 authorized admin account. Any subsequent visitor will find registration locked and cannot create another account.
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingAuth}
                    className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-creamgreen-600 via-creamgreen-700 to-creamgreen-800 hover:from-creamgreen-700 hover:to-creamgreen-900 shadow-md transition-all text-xs sm:text-sm flex items-center justify-center gap-2 border border-creamgreen-700 disabled:opacity-50"
                  >
                    {isSubmittingAuth ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Locking Single Slot &amp; Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Claim Single Slot &amp; Create Admin Account</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* FORM B: LOGIN MASTER ADMIN */}
              {(authMode === 'login' || adminSlotClaimed) && (
                <form onSubmit={handleLoginSubmit} className="space-y-4 bg-white p-6 rounded-2xl border border-creamgreen-200 shadow-sm">
                  
                  <div>
                    <label className="block text-xs font-bold text-luxury-obsidian mb-1.5">
                      Admin Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        autoFocus
                        placeholder="admin@a3slandbase.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-creamgreen-200 text-xs text-luxury-obsidian bg-creamgreen-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-creamgreen-400"
                      />
                      <Mail className="w-4 h-4 text-luxury-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-luxury-obsidian mb-1.5">
                      Master Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        placeholder="Enter your master password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-creamgreen-200 text-xs text-luxury-obsidian bg-creamgreen-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-creamgreen-400"
                      />
                      <Lock className="w-4 h-4 text-luxury-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingAuth}
                    className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-creamgreen-600 via-creamgreen-700 to-creamgreen-800 hover:from-creamgreen-700 hover:to-creamgreen-900 shadow-md transition-all text-xs sm:text-sm flex items-center justify-center gap-2 border border-creamgreen-700 disabled:opacity-50"
                  >
                    {isSubmittingAuth ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying Credentials...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Sign In to Admin Dashboard</span>
                      </>
                    )}
                  </button>

                  {!adminSlotClaimed && (
                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => { setAuthMode('register'); setAuthError(null); }}
                        className="text-xs text-creamgreen-700 font-semibold hover:underline"
                      >
                        Haven't created your master admin account yet? Click to claim the single slot.
                      </button>
                    </div>
                  )}
                </form>
              )}

            </div>
            )
          ) : (
            /* 2. AUTHENTICATED DASHBOARD VIEW */
            <div className="space-y-6">
              
              {/* Database Notice or Schema Setup Helper */}
              {databaseNotice && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-900 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <Database className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-amber-950">Database Synchronization Notice</div>
                        <div className="mt-0.5 text-amber-900/90">{databaseNotice}</div>
                      </div>
                    </div>
                    <button onClick={() => setDatabaseNotice(null)} className="text-amber-700 hover:text-amber-900">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {databaseNotice.includes('schema cache') || databaseNotice.includes('PGRST205') ? (
                    <div className="bg-white/80 p-3 rounded-xl border border-amber-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-amber-950">Supabase Table Quick Setup:</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleCopySql}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold transition-colors"
                          >
                            {copiedSql ? <Check className="w-3.5 h-3.5 text-creamgreen-700" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedSql ? 'SQL Copied!' : 'Copy SQL Script'}</span>
                          </button>
                          <a
                            href="https://supabase.com/dashboard/project/iupobugldmikbejolkpm/sql/new"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-creamgreen-700 text-white font-bold hover:bg-creamgreen-800 transition-colors"
                          >
                            <span>Open Supabase SQL Editor</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                      <p className="text-[11px] text-luxury-muted">
                        Paste the copied SQL into your Supabase SQL Editor to activate real-time synchronization. Appointments will also persist locally in the meantime.
                      </p>
                    </div>
                  ) : null}
                </div>
              )}

              {/* Top Controls & Sync Status Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-creamgreen-200 shadow-sm">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2 text-xs font-bold text-luxury-obsidian">
                    <Database className="w-4 h-4 text-creamgreen-700" />
                    <span>Supabase Live Sync:</span>
                  </div>
                  
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    isLiveDatabase 
                      ? 'bg-creamgreen-100 text-creamgreen-900 border border-creamgreen-300' 
                      : 'bg-creamgreen-50 text-luxury-obsidian border border-creamgreen-200'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${isLiveDatabase ? 'bg-creamgreen-500 animate-pulse' : 'bg-amber-400'}`}></span>
                    {isLiveDatabase ? 'Live Connected (iupobugldmikbejolkpm)' : 'Local Mirror Mode'}
                  </span>

                  <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-cream-100 text-luxury-charcoal border border-creamgreen-200">
                    <Lock className="w-3 h-3 text-creamgreen-700" />
                    <span>Single Admin Slot Claimed</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={loadAppointments}
                    disabled={loading}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-luxury-charcoal bg-white hover:bg-creamgreen-50 border border-creamgreen-200 transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                    title="Refresh data from Supabase"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-creamgreen-700 ${loading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>

                  <button
                    onClick={exportToCSV}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-luxury-obsidian bg-white hover:bg-creamgreen-50 border border-creamgreen-200 transition-all flex items-center gap-1.5 shadow-sm"
                    title="Export all appointments to CSV spreadsheet"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-creamgreen-700" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* 3. METRIC SUMMARY CARDS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                
                {/* Total Bookings */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-creamgreen-200 shadow-sm flex flex-col justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-luxury-muted flex items-center justify-between">
                    <span>Total Bookings</span>
                    <Building2 className="w-4 h-4 text-creamgreen-600" />
                  </div>
                  <div className="mt-3">
                    <div className="font-heading font-extrabold text-3xl text-luxury-obsidian">
                      {metrics.total}
                    </div>
                    <div className="text-[11px] text-luxury-muted mt-0.5">All inquiries on website</div>
                  </div>
                </div>

                {/* Today's Appointments */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-creamgreen-200 shadow-sm flex flex-col justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-creamgreen-800 flex items-center justify-between">
                    <span>Today's Visits</span>
                    <Calendar className="w-4 h-4 text-creamgreen-600" />
                  </div>
                  <div className="mt-3">
                    <div className="font-heading font-extrabold text-3xl text-creamgreen-800">
                      {metrics.today}
                    </div>
                    <div className="text-[11px] text-luxury-muted mt-0.5">Scheduled for today ({todayStr})</div>
                  </div>
                </div>

                {/* Pending Requests */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200 shadow-sm flex flex-col justify-between bg-gradient-to-br from-white to-amber-50/40">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center justify-between">
                    <span>Pending Action</span>
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="mt-3">
                    <div className="font-heading font-extrabold text-3xl text-amber-700">
                      {metrics.pending}
                    </div>
                    <div className="text-[11px] text-amber-800/80 mt-0.5">Needs executive confirmation</div>
                  </div>
                </div>

                {/* Confirmed / Completed */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-creamgreen-300 shadow-sm flex flex-col justify-between bg-gradient-to-br from-white to-creamgreen-50/40">
                  <div className="text-xs font-bold uppercase tracking-wider text-creamgreen-900 flex items-center justify-between">
                    <span>Confirmed &amp; Done</span>
                    <CheckCircle2 className="w-4 h-4 text-creamgreen-600" />
                  </div>
                  <div className="mt-3">
                    <div className="font-heading font-extrabold text-3xl text-creamgreen-700">
                      {metrics.confirmed + metrics.completed}
                    </div>
                    <div className="text-[11px] text-creamgreen-900/80 mt-0.5">
                      {metrics.confirmed} active / {metrics.completed} completed
                    </div>
                  </div>
                </div>

              </div>

              {/* 4. SEARCH & STATUS FILTER BAR */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-creamgreen-200 shadow-sm">
                
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-luxury-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by client name, phone, email, notes..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-creamgreen-200 text-xs text-luxury-obsidian bg-creamgreen-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-creamgreen-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-luxury-muted hover:text-luxury-obsidian text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Status Filter Tabs */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      statusFilter === 'all'
                        ? 'bg-creamgreen-700 text-white font-bold shadow-sm'
                        : 'bg-white border border-creamgreen-200 text-luxury-charcoal hover:bg-creamgreen-50'
                    }`}
                  >
                    All ({metrics.total})
                  </button>

                  <button
                    onClick={() => setStatusFilter('pending')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      statusFilter === 'pending'
                        ? 'bg-amber-500 text-white font-bold shadow-sm'
                        : 'bg-white border border-creamgreen-200 text-luxury-charcoal hover:bg-creamgreen-50'
                    }`}
                  >
                    Pending ({metrics.pending})
                  </button>

                  <button
                    onClick={() => setStatusFilter('confirmed')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      statusFilter === 'confirmed'
                        ? 'bg-creamgreen-700 text-white font-bold shadow-sm'
                        : 'bg-white border border-creamgreen-200 text-luxury-charcoal hover:bg-creamgreen-50'
                    }`}
                  >
                    Confirmed ({metrics.confirmed})
                  </button>

                  <button
                    onClick={() => setStatusFilter('completed')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      statusFilter === 'completed'
                        ? 'bg-blue-600 text-white font-bold shadow-sm'
                        : 'bg-white border border-creamgreen-200 text-luxury-charcoal hover:bg-creamgreen-50'
                    }`}
                  >
                    Completed ({metrics.completed})
                  </button>

                  <button
                    onClick={() => setStatusFilter('cancelled')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      statusFilter === 'cancelled'
                        ? 'bg-red-500 text-white font-bold shadow-sm'
                        : 'bg-white border border-creamgreen-200 text-luxury-charcoal hover:bg-creamgreen-50'
                    }`}
                  >
                    Cancelled
                  </button>
                </div>

              </div>

              {/* 5. LIVE BOOKINGS TABLE */}
              <div className="bg-white rounded-2xl border border-creamgreen-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    
                    {/* Table Header */}
                    <thead className="bg-creamgreen-50/80 border-b border-creamgreen-200 text-luxury-obsidian font-heading font-extrabold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="p-3.5">Client &amp; Contact</th>
                        <th className="p-3.5">Commercial Service</th>
                        <th className="p-3.5">Date &amp; Slot</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5">Requirements / Notes</th>
                        <th className="p-3.5 text-right">Quick Actions</th>
                      </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="divide-y divide-creamgreen-100">
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-luxury-muted">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <RefreshCw className="w-6 h-6 animate-spin text-creamgreen-600" />
                              <span>Fetching live records from Supabase...</span>
                            </div>
                          </td>
                        </tr>
                      ) : filteredAppointments.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-luxury-muted">
                            <Building2 className="w-8 h-8 mx-auto text-creamgreen-200 mb-2" />
                            <div className="font-semibold text-luxury-charcoal">No appointment records match your criteria.</div>
                            <div className="text-[11px] mt-1">Bookings submitted on the website will appear here in real-time.</div>
                          </td>
                        </tr>
                      ) : (
                        filteredAppointments.map((apt) => {
                          const status = apt.status || 'pending';
                          const isUpdating = updatingId === apt.id;
                          const clientName = apt.client_name || apt.customer_name || 'Corporate Client';
                          const clientPhone = apt.client_phone || apt.customer_phone || '';
                          const clientEmail = apt.client_email || apt.customer_email || '';
                          const bookingDate = apt.booking_date || apt.appointment_date || todayStr;
                          const bookingTime = apt.booking_time_slot || apt.appointment_time || '11:30 AM';

                          return (
                            <tr
                              key={apt.id || Math.random()}
                              className="hover:bg-creamgreen-50/40 transition-colors"
                            >
                              {/* Client Details */}
                              <td className="p-3.5 align-top">
                                <div className="font-bold text-luxury-obsidian text-sm">
                                  {clientName}
                                </div>
                                <div className="mt-1 flex flex-col gap-0.5 text-luxury-muted text-[11px]">
                                  <a
                                    href={`tel:${clientPhone}`}
                                    className="inline-flex items-center gap-1 hover:text-creamgreen-700 transition-colors"
                                  >
                                    <Phone className="w-3 h-3 text-creamgreen-600" />
                                    <span>{clientPhone}</span>
                                  </a>
                                  <a
                                    href={`mailto:${clientEmail}`}
                                    className="inline-flex items-center gap-1 hover:text-creamgreen-700 transition-colors"
                                  >
                                    <Mail className="w-3 h-3 text-creamgreen-600" />
                                    <span>{clientEmail}</span>
                                  </a>
                                </div>
                              </td>

                              {/* Service Name */}
                              <td className="p-3.5 align-top">
                                <span className="inline-block px-2.5 py-1 rounded-lg bg-creamgreen-50 text-luxury-charcoal font-semibold border border-creamgreen-200">
                                  {apt.service_name || 'Commercial Office Leasing'}
                                </span>
                              </td>

                              {/* Date & Time Slot */}
                              <td className="p-3.5 align-top whitespace-nowrap">
                                <div className="font-bold text-luxury-obsidian flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5 text-creamgreen-700" />
                                  <span>{bookingDate}</span>
                                  {bookingDate === todayStr && (
                                    <span className="text-[10px] bg-creamgreen-200 text-creamgreen-950 font-extrabold px-1.5 py-0.2 rounded">
                                      TODAY
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-luxury-muted flex items-center gap-1 mt-0.5">
                                  <Clock className="w-3 h-3 text-luxury-muted" />
                                  <span>{bookingTime}</span>
                                </div>
                              </td>

                              {/* Status Badge */}
                              <td className="p-3.5 align-top">
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                                    status === 'confirmed'
                                      ? 'bg-creamgreen-100 text-creamgreen-900 border border-creamgreen-300'
                                      : status === 'completed'
                                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                      : status === 'cancelled'
                                      ? 'bg-red-100 text-red-800 border border-red-300'
                                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                                  }`}
                                >
                                  {status === 'confirmed' && <CheckCircle2 className="w-3 h-3 text-creamgreen-700" />}
                                  {status === 'cancelled' && <XCircle className="w-3 h-3" />}
                                  {status === 'completed' && <CheckCircle2 className="w-3 h-3 text-blue-600" />}
                                  {status === 'pending' && <Clock className="w-3 h-3 text-amber-600" />}
                                  <span>{status}</span>
                                </span>
                              </td>

                              {/* Notes */}
                              <td className="p-3.5 align-top max-w-xs">
                                <div className="text-luxury-charcoal line-clamp-2 italic text-[11px]">
                                  {apt.notes ? `"${apt.notes}"` : <span className="text-luxury-muted">No notes</span>}
                                </div>
                              </td>

                              {/* Actions Dropdown / Buttons */}
                              <td className="p-3.5 align-top text-right">
                                <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                  
                                  {/* Direct WhatsApp Contact Button */}
                                  <a
                                    href={`https://wa.me/${clientPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(clientName)},%20this%20is%20A3S%20Landbase%20Commercial%20regarding%20your%20consultation%20on%20${bookingDate}%20at%20${bookingTime}.`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded-lg bg-creamgreen-50 text-creamgreen-700 hover:bg-creamgreen-100 border border-creamgreen-200 transition-colors"
                                    title="Message Customer on WhatsApp"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                  </a>

                                  {/* Quick Confirm Button */}
                                  {status !== 'confirmed' && (
                                    <button
                                      disabled={isUpdating}
                                      onClick={() => apt.id && handleStatusChange(apt.id, 'confirmed')}
                                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-creamgreen-700 text-white hover:bg-creamgreen-800 transition-colors shadow-sm disabled:opacity-50"
                                      title="Mark Confirmed"
                                    >
                                      Confirm
                                    </button>
                                  )}

                                  {/* Quick Complete Button */}
                                  {status !== 'completed' && (
                                    <button
                                      disabled={isUpdating}
                                      onClick={() => apt.id && handleStatusChange(apt.id, 'completed')}
                                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                                      title="Mark Completed"
                                    >
                                      Completed
                                    </button>
                                  )}

                                  {/* Quick Cancel Button */}
                                  {status !== 'cancelled' && (
                                    <button
                                      disabled={isUpdating}
                                      onClick={() => apt.id && handleStatusChange(apt.id, 'cancelled')}
                                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white text-red-700 hover:bg-red-50 border border-red-200 transition-colors disabled:opacity-50"
                                      title="Cancel Appointment"
                                    >
                                      Cancel
                                    </button>
                                  )}

                                  {/* Delete Button (Prompt modal) */}
                                  <button
                                    onClick={() => setDeleteCandidate(apt)}
                                    className="p-1.5 rounded-lg text-luxury-muted hover:text-red-700 hover:bg-red-50 transition-colors"
                                    title="Delete Record"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>

                                </div>
                              </td>

                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer Count */}
                <div className="p-3 bg-creamgreen-50/60 border-t border-creamgreen-100 text-xs text-luxury-muted flex items-center justify-between">
                  <span>Showing {filteredAppointments.length} of {appointments.length} records</span>
                  <span>Auto-sync with Supabase enabled</span>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* ================= DELETE CONFIRMATION DIALOG ================= */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-luxury-obsidian/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border-2 border-red-300 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-heading font-extrabold text-lg text-luxury-obsidian">
                  Delete Appointment Record?
                </h4>
                <p className="text-xs text-luxury-muted">
                  This action will permanently delete this record from Supabase.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-cream-50 border border-creamgreen-200 text-xs space-y-1">
              <div><strong>Client:</strong> {deleteCandidate.client_name || deleteCandidate.customer_name}</div>
              <div><strong>Service:</strong> {deleteCandidate.service_name}</div>
              <div><strong>Date:</strong> {deleteCandidate.booking_date || deleteCandidate.appointment_date} ({deleteCandidate.booking_time_slot || deleteCandidate.appointment_time})</div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-luxury-charcoal bg-cream-100 hover:bg-cream-200 border border-creamgreen-300 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Record'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
