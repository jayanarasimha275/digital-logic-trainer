import React from 'react';
import { circuitStore, useCircuitStore } from '../../store/circuitStore';
import { Activity, Radio, RefreshCw, AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react';
import { LogicLevel } from '../../types/circuit';
import { IC_DEFINITIONS } from '../../data/icDefinitions';

export const DigitalReader: React.FC = () => {
  const { ioSettings, simulationResult, probedHoleId, signalHistory, placedICs } = useCircuitStore();

  // Compute 8-bit bytes
  const inByte = ioSettings.inputStates.reduce(
    (acc, bit, idx) => acc | ((bit ? 1 : 0) << idx),
    0
  );

  const outByte = simulationResult.outputStates.reduce(
    (acc, state, idx) => acc | ((state === 'HIGH' ? 1 : 0) << idx),
    0
  );

  const formattedInBin = ioSettings.inputStates
    .map((b) => (b ? '1' : '0'))
    .reverse()
    .join('');

  const formattedOutBin = simulationResult.outputStates
    .map((s) => (s === 'HIGH' ? '1' : s === 'LOW' ? '0' : 'Z'))
    .reverse()
    .join('');

  // Probed signal details
  let probedInfo: {
    label: string;
    level: LogicLevel;
    voltage: string;
    details: string;
  } | null = null;

  if (probedHoleId) {
    let level: LogicLevel = simulationResult.nodeStates[probedHoleId] ?? 'FLOATING';
    let voltage = '0.0 V';
    let label = probedHoleId;
    let details = 'Passive connection point';

    if (probedHoleId === 'vcc-src') {
      label = 'Power Supply +5V (VCC)';
      level = ioSettings.powerOn ? 'HIGH' : 'LOW';
      voltage = ioSettings.powerOn ? '5.0 V' : '0.0 V';
      details = 'Main DC voltage source';
    } else if (probedHoleId === 'gnd-src') {
      label = 'Power Supply GND (0V)';
      level = 'LOW';
      voltage = '0.0 V';
      details = 'Common circuit ground reference';
    } else if (probedHoleId.startsWith('led-')) {
      const ledNum = parseInt(probedHoleId.replace('led-', ''), 10);
      const isOn = simulationResult.userLedStates?.[ledNum] ?? false;
      label = `On-Board User LED ${ledNum} (Strip P3)`;
      level = isOn ? 'HIGH' : 'LOW';
      voltage = isOn ? '3.3 V' : '0.0 V';
      details = '220Ω series resistor to ground (amber indicator)';
    } else if (probedHoleId.startsWith('dio-') || (probedHoleId.startsWith('d') && !probedHoleId.includes('-'))) {
      const ch = parseInt(probedHoleId.replace('dio-', '').replace('d', ''), 10);
      if (ch < 8) {
        label = `Digital Input Terminal DIO ${ch} (Writer Line)`;
        level = ioSettings.inputStates[ch] ? 'HIGH' : 'LOW';
        voltage = level === 'HIGH' ? '5.0 V' : '0.0 V';
        details = `Driven by NI ELVIS Digital Writer Channel ${ch}`;
      } else {
        label = `Digital Output Terminal DIO ${ch} (Reader Line)`;
        level = simulationResult.outputStates[ch - 8];
        voltage = level === 'HIGH' ? '5.0 V' : '0.0 V';
        details = 'NI ELVIS Digital Reader sample line';
      }
    } else if (probedHoleId.startsWith('ic-')) {
      // e.g. ic-ic-7408-1-pin-3
      const parts = probedHoleId.split('-');
      const pinNum = parseInt(parts[parts.length - 1], 10);
      const icInstId = parts.slice(1, parts.length - 2).join('-');
      const ic = placedICs.find((i) => i.instanceId === icInstId);
      if (ic) {
        const def = IC_DEFINITIONS[ic.icDefId];
        const pDef = def?.pins.find((p) => p.number === pinNum);
        label = `${def?.partNumber ?? 'IC'} Pin ${pinNum} (${pDef?.name ?? ''})`;
        details = `${pDef?.description ?? ''} [Type: ${pDef?.type ?? 'N/A'}]`;
        voltage = level === 'HIGH' ? '5.0 V' : level === 'LOW' ? '0.0 V' : 'Hi-Z (Floating)';
      }
    } else {
      label = `Breadboard Tie-Point [${probedHoleId.toUpperCase()}]`;
      voltage = level === 'HIGH' ? '5.0 V' : level === 'LOW' ? '0.0 V' : 'Hi-Z';
    }

    probedInfo = { label, level, voltage, details };
  }

  const getStatusBadge = (lvl: LogicLevel) => {
    switch (lvl) {
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            HIGH (1)
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-mono font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            LOW (0)
          </span>
        );
      case 'FLOATING':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold">
            <HelpCircle className="w-2.5 h-2.5" />
            FLOATING (Z)
          </span>
        );
      case 'ERROR':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-mono font-bold">
            <AlertTriangle className="w-2.5 h-2.5" />
            CONTENTION
          </span>
        );
    }
  };

  return (
    <div id="digital-reader-panel" className="bg-slate-900 border border-slate-700/80 rounded-xl p-3.5 shadow-lg flex flex-col gap-3">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              NI ELVIS Digital Reader
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono font-bold">
                DIO 8 - 15 & LED 0 - 7
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Real-time sampling of circuit outputs & on-board hardware LEDs</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            LIVE
          </span>
        </div>
      </div>

      {/* Primary 8-bit Bus Readouts: Input Byte & Output Byte */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Input Bus (D0 - D7) */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
              Input Byte (D7..D0)
            </span>
            <span className="text-[10px] font-mono bg-blue-950/60 text-blue-300 border border-blue-800/60 px-1.5 rounded">
              DEC: {inByte}
            </span>
          </div>
          <div className="flex items-baseline justify-between font-mono">
            <div className="text-base font-extrabold text-blue-300 tracking-widest bg-slate-900 px-2 py-1 rounded border border-slate-800">
              {formattedInBin}
            </div>
            <div className="text-xs font-semibold text-slate-400">
              HEX: <span className="text-amber-400 font-bold">0x{inByte.toString(16).toUpperCase().padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        {/* Output Bus (D8 - D15) */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              Output Byte (D15..D8)
            </span>
            <span className="text-[10px] font-mono bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 px-1.5 rounded">
              DEC: {outByte}
            </span>
          </div>
          <div className="flex items-baseline justify-between font-mono">
            <div className="text-base font-extrabold text-emerald-300 tracking-widest bg-slate-900 px-2 py-1 rounded border border-slate-800">
              {formattedOutBin}
            </div>
            <div className="text-xs font-semibold text-slate-400">
              HEX: <span className="text-amber-400 font-bold">0x{outByte.toString(16).toUpperCase().padStart(2, '0')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Output Channels D8 - D15 Monitoring Strip */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2.5">
        <div className="text-[10px] text-slate-400 font-semibold mb-2 flex justify-between items-center px-1">
          <span>MSB (D15)</span>
          <span className="text-slate-500">DIGITAL OUTPUT CHANNELS (LEDS)</span>
          <span>LSB (D8)</span>
        </div>

        <div className="grid grid-cols-8 gap-1.5">
          {[15, 14, 13, 12, 11, 10, 9, 8].map((ch) => {
            const state = simulationResult.outputStates[ch - 8];
            const isHigh = state === 'HIGH';
            const isError = state === 'ERROR';
            const isFloating = state === 'FLOATING';

            return (
              <div
                key={ch}
                id={`reader-out-ch-${ch}`}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                  isHigh
                    ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                    : isError
                    ? 'bg-red-950/40 border-red-500 text-red-300 animate-pulse'
                    : isFloating
                    ? 'bg-amber-950/20 border-amber-600/50 text-amber-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <span className="text-[10px] font-mono font-bold text-slate-400">D{ch}</span>
                {/* Physical LED Glow Simulation */}
                <div className="my-1 relative flex items-center justify-center">
                  <div
                    className={`w-4 h-4 rounded-full border transition-all ${
                      isHigh
                        ? 'bg-emerald-400 border-emerald-200 shadow-[0_0_10px_#10b981]'
                        : isError
                        ? 'bg-red-500 border-red-200 shadow-[0_0_10px_#ef4444]'
                        : isFloating
                        ? 'bg-amber-600/60 border-amber-400/60'
                        : 'bg-slate-800 border-slate-700'
                    }`}
                  />
                </div>
                <span className="text-[10px] font-mono font-bold">
                  {isHigh ? '1' : isFloating ? 'Z' : isError ? 'ERR' : '0'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* On-Board User LEDs (LED 0 - LED 7 as on NI ELVIS II Hardware Board) */}
      <div className="bg-slate-950/80 border border-amber-500/30 rounded-lg p-2.5">
        <div className="text-[10px] text-amber-400 font-semibold mb-2 flex justify-between items-center px-1">
          <span>LED 7</span>
          <span className="text-amber-300/80 font-mono">ON-BOARD USER HARDWARE LEDS (220Ω, 3.3V)</span>
          <span>LED 0</span>
        </div>

        <div className="grid grid-cols-8 gap-1.5">
          {[7, 6, 5, 4, 3, 2, 1, 0].map((idx) => {
            const isOn = simulationResult.userLedStates?.[idx] ?? false;

            return (
              <div
                key={idx}
                id={`reader-user-led-${idx}`}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                  isOn
                    ? 'bg-amber-950/50 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                <span className="text-[9px] font-mono font-bold text-amber-400/90">L{idx}</span>
                {/* SMT Amber LED Glow */}
                <div className="my-1 relative flex items-center justify-center">
                  <div
                    className={`w-4 h-3 rounded-xs border transition-all ${
                      isOn
                        ? 'bg-amber-400 border-yellow-100 shadow-[0_0_12px_#f59e0b]'
                        : 'bg-amber-950/40 border-amber-900/60'
                    }`}
                  />
                </div>
                <span className={`text-[9px] font-mono font-bold ${isOn ? 'text-amber-300' : 'text-slate-500'}`}>
                  {isOn ? 'ON' : 'OFF'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Signal Probe Readout (Active Probe Inspector) */}
      {probedInfo ? (
        <div className="bg-blue-950/40 border border-blue-500/50 rounded-lg p-2.5 flex items-start gap-2.5">
          <div className="p-1 rounded bg-blue-500/20 text-blue-400">
            <Radio className="w-4 h-4 animate-ping" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-200 font-mono truncate">{probedInfo.label}</span>
              {getStatusBadge(probedInfo.level)}
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">{probedInfo.details}</p>
            <div className="mt-1 text-[10px] font-mono text-slate-400 flex items-center gap-3">
              <span>Voltage: <strong className="text-blue-300">{probedInfo.voltage}</strong></span>
              <span>State: <strong className="text-slate-200">{probedInfo.level}</strong></span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-950/50 border border-dashed border-slate-800 rounded-lg p-2 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-slate-600" />
          Click on any pin, hole, or wire with the Signal Probe tool to inspect live voltage
        </div>
      )}

      {/* Recent Logic State Trace / Timing History */}
      {signalHistory.length > 0 && (
        <div className="border-t border-slate-800/80 pt-2 flex flex-col gap-1">
          <div className="text-[10px] text-slate-400 font-semibold flex justify-between items-center">
            <span>RECENT TRANSITIONS (LOGIC LOG)</span>
            <span className="text-slate-500 font-mono">{signalHistory.length} samples</span>
          </div>
          <div className="max-h-20 overflow-y-auto space-y-1 pr-1 font-mono text-[10px]">
            {signalHistory.slice(0, 4).map((sample, idx) => (
              <div key={idx} className="flex items-center justify-between px-2 py-0.5 bg-slate-950 rounded text-slate-300">
                <span className="text-slate-500">T+{idx}</span>
                <span>IN: <strong className="text-blue-400">{sample.formattedInputs}</strong></span>
                <span>OUT: <strong className="text-emerald-400">{sample.formattedOutputs}</strong></span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
