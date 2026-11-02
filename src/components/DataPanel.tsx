import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Download,
  RotateCcw,
  Search,
  Filter,
  CheckSquare,
  Square,
  HelpCircle,
  FileSpreadsheet,
  Layers,
  Sparkles,
} from 'lucide-react';
import { PatientRecord, DistinctComment, DatasetKPIs } from '../types';
import { exportToCSV, parseCSV, INITIAL_PATIENT_RECORDS } from '../data/samplePatients';

interface DataPanelProps {
  isDarkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
  records: PatientRecord[];
  onUpdateRecords: (records: PatientRecord[]) => void;
  selectedRecordIds: Set<string>;
  onToggleRecordSelection: (recordId: string) => void;
  onSelectAllRecords: () => void;
  onDeselectAllRecords: () => void;
  managerQuestion: string;
  onChangeManagerQuestion: (q: string) => void;
  distinctComments: DistinctComment[];
  kpis: DatasetKPIs;
}

export const DataPanel: React.FC<DataPanelProps> = ({
  isDarkMode,
  isOpen,
  onClose,
  records,
  onUpdateRecords,
  selectedRecordIds,
  onToggleRecordSelection,
  onSelectAllRecords,
  onDeselectAllRecords,
  managerQuestion,
  onChangeManagerQuestion,
  distinctComments,
  kpis,
}) => {
  if (!isOpen) return null;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'records' | 'comments' | 'question'>('question');

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.Record_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.Patient_Persona.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.Comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.ServiceLine.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesService =
      serviceFilter === 'all' || r.ServiceLine === serviceFilter;

    return matchesSearch && matchesService;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const parsed = parseCSV(text);
        if (parsed.length > 0) {
          onUpdateRecords(parsed);
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownloadCSV = () => {
    const csvContent = exportToCSV(records);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'hospital_patient_experience_records.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetToDefault = () => {
    onUpdateRecords(INITIAL_PATIENT_RECORDS);
  };

  const presetQuestions = [
    'What should management fix first to improve patient experience, and which cases need human review?',
    'Why are Emergency Medicine and General Surgery satisfaction scores lagging, and what operational bottlenecks exist?',
    'What health equity and language accessibility gaps require immediate clinical leadership intervention?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-5xl max-h-[92vh] rounded-2xl border flex flex-col shadow-2xl overflow-hidden transition-colors"
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
                backgroundColor: isDarkMode ? '#8E4F1B' : '#F4ECE1',
                color: isDarkMode ? '#FAF4ED' : '#8E4F1B',
              }}
            >
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#271A12] dark:text-[#FAF4ED]">
                Dataset & Manager Inquiries
              </h3>
              <p className="text-xs text-[#654F3F] dark:text-[#9E8978]">
                Configure patient records, upload custom CSV, and refine the management question
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#F4ECE1] dark:hover:bg-[#281D17] text-[#654F3F] dark:text-[#9E8978] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Strip */}
        <div
          className="flex border-b px-5 bg-[#FAF6F0] dark:bg-[#18120F] text-xs font-semibold"
          style={{ borderColor: isDarkMode ? '#2F231D' : '#EFE7DB' }}
        >
          <button
            onClick={() => setActiveTab('question')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'question'
                ? 'border-[#B87333] text-[#8E4F1B] dark:border-[#F2A65A] dark:text-[#F2A65A]'
                : 'border-transparent text-[#654F3F] dark:text-[#9E8978]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Manager Question</span>
          </button>

          <button
            onClick={() => setActiveTab('records')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'records'
                ? 'border-[#B87333] text-[#8E4F1B] dark:border-[#F2A65A] dark:text-[#F2A65A]'
                : 'border-transparent text-[#654F3F] dark:text-[#9E8978]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Patient Records ({selectedRecordIds.size}/{records.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('comments')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'comments'
                ? 'border-[#B87333] text-[#8E4F1B] dark:border-[#F2A65A] dark:text-[#F2A65A]'
                : 'border-transparent text-[#654F3F] dark:text-[#9E8978]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Distinct Repeating Comments ({distinctComments.length})</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: Manager Question */}
          {activeTab === 'question' && (
            <div className="space-y-4">
              <div
                className="p-4 rounded-xl border bg-[#FAF6F0] dark:bg-[#18120F]"
                style={{ borderColor: isDarkMode ? '#3F2E23' : '#DFD0BE' }}
              >
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8E4F1B] dark:text-[#F2A65A] mb-2">
                  Manager's Decision Support Question
                </label>
                <textarea
                  value={managerQuestion}
                  onChange={(e) => onChangeManagerQuestion(e.target.value)}
                  rows={3}
                  className="w-full text-xs sm:text-sm p-3 rounded-lg border bg-white dark:bg-[#1E1612] text-[#271A12] dark:text-[#FAF4ED] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
                  style={{ borderColor: isDarkMode ? '#3F2E23' : '#DFD0BE' }}
                  placeholder="Enter executive quality inquiry..."
                />
                <p className="text-2xs text-[#654F3F] dark:text-[#9E8978] mt-2">
                  Agent 4 reads this question during Step 1 (Planning) to determine specialist assignments, and directly answers it during Step 4 (Final Decision).
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#654F3F] dark:text-[#D4C3B3] mb-2">
                  Executive Preset Inquiries
                </h4>
                <div className="space-y-2">
                  {presetQuestions.map((pq, idx) => (
                    <button
                      key={idx}
                      onClick={() => onChangeManagerQuestion(pq)}
                      className="w-full text-left p-2.5 rounded-lg border text-xs text-[#271A12] dark:text-[#FAF4ED] hover:bg-[#F4ECE1] dark:hover:bg-[#281D17] transition-colors flex items-center justify-between group"
                      style={{ borderColor: isDarkMode ? '#3F2E23' : '#EFE7DB' }}
                    >
                      <span className="truncate pr-2">"{pq}"</span>
                      <span className="text-2xs font-semibold text-[#8E4F1B] dark:text-[#F2A65A] group-hover:underline shrink-0">
                        Use this
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Patient Records Table */}
          {activeTab === 'records' && (
            <div className="space-y-3">
              {/* Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={onSelectAllRecords}
                    className="inline-flex items-center px-2.5 py-1 rounded text-2xs font-semibold border hover:bg-[#F4ECE1] dark:hover:bg-[#281D17] transition-colors"
                    style={{ borderColor: isDarkMode ? '#453327' : '#DFD0BE' }}
                  >
                    <CheckSquare className="w-3 h-3 mr-1 text-emerald-600" /> Select All ({records.length})
                  </button>
                  <button
                    onClick={onDeselectAllRecords}
                    className="inline-flex items-center px-2.5 py-1 rounded text-2xs font-semibold border hover:bg-[#F4ECE1] dark:hover:bg-[#281D17] transition-colors text-stone-500"
                    style={{ borderColor: isDarkMode ? '#453327' : '#DFD0BE' }}
                  >
                    <Square className="w-3 h-3 mr-1" /> Deselect All
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Service Line Filter */}
                  <select
                    value={serviceFilter}
                    onChange={(e) => setServiceFilter(e.target.value)}
                    className="text-2xs p-1.5 rounded-lg border bg-white dark:bg-[#1E1612] text-[#271A12] dark:text-[#FAF4ED]"
                    style={{ borderColor: isDarkMode ? '#3F2E23' : '#DFD0BE' }}
                  >
                    <option value="all">All Service Lines</option>
                    {Object.keys(kpis.satisfactionByServiceLine).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>

                  {/* Search */}
                  <input
                    type="text"
                    placeholder="Search records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="text-2xs px-2.5 py-1.5 rounded-lg border bg-white dark:bg-[#1E1612] text-[#271A12] dark:text-[#FAF4ED]"
                    style={{ borderColor: isDarkMode ? '#3F2E23' : '#DFD0BE' }}
                  />
                </div>
              </div>

              {/* Table */}
              <div className="border rounded-xl overflow-hidden max-h-96 overflow-y-auto"
                style={{ borderColor: isDarkMode ? '#3F2E23' : '#DFD0BE' }}
              >
                <table className="w-full text-left text-xs">
                  <thead
                    className="border-b uppercase text-2xs tracking-wider sticky top-0"
                    style={{
                      backgroundColor: isDarkMode ? '#18120F' : '#FAF6F0',
                      borderColor: isDarkMode ? '#2F231D' : '#EFE7DB',
                      color: isDarkMode ? '#9E8978' : '#654F3F',
                    }}
                  >
                    <tr>
                      <th className="py-2 px-3 w-8">
                        <span className="sr-only">Select</span>
                      </th>
                      <th className="py-2 px-3">ID</th>
                      <th className="py-2 px-3">Persona</th>
                      <th className="py-2 px-3">Service Line</th>
                      <th className="py-2 px-2 text-center">Sat.</th>
                      <th className="py-2 px-2 text-center">Comm.</th>
                      <th className="py-2 px-3">AI Flag</th>
                      <th className="py-2 px-3">Patient Comment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: isDarkMode ? '#281D17' : '#EFE7DB' }}>
                    {filteredRecords.map((r) => {
                      const isSelected = selectedRecordIds.has(r.Record_ID);
                      return (
                        <tr
                          key={r.Record_ID}
                          onClick={() => onToggleRecordSelection(r.Record_ID)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-[#FAF6F0] dark:bg-[#241B16]'
                              : 'opacity-50 hover:opacity-80'
                          }`}
                        >
                          <td className="py-2 px-3" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => onToggleRecordSelection(r.Record_ID)}
                              className="rounded border-gray-400 text-[#8E4F1B] focus:ring-[#8E4F1B]"
                            />
                          </td>
                          <td className="py-2 px-3 font-mono font-bold text-2xs text-[#8E4F1B] dark:text-[#F2A65A]">
                            {r.Record_ID}
                          </td>
                          <td className="py-2 px-3 text-2xs font-medium text-[#271A12] dark:text-[#FAF4ED] whitespace-nowrap">
                            {r.Patient_Persona}
                          </td>
                          <td className="py-2 px-3 text-2xs whitespace-nowrap">
                            {r.ServiceLine}
                          </td>
                          <td className="py-2 px-2 text-center font-bold text-2xs">
                            {r.Patient_Satisfaction}
                          </td>
                          <td className="py-2 px-2 text-center font-bold text-2xs">
                            {r.Communication_Rating}
                          </td>
                          <td className="py-2 px-3 text-2xs whitespace-nowrap">
                            <span className={`px-1.5 py-0.5 rounded text-2xs font-semibold ${
                              r.AIRiskFlag === 'Human Review Required'
                                ? 'bg-red-500/20 text-red-700 dark:text-red-300'
                                : r.AIRiskFlag === 'Bias Review'
                                ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                                : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                            }`}>
                              {r.AIRiskFlag}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-2xs max-w-xs truncate text-[#654F3F] dark:text-[#D4C3B3]">
                            "{r.Comment}"
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Distinct Comments Aggregation */}
          {activeTab === 'comments' && (
            <div className="space-y-3">
              <div
                className="p-3.5 rounded-xl border bg-[#FAF6F0] dark:bg-[#18120F] text-xs text-[#654F3F] dark:text-[#D4C3B3]"
                style={{ borderColor: isDarkMode ? '#3F2E23' : '#DFD0BE' }}
              >
                <strong className="text-[#8E4F1B] dark:text-[#F2A65A]">Orchestration Rule: </strong>
                The dataset repeats distinct comments across many patient records. As mandated by the specification, each distinct comment is sent to agents once with its record count, and results are linked back in code to ensure high efficiency and prevent redundant token usage.
              </div>

              <div className="space-y-2.5">
                {distinctComments.map((dc) => (
                  <div
                    key={dc.id}
                    className="p-3.5 rounded-xl border text-xs space-y-2 shadow-2xs"
                    style={{
                      backgroundColor: isDarkMode ? '#1E1612' : '#FFFFFF',
                      borderColor: isDarkMode ? '#3F2E23' : '#EFE7DB',
                    }}
                  >
                    <div className="flex items-center justify-between border-b pb-1.5"
                      style={{ borderColor: isDarkMode ? '#2F231D' : '#EFE7DB' }}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded bg-[#8E4F1B] text-white font-mono font-bold text-2xs">
                          {dc.id}
                        </span>
                        <span className="font-semibold text-emerald-700 dark:text-emerald-300 text-2xs">
                          Appears in {dc.count} records ({Math.round((dc.count / records.length) * 100)}% of total)
                        </span>
                      </div>
                      <div className="text-2xs text-[#654F3F] dark:text-[#9E8978]">
                        Avg Comm: <strong>{dc.avgCommunicationRating}/5</strong> • Avg Sat: <strong>{dc.avgSatisfaction}/5</strong>
                      </div>
                    </div>

                    <p className="text-xs text-[#271A12] dark:text-[#FAF4ED] font-medium italic">
                      "{dc.comment}"
                    </p>

                    <div className="flex flex-wrap gap-1 text-2xs text-[#654F3F] dark:text-[#9E8978]">
                      <span>Linked Record IDs:</span>
                      {dc.recordIds.map((rid) => (
                        <span key={rid} className="px-1.5 py-0.2 rounded bg-[#EFE7DB] dark:bg-[#281D17] text-[#271A12] dark:text-[#FAF4ED] font-mono">
                          {rid}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          className="p-4 border-t flex flex-wrap items-center justify-between gap-3 bg-[#FAF6F0] dark:bg-[#18120F]"
          style={{ borderColor: isDarkMode ? '#2F231D' : '#EFE7DB' }}
        >
          <div className="flex items-center space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border hover:bg-[#F4ECE1] dark:hover:bg-[#281D17] transition-colors"
              style={{
                borderColor: isDarkMode ? '#453327' : '#DFD0BE',
                color: isDarkMode ? '#FAF4ED' : '#271A12',
              }}
            >
              <Upload className="w-3.5 h-3.5 mr-1.5 text-[#B87333]" />
              Upload CSV
            </button>

            <button
              onClick={handleDownloadCSV}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border hover:bg-[#F4ECE1] dark:hover:bg-[#281D17] transition-colors"
              style={{
                borderColor: isDarkMode ? '#453327' : '#DFD0BE',
                color: isDarkMode ? '#FAF4ED' : '#271A12',
              }}
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-[#B87333]" />
              Export CSV
            </button>

            <button
              onClick={handleResetToDefault}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border hover:bg-[#F4ECE1] dark:hover:bg-[#281D17] transition-colors text-stone-600 dark:text-stone-300"
              style={{
                borderColor: isDarkMode ? '#453327' : '#DFD0BE',
              }}
              title="Reset records to default hospital synthetic dataset"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Reset Sample Data
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            style={{
              backgroundColor: isDarkMode ? '#3F2E23' : '#271A12',
              color: '#FAF4ED',
            }}
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
