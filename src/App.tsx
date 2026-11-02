import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Activity,
  Sparkles,
  Sliders,
  CheckCircle2,
  Clock,
  RotateCw,
  AlertTriangle,
  Play,
  RotateCcw,
  BarChart3,
  Brain,
  ShieldAlert,
  ArrowRight,
  Database,
} from 'lucide-react';
import {
  PatientRecord,
  DatasetKPIs,
  DistinctComment,
  RunMode,
  WorkflowStep,
  AgentKey,
  AgentExecutionState,
  Agent4PlanResult,
  Agent1Result,
  Agent2Result,
  Agent3Result,
  Agent6Result,
  Agent5Result,
  Agent4FinalResult,
} from './types';
import {
  INITIAL_PATIENT_RECORDS,
  calculateKPIs,
  extractDistinctComments,
} from './data/samplePatients';
import {
  runAgent4Planning,
  runAgent1Feedback,
  runAgent2Monitoring,
  runAgent3Triage,
  runAgent6Communication,
  runAgent5Analytics,
  runAgent4FinalDecision,
} from './services/agentService';
import { Header } from './components/Header';
import { InteractiveAgentDiagram } from './components/InteractiveAgentDiagram';
import { InspectorModal } from './components/InspectorModal';
import { ReviewApprovalBar } from './components/ReviewApprovalBar';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { DataPanel } from './components/DataPanel';

const INITIAL_AGENT_STATES: Record<AgentKey, AgentExecutionState> = {
  agent4_plan: {
    status: 'pending',
    assignedTask: 'Plan specialist assignments and frame management inquiry based on patient KPIs.',
  },
  agent1: {
    status: 'pending',
    assignedTask: 'Extract comment themes, sentiment polarity, and operational risk factors.',
  },
  agent2: {
    status: 'pending',
    assignedTask: 'Analyze longitudinal patterns, departmental variances, and equity vulnerabilities.',
  },
  agent3: {
    status: 'pending',
    assignedTask: 'Classify complaint severity (Levels 1-4), flag clinical risks, and recommend escalation routing.',
  },
  agent6: {
    status: 'pending',
    assignedTask: 'Evaluate clinical communication quality and author an improved 6th-grade patient message.',
  },
  agent5: {
    status: 'pending',
    assignedTask: 'Synthesize specialist findings into executive insights, hidden bottlenecks, and organizational priorities.',
  },
  agent4_final: {
    status: 'pending',
    assignedTask: 'Formulate final management decision, top alert, direct answers, and concrete managerial actions.',
  },
};

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hospital_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('hospital_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('hospital_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Dataset & Manager Question state
  const [records, setRecords] = useState<PatientRecord[]>(INITIAL_PATIENT_RECORDS);
  const [selectedRecordIds, setSelectedRecordIds] = useState<Set<string>>(
    () => new Set(INITIAL_PATIENT_RECORDS.map((r) => r.Record_ID))
  );
  const [managerQuestion, setManagerQuestion] = useState<string>(
    'What should management fix first to improve patient experience, and which cases need human review?'
  );

  // Compute Active Records
  const activeRecords = useMemo(() => {
    return records.filter((r) => selectedRecordIds.has(r.Record_ID));
  }, [records, selectedRecordIds]);

  // Pure JavaScript KPI calculation (never computed by AI as required)
  const kpis = useMemo(() => {
    return calculateKPIs(activeRecords);
  }, [activeRecords]);

  // Distinct comments extracted once and linked back to all records
  const distinctComments = useMemo(() => {
    return extractDistinctComments(activeRecords);
  }, [activeRecords]);

  // Workflow & Agent Execution state
  const [runMode, setRunMode] = useState<RunMode>('step_by_step');
  const [workflowStep, setWorkflowStep] = useState<WorkflowStep>('idle');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [agentStates, setAgentStates] = useState<Record<AgentKey, AgentExecutionState>>(INITIAL_AGENT_STATES);

  // Specialist toggle selection (can be turned on/off during Step 1 review)
  const [activeSpecialists, setActiveSpecialists] = useState<Record<string, boolean>>({
    agent1: true,
    agent2: true,
    agent3: true,
    agent6: true,
  });

  // Modal / Drawer state
  const [selectedAgentForModal, setSelectedAgentForModal] = useState<AgentKey | null>(null);
  const [isDataPanelOpen, setIsDataPanelOpen] = useState<boolean>(false);

  // Toggle record selection
  const handleToggleRecordSelection = useCallback((recordId: string) => {
    setSelectedRecordIds((prev) => {
      const next = new Set(prev);
      if (next.has(recordId)) next.delete(recordId);
      else next.add(recordId);
      return next;
    });
  }, []);

  const handleSelectAllRecords = useCallback(() => {
    setSelectedRecordIds(new Set(records.map((r) => r.Record_ID)));
  }, [records]);

  const handleDeselectAllRecords = useCallback(() => {
    setSelectedRecordIds(new Set());
  }, []);

  // Update records (e.g. from CSV upload)
  const handleUpdateRecords = useCallback((newRecords: PatientRecord[]) => {
    setRecords(newRecords);
    setSelectedRecordIds(new Set(newRecords.map((r) => r.Record_ID)));
  }, []);

  // Reset entire workflow state
  const handleResetWorkflow = useCallback(() => {
    setWorkflowStep('idle');
    setIsRunning(false);
    setAgentStates(INITIAL_AGENT_STATES);
  }, []);

  // Toggle specialist on/off
  const handleToggleSpecialist = useCallback((key: string) => {
    setActiveSpecialists((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  // Update custom task for an agent
  const handleUpdateTask = useCallback((agentKey: AgentKey, newTask: string) => {
    setAgentStates((prev) => ({
      ...prev,
      [agentKey]: {
        ...prev[agentKey],
        assignedTask: newTask,
        isCustomTask: true,
      },
    }));
  }, []);

  // ----------------------------------------------------------------------
  // Multi-Agent Execution Phases
  // ----------------------------------------------------------------------

  // STEP 1: Execute Agent 4 (Planning)
  const executeStep1Planning = async () => {
    setIsRunning(true);
    setWorkflowStep('step1_planning');
    setAgentStates((prev) => ({
      ...prev,
      agent4_plan: {
        ...prev.agent4_plan,
        status: 'running',
        startedAt: Date.now(),
        activeInput: { managerQuestion, kpis },
      },
    }));

    try {
      const availableCols = [
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

      const planResult = await runAgent4Planning(managerQuestion, availableCols, kpis);

      // Apply task recommendations from Agent 4's plan
      const updatedSpecialists = { ...activeSpecialists };
      const taskUpdates: Partial<Record<AgentKey, string>> = {};

      if (planResult.agents && Array.isArray(planResult.agents)) {
        planResult.agents.forEach((ag) => {
          let key: AgentKey | null = null;
          if (ag.agent.includes('1')) key = 'agent1';
          else if (ag.agent.includes('2')) key = 'agent2';
          else if (ag.agent.includes('3')) key = 'agent3';
          else if (ag.agent.includes('6')) key = 'agent6';

          if (key) {
            updatedSpecialists[key] = ag.run !== false;
            if (ag.task) taskUpdates[key] = ag.task;
          }
        });
      }

      setActiveSpecialists(updatedSpecialists);

      setAgentStates((prev) => {
        const next = { ...prev };
        next.agent4_plan = {
          ...next.agent4_plan,
          status: 'completed',
          completedAt: Date.now(),
          result: planResult,
        };
        // update tasks if not custom
        (Object.keys(taskUpdates) as AgentKey[]).forEach((k) => {
          if (!next[k].isCustomTask && taskUpdates[k]) {
            next[k].assignedTask = taskUpdates[k];
          }
        });
        return next;
      });

      if (runMode === 'auto') {
        // Automatically proceed to Step 2
        await executeStep2Specialists();
      } else {
        // Stop for Step 1 review
        setWorkflowStep('step1_review');
        setIsRunning(false);
      }
    } catch (err: any) {
      console.error('Error in Step 1 Planning:', err);
      setAgentStates((prev) => ({
        ...prev,
        agent4_plan: {
          ...prev.agent4_plan,
          status: 'failed',
          error: err.message,
        },
      }));
      setIsRunning(false);
    }
  };

  // STEP 2: Execute Specialists in Parallel (Agents 1, 2, 3, 6)
  const executeStep2Specialists = async () => {
    setIsRunning(true);
    setWorkflowStep('step2_specialists');

    const specialistsToRun = [
      { key: 'agent1' as AgentKey, runner: () => runAgent1Feedback(distinctComments, agentStates.agent1.assignedTask) },
      { key: 'agent2' as AgentKey, runner: () => runAgent2Monitoring(kpis, agentStates.agent2.assignedTask) },
      { key: 'agent3' as AgentKey, runner: () => runAgent3Triage(distinctComments, agentStates.agent3.assignedTask) },
      { key: 'agent6' as AgentKey, runner: () => runAgent6Communication(distinctComments, agentStates.agent6.assignedTask) },
    ];

    // Set statuses to running or skipped
    setAgentStates((prev) => {
      const next = { ...prev };
      specialistsToRun.forEach(({ key }) => {
        if (activeSpecialists[key] !== false) {
          next[key] = {
            ...next[key],
            status: 'running',
            startedAt: Date.now(),
            error: undefined,
          };
        } else {
          next[key] = {
            ...next[key],
            status: 'skipped',
          };
        }
      });
      return next;
    });

    // Execute in parallel
    const promises = specialistsToRun.map(async ({ key, runner }) => {
      if (activeSpecialists[key] === false) return;
      try {
        const res = await runner();
        setAgentStates((prev) => ({
          ...prev,
          [key]: {
            ...prev[key],
            status: 'completed',
            completedAt: Date.now(),
            result: res,
          },
        }));
      } catch (err: any) {
        console.error(`Error executing specialist ${key}:`, err);
        setAgentStates((prev) => ({
          ...prev,
          [key]: {
            ...prev[key],
            status: 'failed',
            error: err.message,
          },
        }));
      }
    });

    await Promise.allSettled(promises);

    if (runMode === 'auto') {
      await executeStep3Analytics();
    } else {
      setWorkflowStep('step2_review');
      setIsRunning(false);
    }
  };

  // STEP 3: Execute Agent 5 (Healthcare Analytics)
  const executeStep3Analytics = async () => {
    setIsRunning(true);
    setWorkflowStep('step3_analytics');

    setAgentStates((prev) => ({
      ...prev,
      agent5: {
        ...prev.agent5,
        status: 'running',
        startedAt: Date.now(),
        error: undefined,
      },
    }));

    try {
      const specialistResults = {
        agent1: agentStates.agent1.result as Agent1Result | null,
        agent2: agentStates.agent2.result as Agent2Result | null,
        agent3: agentStates.agent3.result as Agent3Result | null,
        agent6: agentStates.agent6.result as Agent6Result | null,
      };

      const analyticsResult = await runAgent5Analytics(kpis, specialistResults);

      setAgentStates((prev) => ({
        ...prev,
        agent5: {
          ...prev.agent5,
          status: 'completed',
          completedAt: Date.now(),
          result: analyticsResult,
        },
      }));

      if (runMode === 'auto') {
        await executeStep4FinalDecision(analyticsResult);
      } else {
        setWorkflowStep('step3_review');
        setIsRunning(false);
      }
    } catch (err: any) {
      console.error('Error in Step 3 Analytics:', err);
      setAgentStates((prev) => ({
        ...prev,
        agent5: {
          ...prev.agent5,
          status: 'failed',
          error: err.message,
        },
      }));
      setIsRunning(false);
    }
  };

  // STEP 4: Execute Agent 4 (Final Decision)
  const executeStep4FinalDecision = async (existingAnalytics?: Agent5Result) => {
    setIsRunning(true);
    setWorkflowStep('step4_final');

    setAgentStates((prev) => ({
      ...prev,
      agent4_final: {
        ...prev.agent4_final,
        status: 'running',
        startedAt: Date.now(),
        error: undefined,
      },
    }));

    try {
      const analytics = existingAnalytics || (agentStates.agent5.result as Agent5Result);
      const plan = agentStates.agent4_plan.result as Agent4PlanResult;

      const humanReviewCases = activeRecords.filter(
        (r) =>
          r.AIRiskFlag === 'Human Review Required' ||
          r.AIRiskFlag === 'Bias Review' ||
          r.Patient_Satisfaction <= 1
      );

      const finalResult = await runAgent4FinalDecision(
        managerQuestion,
        plan || { goal: 'Resolve patient experience vulnerabilities', agents: [] },
        analytics || ({} as any),
        kpis,
        humanReviewCases
      );

      setAgentStates((prev) => ({
        ...prev,
        agent4_final: {
          ...prev.agent4_final,
          status: 'completed',
          completedAt: Date.now(),
          result: finalResult,
        },
      }));

      setWorkflowStep('completed');
      setIsRunning(false);
    } catch (err: any) {
      console.error('Error in Step 4 Final Decision:', err);
      setAgentStates((prev) => ({
        ...prev,
        agent4_final: {
          ...prev.agent4_final,
          status: 'failed',
          error: err.message,
        },
      }));
      setIsRunning(false);
    }
  };

  // Trigger from Header or Main Button
  const handleRunWorkflow = () => {
    if (workflowStep === 'idle' || workflowStep === 'completed') {
      executeStep1Planning();
    } else if (workflowStep === 'step1_review') {
      executeStep2Specialists();
    } else if (workflowStep === 'step2_review') {
      executeStep3Analytics();
    } else if (workflowStep === 'step3_review') {
      executeStep4FinalDecision();
    }
  };

  // Individual Agent Re-Run (Never repeat an AI call that already finished unless requested)
  const handleRerunIndividualAgent = async (agentKey: AgentKey) => {
    setAgentStates((prev) => ({
      ...prev,
      [agentKey]: {
        ...prev[agentKey],
        status: 'running',
        startedAt: Date.now(),
        error: undefined,
      },
    }));

    try {
      let res: any;
      if (agentKey === 'agent4_plan') {
        const availableCols = ['Record_ID', 'Patient_Persona', 'Service_Line', 'Comment'];
        res = await runAgent4Planning(managerQuestion, availableCols, kpis);
      } else if (agentKey === 'agent1') {
        res = await runAgent1Feedback(distinctComments, agentStates.agent1.assignedTask);
      } else if (agentKey === 'agent2') {
        res = await runAgent2Monitoring(kpis, agentStates.agent2.assignedTask);
      } else if (agentKey === 'agent3') {
        res = await runAgent3Triage(distinctComments, agentStates.agent3.assignedTask);
      } else if (agentKey === 'agent6') {
        res = await runAgent6Communication(distinctComments, agentStates.agent6.assignedTask);
      } else if (agentKey === 'agent5') {
        res = await runAgent5Analytics(kpis, {
          agent1: agentStates.agent1.result,
          agent2: agentStates.agent2.result,
          agent3: agentStates.agent3.result,
          agent6: agentStates.agent6.result,
        });
      } else if (agentKey === 'agent4_final') {
        const humanReviewCases = activeRecords.filter(
          (r) => r.AIRiskFlag === 'Human Review Required' || r.Patient_Satisfaction <= 1
        );
        res = await runAgent4FinalDecision(
          managerQuestion,
          agentStates.agent4_plan.result,
          agentStates.agent5.result,
          kpis,
          humanReviewCases
        );
      }

      setAgentStates((prev) => ({
        ...prev,
        [agentKey]: {
          ...prev[agentKey],
          status: 'completed',
          completedAt: Date.now(),
          result: res,
        },
      }));
    } catch (err: any) {
      console.error(`Error re-running ${agentKey}:`, err);
      setAgentStates((prev) => ({
        ...prev,
        [agentKey]: {
          ...prev[agentKey],
          status: 'failed',
          error: err.message,
        },
      }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200">
      {/* Top Application Header */}
      <Header
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        runMode={runMode}
        onChangeRunMode={setRunMode}
        workflowStep={workflowStep}
        isRunning={isRunning}
        onRunWorkflow={handleRunWorkflow}
        onResetWorkflow={handleResetWorkflow}
        activeRecordsCount={activeRecords.length}
        totalRecordsCount={records.length}
        onOpenDataModal={() => setIsDataPanelOpen(true)}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Step-by-Step Human Review Bar (Appears when awaiting review) */}
        <ReviewApprovalBar
          isDarkMode={isDarkMode}
          workflowStep={workflowStep}
          activeSpecialists={activeSpecialists}
          onToggleSpecialist={handleToggleSpecialist}
          onApproveAndContinue={handleRunWorkflow}
          onSelectAgent={(key) => setSelectedAgentForModal(key)}
          isRunning={isRunning}
        />

        {/* 1. Interactive Agent Diagram with Real-Time Animated Arrows */}
        <InteractiveAgentDiagram
          isDarkMode={isDarkMode}
          agentStates={agentStates}
          workflowStep={workflowStep}
          activeSpecialists={activeSpecialists}
          onToggleSpecialist={handleToggleSpecialist}
          onSelectAgent={(key) => setSelectedAgentForModal(key)}
          onRerunAgent={handleRerunIndividualAgent}
          selectedAgentKey={selectedAgentForModal}
        />

        {/* 2. Executive Healthcare Quality Dashboard */}
        <ExecutiveDashboard
          isDarkMode={isDarkMode}
          kpis={kpis}
          records={activeRecords}
          agent4Final={agentStates.agent4_final.result}
          agent1Result={agentStates.agent1.result}
          agent2Result={agentStates.agent2.result}
          agent3Result={agentStates.agent3.result}
          agent5Result={agentStates.agent5.result}
          agent6Result={agentStates.agent6.result}
        />
      </main>

      {/* Inspector Modal for Selected Agent */}
      <InspectorModal
        isDarkMode={isDarkMode}
        agentKey={selectedAgentForModal}
        agentState={selectedAgentForModal ? agentStates[selectedAgentForModal] : undefined}
        onClose={() => setSelectedAgentForModal(null)}
        onRerun={handleRerunIndividualAgent}
        onUpdateTask={handleUpdateTask}
        isReviewMode={
          workflowStep === 'step1_review' ||
          workflowStep === 'step2_review' ||
          workflowStep === 'step3_review'
        }
      />

      {/* Data & Question Configuration Panel */}
      <DataPanel
        isDarkMode={isDarkMode}
        isOpen={isDataPanelOpen}
        onClose={() => setIsDataPanelOpen(false)}
        records={records}
        onUpdateRecords={handleUpdateRecords}
        selectedRecordIds={selectedRecordIds}
        onToggleRecordSelection={handleToggleRecordSelection}
        onSelectAllRecords={handleSelectAllRecords}
        onDeselectAllRecords={handleDeselectAllRecords}
        managerQuestion={managerQuestion}
        onChangeManagerQuestion={setManagerQuestion}
        distinctComments={distinctComments}
        kpis={kpis}
      />

      {/* Subtle Footer */}
      <footer
        className="border-t py-4 text-center text-xs text-[#654F3F] dark:text-[#9E8978] transition-colors"
        style={{ borderColor: isDarkMode ? '#2F231D' : '#DFD0BE' }}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Hospital Patient Experience Intelligence System • Multi-Agent Quality Framework</span>
          <span className="text-2xs text-[#8E4F1B] dark:text-[#F2A65A]">
            Synthetic Clinical Quality Data • Powered by Google Gemini AI
          </span>
        </div>
      </footer>
    </div>
  );
}
