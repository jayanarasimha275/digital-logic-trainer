import React, { useRef } from 'react';
import { circuitStore, useCircuitStore } from '../../store/circuitStore';
import { WireColor } from '../../types/circuit';
import {
  RotateCcw,
  RotateCw,
  Trash2,
  Download,
  Upload,
  Crosshair,
  Cpu,
  Sparkles,
  HelpCircle,
  Lock,
  Move,
  GraduationCap,
  Layers,
  Box,
  Compass,
} from 'lucide-react';

interface Props {
  viewMode: 'precision' | '3d' | 'schematic';
  onViewModeChange: (mode: 'precision' | '3d' | 'schematic') => void;
  onOpenRefModal?: () => void;
}

const WIRE_COLORS: { color: WireColor; label: string; hex: string }[] = [
  { color: 'red', label: 'VCC (+5V)', hex: '#ef4444' },
  { color: 'black', label: 'GND (0V)', hex: '#0f172a' },
  { color: 'blue', label: 'Input Signal', hex: '#3b82f6' },
  { color: 'green', label: 'Output Signal', hex: '#10b981' },
  { color: 'yellow', label: 'Internal Bus', hex: '#eab308' },
  { color: 'orange', label: 'Carry/Aux', hex: '#f97316' },
  { color: 'purple', label: 'Select Line', hex: '#a855f7' },
  { color: 'white', label: 'Clock/Data', hex: '#f8fafc' },
];

export const Toolbar: React.FC<Props> = ({ viewMode, onViewModeChange, onOpenRefModal }) => {
  const {
    currentWireColor,
    signalProbeMode,
    canUndo,
    canRedo,
    placedICs,
    wires,
    ioSettings,
    boardLocked,
    labMode,
  } = useCircuitStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJson = () => {
    const data = {
      version: 'DLT-01-2.0',
      timestamp: new Date().toISOString(),
      placedICs,
      wires,
      ioSettings,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `digital-lab-circuit-${Date.now().toString(36)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        circuitStore.loadCircuitJson(json);
      } catch (err) {
        alert('Invalid circuit JSON file');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleLoadDemo = () => {
    circuitStore.loadExperiment('exp-half-adder', true);
  };

  return (
    <header id="main-lab-header" className="bg-[#0b1120] border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-2.5 select-none z-30">
      {/* Brand & Trainer Identity */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 shadow-md">
          <Cpu className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-extrabold text-white tracking-wide uppercase">
              Digital Electronics Lab
            </h1>
            <span className="text-[10px] font-mono bg-slate-800 text-blue-300 border border-slate-700 px-1.5 py-0.5 rounded font-bold">
              DLT-01 TRAINER
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Virtual Breadboard & Logic Simulation Environment</p>
        </div>
      </div>

      {/* Main Lab Action Controls */}
      <div className="flex items-center flex-wrap gap-2">
        {/* Undo / Redo */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
          <button
            onClick={() => circuitStore.undo()}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className={`p-1.5 rounded transition ${
              canUndo ? 'text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer' : 'text-slate-600 cursor-not-allowed'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => circuitStore.redo()}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className={`p-1.5 rounded transition ${
              canRedo ? 'text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer' : 'text-slate-600 cursor-not-allowed'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Board Stability Lock / Move Toggle */}
        <button
          onClick={() => circuitStore.toggleBoardLock()}
          className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition cursor-pointer ${
            boardLocked
              ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              : 'bg-amber-600/20 border-amber-500 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.25)]'
          }`}
          title={boardLocked ? 'Board is Locked in place (Stable for easy wiring). Click to allow panning.' : 'Move Mode Active (Drag canvas to pan/zoom). Click to lock board.'}
        >
          {boardLocked ? (
            <>
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Board Locked</span>
            </>
          ) : (
            <>
              <Move className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Move Board</span>
            </>
          )}
        </button>

        {/* View Mode Toggle: 2D Wiring vs 3D Realistic vs Logic Schematic */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
          <button
            onClick={() => {
              onViewModeChange('precision');
              circuitStore.setViewMode('precision');
            }}
            className={`px-2.5 py-1 rounded font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'precision'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="2D Precision vector breadboard with hole tooltips and easy wiring"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2D Wiring</span>
          </button>

          <button
            onClick={() => {
              onViewModeChange('3d');
              circuitStore.setViewMode('3d');
            }}
            className={`px-2.5 py-1 rounded font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              viewMode === '3d'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Photorealistic 3D Breadboard with metallic pins, curved jumper wires, and orbit camera"
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D View</span>
          </button>

          <button
            onClick={() => {
              onViewModeChange('schematic');
              circuitStore.setViewMode('schematic');
            }}
            className={`px-2.5 py-1 rounded font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'schematic'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Logic Gate Schematic Diagram"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Schematic</span>
          </button>
        </div>

        {/* Guided Mode vs Free Mode Toggle */}
        <button
          onClick={() => circuitStore.setLabMode(labMode === 'guided' ? 'free' : 'guided')}
          className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition cursor-pointer ${
            labMode === 'guided'
              ? 'bg-emerald-600/25 border-emerald-500 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
          title="Toggle Guided Mode step-by-step experiment instructions"
        >
          <GraduationCap className={`w-3.5 h-3.5 ${labMode === 'guided' ? 'text-emerald-400' : 'text-slate-400'}`} />
          <span>{labMode === 'guided' ? 'Guided Lab' : 'Free Mode'}</span>
        </button>

        {/* Wire Color Palette */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg">
          <span className="text-[10px] text-slate-400 font-semibold mr-1">WIRE:</span>
          {WIRE_COLORS.map(({ color, label, hex }) => (
            <button
              key={color}
              onClick={() => circuitStore.setWireColor(color)}
              title={label}
              className={`w-4 h-4 rounded-full border transition-transform cursor-pointer ${
                currentWireColor === color ? 'scale-125 ring-2 ring-yellow-400 border-white' : 'border-slate-600 hover:scale-110'
              }`}
              style={{ backgroundColor: hex }}
            />
          ))}
        </div>

        {/* Signal Probe Tool Toggle */}
        <button
          onClick={() => circuitStore.setSignalProbeMode(!signalProbeMode)}
          className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition cursor-pointer ${
            signalProbeMode
              ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
          title="Toggle Signal Probe Tool (Click pin to inspect live logic)"
        >
          <Crosshair className={`w-3.5 h-3.5 ${signalProbeMode ? 'text-amber-400 animate-spin' : 'text-slate-400'}`} />
          <span>Probe</span>
        </button>

        {/* Load Demo Button */}
        <button
          onClick={handleLoadDemo}
          id="btn-load-demo"
          className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 transition cursor-pointer"
          title="Load pre-wired Half Adder Demo circuit"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Demo</span>
        </button>

        {/* Inputs & Outputs Hardware Guide Button */}
        {onOpenRefModal && (
          <button
            onClick={onOpenRefModal}
            id="btn-hardware-guide"
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 transition cursor-pointer"
            title="Hardware pinout and terminal guide"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>Pinout</span>
          </button>
        )}

        {/* Reset Circuit Button */}
        <button
          onClick={() => {
            if (confirm('Clear breadboard and reset all wires and components?')) {
              circuitStore.resetCircuit();
            }
          }}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
          title="Clear all components and wires"
        >
          <Trash2 className="w-3.5 h-3.5 text-slate-400" />
          <span>Clear</span>
        </button>

        {/* Save / Load JSON */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleExportJson}
            title="Save Circuit to JSON"
            className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-lg cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Load Circuit from JSON"
            className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-lg cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportJson}
            accept=".json"
            className="hidden"
          />
        </div>
      </div>
    </header>
  );
};
