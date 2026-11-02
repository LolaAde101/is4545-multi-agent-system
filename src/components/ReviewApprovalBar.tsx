import React from 'react';
import {
  Sliders,
  CheckCircle2,
  ArrowRight,
  RotateCw,
  Sparkles,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { WorkflowStep, AgentKey } from '../types';

interface ReviewApprovalBarProps {
  isDarkMode: boolean;
  workflowStep: WorkflowStep;
  activeSpecialists: Record<string, boolean>;
  onToggleSpecialist: (key: string) => void;
  onApproveAndContinue: () => void;
  onSelectAgent: (key: AgentKey) => void;
  isRunning: boolean;
}

export const ReviewApprovalBar: React.FC<ReviewApprovalBarProps> = ({
  isDarkMode,
  workflowStep,
  activeSpecialists,
  onToggleSpecialist,
  onApproveAndContinue,
  onSelectAgent,
  isRunning,
}) => {
  // Only render when waiting in a review stage
  if (
    workflowStep !== 'step1_review' &&
    workflowStep !== 'step2_review' &&
    workflowStep !== 'step3_review'
  ) {
    return null;
  }

  return (
    <div
      className="p-4 sm:p-5 rounded-2xl border shadow-md animate-in slide-in-from-top-2 duration-300 transition-colors"
      style={{
        backgroundColor: isDarkMode ? '#241B16' : '#FFFFFF',
        borderColor: isDarkMode ? '#C48243' : '#B87333',
      }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left Information */}
        <div className="flex items-start space-x-3.5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
            style={{
              backgroundColor: isDarkMode ? '#8E4F1B' : '#F4ECE1',
              color: isDarkMode ? '#FAF4ED' : '#8E4F1B',
            }}
          >
            <Sliders className="w-5 h-5 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300">
                Human-in-the-Loop Gate
              </span>
              <h3 className="text-sm sm:text-base font-bold text-[#271A12] dark:text-[#FAF4ED]">
                {workflowStep === 'step1_review'
                  ? 'Step 1 Review: Orchestrator Plan Ready'
                  : workflowStep === 'step2_review'
                  ? 'Step 2 Review: Specialist Analyses Completed'
                  : 'Step 3 Review: Healthcare Analytics Synthesis Completed'}
              </h3>
            </div>

            <p className="text-xs text-[#654F3F] dark:text-[#D4C3B3] mt-1 max-w-2xl leading-relaxed">
              {workflowStep === 'step1_review'
                ? 'Review the Orchestrator’s proposed specialist allocations. You can toggle specialists on/off or click an agent to refine its task before dispatching.'
                : workflowStep === 'step2_review'
                ? 'Inspect specialist findings (Feedback themes, Demographics, Triage severities, Communication scores). Re-run any agent if needed, then approve transmission to Analytics.'
                : 'Executive dashboard analytics synthesized. Review hidden bottlenecks, AI risks, and priorities before Agent 4 renders the final decision.'}
            </p>
          </div>
        </div>

        {/* Right Configuration & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Step 1 Specialist Toggles */}
          {workflowStep === 'step1_review' && (
            <div
              className="flex items-center space-x-2 p-1.5 rounded-xl border text-xs"
              style={{
                backgroundColor: isDarkMode ? '#1E1612' : '#FAF6F0',
                borderColor: isDarkMode ? '#3F2E23' : '#DFD0BE',
              }}
            >
              {[
                { id: 'agent1', label: 'Agent 1' },
                { id: 'agent2', label: 'Agent 2' },
                { id: 'agent3', label: 'Agent 3' },
                { id: 'agent6', label: 'Agent 6' },
              ].map((sp) => {
                const active = activeSpecialists[sp.id] !== false;
                return (
                  <button
                    key={sp.id}
                    onClick={() => onToggleSpecialist(sp.id)}
                    className={`px-2.5 py-1 rounded-lg text-2xs font-semibold transition-all ${
                      active
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-stone-300/40 text-stone-500 line-through dark:bg-stone-800'
                    }`}
                    title={active ? 'Specialist will run' : 'Specialist skipped'}
                  >
                    {sp.label} {active ? '✓' : '✕'}
                  </button>
                );
              })}
            </div>
          )}

          {/* Quick Inspector Trigger */}
          <button
            onClick={() => {
              if (workflowStep === 'step1_review') onSelectAgent('agent4_plan');
              else if (workflowStep === 'step2_review') onSelectAgent('agent1');
              else onSelectAgent('agent5');
            }}
            className="px-3 py-2 rounded-xl text-xs font-semibold border transition-colors hover:bg-[#F4ECE1] dark:hover:bg-[#281D17]"
            style={{
              borderColor: isDarkMode ? '#453327' : '#DFD0BE',
              color: isDarkMode ? '#FAF4ED' : '#271A12',
            }}
          >
            Inspect Step Details
          </button>

          {/* Approve and Continue Button */}
          <button
            onClick={onApproveAndContinue}
            disabled={isRunning}
            className="inline-flex items-center px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all hover:opacity-95 disabled:opacity-50"
            style={{
              backgroundColor: isDarkMode ? '#F2A65A' : '#8E4F1B',
              color: isDarkMode ? '#18120F' : '#FFFDF9',
            }}
          >
            {isRunning ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                <span>Executing Next Phase...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 mr-1.5" />
                <span>
                  {workflowStep === 'step1_review'
                    ? 'Approve & Run Specialists'
                    : workflowStep === 'step2_review'
                    ? 'Approve & Run Analytics'
                    : 'Approve & Render Final Decision'}
                </span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
