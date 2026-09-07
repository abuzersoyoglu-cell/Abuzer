import React, { useState, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Camera, 
  Upload, 
  AlertTriangle, 
  CheckCircle2, 
  Wrench, 
  Clock, 
  ArrowRight, 
  Mic, 
  MicOff, 
  FileText, 
  Zap, 
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { ServiceJob, AIDiagnosisResult, EquipmentCategory } from '../types';
import { SERVICE_CATEGORIES, POPULAR_BRANDS, COMMON_ERROR_CODES } from '../data/mockData';

interface AIDiagnosisModalProps {
  job?: ServiceJob;
  isOpen: boolean;
  onClose: () => void;
  onSaveDiagnosis: (jobId: string, diagnosis: AIDiagnosisResult) => void;
  onGenerateQuoteFromDiagnosis: (jobId: string, diagnosis: AIDiagnosisResult) => void;
}

export const AIDiagnosisModal: React.FC<AIDiagnosisModalProps> = ({
  job,
  isOpen,
  onClose,
  onSaveDiagnosis,
  onGenerateQuoteFromDiagnosis,
}) => {
  if (!isOpen) return null;

  const [category, setCategory] = useState<EquipmentCategory>(job?.category || 'HVAC & Heating');
  const [brand, setBrand] = useState<string>(job?.equipmentBrand || 'Carrier');
  const [model, setModel] = useState<string>(job?.equipmentModel || 'Infinity 98 Gas Furnace');
  const [errorCode, setErrorCode] = useState<string>(job?.errorCode || 'F28');
  const [technicianNotes, setTechnicianNotes] = useState<string>(
    job?.technicianComplaint || 'Furnace attempts ignition 3 times, burner fails to sustain flame, locks out with Error 28. Gas valve is open.'
  );
  const [imagePreview, setImagePreview] = useState<string | null>(job?.photoUrl || null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<AIDiagnosisResult | null>(job?.diagnosis || null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick preset loader for fast testing
  const loadPreset = (presetType: 'carrier' | 'daikin' | 'bosch') => {
    if (presetType === 'carrier') {
      setCategory('HVAC & Heating');
      setBrand('Carrier');
      setModel('Infinity 98 Gas Furnace');
      setErrorCode('F28');
      setTechnicianNotes('Ignition sequence repeats 3 times, burner fails to ignite, system enters F28 lockout. Gas line pressure is stable.');
      setImagePreview('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80');
    } else if (presetType === 'daikin') {
      setCategory('Air Conditioning & Cooling');
      setBrand('Daikin');
      setModel('Sensira Inverter 12k BTU');
      setErrorCode('CH-05');
      setTechnicianNotes('Indoor blower fan runs normally but blows warm air. Outdoor condenser fan spins then trips on thermal overload. Slight oil residue found near flare joint.');
      setImagePreview('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80');
    } else {
      setCategory('Major Appliances');
      setBrand('Bosch');
      setModel('800 Series Front Load Washer');
      setErrorCode('E18');
      setTechnicianNotes('Wash cycle halts at drainage stage. Low humming sound from pump area; water remains trapped in drum.');
      setImagePreview('https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80');
    }
  };

  // Image Upload handler
  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Web Speech recognition for hands-free voice notes from technicians
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support the Web Speech API. Please type your notes into the text field.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setTechnicianNotes((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  // Run AI Diagnosis via server.ts -> Gemini 3.8 Flash
  const handleRunDiagnosis = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ai/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          equipmentBrand: brand,
          equipmentModel: model,
          errorCode,
          technicianNotes,
          imageBase64: imagePreview,
        }),
      });

      const data = await res.json();
      if (data.success && data.diagnosis) {
        const result: AIDiagnosisResult = {
          ...data.diagnosis,
          photoUrl: imagePreview || undefined,
          diagnosedAt: new Date().toISOString(),
        };
        setDiagnosisResult(result);
        if (job) {
          onSaveDiagnosis(job.id, result);
        }
      } else {
        setErrorMsg('Failed to receive AI diagnosis. Please verify your details and try again.');
      }
    } catch (err: any) {
      console.error('Diagnosis request error:', err);
      setErrorMsg(err?.message || 'An error occurred while communicating with the diagnostic server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">FixFlow AI Diagnostic Assistant</h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {job ? `${job.trackingCode} — ${job.customer.fullName}` : 'Field Photo + Technician Symptoms Analysis'}
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Quick Presets for Immediate One-Click Testing */}
          <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-slate-800/60 border border-slate-750 text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Quick Field Scenarios:
            </span>
            <button
              type="button"
              onClick={() => loadPreset('carrier')}
              className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-650 text-slate-200 transition"
            >
              🔥 Carrier F28 Ignition Fault
            </button>
            <button
              type="button"
              onClick={() => loadPreset('daikin')}
              className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-650 text-slate-200 transition"
            >
              ❄️ Daikin AC Refrigerant Leak
            </button>
            <button
              type="button"
              onClick={() => loadPreset('bosch')}
              className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-650 text-slate-200 transition"
            >
              🌀 Bosch Washer E18 Drain Pump
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Input Form & Photo */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Photo Upload Area */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Equipment / Fault Photo (Camera or File)
                </label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative group cursor-pointer border-2 border-dashed rounded-xl overflow-hidden transition flex flex-col items-center justify-center text-center ${
                    imagePreview ? 'border-cyan-500/40 bg-slate-950' : 'border-slate-750 hover:border-cyan-500/60 bg-slate-800/40 p-6'
                  }`}
                  style={{ minHeight: '160px' }}
                >
                  {imagePreview ? (
                    <div className="relative w-full h-44">
                      <img 
                        src={imagePreview} 
                        alt="Fault Preview" 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-medium">
                        Change Photo
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
                        <Camera className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-200">Snap Photo or Upload</p>
                        <p className="text-[11px] text-slate-400">Furnace, circuit board, valve, error screen, etc.</p>
                      </div>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageFile}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Equipment details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as EquipmentCategory)}
                    className="w-full px-2.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                  >
                    {SERVICE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Brand</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Carrier"
                    className="w-full px-2.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Model</label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. Infinity 98"
                    className="w-full px-2.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Display Error Code</label>
                  <input
                    type="text"
                    value={errorCode}
                    onChange={(e) => setErrorCode(e.target.value)}
                    placeholder="e.g. F28, E18, CH-05"
                    className="w-full px-2.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-cyan-500 text-cyan-400"
                  />
                </div>
              </div>

              {/* Technician Voice / Text Note */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Field Observations & Voice Note
                  </label>
                  <button
                    type="button"
                    onClick={toggleSpeechRecognition}
                    className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md font-medium transition ${
                      isListening
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-slate-800 text-cyan-400 hover:bg-slate-750'
                    }`}
                  >
                    {isListening ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                    <span>{isListening ? 'Listening...' : 'Voice Dictation'}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={technicianNotes}
                  onChange={(e) => setTechnicianNotes(e.target.value)}
                  placeholder="Type observations or speak into mic: Component noise, leakage, smell, multimeter readings..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Run Diagnosis Button */}
              <button
                id="btn-run-ai-diagnosis"
                type="button"
                disabled={isLoading}
                onClick={handleRunDiagnosis}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-cyan-600/30 active:scale-[0.99] transition disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Gemini AI Analyzing Symptoms...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze & Diagnose with Gemini AI</span>
                  </>
                )}
              </button>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            {/* Right Column: Interactive Diagnosis Results */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              {diagnosisResult ? (
                <div className="space-y-4 animate-fadeIn">
                  
                  {/* Summary Card */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800 to-slate-850 border border-slate-700/80 shadow-md">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            diagnosisResult.severity === 'High' || diagnosisResult.severity === 'Yüksek'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : diagnosisResult.severity === 'Medium' || diagnosisResult.severity === 'Orta'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}>
                            {diagnosisResult.severity} Severity
                          </span>
                          <span className="text-xs font-semibold text-cyan-400">
                            Confidence: {diagnosisResult.confidenceScore}%
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white mt-1">
                          {diagnosisResult.diagnosisSummary}
                        </h3>
                      </div>
                      <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    </div>

                    <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                      {diagnosisResult.customerSummary}
                    </p>
                  </div>

                  {/* Root Causes */}
                  <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-750">
                    <h4 className="text-xs font-bold text-slate-200 mb-2 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                      Identified Root Causes
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {diagnosisResult.rootCauses.map((cause, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                          <span>{cause}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Step-by-Step Repair Guide for Technician */}
                  <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-750">
                    <h4 className="text-xs font-bold text-slate-200 mb-2 flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                      Recommended Repair Steps
                    </h4>
                    <div className="space-y-1.5 text-xs text-slate-300">
                      {diagnosisResult.repairSteps.map((step, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Required Parts & Suggested Labor */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-750">
                      <h4 className="text-xs font-bold text-slate-200 mb-2 flex items-center justify-between">
                        <span>Required OEM Parts</span>
                        <span className="text-[10px] text-cyan-400">{diagnosisResult.requiredParts.length} Items</span>
                      </h4>
                      <div className="space-y-2">
                        {diagnosisResult.requiredParts.map((part, idx) => (
                          <div key={idx} className="text-xs p-2 rounded-lg bg-slate-900/70 border border-slate-800">
                            <div className="font-semibold text-slate-200">{part.partName}</div>
                            <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                              <span>Est: ${part.estimatedCostMin} - ${part.estimatedCostMax}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-amber-300">{part.urgency}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-750 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-200 mb-2 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-cyan-400" />
                          Estimated Labor & Duration
                        </h4>
                        <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 text-xs space-y-1.5">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Est. Labor Time:</span>
                            <span className="font-semibold text-white">{diagnosisResult.suggestedLabor.laborDurationHours} hrs</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Recommended Labor Fee:</span>
                            <span className="font-bold text-cyan-400">${diagnosisResult.suggestedLabor.suggestedLaborFee}</span>
                          </div>
                        </div>
                      </div>

                      {/* Safety Warning */}
                      {diagnosisResult.safetyWarnings.length > 0 && (
                        <div className="mt-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
                          <strong>Safety Warning:</strong> {diagnosisResult.safetyWarnings[0]}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      id="btn-auto-generate-quote"
                      type="button"
                      onClick={() => {
                        if (job) {
                          onGenerateQuoteFromDiagnosis(job.id, diagnosisResult);
                        } else {
                          alert('Diagnosis saved to local state. Please select an existing job or create a new job to attach this quote.');
                        }
                      }}
                      className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/20 transition active:scale-95"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Generate Instant Customer Quote from Diagnosis</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                /* Empty state when no diagnosis generated yet */
                <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-8 rounded-2xl border border-slate-800 bg-slate-850/50 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800 text-cyan-400 flex items-center justify-center shadow-inner">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div className="max-w-md space-y-1.5">
                    <h3 className="text-base font-bold text-white">Awaiting AI Diagnostic Analysis</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Upload or snap a photo on the left, add technician notes, or click one of the quick scenario presets above to see how FixFlow AI diagnoses faults and prepares an itemized quote in seconds.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Powered by Gemini 3.8 Flash multimodal vision & technical reasoning</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
