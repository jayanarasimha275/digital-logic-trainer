import React, { useEffect, useState } from 'react';
import { circuitStore, useCircuitStore } from '../../store/circuitStore';
import { LAB_EXPERIMENTS } from '../../data/experiments';
import { evaluateExperiment, ExperimentStepResult } from '../../simulation/experimentEvaluator';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Play,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ExperimentPanel: React.FC = () => {
  const { selectedExperimentId, placedICs, wires, ioSettings } = useCircuitStore();
  const [activeExpId, setActiveExpId] = useState<string>(selectedExperimentId || 'exp-basic-gates');
  const [testResults, setTestResults] = useState<ExperimentStepResult[] | null>(null);
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'instructions' | 'truthtable' | 'theory'>('truthtable');

  useEffect(() => {
    if (selectedExperimentId && selectedExperimentId !== activeExpId) {
      setActiveExpId(selectedExperimentId);
      setTestResults(null);
    }
  }, [selectedExperimentId, activeExpId]);

  const exp = LAB_EXPERIMENTS.find((e) => e.id === activeExpId) || LAB_EXPERIMENTS[0];
  const isSequential = Boolean(exp.sequentialTests && exp.sequentialTests.length > 0);
  const rows = isSequential
    ? exp.sequentialTests!.map((s) => ({
        id: s.id,
        label: s.label,
        inputs: s.inputs,
        expectedOutputs: s.expectedOutputs,
      }))
    : exp.truthTable.map((t) => ({
        id: t.id,
        label: undefined as string | undefined,
        inputs: t.inputs,
        expectedOutputs: t.expectedOutputs,
      }));

  const inputKeys =
    rows.length > 0 ? Object.keys(rows[0].inputs) : Object.keys(exp.pinMapping.inputNames);
  const outputKeys =
    rows.length > 0 ? Object.keys(rows[0].expectedOutputs) : Object.keys(exp.pinMapping.outputNames);

  const handleSelectExp = (id: string) => {
    setActiveExpId(id);
    setTestResults(null);
    circuitStore.loadExperiment(id, false);
  };

  const handleLoadReference = () => {
    circuitStore.loadExperiment(activeExpId, true);
    setTestResults(null);
  };

  // Run all test cases against the live physical virtual circuit via shared engine evaluator
  const handleRunAllTests = () => {
    setIsRunningTests(true);
    setTestResults(null);

    setTimeout(() => {
      const evalResult = evaluateExperiment(exp, placedICs, wires, ioSettings.inputStates);
      setTestResults(evalResult.results);
      setIsRunningTests(false);

      if (evalResult.passed) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }, 200);
  };

  const allPassed = testResults && testResults.length > 0 && testResults.every((r) => r.passed);

  return (
    <div id="experiment-panel" className="bg-slate-900 border border-slate-700/80 rounded-xl p-3.5 shadow-lg flex flex-col gap-3">
      {/* Experiment Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Laboratory Experiment
          </h2>
          {isSequential && (
            <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-700/50">
              Sequential
            </span>
          )}
        </div>

        {/* Experiment Selector Dropdown */}
        <select
          value={activeExpId}
          onChange={(e) => handleSelectExp(e.target.value)}
          className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 font-semibold cursor-pointer max-w-[300px]"
        >
          {LAB_EXPERIMENTS.map((e) => (
            <option key={e.id} value={e.id}>
              Exp {e.number}: {e.title}
            </option>
          ))}
        </select>
      </div>

      {/* Sub Tabs: Truth Table vs Procedure vs Theory */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('truthtable')}
            className={`px-3 py-1 rounded font-semibold transition cursor-pointer ${
              activeTab === 'truthtable' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isSequential ? 'Sequence & Verification' : 'Truth Table & Verification'}
          </button>
          <button
            onClick={() => setActiveTab('instructions')}
            className={`px-3 py-1 rounded font-semibold transition cursor-pointer ${
              activeTab === 'instructions' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Aim & Procedure
          </button>
          <button
            onClick={() => setActiveTab('theory')}
            className={`px-3 py-1 rounded font-semibold transition cursor-pointer ${
              activeTab === 'theory' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Theory & Formulas
          </button>
        </div>

        {/* Load Reference Circuit Button */}
        <button
          onClick={handleLoadReference}
          id="btn-load-reference-circuit"
          title="Load pre-wired reference circuit for this experiment"
          className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-700/60 rounded-lg transition cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Load Reference Circuit
        </button>
      </div>

      {/* Manual vs Datasheet Discrepancy Resolution Note */}
      {exp.discrepancyNote && (
        <div className="bg-amber-950/30 border border-amber-600/40 rounded-lg px-3 py-2 flex items-start gap-2 text-[11px] text-amber-200/90 leading-snug">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300 uppercase tracking-wide mr-1">
              Manual / Datasheet Note:
            </span>
            {exp.discrepancyNote}
          </div>
        </div>
      )}

      {/* TAB 1: Truth Table / Sequence & Live Verification */}
      {activeTab === 'truthtable' && (
        <div className="flex flex-col gap-2.5">
          {/* Action Verification Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950/80 border border-slate-800 p-2 rounded-lg">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleRunAllTests}
                disabled={isRunningTests}
                id="btn-run-all-tests"
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3 h-3 fill-current" />
                {isRunningTests ? 'Evaluating...' : isSequential ? 'Run Sequence Tests' : 'Run All Test Cases'}
              </button>

              <span className="text-[11px] text-slate-400 font-mono">
                Inputs: {Object.entries(exp.pinMapping.inputNames).map(([k, v]) => `${k}=${v}`).join(', ')}
              </span>
            </div>

            {testResults && (
              <div className="flex items-center gap-1.5">
                {allPassed ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 font-mono bg-emerald-950/50 border border-emerald-600/60 px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {testResults.length}/{testResults.length} PASS - CIRCUIT VERIFIED
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold text-red-400 font-mono bg-red-950/50 border border-red-600/60 px-2 py-0.5 rounded">
                    <XCircle className="w-3.5 h-3.5" />
                    {testResults.filter((r) => r.passed).length}/{testResults.length} PASSED - WIRING MISMATCH
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Interactive Truth Table / Sequence Grid */}
          <div className="overflow-x-auto border border-slate-800 rounded-lg bg-slate-950 max-h-56 overflow-y-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400 uppercase sticky top-0">
                <tr>
                  <th className="p-2">#</th>
                  {isSequential && <th className="p-2 text-amber-300">Transition / Step</th>}
                  {inputKeys.map((key) => (
                    <th key={key} className="p-2 text-blue-400">
                      {key} ({exp.pinMapping.inputNames[key]})
                    </th>
                  ))}
                  {outputKeys.map((key) => (
                    <th key={key} className="p-2 text-emerald-400">
                      {key} ({exp.pinMapping.outputNames[key]})
                    </th>
                  ))}
                  {testResults && <th className="p-2 text-slate-300">Actual</th>}
                  {testResults && <th className="p-2 text-right">Result</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {rows.map((row, idx) => {
                  const testRes = testResults?.find((r) => r.testCaseId === row.id);

                  return (
                    <tr
                      key={row.id}
                      className={`hover:bg-slate-900/50 transition ${
                        testRes ? (testRes.passed ? 'bg-emerald-950/20' : 'bg-red-950/30') : ''
                      }`}
                    >
                      <td className="p-2 text-slate-500">{idx + 1}</td>
                      {isSequential && (
                        <td className="p-2 text-slate-200 font-sans text-[11px] min-w-[160px]">
                          {row.label}
                        </td>
                      )}
                      {inputKeys.map((key) => (
                        <td key={key} className="p-2 font-bold text-blue-300">
                          {row.inputs[key] ?? 0}
                        </td>
                      ))}
                      {outputKeys.map((key) => (
                        <td key={key} className="p-2 font-bold text-emerald-300">
                          {row.expectedOutputs[key] ?? 0}
                        </td>
                      ))}
                      {testResults && (
                        <td className="p-2 text-[11px] text-slate-300 whitespace-nowrap">
                          {testRes
                            ? outputKeys.map((k) => `${k}=${testRes.actual[k] ?? '?'}`).join(' ')
                            : '—'}
                        </td>
                      )}
                      {testResults && (
                        <td className="p-2 text-right whitespace-nowrap">
                          {testRes?.passed ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                              <CheckCircle2 className="w-3 h-3" /> PASS
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-red-400 font-bold" title={JSON.stringify(testRes?.actual)}>
                              <XCircle className="w-3 h-3" /> FAIL
                            </span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Aim & Procedure */}
      {activeTab === 'instructions' && (
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 space-y-2 max-h-48 overflow-y-auto">
          <div>
            <strong className="text-slate-100 uppercase tracking-wider block text-[11px] text-indigo-400 mb-0.5">
              Aim:
            </strong>
            <p>{exp.aim}</p>
          </div>
          <div>
            <strong className="text-slate-100 uppercase tracking-wider block text-[11px] text-indigo-400 mb-0.5">
              Components Required:
            </strong>
            <p className="font-mono text-[11px] text-slate-400">{exp.components.join(', ')}</p>
          </div>
          <div>
            <strong className="text-slate-100 uppercase tracking-wider block text-[11px] text-indigo-400 mb-0.5">
              Procedure:
            </strong>
            <ul className="space-y-1 list-disc pl-4 text-slate-300">
              {exp.procedure.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* TAB 3: Theory & Formulas */}
      {activeTab === 'theory' && (
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 max-h-48 overflow-y-auto">
          <strong className="text-slate-100 uppercase tracking-wider block text-[11px] text-indigo-400 mb-1">
            Theory:
          </strong>
          <pre className="font-mono text-[11px] whitespace-pre-wrap text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded border border-slate-800">
            {exp.theory}
          </pre>
        </div>
      )}
    </div>
  );
};
