import {
  DistinctComment,
  DatasetKPIs,
  Agent4PlanResult,
  Agent1Result,
  Agent2Result,
  Agent3Result,
  Agent6Result,
  Agent5Result,
  Agent4FinalResult,
} from '../types';

// Client-side caller for the server-side LLM endpoint
export async function callAgentLLM<T = any>(
  agentId: string,
  prompt: string,
  systemInstruction: string,
  data: any
): Promise<T> {
  const response = await fetch('/api/llm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      agentId,
      prompt,
      systemInstruction,
      data,
    }),
  });

  const responseJson = await response.json();

  if (!response.ok || !responseJson.success) {
    throw new Error(responseJson.error || `Server failed while executing ${agentId}`);
  }

  return responseJson.result as T;
}

// ----------------------------------------------------------------------
// AGENT 4: Orchestrator (Job 1: Planning)
// ----------------------------------------------------------------------
export async function runAgent4Planning(
  managerQuestion: string,
  availableColumns: string[],
  kpis: DatasetKPIs
): Promise<Agent4PlanResult> {
  const systemInstruction = `You are a Hospital Manager Decision Support Agent.
Your role is to help hospital managers identify operational problems, patient experience issues, risks, and opportunities for improvement. You lead a team of specialist agents.
JOB 1 — PLANNING (at the start).
TASKS:
1. Restate what the manager needs in one sentence as "goal".
2. Decide which specialist agents are needed:
   - Agent 1 (Patient Feedback Insight)
   - Agent 2 (Patient Experience Monitoring)
   - Agent 3 (Complaint Triage)
   - Agent 6 (Communication Quality)
3. Write a one-sentence task for each agent you choose, and give a reason for any agent you skip.
Do not analyze the data yourself in this step.

OUTPUT FORMAT:
Return strictly valid JSON:
{
  "goal": "string",
  "agents": [
    { "agent": "Agent 1", "run": true, "task": "string", "reason": "string" },
    { "agent": "Agent 2", "run": true, "task": "string", "reason": "string" },
    { "agent": "Agent 3", "run": true, "task": "string", "reason": "string" },
    { "agent": "Agent 6", "run": true, "task": "string", "reason": "string" }
  ]
}`;

  const prompt = `Review the manager's question, the available columns, and calculated KPIs. Restate the managerial goal and specify whether to run Agent 1, Agent 2, Agent 3, and Agent 6, with their assigned tasks. Manager question: "${managerQuestion}".`;

  const inputData = {
    manager_question: managerQuestion,
    data_columns: availableColumns,
    kpis: {
      total_records: kpis.totalRecords,
      avg_satisfaction: kpis.avgPatientSatisfaction,
      avg_communication: kpis.avgCommunicationRating,
      followup_rate: `${kpis.followupComplianceRate}%`,
      portal_usage_rate: `${kpis.portalUsageRate}%`,
      service_lines: Object.keys(kpis.satisfactionByServiceLine),
      ai_risk_flags: kpis.aiRiskFlagCounts,
    },
  };

  return await callAgentLLM<Agent4PlanResult>('agent4_plan', prompt, systemInstruction, inputData);
}

// ----------------------------------------------------------------------
// AGENT 1: Patient Feedback Insight Agent
// ----------------------------------------------------------------------
export async function runAgent1Feedback(
  distinctComments: DistinctComment[],
  customTask?: string
): Promise<Agent1Result> {
  const systemInstruction = `You are a Patient Feedback Insight Agent for a healthcare organization.
ROLE: Analyze patient comments and help healthcare leaders understand patient experience, operational problems, communication issues, and possible risks.
TASKS for each distinct patient comment:
1. Theme: Choose one from Communication, Scheduling, Wait Time, Technology / Patient Portal, Billing, Clinical Care, Discharge / Follow-Up, Accessibility / Equity, Mixed or Ambiguous.
2. Sentiment: Positive, Negative, Neutral, Mixed.
3. Reasoning: Briefly explain theme & sentiment choice.
4. Operational Issue: Identify healthcare process issue.
5. Risk or Bias Concern: Flag any safety, accessibility, fairness, language, disability, or over-automation concern.
6. Recommended Action: Suggest one practical managerial action.
CONSTRAINTS: Professional healthcare quality-improvement tone. Do not invent medical facts.

OUTPUT FORMAT:
Return strictly JSON:
{
  "comments": [
    {
      "id": "C1",
      "theme": "Wait Time",
      "sentiment": "Negative",
      "reasoning": "...",
      "operational_issue": "...",
      "risk_or_bias_concern": "...",
      "recommended_action": "..."
    }
  ],
  "summary": "Brief overall synthesis"
}`;

  const prompt = customTask || `Analyze each distinct patient comment provided in the input, identifying the theme, sentiment, reasoning, operational issue, risk/bias concerns, and managerial recommendations.`;

  const inputData = {
    distinct_comments: distinctComments.map((c) => ({
      id: c.id,
      comment: c.comment,
      record_count: c.count,
    })),
  };

  return await callAgentLLM<Agent1Result>('agent1', prompt, systemInstruction, inputData);
}

// ----------------------------------------------------------------------
// AGENT 2: Patient Experience Monitoring Agent
// ----------------------------------------------------------------------
export async function runAgent2Monitoring(
  kpis: DatasetKPIs,
  customTask?: string
): Promise<Agent2Result> {
  const systemInstruction = `You are a Patient Experience Monitoring Agent for a healthcare organization.
ROLE: Analyze patient feedback metrics and help leaders improve patient experiences, communication quality, operational performance, and healthcare equity.
TASKS:
STEP 1: Pattern Identification (groups, service lines, visit types, or years showing notable differences).
STEP 2: Operational Issue Identification (specific operational bottlenecks).
STEP 3: Healthcare Equity and Accessibility Review (older adults, rural patients, disabilities, limited English proficiency, digital literacy).
STEP 4: Risk Assessment (Low, Moderate, or High across Patient Safety, Reputational, Compliance, Equity).
STEP 5: Managerial Recommendation (practical, actionable).
CONSTRAINTS: Professional tone. Do not invent medical facts. Use provided numbers; do not recalculate them.

OUTPUT FORMAT:
Return strictly JSON:
{
  "patterns": [{"pattern": "...", "evidence": "..."}],
  "operational_issues": ["..."],
  "equity_concerns": [{"group": "...", "concern": "...", "evidence": "..."}],
  "risk": {"patient_safety": "Low|Moderate|High", "reputational": "Low|Moderate|High", "compliance": "Low|Moderate|High", "equity": "Low|Moderate|High"},
  "recommendation": "...",
  "additional_information_needed": "..."
}`;

  const prompt = customTask || `Review the calculated KPI metrics, demographic distributions, service lines, and readmission risk patterns to detect trends, operational bottlenecks, equity concerns, and organizational risks.`;

  const inputData = {
    total_records: kpis.totalRecords,
    avg_satisfaction: kpis.avgPatientSatisfaction,
    avg_communication_rating: kpis.avgCommunicationRating,
    followup_compliance_rate: `${kpis.followupComplianceRate}%`,
    portal_usage_rate: `${kpis.portalUsageRate}%`,
    satisfaction_by_service_line: kpis.satisfactionByServiceLine,
    satisfaction_by_year: kpis.satisfactionByYear,
    satisfaction_by_persona: kpis.satisfactionByPersona,
    satisfaction_by_visit_type: kpis.satisfactionByVisitType,
    readmission_risk_counts: kpis.readmissionRiskCounts,
    ai_risk_flag_counts: kpis.aiRiskFlagCounts,
  };

  return await callAgentLLM<Agent2Result>('agent2', prompt, systemInstruction, inputData);
}

// ----------------------------------------------------------------------
// AGENT 3: Complaint Triage Assistant
// ----------------------------------------------------------------------
export async function runAgent3Triage(
  distinctComments: DistinctComment[],
  customTask?: string
): Promise<Agent3Result> {
  const systemInstruction = `You are a Healthcare Complaint Triage Assistant.
ROLE: Help healthcare organizations review, prioritize, and route patient complaints efficiently while maintaining patient safety, fairness, compliance, and appropriate human oversight.
Your role is NOT to resolve complaints.
TASKS for every complaint:
STEP 1: Complaint Category (Communication, Scheduling, Wait Time, Technology / Patient Portal, Billing, Clinical Care, Patient Safety, Privacy or Security, Staff Conduct, Other).
STEP 2: Severity Assessment (LEVEL 1 – Low, LEVEL 2 – Moderate, LEVEL 3 – High, LEVEL 4 – Critical) + Reasoning.
STEP 3: Risk Detection (Patient Safety Risk, Clinical Risk, Compliance Risk, Privacy Risk, Accessibility Risk, Equity Risk, Reputational Risk, Operational Risk) + Why.
STEP 4: Escalation Recommendation (Route to: Patient Experience Team, Nursing Leadership, Physician Leadership, Quality Improvement Team, Compliance Office, Information Technology, Revenue Cycle / Billing, Accessibility Coordinator, Risk Management, Executive Review).
STEP 5: Human Review (Required boolean + explanation. Level 3 or 4 or ambiguous cases require human review).

OUTPUT FORMAT:
Return strictly JSON:
{
  "complaints": [
    {
      "id": "C1",
      "primary_category": "Wait Time",
      "secondary_categories": ["Communication"],
      "severity_level": 2,
      "severity_reasoning": "...",
      "risks": [{"risk": "Patient Safety Risk", "why": "..."}],
      "route_to": "Patient Experience Team",
      "human_review_required": false,
      "human_review_reason": "..."
    }
  ],
  "summary": "Overall triage overview"
}`;

  const prompt = customTask || `Triage each distinct complaint comment. Assign category, severity level (1-4), specific risks, routing destination, and whether human review is required.`;

  const inputData = {
    complaints: distinctComments.map((c) => ({
      id: c.id,
      comment: c.comment,
      record_count: c.count,
      ai_risk_flags: c.aiRiskFlagCounts,
    })),
  };

  return await callAgentLLM<Agent3Result>('agent3', prompt, systemInstruction, inputData);
}

// ----------------------------------------------------------------------
// AGENT 6: Healthcare Communication Quality Evaluator
// ----------------------------------------------------------------------
export async function runAgent6Communication(
  distinctComments: DistinctComment[],
  customTask?: string
): Promise<Agent6Result> {
  const systemInstruction = `You are a Healthcare Communication Quality Evaluator.
ROLE: Evaluate healthcare communication described in patient feedback and help improve communication quality, patient understanding, patient engagement, and patient safety.
TASKS:
STEP 1: Communication Purpose (Patient Education, Appointment Information, Medication Instructions, Follow-up Care, Care Coordination, Administrative Communication, Billing Communication, Health Promotion, Emergency Instructions, Other).
STEP 2: Quality Evaluation (Rate 1-5 or "Not enough information" for Clarity, Completeness, Empathy, Patient-centeredness, Actionability).
STEP 3: Health Literacy Concern (None, Low, Moderate, High).
STEP 4: Communication Risk Assessment (Low, Moderate, High + reason).
STEP 5: Improvement Recommendations.
STEP 6: Write an Improved Patient Message (<=80 words, clear, patient-friendly, 6th grade reading level, using [brackets] for missing variables).
STEP 7: Executive Summary (Overall quality, major strengths, major weaknesses, highest risk, most important improvement).

OUTPUT FORMAT:
Return strictly JSON:
{
  "evaluations": [
    {
      "id": "C1",
      "purpose": "Appointment Information",
      "purpose_rationale": "...",
      "scores": {
        "clarity": "2",
        "completeness": "3",
        "empathy": "1",
        "patient_centeredness": "2",
        "actionability": "2"
      },
      "health_literacy_concern": "Moderate",
      "risk": "Moderate",
      "risk_reason": "...",
      "improvements": ["..."]
    }
  ],
  "improved_patient_message": "...",
  "executive_summary": {
    "overall_quality": "...",
    "major_strengths": "...",
    "major_weaknesses": "...",
    "highest_risk": "...",
    "most_important_improvement": "..."
  }
}`;

  const prompt = customTask || `Evaluate the communication issues described in the patient comments. Rate communication quality dimensions, identify health literacy barriers, write an improved 80-word patient message, and provide an executive summary.`;

  const inputData = {
    distinct_comments: distinctComments.map((c) => ({
      id: c.id,
      comment: c.comment,
      record_count: c.count,
      avg_communication_rating: c.avgCommunicationRating,
    })),
  };

  return await callAgentLLM<Agent6Result>('agent6', prompt, systemInstruction, inputData);
}

// ----------------------------------------------------------------------
// AGENT 5: Healthcare Analytics Agent
// ----------------------------------------------------------------------
export async function runAgent5Analytics(
  kpis: DatasetKPIs,
  specialistResults: {
    agent1?: Agent1Result | null;
    agent2?: Agent2Result | null;
    agent3?: Agent3Result | null;
    agent6?: Agent6Result | null;
  }
): Promise<Agent5Result> {
  const systemInstruction = `You are a Healthcare Analytics Agent.
ROLE: Turn the specialist agents' findings into executive insights for hospital leadership. Your insights will appear in an executive dashboard shared with upper-level management staff and C-suite officers.
TASKS:
SECTION 1: Executive Overview (one-sentence headline).
SECTION 2: Patient Satisfaction Insights (by service line, visit type, persona).
SECTION 3: Feedback Theme Insights (top themes from Agent 1).
SECTION 4: Hidden Organizational Problems (service lines with high complaints, bottlenecks, tech, scheduling, wait-time).
SECTION 5: AI Risk Monitoring (hallucination traps, bias-related, cases requiring human review).
SECTION 6: Executive Recommendations (top 5 priorities, quick wins <3 months, long-term AI opportunities 6-12 months).
CONSTRAINTS: Do not create fictitious information. Use KPI numbers exactly as given.

OUTPUT FORMAT:
Return strictly JSON:
{
  "headline": "...",
  "satisfaction_insights": ["..."],
  "top_themes": ["..."],
  "hidden_problems": [{"problem": "...", "evidence": "..."}],
  "ai_risk_monitoring": {
    "hallucination_trap": ["..."],
    "bias_related": ["..."],
    "human_review": ["..."]
  },
  "top_priorities": ["..."],
  "quick_wins": ["..."],
  "long_term_ai_opportunities": ["..."],
  "additional_information_needed": "..."
}`;

  const prompt = `Synthesize all specialist findings and KPI metrics into executive dashboard insights. Highlight operational bottlenecks, equity gaps, communication issues, and AI risk monitoring.`;

  const inputData = {
    kpis: {
      total_records: kpis.totalRecords,
      avg_satisfaction: kpis.avgPatientSatisfaction,
      avg_communication: kpis.avgCommunicationRating,
      followup_rate: `${kpis.followupComplianceRate}%`,
      portal_usage_rate: `${kpis.portalUsageRate}%`,
      satisfaction_by_service_line: kpis.satisfactionByServiceLine,
      satisfaction_by_year: kpis.satisfactionByYear,
      satisfaction_by_persona: kpis.satisfactionByPersona,
      satisfaction_by_visit_type: kpis.satisfactionByVisitType,
      readmission_risk_counts: kpis.readmissionRiskCounts,
      ai_risk_flags: kpis.aiRiskFlagCounts,
    },
    specialist_findings: {
      agent1_feedback: specialistResults.agent1 || 'Skipped / not run',
      agent2_monitoring: specialistResults.agent2 || 'Skipped / not run',
      agent3_triage: specialistResults.agent3 || 'Skipped / not run',
      agent6_communication: specialistResults.agent6 || 'Skipped / not run',
    },
  };

  return await callAgentLLM<Agent5Result>('agent5', prompt, systemInstruction, inputData);
}

// ----------------------------------------------------------------------
// AGENT 4: Orchestrator (Job 2: Final Decision)
// ----------------------------------------------------------------------
export async function runAgent4FinalDecision(
  managerQuestion: string,
  plan: Agent4PlanResult,
  analyticsResult: Agent5Result,
  kpis: DatasetKPIs,
  humanReviewCases: any[]
): Promise<Agent4FinalResult> {
  const systemInstruction = `You are a Hospital Manager Decision Support Agent (Orchestrator).
JOB 2 — FINAL DECISION (at the end).
ROLE: Provide the final executive management recommendation based on all specialist and analytics findings.
TASKS:
1. Identify the most important management alert or finding (top_alert).
2. Answer the manager's question directly (answer).
3. Rate overall management priority as Low, Medium, or High, and explain briefly why (priority, priority_reason).
4. Recommend 2–3 actionable management actions based on the data, with owner and timeframe (recommended_actions).
5. Determine what needs human review, especially considering AI Risk Flags like Hallucination Risk, Bias Review, or Human Review Required (human_review).
CONSTRAINTS: Focus on management issues (wait times, scheduling, communication, billing, satisfaction, portal, accessibility, readmission risk). Do not diagnose medical conditions.

OUTPUT FORMAT:
Return strictly JSON:
{
  "top_alert": "...",
  "answer": "...",
  "priority": "High|Medium|Low",
  "priority_reason": "...",
  "recommended_actions": [
    {"action": "...", "owner": "...", "timeframe": "..."}
  ],
  "human_review": [
    {"item": "...", "reason": "..."}
  ]
}`;

  const prompt = `Review the manager's question, the analytics results from Agent 5, KPIs, and human review cases to produce the final executive management recommendation. Manager's question: "${managerQuestion}".`;

  const inputData = {
    manager_question: managerQuestion,
    plan_goal: plan.goal,
    analytics_synthesis: analyticsResult,
    kpis: {
      total_records: kpis.totalRecords,
      avg_satisfaction: kpis.avgPatientSatisfaction,
      avg_communication: kpis.avgCommunicationRating,
      followup_rate: `${kpis.followupComplianceRate}%`,
      portal_usage_rate: `${kpis.portalUsageRate}%`,
    },
    flagged_human_review_cases: humanReviewCases,
  };

  return await callAgentLLM<Agent4FinalResult>('agent4_final', prompt, systemInstruction, inputData);
}
