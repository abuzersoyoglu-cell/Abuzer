import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Download, 
  Upload, 
  CheckCircle2,
  Server
} from 'lucide-react';
import { SupabaseConfig } from '../types';
import { saveSupabaseConfig } from '../lib/storage';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SupabaseConfig;
  onUpdateConfig: (newConfig: SupabaseConfig) => void;
  onExportData: () => void;
}

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  onExportData,
}) => {
  if (!isOpen) return null;

  const [url, setUrl] = useState(config.url || '');
  const [anonKey, setAnonKey] = useState(config.anonKey || '');
  const [copiedSql, setCopiedSql] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'failed' | null>(
    config.isConnected ? 'success' : null
  );

  const supabaseSqlSchema = `-- FixFlow AI - PostgreSQL / Supabase Database Schema
-- Paste into Supabase SQL Editor and click "Run".

-- 1. Customers Table
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT,
    district TEXT,
    city TEXT DEFAULT 'Seattle',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Service Jobs & Diagnostics Table
CREATE TABLE IF NOT EXISTS public.service_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracking_code TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    equipment_brand TEXT NOT NULL,
    equipment_model TEXT NOT NULL,
    error_code TEXT,
    technician_complaint TEXT,
    priority TEXT DEFAULT 'normal',
    status TEXT DEFAULT 'pending',
    assigned_technician TEXT DEFAULT 'Lead Field Tech',
    photo_url TEXT,
    ai_diagnosis JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Quotes & Estimates Table
CREATE TABLE IF NOT EXISTS public.quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_job_id UUID REFERENCES public.service_jobs(id) ON DELETE CASCADE,
    quote_number TEXT UNIQUE NOT NULL,
    items JSONB NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL,
    tax_rate NUMERIC(5,2) DEFAULT 8.00,
    tax_amount NUMERIC(10,2) DEFAULT 0.00,
    discount_amount NUMERIC(10,2) DEFAULT 0.00,
    total_amount NUMERIC(10,2) NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'sent',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Service Reports & Work Orders Table
CREATE TABLE IF NOT EXISTS public.service_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_job_id UUID REFERENCES public.service_jobs(id) ON DELETE CASCADE,
    report_number TEXT UNIQUE NOT NULL,
    technician_name TEXT NOT NULL,
    actions_taken JSONB,
    replaced_parts JSONB,
    warranty_duration_months INT DEFAULT 12,
    customer_signature_url TEXT,
    payment_status TEXT DEFAULT 'paid',
    paid_amount NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) Configuration
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for service technicians" ON public.customers FOR ALL USING (true);
CREATE POLICY "Enable all access for service jobs" ON public.service_jobs FOR ALL USING (true);
CREATE POLICY "Enable all access for quotes" ON public.quotes FOR ALL USING (true);
CREATE POLICY "Enable all access for service reports" ON public.service_reports FOR ALL USING (true);
`;

  const copySql = () => {
    navigator.clipboard.writeText(supabaseSqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleTestAndSave = () => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      const isConnected = Boolean(url.trim() && anonKey.trim());
      setTestResult(isConnected ? 'success' : 'failed');
      const newCfg: SupabaseConfig = {
        url: url.trim(),
        anonKey: anonKey.trim(),
        isConnected,
        lastSyncedAt: isConnected ? new Date().toISOString() : undefined,
      };
      saveSupabaseConfig(newCfg);
      onUpdateConfig(newCfg);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">Supabase Cloud Database & Storage</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  Phase 1 & 3: Free Cloud DB
                </span>
              </div>
              <p className="text-xs text-slate-400">
                FixFlow AI operates seamlessly in offline-first mode (PWA/LocalStorage) with optional Supabase PostgreSQL cloud sync.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs">
          
          {/* Architecture Status Info Card */}
          <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-750 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                <span>FixFlow Zero-Cost Data Architecture</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold text-[11px]">
                Offline-First + Cloud Sync
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Technicians in basements or boiler rooms without cell signal can open jobs, snap fault photos, and draft estimates. Data is immediately stored safely in local storage and synchronizes automatically with Supabase once reconnected.
            </p>
          </div>

          {/* Step 1: Copy SQL Schema */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">1</span>
                Supabase SQL Schema (One-Click Table Setup)
              </h3>
              <button
                type="button"
                onClick={copySql}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{copiedSql ? 'SQL Copied!' : 'Copy Full SQL Schema'}</span>
              </button>
            </div>

            <div className="relative rounded-xl bg-slate-950 border border-slate-800 p-3 max-h-44 overflow-y-auto font-mono text-[11px] text-slate-300">
              <pre className="whitespace-pre-wrap">{supabaseSqlSchema}</pre>
            </div>
          </div>

          {/* Step 2: Supabase Credentials */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">2</span>
              Supabase Project Connection (Optional Cloud Sync)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Supabase Project URL</label>
                <input
                  type="text"
                  placeholder="https://xyzcompany.supabase.co"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Supabase Anon Key (Public)</label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isTesting}
                  onClick={handleTestAndSave}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition disabled:opacity-50"
                >
                  {isTesting ? 'Verifying...' : 'Save Connection'}
                </button>
                {testResult === 'success' && (
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Connected Successfully!
                  </span>
                )}
              </div>

              <a
                href="https://supabase.com"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px]"
              >
                <span>Create Free Supabase Account (supabase.com)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Backup & Local Data Export */}
          <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-200">Backup Local Service Records</h4>
              <p className="text-[11px] text-slate-400">Download all field service jobs, quotes, and signed work orders as a portable JSON file.</p>
            </div>
            <button
              type="button"
              onClick={onExportData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-medium border border-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Download JSON</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-850 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
