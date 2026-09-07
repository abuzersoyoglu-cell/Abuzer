import React, { useState } from 'react';
import { 
  ClipboardList, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  Search, 
  Filter, 
  Plus, 
  TrendingUp, 
  AlertCircle,
  Wrench,
  Smartphone,
  Flame,
  Snowflake,
  Tv
} from 'lucide-react';
import { ServiceJob, JobStatus, EquipmentCategory } from '../types';
import { JobCard } from './JobCard';
import { SERVICE_CATEGORIES } from '../data/mockData';

interface DashboardViewProps {
  jobs: ServiceJob[];
  onOpenDiagnosis: (job: ServiceJob) => void;
  onOpenQuote: (job: ServiceJob) => void;
  onOpenReport: (job: ServiceJob) => void;
  onUpdateStatus: (jobId: string, status: JobStatus) => void;
  onOpenNewJob: () => void;
  onOpenAIGenericModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  jobs,
  onOpenDiagnosis,
  onOpenQuote,
  onOpenReport,
  onUpdateStatus,
  onOpenNewJob,
  onOpenAIGenericModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Metrics
  const totalJobs = jobs.length;
  const diagnosedCount = jobs.filter((j) => !!j.diagnosis).length;
  const quotesCount = jobs.filter((j) => !!j.quote).length;
  const completedCount = jobs.filter((j) => j.status === 'completed').length;
  const totalRevenue = jobs.reduce((sum, j) => {
    if (j.serviceReport?.paidAmount) return sum + j.serviceReport.paidAmount;
    if (j.quote && (j.status === 'completed' || j.status === 'approved')) return sum + j.quote.totalAmount;
    return sum;
  }, 0);

  // Filtered jobs
  const filteredJobs = jobs.filter((job) => {
    if (selectedCategory !== 'all' && job.category !== selectedCategory) return false;
    if (selectedStatus !== 'all') {
      if (selectedStatus === 'pending' && job.status !== 'pending') return false;
      if (selectedStatus === 'diagnosed' && !job.diagnosis) return false;
      if (selectedStatus === 'quote' && !job.quote) return false;
      if (selectedStatus === 'completed' && job.status !== 'completed') return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = job.customer.fullName.toLowerCase().includes(q);
      const matchCode = job.trackingCode.toLowerCase().includes(q);
      const matchBrand = job.equipmentBrand.toLowerCase().includes(q);
      const matchModel = job.equipmentModel.toLowerCase().includes(q);
      const matchError = job.errorCode?.toLowerCase().includes(q) || false;
      if (!matchName && !matchCode && !matchBrand && !matchModel && !matchError) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-24 sm:pb-12">
      
      {/* Top Banner / Headline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Field Service & Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Technician service logs, AI diagnostics, instant quotes, and digital service reports
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-dash-fast-ai"
            onClick={onOpenAIGenericModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/20 transition active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quick AI Diagnosis Demo</span>
          </button>

          <button
            id="btn-dash-new-job"
            onClick={onOpenNewJob}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Job</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        
        <div className="p-4 rounded-2xl bg-slate-850/90 border border-slate-750">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Jobs</span>
            <ClipboardList className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white tracking-tight">{totalJobs}</div>
          <div className="text-[11px] text-slate-400 mt-1">Active & scheduled</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-850/90 border border-slate-750">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>AI Diagnosed</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-cyan-400 tracking-tight">{diagnosedCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Gemini 3.8 Flash</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-850/90 border border-slate-750">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Quotes Created</span>
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-blue-400 tracking-tight">{quotesCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">WhatsApp & SMS ready</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-850/90 border border-slate-750">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-400 tracking-tight">{completedCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Signed Work Orders</div>
        </div>

        <div className="col-span-2 lg:col-span-1 p-4 rounded-2xl bg-gradient-to-br from-slate-850 to-slate-800 border border-slate-750">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white tracking-tight">
            ${totalRevenue.toLocaleString('en-US')}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">Collected Revenue</div>
        </div>

      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-850/90 border border-slate-750 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customer, error code, brand or FX-8921..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Category Pill Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto py-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
              selectedCategory === 'all'
                ? 'bg-cyan-600 text-white font-semibold'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Categories
          </button>
          {SERVICE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-cyan-600 text-white font-semibold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="diagnosed">AI Diagnosed</option>
            <option value="quote">With Quote</option>
            <option value="completed">Completed</option>
          </select>
        </div>

      </div>

      {/* Jobs Grid */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onOpenDiagnosis={onOpenDiagnosis}
              onOpenQuote={onOpenQuote}
              onOpenReport={onOpenReport}
              onUpdateStatus={onUpdateStatus}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-750 bg-slate-850/40 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <ClipboardList className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Service Jobs Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No service records matched your current search filters. Try adjusting your search or create a new job.
          </p>
          <button
            onClick={onOpenNewJob}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Service Job</span>
          </button>
        </div>
      )}

    </div>
  );
};
