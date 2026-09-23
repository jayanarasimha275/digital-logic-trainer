import React, { useState, useMemo } from 'react';
import { useCircuitStore, circuitStore } from '../../store/circuitStore';
import { getGuidedStepsForExperiment } from '../../simulation/guidedMode';
import { LAB_EXPERIMENTS } from '../../data/experiments';
import {
  CheckCircle2,
  Circle,
  Eye,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import { GuidedStep } from '../../types/circuit';

export const GuidedModePanel: React.FC = () => {
  const {
    placedICs,
    wires,
    selectedExperimentId,
  } = useCircuitStore();

  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);

  const selectedExp = selectedExperimentId
    ? LAB_EXPERIMENTS.find((e) => e.id === selectedExperimentId)
    : LAB_EXPERIMENTS[0];

  const steps = useMemo(() => {
    return getGuidedStepsForExperiment(selectedExp ? selectedExp.id : 'exp-half-adder', placedICs, wires);
  }, [selectedExp, placedICs, wires]);

  const currentStep: GuidedStep = steps[activeStepIdx] || steps[0];
  const completedCount = steps.filter((s) => s.isComplete).length;
  const progressPercent = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  const handleHighlight = (holes?: string[]) => {
    if (!holes || holes.length === 0) {
      circuitStore.setHighlightedNodes([]);
      return;
    }
    circuitStore.setHighlightedNodes(holes);
  };

  const handleAutoApply = (step: GuidedStep) => {
    if (step.actionType === 'place_ic' && step.icDefId && step.targetCol) {
      circuitStore.addIC(step.icDefId, step.targetCol);
    } else if (step.actionType === 'wire' && step.fromHole && step.toHole) {
      circuitStore.addWire(step.fromHole, step.toHole);
    }
    if (activeStepIdx < steps.length - 1) {
      setActiveStepIdx(activeStepIdx + 1);
    }
  };

  return (
    <div className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-full select-none text-xs">
      {/* Header */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <h2 className="font-bold text-slate-100 uppercase tracking-wider text-xs">
              Guided Laboratory
            </h2>
          </div>
          <button
            onClick={() => circuitStore.setLabMode('free')}
            className="text-[10px] text-slate-400 hover:text-slate-200 px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 cursor-pointer"
          >
            Exit Guided
          </button>
        </div>

        {/* Experiment Selector */}
        <select
          value={selectedExperimentId || 'exp-half-adder'}
          onChange={(e) => {
            circuitStore.setSelectedExperiment(e.target.value);
            setActiveStepIdx(0);
            circuitStore.setHighlightedNodes([]);
          }}
          className="w-full mt-2 bg-slate-900 border border-slate-700 text-slate-200 rounded p-1.5 text-xs font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          {LAB_EXPERIMENTS.map((exp) => (
            <option key={exp.id} value={exp.id}>
              {exp.title}
            </option>
          ))}
        </select>

        {/* Progress Bar */}
        <div className="mt-2.5 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Lab Progress</span>
            <span className="font-bold text-emerald-400">{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Active Step Card */}
      {currentStep && (
        <div className="p-3 bg-slate-950/40 border-b border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold text-blue-400 uppercase tracking-wider">
              STEP {currentStep.stepNumber} OF {steps.length}
            </span>
            {currentStep.isComplete ? (
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> COMPLETED
              </span>
            ) : (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300">
                PENDING
              </span>
            )}
          </div>

          <div>
            <h3 className="font-bold text-slate-100 text-xs">{currentStep.title}</h3>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{currentStep.description}</p>
          </div>

          {/* Interactive Step Actions */}
          <div className="flex items-center gap-1.5 pt-1">
            {currentStep.highlightHoles && currentStep.highlightHoles.length > 0 && (
              <button
                onClick={() => handleHighlight(currentStep.highlightHoles)}
                className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded font-semibold text-[10.5px] flex items-center justify-center gap-1 cursor-pointer transition border border-slate-700"
                title="Highlight connection holes on the breadboard"
              >
                <Eye className="w-3.5 h-3.5" /> Show on Board
              </button>
            )}

            {!currentStep.isComplete && (currentStep.icDefId || (currentStep.fromHole && currentStep.toHole)) && (
              <button
                onClick={() => handleAutoApply(currentStep)}
                className="flex-1 py-1.5 px-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-semibold text-[10.5px] flex items-center justify-center gap-1 cursor-pointer transition"
                title="Automatically complete this step"
              >
                <Sparkles className="w-3.5 h-3.5" /> Auto-Place
              </button>
            )}
          </div>
        </div>
      )}

      {/* Step Navigation Checklist */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {steps.map((step, idx) => {
          const isActive = idx === activeStepIdx;
          return (
            <button
              key={step.stepNumber}
              onClick={() => {
                setActiveStepIdx(idx);
                if (step.highlightHoles) {
                  circuitStore.setHighlightedNodes(step.highlightHoles);
                }
              }}
              className={`w-full text-left p-2 rounded-lg transition flex items-start gap-2 border cursor-pointer ${
                isActive
                  ? 'bg-slate-800/90 border-blue-500/60 shadow-sm'
                  : 'bg-slate-950/30 border-transparent hover:bg-slate-800/40 hover:border-slate-800'
              }`}
            >
              <span className="mt-0.5 shrink-0">
                {step.isComplete ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Circle className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-600'}`} />
                )}
              </span>

              <div className="min-w-0 flex-1">
                <span className={`block font-semibold text-[11px] truncate ${
                  isActive ? 'text-blue-300 font-bold' : step.isComplete ? 'text-slate-300' : 'text-slate-400'
                }`}>
                  {step.stepNumber}. {step.title}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Navigation */}
      <div className="p-2.5 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
        <button
          onClick={() => {
            if (activeStepIdx > 0) {
              setActiveStepIdx(activeStepIdx - 1);
            }
          }}
          disabled={activeStepIdx === 0}
          className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 font-semibold flex items-center gap-1 cursor-pointer text-xs"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Prev
        </button>

        <span className="font-mono text-[10px] text-slate-400">
          {activeStepIdx + 1} / {steps.length}
        </span>

        <button
          onClick={() => {
            if (activeStepIdx < steps.length - 1) {
              setActiveStepIdx(activeStepIdx + 1);
            }
          }}
          disabled={activeStepIdx === steps.length - 1}
          className="px-2.5 py-1.5 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold flex items-center gap-1 cursor-pointer text-xs"
        >
          Next <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
