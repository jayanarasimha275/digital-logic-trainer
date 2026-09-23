import React, { useState } from 'react';
import { circuitStore, useCircuitStore } from '../../store/circuitStore';
import { LAB_EXPERIMENTS } from '../../data/experiments';
import { simulateCircuit } from '../../simulation/engine';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Sparkles,
  Info,
  ChevronDown,
  ChevronRight,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ExperimentPanel: React.FC = () => {
  const { selectedExperimentId, placedICs, wires, ioSettings } = useCircuitStore();
  const [activeExpId, setActiveExpId] = useState<string>(selectedExperimentId || 'exp-basic-gates');
  const [testResults, setTestResults] = useState<{ rowId: string; pass: boolean; expected: any; actual: any }[] | null>(null);
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'instructions' | 'truthtable' | 'theory'>('truthtable');

  const exp = LAB_EXPERIMENTS.find((e) => e.id === activeExpId) || LAB_EXPERIMENTS[0];

  const handleSelectExp = (id: string) => {
    setActiveExpId(id);
    setTestResults(null);
    circuitStore.loadExperiment(id, false);
  };

  const handleLoadReference = () => {
    circuitStore.loadExperiment(activeExpId, true);
    setTestResults(null);
  };

  // Run all test cases against the live physical virtual circuit
  const handleRunAllTests = () => {
    setIsRunningTests(true);
    setTestResults(null);

    setTimeout(() => {
      const results: { rowId: string; pass: boolean; expected: any; actual: any }[] = [];

      // Channel mapping: e.g. { A: 'D0', B: 'D1' }, { SUM: 'D8', CARRY: 'D9' }
      const inMap = exp.pinMapping.inputNames;
      const outMap = exp.pinMapping.outputNames;

      for (const row of exp.truthTable) {
        // Construct input array D0-D7
        const testInputs = [...ioSettings.inputStates];

        Object.entries(row.inputs).forEach(([inVar, bitVal]) => {
          const chName = inMap[inVar];
          if (chName && chName.startsWith('D')) {
            const chIdx = parseInt(chName.slice(1), 10);
            if (chIdx >= 0 && chIdx < 8) {
              testInputs[chIdx] = bitVal === 1;
            }
          }
        });

        // Run simulation engine with test inputs
        const sim = simulateCircuit(placedICs, wires, {
          inputStates: testInputs,
          powerOn: true,
        });

        // Verify outputs
        let rowPass = true;
        const actualOutputs: Record<string, number | string> = {};

        Object.entries(row.expectedOutputs).forEach(([outVar, expectedBit]) => {
          const chName = outMap[outVar];
          if (chName && chName.startsWith('D')) {
            const chIdx = parseInt(chName.slice(1), 10) - 8;
            if (chIdx >= 0 && chIdx < 8) {
              const state = sim.outputStates[chIdx];
              const actualBit = state === 'HIGH' ? 1 : state === 'LOW' ? 0 : 'FLOATING';
              actualOutputs[outVar] = actualBit;

              if (actualBit !== expectedBit) {
                rowPass = false;
              }
            } else {
              rowPass = false;
            }
          }
        });

        results.push({
          rowId: row.id,
          pass: rowPass,
          expected: row.expectedOutputs,
          actual: actualOutputs,
        });
      }

      setTestResults(results);
      setIsRunningTests(false);

      const allPass = results.length > 0 && results.every((r) => r.pass);
      if (allPass) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }, 300);
  };

  const allPassed = testResults && testResults.length > 0 && testResults.every((r) => r.pass);

  return (
    <div id="experiment-panel" className="bg-slate-900 border border-slate-700/80 rounded-xl p-3.5 shadow-lg flex flex-col gap-3">
      {/* Experiment Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Laboratory Experiment
          </h2>
        </div>

        {/* Experiment Selector Dropdown */}
        <select
          value={activeExpId}
          onChange={(e) => handleSelectExp(e.target.value)}
          className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 font-semibold cursor-pointer max-w-[280px]"
        >
          {LAB_EXPERIMENTS.map((e) => (
            <option key={e.id} value={e.id}>
              Exp {e.number}: {e.title}
            </option>
          ))}
        </select>
      </div>

      {/* Sub Tabs: Truth Table vs Procedure vs Theory */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('truthtable')}
            className={`px-3 py-1 rounded font-semibold transition cursor-pointer ${
              activeTab === 'truthtable' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Truth Table & Verification
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

      {/* TAB 1: Truth Table & Live Verification */}
      {activeTab === 'truthtable' && (
        <div className="flex flex-col gap-2.5">
          {/* Action Verification Controls */}
          <div className="flex items-center justify-between bg-slate-950/80 border border-slate-800 p-2 rounded-lg">
            <div className="flex items-center gap-2">
              <button
                onClick={handleRunAllTests}
                disabled={isRunningTests}
                id="btn-run-all-tests"
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3 h-3 fill-current" />
                {isRunningTests ? 'Evaluating...' : 'Run All Test Cases'}
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
                    {testResults.filter((r) => r.pass).length}/{testResults.length} PASSED - WIRING MISMATCH
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Interactive Truth Table Grid */}
          <div className="overflow-x-auto border border-slate-800 rounded-lg bg-slate-950 max-h-48 overflow-y-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400 uppercase">
                <tr>
                  <th className="p-2">#</th>
                  {Object.keys(exp.truthTable[0].inputs).map((key) => (
                    <th key={key} className="p-2 text-blue-400">
                      {key} ({exp.pinMapping.inputNames[key]})
                    </th>
                  ))}
                  {Object.keys(exp.truthTable[0].expectedOutputs).map((key) => (
                    <th key={key} className="p-2 text-emerald-400">
                      {key} ({exp.pinMapping.outputNames[key]})
                    </th>
                  ))}
                  {testResults && <th className="p-2 text-right">Result</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {exp.truthTable.map((row, idx) => {
                  const testRes = testResults?.find((r) => r.rowId === row.id);

                  return (
                    <tr
                      key={row.id}
                      className={`hover:bg-slate-900/50 transition ${
                        testRes ? (testRes.pass ? 'bg-emerald-950/20' : 'bg-red-950/30') : ''
                      }`}
                    >
                      <td className="p-2 text-slate-500">{idx + 1}</td>
                      {Object.values(row.inputs).map((val, i) => (
                        <td key={i} className="p-2 font-bold text-blue-300">
                          {val}
                        </td>
                      ))}
                      {Object.values(row.expectedOutputs).map((val, i) => (
                        <td key={i} className="p-2 font-bold text-emerald-300">
                          {val}
                        </td>
                      ))}
                      {testResults && (
                        <td className="p-2 text-right">
                          {testRes?.pass ? (
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
