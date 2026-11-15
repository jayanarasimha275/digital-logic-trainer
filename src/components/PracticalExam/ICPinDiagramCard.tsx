import React from 'react';
import { IC_DEFINITIONS } from '../../data/icDefinitions';
import { useCircuitStore } from '../../store/circuitStore';
import { ICPinDef } from '../../types/ic';

interface Props {
  icIds: string[];
}

function getPinBadgeColors(pin: ICPinDef) {
  if (pin.type === 'POWER') {
    if (pin.name.includes('VCC')) {
      return { fill: '#450a0a', stroke: '#ef4444', text: '#fca5a5', label: '#f87171' };
    }
    return { fill: '#0f172a', stroke: '#64748b', text: '#cbd5e1', label: '#94a3b8' };
  }
  if (pin.type === 'OUTPUT') {
    return { fill: '#052e16', stroke: '#22c55e', text: '#86efac', label: '#4ade80' };
  }
  if (pin.type === 'ENABLE') {
    return { fill: '#422006', stroke: '#f59e0b', text: '#fde68a', label: '#fbbf24' };
  }
  if (pin.type === 'NC') {
    return { fill: '#020617', stroke: '#334155', text: '#475569', label: '#475569' };
  }
  return { fill: '#0c1e3a', stroke: '#3b82f6', text: '#93c5fd', label: '#60a5fa' };
}

export const ICPinDiagramCard: React.FC<Props> = ({ icIds }) => {
  const { placedICs, simulationResult } = useCircuitStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {icIds.map((icId) => {
        const def = IC_DEFINITIONS[icId];
        if (!def) return null;

        const half = def.pinCount / 2;
        const leftPins = def.pins.slice(0, half); // 1 .. half (top-to-bottom standard DIP orientation)
        const rightPins = [...def.pins.slice(half)].reverse(); // pinCount .. half+1 (top-to-bottom right side)
        const placedMatches = placedICs.filter((p) => p.icDefId === icId);
        const primaryPlaced = placedMatches[0];

        const rowH = 26;
        const svgH = 44 + half * rowH;
        const svgW = 330;
        const bodyX = 112;
        const bodyW = 106;
        const bodyY = 20;
        const bodyH = half * rowH + 12;

        return (
          <div
            key={icId}
            className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-slate-100">{def.partNumber}</span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {def.package} · {def.pinCount} Pins
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">{def.name}</p>
              </div>
              <div className="text-right font-mono text-[10px]">
                <span className="text-red-400 block">VCC: Pin {def.vccPin}</span>
                <span className="text-slate-400 block">GND: Pin {def.gndPin}</span>
              </div>
            </div>

            {/* Pinout Legend */}
            <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-xs bg-red-500 inline-block" /> VCC
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-xs bg-slate-500 inline-block" /> GND
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-xs bg-blue-500 inline-block" /> INPUT/CLK
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-xs bg-amber-500 inline-block" /> EN/PRE/CLR
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-xs bg-emerald-500 inline-block" /> OUTPUT
              </span>
              {primaryPlaced && (
                <span className="ml-auto text-emerald-400">Live IC #{placedMatches.length}</span>
              )}
            </div>

            <div className="flex justify-center overflow-x-auto">
              <svg
                viewBox={`0 0 ${svgW} ${svgH}`}
                className="w-full max-w-[330px] h-auto font-mono select-none"
                role="img"
                aria-label={`${def.partNumber} DIP pinout diagram`}
              >
                {/* DIP Package Body */}
                <rect
                  x={bodyX}
                  y={bodyY}
                  width={bodyW}
                  height={bodyH}
                  rx={6}
                  fill="#0f172a"
                  stroke="#334155"
                  strokeWidth={1.5}
                />
                {/* Orientation Notch */}
                <path
                  d={`M ${bodyX + bodyW / 2 - 12} ${bodyY} A 12 10 0 0 0 ${bodyX + bodyW / 2 + 12} ${bodyY}`}
                  fill="#020617"
                  stroke="#475569"
                  strokeWidth={1.5}
                />
                <circle cx={bodyX + 14} cy={bodyY + 14} r={3} fill="#475569" />

                {/* Part Number Label Inside Body */}
                <text
                  x={bodyX + bodyW / 2}
                  y={bodyY + bodyH / 2 - 4}
                  textAnchor="middle"
                  fill="#e2e8f0"
                  fontSize={12}
                  fontWeight={700}
                >
                  IC {def.id}
                </text>
                <text
                  x={bodyX + bodyW / 2}
                  y={bodyY + bodyH / 2 + 12}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize={9}
                >
                  TOP VIEW
                </text>

                {/* Left Pins (1 .. half) */}
                {leftPins.map((pin, idx) => {
                  const py = bodyY + 16 + idx * rowH;
                  const c = getPinBadgeColors(pin);
                  const liveLvl = primaryPlaced
                    ? simulationResult.nodeStates[`ic-${primaryPlaced.instanceId}-pin-${pin.number}`]
                    : undefined;
                  return (
                    <g key={pin.number}>
                      {/* Lead leg */}
                      <rect
                        x={bodyX - 24}
                        y={py - 7}
                        width={24}
                        height={14}
                        rx={2}
                        fill={c.fill}
                        stroke={c.stroke}
                        strokeWidth={1}
                      />
                      <text
                        x={bodyX - 12}
                        y={py + 3.5}
                        textAnchor="middle"
                        fill={c.text}
                        fontSize={9.5}
                        fontWeight={700}
                      >
                        {pin.number}
                      </text>
                      {/* Signal name outside left */}
                      <text
                        x={bodyX - 30}
                        y={py + 3.5}
                        textAnchor="end"
                        fill={c.label}
                        fontSize={10}
                        fontWeight={600}
                      >
                        {pin.name}
                      </text>
                      {/* Live level dot if placed */}
                      {liveLvl && pin.type !== 'POWER' && pin.type !== 'NC' && (
                        <circle
                          cx={bodyX + 10}
                          cy={py}
                          r={3}
                          fill={
                            liveLvl === 'HIGH'
                              ? '#22c55e'
                              : liveLvl === 'LOW'
                              ? '#334155'
                              : '#f59e0b'
                          }
                        />
                      )}
                    </g>
                  );
                })}

                {/* Right Pins (pinCount .. half+1) */}
                {rightPins.map((pin, idx) => {
                  const py = bodyY + 16 + idx * rowH;
                  const c = getPinBadgeColors(pin);
                  const liveLvl = primaryPlaced
                    ? simulationResult.nodeStates[`ic-${primaryPlaced.instanceId}-pin-${pin.number}`]
                    : undefined;
                  return (
                    <g key={pin.number}>
                      <rect
                        x={bodyX + bodyW}
                        y={py - 7}
                        width={24}
                        height={14}
                        rx={2}
                        fill={c.fill}
                        stroke={c.stroke}
                        strokeWidth={1}
                      />
                      <text
                        x={bodyX + bodyW + 12}
                        y={py + 3.5}
                        textAnchor="middle"
                        fill={c.text}
                        fontSize={9.5}
                        fontWeight={700}
                      >
                        {pin.number}
                      </text>
                      <text
                        x={bodyX + bodyW + 30}
                        y={py + 3.5}
                        textAnchor="start"
                        fill={c.label}
                        fontSize={10}
                        fontWeight={600}
                      >
                        {pin.name}
                      </text>
                      {liveLvl && pin.type !== 'POWER' && pin.type !== 'NC' && (
                        <circle
                          cx={bodyX + bodyW - 10}
                          cy={py}
                          r={3}
                          fill={
                            liveLvl === 'HIGH'
                              ? '#22c55e'
                              : liveLvl === 'LOW'
                              ? '#334155'
                              : '#f59e0b'
                          }
                        />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
};
