import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { MobileTechView } from './components/MobileTechView';
import { LandingPageView } from './components/LandingPageView';
import { AIDiagnosisModal } from './components/AIDiagnosisModal';
import { QuoteGeneratorModal } from './components/QuoteGeneratorModal';
import { ServiceReportModal } from './components/ServiceReportModal';
import { NewJobModal } from './components/NewJobModal';
import { SupabaseSetupModal } from './components/SupabaseSetupModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { 
  ServiceJob, 
  JobStatus, 
  AIDiagnosisResult, 
  Quote, 
  ServiceReport, 
  SupabaseConfig 
} from './types';
import { 
  loadServiceJobs, 
  saveServiceJobs, 
  loadSupabaseConfig, 
  saveSupabaseConfig 
} from './lib/storage';

export default function App() {
  const [jobs, setJobs] = useState<ServiceJob[]>(() => loadServiceJobs());
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(() => loadSupabaseConfig());
  const [currentView, setCurrentView] = useState<'dashboard' | 'mobile-tech' | 'landing'>('dashboard');

  // Modal states
  const [isDiagnosisOpen, setIsDiagnosisOpen] = useState(false);
  const [activeJobForDiagnosis, setActiveJobForDiagnosis] = useState<ServiceJob | undefined>(undefined);

  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [activeJobForQuote, setActiveJobForQuote] = useState<ServiceJob | undefined>(undefined);

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [activeJobForReport, setActiveJobForReport] = useState<ServiceJob | undefined>(undefined);

  const [isNewJobOpen, setIsNewJobOpen] = useState(false);
  const [isSupabaseOpen, setIsSupabaseOpen] = useState(false);

  // Synchronize state changes to localStorage
  useEffect(() => {
    saveServiceJobs(jobs);
  }, [jobs]);

  // Handlers for Modals & Workflow
  const handleOpenDiagnosis = (job?: ServiceJob) => {
    setActiveJobForDiagnosis(job);
    setIsDiagnosisOpen(true);
  };

  const handleSaveDiagnosis = (jobId: string, diagnosis: AIDiagnosisResult) => {
    setJobs((prevJobs) =>
      prevJobs.map((j) => {
        if (j.id === jobId) {
          return {
            ...j,
            diagnosis,
            status: j.status === 'pending' ? 'diagnosed' : j.status,
          };
        }
        return j;
      })
    );
  };

  const handleGenerateQuoteFromDiagnosis = (jobId: string, diagnosis: AIDiagnosisResult) => {
    handleSaveDiagnosis(jobId, diagnosis);
    setIsDiagnosisOpen(false);

    // Immediately open quote modal for this job
    const targetJob = jobs.find((j) => j.id === jobId);
    if (targetJob) {
      setActiveJobForQuote({
        ...targetJob,
        diagnosis,
      });
      setIsQuoteOpen(true);
    }
  };

  const handleOpenQuote = (job: ServiceJob) => {
    setActiveJobForQuote(job);
    setIsQuoteOpen(true);
  };

  const handleSaveQuote = (jobId: string, quote: Quote, nextStatus?: 'quote_sent' | 'approved') => {
    setJobs((prevJobs) =>
      prevJobs.map((j) => {
        if (j.id === jobId) {
          return {
            ...j,
            quote,
            status: nextStatus ? nextStatus : j.status === 'pending' || j.status === 'diagnosed' ? 'quote_sent' : j.status,
          };
        }
        return j;
      })
    );
  };

  const handleOpenReport = (job: ServiceJob) => {
    setActiveJobForReport(job);
    setIsReportOpen(true);
  };

  const handleSaveReport = (jobId: string, report: ServiceReport) => {
    setJobs((prevJobs) =>
      prevJobs.map((j) => {
        if (j.id === jobId) {
          return {
            ...j,
            serviceReport: report,
            status: 'completed',
          };
        }
        return j;
      })
    );
  };

  const handleUpdateStatus = (jobId: string, status: JobStatus) => {
    setJobs((prevJobs) =>
      prevJobs.map((j) => (j.id === jobId ? { ...j, status } : j))
    );
  };

  const handleAddNewJob = (newJob: ServiceJob) => {
    setJobs((prev) => [newJob, ...prev]);
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(jobs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `fixflow_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onViewChange={(v) => setCurrentView(v)}
        onOpenNewJob={() => setIsNewJobOpen(true)}
        onOpenSupabase={() => setIsSupabaseOpen(true)}
        totalJobsCount={jobs.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentView === 'dashboard' && (
          <DashboardView
            jobs={jobs}
            onOpenDiagnosis={handleOpenDiagnosis}
            onOpenQuote={handleOpenQuote}
            onOpenReport={handleOpenReport}
            onUpdateStatus={handleUpdateStatus}
            onOpenNewJob={() => setIsNewJobOpen(true)}
            onOpenAIGenericModal={() => handleOpenDiagnosis()}
          />
        )}

        {currentView === 'mobile-tech' && (
          <MobileTechView
            jobs={jobs}
            onOpenDiagnosis={handleOpenDiagnosis}
            onOpenQuote={handleOpenQuote}
            onOpenReport={handleOpenReport}
            onUpdateStatus={handleUpdateStatus}
            onOpenNewJob={() => setIsNewJobOpen(true)}
          />
        )}

        {currentView === 'landing' && (
          <LandingPageView
            onEnterApp={(view = 'mobile-tech') => setCurrentView(view)}
            onOpenAIDiagnosisDemo={() => handleOpenDiagnosis()}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (Visible on small screens when not in landing view) */}
      {currentView !== 'landing' && (
        <BottomNav
          activeTab={currentView === 'mobile-tech' ? 'jobs' : 'jobs'}
          onTabChange={(tab) => {
            if (tab === 'jobs') setCurrentView('mobile-tech');
            else if (tab === 'diagnose') handleOpenDiagnosis();
            else if (tab === 'quotes') {
              const jobWithQuote = jobs.find((j) => !!j.quote) || jobs[0];
              if (jobWithQuote) handleOpenQuote(jobWithQuote);
            } else if (tab === 'reports') {
              const jobCompleted = jobs.find((j) => j.status === 'completed') || jobs[0];
              if (jobCompleted) handleOpenReport(jobCompleted);
            }
          }}
          onQuickNewJob={() => setIsNewJobOpen(true)}
        />
      )}

      {/* Modals */}
      {isDiagnosisOpen && (
        <AIDiagnosisModal
          job={activeJobForDiagnosis}
          isOpen={isDiagnosisOpen}
          onClose={() => setIsDiagnosisOpen(false)}
          onSaveDiagnosis={handleSaveDiagnosis}
          onGenerateQuoteFromDiagnosis={handleGenerateQuoteFromDiagnosis}
        />
      )}

      {isQuoteOpen && activeJobForQuote && (
        <QuoteGeneratorModal
          job={activeJobForQuote}
          isOpen={isQuoteOpen}
          onClose={() => setIsQuoteOpen(false)}
          onSaveQuote={handleSaveQuote}
        />
      )}

      {isReportOpen && activeJobForReport && (
        <ServiceReportModal
          job={activeJobForReport}
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          onSaveReport={handleSaveReport}
        />
      )}

      {isNewJobOpen && (
        <NewJobModal
          isOpen={isNewJobOpen}
          onClose={() => setIsNewJobOpen(false)}
          onAddJob={handleAddNewJob}
        />
      )}

      {isSupabaseOpen && (
        <SupabaseSetupModal
          isOpen={isSupabaseOpen}
          onClose={() => setIsSupabaseOpen(false)}
          config={supabaseConfig}
          onUpdateConfig={(cfg) => setSupabaseConfig(cfg)}
          onExportData={handleExportData}
        />
      )}

      {/* PWA Offline indicator */}
      <OfflineIndicator />
    </div>
  );
}
