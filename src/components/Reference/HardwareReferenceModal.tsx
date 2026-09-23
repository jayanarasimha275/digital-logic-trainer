import React from 'react';
import { X, CheckCircle, ArrowRight, Zap, Info, Cpu, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const HardwareReferenceModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-[#0b162c] border-2 border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#0f2244] border-b border-slate-700/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/30 border border-blue-400/40 rounded-xl text-blue-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white uppercase tracking-wider">
                NI ELVIS II Prototyping Board — Inputs & Outputs Guide
              </h2>
              <p className="text-xs text-blue-300 font-mono">
                Hardware mapping based on National Instruments NI ELVIS II Workstation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Executive Summary Card */}
          <div className="bg-slate-900/90 border border-blue-500/30 p-4 rounded-xl flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white text-sm">What are the Inputs and Outputs in this project?</h3>
              <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                In the NI ELVIS II physical workstation (as shown in your uploaded photo), the board interfaces
                with your circuit through three main groups: <strong>Power Supplies</strong>, <strong>Digital Inputs (DIO 0–7)</strong> driven by the <strong>Digital Writer</strong>, and <strong>Digital Outputs (User LEDs 0–7 & DIO 8–15)</strong> monitored by the <strong>Digital Reader</strong>.
              </p>
            </div>
          </div>

          {/* Detailed Inputs vs Outputs Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* INPUTS COLUMN */}
            <div className="bg-slate-900/80 border border-blue-500/40 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]" />
                <h4 className="font-bold text-blue-400 uppercase tracking-wide text-xs">
                  Circuit Inputs
                </h4>
              </div>

              {/* 1. DC Power Supplies */}
              <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">1. DC Power Supplies (+5V / GND)</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
                    Top-Left Strip
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Provides regulated <strong>+5V DC (VCC)</strong> and <strong>GROUND (0V)</strong> for TTL integrated circuits (e.g. pin 14 and pin 7).
                </p>
                <div className="text-[11px] text-amber-300/90 font-mono bg-slate-900 p-1.5 rounded border border-slate-800">
                  Photo Reference: Notice the black wire from GROUND and red wire from +5V connected to the breadboard distribution rails.
                </div>
              </div>

              {/* 2. Digital I/O (DIO 0 - 7) */}
              <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">2. Digital Writer (DIO 0 - 7)</span>
                  <span className="text-[10px] font-mono text-blue-400 bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-800">
                    Strip P3 (Left)
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  These 8 pins are driven by the <strong>NI ELVIS Digital Writer</strong> virtual instrument or manual toggle switches. They supply <strong>0V (LOW)</strong> or <strong>+5V (HIGH)</strong> into the gate inputs on the breadboard.
                </p>
                <div className="text-[11px] text-amber-300/90 font-mono bg-slate-900 p-1.5 rounded border border-slate-800">
                  Photo Reference: Wires from DIO 0 and DIO 1 feed logic levels into the IC inputs.
                </div>
              </div>
            </div>

            {/* OUTPUTS COLUMN */}
            <div className="bg-slate-900/80 border border-emerald-500/40 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                <h4 className="font-bold text-emerald-400 uppercase tracking-wide text-xs">
                  Circuit Outputs
                </h4>
              </div>

              {/* 1. On-Board User LEDs */}
              <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">1. User LEDs (LED 0 - 7)</span>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800">
                    Strip P3 (Middle)
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  8 on-board amber/yellow SMT LEDs with 220Ω series resistors to ground. When connected to a logic <strong>HIGH (+5V)</strong> output from an IC, the LED lights up on the board!
                </p>
                <div className="text-[11px] text-amber-300/90 font-mono bg-slate-900 p-1.5 rounded border border-slate-800">
                  Photo Reference: In your photo, red jumper wires are plugged directly into the LED 0, 1, 2 terminals to display the outputs.
                </div>
              </div>

              {/* 2. Digital Reader (DIO 8 - 15) */}
              <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">2. Digital Reader (DIO 8 - 15)</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
                    Strip P3 (Center)
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Monitored continuously by the <strong>NI ELVIS Digital Reader</strong> virtual instrument. Samples voltages, verifies truth tables, and generates timing waveforms.
                </p>
                <div className="text-[11px] text-amber-300/90 font-mono bg-slate-900 p-1.5 rounded border border-slate-800">
                  Photo Reference: Connect wires here to read logic states back into the software display.
                </div>
              </div>
            </div>
          </div>

          {/* Quick Step-by-Step Lab Wiring Example */}
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-2">
            <h4 className="font-bold text-white text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              Standard Wiring Workflow (As shown in your photo):
            </h4>
            <ol className="space-y-1.5 text-xs text-slate-300 list-decimal pl-4">
              <li>
                <strong>Power:</strong> Connect <span className="text-red-400 font-mono font-bold">+5V</span> to the red (+) rail and <span className="text-slate-300 font-mono font-bold">GND</span> to the blue (-) rail.
              </li>
              <li>
                <strong>IC Power:</strong> Wire Pin 14 of the IC to the (+) rail, and Pin 7 to the (-) rail.
              </li>
              <li>
                <strong>Inputs:</strong> Connect <span className="text-blue-400 font-mono font-bold">DIO 0</span> and <span className="text-blue-400 font-mono font-bold">DIO 1</span> from Terminal Strip P3 to the gate input pins (e.g. Pin 1 & Pin 2).
              </li>
              <li>
                <strong>Outputs:</strong> Connect the gate output (e.g. Pin 3) to <span className="text-amber-400 font-mono font-bold">LED 0</span> and/or <span className="text-emerald-400 font-mono font-bold">DIO 8</span>.
              </li>
              <li>
                <strong>Observe:</strong> Turn on Board Power. Toggle DIO 0 & 1 in the <strong>Digital Writer</strong>, and observe LED 0 illuminating and <strong>Digital Reader</strong> reading the state!
              </li>
            </ol>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#0f2244] border-t border-slate-700/80 px-6 py-3.5 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Click on any terminal hole on the virtual board to start routing a wire.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow cursor-pointer transition"
          >
            Got it, Return to Lab
          </button>
        </div>
      </div>
    </div>
  );
};
