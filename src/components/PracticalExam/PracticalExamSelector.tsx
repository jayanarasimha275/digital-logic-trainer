import React, { useState } from 'react';
import { circuitStore, useCircuitStore } from '../../store/circuitStore';
import { getPracticalExamExperiments, PRACTICAL_EXAM_SUPPLEMENTS } from '../../data/practicalExamData';
import { IC_DEFINITIONS } from '../../data/icDefinitions';
import { Award, Cpu, Plus, CheckCircle, Play } from 'lucide-react';

export const PracticalExamSelector: React.FC = () => {
  const { selectedExperimentId, placedICs, wires } = useCircuitStore();
  const [sidebarTab, setSidebarTab] = useState<'exams' | 'ics'>('exams');
  const exams = getPracticalExamExperiments();

  const handleSelectExam = (expId: string) => {
    circuitStore.loadExperiment(expId, false);
  };

  const handleLoadRef = (expId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    circuitStore.loadExperiment(expId, true);
  };

  const handleAddIC = (icId: string) => {
    const def = IC_DEFINITIONS[icId];
    if (!def) return;
    const chipWidth = Math.floor(def.pinCount / 2);
    let targetCol = 4;
    const occupiedCols = placedICs.map((i) => i.startCol);
    while (occupiedCols.some((c) => Math.abs(c - targetCol) < chipWidth + 2) && targetCol < 22) {
      targetCol += chipWidth + 2;
    }
    circuitStore.addIC(icId, targetCol);
  };

  const currentExp = exams.find((e) => e.id === selectedExperimentId) || exams[0];
  const requiredICIds = currentExp.suggestedICs;
  const otherICs = Object.values(IC_DEFINITIONS).filter((d) => !requiredICIds.includes(d.id));

  return (
    <aside
      id="practical-exam-sidebar"
      className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col h-full select-none shrink-0"
    >
      {/* Header */}
      <div className="p-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400 shrink-0" />
          <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            Practical Examination
          </h2>
        </div>
        <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
          SRM AP CSE 207 · 12 Prescribed Circuits
        </p>

        {/* Sub-switcher: 12 Exam Experiments vs IC Toolbox */}
        <div className="flex items-center gap-1 mt-2.5 bg-slate-950 p-0.5 rounded border border-slate-800 text-[11px]">
          <button
            onClick={() => setSidebarTab('exams')}
            className={`flex-1 py-1 rounded font-semibold transition cursor-pointer whitespace-nowrap ${
              sidebarTab === 'exams' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            12 Exam List
          </button>
          <button
            onClick={() => setSidebarTab('ics')}
            className={`flex-1 py-1 rounded font-semibold transition cursor-pointer whitespace-nowrap ${
              sidebarTab === 'ics' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Required ICs ({requiredICIds.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Exact 12 Practical Examination List */}
      {sidebarTab === 'exams' ? (
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {exams.map((exp) => {
            const sup = PRACTICAL_EXAM_SUPPLEMENTS[exp.id];
            const isSelected = currentExp.id === exp.id;
            return (
              <div
                key={exp.id}
                onClick={() => handleSelectExam(exp.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleSelectExam(exp.id);
                }}
                id={`exam-nav-${exp.id}`}
                className={`rounded-lg p-2.5 border transition cursor-pointer ${
                  isSelected
                    ? 'bg-amber-950/35 border-amber-500/70 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold text-amber-400 tabular-nums">
                        #{String(sup.examNumber).padStart(2, '0')}
                      </span>
                      <span className="text-xs font-bold truncate">{sup.examTitle}</span>
                    </div>
                    <p className="text-[10px] font-mono text-slate-400 mt-0.5 truncate">
                      {sup.icSubtitle}
                      {sup.clockConfig ? ' · Sequential' : ' · Combinational'}
                    </p>
                  </div>
                  {isSelected && (
                    <button
                      onClick={(e) => handleLoadRef(exp.id, e)}
                      title="Auto-wire reference circuit onto breadboard"
                      className="px-1.5 py-0.5 rounded bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/40 text-[9.5px] font-mono font-semibold flex items-center gap-0.5 shrink-0 cursor-pointer"
                    >
                      <Play className="w-2.5 h-2.5 fill-current" /> Wire
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Tab 2: Experiment Required ICs first + Remaining IC Library */
        <div className="flex-1 overflow-y-auto p-2.5 space-y-3">
          <div className="space-y-1.5">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Cpu className="w-3 h-3" /> Required for {PRACTICAL_EXAM_SUPPLEMENTS[currentExp.id].examTitle}
            </div>
            {requiredICIds.map((icId) => {
              const ic = IC_DEFINITIONS[icId];
              if (!ic) return null;
              const placedCount = placedICs.filter((p) => p.icDefId === ic.id).length;
              return (
                <div
                  key={ic.id}
                  className="bg-amber-950/20 border border-amber-500/40 rounded-lg p-2.5 flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-extrabold text-sm text-amber-300">{ic.id}</span>
                    {placedCount > 0 && (
                      <span className="text-[9.5px] text-emerald-400 font-mono flex items-center gap-0.5">
                        <CheckCircle className="w-2.5 h-2.5" /> Placed ({placedCount})
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-slate-200">{ic.name}</p>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
                    <span>VCC: #{ic.vccPin} | GND: #{ic.gndPin}</span>
                    <button
                      onClick={() => handleAddIC(ic.id)}
                      className="bg-amber-600 hover:bg-amber-500 text-white px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Place
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
              Additional Standard TTL ICs
            </div>
            {otherICs.map((ic) => (
              <div
                key={ic.id}
                className="bg-slate-950/60 border border-slate-800 rounded-lg p-2 flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <span className="font-mono font-bold text-xs text-blue-300">{ic.id}</span>
                  <span className="text-[10px] text-slate-400 block truncate">{ic.name}</span>
                </div>
                <button
                  onClick={() => handleAddIC(ic.id)}
                  className="bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-0.5 shrink-0 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Place
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Circuit Summary */}
      <div className="p-2.5 border-t border-slate-800 bg-slate-950/80 text-[10px] font-mono text-slate-400 flex items-center justify-between tabular-nums">
        <span>ICs: {placedICs.length}</span>
        <span>Wires: {wires.length}</span>
        <span className="text-amber-400">Exam #{PRACTICAL_EXAM_SUPPLEMENTS[currentExp.id].examNumber}/12</span>
      </div>
    </aside>
  );
};
