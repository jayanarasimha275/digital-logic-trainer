import React from 'react';
import { circuitStore, useCircuitStore } from '../../store/circuitStore';
import { Power, CircleDot, Sparkles, Cpu } from 'lucide-react';

interface Props {
  onHoleClick: (holeId: string, e: React.MouseEvent) => void;
  activeWireHoleId?: string | null;
}

export const TrainerIOPanel: React.FC<Props> = ({ onHoleClick, activeWireHoleId }) => {
  const { ioSettings, simulationResult } = useCircuitStore();

  const handleToggleBit = (idx: number) => {
    circuitStore.toggleInput(idx);
  };

  const handleTogglePower = () => {
    circuitStore.togglePower();
  };

  return (
    <div
      id="trainer-io-panel"
      className="bg-[#0b192c] border-t-2 border-slate-700/80 p-3 rounded-b-xl shadow-2xl flex flex-col gap-3 select-none"
    >
      {/* Header bar identifying NI ELVIS II hardware interface */}
      <div className="flex items-center justify-between px-1 text-xs border-b border-slate-800 pb-1.5">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-blue-400" />
          <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
            NI ELVIS II Prototyping Board — Hardware I/O Interface
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
          <span>TERMINAL STRIP P3</span>
          <span className="text-slate-600">|</span>
          <span>DC SUPPLIES (+5V/GND)</span>
          <span className="text-slate-600">|</span>
          <span className="text-amber-400">USER LEDS (220Ω, 3.3V)</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* 1. DC Power Supplies Section */}
        <div className="flex items-center gap-3 bg-slate-900/95 border border-slate-700/80 px-3 py-2 rounded-lg">
          {/* Main Board Power Rocker */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-[9px] font-bold tracking-wider text-slate-400">POWER</span>
            <button
              onClick={handleTogglePower}
              id="trainer-power-switch"
              className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all cursor-pointer shadow-md ${
                ioSettings.powerOn
                  ? 'bg-emerald-600/30 border-emerald-500 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                  : 'bg-red-950/40 border-red-800/80 text-red-500'
              }`}
              title="Toggle Board Power (+5V DC Supply)"
            >
              <Power className="w-4 h-4" />
            </button>
          </div>

          {/* Binding Posts: +5V & GROUND */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
            {/* VCC Terminal */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-mono font-bold text-red-400">+5V</span>
              <button
                onClick={(e) => onHoleClick('vcc-src', e)}
                id="terminal-vcc-src"
                title="VCC (+5V) Terminal - Click to connect jumper wire"
                className={`w-7 h-7 rounded-full bg-red-600 border-2 border-red-300 shadow-md flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${
                  activeWireHoleId === 'vcc-src' ? 'ring-4 ring-yellow-400 scale-110' : ''
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-red-950 border border-red-400" />
              </button>
            </div>

            {/* GROUND Terminal */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-mono font-bold text-slate-300">GND</span>
              <button
                onClick={(e) => onHoleClick('gnd-src', e)}
                id="terminal-gnd-src"
                title="GROUND (0V) Terminal - Click to connect jumper wire"
                className={`w-7 h-7 rounded-full bg-slate-900 border-2 border-slate-500 shadow-md flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${
                  activeWireHoleId === 'gnd-src' ? 'ring-4 ring-yellow-400 scale-110' : ''
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-600" />
              </button>
            </div>
          </div>
        </div>

        {/* 2. Digital Inputs: DIO 0 - 7 (Digital Writer Channels) */}
        <div className="flex-1 min-w-[280px] bg-slate-900/95 border border-slate-700/80 px-3 py-2 rounded-lg">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="text-[10px] font-bold text-blue-400 tracking-wider flex items-center gap-1">
              <CircleDot className="w-3 h-3 text-blue-400" />
              INPUTS: DIGITAL WRITER (DIO 0 - 7)
            </span>
            <span className="text-[9px] text-slate-400 font-mono">DRIVE CIRCUIT</span>
          </div>

          <div className="flex items-center justify-between gap-1.5">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => {
              const isHigh = ioSettings.inputStates[idx];
              const holeId = `dio-${idx}`;
              const isWireActive = activeWireHoleId === holeId || activeWireHoleId === `d${idx}`;

              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  {/* Switch toggle */}
                  <button
                    onClick={() => handleToggleBit(idx)}
                    className={`w-6 h-7 rounded border flex flex-col items-center justify-between py-1 transition-all cursor-pointer shadow-sm ${
                      isHigh
                        ? 'bg-blue-600/40 border-blue-400 text-blue-300'
                        : 'bg-slate-800 border-slate-700 text-slate-500'
                    }`}
                    title={`Toggle DIO ${idx} (Current: ${isHigh ? 'HIGH (1)' : 'LOW (0)'})`}
                  >
                    <span className={`w-3.5 h-1.5 rounded-xs transition-transform ${isHigh ? 'bg-blue-400 translate-y-0 shadow-[0_0_5px_#3b82f6]' : 'bg-slate-600 translate-y-2'}`} />
                    <span className="text-[8px] font-mono font-bold">{isHigh ? '1' : '0'}</span>
                  </button>

                  {/* Binding post for wire */}
                  <button
                    onClick={(e) => onHoleClick(holeId, e)}
                    id={`terminal-${holeId}`}
                    title={`Connect wire to DIO ${idx}`}
                    className={`w-6 h-6 rounded-full bg-blue-900 border-2 border-blue-400 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${
                      isWireActive ? 'ring-4 ring-yellow-400 scale-110' : ''
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-slate-950 border border-blue-300" />
                  </button>

                  <span className="text-[8px] font-mono font-semibold text-slate-400">{idx}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Digital Outputs: DIO 8 - 15 (Digital Reader Channels) */}
        <div className="flex-1 min-w-[280px] bg-slate-900/95 border border-slate-700/80 px-3 py-2 rounded-lg">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="text-[10px] font-bold text-emerald-400 tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              READERS: DIGITAL READER (DIO 8 - 15)
            </span>
            <span className="text-[9px] text-slate-400 font-mono">SAMPLE CIRCUIT</span>
          </div>

          <div className="flex items-center justify-between gap-1.5">
            {[8, 9, 10, 11, 12, 13, 14, 15].map((idx) => {
              const state = simulationResult.outputStates[idx - 8];
              const isHigh = state === 'HIGH';
              const isError = state === 'ERROR';
              const isFloating = state === 'FLOATING';
              const holeId = `dio-${idx}`;
              const isWireActive = activeWireHoleId === holeId || activeWireHoleId === `d${idx}`;

              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  {/* Status Indicator */}
                  <div
                    className={`w-6 h-7 rounded border flex flex-col items-center justify-center transition-all ${
                      isHigh
                        ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300 shadow-[0_0_8px_#10b981]'
                        : isError
                        ? 'bg-red-600/30 border-red-500 text-red-400'
                        : isFloating
                        ? 'bg-amber-600/20 border-amber-600/40 text-amber-400'
                        : 'bg-slate-800 border-slate-700 text-slate-500'
                    }`}
                    title={`DIO ${idx}: ${state}`}
                  >
                    <span className="text-[8px] font-mono font-bold">
                      {isHigh ? '1' : isFloating ? 'Z' : isError ? '!' : '0'}
                    </span>
                  </div>

                  {/* Binding post for wire */}
                  <button
                    onClick={(e) => onHoleClick(holeId, e)}
                    id={`terminal-${holeId}`}
                    title={`Connect wire to DIO ${idx}`}
                    className={`w-6 h-6 rounded-full bg-emerald-950 border-2 border-emerald-400 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${
                      isWireActive ? 'ring-4 ring-yellow-400 scale-110' : ''
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-slate-950 border border-emerald-300" />
                  </button>

                  <span className="text-[8px] font-mono font-semibold text-slate-400">{idx}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. On-Board User LEDs: LED 0 - 7 (Exactly as seen with red wires in photo!) */}
        <div className="w-full lg:w-auto flex-1 bg-slate-900/95 border border-amber-500/40 px-3 py-2 rounded-lg">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="text-[10px] font-bold text-amber-400 tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              USER LEDs (LED 0 - 7) [ON-BOARD HARDWARE]
            </span>
            <span className="text-[9px] text-amber-300/80 font-mono">220Ω, 3.3V (PHOTO REFERENCE)</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => {
              const isOn = simulationResult.userLedStates?.[idx] ?? false;
              const holeId = `led-${idx}`;
              const isWireActive = activeWireHoleId === holeId;

              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  {/* Glowing Amber SMT LED Lens */}
                  <div
                    className={`w-6 h-6 rounded border flex items-center justify-center transition-all ${
                      isOn
                        ? 'bg-amber-400 border-yellow-200 shadow-[0_0_12px_#f59e0b]'
                        : 'bg-amber-950/40 border-amber-900/50'
                    }`}
                    title={`User LED ${idx}: ${isOn ? 'ON (HIGH)' : 'OFF (LOW)'}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isOn ? 'bg-white shadow-[0_0_4px_#ffffff]' : 'bg-amber-900/60'}`} />
                  </div>

                  {/* Connectable Socket Terminal */}
                  <button
                    onClick={(e) => onHoleClick(holeId, e)}
                    id={`terminal-${holeId}`}
                    title={`Connect wire to User LED ${idx}`}
                    className={`w-6 h-6 rounded-full bg-amber-950 border-2 border-amber-400 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${
                      isWireActive ? 'ring-4 ring-yellow-400 scale-110' : ''
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-slate-950 border border-amber-300" />
                  </button>

                  <span className="text-[8px] font-mono font-semibold text-amber-300">L{idx}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
