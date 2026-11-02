import React, { useId } from 'react';
import {
  Brain,
  MessageSquareHeart,
  TrendingUp,
  AlertTriangle,
  Radio,
  BarChart3,
  CheckCircle2,
  Clock,
  RotateCw,
  Eye,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  HelpCircle,
} from 'lucide-react';
import { AgentKey, AgentStatus, AgentExecutionState, WorkflowStep } from '../types';

interface AgentNodeInfo {
  id: AgentKey;
  stepNumber: string;
  name: string;
  role: string;
  specialty: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const AGENT_NODES: Record<AgentKey, AgentNodeInfo> = {
  agent4_plan: {
    id: 'agent4_plan',
    stepNumber: '1 & 4',
    name: 'Agent 4: Orchestrator',
    role: 'Hospital Manager Decision Support',
    specialty: 'Executive Planning & Final Decision Recommendation',
    icon: Brain,
  },
  agent1: {
    id: 'agent1',
    stepNumber: '2',
    name: 'Agent 1: Feedback Insight',
    role: 'Patient Voice & Thematic Analyst',
    specialty: 'Comment Themes, Sentiment, Operational Risks & Action',
    icon: MessageSquareHeart,
  },
  agent2: {
    id: 'agent2',
    stepNumber: '2',
    name: 'Agent 2: Experience Monitoring',
    role: 'Longitudinal Patterns & Equity Auditor',
    specialty: 'Departmental Disparities, Vulnerable Personas & Risk',
    icon: TrendingUp,
  },
  agent3: {
    id: 'agent3',
    stepNumber: '2',
    name: 'Agent 3: Complaint Triage',
    role: 'Patient Safety & Escalation Triage',
    specialty: 'Severity Levels 1-4, Departmental Routing & Human Review',
    icon: AlertTriangle,
  },
  agent6: {
    id: 'agent6',
    stepNumber: '2',
    name: 'Agent 6: Communication Evaluator',
    role: 'Clinical Communication Quality',
    specialty: 'Clarity, Literacy Barriers & 6th-Grade Patient Message',
    icon: Radio,
  },
  agent5: {
    id: 'agent5',
    stepNumber: '3',
    name: 'Agent 5: Healthcare Analytics',
    role: 'Executive Insights Synthesizer',
    specialty: 'C-Suite Dashboards, Hidden Bottlenecks & Strategic Priorities',
    icon: BarChart3,
  },
  agent4_final: {
    id: 'agent4_final',
    stepNumber: '4',
    name: 'Agent 4: Final Executive Decision',
    role: 'Hospital Manager Decision Support',
    specialty: 'Top Alert, Direct Management Answers & Action Plan',
    icon: Brain,
  },
};

interface InteractiveAgentDiagramProps {
  isDarkMode: boolean;
  agentStates: Record<AgentKey, AgentExecutionState>;
  workflowStep: WorkflowStep;
  activeSpecialists: Record<string, boolean>;
  onToggleSpecialist?: (agentKey: string) => void;
  onSelectAgent: (agentKey: AgentKey) => void;
  onRerunAgent: (agentKey: AgentKey) => void;
  selectedAgentKey?: AgentKey | null;
}

export const InteractiveAgentDiagram: React.FC<InteractiveAgentDiagramProps> = ({
  isDarkMode,
  agentStates,
  workflowStep,
  activeSpecialists,
  onToggleSpecialist,
  onSelectAgent,
  onRerunAgent,
  selectedAgentKey,
}) => {
  const gradientId = useId();

  // Determine active flow paths based on workflow step
  const isFlowStep1To2 =
    workflowStep === 'step1_review' ||
    workflowStep === 'step2_specialists' ||
    agentStates.agent1.status === 'running' ||
    agentStates.agent2.status === 'running' ||
    agentStates.agent3.status === 'running' ||
    agentStates.agent6.status === 'running';

  const isFlowStep2To3 =
    workflowStep === 'step2_review' ||
    workflowStep === 'step3_analytics' ||
    agentStates.agent5.status === 'running';

  const isFlowStep3To4 =
    workflowStep === 'step3_review' ||
    workflowStep === 'step4_final' ||
    agentStates.agent4_final.status === 'running';

  const getStatusBadge = (status: AgentStatus) => {
    switch (status) {
      case 'running':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1 animate-ping" />
            Running
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
            Completed
          </span>
        );
      case 'waiting_review':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold bg-[#B87333]/20 text-[#8E4F1B] dark:text-[#F2A65A] border border-[#B87333]/40 animate-pulse">
            <Clock className="w-2.5 h-2.5 mr-1" />
            Waiting Review
          </span>
        );
      case 'skipped':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold bg-stone-500/20 text-stone-600 dark:text-stone-400 border border-stone-500/30">
            Skipped
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/30">
            <ShieldAlert className="w-2.5 h-2.5 mr-1" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold bg-[#EFE7DB] text-[#654F3F] dark:bg-[#281D17] dark:text-[#9E8978] border border-[#DFD0BE] dark:border-[#3F2E23]">
            Pending
          </span>
        );
    }
  };

  const renderAgentCard = (key: AgentKey, node: AgentNodeInfo) => {
    const state = agentStates[key];
    const isSelected = selectedAgentKey === key;
    const isRunning = state.status === 'running';
    const isReview = state.status === 'waiting_review';
    const isSpecialist = ['agent1', 'agent2', 'agent3', 'agent6'].includes(key);
    const isEnabled = activeSpecialists[key] !== false;
    const Icon = node.icon;

    return (
      <div
        key={key}
        onClick={() => onSelectAgent(key)}
        className={`group relative rounded-xl p-3.5 sm:p-4 cursor-pointer transition-all duration-300 border shadow-xs ${
          isSelected
            ? 'ring-2 ring-[#B87333] dark:ring-[#F2A65A] shadow-md scale-[1.01]'
            : 'hover:shadow-md hover:border-[#B87333] dark:hover:border-[#C48243]'
        } ${isRunning ? 'animate-node-glow' : ''}`}
        style={{
          backgroundColor: isDarkMode ? '#1E1612' : '#FFFFFF',
          borderColor: isSelected
            ? '#B87333'
            : isRunning
            ? '#F2A65A'
            : isDarkMode
            ? '#3F2E23'
            : '#DFD0BE',
        }}
      >
        {/* Top bar with Step Number & Status */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-2xs font-bold shadow-2xs"
              style={{
                backgroundColor: isDarkMode ? '#3F2E23' : '#EFE7DB',
                color: isDarkMode ? '#F2A65A' : '#8E4F1B',
              }}
            >
              {node.stepNumber}
            </span>
            <span className="text-2xs font-medium text-[#654F3F] dark:text-[#9E8978] uppercase tracking-wider">
              {key === 'agent4_plan'
                ? 'Phase 1: Planning'
                : key === 'agent4_final'
                ? 'Phase 4: Decision'
                : key === 'agent5'
                ? 'Phase 3: Analytics'
                : 'Phase 2: Specialist'}
            </span>
          </div>
          <div>{getStatusBadge(state.status)}</div>
        </div>

        {/* Agent Info */}
        <div className="flex items-start space-x-3 mt-1">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
              isRunning ? 'animate-bounce' : ''
            }`}
            style={{
              backgroundColor: isDarkMode ? '#2B1E17' : '#F4ECE1',
              color: isDarkMode ? '#F2A65A' : '#8E4F1B',
            }}
          >
            <Icon className="w-5 h-5" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-xs sm:text-sm font-bold text-[#271A12] dark:text-[#FAF4ED] truncate">
              {node.name}
            </h3>
            <p className="text-2xs text-[#654F3F] dark:text-[#D4C3B3] line-clamp-1 mt-0.5">
              {node.specialty}
            </p>
          </div>
        </div>

        {/* Active Task or Status Summary */}
        <div
          className="mt-2.5 pt-2 border-t text-2xs flex items-center justify-between text-[#654F3F] dark:text-[#9E8978]"
          style={{ borderColor: isDarkMode ? '#2F231D' : '#EFE7DB' }}
        >
          <span className="truncate pr-2">
            {state.status === 'completed' ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Results ready • Click to view
              </span>
            ) : state.status === 'running' ? (
              <span className="text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1 animate-pulse">
                <RotateCw className="w-3 h-3 animate-spin" />
                Analyzing live data...
              </span>
            ) : state.status === 'waiting_review' ? (
              <span className="text-[#B87333] dark:text-[#F2A65A] font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Awaiting approval
              </span>
            ) : state.status === 'failed' ? (
              <span className="text-red-600 dark:text-red-400 font-medium">
                Analysis error
              </span>
            ) : (
              <span>Ready for activation</span>
            )}
          </span>

          <div className="flex items-center space-x-1 shrink-0">
            {/* Re-run button */}
            {(state.status === 'completed' || state.status === 'failed') && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRerunAgent(key);
                }}
                className="p-1 rounded hover:bg-[#F4ECE1] dark:hover:bg-[#281D17] text-[#8E4F1B] dark:text-[#F2A65A] transition-colors"
                title={`Re-run ${node.name} with updated parameters`}
              >
                <RotateCw className="w-3 h-3" />
              </button>
            )}

            {/* Specialist On/Off Switch during review */}
            {isSpecialist && onToggleSpecialist && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSpecialist(key);
                }}
                className={`px-1.5 py-0.5 rounded text-2xs font-semibold transition-colors ${
                  isEnabled
                    ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                    : 'bg-stone-500/20 text-stone-600 dark:text-stone-400 line-through'
                }`}
                title={isEnabled ? 'Specialist enabled' : 'Specialist skipped'}
              >
                {isEnabled ? 'ON' : 'SKIP'}
              </button>
            )}

            <span className="text-[#8E4F1B] dark:text-[#F2A65A] group-hover:translate-x-0.5 transition-transform">
              <Eye className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="rounded-2xl p-4 sm:p-6 border relative overflow-hidden transition-colors shadow-sm"
      style={{
        backgroundColor: isDarkMode ? '#18120F' : '#FAF6F0',
        borderColor: isDarkMode ? '#3F2E23' : '#DFD0BE',
      }}
    >
      {/* Title & Dynamic Status Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b gap-3"
        style={{ borderColor: isDarkMode ? '#2F231D' : '#EFE7DB' }}
      >
        <div>
          <h2 className="text-sm sm:text-base font-bold text-[#271A12] dark:text-[#FAF4ED] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#B87333] dark:text-[#F2A65A]" />
            Interactive Agent Orchestration & Real-Time Data Flow
          </h2>
          <p className="text-2xs sm:text-xs text-[#654F3F] dark:text-[#D4C3B3] mt-0.5">
            Dynamic communication network between Orchestrator, Clinical Specialists, and Healthcare Analytics
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-2xs text-[#654F3F] dark:text-[#9E8978]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Completed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            Active Flow
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#B87333]" />
            Awaiting Review
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-stone-400" />
            Pending / Skipped
          </span>
        </div>
      </div>

      {/* SVG Canvas for Dynamic Data Flow Arrows */}
      <div className="relative my-4">
        {/* SVG Arrow Overlay (hidden on small mobile screens to keep layout responsive, full vector on md+) */}
        <svg
          className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`${gradientId}-amber`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C48243" />
              <stop offset="50%" stopColor="#F2A65A" />
              <stop offset="100%" stopColor="#8E4F1B" />
            </linearGradient>

            <linearGradient id={`${gradientId}-active`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F2A65A" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            <marker
              id={`${gradientId}-arrowhead`}
              markerWidth="7"
              markerHeight="7"
              refX="6"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 7 3.5, 0 7"
                fill={isDarkMode ? '#F2A65A' : '#8E4F1B'}
              />
            </marker>

            <marker
              id={`${gradientId}-arrowhead-active`}
              markerWidth="8"
              markerHeight="8"
              refX="7"
              refY="4"
              orient="auto"
            >
              <polygon
                points="0 0, 8 4, 0 8"
                fill="#F2A65A"
              />
            </marker>
          </defs>

          {/* Group 1: Orchestrator Agent 4 down to Middle Specialists (Agent 1, 2, 3, 6) */}
          {/* Path to Agent 1 */}
          <path
            d="M 50% 85 C 50% 120, 15% 105, 15% 150"
            fill="none"
            stroke={isFlowStep1To2 ? `url(#${gradientId}-active)` : isDarkMode ? '#3F2E23' : '#DFD0BE'}
            strokeWidth={isFlowStep1To2 ? 3 : 1.5}
            strokeDasharray={isFlowStep1To2 ? '6 4' : 'none'}
            className={isFlowStep1To2 ? 'animate-dash-flow' : ''}
            markerEnd={isFlowStep1To2 ? `url(#${gradientId}-arrowhead-active)` : `url(#${gradientId}-arrowhead)`}
          />
          {/* Path to Agent 2 */}
          <path
            d="M 50% 85 C 50% 120, 38% 110, 38% 150"
            fill="none"
            stroke={isFlowStep1To2 ? `url(#${gradientId}-active)` : isDarkMode ? '#3F2E23' : '#DFD0BE'}
            strokeWidth={isFlowStep1To2 ? 3 : 1.5}
            strokeDasharray={isFlowStep1To2 ? '6 4' : 'none'}
            className={isFlowStep1To2 ? 'animate-dash-flow' : ''}
            markerEnd={isFlowStep1To2 ? `url(#${gradientId}-arrowhead-active)` : `url(#${gradientId}-arrowhead)`}
          />
          {/* Path to Agent 3 */}
          <path
            d="M 50% 85 C 50% 120, 62% 110, 62% 150"
            fill="none"
            stroke={isFlowStep1To2 ? `url(#${gradientId}-active)` : isDarkMode ? '#3F2E23' : '#DFD0BE'}
            strokeWidth={isFlowStep1To2 ? 3 : 1.5}
            strokeDasharray={isFlowStep1To2 ? '6 4' : 'none'}
            className={isFlowStep1To2 ? 'animate-dash-flow' : ''}
            markerEnd={isFlowStep1To2 ? `url(#${gradientId}-arrowhead-active)` : `url(#${gradientId}-arrowhead)`}
          />
          {/* Path to Agent 6 */}
          <path
            d="M 50% 85 C 50% 120, 85% 105, 85% 150"
            fill="none"
            stroke={isFlowStep1To2 ? `url(#${gradientId}-active)` : isDarkMode ? '#3F2E23' : '#DFD0BE'}
            strokeWidth={isFlowStep1To2 ? 3 : 1.5}
            strokeDasharray={isFlowStep1To2 ? '6 4' : 'none'}
            className={isFlowStep1To2 ? 'animate-dash-flow' : ''}
            markerEnd={isFlowStep1To2 ? `url(#${gradientId}-arrowhead-active)` : `url(#${gradientId}-arrowhead)`}
          />

          {/* Group 2: Specialists down to Healthcare Analytics Agent 5 */}
          {/* From Agent 1 to Agent 5 */}
          <path
            d="M 15% 320 C 15% 365, 50% 340, 50% 390"
            fill="none"
            stroke={isFlowStep2To3 ? `url(#${gradientId}-active)` : isDarkMode ? '#3F2E23' : '#DFD0BE'}
            strokeWidth={isFlowStep2To3 ? 3 : 1.5}
            strokeDasharray={isFlowStep2To3 ? '6 4' : 'none'}
            className={isFlowStep2To3 ? 'animate-dash-flow' : ''}
            markerEnd={isFlowStep2To3 ? `url(#${gradientId}-arrowhead-active)` : `url(#${gradientId}-arrowhead)`}
          />
          {/* From Agent 2 to Agent 5 */}
          <path
            d="M 38% 320 C 38% 365, 50% 345, 50% 390"
            fill="none"
            stroke={isFlowStep2To3 ? `url(#${gradientId}-active)` : isDarkMode ? '#3F2E23' : '#DFD0BE'}
            strokeWidth={isFlowStep2To3 ? 3 : 1.5}
            strokeDasharray={isFlowStep2To3 ? '6 4' : 'none'}
            className={isFlowStep2To3 ? 'animate-dash-flow' : ''}
            markerEnd={isFlowStep2To3 ? `url(#${gradientId}-arrowhead-active)` : `url(#${gradientId}-arrowhead)`}
          />
          {/* From Agent 3 to Agent 5 */}
          <path
            d="M 62% 320 C 62% 365, 50% 345, 50% 390"
            fill="none"
            stroke={isFlowStep2To3 ? `url(#${gradientId}-active)` : isDarkMode ? '#3F2E23' : '#DFD0BE'}
            strokeWidth={isFlowStep2To3 ? 3 : 1.5}
            strokeDasharray={isFlowStep2To3 ? '6 4' : 'none'}
            className={isFlowStep2To3 ? 'animate-dash-flow' : ''}
            markerEnd={isFlowStep2To3 ? `url(#${gradientId}-arrowhead-active)` : `url(#${gradientId}-arrowhead)`}
          />
          {/* From Agent 6 to Agent 5 */}
          <path
            d="M 85% 320 C 85% 365, 50% 340, 50% 390"
            fill="none"
            stroke={isFlowStep2To3 ? `url(#${gradientId}-active)` : isDarkMode ? '#3F2E23' : '#DFD0BE'}
            strokeWidth={isFlowStep2To3 ? 3 : 1.5}
            strokeDasharray={isFlowStep2To3 ? '6 4' : 'none'}
            className={isFlowStep2To3 ? 'animate-dash-flow' : ''}
            markerEnd={isFlowStep2To3 ? `url(#${gradientId}-arrowhead-active)` : `url(#${gradientId}-arrowhead)`}
          />

          {/* Group 3: Loop-back from Agent 5 back UP to Agent 4 for Final Management Decision */}
          <path
            d="M 85% 440 C 97% 440, 97% 45, 78% 45"
            fill="none"
            stroke={isFlowStep3To4 ? `url(#${gradientId}-active)` : isDarkMode ? '#3F2E23' : '#DFD0BE'}
            strokeWidth={isFlowStep3To4 ? 3.5 : 1.5}
            strokeDasharray={isFlowStep3To4 ? '8 4' : '4 4'}
            className={isFlowStep3To4 ? 'animate-dash-reverse' : ''}
            markerEnd={isFlowStep3To4 ? `url(#${gradientId}-arrowhead-active)` : `url(#${gradientId}-arrowhead)`}
          />
        </svg>

        {/* 3-Tier Grid Hierarchy */}
        <div className="flex flex-col space-y-7 relative z-20">
          {/* TOP TIER: Agent 4 Orchestrator */}
          <div className="flex justify-center">
            <div className="w-full max-w-xl">
              {renderAgentCard('agent4_plan', AGENT_NODES.agent4_plan)}
            </div>
          </div>

          {/* Dynamic Flow Label 1 */}
          <div className="flex items-center justify-center -my-2 z-30">
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-2xs font-semibold shadow-xs transition-all ${
                isFlowStep1To2
                  ? 'bg-amber-500/20 text-amber-800 dark:text-amber-200 border border-amber-500/40 animate-pulse'
                  : 'bg-[#EFE7DB] text-[#654F3F] dark:bg-[#281D17] dark:text-[#9E8978] border border-[#DFD0BE] dark:border-[#3F2E23]'
              }`}
            >
              <ArrowRight className="w-3 h-3 mr-1" />
              <span>Flow 1: Orchestrator Dispatches Targeted Tasks to Specialists</span>
            </div>
          </div>

          {/* MIDDLE TIER: 4 Specialists (Agent 1, 2, 3, 6) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {renderAgentCard('agent1', AGENT_NODES.agent1)}
            {renderAgentCard('agent2', AGENT_NODES.agent2)}
            {renderAgentCard('agent3', AGENT_NODES.agent3)}
            {renderAgentCard('agent6', AGENT_NODES.agent6)}
          </div>

          {/* Dynamic Flow Label 2 */}
          <div className="flex items-center justify-center -my-2 z-30">
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-2xs font-semibold shadow-xs transition-all ${
                isFlowStep2To3
                  ? 'bg-amber-500/20 text-amber-800 dark:text-amber-200 border border-amber-500/40 animate-pulse'
                  : 'bg-[#EFE7DB] text-[#654F3F] dark:bg-[#281D17] dark:text-[#9E8978] border border-[#DFD0BE] dark:border-[#3F2E23]'
              }`}
            >
              <ArrowRight className="w-3 h-3 mr-1" />
              <span>Flow 2: Specialist Findings Converge into Healthcare Analytics Synthesis</span>
            </div>
          </div>

          {/* BOTTOM TIER: Agent 5 Analytics */}
          <div className="flex justify-center">
            <div className="w-full max-w-xl">
              {renderAgentCard('agent5', AGENT_NODES.agent5)}
            </div>
          </div>

          {/* Dynamic Flow Label 3 (Loop-back to Agent 4) */}
          <div className="flex items-center justify-center -my-2 z-30">
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-2xs font-semibold shadow-xs transition-all ${
                isFlowStep3To4
                  ? 'bg-amber-500/20 text-amber-800 dark:text-amber-200 border border-amber-500/40 animate-pulse'
                  : 'bg-[#EFE7DB] text-[#654F3F] dark:bg-[#281D17] dark:text-[#9E8978] border border-[#DFD0BE] dark:border-[#3F2E23]'
              }`}
            >
              <RotateCw className="w-3 h-3 mr-1" />
              <span>Flow 3: Executive Analytics Transmitted Back to Agent 4 for Final Decision</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
