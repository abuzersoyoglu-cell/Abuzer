export type JobStatus = 
  | 'pending'           // New / Pending
  | 'diagnosing'        // Diagnosing in progress
  | 'diagnosed'         // AI Diagnosed
  | 'quote_sent'        // Quote Sent
  | 'approved'          // Approved / Parts Ordered
  | 'in_progress'       // In Progress / Repairing
  | 'completed'         // Completed / Report Signed
  | 'cancelled';        // Cancelled

export type JobPriority = 'urgent' | 'normal' | 'low';

export type EquipmentCategory = 
  | 'HVAC & Heating'
  | 'Air Conditioning & Cooling'
  | 'Major Appliances'
  | 'Electrical & Plumbing'
  | 'Auto Repair & Mechanics'
  | 'Commercial Kitchen'
  | 'Other';

export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  district: string;
  city: string;
  notes?: string;
}

export interface RequiredPart {
  partName: string;
  estimatedCostMin: number;
  estimatedCostMax: number;
  partNumber?: string;
  urgency: 'Required' | 'Recommended' | 'Optional' | 'Zorunlu' | 'Önerilen' | 'Opsiyonel';
}

export interface AIDiagnosisResult {
  diagnosisSummary: string;
  severity: 'High' | 'Medium' | 'Low' | 'Yüksek' | 'Orta' | 'Düşük';
  confidenceScore: number;
  rootCauses: string[];
  repairSteps: string[];
  requiredParts: RequiredPart[];
  suggestedLabor: {
    laborDurationHours: number;
    suggestedLaborFee: number;
  };
  safetyWarnings: string[];
  customerSummary: string;
  photoUrl?: string;
  diagnosedAt: string;
}

export interface QuoteItem {
  id: string;
  description: string;
  type: 'part' | 'labor' | 'service';
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Quote {
  id: string;
  serviceJobId: string;
  quoteNumber: string;
  createdAt: string;
  validUntil: string;
  items: QuoteItem[];
  subtotal: number;
  taxRate: number; // e.g. 20 for %20
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  notes: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  sentVia?: 'whatsapp' | 'sms' | 'email' | 'in_person';
}

export interface ServiceReport {
  id: string;
  serviceJobId: string;
  reportNumber: string;
  completedAt: string;
  technicianName: string;
  actionsTaken: string[];
  replacedParts: Array<{ name: string; serial?: string; warrantyMonths: number }>;
  warrantyDurationMonths: number;
  warrantyNotes: string;
  customerSignatureDataUrl?: string;
  customerName: string;
  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
  finalNotes: string;
  paymentStatus: 'paid' | 'pending' | 'credit_card' | 'bank_transfer' | 'cash';
  paidAmount: number;
}

export interface ServiceJob {
  id: string;
  trackingCode: string;
  customerId: string;
  customer: Customer;
  category: EquipmentCategory;
  equipmentBrand: string;
  equipmentModel: string;
  serialNumber?: string;
  errorCode?: string;
  technicianComplaint: string; // Customer complaint or technician observations
  priority: JobPriority;
  status: JobStatus;
  createdAt: string;
  scheduledDate: string;
  scheduledTimeSlot?: string;
  assignedTechnician: string;
  photoUrl?: string;
  diagnosis?: AIDiagnosisResult;
  quote?: Quote;
  serviceReport?: ServiceReport;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
  lastSyncedAt?: string;
}
