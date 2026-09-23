import React, { useMemo } from 'react';
import { useCircuitStore, circuitStore } from '../../store/circuitStore';
import { runConnectionCheck } from '../../simulation/connectionChecker';
import { LAB_EXPERIMENTS } from '../../data/experiments';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  Sparkles,
  Zap,
  RefreshCw,
  Eye,
  HelpCircle,
} from 'lucide-react';

export const ConnectionCheckerTab: React.FC = () => {
  const { placedICs, wires, ioSettings, selectedExperimentId, highlightedNodes } = useCircuitStore();

  const selectedExp = selectedExperimentId ? LAB_EXPERIMENTS.find((e) => e.id === selectedExperimentId) : null;

  const result = useMemo(() => {
    return runConnectionCheck(placedICs, wires, ioSettings, selectedExperimentId);
  }, [placedICs, wires, ioSettings, selectedExperimentId]);

  const handleHighlight = (nodes?: string[]) => {
    if (!nodes || nodes.length === 0) {
      circuitStore.setHighlightedNodes([]);
      return;
    }
    circuitStore.setHighlightedNodes(nodes);
  };

  return (
    <div className="space-y-3.5 text-xs">
      {/* Overall Score Banner */}
      <div
        className={`p-3 rounded-lg border flex items-center justify-between ${
          result.passed
            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
            : result.score >= 70
            ? 'bg-amber-950/40 border-amber-500/50 text-amber-300'
            : 'bg-slate-950 border-slate-800 text-slate-300'
        }`}
      >
        <div>
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px]">
            {result.passed ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">CIRCUIT VERIFIED</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>INSPECTION IN PROGRESS</span>
              </>
            )}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {selectedExp ? selectedExp.title : 'Free Exploration Circuit'}
          </p>
        </div>

        <div className="text-right">
          <span className="text-xl font-mono font-extrabold text-white">{result.score}%</span>
          <span className="block text-[9px] text-slate-400 uppercase font-mono">Topology Score</span>
        </div>
      </div>

      {/* Experiment Reference Circuit Shortcut */}
      {selectedExp?.referenceCircuit && !result.passed && (
        <div className="bg-blue-950/30 border border-blue-500/30 rounded-lg p-2.5 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="font-semibold text-blue-300 flex items-center gap-1 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Reference Circuit Available
            </span>
            <p className="text-[10px] text-blue-200/80">Need help? Load standard verified wiring.</p>
          </div>
          <button
            onClick={() => circuitStore.loadExperiment(selectedExp.id, true)}
            className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded text-[10px] cursor-pointer transition"
          >
            Auto-Wire
          </button>
        </div>
      )}

      {/* Clear Highlight Banner if active */}
      {highlightedNodes.length > 0 && (
        <div className="bg-slate-800 border border-blue-500/40 p-2 rounded flex items-center justify-between text-[11px]">
          <span className="text-blue-300 font-mono flex items-center gap-1">
            <Eye className="w-3 h-3 text-blue-400" /> Highlighting {highlightedNodes.length} target hole(s)
          </span>
          <button
            onClick={() => circuitStore.setHighlightedNodes([])}
            className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
          >
            Clear
          </button>
        </div>
      )}

      {/* Topological Checks Checklist */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
          Electrical Topology Rules ({result.checks.filter((c) => c.passed).length}/{result.checks.length} Passed)
        </span>

        <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-0.5">
          {result.checks.map((chk) => {
            const isFailed = !chk.passed && chk.severity === 'error';
            const isWarn = !chk.passed && chk.severity === 'warning';

            return (
              <div
                key={chk.id}
                className={`p-2.5 rounded-lg border transition-colors ${
                  chk.passed
                    ? 'bg-slate-950/60 border-slate-800/90'
                    : isFailed
                    ? 'bg-red-950/30 border-red-500/50 shadow-sm'
                    : 'bg-amber-950/30 border-amber-500/40'
                }`}
              >
                <div className="flex items-start justify-between gap-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {chk.passed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : isFailed ? (
                      <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    )}
                    <span
                      className={`font-semibold text-[11px] truncate ${
                        chk.passed ? 'text-slate-200' : isFailed ? 'text-red-200' : 'text-amber-200'
                      }`}
                    >
                      {chk.label}
                    </span>
                  </div>

                  {chk.highlightNodes && chk.highlightNodes.length > 0 && (
                    <button
                      onClick={() => handleHighlight(chk.highlightNodes)}
                      className="text-[9.5px] px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-blue-300 font-mono flex items-center gap-0.5 cursor-pointer shrink-0"
                      title="Highlight these pins/holes on the breadboard"
                    >
                      <Eye className="w-2.5 h-2.5" /> Show
                    </button>
                  )}
                </div>

                {chk.details && (
                  <p className="text-[10px] text-slate-400 mt-1 leading-tight pl-5">{chk.details}</p>
                )}

                {chk.suggestedFix && !chk.passed && (
                  <div className="mt-1.5 pl-5">
                    <span className="text-[9.5px] font-mono font-semibold text-emerald-400 block bg-emerald-950/30 p-1 rounded border border-emerald-500/20">
                      💡 Fix: {chk.suggestedFix}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Truth Table Verification Section */}
      {result.truthTableResults && result.truthTableResults.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Truth Table Verification
            </span>
            <span className="text-[9.5px] font-mono text-slate-400">
              {result.truthTableResults.filter((t) => t.passed).length}/{result.truthTableResults.length} Cases
            </span>
          </div>

          <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950/80">
            <table className="w-full font-mono text-[10px] text-left">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="p-1.5">Inputs</th>
                  <th className="p-1.5">Expected</th>
                  <th className="p-1.5">Actual</th>
                  <th className="p-1.5 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {result.truthTableResults.map((t, i) => (
                  <tr key={i} className={t.passed ? 'hover:bg-slate-900/40' : 'bg-red-950/20'}>
                    <td className="p-1.5 text-slate-300">
                      {Object.entries(t.inputs)
                        .map(([k, v]) => `${k}=${v}`)
                        .join(' ')}
                    </td>
                    <td className="p-1.5 text-slate-400">
                      {Object.entries(t.expected)
                        .map(([k, v]) => `${k}=${v}`)
                        .join(' ')}
                    </td>
                    <td className="p-1.5 font-bold">
                      {Object.entries(t.actual)
                        .map(([k, v]) => `${k}=${v}`)
                        .join(' ')}
                    </td>
                    <td className="p-1.5 text-right">
                      {t.passed ? (
                        <span className="text-emerald-400 font-bold">✓ PASS</span>
                      ) : (
                        <span className="text-red-400 font-bold">FAIL</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
