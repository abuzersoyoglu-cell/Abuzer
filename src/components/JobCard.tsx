import React from 'react';
import { 
  Wrench, 
  Sparkles, 
  FileText, 
  FileCheck, 
  Phone, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  Send,
  Calendar
} from 'lucide-react';
import { ServiceJob, JobStatus } from '../types';

interface JobCardProps {
  job: ServiceJob;
  onOpenDiagnosis: (job: ServiceJob) => void;
  onOpenQuote: (job: ServiceJob) => void;
  onOpenReport: (job: ServiceJob) => void;
  onUpdateStatus: (jobId: string, status: JobStatus) => void;
  compact?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onOpenDiagnosis,
  onOpenQuote,
  onOpenReport,
  onUpdateStatus,
  compact = false,
}) => {
  const getStatusBadge = (status: JobStatus) => {
    switch (status) {
      case 'pending':
        return { label: 'Pending', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
      case 'diagnosing':
        return { label: 'Diagnosing', bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' };
      case 'diagnosed':
        return { label: 'AI Diagnosed', bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' };
      case 'quote_sent':
        return { label: 'Quote Sent', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
      case 'approved':
        return { label: 'Approved', bg: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' };
      case 'in_progress':
        return { label: 'In Progress', bg: 'bg-purple-500/10 text-purple-300 border-purple-500/20' };
      case 'completed':
        return { label: 'Completed', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
      case 'cancelled':
        return { label: 'Cancelled', bg: 'bg-slate-700 text-slate-400 border-slate-600' };
      default:
        return { label: 'Active', bg: 'bg-slate-700 text-slate-300 border-slate-600' };
    }
  };

  const statusBadge = getStatusBadge(job.status);

  return (
    <div className="group rounded-2xl bg-slate-850/90 border border-slate-750/80 hover:border-slate-700 transition shadow-md overflow-hidden flex flex-col justify-between">
      
      {/* Top Banner / Status */}
      <div className="p-4 sm:p-5 pb-3">
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-500/20">
              {job.trackingCode}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">{job.category}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {job.priority === 'urgent' && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1 animate-pulse">
                <AlertTriangle className="w-3 h-3" /> Urgent
              </span>
            )}
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${statusBadge.bg}`}>
              {statusBadge.label}
            </span>
          </div>
        </div>

        {/* Equipment & Brand */}
        <div className="mb-2">
          <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition flex items-center gap-2">
            <span>{job.equipmentBrand}</span>
            <span className="text-slate-300 font-semibold">{job.equipmentModel}</span>
            {job.errorCode && (
              <span className="font-mono text-xs font-extrabold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {job.errorCode}
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-300 line-clamp-2 mt-1">
            {job.technicianComplaint}
          </p>
        </div>

        {/* Customer & Location Details */}
        <div className="pt-2 border-t border-slate-800/80 space-y-1 text-xs text-slate-400">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200">{job.customer.fullName}</span>
            <a 
              href={`tel:${job.customer.phone}`}
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium"
            >
              <Phone className="w-3 h-3" />
              <span>{job.customer.phone}</span>
            </a>
          </div>

          <div className="flex items-center gap-1 text-slate-400 truncate">
            <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
            <span className="truncate">{job.customer.district}, {job.customer.address}</span>
          </div>
        </div>

        {/* AI Diagnosis Pill (if already generated) */}
        {job.diagnosis && (
          <div className="mt-3 p-2.5 rounded-xl bg-gradient-to-r from-cyan-950/40 to-slate-800 border border-cyan-500/20 text-xs">
            <div className="flex items-center justify-between text-cyan-300 font-semibold mb-1">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>AI Diagnosis: {job.diagnosis.severity} Severity</span>
              </span>
              <span className="text-[10px] text-slate-400">{job.diagnosis.confidenceScore}% Conf</span>
            </div>
            <p className="text-[11px] text-slate-300 line-clamp-1">
              {job.diagnosis.diagnosisSummary}
            </p>
          </div>
        )}

        {/* Quote Pill (if already created) */}
        {job.quote && (
          <div className="mt-2 p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs flex items-center justify-between">
            <span className="text-slate-300 text-[11px] flex items-center gap-1">
              <FileText className="w-3 h-3 text-emerald-400" />
              <span>Quote: <strong>{job.quote.quoteNumber}</strong></span>
            </span>
            <span className="font-bold text-emerald-400 text-xs">
              ${job.quote.totalAmount.toLocaleString('en-US')}
            </span>
          </div>
        )}
      </div>

      {/* Action Bar Footer */}
      <div className="p-3 bg-slate-900/80 border-t border-slate-800/90 flex items-center gap-1.5 justify-between text-xs">
        
        {/* Button 1: AI Diagnosis */}
        <button
          id={`btn-diagnose-${job.id}`}
          onClick={() => onOpenDiagnosis(job)}
          className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg font-semibold transition active:scale-95 ${
            job.diagnosis 
              ? 'bg-slate-800 hover:bg-slate-750 text-cyan-400 border border-slate-700' 
              : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm shadow-cyan-600/30'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{job.diagnosis ? 'Diagnosis' : 'AI Diagnose'}</span>
        </button>

        {/* Button 2: Quote */}
        <button
          id={`btn-quote-${job.id}`}
          onClick={() => onOpenQuote(job)}
          className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg font-semibold transition active:scale-95 ${
            job.quote
              ? 'bg-slate-800 hover:bg-slate-750 text-emerald-400 border border-slate-700'
              : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{job.quote ? 'Quote' : 'Create Quote'}</span>
        </button>

        {/* Button 3: Report / Fiş */}
        <button
          id={`btn-report-${job.id}`}
          onClick={() => onOpenReport(job)}
          className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg font-semibold transition active:scale-95 ${
            job.serviceReport || job.status === 'completed'
              ? 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30'
              : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>{job.status === 'completed' ? 'Report' : 'Service Report'}</span>
        </button>
      </div>

    </div>
  );
};
