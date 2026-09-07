import { ServiceJob } from '../types';

export const INITIAL_SERVICE_JOBS: ServiceJob[] = [
  {
    id: 'job-101',
    trackingCode: 'FX-8921',
    customerId: 'cust-1',
    customer: {
      id: 'cust-1',
      fullName: 'Marcus Vance',
      phone: '+1 (512) 844-3291',
      address: '742 Evergreen Terrace, Suite 4B',
      district: 'Barton Hills',
      city: 'Austin, TX',
      notes: 'Please do not ring the doorbell, baby is sleeping. Knock gently.',
    },
    category: 'HVAC & Heating',
    equipmentBrand: 'Carrier',
    equipmentModel: 'Infinity 98 Gas Furnace',
    errorCode: 'F28',
    technicianComplaint: 'Furnace attempts ignition 3 times, burner fails to sustain flame, locks out with Error 28 (Ignition/Flame Failure). Manual reset clears error for 3 minutes then repeats.',
    priority: 'urgent',
    status: 'diagnosing',
    createdAt: '2026-09-07T09:30:00Z',
    scheduledDate: 'Today, 2:30 PM',
    scheduledTimeSlot: '2:00 PM - 4:00 PM',
    assignedTechnician: 'Alex Rivera (You)',
    photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    diagnosis: {
      diagnosisSummary: 'Flame Ionization Rod Carbon Buildup & Gas Valve Modulation Drift',
      severity: 'High',
      confidenceScore: 94,
      rootCauses: [
        'Excessive carbon glaze and oxidation on flame rectification sensor rod',
        'Gas valve solenoid coil resistance deviating by 14% from nominal',
        'Imbalanced air-to-fuel ratio in primary combustion chamber'
      ],
      repairSteps: [
        '1. Disconnect 120V electrical supply breaker and isolate manual gas line.',
        '2. Remove combustion chamber burner cover; detach and inspect flame sensor probe.',
        '3. Test solenoid coil resistance using digital multimeter; install replacement assembly.',
        '4. Calibrate minimum and maximum manifold gas pressures to 3.5 in. w.c.',
        '5. Clear lockout codes and execute 3 full operational heating cycles.'
      ],
      requiredParts: [
        {
          partName: 'Carrier OEM Dual Spark & Flame Sensor Rod Kit',
          estimatedCostMin: 68,
          estimatedCostMax: 95,
          partNumber: 'CR-0021-SEN',
          urgency: 'Required'
        },
        {
          partName: 'Honeywell High-Efficiency Gas Modulating Valve',
          estimatedCostMin: 195,
          estimatedCostMax: 260,
          partNumber: 'HW-VK8515',
          urgency: 'Recommended'
        }
      ],
      suggestedLabor: {
        laborDurationHours: 1.5,
        suggestedLaborFee: 165
      },
      safetyWarnings: [
        'Perform complete electronic combustible gas detector test around all fittings prior to re-energizing.',
        'Inspect flue exhaust joint couplings for airtight seal.'
      ],
      customerSummary: 'Your furnace has suffered an ignition lockout due to carbon buildup on the flame safety sensor. Replacing the sensor and calibrating the gas valve will restore reliable, efficient heating.',
      diagnosedAt: '2026-09-07T10:15:00Z',
    }
  },
  {
    id: 'job-102',
    trackingCode: 'FX-8922',
    customerId: 'cust-2',
    customer: {
      id: 'cust-2',
      fullName: 'Sarah Jenkins',
      phone: '+1 (512) 490-8812',
      address: '1408 South Congress Ave, Apt 12',
      district: 'Downtown',
      city: 'Austin, TX',
    },
    category: 'Air Conditioning & Cooling',
    equipmentBrand: 'Daikin',
    equipmentModel: 'Sensira 12,000 BTU Inverter AC',
    errorCode: 'CH-05',
    technicianComplaint: 'Indoor blower unit runs normally but blows ambient warm air. Outdoor condenser fan spins for 30 seconds then shuts down with blinking error CH-05.',
    priority: 'normal',
    status: 'quote_sent',
    createdAt: '2026-09-07T08:00:00Z',
    scheduledDate: 'Today, 4:30 PM',
    scheduledTimeSlot: '4:30 PM - 6:00 PM',
    assignedTechnician: 'Alex Rivera (You)',
    photoUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    diagnosis: {
      diagnosisSummary: 'R410A Micro-Leak at Flare Fitting & Communication Lockout',
      severity: 'Medium',
      confidenceScore: 91,
      rootCauses: [
        'Subtle refrigerant seepage at outdoor service valve 3/8" copper flare connection',
        'Operating line pressure dropped under 55 PSI, triggering compressor thermal safety trip'
      ],
      repairSteps: [
        '1. Pressurize closed system with dry nitrogen up to 150 PSI and perform ultrasonic bubble test.',
        '2. Cut, deburr, and re-flare copper tube connections to factory spec torque.',
        '3. Evacuate refrigeration loop with vacuum pump down below 400 microns for 25 minutes.',
        '4. Charge 1.45 lbs of pure virgin R410A refrigerant using calibrated digital scale.'
      ],
      requiredParts: [
        {
          partName: 'Virgin R410A Refrigerant Charge (Digital Scale Weighed)',
          estimatedCostMin: 110,
          estimatedCostMax: 155,
          partNumber: 'R410A-1.5LB',
          urgency: 'Required'
        },
        {
          partName: 'Heavy Duty Brass Flare Nut & Flare Seal Pack (3/8" + 1/2")',
          estimatedCostMin: 24,
          estimatedCostMax: 38,
          partNumber: 'FLR-1438-HD',
          urgency: 'Required'
        }
      ],
      suggestedLabor: {
        laborDurationHours: 2.0,
        suggestedLaborFee: 210
      },
      safetyWarnings: ['Handle refrigerant with cryogenic-rated safety gloves and splash goggles.'],
      customerSummary: 'A loose joint in the copper piping caused refrigerant gas to seep out over time. Resealing the flare joint, pulling a deep vacuum, and recharging fresh refrigerant will restore ice-cold cooling.',
      diagnosedAt: '2026-09-07T08:45:00Z',
    },
    quote: {
      id: 'qt-201',
      serviceJobId: 'job-102',
      quoteNumber: 'QT-2026-089',
      createdAt: '2026-09-07T09:00:00Z',
      validUntil: '2026-09-14T23:59:59Z',
      items: [
        {
          id: 'item-1',
          description: 'Virgin R410A Refrigerant (1.45 lbs Weighed with Digital Scale)',
          type: 'part',
          quantity: 1,
          unitPrice: 135,
          totalPrice: 135,
        },
        {
          id: 'item-2',
          description: 'High-Torque Brass Flare Seal Fitting Repair Kit',
          type: 'part',
          quantity: 1,
          unitPrice: 32,
          totalPrice: 32,
        },
        {
          id: 'item-3',
          description: 'Nitrogen Pressure Test, Deep Vacuum & HVAC Certified Labor',
          type: 'labor',
          quantity: 1,
          unitPrice: 210,
          totalPrice: 210,
        },
      ],
      subtotal: 377,
      taxRate: 8,
      taxAmount: 30,
      discountAmount: 20,
      totalAmount: 387,
      notes: 'All repairs include our 1-year FixFlow warranty on parts and labor. Work can be performed immediately upon approval.',
      status: 'sent',
      sentVia: 'whatsapp',
    }
  },
  {
    id: 'job-103',
    trackingCode: 'FX-8919',
    customerId: 'cust-3',
    customer: {
      id: 'cust-3',
      fullName: 'David Miller',
      phone: '+1 (512) 677-4433',
      address: '3812 Colorado River Blvd',
      district: 'Travis Heights',
      city: 'Austin, TX',
    },
    category: 'Major Appliances',
    equipmentBrand: 'Bosch',
    equipmentModel: '800 Series Front Load Washer',
    errorCode: 'E18',
    technicianComplaint: 'Washing machine halts mid-cycle during the spin/drain stage. Water remains trapped in the drum and display flashes error code E18.',
    priority: 'normal',
    status: 'completed',
    createdAt: '2026-09-06T11:00:00Z',
    scheduledDate: 'Yesterday',
    scheduledTimeSlot: '1:00 PM - 2:00 PM',
    assignedTechnician: 'Alex Rivera (You)',
    photoUrl: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80',
    serviceReport: {
      id: 'rep-301',
      serviceJobId: 'job-103',
      reportNumber: 'SR-2026-441',
      completedAt: '2026-09-06T14:10:00Z',
      technicianName: 'Alex Rivera',
      actionsTaken: [
        'Drained 8 gallons of trapped wastewater using lower emergency drain tube.',
        'Disassembled drain pump housing; extracted trapped coins and metallic debris from impeller.',
        'Inspected synchronous magnetic pump rotor bearings for lateral play.',
        'Cleaned lint trap filter chamber and replaced internal sealing gasket.',
        'Ran full 15-minute quick rinse and 1400 RPM spin balance test with zero leaks.'
      ],
      replacedParts: [
        {
          name: 'Bosch OEM Heavy-Duty Drain Pump O-Ring Gasket',
          serial: 'BSH-0014578',
          warrantyMonths: 12
        }
      ],
      warrantyDurationMonths: 12,
      warrantyNotes: 'All labor and seals are covered under FixFlow 1-Year Comprehensive Service Warranty.',
      customerName: 'David Miller',
      customerSignatureDataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60"><path d="M10 40 Q 60 10 90 35 T 180 25" fill="none" stroke="%232563eb" stroke-width="3"/></svg>',
      finalNotes: 'Customer advised to check garment pockets prior to washing cycles.',
      paymentStatus: 'paid',
      paidAmount: 145
    }
  },
  {
    id: 'job-104',
    trackingCode: 'FX-8924',
    customerId: 'cust-4',
    customer: {
      id: 'cust-4',
      fullName: 'Emily Watson',
      phone: '+1 (512) 993-2114',
      address: '2204 Zilker Park Rd, Unit 5',
      district: 'Zilker',
      city: 'Austin, TX',
    },
    category: 'HVAC & Heating',
    equipmentBrand: 'Vaillant',
    equipmentModel: 'ecoTEC Plus 832 Combi Boiler',
    errorCode: 'F22',
    technicianComplaint: 'System water pressure repeatedly drops to 0 bar every morning. Filling loop adds water, but within 4 hours water drips from the safety valve and drops to zero.',
    priority: 'urgent',
    status: 'pending',
    createdAt: '2026-09-07T11:45:00Z',
    scheduledDate: 'Tomorrow, 10:00 AM',
    scheduledTimeSlot: '10:00 AM - 11:30 AM',
    assignedTechnician: 'Alex Rivera (You)',
    photoUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
  }
];

export const SERVICE_CATEGORIES = [
  'HVAC & Heating',
  'Air Conditioning & Cooling',
  'Major Appliances',
  'Electrical & Plumbing',
  'Auto Repair & Mechanics',
  'Commercial Kitchen',
  'Other',
] as const;

export const POPULAR_BRANDS: Record<string, string[]> = {
  'HVAC & Heating': ['Carrier', 'Trane', 'Lennox', 'Vaillant', 'Bosch', 'Buderus', 'Goodman', 'Rheem', 'Viessmann'],
  'Air Conditioning & Cooling': ['Daikin', 'Mitsubishi Electric', 'LG', 'Samsung', 'Carrier', 'Trane', 'Fujitsu', 'Gree'],
  'Major Appliances': ['Bosch', 'Whirlpool', 'Samsung', 'LG', 'KitchenAid', 'GE Appliances', 'Maytag', 'Miele', 'Electrolux'],
  'Electrical & Plumbing': ['Schneider Electric', 'Square D', 'Siemens', 'Eaton', 'Kohler', 'Moen', 'Grundfos'],
  'Auto Repair & Mechanics': ['Ford', 'Toyota', 'Chevrolet', 'Honda', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Tesla'],
  'Commercial Kitchen': ['Hobart', 'True Refrigeration', 'Vulcan', 'Frymaster', 'Rational', 'Hoshizaki'],
  'Other': ['General Equipment', 'Custom Brand'],
};

export const COMMON_ERROR_CODES: Record<string, string[]> = {
  'Carrier': ['F28 (Ignition Failure)', 'Code 33 (Limit Switch Open)', 'Code 13 (Flame Rollout)', 'Code 31 (High Pressure Switch)'],
  'Trane': ['Error 22 (Low Water Cutoff)', 'Error 44 (Draft Inducer Motor)', 'Flashing Amber (Flame Current Low)'],
  'Vaillant': ['F28 (Ignition Fault)', 'F22 (Low Water Pressure)', 'F75 (Pressure Sensor / Pump)', 'F20 (Overheat Safety)'],
  'Bosch': ['E18 (Drain Failure)', 'E23 (Water Leak in Base)', 'E09 (Heating Element)', 'EA (Flame Signal Lost)'],
  'Daikin': ['CH-05 (Communication Failure)', 'CH-21 (Inverter Compressor Overcurrent)', 'U4 (Signal Lost Between Units)', 'A5 (Freeze Protection)'],
};
