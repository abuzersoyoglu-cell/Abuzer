import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Smartphone, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Wrench, 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  Star,
  Users,
  Clock,
  Layers,
  Check,
  ChevronRight
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface LandingPageViewProps {
  onEnterApp: (view?: 'dashboard' | 'mobile-tech') => void;
  onOpenAIDiagnosisDemo: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onEnterApp,
  onOpenAIDiagnosisDemo,
}) => {
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupSector, setSignupSector] = useState('HVAC & Heating Systems');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupPhone) return;
    setIsSubmitted(true);
  };

  const ROADMAP_STEPS = [
    { num: 1, title: 'Zero-Cost Free Tiers', desc: 'Supabase, Gemini API, PWA foundation', status: 'completed' },
    { num: 2, title: 'FixFlow Dashboard', desc: 'Service dispatch and job management hub', status: 'completed' },
    { num: 3, title: 'Supabase Database', desc: 'PostgreSQL schema for jobs, quotes & reports', status: 'completed' },
    { num: 4, title: 'AI Diagnosis Engine', desc: 'Multimodal image + technician symptoms analysis', status: 'completed' },
    { num: 5, title: 'Quote Generator', desc: 'WhatsApp & SMS ready itemized estimates', status: 'completed' },
    { num: 6, title: 'PDF Work Orders', desc: 'Digital customer signature & warranty certificate', status: 'completed' },
    { num: 7, title: 'PWA & Mobile Install', desc: 'fixflow.ai standalone home screen web app', status: 'active' },
    { num: 8, title: 'First 10 Beta Technicians', desc: 'Real-world field testing with local pros', status: 'next' },
    { num: 9, title: 'First Paid Subscriptions', desc: 'Scalable recurring tier powered by Stripe', status: 'upcoming' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-cyan-500 selection:text-white pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-800">
        {/* Glow background accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-blue-600/10 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Tagline pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-750 text-xs font-semibold text-cyan-400 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Zero-Cost MVP Prototype — fixflow.ai</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              The AI Master Technician in{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Every Field Tech's Pocket
              </span>
            </h1>

            {/* Subhead */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Snap a photo of the faulty unit or error code, speak your diagnostic findings. Gemini 3.8 Flash pinpoints root causes in seconds; generate <strong>WhatsApp estimates</strong> and <strong>digitally signed work orders</strong> with one tap.
            </p>

            {/* Direct Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                id="btn-landing-enter-mobile-app"
                onClick={() => onEnterApp('mobile-tech')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 transition active:scale-95"
              >
                <Smartphone className="w-4 h-4" />
                <span>Open Field Tech App (PWA)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="btn-landing-enter-dashboard"
                onClick={() => onEnterApp('dashboard')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-sm border border-slate-700 transition"
              >
                <span>Explore Dispatch Dashboard</span>
              </button>

              <PWAInstallButton />
            </div>

            {/* Quick Benefits Bullet Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instant access without App Store friction
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Reliable offline-first local storage
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Multimodal intelligence with Gemini 3.8 Flash
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars: 4 Core Modules */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            4 Core Essentials for Field Service Techs
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Engineered for HVAC, refrigeration, appliance repair, and electrical specialists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: AI Diagnosis */}
          <div className="p-5 rounded-2xl bg-slate-850/80 border border-slate-750 hover:border-cyan-500/40 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">1. AI Fault Diagnosis</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Capture error codes, flame sensors, or damaged boards. Gemini AI identifies root causes, lists OEM parts, and guides step-by-step repair procedures.
            </p>
          </div>

          {/* Card 2: Instant Quote */}
          <div className="p-5 rounded-2xl bg-slate-850/80 border border-slate-750 hover:border-cyan-500/40 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">2. Instant Quotes & Estimates</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Calculate parts, labor, and taxes automatically. One-click send formatted estimates via WhatsApp or copy text directly for SMS dispatch.
            </p>
          </div>

          {/* Card 3: PDF Service Report */}
          <div className="p-5 rounded-2xl bg-slate-850/80 border border-slate-750 hover:border-cyan-500/40 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">3. Signed Work Orders</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Collect customer digital signatures on your phone upon job completion. Print or download official PDF receipts with warranty terms.
            </p>
          </div>

          {/* Card 4: Web App / PWA */}
          <div className="p-5 rounded-2xl bg-slate-850/80 border border-slate-750 hover:border-cyan-500/40 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">4. PWA & Zero Costs</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Install to home screen from fixflow.ai in seconds. Runs on free tiers with Supabase and Vercel without expensive server upkeep.
            </p>
          </div>

        </div>
      </section>

      {/* 9-Stage Roadmap as Requested by User */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            Step-by-Step Roadmap
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            FixFlow AI Zero-Budget Launch Plan
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Our step-by-step strategy for building, testing, and acquiring the first 10 customers without upfront costs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ROADMAP_STEPS.map((step) => (
            <div 
              key={step.num}
              className={`p-4 rounded-xl border transition ${
                step.status === 'completed'
                  ? 'bg-slate-850/90 border-emerald-500/40 text-slate-200'
                  : step.status === 'active'
                  ? 'bg-gradient-to-br from-cyan-950/40 to-slate-850 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-850/40 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-6 h-6 rounded-full bg-slate-800 text-cyan-400 font-bold text-xs flex items-center justify-center border border-slate-700">
                  {step.num}
                </span>
                {step.status === 'completed' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Ready
                  </span>
                )}
                {step.status === 'active' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold animate-pulse">
                    Active Phase
                  </span>
                )}
                {step.status === 'next' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold">
                    Up Next
                  </span>
                )}
              </div>
              <h4 className="font-bold text-sm text-white">{step.title}</h4>
              <p className="text-xs text-slate-400 mt-1">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Free Plan / Cost Breakdown Table */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            How We Build at Zero Upfront Cost
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Free tier developer tools utilized across FixFlow's entire architecture
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-850 overflow-hidden">
          <div className="grid grid-cols-3 p-3.5 bg-slate-800 font-bold text-xs text-slate-300 border-b border-slate-750">
            <span>Component</span>
            <span>Tool & Architecture</span>
            <span className="text-right">Cost Status</span>
          </div>
          <div className="divide-y divide-slate-800 text-xs">
            <div className="grid grid-cols-3 p-3 items-center">
              <span className="font-medium text-white">App Interface</span>
              <span className="text-slate-300">PWA / Web App (React 19 + Tailwind)</span>
              <span className="text-right text-emerald-400 font-bold">🟢 $0 (Free)</span>
            </div>
            <div className="grid grid-cols-3 p-3 items-center">
              <span className="font-medium text-white">Database</span>
              <span className="text-slate-300">Supabase (PostgreSQL + Local Storage)</span>
              <span className="text-right text-emerald-400 font-bold">🟢 $0 (Free Tier)</span>
            </div>
            <div className="grid grid-cols-3 p-3 items-center">
              <span className="font-medium text-white">AI Intelligence</span>
              <span className="text-slate-300">Gemini 3.8 Flash API</span>
              <span className="text-right text-emerald-400 font-bold">🟢 $0 (Free Tier Quota)</span>
            </div>
            <div className="grid grid-cols-3 p-3 items-center">
              <span className="font-medium text-white">Hosting & Cloud</span>
              <span className="text-slate-300">Vercel / Cloud Run</span>
              <span className="text-right text-emerald-400 font-bold">🟢 $0 (Free Tier)</span>
            </div>
            <div className="grid grid-cols-3 p-3 items-center">
              <span className="font-medium text-white">Payments</span>
              <span className="text-slate-300">Stripe Billing</span>
              <span className="text-right text-emerald-400 font-bold">🟢 No Monthly Fee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Early Adopter / First 10 Users Form (Phase 8) */}
      <section className="py-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-850 to-slate-900 border border-slate-750 shadow-2xl">
          <div className="text-center space-y-2 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Phase 8: Early Access
            </span>
            <h3 className="text-2xl font-bold text-white">
              Join the First 10 Beta Technicians (100% Free)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Test FixFlow AI in your daily field operations. Receive 6 months of complimentary AI diagnostics, automated quoting, and digital signature reports.
            </p>
          </div>

          {isSubmitted ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Application Received!</h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Welcome {signupName}! You have been added to our early beta access list. You can immediately launch the technician workspace:
              </p>
              <button
                onClick={() => onEnterApp('mobile-tech')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
              >
                <span>Launch Technician App Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Your Name / Company</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Rivera (Rivera HVAC)"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">WhatsApp / Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +1 (555) 234-8921"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">What is your primary service trade?</label>
                <select
                  value={signupSector}
                  onChange={(e) => setSignupSector(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="HVAC & Heating Systems">HVAC & Heating Systems</option>
                  <option value="Air Conditioning & Cooling">Air Conditioning & Cooling</option>
                  <option value="Major Appliances & Refrigeration">Major Appliances & Refrigeration</option>
                  <option value="Electrical & Plumbing">Electrical & Plumbing</option>
                  <option value="Automotive & Fleet Mechanics">Automotive & Fleet Mechanics</option>
                  <option value="Other Field Service">Other Field Service Trade</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-600/30 transition active:scale-95"
              >
                Join Free Beta Program
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
};
