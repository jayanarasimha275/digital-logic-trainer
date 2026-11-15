import React, { useEffect, useRef, useState } from 'react';
import { circuitStore, useCircuitStore } from '../../store/circuitStore';
import { ClockConfig } from '../../types/experiment';
import { Play, Pause, RotateCcw, Zap, Activity } from 'lucide-react';

interface Props {
  clockConfig: ClockConfig;
  experimentId: string;
}

export const SequentialClockBar: React.FC<Props> = ({ clockConfig, experimentId }) => {
  const { ioSettings } = useCircuitStore();
  const [autoRunning, setAutoRunning] = useState(false);
  const [intervalMs, setIntervalMs] = useState(800);
  const [pulseCount, setPulseCount] = useState(0);
  const pulseLockRef = useRef(false);

  const clkHigh = ioSettings.inputStates[clockConfig.clkChannel] ?? false;

  // Reset running clock when switching experiments
  useEffect(() => {
    setAutoRunning(false);
    setPulseCount(0);
  }, [experimentId]);

  // Ensure PRE'/CLR'/Reset stay released during clocked stepping unless user manually overrides
  const ensureInactiveAsyncControls = (): Record<number, boolean> => {
    const base: Record<number, boolean> = {};
    if (clockConfig.resetChannel !== undefined) {
      base[clockConfig.resetChannel] = clockConfig.resetActiveLow ? true : false;
    }
    if (clockConfig.preChannel !== undefined) {
      base[clockConfig.preChannel] = true; // active-LOW PRE' inactive = HIGH
    }
    return base;
  };

  // Emit one complete clock pulse cycle matching active edge polarity
  const emitSinglePulse = (recordHistory: boolean) => {
    if (pulseLockRef.current) return;
    pulseLockRef.current = true;
    const ch = clockConfig.clkChannel;
    const idleLevel = clockConfig.activeEdge === 'falling'; // Falling-edge idles HIGH (1->0->1); Rising idles LOW (0->1->0)
    const activeLevel = !idleLevel;
    const asyncUpdates = ensureInactiveAsyncControls();

    // First transition -> triggers active edge if starting from idle
    circuitStore.setInputBits({ ...asyncUpdates, [ch]: activeLevel }, recordHistory);
    setTimeout(() => {
      // Return to idle level
      circuitStore.setInputBits({ ...asyncUpdates, [ch]: idleLevel }, false);
      setPulseCount((c) => c + 1);
      pulseLockRef.current = false;
    }, Math.min(120, Math.floor(intervalMs * 0.35)));
  };

  const handleManualPulse = () => {
    emitSinglePulse(false);
  };

  const handleResetCounter = () => {
    setAutoRunning(false);
    setPulseCount(0);
    const ch = clockConfig.clkChannel;
    const idleClk = clockConfig.activeEdge === 'falling';
    const updates: Record<number, boolean> = { [ch]: idleClk };
    if (clockConfig.preChannel !== undefined) {
      updates[clockConfig.preChannel] = true;
    }
    if (clockConfig.resetChannel !== undefined) {
      // Assert reset active level, then release back to inactive level so next clock can count cleanly
      updates[clockConfig.resetChannel] = clockConfig.resetActiveLow ? false : true;
      circuitStore.setInputBits(updates, true);
      setTimeout(() => {
        circuitStore.setInputBit(clockConfig.resetChannel!, clockConfig.resetActiveLow ? true : false, false);
      }, 90);
    } else {
      circuitStore.setInputBits(updates, true);
    }
  };

  // Automatic Clock Generator Interval
  useEffect(() => {
    if (!autoRunning) return;
    const timer = setInterval(() => {
      emitSinglePulse(false);
    }, intervalMs);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRunning, intervalMs, clockConfig.clkChannel, clockConfig.activeEdge]);

  const hzLabel = (1000 / intervalMs).toFixed(1);

  return (
    <div
      id="sequential-clock-bar"
      className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-3"
    >
      <div className="flex items-center gap-3">
        <div className="p-1.5 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-400">
          <Activity className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              Clock & Reset Controller
            </span>
            <span className="text-[10px] font-mono text-orange-300">
              {clockConfig.clkLabel} · {clockConfig.activeEdge === 'rising' ? 'Rising Edge ↑' : clockConfig.activeEdge === 'falling' ? 'Falling Edge ↓' : 'Level Trigger'}
            </span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 tabular-nums flex items-center gap-3">
            <span>
              CLK:{' '}
              <strong className={clkHigh ? 'text-orange-400' : 'text-slate-300'}>
                {clkHigh ? '1 (HIGH)' : '0 (LOW)'}
              </strong>
            </span>
            <span>·</span>
            <span>
              Pulses: <strong className="text-slate-200">{pulseCount}</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Manual Single Clock Pulse */}
        <button
          id="btn-manual-clock-pulse"
          onClick={handleManualPulse}
          className="px-2.5 py-1.5 rounded-lg bg-orange-600/25 hover:bg-orange-600/40 text-orange-200 border border-orange-500/40 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap shrink-0"
          title="Send one complete clock pulse to advance the circuit by one step"
        >
          <Zap className="w-3.5 h-3.5 text-orange-400" />
          Manual Pulse
        </button>

        {/* Auto Clock Start / Pause */}
        <button
          id="btn-auto-clock-toggle"
          onClick={() => setAutoRunning((v) => !v)}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition cursor-pointer whitespace-nowrap shrink-0 ${
            autoRunning
              ? 'bg-amber-600/25 border-amber-500 text-amber-200'
              : 'bg-emerald-600/25 hover:bg-emerald-600/40 border-emerald-500/40 text-emerald-200'
          }`}
        >
          {autoRunning ? (
            <>
              <Pause className="w-3.5 h-3.5" /> Pause Clock
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" /> Start Auto Clock
            </>
          )}
        </button>

        {/* Reset Counter / Flip-Flop */}
        <button
          id="btn-reset-sequential"
          onClick={handleResetCounter}
          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap shrink-0"
          title={clockConfig.resetLabel ? `Pulse ${clockConfig.resetLabel} to reset state` : 'Reset CLK line'}
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          {clockConfig.resetLabel ? `Reset (${clockConfig.resetLabel})` : 'Reset'}
        </button>

        {/* Speed Adjust */}
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] font-mono">
          <span className="text-slate-400">Rate</span>
          <input
            type="range"
            min={250}
            max={2000}
            step={50}
            value={2250 - intervalMs}
            onChange={(e) => setIntervalMs(2250 - Number(e.target.value))}
            aria-label="Clock frequency"
            className="w-20 accent-orange-500 cursor-pointer"
          />
          <span className="text-slate-200 tabular-nums w-11 text-right">{hzLabel} Hz</span>
        </div>
      </div>
    </div>
  );
};
