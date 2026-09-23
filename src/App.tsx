import React, { useState } from 'react';
import { circuitStore, useCircuitStore } from './store/circuitStore';
import { Toolbar } from './components/Toolbar/Toolbar';
import { ComponentToolbox } from './components/ComponentToolbox/ComponentToolbox';
import { GuidedModePanel } from './components/GuidedMode/GuidedModePanel';
import { Breadboard } from './components/Breadboard/Breadboard';
import { Breadboard3D } from './components/Breadboard/Breadboard3D';
import { TrainerIOPanel } from './components/DigitalIO/TrainerIOPanel';
import { DigitalWriter } from './components/DigitalIO/DigitalWriter';
import { DigitalReader } from './components/DigitalIO/DigitalReader';
import { ExperimentPanel } from './components/ExperimentPanel/ExperimentPanel';
import { PropertyInspector } from './components/Inspector/PropertyInspector';
import { SchematicView } from './components/SchematicView/SchematicView';
import { HardwareReferenceModal } from './components/Reference/HardwareReferenceModal';
import { getHoleCoordinates } from './utils/coordinates';
import { Info, HelpCircle, X } from 'lucide-react';

export default function App() {
  const {
    activeWireStart,
    signalProbeMode,
    labMode,
    viewMode: storeViewMode,
  } = useCircuitStore();

  const [viewMode, setViewMode] = useState<'precision' | '3d' | 'schematic'>(storeViewMode || 'precision');
  const [showHelpGuide, setShowHelpGuide] = useState<boolean>(false);
  const [showHardwareGuide, setShowHardwareGuide] = useState<boolean>(false);

  const handleHoleClick = (holeId: string, _e: React.MouseEvent) => {
    if (signalProbeMode) {
      circuitStore.probeHole(holeId);
      return;
    }

    if (!activeWireStart) {
      const coords = getHoleCoordinates(holeId);
      if (coords) {
        circuitStore.startWire(holeId, coords.x, coords.y);
      }
    } else {
      circuitStore.completeWire(holeId);
    }
  };

  const handleProbeHole = (holeId: string) => {
    circuitStore.probeHole(holeId);
  };

  return (
    <div id="digital-logic-trainer-app" className="flex flex-col h-screen w-screen bg-[#070d18] text-slate-100 overflow-hidden font-sans">
      {/* Top Header & Navigation Toolbar */}
      <Toolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenRefModal={() => setShowHardwareGuide(true)}
      />

      {/* Main Workspace Layout (Left Toolbox/Guided | Center Board | Right Inspector) */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Side: Component Library Toolbox OR Guided Laboratory Steps */}
        {labMode === 'guided' ? <GuidedModePanel /> : <ComponentToolbox />}

        {/* Center Canvas & I/O Station */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto p-3 space-y-3 bg-[#080e1a]">
          {/* Active Status Hint Bar */}
          {activeWireStart && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs py-1.5 px-3 rounded-lg flex items-center justify-between">
              <span className="font-mono font-medium">
                Routing Jumper Wire from <strong className="text-yellow-400 font-bold">[{activeWireStart.holeId.toUpperCase()}]</strong>. Click destination hole or press Esc to cancel.
              </span>
              <button
                onClick={() => circuitStore.cancelWire()}
                className="text-[11px] bg-yellow-500/20 hover:bg-yellow-500/30 px-2 py-0.5 rounded cursor-pointer"
              >
                Cancel Wire (Esc)
              </button>
            </div>
          )}

          {signalProbeMode && (
            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs py-1.5 px-3 rounded-lg flex items-center justify-between">
              <span className="font-mono font-medium">
                Signal Probe Mode Active: Click any pin, tie-point, or bus terminal to inspect its live logic level and voltage.
              </span>
              <button
                onClick={() => circuitStore.setSignalProbeMode(false)}
                className="text-[11px] bg-amber-500/20 hover:bg-amber-500/30 px-2 py-0.5 rounded cursor-pointer"
              >
                Exit Probe Mode
              </button>
            </div>
          )}

          {/* Primary View: 2D Precision Breadboard vs 3D Realistic View vs Logic Schematic */}
          {viewMode === 'precision' ? (
            <div className="flex flex-col shadow-xl">
              {/* 2D Virtual Breadboard SVG Canvas */}
              <Breadboard
                onHoleClick={handleHoleClick}
                onProbeHole={handleProbeHole}
              />

              {/* Integrated Physical Trainer I/O Panel (Switches, LEDs, VCC/GND) */}
              <TrainerIOPanel
                onHoleClick={handleHoleClick}
                activeWireHoleId={activeWireStart?.holeId}
              />
            </div>
          ) : viewMode === '3d' ? (
            <div className="flex flex-col shadow-xl space-y-3">
              {/* Photorealistic 3D Breadboard with Three.js */}
              <Breadboard3D />

              {/* Integrated Physical Trainer I/O Panel for live interaction */}
              <TrainerIOPanel
                onHoleClick={handleHoleClick}
                activeWireHoleId={activeWireStart?.holeId}
              />
            </div>
          ) : (
            <SchematicView />
          )}

          {/* Dedicated Separate Digital Reader and Writer Stations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* SEPARATE DIGITAL WRITER (Controls D0-D7 inputs, binary/hex/dec, clock pulse) */}
            <DigitalWriter />

            {/* SEPARATE DIGITAL READER (Monitors D0-D15, live voltages, output LEDs, logic trace) */}
            <DigitalReader />
          </div>

          {/* Laboratory Experiment Guide & Verification Engine */}
          <ExperimentPanel />
        </main>

        {/* Right Side: Properties & Real-Time Diagnostics Inspector (Tabbed: Properties / Connection Checker) */}
        <PropertyInspector />
      </div>

      {/* Floating Lab Quick Help Trigger */}
      <button
        onClick={() => setShowHelpGuide(true)}
        id="btn-help-guide"
        title="Open Laboratory Guide & Wiring Instructions"
        className="fixed bottom-4 right-4 z-40 p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-2xl border-2 border-blue-400 transition-transform hover:scale-110 cursor-pointer flex items-center justify-center"
      >
        <HelpCircle className="w-5 h-5" />
      </button>

      {/* Hardware Inputs & Outputs Reference Modal (NI ELVIS II) */}
      <HardwareReferenceModal
        isOpen={showHardwareGuide}
        onClose={() => setShowHardwareGuide(false)}
      />

      {/* Quick Help Modal */}
      {showHelpGuide && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4 text-slate-200 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Digital Logic Trainer DLT-01 Guide
                </h3>
              </div>
              <button
                onClick={() => setShowHelpGuide(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 leading-relaxed text-slate-300">
              <div className="space-y-1">
                <strong className="text-blue-400 font-semibold block">1. Placing TTL ICs:</strong>
                <p>Click "Place" on any chip in the left IC Library (e.g. 7408 AND, 7486 XOR). The chip snaps across the center trough of the breadboard.</p>
              </div>

              <div className="space-y-1">
                <strong className="text-blue-400 font-semibold block">2. Rock-Solid Stable Breadboard:</strong>
                <p>The breadboard is locked by default so clicks always connect wires accurately without moving the board. Click "Move Board" in the toolbar whenever you wish to pan or zoom.</p>
              </div>

              <div className="space-y-1">
                <strong className="text-blue-400 font-semibold block">3. 2D vs 3D Visualization:</strong>
                <p>Use <strong>2D Wiring</strong> for fast precision point-to-point connections with hole tooltips. Switch to <strong>3D View</strong> anytime for photorealistic 3D rendering with curved wires and camera presets.</p>
              </div>

              <div className="space-y-1">
                <strong className="text-blue-400 font-semibold block">4. Connection Checker & Inspector:</strong>
                <p>Use the <strong>Check Circuit</strong> tab on the right to inspect missing ICs, unpowered pins, floating inputs, and verify against truth tables.</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowHelpGuide(false)}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
