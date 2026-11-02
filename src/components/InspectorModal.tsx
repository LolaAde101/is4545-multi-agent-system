import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  RotateCw,
  Code2,
  FileText,
  Database,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  Send,
  UserCheck,
} from 'lucide-react';
import { AgentKey, AgentExecutionState } from '../types';
import { AGENT_NODES } from './InteractiveAgentDiagram';

interface InspectorModalProps {
  isDarkMode: boolean;
  agentKey: AgentKey | null;
  agentState?: AgentExecutionState;
  onClose: () => void;
  onRerun: (agentKey: AgentKey) => void;
  onUpdateTask?: (agentKey: AgentKey, newTask: string) => void;
  isReviewMode?: boolean;
}

export const InspectorModal: React.FC<InspectorModalProps> = ({
  isDarkMode,
  agentKey,
  agentState,
  onClose,
  onRerun,
  onUpdateTask,
  isReviewMode,
}) => {
  if (!agentKey || !agentState) return null;

  const nodeInfo = AGENT_NODES[agentKey] || AGENT_NODES.agent4_plan;
  const Icon = nodeInfo.icon;
  const [activeTab, setActiveTab] = useState<'result' | 'input' | 'json'>('result');
  const [copied, setCopied] = useState(false);
  const [editedTask, setEditedTask] = useState(agentState.assignedTask || '');

  const handleCopyJson = () => {
    const jsonStr = JSON.stringify(agentState.result || {}, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveTask = () => {
    if (onUpdateTask) {
      onUpdateTask(agentKey, editedTask);
    }
  };

  const renderResultContent = () => {
    if (agentState.status === 'running') {
      return (
        <div className="py-16 text-center">
          <div className="w-12 h-12 border-3 border-[#B87333] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h4 className="text-sm font-bold text-[#271A12] dark:text-[#FAF4ED]">
            Agent is actively processing clinical data...
          </h4>
          <p className="text-xs text-[#654F3F] dark:text-[#9E8978] mt-1">
            Analyzing inputs and executing prompt instructions via Gemini AI
          </p>
        </div>
      );
    }

    if (agentState.status === 'failed') {
      return (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300">
          <div className="flex items-center gap-2 font-semibold text-sm mb-1">
            <ShieldAlert className="w-4 h-4" />
            Execution Failure
          </div>
          <p className="text-xs">{agentState.error || 'Unknown error occurred while calling the agent.'}</p>
          <button
            onClick={() => onRerun(agentKey)}
            className="mt-3 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 text-white hover:bg-red-700 inline-flex items-center gap-1.5"
          >
            <RotateCw className="w-3.5 h-3.5" /> Retry Agent
          </button>
        </div>
      );
    }

    if (!agentState.result) {
      return (
        <div className="py-12 text-center text-[#654F3F] dark:text-[#9E8978]">
          <p className="text-xs">No results recorded yet. Launch the system workflow to generate output.</p>
        </div>
      );
    }

    const res = agentState.result;

    // Agent 4: Orchestrator Plan
    if (agentKey === 'agent4_plan') {
      return (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl border bg-[#F4ECE1]/60 dark:bg-[#281D17]/60"
            style={{ borderColor: isDarkMode ? '#3F2E23' : '#DFD0BE' }}
          >
            <span className="text-2xs font-bold uppercase tracking-wider text-[#8E4F1B] dark:text-[#F2A65A]">
              Restated Goal
            </span>
            <p className="text-xs sm:text-sm font-medium text-[#271A12] dark:text-[#FAF4ED] mt-1">
              {res.goal}
            </p>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#654F3F] dark:text-[#D4C3B3]">
              Specialist Task Assignments
            </h4>
            {(res.agents || []).map((ag: any, idx: number) => (
              <div
                key={idx}
                className="p-3 rounded-lg border text-xs"
                style={{
                  backgroundColor: isDarkMode ? '#1E1612' : '#FFFFFF',
                  borderColor: isDarkMode ? '#3F2E23' : '#EFE7DB',
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#8E4F1B] dark:text-[#F2A65A]">
                    {ag.agent}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-2xs font-semibold ${
                    ag.run
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                      : 'bg-stone-500/20 text-stone-500'
                  }`}>
                    {ag.run ? 'ASSIGNED' : 'SKIPPED'}
                  </span>
                </div>
                <p className="text-[#271A12] dark:text-[#FAF4ED] font-medium">{ag.task}</p>
                {ag.reason && (
                  <p className="text-2xs text-[#654F3F] dark:text-[#9E8978] mt-1 italic">
                    Reason: {ag.reason}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Agent 1: Feedback Insight
    if (agentKey === 'agent1') {
      return (
        <div className="space-y-4">
          {res.summary && (
            <div className="p-3 rounded-xl border bg-[#F4ECE1]/60 dark:bg-[#281D17]/60"
              style={{ borderColor: isDarkMode ? '#3F2E23' : '#DFD0BE' }}
            >
              <span className="text-2xs font-bold uppercase text-[#8E4F1B] dark:text-[#F2A65A]">Thematic Summary</span>
              <p className="text-xs text-[#271A12] dark:text-[#FAF4ED] mt-1">{res.summary}</p>
            </div>
          )}

          <div className="space-y-3">
            {(res.comments || []).map((c: any, idx: number) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border text-xs space-y-2 shadow-2xs"
                style={{
                  backgroundColor: isDarkMode ? '#1E1612' : '#FFFFFF',
                  borderColor: isDarkMode ? '#3F2E23' : '#EFE7DB',
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-1.5 border-b pb-1.5"
                  style={{ borderColor: isDarkMode ? '#2F231D' : '#EFE7DB' }}
                >
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-[#EFE7DB] dark:bg-[#281D17] font-bold text-2xs">
                      {c.id}
                    </span>
                    <span className="font-semibold text-[#271A12] dark:text-[#FAF4ED]">
                      {c.theme}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-2xs font-semibold ${
                    c.sentiment === 'Positive'
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                      : c.sentiment === 'Negative'
                      ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
                      : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                  }`}>
                    {c.sentiment}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-2xs">
                  <div>
                    <span className="font-bold text-[#654F3F] dark:text-[#9E8978]">Operational Issue:</span>
                    <p className="text-[#271A12] dark:text-[#D4C3B3]">{c.operational_issue}</p>
                  </div>
                  <div>
                    <span className="font-bold text-[#654F3F] dark:text-[#9E8978]">Risk / Bias Flag:</span>
                    <p className="text-amber-700 dark:text-amber-300">{c.risk_or_bias_concern}</p>
                  </div>
                </div>

                <div className="bg-[#FAF6F0] dark:bg-[#241B16] p-2 rounded-lg text-2xs border"
                  style={{ borderColor: isDarkMode ? '#3F2E23' : '#EFE7DB' }}
                >
                  <span className="font-bold text-[#8E4F1B] dark:text-[#F2A65A]">Recommended Action: </span>
                  <span className="text-[#271A12] dark:text-[#FAF4ED]">{c.recommended_action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Agent 2: Experience Monitoring
    if (agentKey === 'agent2') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.entries(res.risk || {}).map(([key, val]: any) => (
              <div
                key={key}
                className="p-2.5 rounded-lg border text-center"
                style={{
                  backgroundColor: isDarkMode ? '#1E1612' : '#FFFFFF',
                  borderColor: isDarkMode ? '#3F2E23' : '#EFE7DB',
                }}
              >
                <span className="text-2xs uppercase tracking-wider text-[#654F3F] dark:text-[#9E8978] block truncate">
                  {key.replace('_', ' ')}
                </span>
                <span className={`text-xs font-bold mt-1 inline-block ${
                  val === 'High'
                    ? 'text-red-600 dark:text-red-400'
                    : val === 'Moderate'
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}>
                  {val}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#654F3F] dark:text-[#D4C3B3]">
              Patterns Identified
            </h4>
            {(res.patterns || []).map((p: any, idx: number) => (
              <div
                key={idx}
                className="p-3 rounded-lg border text-xs"
                style={{
                  backgroundColor: isDarkMode ? '#1E1612' : '#FFFFFF',
                  borderColor: isDarkMode ? '#3F2E23' : '#EFE7DB',
                }}
              >
                <p className="font-semibold text-[#271A12] dark:text-[#FAF4ED]">{p.pattern}</p>
                <p className="text-2xs text-[#654F3F] dark:text-[#9E8978] mt-1">Evidence: {p.evidence}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#654F3F] dark:text-[#D4C3B3]">
              Healthcare Equity & Accessibility Concerns
            </h4>
            {(res.equity_concerns || []).map((eq: any, idx: number) => (
              <div
                key={idx}
                className="p-3 rounded-lg border text-xs border-amber-500/20 bg-amber-500/5"
              >
                <span className="font-bold text-amber-700 dark:text-amber-300">{eq.group}</span>
                <p className="text-[#271A12] dark:text-[#FAF4ED] mt-0.5">{eq.concern}</p>
                <p className="text-2xs text-[#654F3F] dark:text-[#9E8978] mt-1">Evidence: {eq.evidence}</p>
              </div>
            ))}
          </div>

          {res.recommendation && (
            <div className="p-3 rounded-xl border bg-[#F4ECE1]/60 dark:bg-[#281D17]/60"
              style={{ borderColor: isDarkMode ? '#3F2E23' : '#DFD0BE' }}
            >
              <span className="text-2xs font-bold uppercase text-[#8E4F1B] dark:text-[#F2A65A]">
                Managerial Recommendation
              </span>
              <p className="text-xs font-medium text-[#271A12] dark:text-[#FAF4ED] mt-1">
                {res.recommendation}
              </p>
            </div>
          )}
        </div>
      );
    }

    // Agent 3: Complaint Triage
    if (agentKey === 'agent3') {
      return (
        <div className="space-y-4">
          {res.summary && (
            <div className="p-3 rounded-xl border bg-[#F4ECE1]/60 dark:bg-[#281D17]/60"
              style={{ borderColor: isDarkMode ? '#3F2E23' : '#DFD0BE' }}
            >
              <span className="text-2xs font-bold uppercase text-[#8E4F1B] dark:text-[#F2A65A]">Triage Overview</span>
              <p className="text-xs text-[#271A12] dark:text-[#FAF4ED] mt-1">{res.summary}</p>
            </div>
          )}

          <div className="space-y-2.5">
            {(res.complaints || []).map((comp: any, idx: number) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border text-xs space-y-2 shadow-2xs ${
                  comp.human_review_required
                    ? 'border-red-500/40 bg-red-500/5'
                    : ''
                }`}
                style={
                  !comp.human_review_required
                    ? {
                        backgroundColor: isDarkMode ? '#1E1612' : '#FFFFFF',
                        borderColor: isDarkMode ? '#3F2E23' : '#EFE7DB',
                      }
                    : {}
                }
              >
                <div className="flex flex-wrap items-center justify-between gap-1.5 border-b pb-1.5"
                  style={{ borderColor: isDarkMode ? '#2F231D' : '#EFE7DB' }}
                >
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-[#EFE7DB] dark:bg-[#281D17] font-bold text-2xs">
                      {comp.id}
                    </span>
                    <span className="font-semibold text-[#271A12] dark:text-[#FAF4ED]">
                      {comp.primary_category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-2xs font-bold ${
                      comp.severity_level >= 3
                        ? 'bg-red-500/20 text-red-700 dark:text-red-300'
                        : comp.severity_level === 2
                        ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                    }`}>
                      Level {comp.severity_level} Severity
                    </span>
                    {comp.human_review_required && (
                      <span className="px-2 py-0.5 rounded-full text-2xs font-bold bg-red-600 text-white flex items-center gap-1">
                        <UserCheck className="w-2.5 h-2.5" />
                        Human Review
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-2xs text-[#654F3F] dark:text-[#D4C3B3]">
                  {comp.severity_reasoning}
                </p>

                <div className="flex flex-wrap items-center justify-between text-2xs pt-1">
                  <span className="text-[#654F3F] dark:text-[#9E8978]">
                    Route Escalation: <strong className="text-[#8E4F1B] dark:text-[#F2A65A]">{comp.route_to}</strong>
                  </span>
                  {comp.human_review_reason && (
                    <span className="text-red-700 dark:text-red-300 italic">
                      Review Reason: {comp.human_review_reason}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Agent 6: Communication Evaluator
    if (agentKey === 'agent6') {
      return (
        <div className="space-y-4">
          {/* Improved Message Box */}
          {res.improved_patient_message && (
            <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs">
              <span className="text-2xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Improved Patient Message (6th-Grade Reading Level)
              </span>
              <p className="text-xs sm:text-sm font-medium text-[#271A12] dark:text-[#FAF4ED] mt-2 italic bg-white/70 dark:bg-black/30 p-2.5 rounded-lg border border-emerald-500/20">
                "{res.improved_patient_message}"
              </p>
            </div>
          )}

          {res.executive_summary && (
            <div className="p-3 rounded-xl border bg-[#F4ECE1]/60 dark:bg-[#281D17]/60 space-y-1.5 text-xs"
              style={{ borderColor: isDarkMode ? '#3F2E23' : '#DFD0BE' }}
            >
              <span className="text-2xs font-bold uppercase text-[#8E4F1B] dark:text-[#F2A65A]">Communication Audit Summary</span>
              <p className="text-[#271A12] dark:text-[#FAF4ED]"><strong>Overall Quality:</strong> {res.executive_summary.overall_quality}</p>
              <p className="text-[#271A12] dark:text-[#FAF4ED]"><strong>Highest Risk:</strong> {res.executive_summary.highest_risk}</p>
              <p className="text-[#271A12] dark:text-[#FAF4ED]"><strong>Top Improvement:</strong> {res.executive_summary.most_important_improvement}</p>
            </div>
          )}

          <div className="space-y-3">
            {(res.evaluations || []).map((ev: any, idx: number) => (
              <div
                key={idx}
                className="p-3 rounded-xl border text-xs space-y-2 shadow-2xs"
                style={{
                  backgroundColor: isDarkMode ? '#1E1612' : '#FFFFFF',
                  borderColor: isDarkMode ? '#3F2E23' : '#EFE7DB',
                }}
              >
                <div className="flex items-center justify-between border-b pb-1.5"
                  style={{ borderColor: isDarkMode ? '#2F231D' : '#EFE7DB' }}
                >
                  <span className="font-semibold text-[#8E4F1B] dark:text-[#F2A65A]">
                    {ev.id}: {ev.purpose}
                  </span>
                  <span className="text-2xs font-medium text-amber-700 dark:text-amber-300">
                    Literacy Concern: {ev.health_literacy_concern}
                  </span>
                </div>

                {/* Score meters */}
                <div className="grid grid-cols-5 gap-1.5 text-center text-2xs pt-1">
                  {Object.entries(ev.scores || {}).map(([dim, score]: any) => (
                    <div key={dim} className="p-1.5 rounded bg-[#FAF6F0] dark:bg-[#241B16] border"
                      style={{ borderColor: isDarkMode ? '#3F2E23' : '#EFE7DB' }}
                    >
                      <span className="capitalize block text-2xs text-[#654F3F] dark:text-[#9E8978] truncate">{dim}</span>
                      <strong className="text-xs text-[#8E4F1B] dark:text-[#F2A65A]">{score}/5</strong>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Agent 5: Analytics Synthesis
    if (agentKey === 'agent5') {
      return (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl border bg-[#F4ECE1]/60 dark:bg-[#281D17]/60"
            style={{ borderColor: isDarkMode ? '#3F2E23' : '#DFD0BE' }}
          >
            <span className="text-2xs font-bold uppercase tracking-wider text-[#8E4F1B] dark:text-[#F2A65A]">
              Executive Headline
            </span>
            <p className="text-xs sm:text-sm font-bold text-[#271A12] dark:text-[#FAF4ED] mt-1">
              {res.headline}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#654F3F] dark:text-[#D4C3B3]">
              Hidden Organizational Problems
            </h4>
            {(res.hidden_problems || []).map((hp: any, idx: number) => (
              <div
                key={idx}
                className="p-3 rounded-lg border text-xs"
                style={{
                  backgroundColor: isDarkMode ? '#1E1612' : '#FFFFFF',
                  borderColor: isDarkMode ? '#3F2E23' : '#EFE7DB',
                }}
              >
                <p className="font-semibold text-red-600 dark:text-red-400">{hp.problem}</p>
                <p className="text-2xs text-[#654F3F] dark:text-[#9E8978] mt-1">Evidence: {hp.evidence}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#654F3F] dark:text-[#D4C3B3]">
              Top Strategic Priorities
            </h4>
            <div className="space-y-1.5 text-xs">
              {(res.top_priorities || []).map((p: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2 text-[#271A12] dark:text-[#FAF4ED]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Agent 4: Final Executive Decision
    if (agentKey === 'agent4_final') {
      return (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl border border-red-500/40 bg-red-500/10">
            <span className="text-2xs font-bold uppercase tracking-wider text-red-700 dark:text-red-300">
              Primary Executive Alert (Priority: {res.priority})
            </span>
            <p className="text-xs sm:text-sm font-bold text-[#271A12] dark:text-[#FAF4ED] mt-1">
              {res.top_alert}
            </p>
          </div>

          <div className="p-3.5 rounded-xl border bg-[#F4ECE1]/60 dark:bg-[#281D17]/60"
            style={{ borderColor: isDarkMode ? '#3F2E23' : '#DFD0BE' }}
          >
            <span className="text-2xs font-bold uppercase tracking-wider text-[#8E4F1B] dark:text-[#F2A65A]">
              Direct Answer to Manager's Inquiry
            </span>
            <p className="text-xs sm:text-sm text-[#271A12] dark:text-[#FAF4ED] mt-1 font-medium leading-relaxed">
              {res.answer}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#654F3F] dark:text-[#D4C3B3]">
              Recommended Management Actions
            </h4>
            {(res.recommended_actions || []).map((ra: any, idx: number) => (
              <div
                key={idx}
                className="p-3 rounded-lg border text-xs"
                style={{
                  backgroundColor: isDarkMode ? '#1E1612' : '#FFFFFF',
                  borderColor: isDarkMode ? '#3F2E23' : '#EFE7DB',
                }}
              >
                <p className="font-semibold text-[#271A12] dark:text-[#FAF4ED]">{ra.action}</p>
                <div className="flex flex-wrap items-center justify-between text-2xs text-[#654F3F] dark:text-[#9E8978] mt-2 pt-1 border-t"
                  style={{ borderColor: isDarkMode ? '#2F231D' : '#EFE7DB' }}
                >
                  <span>Owner: <strong className="text-[#8E4F1B] dark:text-[#F2A65A]">{ra.owner}</strong></span>
                  <span>Timeframe: <strong className="text-[#271A12] dark:text-[#FAF4ED]">{ra.timeframe}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl max-h-[90vh] rounded-2xl border flex flex-col shadow-2xl overflow-hidden transition-colors"
        style={{
          backgroundColor: isDarkMode ? '#1E1612' : '#FFFFFF',
          borderColor: isDarkMode ? '#3F2E23' : '#DFD0BE',
        }}
      >
        {/* Header */}
        <div
          className="p-4 sm:p-5 border-b flex items-center justify-between"
          style={{ borderColor: isDarkMode ? '#2F231D' : '#EFE7DB' }}
        >
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-xs"
              style={{
                backgroundColor: isDarkMode ? '#2B1E17' : '#F4ECE1',
                color: isDarkMode ? '#F2A65A' : '#8E4F1B',
              }}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-[#271A12] dark:text-[#FAF4ED]">
                  {nodeInfo.name}
                </h3>
                <span className="px-2 py-0.5 rounded text-2xs font-semibold bg-[#EFE7DB] text-[#8E4F1B] dark:bg-[#33261F] dark:text-[#F2A65A]">
                  Step {nodeInfo.stepNumber}
                </span>
              </div>
              <p className="text-xs text-[#654F3F] dark:text-[#9E8978] mt-0.5">
                {nodeInfo.role} • {nodeInfo.specialty}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onRerun(agentKey)}
              disabled={agentState.status === 'running'}
              className="p-2 rounded-lg border text-xs font-medium hover:bg-[#F4ECE1] dark:hover:bg-[#281D17] transition-colors disabled:opacity-40"
              style={{
                borderColor: isDarkMode ? '#453327' : '#DFD0BE',
                color: isDarkMode ? '#F2A65A' : '#8E4F1B',
              }}
              title="Re-run this agent"
            >
              <RotateCw className={`w-4 h-4 ${agentState.status === 'running' ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[#F4ECE1] dark:hover:bg-[#281D17] text-[#654F3F] dark:text-[#9E8978] transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          className="flex border-b px-5 bg-[#FAF6F0] dark:bg-[#18120F] text-xs font-medium"
          style={{ borderColor: isDarkMode ? '#2F231D' : '#EFE7DB' }}
        >
          <button
            onClick={() => setActiveTab('result')}
            className={`py-3 px-3.5 border-b-2 font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'result'
                ? 'border-[#B87333] text-[#8E4F1B] dark:border-[#F2A65A] dark:text-[#F2A65A]'
                : 'border-transparent text-[#654F3F] dark:text-[#9E8978]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Agent Result Card</span>
          </button>

          <button
            onClick={() => setActiveTab('input')}
            className={`py-3 px-3.5 border-b-2 font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'input'
                ? 'border-[#B87333] text-[#8E4F1B] dark:border-[#F2A65A] dark:text-[#F2A65A]'
                : 'border-transparent text-[#654F3F] dark:text-[#9E8978]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Input Payload & Task</span>
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`py-3 px-3.5 border-b-2 font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'json'
                ? 'border-[#B87333] text-[#8E4F1B] dark:border-[#F2A65A] dark:text-[#F2A65A]'
                : 'border-transparent text-[#654F3F] dark:text-[#9E8978]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Raw JSON Schema</span>
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'result' && renderResultContent()}

          {activeTab === 'input' && (
            <div className="space-y-4 text-xs">
              {/* Task edit box */}
              <div className="p-3.5 rounded-xl border bg-[#F4ECE1]/50 dark:bg-[#281D17]/50"
                style={{ borderColor: isDarkMode ? '#3F2E23' : '#DFD0BE' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-2xs uppercase text-[#8E4F1B] dark:text-[#F2A65A]">
                    Assigned Agent Task
                  </span>
                  {isReviewMode && (
                    <button
                      onClick={handleSaveTask}
                      className="px-2 py-0.5 rounded text-2xs font-semibold bg-[#8E4F1B] text-white hover:bg-[#B87333] inline-flex items-center gap-1"
                    >
                      <Send className="w-2.5 h-2.5" /> Save Task
                    </button>
                  )}
                </div>
                {isReviewMode ? (
                  <textarea
                    value={editedTask}
                    onChange={(e) => setEditedTask(e.target.value)}
                    rows={3}
                    className="w-full text-xs p-2 rounded border bg-white dark:bg-[#1E1612] text-[#271A12] dark:text-[#FAF4ED] focus:outline-none focus:ring-1 focus:ring-[#B87333]"
                    style={{ borderColor: isDarkMode ? '#3F2E23' : '#DFD0BE' }}
                  />
                ) : (
                  <p className="text-[#271A12] dark:text-[#FAF4ED] font-medium">
                    {agentState.assignedTask || 'Standard specialization prompt.'}
                  </p>
                )}
              </div>

              {/* Data payload preview */}
              <div>
                <h4 className="text-xs font-bold text-[#654F3F] dark:text-[#D4C3B3] mb-2 uppercase tracking-wider">
                  Data Filtered & Sent to Agent
                </h4>
                <pre
                  className="p-3.5 rounded-xl border text-2xs overflow-x-auto font-mono max-h-80"
                  style={{
                    backgroundColor: isDarkMode ? '#140E0B' : '#FAF6F0',
                    borderColor: isDarkMode ? '#3F2E23' : '#DFD0BE',
                    color: isDarkMode ? '#FAF4ED' : '#271A12',
                  }}
                >
                  {JSON.stringify(agentState.activeInput || { info: 'Data extracted from active records and JavaScript calculated KPIs' }, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'json' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xs font-bold uppercase text-[#654F3F] dark:text-[#9E8978]">
                  Clean JSON Output
                </span>
                <button
                  onClick={handleCopyJson}
                  className="inline-flex items-center px-2.5 py-1 rounded text-2xs font-semibold border transition-colors hover:bg-[#F4ECE1] dark:hover:bg-[#281D17]"
                  style={{
                    borderColor: isDarkMode ? '#453327' : '#DFD0BE',
                    color: isDarkMode ? '#F2A65A' : '#8E4F1B',
                  }}
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 mr-1 text-emerald-500" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-1" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>
              </div>
              <pre
                className="p-4 rounded-xl border text-2xs overflow-x-auto font-mono max-h-96"
                style={{
                  backgroundColor: isDarkMode ? '#140E0B' : '#FAF6F0',
                  borderColor: isDarkMode ? '#3F2E23' : '#DFD0BE',
                  color: isDarkMode ? '#FAF4ED' : '#271A12',
                }}
              >
                {JSON.stringify(agentState.result || {}, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="p-4 border-t flex items-center justify-between bg-[#FAF6F0] dark:bg-[#18120F]"
          style={{ borderColor: isDarkMode ? '#2F231D' : '#EFE7DB' }}
        >
          <span className="text-2xs text-[#654F3F] dark:text-[#9E8978]">
            {agentState.completedAt ? (
              <span>Last evaluated at {new Date(agentState.completedAt).toLocaleTimeString()}</span>
            ) : (
              <span>Agent status: {agentState.status}</span>
            )}
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onRerun(agentKey)}
              disabled={agentState.status === 'running'}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors hover:bg-[#F4ECE1] dark:hover:bg-[#281D17] inline-flex items-center gap-1.5"
              style={{
                borderColor: isDarkMode ? '#453327' : '#DFD0BE',
                color: isDarkMode ? '#F2A65A' : '#8E4F1B',
              }}
            >
              <RotateCw className="w-3 h-3" />
              Re-run Agent
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors"
              style={{
                backgroundColor: isDarkMode ? '#3F2E23' : '#271A12',
                color: '#FAF4ED',
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
