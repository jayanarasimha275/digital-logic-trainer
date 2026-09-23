import React, { useState } from 'react';
import { circuitStore, useCircuitStore } from '../../store/circuitStore';
import { Sliders, RefreshCw, Zap, ArrowLeft, ArrowRight, Binary, Hash } from 'lucide-react';

export const DigitalWriter: React.FC = () => {
  const { ioSettings } = useCircuitStore();
  const [pulsePin, setPulsePin] = useState<number>(0);
  const [hexInput, setHexInput] = useState<string>('');
  const [binInput, setBinInput] = useState<string>('');

  // Calculate current integer value
  const byteVal = ioSettings.inputStates.reduce(
    (acc, bit, idx) => acc | ((bit ? 1 : 0) << idx),
    0
  );

  const handleToggle = (idx: number) => {
    circuitStore.toggleInput(idx);
  };

  const handleAllZero = () => {
    circuitStore.setInputByte(0);
  };

  const handleAllOne = () => {
    circuitStore.setInputByte(255);
  };

  const handleInvert = () => {
    circuitStore.setInputByte(255 ^ byteVal);
  };

  const handleShiftLeft = () => {
    const nextVal = (byteVal << 1) & 255;
    circuitStore.setInputByte(nextVal);
  };

  const handleShiftRight = () => {
    const nextVal = byteVal >> 1;
    circuitStore.setInputByte(nextVal);
  };

  const handlePulse = () => {
    // Pulse selected pin HIGH for 250ms, then back to LOW
    circuitStore.setInputBit(pulsePin, true);
    setTimeout(() => {
      circuitStore.setInputBit(pulsePin, false);
    }, 250);
  };

  const handleApplyHex = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(hexInput.replace(/^0x/i, ''), 16);
    if (!isNaN(parsed)) {
      circuitStore.setInputByte(parsed);
      setHexInput('');
    }
  };

  const handleApplyBin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = binInput.replace(/[^01]/g, '');
    if (clean.length > 0) {
      const parsed = parseInt(clean, 2);
      if (!isNaN(parsed)) {
        circuitStore.setInputByte(parsed);
        setBinInput('');
      }
    }
  };

  return (
    <div id="digital-writer-panel" className="bg-slate-900 border border-slate-700/80 rounded-xl p-3.5 shadow-lg flex flex-col gap-3">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              NI ELVIS Digital Writer
              <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded font-mono font-bold">
                DIO 0 - 7 [INPUTS]
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Drive digital logic levels (0V / +5V) into circuit input terminals</p>
          </div>
        </div>

        {/* Quick Clear Button */}
        <button
          onClick={handleAllZero}
          title="Reset all inputs to 0"
          className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded border border-slate-700 transition flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Bit Toggle Switches (D7 down to D0) */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2.5">
        <div className="text-[10px] text-slate-400 font-semibold mb-2 flex justify-between items-center px-1">
          <span>MSB (D7)</span>
          <span className="text-slate-500">INDIVIDUAL BIT TOGGLES</span>
          <span>LSB (D0)</span>
        </div>

        <div className="grid grid-cols-8 gap-1.5">
          {[7, 6, 5, 4, 3, 2, 1, 0].map((idx) => {
            const isHigh = ioSettings.inputStates[idx];
            return (
              <button
                key={idx}
                id={`writer-bit-btn-${idx}`}
                onClick={() => handleToggle(idx)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer select-none ${
                  isHigh
                    ? 'bg-blue-600/30 border-blue-500 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                    : 'bg-slate-900 border-slate-700/70 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                }`}
              >
                <span className="text-[10px] font-mono font-bold text-slate-400">D{idx}</span>
                <div
                  className={`w-6 h-6 my-1 rounded flex items-center justify-center font-mono font-bold text-xs transition-colors ${
                    isHigh ? 'bg-blue-500 text-white shadow-inner' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isHigh ? '1' : '0'}
                </div>
                <span className={`text-[9px] uppercase tracking-wider font-semibold ${isHigh ? 'text-blue-400 font-bold' : 'text-slate-500'}`}>
                  {isHigh ? 'HIGH' : 'LOW'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Direct Numeric Value Inputs (Binary / Hex / Dec) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        {/* Binary Form */}
        <form onSubmit={handleApplyBin} className="flex flex-col gap-1">
          <label className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
            <Binary className="w-3 h-3 text-cyan-400" />
            Binary Byte
          </label>
          <div className="flex gap-1">
            <input
              type="text"
              maxLength={8}
              placeholder={ioSettings.inputStates.map((b) => (b ? '1' : '0')).reverse().join('')}
              value={binInput}
              onChange={(e) => setBinInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 font-mono text-cyan-300 text-xs focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border border-cyan-500/40 px-2 py-1 rounded text-[11px] font-medium transition cursor-pointer"
            >
              Set
            </button>
          </div>
        </form>

        {/* Hex Form */}
        <form onSubmit={handleApplyHex} className="flex flex-col gap-1">
          <label className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
            <Hash className="w-3 h-3 text-amber-400" />
            Hex (0x00 - 0xFF)
          </label>
          <div className="flex gap-1">
            <input
              type="text"
              maxLength={4}
              placeholder={`0x${byteVal.toString(16).toUpperCase().padStart(2, '0')}`}
              value={hexInput}
              onChange={(e) => setHexInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 font-mono text-amber-300 text-xs focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/40 px-2 py-1 rounded text-[11px] font-medium transition cursor-pointer"
            >
              Set
            </button>
          </div>
        </form>

        {/* Pulse Generator */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
            <Zap className="w-3 h-3 text-emerald-400" />
            Clock Pulse
          </label>
          <div className="flex gap-1">
            <select
              value={pulsePin}
              onChange={(e) => setPulsePin(Number(e.target.value))}
              className="bg-slate-950 border border-slate-800 rounded px-1.5 py-1 font-mono text-emerald-300 text-xs focus:outline-none"
            >
              {[0, 1, 2, 3, 4, 5, 6, 7].map((p) => (
                <option key={p} value={p}>
                  D{p}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handlePulse}
              className="flex-1 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/40 px-2 py-1 rounded text-[11px] font-medium flex items-center justify-center gap-1 transition cursor-pointer"
            >
              <Zap className="w-3 h-3" />
              Pulse
            </button>
          </div>
        </div>
      </div>

      {/* Bit Manipulation Quick Actions */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-800/80">
        <span className="text-[10px] text-slate-500 font-semibold mr-1">OPS:</span>
        <button
          onClick={handleAllZero}
          className="text-[11px] px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 cursor-pointer"
        >
          All 0s
        </button>
        <button
          onClick={handleAllOne}
          className="text-[11px] px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 cursor-pointer"
        >
          All 1s
        </button>
        <button
          onClick={handleInvert}
          className="text-[11px] px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 cursor-pointer"
        >
          Invert (~Byte)
        </button>
        <button
          onClick={handleShiftLeft}
          title="Shift Left (<< 1)"
          className="text-[11px] px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-2.5 h-2.5" /> Shift L
        </button>
        <button
          onClick={handleShiftRight}
          title="Shift Right (>> 1)"
          className="text-[11px] px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 flex items-center gap-1 cursor-pointer"
        >
          Shift R <ArrowRight className="w-2.5 h-2.5" />
        </button>
      </div>
    </div>
  );
};
