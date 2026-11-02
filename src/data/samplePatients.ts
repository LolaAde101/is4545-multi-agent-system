import {
  PatientRecord,
  DistinctComment,
  DatasetKPIs,
  PatientPersona,
  AgeGroup,
  VisitType,
  ServiceLine,
  ReadmissionRisk,
  AIRiskFlag,
} from '../types';

export const INITIAL_PATIENT_RECORDS: PatientRecord[] = [
  {
    Record_ID: 'REC-101',
    Patient_Persona: 'Elderly Chronic Care',
    Age_Group: '65+',
    Visit_Type: 'Emergency',
    ServiceLine: 'Emergency Medicine',
    Year: 2026,
    Patient_Satisfaction: 2,
    Communication_Rating: 1,
    Followup_Compliance: 0,
    Portal_Usage: 0,
    Readmission_Risk: 'High',
    AIRiskFlag: 'Human Review Required',
    Comment: 'Waited over 4 hours in the ED hallway without anyone telling me what test was next or giving an update.',
  },
  {
    Record_ID: 'REC-102',
    Patient_Persona: 'Post-Surgical Senior',
    Age_Group: '65+',
    Visit_Type: 'Inpatient',
    ServiceLine: 'General Surgery',
    Year: 2026,
    Patient_Satisfaction: 2,
    Communication_Rating: 2,
    Followup_Compliance: 0,
    Portal_Usage: 0,
    Readmission_Risk: 'High',
    AIRiskFlag: 'Human Review Required',
    Comment: 'Discharge paperwork was full of medical jargon that my grandmother could not understand. We don\'t know what medications to restart.',
  },
  {
    Record_ID: 'REC-103',
    Patient_Persona: 'Post-Surgical Senior',
    Age_Group: '65+',
    Visit_Type: 'Inpatient',
    ServiceLine: 'Cardiology',
    Year: 2026,
    Patient_Satisfaction: 1,
    Communication_Rating: 1,
    Followup_Compliance: 0,
    Portal_Usage: 0,
    Readmission_Risk: 'High',
    AIRiskFlag: 'Human Review Required',
    Comment: 'Prescription dose instructions on the discharge packet conflicted with what the resident told me verbally at the bedside.',
  },
  {
    Record_ID: 'REC-104',
    Patient_Persona: 'Young Digital Native',
    Age_Group: '18-35',
    Visit_Type: 'Outpatient',
    ServiceLine: 'Oncology',
    Year: 2026,
    Patient_Satisfaction: 2,
    Communication_Rating: 3,
    Followup_Compliance: 1,
    Portal_Usage: 1,
    Readmission_Risk: 'Low',
    AIRiskFlag: 'Hallucination Risk',
    Comment: 'The patient portal locked me out three times when trying to see my biopsy pathology results.',
  },
  {
    Record_ID: 'REC-105',
    Patient_Persona: 'Non-English Primary',
    Age_Group: '36-50',
    Visit_Type: 'Inpatient',
    ServiceLine: 'Emergency Medicine',
    Year: 2026,
    Patient_Satisfaction: 2,
    Communication_Rating: 1,
    Followup_Compliance: 0,
    Portal_Usage: 0,
    Readmission_Risk: 'Moderate',
    AIRiskFlag: 'Bias Review',
    Comment: 'Doctor was rushed and dismissive of my symptoms, and there was no Spanish interpreter available during morning rounds.',
  },
  {
    Record_ID: 'REC-106',
    Patient_Persona: 'Elderly Chronic Care',
    Age_Group: '65+',
    Visit_Type: 'Inpatient',
    ServiceLine: 'Cardiology',
    Year: 2025,
    Patient_Satisfaction: 5,
    Communication_Rating: 5,
    Followup_Compliance: 1,
    Portal_Usage: 1,
    Readmission_Risk: 'Low',
    AIRiskFlag: 'Normal',
    Comment: 'Exceptional bedside nursing in Cardiology; nurse Sarah explained every IV medication thoroughly and with great warmth.',
  },
  {
    Record_ID: 'REC-107',
    Patient_Persona: 'Working Parent',
    Age_Group: '36-50',
    Visit_Type: 'Outpatient',
    ServiceLine: 'Pediatrics',
    Year: 2025,
    Patient_Satisfaction: 2,
    Communication_Rating: 2,
    Followup_Compliance: 1,
    Portal_Usage: 1,
    Readmission_Risk: 'Low',
    AIRiskFlag: 'Normal',
    Comment: 'Surprise bill of $1,400 for out-of-network ultrasound that was supposedly pre-approved by scheduling.',
  },
  {
    Record_ID: 'REC-108',
    Patient_Persona: 'Rural Telehealth',
    Age_Group: '51-65',
    Visit_Type: 'Telehealth',
    ServiceLine: 'Orthopedics',
    Year: 2026,
    Patient_Satisfaction: 5,
    Communication_Rating: 5,
    Followup_Compliance: 1,
    Portal_Usage: 1,
    Readmission_Risk: 'Low',
    AIRiskFlag: 'Normal',
    Comment: 'Post-op wound care video on the telehealth app was clear and prevented an unnecessary trip to urgent care.',
  },
  {
    Record_ID: 'REC-109',
    Patient_Persona: 'Elderly Chronic Care',
    Age_Group: '65+',
    Visit_Type: 'Emergency',
    ServiceLine: 'Emergency Medicine',
    Year: 2025,
    Patient_Satisfaction: 1,
    Communication_Rating: 1,
    Followup_Compliance: 0,
    Portal_Usage: 0,
    Readmission_Risk: 'High',
    AIRiskFlag: 'Human Review Required',
    Comment: 'Waited over 4 hours in the ED hallway without anyone telling me what test was next or giving an update.',
  },
  {
    Record_ID: 'REC-110',
    Patient_Persona: 'Post-Surgical Senior',
    Age_Group: '65+',
    Visit_Type: 'Inpatient',
    ServiceLine: 'Orthopedics',
    Year: 2026,
    Patient_Satisfaction: 2,
    Communication_Rating: 2,
    Followup_Compliance: 0,
    Portal_Usage: 0,
    Readmission_Risk: 'Moderate',
    AIRiskFlag: 'Human Review Required',
    Comment: 'Discharge paperwork was full of medical jargon that my grandmother could not understand. We don\'t know what medications to restart.',
  },
  {
    Record_ID: 'REC-111',
    Patient_Persona: 'Post-Surgical Senior',
    Age_Group: '65+',
    Visit_Type: 'Inpatient',
    ServiceLine: 'General Surgery',
    Year: 2025,
    Patient_Satisfaction: 1,
    Communication_Rating: 1,
    Followup_Compliance: 0,
    Portal_Usage: 0,
    Readmission_Risk: 'High',
    AIRiskFlag: 'Human Review Required',
    Comment: 'Prescription dose instructions on the discharge packet conflicted with what the resident told me verbally at the bedside.',
  },
  {
    Record_ID: 'REC-112',
    Patient_Persona: 'Working Parent',
    Age_Group: '36-50',
    Visit_Type: 'Outpatient',
    ServiceLine: 'Cardiology',
    Year: 2026,
    Patient_Satisfaction: 2,
    Communication_Rating: 3,
    Followup_Compliance: 1,
    Portal_Usage: 1,
    Readmission_Risk: 'Low',
    AIRiskFlag: 'Hallucination Risk',
    Comment: 'The patient portal locked me out three times when trying to see my biopsy pathology results.',
  },
  {
    Record_ID: 'REC-113',
    Patient_Persona: 'Non-English Primary',
    Age_Group: '51-65',
    Visit_Type: 'Outpatient',
    ServiceLine: 'Oncology',
    Year: 2026,
    Patient_Satisfaction: 2,
    Communication_Rating: 2,
    Followup_Compliance: 1,
    Portal_Usage: 0,
    Readmission_Risk: 'Moderate',
    AIRiskFlag: 'Bias Review',
    Comment: 'Doctor was rushed and dismissive of my symptoms, and there was no Spanish interpreter available during morning rounds.',
  },
  {
    Record_ID: 'REC-114',
    Patient_Persona: 'Working Parent',
    Age_Group: '18-35',
    Visit_Type: 'Outpatient',
    ServiceLine: 'Pediatrics',
    Year: 2026,
    Patient_Satisfaction: 5,
    Communication_Rating: 5,
    Followup_Compliance: 1,
    Portal_Usage: 1,
    Readmission_Risk: 'Low',
    AIRiskFlag: 'Normal',
    Comment: 'Exceptional bedside nursing in Cardiology; nurse Sarah explained every IV medication thoroughly and with great warmth.',
  },
  {
    Record_ID: 'REC-115',
    Patient_Persona: 'Working Parent',
    Age_Group: '36-50',
    Visit_Type: 'Outpatient',
    ServiceLine: 'Orthopedics',
    Year: 2024,
    Patient_Satisfaction: 2,
    Communication_Rating: 2,
    Followup_Compliance: 1,
    Portal_Usage: 1,
    Readmission_Risk: 'Low',
    AIRiskFlag: 'Normal',
    Comment: 'Surprise bill of $1,400 for out-of-network ultrasound that was supposedly pre-approved by scheduling.',
  },
  {
    Record_ID: 'REC-116',
    Patient_Persona: 'Rural Telehealth',
    Age_Group: '51-65',
    Visit_Type: 'Telehealth',
    ServiceLine: 'Cardiology',
    Year: 2025,
    Patient_Satisfaction: 4,
    Communication_Rating: 5,
    Followup_Compliance: 1,
    Portal_Usage: 1,
    Readmission_Risk: 'Low',
    AIRiskFlag: 'Normal',
    Comment: 'Post-op wound care video on the telehealth app was clear and prevented an unnecessary trip to urgent care.',
  },
  {
    Record_ID: 'REC-117',
    Patient_Persona: 'Young Digital Native',
    Age_Group: '18-35',
    Visit_Type: 'Emergency',
    ServiceLine: 'Emergency Medicine',
    Year: 2026,
    Patient_Satisfaction: 2,
    Communication_Rating: 2,
    Followup_Compliance: 0,
    Portal_Usage: 1,
    Readmission_Risk: 'Moderate',
    AIRiskFlag: 'Human Review Required',
    Comment: 'Waited over 4 hours in the ED hallway without anyone telling me what test was next or giving an update.',
  },
  {
    Record_ID: 'REC-118',
    Patient_Persona: 'Elderly Chronic Care',
    Age_Group: '65+',
    Visit_Type: 'Inpatient',
    ServiceLine: 'Oncology',
    Year: 2026,
    Patient_Satisfaction: 2,
    Communication_Rating: 2,
    Followup_Compliance: 0,
    Portal_Usage: 0,
    Readmission_Risk: 'High',
    AIRiskFlag: 'Human Review Required',
    Comment: 'Discharge paperwork was full of medical jargon that my grandmother could not understand. We don\'t know what medications to restart.',
  },
  {
    Record_ID: 'REC-119',
    Patient_Persona: 'Elderly Chronic Care',
    Age_Group: '65+',
    Visit_Type: 'Inpatient',
    ServiceLine: 'Cardiology',
    Year: 2024,
    Patient_Satisfaction: 5,
    Communication_Rating: 4,
    Followup_Compliance: 1,
    Portal_Usage: 0,
    Readmission_Risk: 'Low',
    AIRiskFlag: 'Normal',
    Comment: 'Exceptional bedside nursing in Cardiology; nurse Sarah explained every IV medication thoroughly and with great warmth.',
  },
  {
    Record_ID: 'REC-120',
    Patient_Persona: 'Post-Surgical Senior',
    Age_Group: '65+',
    Visit_Type: 'Inpatient',
    ServiceLine: 'General Surgery',
    Year: 2026,
    Patient_Satisfaction: 1,
    Communication_Rating: 1,
    Followup_Compliance: 0,
    Portal_Usage: 0,
    Readmission_Risk: 'High',
    AIRiskFlag: 'Human Review Required',
    Comment: 'Prescription dose instructions on the discharge packet conflicted with what the resident told me verbally at the bedside.',
  },
  {
    Record_ID: 'REC-121',
    Patient_Persona: 'Working Parent',
    Age_Group: '36-50',
    Visit_Type: 'Emergency',
    ServiceLine: 'Emergency Medicine',
    Year: 2026,
    Patient_Satisfaction: 1,
    Communication_Rating: 1,
    Followup_Compliance: 0,
    Portal_Usage: 1,
    Readmission_Risk: 'Moderate',
    AIRiskFlag: 'Human Review Required',
    Comment: 'Waited over 4 hours in the ED hallway without anyone telling me what test was next or giving an update.',
  },
  {
    Record_ID: 'REC-122',
    Patient_Persona: 'Rural Telehealth',
    Age_Group: '36-50',
    Visit_Type: 'Telehealth',
    ServiceLine: 'General Surgery',
    Year: 2026,
    Patient_Satisfaction: 5,
    Communication_Rating: 4,
    Followup_Compliance: 1,
    Portal_Usage: 1,
    Readmission_Risk: 'Low',
    AIRiskFlag: 'Normal',
    Comment: 'Post-op wound care video on the telehealth app was clear and prevented an unnecessary trip to urgent care.',
  },
  {
    Record_ID: 'REC-123',
    Patient_Persona: 'Non-English Primary',
    Age_Group: '65+',
    Visit_Type: 'Inpatient',
    ServiceLine: 'Cardiology',
    Year: 2025,
    Patient_Satisfaction: 2,
    Communication_Rating: 1,
    Followup_Compliance: 0,
    Portal_Usage: 0,
    Readmission_Risk: 'High',
    AIRiskFlag: 'Bias Review',
    Comment: 'Doctor was rushed and dismissive of my symptoms, and there was no Spanish interpreter available during morning rounds.',
  },
  {
    Record_ID: 'REC-124',
    Patient_Persona: 'Young Digital Native',
    Age_Group: '18-35',
    Visit_Type: 'Outpatient',
    ServiceLine: 'Orthopedics',
    Year: 2025,
    Patient_Satisfaction: 3,
    Communication_Rating: 3,
    Followup_Compliance: 1,
    Portal_Usage: 1,
    Readmission_Risk: 'Low',
    AIRiskFlag: 'Hallucination Risk',
    Comment: 'The patient portal locked me out three times when trying to see my biopsy pathology results.',
  },
  {
    Record_ID: 'REC-125',
    Patient_Persona: 'Working Parent',
    Age_Group: '36-50',
    Visit_Type: 'Outpatient',
    ServiceLine: 'Emergency Medicine',
    Year: 2024,
    Patient_Satisfaction: 2,
    Communication_Rating: 2,
    Followup_Compliance: 1,
    Portal_Usage: 1,
    Readmission_Risk: 'Low',
    AIRiskFlag: 'Normal',
    Comment: 'Surprise bill of $1,400 for out-of-network ultrasound that was supposedly pre-approved by scheduling.',
  },
  {
    Record_ID: 'REC-126',
    Patient_Persona: 'Elderly Chronic Care',
    Age_Group: '65+',
    Visit_Type: 'Inpatient',
    ServiceLine: 'Cardiology',
    Year: 2026,
    Patient_Satisfaction: 5,
    Communication_Rating: 5,
    Followup_Compliance: 1,
    Portal_Usage: 1,
    Readmission_Risk: 'Low',
    AIRiskFlag: 'Normal',
    Comment: 'Exceptional bedside nursing in Cardiology; nurse Sarah explained every IV medication thoroughly and with great warmth.',
  },
  {
    Record_ID: 'REC-127',
    Patient_Persona: 'Post-Surgical Senior',
    Age_Group: '65+',
    Visit_Type: 'Inpatient',
    ServiceLine: 'Orthopedics',
    Year: 2025,
    Patient_Satisfaction: 1,
    Communication_Rating: 1,
    Followup_Compliance: 0,
    Portal_Usage: 0,
    Readmission_Risk: 'High',
    AIRiskFlag: 'Human Review Required',
    Comment: 'Prescription dose instructions on the discharge packet conflicted with what the resident told me verbally at the bedside.',
  },
  {
    Record_ID: 'REC-128',
    Patient_Persona: 'Non-English Primary',
    Age_Group: '51-65',
    Visit_Type: 'Emergency',
    ServiceLine: 'Emergency Medicine',
    Year: 2026,
    Patient_Satisfaction: 2,
    Communication_Rating: 1,
    Followup_Compliance: 0,
    Portal_Usage: 0,
    Readmission_Risk: 'Moderate',
    AIRiskFlag: 'Bias Review',
    Comment: 'Doctor was rushed and dismissive of my symptoms, and there was no Spanish interpreter available during morning rounds.',
  },
];

// Pure JavaScript KPI calculation function (no AI used for calculation as per prompt)
export function calculateKPIs(records: PatientRecord[]): DatasetKPIs {
  const totalRecords = records.length;
  if (totalRecords === 0) {
    return {
      totalRecords: 0,
      avgPatientSatisfaction: 0,
      avgCommunicationRating: 0,
      followupComplianceRate: 0,
      portalUsageRate: 0,
      satisfactionByServiceLine: {},
      satisfactionByYear: {},
      satisfactionByPersona: {},
      satisfactionByVisitType: {},
      readmissionRiskCounts: {},
      aiRiskFlagCounts: {},
      serviceLineCounts: {},
      distinctCommentsCount: 0,
    };
  }

  let totalSat = 0;
  let totalComm = 0;
  let totalFollowup = 0;
  let totalPortal = 0;

  const satByService: Record<string, { sum: number; count: number }> = {};
  const satByYear: Record<number, { sum: number; count: number }> = {};
  const satByPersona: Record<string, { sum: number; count: number }> = {};
  const satByVisitType: Record<string, { sum: number; count: number }> = {};
  const readmissionCounts: Record<string, number> = {};
  const aiFlagCounts: Record<string, number> = {};
  const serviceCounts: Record<string, number> = {};
  const commentSet = new Set<string>();

  for (const r of records) {
    totalSat += r.Patient_Satisfaction;
    totalComm += r.Communication_Rating;
    if (r.Followup_Compliance === 1) totalFollowup++;
    if (r.Portal_Usage === 1) totalPortal++;

    // Service line
    if (!satByService[r.ServiceLine]) satByService[r.ServiceLine] = { sum: 0, count: 0 };
    satByService[r.ServiceLine].sum += r.Patient_Satisfaction;
    satByService[r.ServiceLine].count++;
    serviceCounts[r.ServiceLine] = (serviceCounts[r.ServiceLine] || 0) + 1;

    // Year
    if (!satByYear[r.Year]) satByYear[r.Year] = { sum: 0, count: 0 };
    satByYear[r.Year].sum += r.Patient_Satisfaction;
    satByYear[r.Year].count++;

    // Persona
    if (!satByPersona[r.Patient_Persona]) satByPersona[r.Patient_Persona] = { sum: 0, count: 0 };
    satByPersona[r.Patient_Persona].sum += r.Patient_Satisfaction;
    satByPersona[r.Patient_Persona].count++;

    // Visit Type
    if (!satByVisitType[r.Visit_Type]) satByVisitType[r.Visit_Type] = { sum: 0, count: 0 };
    satByVisitType[r.Visit_Type].sum += r.Patient_Satisfaction;
    satByVisitType[r.Visit_Type].count++;

    // Readmission risk
    readmissionCounts[r.Readmission_Risk] = (readmissionCounts[r.Readmission_Risk] || 0) + 1;

    // AI Risk Flag
    aiFlagCounts[r.AIRiskFlag] = (aiFlagCounts[r.AIRiskFlag] || 0) + 1;

    // Comment
    if (r.Comment && r.Comment.trim()) {
      commentSet.add(r.Comment.trim());
    }
  }

  const satisfactionByServiceLine: Record<string, number> = {};
  for (const [s, data] of Object.entries(satByService)) {
    satisfactionByServiceLine[s] = Number((data.sum / data.count).toFixed(2));
  }

  const satisfactionByYear: Record<number, number> = {};
  for (const [y, data] of Object.entries(satByYear)) {
    satisfactionByYear[Number(y)] = Number((data.sum / data.count).toFixed(2));
  }

  const satisfactionByPersona: Record<string, number> = {};
  for (const [p, data] of Object.entries(satByPersona)) {
    satisfactionByPersona[p] = Number((data.sum / data.count).toFixed(2));
  }

  const satisfactionByVisitType: Record<string, number> = {};
  for (const [v, data] of Object.entries(satByVisitType)) {
    satisfactionByVisitType[v] = Number((data.sum / data.count).toFixed(2));
  }

  return {
    totalRecords,
    avgPatientSatisfaction: Number((totalSat / totalRecords).toFixed(2)),
    avgCommunicationRating: Number((totalComm / totalRecords).toFixed(2)),
    followupComplianceRate: Number(((totalFollowup / totalRecords) * 100).toFixed(1)),
    portalUsageRate: Number(((totalPortal / totalRecords) * 100).toFixed(1)),
    satisfactionByServiceLine,
    satisfactionByYear,
    satisfactionByPersona,
    satisfactionByVisitType,
    readmissionRiskCounts: readmissionCounts,
    aiRiskFlagCounts: aiFlagCounts,
    serviceLineCounts: serviceCounts,
    distinctCommentsCount: commentSet.size,
  };
}

// Extract distinct comments and calculate aggregated stats for AI specialist input
export function extractDistinctComments(records: PatientRecord[]): DistinctComment[] {
  const map = new Map<string, {
    count: number;
    recordIds: string[];
    commRatings: number[];
    satRatings: number[];
    aiFlags: Record<string, number>;
    serviceLines: Set<string>;
  }>();

  for (const r of records) {
    const text = (r.Comment || '').trim();
    if (!text) continue;

    if (!map.has(text)) {
      map.set(text, {
        count: 0,
        recordIds: [],
        commRatings: [],
        satRatings: [],
        aiFlags: {},
        serviceLines: new Set<string>(),
      });
    }

    const item = map.get(text)!;
    item.count++;
    item.recordIds.push(r.Record_ID);
    item.commRatings.push(r.Communication_Rating);
    item.satRatings.push(r.Patient_Satisfaction);
    item.aiFlags[r.AIRiskFlag] = (item.aiFlags[r.AIRiskFlag] || 0) + 1;
    item.serviceLines.add(r.ServiceLine);
  }

  let index = 1;
  const result: DistinctComment[] = [];

  for (const [comment, data] of map.entries()) {
    const avgComm = data.commRatings.reduce((a, b) => a + b, 0) / data.commRatings.length;
    const avgSat = data.satRatings.reduce((a, b) => a + b, 0) / data.satRatings.length;
    result.push({
      id: `C${index++}`,
      comment,
      count: data.count,
      recordIds: data.recordIds,
      avgCommunicationRating: Number(avgComm.toFixed(2)),
      avgSatisfaction: Number(avgSat.toFixed(2)),
      aiRiskFlagCounts: data.aiFlags,
      serviceLines: Array.from(data.serviceLines),
    });
  }

  return result;
}

// Convert records to CSV format for download
export function exportToCSV(records: PatientRecord[]): string {
  const headers = [
    'Record_ID',
    'Patient_Persona',
    'Age_Group',
    'Visit_Type',
    'Service_Line',
    'Year',
    'Patient_Satisfaction',
    'Communication_Rating',
    'Followup_Compliance',
    'Portal_Usage',
    'Readmission_Risk',
    'AI_Risk_Flag',
    'Comment',
  ];

  const rows = records.map((r) => [
    r.Record_ID,
    `"${r.Patient_Persona}"`,
    `"${r.Age_Group}"`,
    `"${r.Visit_Type}"`,
    `"${r.ServiceLine}"`,
    r.Year,
    r.Patient_Satisfaction,
    r.Communication_Rating,
    r.Followup_Compliance,
    r.Portal_Usage,
    `"${r.Readmission_Risk}"`,
    `"${r.AIRiskFlag}"`,
    `"${r.Comment.replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

// Parse CSV text uploaded by user
export function parseCSV(csvText: string): PatientRecord[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  // Parse header
  const headerLine = lines[0];
  const headers = headerLine.split(',').map((h) => h.trim().replace(/^"|"$/g, ''));

  const records: PatientRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // CSV parser taking quotes into account
    const values: string[] = [];
    let insideQuotes = false;
    let currentVal = '';

    for (let charIndex = 0; charIndex < line.length; charIndex++) {
      const char = line[charIndex];
      if (char === '"') {
        if (insideQuotes && line[charIndex + 1] === '"') {
          currentVal += '"';
          charIndex++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        values.push(currentVal.trim());
        currentVal = '';
      } else {
        currentVal += char;
      }
    }
    values.push(currentVal.trim());

    if (values.length < 5) continue;

    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] || '';
    });

    const record: PatientRecord = {
      Record_ID: row['Record_ID'] || `REC-${100 + i}`,
      Patient_Persona: (row['Patient_Persona'] as PatientPersona) || 'Elderly Chronic Care',
      Age_Group: (row['Age_Group'] as AgeGroup) || '65+',
      Visit_Type: (row['Visit_Type'] as VisitType) || 'Inpatient',
      ServiceLine: ((row['Service_Line'] || row['ServiceLine'] || 'Emergency Medicine') as ServiceLine),
      Year: Number(row['Year']) || 2026,
      Patient_Satisfaction: Number(row['Patient_Satisfaction']) || 3,
      Communication_Rating: Number(row['Communication_Rating']) || 3,
      Followup_Compliance: (Number(row['Followup_Compliance']) === 1 ? 1 : 0) as 0 | 1,
      Portal_Usage: (Number(row['Portal_Usage']) === 1 ? 1 : 0) as 0 | 1,
      Readmission_Risk: ((row['Readmission_Risk'] || 'Moderate') as ReadmissionRisk),
      AIRiskFlag: ((row['AI_Risk_Flag'] || row['AIRiskFlag'] || 'Normal') as AIRiskFlag),
      Comment: row['Comment'] || '',
    };

    records.push(record);
  }

  return records;
}
