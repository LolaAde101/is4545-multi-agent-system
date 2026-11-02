import React from 'react';
import {
  Activity,
  Moon,
  Sun,
  Play,
  RotateCcw,
  Sliders,
  Sparkles,
  Database,
  ShieldAlert,
} from 'lucide-react';
import { RunMode, WorkflowStep } from '../types';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  runMode: RunMode;
  onChangeRunMode: (mode: RunMode) => void;
  workflowStep: WorkflowStep;
  isRunning: boolean;
  onRunWorkflow: () => void;
  onResetWorkflow: () => void;
  activeRecordsCount: number;
  totalRecordsCount: number;
  onOpenDataModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  onToggleDarkMode,
  runMode,
  onChangeRunMode,
  workflowStep,
  isRunning,
  onRunWorkflow,
  onResetWorkflow,
  activeRecordsCount,
  totalRecordsCount,
  onOpenDataModal,
}) => {
  return (
    <header className="border-b transition-colors duration-200 sticky top-0 z-40 backdrop-blur-md bg-opacity-95 shadow-xs"
      style={{
        backgroundColor: isDarkMode ? 'rgba(30, 22, 18, 0.95)' : 'rgba(255, 253, 249, 0.95)',
        borderColor: isDarkMode ? '#3F2E23' : '#E2D5C3',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3.5">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm"
              style={{
                backgroundColor: isDarkMode ? '#8E4F1B' : '#B87333',
                color: '#FFFDF9',
              }}
            >
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#271A12] dark:text-[#FAF4ED]">
                  Hospital Patient Experience Intelligence System
                </h1>
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EFE7DB] text-[#8E4F1B] dark:bg-[#33261F] dark:text-[#F2A65A]">
                  6-Agent Orchestration
                </span>
              </div>
              <p className="text-xs text-[#654F3F] dark:text-[#D4C3B3] flex items-center gap-1.5 mt-0.5">
                <span>Multi-Specialist Clinical Quality Network</span>
                <span className="text-[#DFD0BE] dark:text-[#3F2E23]">•</span>
                <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-ping"></span>
                  Gemini AI Active
                </span>
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Data Source Button */}
            <button
              onClick={onOpenDataModal}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors shadow-2xs hover:bg-[#F4ECE1] dark:hover:bg-[#281D17]"
              style={{
                borderColor: isDarkMode ? '#453327' : '#DFD0BE',
                color: isDarkMode ? '#FAF4ED' : '#271A12',
              }}
              title="Inspect or modify synthetic patient dataset and manager question"
            >
              <Database className="w-3.5 h-3.5 mr-1.5 text-[#B87333] dark:text-[#F2A65A]" />
              <span>Dataset ({activeRecordsCount}/{totalRecordsCount})</span>
            </button>

            {/* Run Mode Selector */}
            <div
              className="inline-flex p-0.5 rounded-lg border text-xs font-medium"
              style={{
                backgroundColor: isDarkMode ? '#241B16' : '#EFE7DB',
                borderColor: isDarkMode ? '#3F2E23' : '#DFD0BE',
              }}
            >
              <button
                onClick={() => onChangeRunMode('auto')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  runMode === 'auto'
                    ? 'shadow-2xs font-semibold'
                    : 'text-[#654F3F] dark:text-[#9E8978]'
                }`}
                style={
                  runMode === 'auto'
                    ? {
                        backgroundColor: isDarkMode ? '#3F2E23' : '#FFFFFF',
                        color: isDarkMode ? '#FAF4ED' : '#271A12',
                      }
                    : {}
                }
              >
                Auto Run
              </button>
              <button
                onClick={() => onChangeRunMode('step_by_step')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                  runMode === 'step_by_step'
                    ? 'shadow-2xs font-semibold'
                    : 'text-[#654F3F] dark:text-[#9E8978]'
                }`}
                style={
                  runMode === 'step_by_step'
                    ? {
                        backgroundColor: isDarkMode ? '#3F2E23' : '#FFFFFF',
                        color: isDarkMode ? '#FAF4ED' : '#271A12',
                      }
                    : {}
                }
              >
                <Sliders className="w-3 h-3 text-[#B87333]" />
                Step-by-Step Review
              </button>
            </div>

            {/* Reset Button */}
            <button
              onClick={onResetWorkflow}
              disabled={isRunning}
              className="inline-flex items-center p-2 rounded-lg border text-xs font-medium transition-colors disabled:opacity-40 hover:bg-[#F4ECE1] dark:hover:bg-[#281D17]"
              style={{
                borderColor: isDarkMode ? '#453327' : '#DFD0BE',
                color: isDarkMode ? '#D4C3B3' : '#654F3F',
              }}
              title="Reset workflow to starting state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Main Action Trigger */}
            <button
              onClick={onRunWorkflow}
              disabled={isRunning}
              className="inline-flex items-center px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-sm hover:opacity-95 disabled:opacity-50"
              style={{
                backgroundColor: isDarkMode ? '#C48243' : '#8E4F1B',
                color: '#FFFDF9',
              }}
            >
              {isRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  <span>Agents Working...</span>
                </>
              ) : workflowStep === 'completed' ? (
                <>
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  <span>Re-run Multi-Agent System</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-1.5 fill-current" />
                  <span>
                    {workflowStep === 'idle'
                      ? 'Launch Multi-Agent Analysis'
                      : 'Resume System Execution'}
                  </span>
                </>
              )}
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg border transition-colors hover:bg-[#F4ECE1] dark:hover:bg-[#281D17]"
              style={{
                borderColor: isDarkMode ? '#453327' : '#DFD0BE',
                color: isDarkMode ? '#F2A65A' : '#8E4F1B',
              }}
              title={isDarkMode ? 'Switch to Warm Cream Light Mode' : 'Switch to Dark Roast Coffee Mode'}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
