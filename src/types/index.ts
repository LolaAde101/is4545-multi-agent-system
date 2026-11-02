export type PatientPersona =
  | 'Elderly Chronic Care'
  | 'Working Parent'
  | 'Young Digital Native'
  | 'Rural Telehealth'
  | 'Non-English Primary'
  | 'Post-Surgical Senior';

export type AgeGroup = '18-35' | '36-50' | '51-65' | '65+';
export type VisitType = 'Inpatient' | 'Outpatient' | 'Emergency' | 'Telehealth';
export type ServiceLine =
  | 'Emergency Medicine'
  | 'Cardiology'
  | 'Orthopedics'
  | 'Pediatrics'
  | 'Oncology'
  | 'General Surgery';

export type ReadmissionRisk = 'Low' | 'Moderate' | 'High';
export type AIRiskFlag =
  | 'Normal'
  | 'Hallucination Risk'
  | 'Bias Review'
  | 'Human Review Required';

export interface PatientRecord {
  Record_ID: string;
  Patient_Persona: PatientPersona;
  Age_Group: AgeGroup;
  Visit_Type: VisitType;
  Service_Line?: ServiceLine;
  ServiceLine: ServiceLine;
  Year: number;
  Patient_Satisfaction: number; // 1-5
  Communication_Rating: number; // 1-5
  Followup_Compliance: 0 | 1;
  Portal_Usage: 0 | 1;
  Readmission_Risk: ReadmissionRisk;
  AI_Risk_Flag?: AIRiskFlag;
  AIRiskFlag: AIRiskFlag;
  Comment: string;
}

export interface DistinctComment {
  id: string; // e.g. "C1"
  comment: string;
  count: number;
  recordIds: string[];
  avgCommunicationRating: number;
  avgSatisfaction: number;
  aiRiskFlagCounts: Record<string, number>;
  serviceLines: string[];
}

export interface DatasetKPIs {
  totalRecords: number;
  avgPatientSatisfaction: number;
  avgCommunicationRating: number;
  followupComplianceRate: number; // percentage 0-100
  portalUsageRate: number; // percentage 0-100
  satisfactionByServiceLine: Record<string, number>;
  satisfactionByYear: Record<number, number>;
  satisfactionByPersona: Record<string, number>;
  satisfactionByVisitType: Record<string, number>;
  readmissionRiskCounts: Record<string, number>;
  aiRiskFlagCounts: Record<string, number>;
  serviceLineCounts: Record<string, number>;
  distinctCommentsCount: number;
}

export type AgentStatus =
  | 'pending'
  | 'running'
  | 'waiting_review'
  | 'completed'
  | 'skipped'
  | 'failed';

export type AgentKey = 'agent4_plan' | 'agent1' | 'agent2' | 'agent3' | 'agent6' | 'agent5' | 'agent4_final';

// Agent 4 Planning Output
export interface Agent4PlanResult {
  goal: string;
  agents: {
    agent: string; // e.g. "Agent 1", "Agent 2", "Agent 3", "Agent 6"
    run: boolean;
    task: string;
    reason: string;
  }[];
}

// Agent 1 Feedback Insight Output
export interface Agent1Result {
  comments: {
    id: string;
    theme:
      | 'Communication'
      | 'Scheduling'
      | 'Wait Time'
      | 'Technology / Patient Portal'
      | 'Billing'
      | 'Clinical Care'
      | 'Discharge / Follow-Up'
      | 'Accessibility / Equity'
      | 'Mixed or Ambiguous';
    sentiment: 'Positive' | 'Negative' | 'Neutral' | 'Mixed';
    reasoning: string;
    operational_issue: string;
    risk_or_bias_concern: string;
    recommended_action: string;
  }[];
  summary: string;
}

// Agent 2 Experience Monitoring Output
export interface Agent2Result {
  patterns: { pattern: string; evidence: string }[];
  operational_issues: string[];
  equity_concerns: { group: string; concern: string; evidence: string }[];
  risk: {
    patient_safety: 'Low' | 'Moderate' | 'High' | string;
    reputational: 'Low' | 'Moderate' | 'High' | string;
    compliance: 'Low' | 'Moderate' | 'High' | string;
    equity: 'Low' | 'Moderate' | 'High' | string;
  };
  recommendation: string;
  additional_information_needed: string;
}

// Agent 3 Complaint Triage Output
export interface Agent3Result {
  complaints: {
    id: string;
    primary_category: string;
    secondary_categories: string[];
    severity_level: 1 | 2 | 3 | 4;
    severity_reasoning: string;
    risks: { risk: string; why: string }[];
    route_to: string;
    human_review_required: boolean;
    human_review_reason: string;
  }[];
  summary: string;
}

// Agent 6 Communication Quality Evaluator Output
export interface Agent6Result {
  evaluations: {
    id: string;
    purpose: string;
    purpose_rationale: string;
    scores: {
      clarity: string;
      completeness: string;
      empathy: string;
      patient_centeredness: string;
      actionability: string;
    };
    health_literacy_concern: 'None' | 'Low' | 'Moderate' | 'High' | string;
    risk: 'Low' | 'Moderate' | 'High' | string;
    risk_reason: string;
    improvements: string[];
  }[];
  improved_patient_message: string;
  executive_summary: {
    overall_quality: string;
    major_strengths: string;
    major_weaknesses: string;
    highest_risk: string;
    most_important_improvement: string;
  };
}

// Agent 5 Healthcare Analytics Output
export interface Agent5Result {
  headline: string;
  satisfaction_insights: string[];
  top_themes: string[];
  hidden_problems: { problem: string; evidence: string }[];
  ai_risk_monitoring: {
    hallucination_trap: string[];
    bias_related: string[];
    human_review: string[];
  };
  top_priorities: string[];
  quick_wins: string[];
  long_term_ai_opportunities: string[];
  additional_information_needed: string;
}

// Agent 4 Final Decision Output
export interface Agent4FinalResult {
  top_alert: string;
  answer: string;
  priority: 'Low' | 'Medium' | 'High';
  priority_reason: string;
  recommended_actions: {
    action: string;
    owner: string;
    timeframe: string;
  }[];
  human_review: {
    item: string;
    reason: string;
  }[];
}

export interface AgentExecutionState {
  status: AgentStatus;
  startedAt?: number;
  completedAt?: number;
  error?: string;
  assignedTask?: string;
  activeInput?: any;
  result?: any;
  isCustomTask?: boolean;
}

export type RunMode = 'auto' | 'step_by_step';

export type WorkflowStep =
  | 'idle'
  | 'step1_planning'
  | 'step1_review'
  | 'step2_specialists'
  | 'step2_review'
  | 'step3_analytics'
  | 'step3_review'
  | 'step4_final'
  | 'completed';
