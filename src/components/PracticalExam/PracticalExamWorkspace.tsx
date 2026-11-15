import React, { useEffect, useState } from 'react';
import { circuitStore, useCircuitStore } from '../../store/circuitStore';
import { LAB_EXPERIMENTS } from '../../data/experiments';
import { getPracticalExamExperiments, PRACTICAL_EXAM_SUPPLEMENTS } from '../../data/practicalExamData';
import {
  evaluateExperiment,
  ExperimentStepResult,
  resolveExperimentVariant,
} from '../../simulation/experimentEvaluator';
import { ICPinDiagramCard } from './ICPinDiagramCard';
import { CircuitDiagramSVG } from './CircuitDiagramSVG';
import {
  Award,
  CheckCircle2,
  XCircle,
  Play,
  Sparkles,
  AlertTriangle,
  PlusCircle,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';

type ExamTab =
  | 'overview'
  | 'diagrams'
  | 'connections'
  | 'truthtable'
  | 'observations'
  | 'viva';

interface RecordedObservation {
  id: string;
  inputs: Record<string, number>;
  outputs: Record<string, string>;
  expected?: Record<string, number>;
  matches?: boolean;
}

export const PracticalExamWorkspace: React.FC = () => {
  const { selectedExperimentId, selectedExamVariantId, placedICs, wires, ioSettings, simulationResult } =
    useCircuitStore();
  const [activeTab, setActiveTab] = useState<ExamTab>('truthtable');
  const [testResults, setTestResults] = useState<ExperimentStepResult[] | null>(null);
  const [observations, setObservations] = useState<RecordedObservation[]>([]);
  const [openVivaIdx, setOpenVivaIdx] = useState<number | null>(0);

  const practicalList = getPracticalExamExperiments();
  const exp =
    practicalList.find((e) => e.id === selectedExperimentId) ||
    LAB_EXPERIMENTS.find((e) => e.id === selectedExperimentId) ||
    practicalList[0];

  const sup = PRACTICAL_EXAM_SUPPLEMENTS[exp.id] || PRACTICAL_EXAM_SUPPLEMENTS['exp-multiplexer'];
  const resolved = resolveExperimentVariant(exp, selectedExamVariantId);

  useEffect(() => {
    setTestResults(null);
    setObservations([]);
    setOpenVivaIdx(0);
  }, [exp.id, resolved.variant?.id]);

  const isSequential = Boolean(resolved.sequentialTests && resolved.sequentialTests.length > 0);
  const rows = isSequential
    ? resolved.sequentialTests!.map((s) => ({
        id: s.id,
        label: s.label,
        inputs: s.inputs,
        expectedOutputs: s.expectedOutputs,
      }))
    : resolved.truthTable.map((t) => ({
        id: t.id,
        label: undefined as string | undefined,
        inputs: t.inputs,
        expectedOutputs: t.expectedOutputs,
      }));

  const inputKeys =
    rows.length > 0 ? Object.keys(rows[0].inputs) : Object.keys(resolved.pinMapping.inputNames);
  const outputKeys =
    rows.length > 0 ? Object.keys(rows[0].expectedOutputs) : Object.keys(resolved.pinMapping.outputNames);

  const activeConnections = resolved.variant?.connectionInstructions ?? sup.connectionInstructions;

  const handleLoadReference = () => {
    circuitStore.loadExperiment(exp.id, true, resolved.variant?.id ?? null);
    setTestResults(null);
  };

  const handleVariantChange = (variantId: string) => {
    circuitStore.setSelectedExamVariant(variantId);
    setTestResults(null);
  };

  const handleVerifyCircuit = () => {
    const res = evaluateExperiment(exp, placedICs, wires, ioSettings.inputStates, resolved.variant?.id);
    setTestResults(res.results);
    if (res.passed) {
      confetti({ particleCount: 70, spread: 65, origin: { y: 0.65 } });
    }
  };

  const handleRecordObservation = () => {
    const recordedInputs: Record<string, number> = {};
    for (const key of inputKeys) {
      const ch = resolved.pinMapping.inputNames[key];
      const m = ch?.match(/^D(\d+)$/i);
      if (m) {
        const idx = parseInt(m[1], 10);
        recordedInputs[key] = ioSettings.inputStates[idx] ? 1 : 0;
      } else {
        recordedInputs[key] = 0;
      }
    }

    const recordedOutputs: Record<string, string> = {};
    for (const key of outputKeys) {
      const ch = resolved.pinMapping.outputNames[key];
      const m = ch?.match(/^D(\d+)$/i);
      if (m) {
        const idx = parseInt(m[1], 10);
        const lvl = simulationResult.outputStates[idx - 8];
        recordedOutputs[key] = lvl === 'HIGH' ? '1' : lvl === 'LOW' ? '0' : 'Z';
      } else {
        recordedOutputs[key] = '—';
      }
    }

    // Match against truth table if combinational
    let expected: Record<string, number> | undefined;
    let matches: boolean | undefined;
    if (!isSequential) {
      const matchRow = resolved.truthTable.find((r) =>
        Object.entries(r.inputs).every(([k, v]) => recordedInputs[k] === v)
      );
      if (matchRow) {
        expected = matchRow.expectedOutputs;
        matches = Object.entries(matchRow.expectedOutputs).every(
          ([k, v]) => recordedOutputs[k] === String(v)
        );
      }
    }

    setObservations((prev) => [
      ...prev,
      {
        id: `obs-${Date.now().toString(36)}-${prev.length}`,
        inputs: recordedInputs,
        outputs: recordedOutputs,
        expected,
        matches,
      },
    ]);
  };

  const passedCount = testResults ? testResults.filter((r) => r.passed).length : 0;
  const allPassed = Boolean(testResults && testResults.length > 0 && passedCount === testResults.length);

  return (
    <section
      id="practical-exam-workspace"
      className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-lg flex flex-col gap-3"
    >
      {/* Workspace Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <Award className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono font-bold text-amber-400 tabular-nums">
                EXAM {String(sup.examNumber).padStart(2, '0')}/12
              </span>
              <h2 className="text-sm font-bold text-white truncate">
                {sup.examTitle} — {sup.icSubtitle}
              </h2>
            </div>
            <p className="text-[11px] text-slate-400 truncate">{exp.aim}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {exp.variants && exp.variants.length > 0 && (
            <select
              value={resolved.variant?.id || exp.variants[0].id}
              onChange={(e) => handleVariantChange(e.target.value)}
              aria-label="Select comparator circuit mode"
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 font-semibold cursor-pointer"
            >
              {exp.variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handleLoadReference}
            id="btn-exam-load-reference"
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 bg-amber-600/20 hover:bg-amber-600/35 text-amber-200 border border-amber-500/40 rounded-lg transition cursor-pointer whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Load Reference Circuit
          </button>
        </div>
      </div>

      {/* Organized Section Tabs covering all 11 required exam sections */}
      <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 overflow-x-auto text-xs">
        {(
          [
            { id: 'overview', label: '1–2 & 8 · Aim, Apparatus & Procedure' },
            { id: 'diagrams', label: '3–4 · IC Pinout & Circuit Diagram' },
            { id: 'connections', label: '5 · Wiring Table' },
            { id: 'truthtable', label: isSequential ? '6–7 · Sequence & Verify' : '6–7 · Truth Table & Verify' },
            { id: 'observations', label: `9 · Observations (${observations.length})` },
            { id: 'viva', label: '10–11 · Result & Viva' },
          ] as { id: ExamTab; label: string }[]
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-2.5 py-1 rounded font-semibold transition cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === tab.id ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Discrepancy / Datasheet note if applicable */}
      {exp.discrepancyNote && (
        <div className="bg-amber-950/25 border border-amber-600/35 rounded-lg px-3 py-2 flex items-start gap-2 text-[11px] text-amber-200/90 leading-snug">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300 uppercase tracking-wide mr-1">
              Manual / Datasheet Note:
            </span>
            {exp.discrepancyNote}
          </div>
        </div>
      )}

      {/* SECTIONS 1, 2, 8: Aim, Apparatus Required, Procedure */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-3">
            <div>
              <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400 mb-1">
                1. Aim
              </h3>
              <p className="text-slate-200 leading-relaxed">{exp.aim}</p>
            </div>
            <div className="pt-2 border-t border-slate-800">
              <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400 mb-1.5">
                2. Apparatus Required
              </h3>
              <ul className="space-y-1 text-slate-300 list-disc pl-4">
                {sup.apparatus.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-2">
            <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400">
              8. Step-by-Step Procedure
            </h3>
            <ol className="space-y-1.5 text-slate-300 list-decimal pl-4 leading-relaxed">
              {exp.procedure.map((step, i) => (
                <li key={i}>{step.replace(/^\d+\.\s*/, '')}</li>
              ))}
            </ol>
            <div className="pt-2 border-t border-slate-800">
              <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
                Theory Summary
              </h4>
              <pre className="font-mono text-[11px] whitespace-pre-wrap text-slate-300 leading-relaxed">
                {exp.theory}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* SECTIONS 3 & 4: IC Pin Diagram & Circuit Diagram */}
      {activeTab === 'diagrams' && (
        <div className="space-y-3">
          <div>
            <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400 mb-1.5">
              3. IC Pin Diagram ({resolved.suggestedICs.join(', ')})
            </h3>
            <ICPinDiagramCard icIds={resolved.suggestedICs} />
          </div>
          <div>
            <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400 mb-1.5">
              4. Circuit Diagram
            </h3>
            <CircuitDiagramSVG experimentId={exp.id} variantId={resolved.variant?.id} />
          </div>
        </div>
      )}

      {/* SECTION 5: Connection Instructions */}
      {activeTab === 'connections' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400">
              5. Breadboard Connection Instructions
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              Place ICs via Required ICs tab, then wire jumper connections below
            </span>
          </div>
          <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                <tr>
                  <th className="p-2.5">Signal / Rail</th>
                  <th className="p-2.5">From Terminal</th>
                  <th className="p-2.5">To IC Pin(s) / Terminal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {activeConnections.map((inst, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40">
                    <td className="p-2.5 font-sans font-semibold text-slate-200">{inst.signal}</td>
                    <td className="p-2.5 text-blue-300">{inst.from}</td>
                    <td className="p-2.5 text-emerald-300">{inst.to}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTIONS 6 & 7: Live Circuit Simulation & Truth Table / Count Sequence Verification */}
      {activeTab === 'truthtable' && (
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950 border border-slate-800 p-2 rounded-lg">
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleVerifyCircuit}
                id="btn-exam-verify-circuit"
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer whitespace-nowrap shrink-0"
              >
                <Play className="w-3 h-3 fill-current" />
                {isSequential ? 'Verify Sequence Against Breadboard' : 'Verify Truth Table Against Breadboard'}
              </button>
              <span className="text-[11px] font-mono text-slate-400">
                Inputs: {Object.entries(resolved.pinMapping.inputNames).map(([k, v]) => `${k}=${v}`).join(', ')}
              </span>
            </div>

            {testResults && (
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
                {allPassed ? (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    {passedCount}/{testResults.length} PASSED · CIRCUIT VERIFIED
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-400">
                    <XCircle className="w-4 h-4" />
                    {passedCount}/{testResults.length} PASSED · CHECK WIRING
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-lg bg-slate-950 max-h-60 overflow-y-auto">
            <table className="w-full text-left text-xs font-mono tabular-nums">
              <thead className="bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400 uppercase sticky top-0">
                <tr>
                  <th className="p-2">#</th>
                  {isSequential && <th className="p-2 text-amber-300">State / Clock Step</th>}
                  {inputKeys.map((key) => (
                    <th key={key} className="p-2 text-blue-400">
                      {key} ({resolved.pinMapping.inputNames[key]})
                    </th>
                  ))}
                  {outputKeys.map((key) => (
                    <th key={key} className="p-2 text-emerald-400">
                      {key} ({resolved.pinMapping.outputNames[key]})
                    </th>
                  ))}
                  {testResults && <th className="p-2 text-slate-300">Live Breadboard</th>}
                  {testResults && <th className="p-2 text-right">Status</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {rows.map((row, idx) => {
                  const testRes = testResults?.find((r) => r.testCaseId === row.id);
                  return (
                    <tr
                      key={row.id}
                      className={
                        testRes ? (testRes.passed ? 'bg-emerald-950/20' : 'bg-red-950/25') : 'hover:bg-slate-900/40'
                      }
                    >
                      <td className="p-2 text-slate-500">{idx + 1}</td>
                      {isSequential && (
                        <td className="p-2 text-slate-200 font-sans text-[11px] min-w-[170px]">{row.label}</td>
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
                          {testRes ? outputKeys.map((k) => `${k}=${testRes.actual[k] ?? '?'}`).join(' ') : '—'}
                        </td>
                      )}
                      {testResults && (
                        <td className="p-2 text-right whitespace-nowrap">
                          {testRes?.passed ? (
                            <span className="text-emerald-400 font-bold">PASS</span>
                          ) : (
                            <span className="text-red-400 font-bold">FAIL</span>
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

      {/* SECTION 9: Interactive Observation Table */}
      {activeTab === 'observations' && (
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950 border border-slate-800 p-2.5 rounded-lg">
            <div>
              <h3 className="text-xs font-bold text-slate-100">9. Live Observation Log</h3>
              <p className="text-[11px] text-slate-400">
                Toggle Digital Writer switches (or step Clock pulses) and record real breadboard output readings.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRecordObservation}
                id="btn-record-observation"
                className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Record Current State
              </button>
              {observations.length > 0 && (
                <button
                  onClick={() => setObservations([])}
                  className="px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-lg bg-slate-950 max-h-56 overflow-y-auto">
            {observations.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 font-mono">
                No observations recorded yet. Set input switches or trigger a clock pulse, then click "Record Current State".
              </div>
            ) : (
              <table className="w-full text-left text-xs font-mono tabular-nums">
                <thead className="bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400 uppercase sticky top-0">
                  <tr>
                    <th className="p-2">Obs #</th>
                    {inputKeys.map((k) => (
                      <th key={k} className="p-2 text-blue-400">{k}</th>
                    ))}
                    {outputKeys.map((k) => (
                      <th key={k} className="p-2 text-emerald-400">{k} (Measured)</th>
                    ))}
                    {!isSequential && <th className="p-2 text-right">Check</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {observations.map((obs, idx) => (
                    <tr key={obs.id} className="hover:bg-slate-900/40">
                      <td className="p-2 text-slate-500">{idx + 1}</td>
                      {inputKeys.map((k) => (
                        <td key={k} className="p-2 text-blue-300 font-bold">{obs.inputs[k]}</td>
                      ))}
                      {outputKeys.map((k) => (
                        <td
                          key={k}
                          className={`p-2 font-bold ${
                            obs.outputs[k] === 'Z' ? 'text-amber-400' : 'text-emerald-300'
                          }`}
                        >
                          {obs.outputs[k]}
                        </td>
                      ))}
                      {!isSequential && (
                        <td className="p-2 text-right">
                          {obs.matches === true ? (
                            <span className="text-emerald-400 font-bold">MATCH</span>
                          ) : obs.matches === false ? (
                            <span className="text-red-400 font-bold">MISMATCH</span>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* SECTIONS 10 & 11: Result & Viva Questions */}
      {activeTab === 'viva' && (
        <div className="space-y-3 text-xs">
          <div className="bg-emerald-950/20 border border-emerald-700/40 rounded-lg p-3">
            <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 mb-1">
              10. Result
            </h3>
            <p className="text-slate-200 leading-relaxed">{sup.resultStatement}</p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-2">
            <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400">
              11. Practical Examination Viva Questions
            </h3>
            <div className="divide-y divide-slate-800">
              {sup.vivaQuestions.map((vq, idx) => {
                const isOpen = openVivaIdx === idx;
                return (
                  <div key={idx} className="py-2 first:pt-0 last:pb-0">
                    <button
                      onClick={() => setOpenVivaIdx(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between gap-2 text-left font-semibold text-slate-100 hover:text-amber-300 cursor-pointer"
                    >
                      <span>
                        Q{idx + 1}. {vq.question}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <p className="mt-1.5 text-slate-300 leading-relaxed pl-3 border-l border-amber-500/40">
                        {vq.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
