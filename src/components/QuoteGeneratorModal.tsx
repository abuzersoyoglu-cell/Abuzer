import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Share2, 
  Send, 
  CheckCircle, 
  Copy, 
  FileText, 
  MessageSquare, 
  Sparkles,
  Check
} from 'lucide-react';
import { ServiceJob, Quote, QuoteItem } from '../types';

interface QuoteGeneratorModalProps {
  job: ServiceJob;
  isOpen: boolean;
  onClose: () => void;
  onSaveQuote: (jobId: string, quote: Quote, nextStatus?: 'quote_sent' | 'approved') => void;
}

export const QuoteGeneratorModal: React.FC<QuoteGeneratorModalProps> = ({
  job,
  isOpen,
  onClose,
  onSaveQuote,
}) => {
  if (!isOpen) return null;

  // Initialize items from existing quote or AI diagnosis
  const initialItems: QuoteItem[] = job.quote?.items || [
    ...(job.diagnosis?.requiredParts.map((p, i) => ({
      id: `part-${i}`,
      description: p.partName,
      type: 'part' as const,
      quantity: 1,
      unitPrice: Math.round((p.estimatedCostMin + p.estimatedCostMax) / 2),
      totalPrice: Math.round((p.estimatedCostMin + p.estimatedCostMax) / 2),
    })) || []),
    {
      id: 'labor-1',
      description: `${job.category} Diagnostic, Testing & Labor`,
      type: 'labor' as const,
      quantity: 1,
      unitPrice: job.diagnosis?.suggestedLabor.suggestedLaborFee || 120,
      totalPrice: job.diagnosis?.suggestedLabor.suggestedLaborFee || 120,
    }
  ];

  const [items, setItems] = useState<QuoteItem[]>(
    initialItems.length > 0 ? initialItems : [
      { id: '1', description: 'Standard Service Call & Diagnostic Labor', type: 'labor', quantity: 1, unitPrice: 120, totalPrice: 120 }
    ]
  );
  const [taxRate, setTaxRate] = useState<number>(job.quote?.taxRate ?? 8);
  const [discountAmount, setDiscountAmount] = useState<number>(job.quote?.discountAmount ?? 0);
  const [notes, setNotes] = useState<string>(
    job.quote?.notes || 'All quoted OEM parts include a 1-year warranty on parts and labor. Estimate is valid for 7 days.'
  );
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  // New item quick row input
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemType, setNewItemType] = useState<'part' | 'labor'>('part');

  const addItem = () => {
    if (!newItemDesc || !newItemPrice) return;
    const price = parseFloat(newItemPrice) || 0;
    const item: QuoteItem = {
      id: `item-${Date.now()}`,
      description: newItemDesc,
      type: newItemType,
      quantity: 1,
      unitPrice: price,
      totalPrice: price,
    };
    setItems([...items, item]);
    setNewItemDesc('');
    setNewItemPrice('');
  };

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const updateItemQty = (id: string, qty: number) => {
    if (qty < 1) return;
    setItems(
      items.map((it) => (it.id === id ? { ...it, quantity: qty, totalPrice: it.unitPrice * qty } : it))
    );
  };

  const updateItemPrice = (id: string, price: number) => {
    setItems(
      items.map((it) => (it.id === id ? { ...it, unitPrice: price, totalPrice: price * it.quantity } : it))
    );
  };

  // Computations
  const subtotal = items.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const taxAmount = Math.round((subtotal * taxRate) / 100);
  const totalAmount = Math.max(0, subtotal + taxAmount - discountAmount);

  // Build the Quote object
  const buildQuoteObject = (status: 'draft' | 'sent' | 'accepted' = 'sent'): Quote => {
    return {
      id: job.quote?.id || `qt-${Date.now()}`,
      serviceJobId: job.id,
      quoteNumber: job.quote?.quoteNumber || `EST-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: job.quote?.createdAt || new Date().toISOString(),
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      items,
      subtotal,
      taxRate,
      taxAmount,
      discountAmount,
      totalAmount,
      notes,
      status,
      sentVia: 'whatsapp',
    };
  };

  // WhatsApp formatted text generator
  const generateWhatsAppMessage = () => {
    const quote = buildQuoteObject('sent');
    const itemsList = items
      .map((it) => `• ${it.description} (${it.quantity}x) - $${it.totalPrice.toLocaleString('en-US')}`)
      .join('\n');

    return `Dear ${job.customer.fullName},

Here is your itemized service & repair estimate from FixFlow AI for your ${job.equipmentBrand} ${job.equipmentModel}:

📋 *Estimate #:* ${quote.quoteNumber}
📅 *Equipment:* ${job.equipmentBrand} ${job.equipmentModel} (Issue: ${job.errorCode || 'Diagnostic Inspection'})

*Itemized Breakdown:*
${itemsList}

💰 *Subtotal:* $${subtotal.toLocaleString('en-US')}
🏛️ *Tax (${taxRate}%):* $${taxAmount.toLocaleString('en-US')}
${discountAmount > 0 ? `🏷️ *Discount:* -$${discountAmount.toLocaleString('en-US')}\n` : ''}
⭐ *TOTAL ESTIMATE:* $${totalAmount.toLocaleString('en-US')}

🛡️ *Warranty:* 1-Year Full Parts & Labor Guarantee
📝 *Terms:* ${notes}

To approve this estimate, simply reply "APPROVE" or give us a call.
Thank you for choosing FixFlow AI!`;
  };

  const handleShareWhatsApp = () => {
    const text = generateWhatsAppMessage();
    const phoneClean = job.customer.phone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${phoneClean}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    const quote = buildQuoteObject('sent');
    onSaveQuote(job.id, quote, 'quote_sent');
  };

  const handleCopyText = () => {
    const text = generateWhatsAppMessage();
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  const handleSaveDraft = () => {
    const quote = buildQuoteObject('draft');
    onSaveQuote(job.id, quote);
    onClose();
  };

  const handleCustomerApproved = () => {
    const quote = buildQuoteObject('accepted');
    onSaveQuote(job.id, quote, 'approved');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Service Estimate & Quote Builder</h2>
              <p className="text-xs text-slate-400">
                {job.customer.fullName} — {job.equipmentBrand} {job.equipmentModel}
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Customer & Job Info Quick Bar */}
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-750 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-400">Customer:</span>{' '}
              <strong className="text-white">{job.customer.fullName}</strong> ({job.customer.phone})
            </div>
            <div>
              <span className="text-slate-400">Location:</span>{' '}
              <span className="text-slate-200">{job.customer.district}, {job.customer.city}</span>
            </div>
            <div>
              <span className="text-slate-400">Error Code:</span>{' '}
              <span className="font-mono font-bold text-cyan-400">{job.errorCode || 'None'}</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Estimate Line Items (Parts & Labor)</h3>
              <span className="text-xs text-slate-400">{items.length} Items</span>
            </div>

            <div className="space-y-2">
              {items.map((item) => (
                <div 
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-800/80 border border-slate-750 text-xs"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      item.type === 'part' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {item.type === 'part' ? 'Part' : 'Labor'}
                    </span>
                    <span className="font-medium text-slate-100">{item.description}</span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    {/* Qty */}
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400 text-[11px]">Qty:</span>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItemQty(item.id, parseInt(e.target.value) || 1)}
                        className="w-12 px-1.5 py-1 rounded bg-slate-900 border border-slate-700 text-center font-bold text-white focus:outline-none"
                      />
                    </div>

                    {/* Unit Price */}
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400 text-[11px]">Unit $:</span>
                      <input
                        type="number"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => updateItemPrice(item.id, parseFloat(e.target.value) || 0)}
                        className="w-20 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-right font-bold text-white focus:outline-none"
                      />
                    </div>

                    {/* Line Total */}
                    <div className="w-20 text-right font-bold text-cyan-400 text-sm">
                      ${item.totalPrice.toLocaleString('en-US')}
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-slate-500 hover:text-red-400 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Add Line Item */}
            <div className="p-3 rounded-xl bg-slate-850 border border-slate-750/80 flex flex-col sm:flex-row items-center gap-2 text-xs">
              <select
                value={newItemType}
                onChange={(e) => setNewItemType(e.target.value as 'part' | 'labor')}
                className="w-full sm:w-28 px-2 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200"
              >
                <option value="part">Part</option>
                <option value="labor">Labor</option>
              </select>
              <input
                type="text"
                placeholder="Item description (e.g. Flame Sensor / Ignitor Assembly)"
                value={newItemDesc}
                onChange={(e) => setNewItemDesc(e.target.value)}
                className="flex-1 w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Price $"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                className="w-full sm:w-24 px-2 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-right focus:outline-none"
              />
              <button
                type="button"
                onClick={addItem}
                className="w-full sm:w-auto px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold flex items-center justify-center gap-1 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Calculations & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Warranty & Terms Notes</label>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-850 border border-slate-750 text-xs space-y-2.5">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal:</span>
                <span className="font-semibold text-white">${subtotal.toLocaleString('en-US')}</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1">
                  <span>Tax (%):</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseInt(e.target.value) || 0)}
                    className="w-12 px-1 py-0.5 rounded bg-slate-900 border border-slate-700 text-center font-semibold text-white text-xs"
                  />
                </span>
                <span className="font-semibold text-white">${taxAmount.toLocaleString('en-US')}</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1">
                  <span>Discount ($):</span>
                  <input
                    type="number"
                    min="0"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                    className="w-20 px-1 py-0.5 rounded bg-slate-900 border border-slate-700 text-right font-semibold text-emerald-400 text-xs"
                  />
                </span>
                <span className="font-semibold text-emerald-400">-${discountAmount.toLocaleString('en-US')}</span>
              </div>

              <div className="pt-2 border-t border-slate-750 flex justify-between items-baseline">
                <span className="text-sm font-bold text-white">Total Estimate:</span>
                <span className="text-xl font-extrabold text-cyan-400">
                  ${totalAmount.toLocaleString('en-US')}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Dispatch / Sharing Section */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-850 to-slate-850 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <h4 className="text-xs font-bold text-white">Instant Customer Dispatch</h4>
              </div>
              {copiedNotification && (
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 animate-fadeIn">
                  <Check className="w-3.5 h-3.5" /> Text Copied to Clipboard!
                </span>
              )}
            </div>
            
            <p className="text-xs text-slate-300">
              One-click send a professional estimate to customer ({job.customer.phone}) via WhatsApp or copy formatted text for SMS.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition active:scale-95"
              >
                <Share2 className="w-4 h-4" />
                <span>Send via WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleCopyText}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              >
                <Copy className="w-4 h-4 text-cyan-400" />
                <span>Copy Estimate Text</span>
              </button>

              <button
                type="button"
                onClick={handleCustomerApproved}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition active:scale-95"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Customer Approved & Start Repair</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-850 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold transition"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-650 text-white font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
