import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Calendar, 
  User, 
  Phone, 
  MapPin, 
  Wrench, 
  AlertCircle,
  Clock
} from 'lucide-react';
import { ServiceJob, EquipmentCategory, JobPriority } from '../types';
import { SERVICE_CATEGORIES, POPULAR_BRANDS, COMMON_ERROR_CODES } from '../data/mockData';
import { generateTrackingCode } from '../lib/storage';

interface NewJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddJob: (job: ServiceJob) => void;
}

export const NewJobModal: React.FC<NewJobModalProps> = ({
  isOpen,
  onClose,
  onAddJob,
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('Capitol Hill');
  const [city, setCity] = useState('Seattle');
  
  const [category, setCategory] = useState<EquipmentCategory>('HVAC & Heating');
  const [brand, setBrand] = useState('Carrier');
  const [model, setModel] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [complaint, setComplaint] = useState('');
  const [priority, setPriority] = useState<JobPriority>('normal');
  const [scheduledSlot, setScheduledSlot] = useState('Today, 2:00 PM - 4:00 PM');

  const popularBrands = POPULAR_BRANDS[category] || ['Carrier', 'Daikin', 'Bosch', 'Trane', 'Lennox'];
  const errorHints = COMMON_ERROR_CODES[brand] || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim()) {
      alert('Please fill in at least the customer name and phone number.');
      return;
    }

    const newJob: ServiceJob = {
      id: `job-${Date.now()}`,
      trackingCode: generateTrackingCode(),
      customerId: `cust-${Date.now()}`,
      customer: {
        id: `cust-${Date.now()}`,
        fullName: customerName.trim(),
        phone: phone.trim(),
        address: address.trim() || 'Address not specified',
        district,
        city,
      },
      category,
      equipmentBrand: brand,
      equipmentModel: model.trim() || 'Unspecified Model',
      errorCode: errorCode.trim() || undefined,
      technicianComplaint: complaint.trim() || 'Diagnostic inspection and general service check',
      priority,
      status: 'pending',
      createdAt: new Date().toISOString(),
      scheduledDate: 'Today',
      scheduledTimeSlot: scheduledSlot,
      assignedTechnician: 'Alex Rivera (You)',
    };

    onAddJob(newJob);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center text-white shadow-md shadow-cyan-600/20">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Create New Service Job</h2>
              <p className="text-xs text-slate-400">Instant field dispatch ticket for technicians</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
          
          {/* Customer info */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              Customer & Contact Details
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Michael Thorne"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +1 (555) 234-8921"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-slate-400 mb-1">Street Address (Street / Apt / Suite)</label>
                <input
                  type="text"
                  placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Neighborhood / District</label>
                <input
                  type="text"
                  placeholder="e.g. Capitol Hill"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Equipment & Fault Info */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h3 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-cyan-400" />
              Equipment & Diagnostic Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => {
                    const c = e.target.value as EquipmentCategory;
                    setCategory(c);
                    if (POPULAR_BRANDS[c]?.[0]) setBrand(POPULAR_BRANDS[c][0]);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
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
                  list="brand-list"
                  placeholder="e.g. Carrier"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                />
                <datalist id="brand-list">
                  {popularBrands.map((b) => (
                    <option key={b} value={b} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Model</label>
                <input
                  type="text"
                  placeholder="e.g. Infinity 98 Furnace"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Display Error Code (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. F28, E18, CH-05"
                  value={errorCode}
                  onChange={(e) => setErrorCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-cyan-400 font-mono font-bold focus:outline-none focus:border-cyan-500"
                />
                {errorHints.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {errorHints.slice(0, 3).map((hint) => (
                      <button
                        key={hint}
                        type="button"
                        onClick={() => setErrorCode(hint.split(' ')[0])}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-750 text-slate-400"
                      >
                        {hint}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Priority Level</label>
                <div className="flex items-center gap-3 pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      checked={priority === 'normal'}
                      onChange={() => setPriority('normal')}
                      className="accent-cyan-500"
                    />
                    <span className="text-slate-200">Normal</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      checked={priority === 'urgent'}
                      onChange={() => setPriority('urgent')}
                      className="accent-red-500"
                    />
                    <span className="text-red-400 font-bold">Urgent Call (Emergency)</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Customer Complaint / Symptoms</label>
              <textarea
                rows={2}
                placeholder="e.g. Unit fails to produce heat, short cycles, clicks 3 times and displays F28 fault code."
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Footer buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-600/30 transition active:scale-95"
            >
              Create Service Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
