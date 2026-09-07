import React from 'react';
import { 
  Wrench, 
  Sparkles, 
  Plus, 
  Database, 
  Smartphone, 
  LayoutDashboard, 
  Globe, 
  ShieldCheck, 
  Cpu
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  currentView: 'dashboard' | 'mobile-tech' | 'landing';
  onViewChange: (view: 'dashboard' | 'mobile-tech' | 'landing') => void;
  onOpenNewJob: () => void;
  onOpenSupabase: () => void;
  totalJobsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  onOpenNewJob,
  onOpenSupabase,
  totalJobsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onViewChange('dashboard')}
              className="flex items-center gap-2.5 group text-left focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg text-white tracking-tight">FixFlow</span>
                  <span className="text-xs font-semibold px-1.5 py-0.5 rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 text-white flex items-center gap-0.5">
                    <Sparkles className="w-3 h-3" /> AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium hidden sm:block">Field Service & AI Diagnostics PWA</p>
              </div>
            </button>
          </div>

          {/* View Switcher Tabs */}
          <div className="hidden md:flex items-center p-1 rounded-xl bg-slate-800/90 border border-slate-750">
            <button
              id="tab-dashboard-view"
              onClick={() => onViewChange('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentView === 'dashboard'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-700/60">{totalJobsCount}</span>
            </button>

            <button
              id="tab-mobile-pwa-view"
              onClick={() => onViewChange('mobile-tech')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentView === 'mobile-tech'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Field Tech PWA</span>
            </button>

            <button
              id="tab-landing-view"
              onClick={() => onViewChange('landing')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentView === 'landing'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>fixflow.ai Site</span>
            </button>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            {/* Status indicator */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-750 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <Cpu className="w-3 h-3 text-cyan-400" />
              <span>Gemini 3.8 Flash Active</span>
            </div>

            {/* Supabase & Cloud Database setup */}
            <button
              id="btn-open-supabase-modal"
              onClick={onOpenSupabase}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium transition"
              title="Supabase Database & Cloud Schema"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Database</span>
            </button>

            {/* PWA Install Button */}
            <PWAInstallButton compact />

            {/* New Job CTA */}
            <button
              id="btn-quick-new-job"
              onClick={onOpenNewJob}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-cyan-600/30 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline">New Service Job</span>
              <span className="xs:hidden">New Job</span>
            </button>
          </div>
        </div>

        {/* Mobile View Switcher Tab bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800/80 text-xs">
          <button
            onClick={() => onViewChange('dashboard')}
            className={`flex items-center gap-1 py-1 px-2.5 rounded-lg font-medium ${
              currentView === 'dashboard' ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => onViewChange('mobile-tech')}
            className={`flex items-center gap-1 py-1 px-2.5 rounded-lg font-medium ${
              currentView === 'mobile-tech' ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Field PWA</span>
          </button>
          <button
            onClick={() => onViewChange('landing')}
            className={`flex items-center gap-1 py-1 px-2.5 rounded-lg font-medium ${
              currentView === 'landing' ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>
        </div>
      </div>
    </header>
  );
};
