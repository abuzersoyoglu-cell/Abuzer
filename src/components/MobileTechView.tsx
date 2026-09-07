import React, { useState } from 'react';
import { 
  Sparkles, 
  Camera, 
  Phone, 
  MapPin, 
  Navigation, 
  MessageCircle, 
  FileText, 
  FileCheck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ArrowRight,
  Plus
} from 'lucide-react';
import { ServiceJob, JobStatus } from '../types';

interface MobileTechViewProps {
  jobs: ServiceJob[];
  onOpenDiagnosis: (job?: ServiceJob) => void;
  onOpenQuote: (job: ServiceJob) => void;
  onOpenReport: (job: ServiceJob) => void;
  onUpdateStatus: (jobId: string, status: JobStatus) => void;
  onOpenNewJob: () => void;
}

export const MobileTechView: React.FC<MobileTechViewProps> = ({
  jobs,
  onOpenDiagnosis,
  onOpenQuote,
  onOpenReport,
  onUpdateStatus,
  onOpenNewJob,
}) => {
  const [activeFilter, setActiveFilter] = useState<'today' | 'pending' | 'completed'>('today');

  const filteredJobs = jobs.filter((j) => {
    if (activeFilter === 'today') return j.status !== 'completed';
    if (activeFilter === 'pending') return j.status === 'pending';
    if (activeFilter === 'completed') return j.status === 'completed';
    return true;
  });

  return (
    <div className="max-w-md mx-auto space-y-4 pb-28">
      
      {/* Technician Profile & Quick Status Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-900/50 via-slate-850 to-slate-850 border border-cyan-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-cyan-600 flex items-center justify-center font-bold text-white text-base shadow-md shadow-cyan-600/30">
            AR
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-white">Alex Rivera</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <p className="text-[11px] text-cyan-300 font-medium">Lead Field Technician (FixFlow)</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400">Active Jobs</span>
          <div className="text-base font-bold text-white">
            {jobs.filter((j) => j.status !== 'completed').length} Tasks
          </div>
        </div>
      </div>

      {/* Giant Hero Action Button: Instant AI Scan for Field Tech */}
      <button
        id="btn-mobile-instant-ai-scan"
        onClick={() => onOpenDiagnosis()}
        className="w-full p-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-xl shadow-cyan-500/25 active:scale-[0.98] transition flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-200 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant On-Site AI Scan</span>
            </div>
            <div className="text-base font-extrabold text-white">
              Snap Photo & Diagnose Fault
            </div>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition">
          <ArrowRight className="w-4 h-4 text-white" />
        </div>
      </button>

      {/* Filter Tabs */}
      <div className="flex items-center p-1 rounded-xl bg-slate-800/80 border border-slate-750 text-xs">
        <button
          onClick={() => setActiveFilter('today')}
          className={`flex-1 py-2 text-center rounded-lg font-semibold transition ${
            activeFilter === 'today' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          Today's Jobs ({jobs.filter((j) => j.status !== 'completed').length})
        </button>
        <button
          onClick={() => setActiveFilter('pending')}
          className={`flex-1 py-2 text-center rounded-lg font-semibold transition ${
            activeFilter === 'pending' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setActiveFilter('completed')}
          className={`flex-1 py-2 text-center rounded-lg font-semibold transition ${
            activeFilter === 'completed' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          Completed ({jobs.filter((j) => j.status === 'completed').length})
        </button>
      </div>

      {/* Mobile Job List */}
      <div className="space-y-3">
        {filteredJobs.map((job) => (
          <div 
            key={job.id}
            className="p-4 rounded-2xl bg-slate-850 border border-slate-750/90 shadow-md space-y-3"
          >
            {/* Header row */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-mono text-[10px] font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/20">
                  {job.trackingCode}
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  {job.equipmentBrand} {job.equipmentModel}
                </h3>
              </div>

              {job.errorCode && (
                <span className="font-mono text-xs font-black px-2 py-1 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
                  {job.errorCode}
                </span>
              )}
            </div>

            {/* Complaint */}
            <p className="text-xs text-slate-300 line-clamp-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              {job.technicianComplaint}
            </p>

            {/* Customer & Location */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <div>
                <div className="font-semibold text-slate-200">{job.customer.fullName}</div>
                <div className="text-[11px] text-slate-400">{job.customer.district}, {job.customer.city}</div>
              </div>

              {/* Quick Communication Actions for Mobile */}
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${job.customer.phone}`}
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-750 text-cyan-400 flex items-center justify-center border border-slate-700 active:scale-95 transition"
                  title="Call Customer"
                >
                  <Phone className="w-4 h-4" />
                </a>

                <a
                  href={`https://wa.me/${job.customer.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 flex items-center justify-center border border-emerald-500/30 active:scale-95 transition"
                  title="WhatsApp Chat"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.customer.address + ' ' + job.customer.district)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 flex items-center justify-center border border-blue-500/30 active:scale-95 transition"
                  title="Open in Maps (Navigation)"
                >
                  <Navigation className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Field Status & AI Badges */}
            {job.diagnosis && (
              <div className="flex items-center justify-between p-2 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-xs">
                <span className="text-cyan-300 font-semibold flex items-center gap-1 text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  {job.diagnosis.diagnosisSummary}
                </span>
                <span className="text-[10px] text-cyan-400 font-bold">{job.diagnosis.confidenceScore}%</span>
              </div>
            )}

            {/* Primary Workflow Buttons for this Job */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => onOpenDiagnosis(job)}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition ${
                  job.diagnosis ? 'bg-slate-800 text-cyan-400 border border-slate-700' : 'bg-cyan-600 text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{job.diagnosis ? 'Diagnosis' : 'AI Diagnose'}</span>
              </button>

              <button
                onClick={() => onOpenQuote(job)}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition ${
                  job.quote ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'bg-slate-800 text-slate-200 border border-slate-700'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Quote</span>
              </button>

              <button
                onClick={() => onOpenReport(job)}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition ${
                  job.status === 'completed' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-200 border border-slate-700'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Report</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Add New Job Button for Field */}
      <button
        id="btn-mobile-new-job"
        onClick={onOpenNewJob}
        className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center justify-center gap-2 transition"
      >
        <Plus className="w-4 h-4 text-cyan-400" />
        <span>Create New Service Job</span>
      </button>

    </div>
  );
};
