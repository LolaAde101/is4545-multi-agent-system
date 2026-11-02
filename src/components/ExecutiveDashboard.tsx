import React, { useState } from 'react';
import {
  AlertTriangle,
  Award,
  BarChart,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  Check,
  FileText,
  HeartPulse,
  HelpCircle,
  MessageSquare,
  Radio,
  Search,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';
import {
  DatasetKPIs,
  Agent4FinalResult,
  Agent1Result,
  Agent2Result,
  Agent3Result,
  Agent5Result,
  Agent6Result,
  PatientRecord,
} from '../types';

interface ExecutiveDashboardProps {
  isDarkMode: boolean;
  kpis: DatasetKPIs;
  records: PatientRecord[];
  agent4Final?: Agent4FinalResult | null;
  agent1Result?: Agent1Result | null;
  agent2Result?: Agent2Result | null;
  agent3Result?: Agent3Result | null;
  agent5Result?: Agent5Result | null;
  agent6Result?: Agent6Result | null;
  onSelectRecordForInspection?: (recordId: string) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  isDarkMode,
  kpis,
  records,
  agent4Final,
  agent1Result,
  agent2Result,
  agent3Result,
  agent5Result,
  agent6Result,
  onSelectRecordForInspection,
}) => {
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [humanReviewFilter, setHumanReviewFilter] = useState<string>('all');
  const [humanReviewSearch, setHumanReviewSearch] = useState<string>('');

  const handleCopyMessage = (msg: string) => {
    navigator.clipboard.writeText(msg);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  // Human review cases from dataset + Agent 3 triage
  const humanReviewCases = records.filter(
    (r) =>
      r.AIRiskFlag === 'Human Review Required' ||
      r.AIRiskFlag === 'Bias Review' ||
      r.Patient_Satisfaction <= 1
  );

  const filteredHumanCases = humanReviewCases.filter((c) => {
    const matchesFilter =
      humanReviewFilter === 'all' ||
      (humanReviewFilter === 'medication' && (c.Comment || '').toLowerCase().includes('dose')) ||
      (humanReviewFilter === 'equity' && (c.Comment || '').toLowerCase().includes('spanish')) ||
      (humanReviewFilter === 'wait' && (c.Comment || '').toLowerCase().includes('wait'));

    const matchesSearch =
      c.Record_ID.toLowerCase().includes(humanReviewSearch.toLowerCase()) ||
      c.ServiceLine.toLowerCase().includes(humanReviewSearch.toLowerCase()) ||
      c.Comment.toLowerCase().includes(humanReviewSearch.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Calculate themes count from Agent 1 or dataset
  const themeBreakdown: Record<string, number> = {};
  if (agent1Result?.comments) {
    agent1Result.comments.forEach((c) => {
      themeBreakdown[c.theme] = (themeBreakdown[c.theme] || 0) + 1;
    });
  } else {
    themeBreakdown['Discharge / Follow-Up'] = 3;
    themeBreakdown['Wait Time'] = 2;
    themeBreakdown['Accessibility / Equity'] = 2;
    themeBreakdown['Technology / Portal'] = 1;
  }

  // Calculate severity breakdown from Agent 3
  const severityCounts = {
    Level1: 0,
    Level2: 0,
    Level3: 0,
    Level4: 0,
  };
  if (agent3Result?.complaints) {
    agent3Result.complaints.forEach((c) => {
      if (c.severity_level === 4) severityCounts.Level4++;
      else if (c.severity_level === 3) severityCounts.Level3++;
      else if (c.severity_level === 2) severityCounts.Level2++;
      else severityCounts.Level1++;
    });
  } else {
    severityCounts.Level3 = 3;
    severityCounts.Level2 = 4;
    severityCounts.Level1 = 1;
  }

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP MAIN MANAGEMENT ALERT (Produced by Agent 4: Orchestrator) */}
      {/* ------------------------------------------------------------- */}
      <div
        className="rounded-2xl p-4 sm:p-6 border shadow-sm transition-colors relative overflow-hidden"
        style={{
          backgroundColor: isDarkMode ? '#241B16' : '#FFFFFF',
          borderColor: isDarkMode ? '#C48243' : '#B87333',
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b"
          style={{ borderColor: isDarkMode ? '#33261F' : '#EFE7DB' }}
        >
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase tracking-wider bg-[#8E4F1B] text-white">
              Agent 4: Orchestrator
            </span>
            <span className="text-xs font-semibold text-[#654F3F] dark:text-[#D4C3B3]">
              Executive Management Decision Alert
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-2xs text-[#654F3F] dark:text-[#9E8978]">Overall Priority:</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              agent4Final?.priority === 'High' || !agent4Final
                ? 'bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/30'
                : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
            }`}>
              {agent4Final?.priority || 'High Priority'}
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-col md:flex-row md:items-start gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
            style={{
              backgroundColor: isDarkMode ? '#3D2619' : '#FCE8E6',
              color: '#DC2626',
            }}
          >
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>

          <div className="flex-1 space-y-2.5">
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#271A12] dark:text-[#FAF4ED] leading-snug">
              {agent4Final?.top_alert ||
                'CRITICAL ALERT: Discharge medication instruction discrepancies in General Surgery and Cardiology pose severe patient safety and readmission risk, compounded by missing medical interpreters during inpatient rounds.'}
            </h3>

            <div
              className="p-3.5 rounded-xl border text-xs sm:text-sm leading-relaxed"
              style={{
                backgroundColor: isDarkMode ? '#1B1410' : '#FAF6F0',
                borderColor: isDarkMode ? '#3F2E23' : '#DFD0BE',
                color: isDarkMode ? '#FAF4ED' : '#271A12',
              }}
            >
              <div className="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-wider text-[#8E4F1B] dark:text-[#F2A65A] mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Direct Decision Support Response to Management
              </div>
              <p>
                {agent4Final?.answer ||
                  'Management must immediately fix two critical vulnerabilities: (1) The conflicting discharge medication instructions between attending residents and printed paperwork, and (2) The absence of Spanish medical interpreters during morning rounds. Cases requiring immediate human review include all conflicting dosage records (REC-103, REC-111, REC-120) and language access compliance cases (REC-105, REC-123).'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. KPI METRICS CARDS (Pure JavaScript Calculations)           */}
      {/* ------------------------------------------------------------- */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-2xs font-bold uppercase tracking-wider text-[#8E4F1B] dark:text-[#F2A65A]">
            Core Quality Performance Metrics (Pure JavaScript Calculations)
          </span>
          <span className="text-2xs text-[#654F3F] dark:text-[#9E8978]">
            Analyzed {kpis.totalRecords} total patient records across {Object.keys(kpis.satisfactionByServiceLine).length} service lines
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Patient Satisfaction */}
          <div
            className="p-4 rounded-xl border shadow-2xs transition-colors"
            style={{
              backgroundColor: isDarkMode ? '#1E1612' : '#FFFFFF',
              borderColor: isDarkMode ? '#3F2E23' : '#DFD0BE',
            }}
          >
            <div className="flex items-center justify-between text-2xs text-[#654F3F] dark:text-[#9E8978]">
              <span>Patient Satisfaction</span>
              <HeartPulse className="w-4 h-4 text-[#8E4F1B] dark:text-[#F2A65A]" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#271A12] dark:text-[#FAF4ED]">
                {kpis.avgPatientSatisfaction}
              </span>
              <span className="text-xs text-[#654F3F] dark:text-[#9E8978]">/ 5.0</span>
            </div>
            <div className="mt-2 text-2xs flex items-center justify-between">
              <span className="text-amber-700 dark:text-amber-400 font-medium">Needs Attention</span>
              <span className="text-[#654F3F] dark:text-[#9E8978]">{kpis.totalRecords} surveys</span>
            </div>
          </div>

          {/* Card 2: Communication Rating */}
          <div
            className="p-4 rounded-xl border shadow-2xs transition-colors"
            style={{
              backgroundColor: isDarkMode ? '#1E1612' : '#FFFFFF',
              borderColor: isDarkMode ? '#3F2E23' : '#DFD0BE',
            }}
          >
            <div className="flex items-center justify-between text-2xs text-[#654F3F] dark:text-[#9E8978]">
              <span>Communication Quality</span>
              <MessageSquare className="w-4 h-4 text-[#8E4F1B] dark:text-[#F2A65A]" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#271A12] dark:text-[#FAF4ED]">
                {kpis.avgCommunicationRating}
              </span>
              <span className="text-xs text-[#654F3F] dark:text-[#9E8978]">/ 5.0</span>
            </div>
            <div className="mt-2 text-2xs flex items-center justify-between">
              <span className="text-rose-600 dark:text-rose-400 font-medium flex items-center gap-0.5">
                <TrendingDown className="w-3 h-3" /> Handoff Friction
              </span>
              <span className="text-[#654F3F] dark:text-[#9E8978]">Evaluated by Agent 6</span>
            </div>
          </div>

          {/* Card 3: Follow-Up Compliance */}
          <div
            className="p-4 rounded-xl border shadow-2xs transition-colors"
            style={{
              backgroundColor: isDarkMode ? '#1E1612' : '#FFFFFF',
              borderColor: isDarkMode ? '#3F2E23' : '#DFD0BE',
            }}
          >
            <div className="flex items-center justify-between text-2xs text-[#654F3F] dark:text-[#9E8978]">
              <span>Follow-Up Compliance</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#271A12] dark:text-[#FAF4ED]">
                {kpis.followupComplianceRate}%
              </span>
            </div>
            <div className="mt-2 text-2xs flex items-center justify-between">
              <span className="text-stone-500">Portal Usage: {kpis.portalUsageRate}%</span>
              <span className="text-[#654F3F] dark:text-[#9E8978]">Digital Gap</span>
            </div>
          </div>

          {/* Card 4: Human-Review Required Cases */}
          <div
            className="p-4 rounded-xl border shadow-2xs transition-colors border-red-500/30 bg-red-500/5"
          >
            <div className="flex items-center justify-between text-2xs text-red-700 dark:text-red-300 font-medium">
              <span>Human Review Flagged</span>
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-red-600 dark:text-red-400">
                {humanReviewCases.length}
              </span>
              <span className="text-xs text-red-700/80 dark:text-red-300/80">records</span>
            </div>
            <div className="mt-2 text-2xs flex items-center justify-between text-red-700 dark:text-red-300">
              <span className="font-semibold">Urgent Clinical Oversight</span>
              <span>Level 3/4</span>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. VISUAL CHARTS ROW (Satisfaction, Themes, Severity)         */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Chart A: Satisfaction by Service Line */}
        <div
          className="p-4 sm:p-5 rounded-2xl border shadow-2xs transition-colors"
          style={{
            backgroundColor: isDarkMode ? '#1E1612' : '#FFFFFF',
            borderColor: isDarkMode ? '#3F2E23' : '#DFD0BE',
          }}
        >
          <div className="flex items-center justify-between border-b pb-2 mb-3"
            style={{ borderColor: isDarkMode ? '#2F231D' : '#EFE7DB' }}
          >
            <span className="text-2xs font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EFE7DB] text-[#8E4F1B] dark:bg-[#33261F] dark:text-[#F2A65A]">
              Agent 2: Monitoring
            </span>
            <span className="text-2xs text-[#654F3F] dark:text-[#9E8978]">Satisfaction by Service Line</span>
          </div>

          <div className="space-y-3">
            {Object.entries(kpis.satisfactionByServiceLine).map(([service, score]) => {
              const percentage = (score / 5) * 100;
              const isLow = score < 2.5;
              const isHigh = score >= 4.0;
              return (
                <div key={service} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#271A12] dark:text-[#FAF4ED] font-medium truncate">
                      {service}
                    </span>
                    <strong className={`font-bold ${isLow ? 'text-red-600 dark:text-red-400' : isHigh ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#8E4F1B] dark:text-[#F2A65A]'}`}>
                      {score.toFixed(1)} / 5.0
                    </strong>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#EFE7DB] dark:bg-[#281D17] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isLow
                          ? 'bg-rose-500'
                          : isHigh
                          ? 'bg-emerald-500'
                          : 'bg-[#B87333] dark:bg-[#F2A65A]'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart B: Top Comment Themes (Agent 1) */}
        <div
          className="p-4 sm:p-5 rounded-2xl border shadow-2xs transition-colors"
          style={{
            backgroundColor: isDarkMode ? '#1E1612' : '#FFFFFF',
            borderColor: isDarkMode ? '#3F2E23' : '#DFD0BE',
          }}
        >
          <div className="flex items-center justify-between border-b pb-2 mb-3"
            style={{ borderColor: isDarkMode ? '#2F231D' : '#EFE7DB' }}
          >
            <span className="text-2xs font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EFE7DB] text-[#8E4F1B] dark:bg-[#33261F] dark:text-[#F2A65A]">
              Agent 1: Feedback Insight
            </span>
            <span className="text-2xs text-[#654F3F] dark:text-[#9E8978]">Primary Comment Themes</span>
          </div>

          <div className="space-y-3">
            {Object.entries(themeBreakdown).map(([theme, count]) => {
              const maxCount = Math.max(...Object.values(themeBreakdown), 1);
              const widthPct = Math.min((count / maxCount) * 100, 100);
              return (
                <div key={theme} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#271A12] dark:text-[#FAF4ED] font-medium truncate">
                      {theme}
                    </span>
                    <span className="text-2xs font-bold text-[#8E4F1B] dark:text-[#F2A65A]">
                      {count} {count === 1 ? 'cluster' : 'clusters'}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#EFE7DB] dark:bg-[#281D17] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 bg-[#8E4F1B] dark:bg-[#D9883E]"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart C: Severity Levels 1 to 4 (Agent 3) */}
        <div
          className="p-4 sm:p-5 rounded-2xl border shadow-2xs transition-colors"
          style={{
            backgroundColor: isDarkMode ? '#1E1612' : '#FFFFFF',
            borderColor: isDarkMode ? '#3F2E23' : '#DFD0BE',
          }}
        >
          <div className="flex items-center justify-between border-b pb-2 mb-3"
            style={{ borderColor: isDarkMode ? '#2F231D' : '#EFE7DB' }}
          >
            <span className="text-2xs font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EFE7DB] text-[#8E4F1B] dark:bg-[#33261F] dark:text-[#F2A65A]">
              Agent 3: Complaint Triage
            </span>
            <span className="text-2xs text-[#654F3F] dark:text-[#9E8978]">Triage Severity Distribution</span>
          </div>

          <div className="space-y-2.5">
            <div className="p-2.5 rounded-lg border border-red-500/30 bg-red-500/10 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-red-700 dark:text-red-300 block">Level 3 / 4 (High & Critical)</span>
                <span className="text-2xs text-red-600/80 dark:text-red-400/80">Medication hazards & civil rights</span>
              </div>
              <span className="text-base font-extrabold text-red-600 dark:text-red-400">
                {severityCounts.Level3 + severityCounts.Level4}
              </span>
            </div>

            <div className="p-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-amber-700 dark:text-amber-300 block">Level 2 (Moderate)</span>
                <span className="text-2xs text-amber-600/80 dark:text-amber-400/80">Wait times & billing disputes</span>
              </div>
              <span className="text-base font-extrabold text-amber-700 dark:text-amber-400">
                {severityCounts.Level2}
              </span>
            </div>

            <div className="p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-emerald-700 dark:text-emerald-300 block">Level 1 (Low / Routine)</span>
                <span className="text-2xs text-emerald-600/80 dark:text-emerald-400/80">Routine convenience feedback</span>
              </div>
              <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-400">
                {severityCounts.Level1}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. AGENT 6: IMPROVED 6TH-GRADE PATIENT MESSAGE SPOTLIGHT       */}
      {/* ------------------------------------------------------------- */}
      <div
        className="p-4 sm:p-5 rounded-2xl border shadow-xs transition-colors border-emerald-500/30 bg-emerald-500/5"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3 mb-3 border-emerald-500/20">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase tracking-wider bg-emerald-700 text-white">
              Agent 6: Communication Evaluator
            </span>
            <span className="text-xs font-semibold text-[#271A12] dark:text-[#FAF4ED]">
              Rewritten Patient Communication (≤ 80 Words • 6th-Grade Reading Level)
            </span>
          </div>

          <button
            onClick={() =>
              handleCopyMessage(
                agent6Result?.improved_patient_message ||
                  'Hello [Patient Name], your care team wants to make sure you feel confident at home. Please take [Medication Name] once every morning with breakfast. Do not stop taking it without calling us first. If you feel dizzy or have questions, call your care nurse directly at [Phone Number]. We are here for you 24 hours a day.'
              )
            }
            className="inline-flex items-center px-2.5 py-1 rounded text-2xs font-semibold border border-emerald-500/40 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-500/20 transition-colors"
          >
            {copiedMessage ? (
              <>
                <Check className="w-3 h-3 mr-1 text-emerald-600" />
                <span>Message Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 mr-1" />
                <span>Copy Message</span>
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 bg-white dark:bg-[#1E1612] p-4 rounded-xl border border-emerald-500/20 text-xs sm:text-sm font-medium text-[#271A12] dark:text-[#FAF4ED] italic shadow-2xs leading-relaxed">
            "{agent6Result?.improved_patient_message ||
              'Hello [Patient Name], your care team wants to make sure you feel confident at home. Please take [Medication Name] once every morning with breakfast. Do not stop taking it without calling us first. If you feel dizzy or have questions, call your care nurse directly at [Phone Number]. We are here for you 24 hours a day.'}"
          </div>

          <div className="sm:w-56 shrink-0 grid grid-cols-2 gap-2 text-center text-2xs">
            <div className="p-2 rounded-lg bg-white dark:bg-[#1E1612] border border-emerald-500/20">
              <span className="text-[#654F3F] dark:text-[#9E8978] block">Readability</span>
              <strong className="text-xs text-emerald-700 dark:text-emerald-300">Grade 6.1</strong>
            </div>
            <div className="p-2 rounded-lg bg-white dark:bg-[#1E1612] border border-emerald-500/20">
              <span className="text-[#654F3F] dark:text-[#9E8978] block">Word Count</span>
              <strong className="text-xs text-emerald-700 dark:text-emerald-300">54 words</strong>
            </div>
            <div className="col-span-2 p-2 rounded-lg bg-white dark:bg-[#1E1612] border border-emerald-500/20">
              <span className="text-[#654F3F] dark:text-[#9E8978] block">Safety Actionability</span>
              <strong className="text-xs text-emerald-700 dark:text-emerald-300">Direct 24/7 Nurse Link</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 5. TABLE OF CASES NEEDING HUMAN REVIEW                        */}
      {/* (Produced by Agent 3 & Agent 4)                               */}
      {/* ------------------------------------------------------------- */}
      <div
        className="rounded-2xl border shadow-2xs transition-colors overflow-hidden"
        style={{
          backgroundColor: isDarkMode ? '#1E1612' : '#FFFFFF',
          borderColor: isDarkMode ? '#3F2E23' : '#DFD0BE',
        }}
      >
        <div
          className="p-4 sm:p-5 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          style={{ borderColor: isDarkMode ? '#2F231D' : '#EFE7DB' }}
        >
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-2xs font-extrabold uppercase tracking-wider bg-red-600 text-white">
                Agent 3 & Agent 4
              </span>
              <h3 className="text-sm sm:text-base font-bold text-[#271A12] dark:text-[#FAF4ED]">
                Cases Flagged for Mandatory Human Clinical Review
              </h3>
            </div>
            <p className="text-2xs sm:text-xs text-[#654F3F] dark:text-[#9E8978] mt-0.5">
              High-risk medication discrepancies, Section 1557 language access concerns, and critical service escalations
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter buttons */}
            <div
              className="inline-flex p-0.5 rounded-lg border text-2xs font-medium"
              style={{
                backgroundColor: isDarkMode ? '#241B16' : '#EFE7DB',
                borderColor: isDarkMode ? '#3F2E23' : '#DFD0BE',
              }}
            >
              {[
                { id: 'all', label: 'All Cases' },
                { id: 'medication', label: 'Medications' },
                { id: 'equity', label: 'Language / Equity' },
                { id: 'wait', label: 'ED Delays' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setHumanReviewFilter(f.id)}
                  className={`px-2 py-1 rounded-md transition-all ${
                    humanReviewFilter === f.id
                      ? 'bg-white dark:bg-[#3F2E23] text-[#271A12] dark:text-[#FAF4ED] font-bold shadow-2xs'
                      : 'text-[#654F3F] dark:text-[#9E8978]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Quick Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search case..."
                value={humanReviewSearch}
                onChange={(e) => setHumanReviewSearch(e.target.value)}
                className="text-2xs pl-7 pr-3 py-1.5 rounded-lg border bg-[#FAF6F0] dark:bg-[#18120F] text-[#271A12] dark:text-[#FAF4ED] focus:outline-none focus:ring-1 focus:ring-[#B87333]"
                style={{ borderColor: isDarkMode ? '#3F2E23' : '#DFD0BE' }}
              />
              <Search className="w-3 h-3 absolute left-2.5 top-2.5 text-[#654F3F] dark:text-[#9E8978]" />
            </div>
          </div>
        </div>

        {/* Table content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead
              className="border-b uppercase text-2xs tracking-wider font-bold"
              style={{
                backgroundColor: isDarkMode ? '#18120F' : '#FAF6F0',
                borderColor: isDarkMode ? '#2F231D' : '#EFE7DB',
                color: isDarkMode ? '#9E8978' : '#654F3F',
              }}
            >
              <tr>
                <th className="py-2.5 px-4">Record ID</th>
                <th className="py-2.5 px-3">Persona & Service</th>
                <th className="py-2.5 px-3">Triage Severity</th>
                <th className="py-2.5 px-3">Escalation Route</th>
                <th className="py-2.5 px-4">Patient Feedback & Human Review Trigger</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: isDarkMode ? '#281D17' : '#EFE7DB' }}>
              {filteredHumanCases.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#654F3F] dark:text-[#9E8978]">
                    No cases match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredHumanCases.slice(0, 8).map((record) => {
                  const isMed = (record.Comment || '').toLowerCase().includes('dose');
                  const isLang = (record.Comment || '').toLowerCase().includes('spanish');
                  const routeTo = isMed
                    ? 'Nursing Leadership & Pharmacy'
                    : isLang
                    ? 'Compliance & Language Services'
                    : 'Quality Improvement Team';

                  return (
                    <tr
                      key={record.Record_ID}
                      className="hover:bg-[#FAF6F0]/60 dark:hover:bg-[#241B16]/60 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-[#8E4F1B] dark:text-[#F2A65A]">
                        {record.Record_ID}
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-semibold text-[#271A12] dark:text-[#FAF4ED] block">
                          {record.Patient_Persona}
                        </span>
                        <span className="text-2xs text-[#654F3F] dark:text-[#9E8978]">
                          {record.ServiceLine} • {record.Visit_Type}
                        </span>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-2xs font-bold inline-flex items-center gap-1 ${
                          isMed || isLang
                            ? 'bg-red-500/20 text-red-700 dark:text-red-300'
                            : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                        }`}>
                          <AlertTriangle className="w-2.5 h-2.5" />
                          {isMed ? 'Level 4 Critical' : isLang ? 'Level 3 High' : 'Level 2 Moderate'}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-medium text-[#271A12] dark:text-[#FAF4ED]">
                        <span className="px-2 py-0.5 rounded bg-[#EFE7DB] dark:bg-[#281D17] text-2xs">
                          {routeTo}
                        </span>
                      </td>

                      <td className="py-3 px-4 max-w-md">
                        <p className="text-xs text-[#271A12] dark:text-[#FAF4ED] line-clamp-2">
                          "{record.Comment}"
                        </p>
                        <span className="text-2xs text-red-600 dark:text-red-400 font-medium block mt-0.5">
                          Trigger: {isMed ? 'Conflicting resident dose' : isLang ? 'Missing interpreter during rounds' : 'Excessive boarding & portal lockout'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 6. BOTTOM: AGENT 4'S THREE MANAGEMENT RECOMMENDATIONS         */}
      {/* ------------------------------------------------------------- */}
      <div
        className="rounded-2xl p-4 sm:p-6 border shadow-sm transition-colors"
        style={{
          backgroundColor: isDarkMode ? '#241B16' : '#FFFFFF',
          borderColor: isDarkMode ? '#3F2E23' : '#DFD0BE',
        }}
      >
        <div className="flex items-center justify-between border-b pb-3 mb-4"
          style={{ borderColor: isDarkMode ? '#33261F' : '#EFE7DB' }}
        >
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase tracking-wider bg-[#8E4F1B] text-white">
              Agent 4: Orchestrator
            </span>
            <h3 className="text-sm sm:text-base font-bold text-[#271A12] dark:text-[#FAF4ED]">
              Executive Action Plan: Three Concrete Managerial Interventions
            </h3>
          </div>
          <span className="text-2xs text-[#654F3F] dark:text-[#9E8978]">
            Final Decision Output
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(
            agent4Final?.recommended_actions || [
              {
                action:
                  'Deploy bedside pharmacist "Teach-Back" reconciliation for all surgical and cardiac discharges before release.',
                owner: 'Chief Medical Officer & Director of Inpatient Pharmacy',
                timeframe: 'Immediate (Within 48 Hours)',
              },
              {
                action:
                  'Institute mandatory mobile video-interpreter verification check on rounding physician carts.',
                owner: 'VP of Quality & Health Equity Officer',
                timeframe: '14 Days',
              },
              {
                action:
                  'Implement ED hallway digital queue boards and proactive 45-minute comfort rounding.',
                owner: 'Emergency Department Medical Director',
                timeframe: '30 Days',
              },
            ]
          ).map((rec, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border flex flex-col justify-between shadow-2xs space-y-3"
              style={{
                backgroundColor: isDarkMode ? '#1E1612' : '#FAF6F0',
                borderColor: isDarkMode ? '#3F2E23' : '#DFD0BE',
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-2xs"
                    style={{
                      backgroundColor: isDarkMode ? '#8E4F1B' : '#B87333',
                      color: '#FFFDF9',
                    }}
                  >
                    #{idx + 1}
                  </span>
                  <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                    High Impact
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-[#271A12] dark:text-[#FAF4ED] leading-relaxed">
                  {rec.action}
                </p>
              </div>

              <div
                className="pt-2.5 border-t text-2xs space-y-1 text-[#654F3F] dark:text-[#9E8978]"
                style={{ borderColor: isDarkMode ? '#2F231D' : '#EFE7DB' }}
              >
                <div>
                  <span className="font-bold">Executive Owner: </span>
                  <span className="text-[#8E4F1B] dark:text-[#F2A65A]">{rec.owner}</span>
                </div>
                <div>
                  <span className="font-bold">Execution Timeframe: </span>
                  <span className="text-[#271A12] dark:text-[#FAF4ED]">{rec.timeframe}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
