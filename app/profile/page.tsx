'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Badge from '@/components/ui/Badge';
import { 
  User as UserIcon, Mail, Phone, Calendar, ShieldCheck, MapPin, 
  Settings, Trash2, Globe, CheckCircle2, AlertCircle, 
  Clock, Smartphone, Map, Lock, Eye, EyeOff, Save,
  ArrowRight, Shield, Activity, Fingerprint, Languages,
  ExternalLink, MailCheck, CreditCard, Link as LinkIcon,
  Verified, Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for Login Activity
const MOCK_ACTIVITY = [
  { device: 'Windows PC • Chrome', location: 'New Delhi, India', time: 'Just now', current: true },
  { device: 'iPhone 15 • Safari', location: 'Mumbai, India', time: '2 hours ago', current: false },
  { device: 'macOS • Edge', location: 'Bangalore, India', time: 'Yesterday', current: false },
];

export default function ProfilePage() {
  const { user, profile, updateProfile } = useAuth();
  
  // Form States
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(false);
  const [isDigiLockerLinked, setIsDigiLockerLinked] = useState(false);
  const [pincode, setPincode] = useState('');
  const [constituency, setConstituency] = useState<{ name: string; booth: string } | null>(null);
  
  // Settings States
  const [showData, setShowData] = useState(true);
  const [useForVerification, setUseForVerification] = useState(true);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [language, setLanguage] = useState('English');
  
  // UI States
  const [isEditing, setIsEditing] = useState(false);
  const [isPhoneOtpSent, setIsPhoneOtpSent] = useState(false);
  const [isEmailOtpSent, setIsEmailOtpSent] = useState(false);
  const [isAadhaarOtpSent, setIsAadhaarOtpSent] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [aadhaarOtp, setAadhaarOtp] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Sync state with profile data when it loads
  useEffect(() => {
    if (profile) {
      setDob(profile.dob || '');
      setPhone(profile.phone || '');
      // @ts-ignore
      setAadhaar(profile.aadhaar || '');
      // @ts-ignore
      if (profile.isPhoneVerified) setIsPhoneVerified(true);
      // @ts-ignore
      if (profile.isAadhaarVerified) setIsAadhaarVerified(true);
      // @ts-ignore
      if (profile.isEmailVerified) setIsEmailVerified(true);
      // @ts-ignore
      if (profile.isDigiLockerLinked) setIsDigiLockerLinked(true);
    }
    if (user?.emailVerified) {
      setIsEmailVerified(true);
    }
  }, [profile, user]);

  // Helper Functions
  const calculateAge = (birthday: string) => {
    if (!birthday) return 0;
    const ageDifMs = Date.now() - new Date(birthday).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const age = calculateAge(dob);
  const isEligible = age >= 18;

  const calculateProgress = () => {
    let score = 0;
    if (isEmailVerified) score += 20;
    if (isPhoneVerified) score += 20;
    if (isAadhaarVerified) score += 20;
    if (isDigiLockerLinked) score += 20;
    if (dob) score += 10;
    if (pincode) score += 10;
    return score;
  };

  const progress = calculateProgress();

  const handleSave = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({
        dob,
        phone,
        // @ts-ignore
        aadhaar,
        isPhoneVerified,
        isAadhaarVerified,
        isEmailVerified,
        isDigiLockerLinked,
        age: calculateAge(dob),
        eligible: calculateAge(dob) >= 18
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // OTP Logic
  const handleSendEmailOtp = () => setIsEmailOtpSent(true);
  const confirmEmailOtp = () => {
    if (emailOtp === '123456') {
      setIsEmailVerified(true);
      setIsEmailOtpSent(false);
      setEmailOtp('');
    }
  };

  const handleSendPhoneOtp = () => setIsPhoneOtpSent(true);
  const confirmPhoneOtp = () => {
    if (phoneOtp === '123456') {
      setIsPhoneVerified(true);
      setIsPhoneOtpSent(false);
      setPhoneOtp('');
    }
  };

  const handleSendAadhaarOtp = () => setIsAadhaarOtpSent(true);
  const confirmAadhaarOtp = () => {
    if (aadhaarOtp === '123456') {
      setIsAadhaarVerified(true);
      setIsAadhaarOtpSent(false);
      setAadhaarOtp('');
    }
  };

  const handleDigiLockerLink = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsDigiLockerLinked(true);
      setIsSaving(false);
    }, 1500);
  };

  // Mock Pincode Lookup
  useEffect(() => {
    if (pincode.length === 6) {
      setConstituency({
        name: 'Central Delhi',
        booth: 'Kendriya Vidyalaya, Gole Market'
      });
    } else {
      setConstituency(null);
    }
  }, [pincode]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen px-4 py-12 pb-24">
        <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-xl shadow-violet-500/20">
                  <UserIcon className="w-12 h-12 text-white" />
                </div>
                {progress === 100 && (
                  <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full border-4 border-[#0b0a1a] shadow-lg animate-bounce">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="font-outfit font-bold text-3xl text-white">{profile?.name || 'Voter Profile'}</h1>
                  {progress === 100 && (
                    <Badge variant="eligible" label="Fully Verified" className="text-[10px] px-2 py-0.5" />
                  )}
                </div>
                <p className="text-slate-400 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> {user?.email}
                </p>
              </div>
            </div>
            
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={cn(
                "btn-secondary px-6 py-2.5 transition-all duration-300",
                isEditing && "bg-white/10 border-violet-500/50 text-white",
                isSaving && "opacity-50 cursor-wait"
              )}
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : isEditing ? (
                <><Save className="w-4 h-4 mr-2" /> Save Profile</>
              ) : (
                <><Settings className="w-4 h-4 mr-2" /> Edit Profile</>
              )}
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 flex flex-col gap-8">
              
              {/* Profile Completion */}
              <div className="glass-strong rounded-3xl p-8 relative overflow-hidden">
                <div className="orb w-[200px] h-[200px] bg-violet-600 top-[-20%] right-[-10%] opacity-20" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-outfit font-bold text-xl text-white">Profile Completion</h2>
                    <span className="text-violet-400 font-bold">{progress}%</span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden mb-4">
                    <div 
                      className="h-full bg-gradient-to-r from-violet-500 via-pink-500 to-rose-500 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-slate-400 text-sm">
                    {progress < 100 ? 'Complete your profile to unlock full features and voting roadmap.' : 'Your profile is fully optimized for the upcoming elections!'}
                  </p>
                </div>
              </div>

              {/* Section 1: Personal Information */}
              <div className="glass rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-violet-400" />
                  </div>
                  <h2 className="font-outfit font-bold text-xl text-white">Personal Information</h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-8 mb-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Date of Birth
                    </label>
                    <input 
                      type="date" 
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      disabled={!isEditing}
                      className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Phone Number
                    </label>
                    <div className="relative">
                      <input 
                        type="tel" 
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={!isEditing || isPhoneVerified}
                        className="input-field pl-4 pr-24 disabled:opacity-50"
                      />
                      {phone && !isPhoneVerified && !isPhoneOtpSent && isEditing && (
                        <button 
                          onClick={handleSendPhoneOtp}
                          className="absolute right-2 top-1.5 px-3 py-1 bg-violet-600 hover:bg-violet-500 text-white text-[10px] font-bold rounded-lg transition-colors"
                        >
                          Verify
                        </button>
                      )}
                      {isPhoneVerified && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-[10px] font-bold">Verified</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {isPhoneOtpSent && (
                  <div className="mb-8 p-4 rounded-2xl bg-violet-500/5 border border-violet-500/20 animate-fade-in">
                    <p className="text-xs text-slate-300 mb-3 font-medium">Enter 6-digit code sent to your phone (Mock: 123456)</p>
                    <div className="flex gap-3">
                      <input 
                        type="text" 
                        maxLength={6}
                        value={phoneOtp}
                        onChange={(e) => setPhoneOtp(e.target.value)}
                        placeholder="••••••"
                        className="input-field text-center tracking-[1em] font-black w-full"
                      />
                      <button 
                        onClick={confirmPhoneOtp}
                        className="btn-primary px-6 whitespace-nowrap"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4 pt-8 border-t border-white/5">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/3 border border-white/5 h-full">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-slate-500" />
                        <span className="text-sm text-slate-300">Email Verification</span>
                      </div>
                      {isEmailVerified ? (
                        <Badge variant="eligible" label="Verified" className="px-2" />
                      ) : (
                        <div className="flex items-center gap-2">
                          <Badge variant="ineligible" label="Pending" className="px-2" />
                          <button 
                            onClick={handleSendEmailOtp}
                            disabled={isEmailOtpSent}
                            className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-all disabled:opacity-50"
                          >
                            {isEmailOtpSent ? <Clock className="w-4 h-4 animate-pulse" /> : <ExternalLink className="w-4 h-4" />}
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {isEmailOtpSent && (
                      <div className="p-4 rounded-2xl bg-violet-500/5 border border-violet-500/20 animate-slide-in-top">
                        <p className="text-[10px] text-slate-400 mb-2 font-medium">Mock Email OTP: 123456</p>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            maxLength={6}
                            value={emailOtp}
                            onChange={(e) => setEmailOtp(e.target.value)}
                            placeholder="••••••"
                            className="input-field text-center tracking-[0.5em] font-bold text-xs py-1.5"
                          />
                          <button 
                            onClick={confirmEmailOtp}
                            className="btn-primary px-4 py-1.5 text-xs whitespace-nowrap"
                          >
                            Verify
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/3 border border-white/5">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-slate-500" />
                      <span className="text-sm text-slate-300">Phone Verification</span>
                    </div>
                    {isPhoneVerified ? (
                      <Badge variant="eligible" label="Verified" className="px-2" />
                    ) : (
                      <Badge variant="ineligible" label="Pending" className="px-2" />
                    )}
                  </div>
                </div>
              </div>

              {/* NEW SECTION: Government Identity */}
              <div className="glass rounded-3xl p-8 relative overflow-hidden">
                <div className="orb w-[150px] h-[150px] bg-emerald-600 top-[-10%] left-[-5%] opacity-10" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h2 className="font-outfit font-bold text-xl text-white">Government Identity</h2>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-8 mb-8">
                    {/* Aadhaar */}
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <Fingerprint className="w-4 h-4" /> Aadhaar Number
                      </label>
                      <div className="relative">
                        <input 
                          type="text" 
                          maxLength={14}
                          placeholder="0000 0000 0000"
                          value={aadhaar}
                          onChange={(e) => setAadhaar(e.target.value)}
                          disabled={!isEditing || isAadhaarVerified}
                          className="input-field pl-4 pr-24 disabled:opacity-50"
                        />
                        {aadhaar.length >= 12 && !isAadhaarVerified && !isAadhaarOtpSent && isEditing && (
                          <button 
                            onClick={handleSendAadhaarOtp}
                            className="absolute right-2 top-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded-lg transition-colors"
                          >
                            Verify
                          </button>
                        )}
                        {isAadhaarVerified && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-emerald-400">
                            <Verified className="w-4 h-4" />
                            <span className="text-[10px] font-bold">Linked</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* DigiLocker */}
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <LinkIcon className="w-4 h-4" /> DigiLocker
                      </label>
                      <button
                        onClick={handleDigiLockerLink}
                        disabled={isDigiLockerLinked || !isEditing}
                        className={cn(
                          "input-field flex items-center justify-center gap-2 transition-all duration-300",
                          isDigiLockerLinked ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "hover:bg-white/5"
                        )}
                      >
                        {isDigiLockerLinked ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            Linked with DigiLocker
                          </>
                        ) : (
                          <>
                            <img src="https://www.digilocker.gov.in/assets/img/digilocker_logo.png" className="h-4 invert opacity-70" alt="DigiLocker" />
                            Link Account
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Aadhaar OTP UI */}
                  {isAadhaarOtpSent && (
                    <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 animate-fade-in mb-6">
                      <p className="text-xs text-slate-300 mb-3 font-medium">Enter OTP sent to Aadhaar-linked mobile (Mock: 123456)</p>
                      <div className="flex gap-3">
                        <input 
                          type="text" 
                          maxLength={6}
                          value={aadhaarOtp}
                          onChange={(e) => setAadhaarOtp(e.target.value)}
                          placeholder="••••••"
                          className="input-field text-center tracking-[1em] font-black w-full"
                        />
                        <button 
                          onClick={confirmAadhaarOtp}
                          className="btn-primary bg-emerald-600 hover:bg-emerald-500 border-emerald-500/50 px-6 whitespace-nowrap"
                        >
                          Verify Aadhaar
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="p-4 rounded-2xl bg-white/3 border border-white/5 flex items-start gap-4">
                    <Info className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Linking your Aadhaar and DigiLocker account allows for instant document verification and unlocks the <span className="text-emerald-400 font-bold">Verified Citizen Badge</span>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 2: Security & Privacy */}
              <div className="glass rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-pink-400" />
                  </div>
                  <h2 className="font-outfit font-bold text-xl text-white">Security & Privacy</h2>
                </div>

                <div className="flex flex-col gap-6 mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Show Personal Data</p>
                      <p className="text-slate-500 text-xs">Display your name and info on public dashboard</p>
                    </div>
                    <button 
                      onClick={() => setShowData(!showData)}
                      className={cn(
                        "w-12 h-6 rounded-full p-1 transition-colors duration-300",
                        showData ? "bg-violet-600" : "bg-slate-700"
                      )}
                    >
                      <div className={cn("w-4 h-4 bg-white rounded-full transition-transform duration-300", showData ? "translate-x-6" : "translate-x-0")} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Verification Consent</p>
                      <p className="text-slate-500 text-xs">Use my data for election verification only</p>
                    </div>
                    <button 
                      onClick={() => setUseForVerification(!useForVerification)}
                      className={cn(
                        "w-12 h-6 rounded-full p-1 transition-colors duration-300",
                        useForVerification ? "bg-violet-600" : "bg-slate-700"
                      )}
                    >
                      <div className={cn("w-4 h-4 bg-white rounded-full transition-transform duration-300", useForVerification ? "translate-x-6" : "translate-x-0")} />
                    </button>
                  </div>
                </div>

                <h3 className="text-slate-500 text-xs uppercase tracking-widest font-black mb-4">Login Activity</h3>
                <div className="flex flex-col gap-3">
                  {MOCK_ACTIVITY.map((act, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5">
                      <div className="flex items-center gap-3">
                        <Activity className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="text-sm text-white font-medium">{act.device}</p>
                          <p className="text-[10px] text-slate-500">{act.location} • {act.time}</p>
                        </div>
                      </div>
                      {act.current && <span className="text-[10px] bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-md font-bold uppercase">Current</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              
              <div className="glass rounded-3xl p-8 relative overflow-hidden group">
                <div className="orb w-[150px] h-[150px] bg-blue-600 bottom-[-10%] left-[-10%] opacity-10" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-400" />
                    </div>
                    <h2 className="font-outfit font-bold text-xl text-white">Election Info</h2>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium text-slate-500">Pincode</label>
                      <input 
                        type="text" 
                        maxLength={6}
                        placeholder="Enter 6-digit Pincode"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="input-field"
                      />
                    </div>

                    {constituency && (
                      <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 animate-slide-in-right">
                        <div className="flex items-center gap-2 mb-2">
                          <Map className="w-4 h-4 text-blue-400" />
                          <p className="text-xs font-bold text-white uppercase">{constituency.name}</p>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                          Your assigned booth:<br/>
                          <span className="text-blue-300">{constituency.booth}</span>
                        </p>
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-white/5">
                      <p className="text-xs font-medium text-slate-500 mb-3">Eligibility Status</p>
                      <div className={cn(
                        "flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-500",
                        isEligible ? "bg-emerald-500/5 border-emerald-500/20" : "bg-rose-500/5 border-rose-500/20"
                      )}>
                        <div className={cn(
                          "w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-lg",
                          isEligible ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-rose-500 text-white shadow-rose-500/20"
                        )}>
                          {isEligible ? <CheckCircle2 className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                        </div>
                        <p className={cn("font-bold", isEligible ? "text-emerald-400" : "text-rose-400")}>
                          {isEligible ? 'Eligible to Vote' : 'Not Eligible'}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">Age: {age} years</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center">
                    <Languages className="w-5 h-5 text-slate-400" />
                  </div>
                  <h2 className="font-outfit font-bold text-xl text-white">Management</h2>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-slate-500">Language Preferences</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['English', 'Hindi', 'Tamil'].map((lang) => (
                        <button 
                          key={lang}
                          onClick={() => setLanguage(lang)}
                          className={cn(
                            "px-2 py-2 rounded-xl text-[10px] font-bold border transition-all",
                            language === lang ? "bg-violet-600 border-violet-500 text-white" : "glass text-slate-500 border-white/5"
                          )}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-white/5">
                    <button className="flex items-center justify-between p-3 rounded-xl bg-rose-500/5 border border-rose-500/10 text-rose-400 hover:bg-rose-500/10 transition-all text-sm group">
                      <div className="flex items-center gap-3">
                        <Trash2 className="w-4 h-4" />
                        Delete Account
                      </div>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
