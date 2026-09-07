import React from 'react';
import { 
  ClipboardList, 
  Sparkles, 
  FileText, 
  PlusCircle, 
  CheckCircle 
} from 'lucide-react';

interface BottomNavProps {
  activeTab: 'jobs' | 'diagnose' | 'quotes' | 'reports';
  onTabChange: (tab: 'jobs' | 'diagnose' | 'quotes' | 'reports') => void;
  onQuickNewJob: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onQuickNewJob,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-4 py-2 flex items-center justify-around sm:hidden">
      <button
        onClick={() => onTabChange('jobs')}
        className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition ${
          activeTab === 'jobs' ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <ClipboardList className="w-5 h-5" />
        <span className="text-[10px]">Jobs</span>
      </button>

      <button
        onClick={() => onTabChange('quotes')}
        className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition ${
          activeTab === 'quotes' ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <FileText className="w-5 h-5" />
        <span className="text-[10px]">Quotes</span>
      </button>

      {/* Floating Center Action Button for AI / New Job */}
      <button
        onClick={() => onTabChange('diagnose')}
        className="flex flex-col items-center -mt-6 group"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/40 group-active:scale-95 transition border-4 border-slate-900">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <span className="text-[10px] font-bold text-cyan-400 mt-0.5">AI Diagnose</span>
      </button>

      <button
        onClick={() => onTabChange('reports')}
        className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition ${
          activeTab === 'reports' ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <CheckCircle className="w-5 h-5" />
        <span className="text-[10px]">Reports</span>
      </button>

      <button
        onClick={onQuickNewJob}
        className="flex flex-col items-center gap-1 py-1 px-2 text-slate-400 hover:text-cyan-400 transition"
      >
        <PlusCircle className="w-5 h-5" />
        <span className="text-[10px]">New Job</span>
      </button>
    </div>
  );
};
