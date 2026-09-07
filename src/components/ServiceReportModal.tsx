import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Printer, 
  CheckCircle2, 
  FileCheck, 
  Shield, 
  Calendar, 
  CreditCard, 
  Banknote, 
  RotateCcw,
  Sparkles,
  Camera
} from 'lucide-react';
import { ServiceJob, ServiceReport } from '../types';

interface ServiceReportModalProps {
  job: ServiceJob;
  isOpen: boolean;
  onClose: () => void;
  onSaveReport: (jobId: string, report: ServiceReport) => void;
}

export const ServiceReportModal: React.FC<ServiceReportModalProps> = ({
  job,
  isOpen,
  onClose,
  onSaveReport,
}) => {
  if (!isOpen) return null;

  const [actionsTaken, setActionsTaken] = useState<string[]>(
    job.serviceReport?.actionsTaken || [
      'Completed electrical and safety checks; isolated power to unit.',
      'Removed defective OEM component; cleaned housing and contact terminals.',
      'Installed new replacement component and verified pressure/gasket seals.',
      'Verified operating line pressure, flame sensor current, and electrical tolerances.',
      'Ran 20-minute full-load continuous burn and operating test cycle successfully.'
    ]
  );
  const [newActionInput, setNewActionInput] = useState('');
  
  const [replacedParts, setReplacedParts] = useState(
    job.serviceReport?.replacedParts || [
      { name: job.diagnosis?.requiredParts[0]?.partName || 'OEM Replacement Part', serial: 'SN-94021', warrantyMonths: 12 }
    ]
  );
  const [warrantyMonths, setWarrantyMonths] = useState<number>(job.serviceReport?.warrantyDurationMonths || 12);
  const [warrantyNotes, setWarrantyNotes] = useState<string>(
    job.serviceReport?.warrantyNotes || 'All replaced OEM components and technician labor are backed by FixFlow 1-Year Comprehensive Field Warranty.'
  );
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'pending' | 'credit_card' | 'bank_transfer' | 'cash'>(
    job.serviceReport?.paymentStatus || 'paid'
  );
  const [paidAmount, setPaidAmount] = useState<number>(
    job.serviceReport?.paidAmount || job.quote?.totalAmount || 180
  );
  const [finalNotes, setFinalNotes] = useState<string>(
    job.serviceReport?.finalNotes || 'Appliance restored to safe, peak operating condition and handed over to customer.'
  );

  // Digital Signature Canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(Boolean(job.serviceReport?.customerSignatureDataUrl));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // If existing signature exists
    if (job.serviceReport?.customerSignatureDataUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = job.serviceReport.customerSignatureDataUrl;
    }
  }, [isOpen]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const addActionItem = () => {
    if (!newActionInput.trim()) return;
    setActionsTaken([...actionsTaken, newActionInput.trim()]);
    setNewActionInput('');
  };

  const removeActionItem = (idx: number) => {
    setActionsTaken(actionsTaken.filter((_, i) => i !== idx));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveAndComplete = () => {
    let signatureUrl = job.serviceReport?.customerSignatureDataUrl;
    if (canvasRef.current && hasSignature) {
      signatureUrl = canvasRef.current.toDataURL('image/png');
    }

    const report: ServiceReport = {
      id: job.serviceReport?.id || `rep-${Date.now()}`,
      serviceJobId: job.id,
      reportNumber: job.serviceReport?.reportNumber || `SR-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      completedAt: new Date().toISOString(),
      technicianName: job.assignedTechnician || 'Alex Rivera (FixFlow)',
      actionsTaken,
      replacedParts,
      warrantyDurationMonths: warrantyMonths,
      warrantyNotes,
      customerSignatureDataUrl: signatureUrl,
      customerName: job.customer.fullName,
      beforePhotoUrl: job.photoUrl,
      finalNotes,
      paymentStatus,
      paidAmount,
    };

    onSaveReport(job.id, report);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-3xl max-h-[94vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden text-slate-100 print:max-h-none print:border-none print:shadow-none print:rounded-none print:bg-white print:text-black">
        
        {/* Header - Hidden in Print */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-850 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-600/20">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Official Service Report & Work Order</h2>
              <p className="text-xs text-slate-400">
                {job.trackingCode} — {job.customer.fullName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="btn-print-report"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Service Report Document Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 print:overflow-visible print:p-0 print:text-black">
          
          {/* Document Header */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-850/60 print:bg-transparent print:border-b-2 print:border-slate-800 print:rounded-none">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-tight text-white print:text-black">FixFlow AI</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-600 text-white">SERVICE WORK ORDER</span>
                </div>
                <p className="text-xs text-slate-400 print:text-slate-600 mt-0.5">
                  Digital Diagnostic, Repair & Warranty Certificate
                </p>
              </div>

              <div className="text-right text-xs">
                <div className="font-mono font-bold text-cyan-400 print:text-black text-sm">
                  {job.serviceReport?.reportNumber || `SR-${new Date().getFullYear()}-441`}
                </div>
                <div className="text-slate-400 print:text-slate-600 flex items-center gap-1 sm:justify-end mt-0.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date().toLocaleDateString('en-US')} {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Appliance Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-750 print:bg-slate-50 print:border-slate-300">
              <h3 className="font-bold text-slate-200 print:text-black mb-2 uppercase text-[11px] tracking-wider">
                Customer & Site Details
              </h3>
              <div className="space-y-1 text-slate-300 print:text-slate-800">
                <p><strong>Name:</strong> {job.customer.fullName}</p>
                <p><strong>Phone:</strong> {job.customer.phone}</p>
                <p><strong>Address:</strong> {job.customer.address}, {job.customer.district}, {job.customer.city}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-750 print:bg-slate-50 print:border-slate-300">
              <h3 className="font-bold text-slate-200 print:text-black mb-2 uppercase text-[11px] tracking-wider">
                Equipment & Fault Details
              </h3>
              <div className="space-y-1 text-slate-300 print:text-slate-800">
                <p><strong>Category:</strong> {job.category}</p>
                <p><strong>Brand / Model:</strong> {job.equipmentBrand} {job.equipmentModel}</p>
                <p><strong>Error Code:</strong> <span className="font-mono font-bold text-cyan-400 print:text-black">{job.errorCode || 'Diagnostic Inspection'}</span></p>
                <p><strong>Technician:</strong> {job.assignedTechnician}</p>
              </div>
            </div>
          </div>

          {/* Actions Taken Section */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-750 print:bg-transparent print:border-slate-300 text-xs">
            <h3 className="font-bold text-slate-200 print:text-black mb-2 uppercase text-[11px] tracking-wider flex items-center justify-between">
              <span>Work Performed & Maintenance Steps</span>
              <span className="text-[10px] text-slate-400 print:hidden">{actionsTaken.length} Steps</span>
            </h3>
            
            <div className="space-y-1.5 text-slate-300 print:text-slate-800">
              {actionsTaken.map((action, idx) => (
                <div key={idx} className="flex items-start justify-between gap-2 p-1.5 rounded bg-slate-850/80 print:bg-slate-50">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5 print:text-black" />
                    <span>{action}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeActionItem(idx)}
                    className="text-slate-500 hover:text-red-400 print:hidden text-[10px]"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>

            {/* Quick add custom action row (hidden in print) */}
            <div className="mt-2.5 flex items-center gap-2 print:hidden">
              <input
                type="text"
                value={newActionInput}
                onChange={(e) => setNewActionInput(e.target.value)}
                placeholder="Add new repair/service step..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
              />
              <button
                type="button"
                onClick={addActionItem}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium"
              >
                Add
              </button>
            </div>
          </div>

          {/* Replaced Parts & Warranty Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-750 print:bg-transparent print:border-slate-300">
              <h3 className="font-bold text-slate-200 print:text-black mb-2 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-cyan-400 print:text-black" />
                Replaced OEM Components
              </h3>
              <div className="space-y-1.5">
                {replacedParts.map((p, idx) => (
                  <div key={idx} className="p-2 rounded bg-slate-850 print:bg-slate-50 flex items-center justify-between">
                    <span className="font-semibold text-slate-200 print:text-black">{p.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 print:bg-slate-200 print:text-black font-bold">
                      {p.warrantyMonths} Months Warranty
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-750 print:bg-transparent print:border-slate-300 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-200 print:text-black mb-1.5 uppercase text-[11px] tracking-wider">
                  Service Warranty Terms
                </h3>
                <p className="text-slate-300 print:text-slate-700 text-[11px] leading-relaxed">
                  {warrantyNotes}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-750 print:border-slate-200 flex items-center justify-between font-bold">
                <span className="text-slate-300 print:text-black">Amount Collected:</span>
                <span className="text-base text-cyan-400 print:text-black font-mono">${paidAmount.toLocaleString('en-US')}</span>
              </div>
            </div>
          </div>

          {/* Customer Signature Pad */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-750 print:bg-transparent print:border-slate-300">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-bold text-xs text-slate-200 print:text-black uppercase tracking-wider">
                  Customer Acceptance & Digital Signature
                </h3>
                <p className="text-[11px] text-slate-400 print:text-slate-600">
                  I confirm that the equipment was inspected and returned in safe, working order.
                </p>
              </div>
              <button
                type="button"
                onClick={clearSignature}
                className="text-[11px] text-slate-400 hover:text-cyan-400 flex items-center gap-1 print:hidden"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear Signature</span>
              </button>
            </div>

            <div className="relative rounded-xl border border-slate-700 bg-slate-950/80 print:bg-white print:border-slate-400 overflow-hidden">
              <canvas
                ref={canvasRef}
                width={500}
                height={120}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-28 cursor-crosshair touch-none"
              />
              {!hasSignature && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-xs text-slate-600 print:text-slate-400">
                  Sign here using finger or mouse
                </div>
              )}
            </div>
            
            <div className="flex justify-between text-[11px] text-slate-400 print:text-slate-600 mt-1.5">
              <span>Customer: {job.customer.fullName}</span>
              <span>Date: {new Date().toLocaleDateString('en-US')}</span>
            </div>
          </div>

        </div>

        {/* Action Footer - Hidden in Print */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-850 print:hidden flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-400">
            Saving the signed work order will transition this job to "Completed" status.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold border border-slate-700 transition"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>Print / PDF</span>
            </button>

            <button
              id="btn-save-complete-report"
              type="button"
              onClick={handleSaveAndComplete}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold shadow-lg shadow-emerald-600/20 transition active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Sign & Complete Job</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
