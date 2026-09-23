import React, { useState, useRef, useEffect } from 'react';
import { circuitStore, useCircuitStore } from '../../store/circuitStore';
import { BB_GEOM, getColX, getHoleCoordinates, getRowY } from '../../utils/coordinates';
import { BreadboardRow, WireColor } from '../../types/circuit';
import { IC_DEFINITIONS } from '../../data/icDefinitions';
import { ZoomIn, ZoomOut, RotateCcw, Trash2, RotateCw, Power } from 'lucide-react';

interface Props {
  onHoleClick: (holeId: string, e: React.MouseEvent) => void;
  onProbeHole?: (holeId: string) => void;
}

const WIRE_COLORS: Record<WireColor, { stroke: string; glow: string }> = {
  red: { stroke: '#dc2626', glow: 'rgba(220,38,38,0.5)' },
  black: { stroke: '#1e293b', glow: 'rgba(30,41,59,0.5)' },
  blue: { stroke: '#2563eb', glow: 'rgba(37,99,235,0.5)' },
  green: { stroke: '#16a34a', glow: 'rgba(22,163,74,0.5)' },
  yellow: { stroke: '#ca8a04', glow: 'rgba(202,138,4,0.5)' },
  orange: { stroke: '#ea580c', glow: 'rgba(234,88,12,0.5)' },
  purple: { stroke: '#9333ea', glow: 'rgba(147,51,234,0.5)' },
  white: { stroke: '#f8fafc', glow: 'rgba(248,250,252,0.5)' },
};

export const Breadboard: React.FC<Props> = ({ onHoleClick, onProbeHole }) => {
  const {
    placedICs,
    wires,
    selectedWireId,
    selectedICInstanceId,
    selectedPin,
    activeWireStart,
    currentWireColor,
    signalProbeMode,
    simulationResult,
    ioSettings,
    boardLocked,
    interactionMode,
    activeTool,
    highlightedNodes,
    tracedSignalNet,
  } = useCircuitStore();

  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredHoleId, setHoveredHoleId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const getSVGCoordinates = (e: React.MouseEvent): { x: number; y: number } => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;
    return { x, y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && (!boardLocked || interactionMode === 'camera')) {
      setPan((prev) => ({
        x: prev.x + (e.clientX - panStart.x),
        y: prev.y + (e.clientY - panStart.y),
      }));
      setPanStart({ x: e.clientX, y: e.clientY });
    } else {
      const pos = getSVGCoordinates(e);
      setMousePos(pos);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only allow panning if board is explicitly unlocked or in camera mode
    if ((!boardLocked || interactionMode === 'camera') && (e.button === 1 || e.altKey)) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    // Prevent accidental zooming during wiring when board is locked!
    if (boardLocked && interactionMode !== 'camera' && !e.ctrlKey) {
      return;
    }
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => Math.max(0.6, Math.min(2.5, prev + delta)));
  };

  const handleHoleSelect = (holeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeTool === 'delete') {
      // Find wire attached to this hole if any
      const wire = wires.find((w) => w.fromHoleId === holeId || w.toHoleId === holeId);
      if (wire) {
        circuitStore.deleteWire(wire.id);
        return;
      }
    }
    if (signalProbeMode && onProbeHole) {
      onProbeHole(holeId);
      return;
    }
    onHoleClick(holeId, e);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedWireId) {
          circuitStore.deleteWire(selectedWireId);
        } else if (selectedICInstanceId) {
          circuitStore.removeIC(selectedICInstanceId);
        }
      } else if (e.key === 'r' || e.key === 'R') {
        if (selectedICInstanceId) {
          circuitStore.rotateIC(selectedICInstanceId);
        }
      } else if (e.key === 'Escape') {
        circuitStore.cancelWire();
        circuitStore.setSelectedWire(null);
        circuitStore.setSelectedIC(null);
        circuitStore.clearTrace();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedWireId, selectedICInstanceId]);

  // Wire curvature calculation
  const computeWirePath = (x1: number, y1: number, x2: number, y2: number): string => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const arch = Math.max(30, Math.min(130, dist * 0.38));
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2 - arch;
    return `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;
  };

  const rowsTop: BreadboardRow[] = ['A', 'B', 'C', 'D', 'E'];
  const rowsBot: BreadboardRow[] = ['F', 'G', 'H', 'I', 'J'];

  const formatHoleTooltip = (holeId: string | null): string => {
    if (!holeId) return '';
    if (holeId === 'vcc-src') return '+5V VCC POWER SUPPLY';
    if (holeId === 'gnd-src') return '0V GROUND REFERENCE';
    if (holeId.startsWith('d') && !holeId.includes('-')) {
      const num = parseInt(holeId.replace('d', ''), 10);
      return num <= 7 ? `INPUT SWITCH D${num}` : `OUTPUT LED D${num}`;
    }
    if (holeId.startsWith('top-power-plus-')) return `TOP (+) POWER RAIL (COL ${holeId.replace('top-power-plus-', '')})`;
    if (holeId.startsWith('top-power-minus-')) return `TOP (-) GROUND RAIL (COL ${holeId.replace('top-power-minus-', '')})`;
    if (holeId.startsWith('bot-power-plus-')) return `BOTTOM (+) POWER RAIL (COL ${holeId.replace('bot-power-plus-', '')})`;
    if (holeId.startsWith('bot-power-minus-')) return `BOTTOM (-) GROUND RAIL (COL ${holeId.replace('bot-power-minus-', '')})`;
    if (holeId.startsWith('bb-')) {
      const parts = holeId.split('-');
      return `BREADBOARD HOLE ${parts[2]}${parts[1]}`;
    }
    return holeId;
  };

  return (
    <div
      ref={containerRef}
      id="ni-elvis-board-container"
      className="relative w-full h-[520px] bg-[#051329] border-2 border-slate-700/80 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center cursor-crosshair select-none"
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Board Stability & Lock Status Bar (Top Left) */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-2.5 py-1.5 rounded-lg shadow-md backdrop-blur-xs text-xs">
        <button
          onClick={() => circuitStore.setBoardLocked(!boardLocked)}
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded font-mono text-[11px] font-semibold transition cursor-pointer ${
            boardLocked
              ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-300'
              : 'bg-amber-950/70 border border-amber-500/40 text-amber-300'
          }`}
          title={boardLocked ? 'Board position is fixed. Click to enable move mode.' : 'Move mode enabled. Click to lock board.'}
        >
          <span className="text-[12px]">{boardLocked ? '🔒' : '🔓'}</span>
          <span>{boardLocked ? 'BOARD LOCKED' : 'MOVE MODE'}</span>
        </button>

        {activeWireStart && (
          <span className="text-blue-400 font-mono text-[11px] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
            WIRING ACTIVE (ESC to cancel)
          </span>
        )}
      </div>

      {/* Zoom / Pan Controls Overlay (Top Right) */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 p-1.5 rounded-lg shadow-md backdrop-blur-xs">
        <button
          onClick={() => setZoom((z) => Math.min(2.5, z + 0.15))}
          title="Zoom In"
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded cursor-pointer"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
          title="Zoom Out"
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded cursor-pointer"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setZoom(1.0);
            setPan({ x: 0, y: 0 });
          }}
          title="Reset View"
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <span className="text-[11px] font-mono text-slate-400 px-1 border-l border-slate-700">
          {Math.round(zoom * 100)}%
        </span>
      </div>

      {/* SVG Canvas Rendering the Authentic NI ELVIS II Prototyping Board */}
      <svg
        ref={svgRef}
        id="ni-elvis-board-svg"
        viewBox={`0 0 ${BB_GEOM.boardWidth} ${BB_GEOM.boardHeight}`}
        className="w-full h-full"
        onClick={() => {
          circuitStore.setSelectedWire(null);
          circuitStore.setSelectedIC(null);
        }}
      >
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* 1. Trainer Deep Navy Blue PCB Chassis */}
          <rect
            x="10"
            y="10"
            width={BB_GEOM.boardWidth - 20}
            height={BB_GEOM.boardHeight - 20}
            rx="12"
            fill="#0b2447"
            stroke="#193b68"
            strokeWidth="3"
            filter="drop-shadow(0 14px 28px rgba(0,0,0,0.65))"
          />

          {/* PCB Mounting Screws (4 corners) */}
          <circle cx="28" cy="28" r="7" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="24" y1="28" x2="32" y2="28" stroke="#cbd5e1" strokeWidth="1.5" />
          <circle cx={BB_GEOM.boardWidth - 28} cy="28" r="7" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1={BB_GEOM.boardWidth - 32} y1="28" x2={BB_GEOM.boardWidth - 24} y2="28" stroke="#cbd5e1" strokeWidth="1.5" />
          <circle cx="28" cy={BB_GEOM.boardHeight - 28} r="7" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="24" y1={BB_GEOM.boardHeight - 28} x2="32" y2={BB_GEOM.boardHeight - 28} stroke="#cbd5e1" strokeWidth="1.5" />
          <circle cx={BB_GEOM.boardWidth - 28} cy={BB_GEOM.boardHeight - 28} r="7" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1={BB_GEOM.boardWidth - 32} y1={BB_GEOM.boardHeight - 28} x2={BB_GEOM.boardWidth - 24} y2={BB_GEOM.boardHeight - 28} stroke="#cbd5e1" strokeWidth="1.5" />

          {/* 2. Top Header Silkscreen: Board Identity */}
          <g transform="translate(480, 22)">
            <text x="0" y="12" fill="#ffffff" fontSize="12" fontWeight="900" fontFamily="sans-serif" letterSpacing="1.5">
              DIGITAL LOGIC TRAINER WORKBENCH
            </text>
            <text x="0" y="24" fill="#93c5fd" fontSize="9" fontWeight="bold" fontFamily="sans-serif" letterSpacing="1">
              PHYSICAL CIRCUIT EMULATION ENGINE • NI ELVIS II TOPOLOGY
            </text>
          </g>

          {/* Safety warning icon and text */}
          <g transform="translate(18, 475)">
            <text x="0" y="0" fill="#facc15" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
              ▲ 5V DC TTL DIGITAL LOGIC • PROTECTED OUTPUTS
            </text>
            <text x="0" y="10" fill="#94a3b8" fontSize="7" fontFamily="sans-serif">
              DSU NET-ROUTING ENGINE • LIVE REAL-TIME PROPAGATION
            </text>
          </g>

          {/* 3. Banana Jacks (Top Reference Headers) */}
          <g transform="translate(140, 20)">
            {['GND REF', 'VCC +5V'].map((name, i) => (
              <g key={name} transform={`translate(${i * 68}, 0)`}>
                <circle cx="14" cy="14" r="8" fill={i === 1 ? '#b91c1c' : '#18181b'} stroke="#cbd5e1" strokeWidth="1.5" />
                <circle cx="14" cy="14" r="3.5" fill="#0f172a" />
                <text x="14" y="32" fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="middle">
                  {name}
                </text>
              </g>
            ))}
          </g>

          {/* 4. Left DC Power Supplies Strip (+5V, GROUND, Power Switch) */}
          <g transform="translate(16, 45)">
            <rect x="0" y="0" width="92" height="395" rx="8" fill="#15803d" stroke="#22c55e" strokeWidth="1.5" />
            
            {/* Header */}
            <text x="46" y="20" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
              DC POWER
            </text>
            <text x="46" y="32" fill="#bbf7d0" fontSize="7.5" fontFamily="sans-serif" textAnchor="middle">
              SUPPLIES
            </text>

            {/* Master Rocker Power Switch */}
            <g
              transform="translate(18, 42)"
              className="cursor-pointer"
              onClick={() => circuitStore.togglePower()}
            >
              <rect x="0" y="0" width="56" height="32" rx="4" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
              <rect
                x={ioSettings.powerOn ? 28 : 2}
                y="2"
                width="26"
                height="28"
                rx="3"
                fill={ioSettings.powerOn ? '#22c55e' : '#dc2626'}
                stroke="#ffffff"
                strokeWidth="0.5"
                filter={ioSettings.powerOn ? 'drop-shadow(0 0 6px #22c55e)' : undefined}
              />
              <text x="28" y="20" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                {ioSettings.powerOn ? 'ON' : 'OFF'}
              </text>
            </g>

            {/* +5V VCC Binding Post (Interactive Terminal) */}
            <g
              transform={`translate(0, 0)`}
              className="cursor-pointer"
              onClick={(e) => handleHoleSelect('vcc-src', e)}
              onMouseEnter={() => setHoveredHoleId('vcc-src')}
              onMouseLeave={() => setHoveredHoleId(null)}
            >
              {/* Outer Post Plate */}
              <rect x="8" y="95" width="76" height="55" rx="6" fill="#0f172a" stroke="#dc2626" strokeWidth="1" />
              <text x="46" y="112" fill="#fca5a5" fontSize="8" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                VCC (+5V)
              </text>
              {/* Big Red Binding Post at exact coordinates (52, 130) relative to board -> (36, 85) relative to (16, 45) */}
              <circle
                cx="36"
                cy="85"
                r={hoveredHoleId === 'vcc-src' || activeWireStart?.holeId === 'vcc-src' ? 8 : 6.5}
                fill="#dc2626"
                stroke={hoveredHoleId === 'vcc-src' ? '#facc15' : '#ffffff'}
                strokeWidth={hoveredHoleId === 'vcc-src' ? 2 : 1}
                filter={ioSettings.powerOn ? 'drop-shadow(0 0 8px rgba(239,68,68,0.7))' : undefined}
              />
              <circle cx="36" cy="85" r="3" fill="#1e293b" />
              <text x="46" y="142" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                +5V ●
              </text>
            </g>

            {/* GND Ground Binding Post (Interactive Terminal) */}
            <g
              transform={`translate(0, 0)`}
              className="cursor-pointer"
              onClick={(e) => handleHoleSelect('gnd-src', e)}
              onMouseEnter={() => setHoveredHoleId('gnd-src')}
              onMouseLeave={() => setHoveredHoleId(null)}
            >
              {/* Outer Post Plate */}
              <rect x="8" y="160" width="76" height="55" rx="6" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
              <text x="46" y="177" fill="#cbd5e1" fontSize="8" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                GROUND (0V)
              </text>
              {/* Big Black Binding Post at exact coordinates (52, 190) relative to board -> (36, 145) relative to (16, 45) */}
              <circle
                cx="36"
                cy="145"
                r={hoveredHoleId === 'gnd-src' || activeWireStart?.holeId === 'gnd-src' ? 8 : 6.5}
                fill="#1e293b"
                stroke={hoveredHoleId === 'gnd-src' ? '#facc15' : '#94a3b8'}
                strokeWidth={hoveredHoleId === 'gnd-src' ? 2 : 1}
              />
              <circle cx="36" cy="145" r="3" fill="#020617" />
              <text x="46" y="207" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                GND ●
              </text>
            </g>

            {/* Status Indicators */}
            <g transform="translate(14, 230)">
              <circle
                cx="6"
                cy="6"
                r="4"
                fill={ioSettings.powerOn ? '#22c55e' : '#334155'}
                filter={ioSettings.powerOn ? 'drop-shadow(0 0 6px #22c55e)' : undefined}
              />
              <text x="16" y="9" fill="#86efac" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif">PWR OK</text>

              <circle cx="6" cy="24" r="4" fill="#38bdf8" filter="drop-shadow(0 0 4px #38bdf8)" />
              <text x="16" y="27" fill="#bae6fd" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif">SIM READY</text>
            </g>

            {/* Wiring Hints */}
            <g transform="translate(8, 280)">
              <rect x="0" y="0" width="76" height="100" rx="4" fill="rgba(0,0,0,0.3)" />
              <text x="38" y="16" fill="#fde047" fontSize="7" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                QUICK WIRING:
              </text>
              <text x="6" y="32" fill="#cbd5e1" fontSize="6.5" fontFamily="sans-serif">
                1. Wire +5V ● to
              </text>
              <text x="12" y="42" fill="#fca5a5" fontSize="6.5" fontFamily="monospace">
                Breadboard (+)
              </text>
              <text x="6" y="56" fill="#cbd5e1" fontSize="6.5" fontFamily="sans-serif">
                2. Wire GND ● to
              </text>
              <text x="12" y="66" fill="#93c5fd" fontSize="6.5" fontFamily="monospace">
                Breadboard (-)
              </text>
              <text x="6" y="80" fill="#cbd5e1" fontSize="6.5" fontFamily="sans-serif">
                3. Power IC Pins
              </text>
              <text x="12" y="90" fill="#a7f3d0" fontSize="6.5" fontFamily="monospace">
                VCC:14, GND:7
              </text>
            </g>
          </g>

          {/* 5. Center White Solderless Breadboard */}
          <rect
            x="105"
            y="70"
            width="670"
            height="355"
            rx="8"
            fill="#f8fafc"
            stroke="#cbd5e1"
            strokeWidth="2"
            filter="drop-shadow(0 8px 16px rgba(0,0,0,0.5))"
          />

          {/* Power Rails Color Lines */}
          <line x1="120" y1={BB_GEOM.topPowerPlusY} x2="760" y2={BB_GEOM.topPowerPlusY} stroke="#dc2626" strokeWidth="1.5" strokeDasharray="6 3" />
          <line x1="120" y1={BB_GEOM.topPowerMinusY} x2="760" y2={BB_GEOM.topPowerMinusY} stroke="#1e293b" strokeWidth="1.5" strokeDasharray="6 3" />
          <text x="110" y={BB_GEOM.topPowerPlusY + 3} fill="#dc2626" fontSize="10" fontWeight="bold" fontFamily="monospace">+</text>
          <text x="110" y={BB_GEOM.topPowerMinusY + 4} fill="#1e293b" fontSize="11" fontWeight="bold" fontFamily="monospace">-</text>

          <line x1="120" y1={BB_GEOM.botPowerPlusY} x2="760" y2={BB_GEOM.botPowerPlusY} stroke="#dc2626" strokeWidth="1.5" strokeDasharray="6 3" />
          <line x1="120" y1={BB_GEOM.botPowerMinusY} x2="760" y2={BB_GEOM.botPowerMinusY} stroke="#1e293b" strokeWidth="1.5" strokeDasharray="6 3" />
          <text x="110" y={BB_GEOM.botPowerPlusY + 3} fill="#dc2626" fontSize="10" fontWeight="bold" fontFamily="monospace">+</text>
          <text x="110" y={BB_GEOM.botPowerMinusY + 4} fill="#1e293b" fontSize="11" fontWeight="bold" fontFamily="monospace">-</text>

          {/* Center IC Trough / Divider */}
          <rect
            x="115"
            y={BB_GEOM.troughCenterY - 14}
            width="650"
            height="28"
            fill="#e2e8f0"
            stroke="#cbd5e1"
            strokeWidth="1"
            rx="2"
          />
          <text
            x="125"
            y={BB_GEOM.troughCenterY + 3}
            fill="#94a3b8"
            fontSize="8"
            fontFamily="monospace"
            letterSpacing="2"
          >
            IC CHANNEL / CENTER TROUGH
          </text>

          {/* Column Numbers (1 to 30) */}
          {Array.from({ length: BB_GEOM.numCols }, (_, i) => i + 1).map((col) => {
            const x = getColX(col);
            return (
              <React.Fragment key={col}>
                <text x={x} y={BB_GEOM.rowAY - 14} textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace" fontWeight="bold">
                  {col < 10 ? `0${col}` : col}
                </text>
                <text x={x} y={BB_GEOM.troughCenterY + 3} textAnchor="middle" fill="#94a3b8" fontSize="7" fontFamily="monospace">
                  {col}
                </text>
                <text x={x} y={BB_GEOM.rowJY + 18} textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace" fontWeight="bold">
                  {col < 10 ? `0${col}` : col}
                </text>
              </React.Fragment>
            );
          })}

          {/* Row Letters A-E and F-J */}
          {rowsTop.map((row) => (
            <React.Fragment key={row}>
              <text x="110" y={getRowY(row) + 3} fill="#64748b" fontSize="8" fontFamily="monospace" fontWeight="bold">
                {row}
              </text>
              <text x="765" y={getRowY(row) + 3} fill="#64748b" fontSize="8" fontFamily="monospace" fontWeight="bold">
                {row}
              </text>
            </React.Fragment>
          ))}
          {rowsBot.map((row) => (
            <React.Fragment key={row}>
              <text x="110" y={getRowY(row) + 3} fill="#64748b" fontSize="8" fontFamily="monospace" fontWeight="bold">
                {row}
              </text>
              <text x="765" y={getRowY(row) + 3} fill="#64748b" fontSize="8" fontFamily="monospace" fontWeight="bold">
                {row}
              </text>
            </React.Fragment>
          ))}

          {/* Power Rail Holes */}
          {Array.from({ length: BB_GEOM.numCols }, (_, i) => i + 1).map((col) => {
            const x = getColX(col);
            const topPlus = `top-power-plus-${col}`;
            const topMinus = `top-power-minus-${col}`;
            const botPlus = `bot-power-plus-${col}`;
            const botMinus = `bot-power-minus-${col}`;

            return (
              <g key={`pwr-holes-${col}`}>
                <circle
                  cx={x}
                  cy={BB_GEOM.topPowerPlusY}
                  r={hoveredHoleId === topPlus ? 4.5 : 3.2}
                  fill="#0f172a"
                  stroke={hoveredHoleId === topPlus ? '#ef4444' : '#64748b'}
                  strokeWidth="1.2"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredHoleId(topPlus)}
                  onMouseLeave={() => setHoveredHoleId(null)}
                  onClick={(e) => handleHoleSelect(topPlus, e)}
                />
                <circle
                  cx={x}
                  cy={BB_GEOM.topPowerMinusY}
                  r={hoveredHoleId === topMinus ? 4.5 : 3.2}
                  fill="#0f172a"
                  stroke={hoveredHoleId === topMinus ? '#3b82f6' : '#64748b'}
                  strokeWidth="1.2"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredHoleId(topMinus)}
                  onMouseLeave={() => setHoveredHoleId(null)}
                  onClick={(e) => handleHoleSelect(topMinus, e)}
                />
                <circle
                  cx={x}
                  cy={BB_GEOM.botPowerPlusY}
                  r={hoveredHoleId === botPlus ? 4.5 : 3.2}
                  fill="#0f172a"
                  stroke={hoveredHoleId === botPlus ? '#ef4444' : '#64748b'}
                  strokeWidth="1.2"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredHoleId(botPlus)}
                  onMouseLeave={() => setHoveredHoleId(null)}
                  onClick={(e) => handleHoleSelect(botPlus, e)}
                />
                <circle
                  cx={x}
                  cy={BB_GEOM.botPowerMinusY}
                  r={hoveredHoleId === botMinus ? 4.5 : 3.2}
                  fill="#0f172a"
                  stroke={hoveredHoleId === botMinus ? '#3b82f6' : '#64748b'}
                  strokeWidth="1.2"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredHoleId(botMinus)}
                  onMouseLeave={() => setHoveredHoleId(null)}
                  onClick={(e) => handleHoleSelect(botMinus, e)}
                />
              </g>
            );
          })}

          {/* Breadboard Holes (Rows A-E and F-J) */}
          {rowsTop.map((row) =>
            Array.from({ length: BB_GEOM.numCols }, (_, i) => i + 1).map((col) => {
              const x = getColX(col);
              const y = getRowY(row);
              const holeId = `bb-${row}-${col}`;
              const isHov = hoveredHoleId === holeId;
              const isAct = activeWireStart?.holeId === holeId;

              return (
                <circle
                  key={holeId}
                  id={`hole-${holeId}`}
                  cx={x}
                  cy={y}
                  r={isHov || isAct ? 4.5 : 3}
                  fill={isAct ? '#facc15' : '#0f172a'}
                  stroke={isHov ? '#3b82f6' : isAct ? '#eab308' : '#64748b'}
                  strokeWidth={isHov || isAct ? 2 : 1}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredHoleId(holeId)}
                  onMouseLeave={() => setHoveredHoleId(null)}
                  onClick={(e) => handleHoleSelect(holeId, e)}
                />
              );
            })
          )}

          {rowsBot.map((row) =>
            Array.from({ length: BB_GEOM.numCols }, (_, i) => i + 1).map((col) => {
              const x = getColX(col);
              const y = getRowY(row);
              const holeId = `bb-${row}-${col}`;
              const isHov = hoveredHoleId === holeId;
              const isAct = activeWireStart?.holeId === holeId;

              return (
                <circle
                  key={holeId}
                  id={`hole-${holeId}`}
                  cx={x}
                  cy={y}
                  r={isHov || isAct ? 4.5 : 3}
                  fill={isAct ? '#facc15' : '#0f172a'}
                  stroke={isHov ? '#3b82f6' : isAct ? '#eab308' : '#64748b'}
                  strokeWidth={isHov || isAct ? 2 : 1}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredHoleId(holeId)}
                  onMouseLeave={() => setHoveredHoleId(null)}
                  onClick={(e) => handleHoleSelect(holeId, e)}
                />
              );
            })
          )}

          {/* 6. Terminal Strip P3 (Bottom edge - exactly as shown in photo!) */}
          <g transform="translate(100, 435)">
            {/* Background block for Terminal Strip P3 */}
            <rect x="0" y="0" width="680" height="58" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />

            {/* Section 1: Digital I/O (DIO 0 - 7: Digital Writer Inputs) */}
            <g transform="translate(15, 6)">
              <text x="75" y="10" fill="#60a5fa" fontSize="9" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                DIGITAL I/O (DIO 0 - 7) [INPUTS]
              </text>
              <text x="75" y="19" fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="middle">
                Digital Writer Channels
              </text>

              {Array.from({ length: 8 }, (_, i) => {
                const holeId = `dio-${i}`;
                const isHigh = ioSettings.inputStates[i];
                const x = i * 20;

                return (
                  <g
                    key={holeId}
                    transform={`translate(${x}, 24)`}
                    className="cursor-pointer"
                    onClick={(e) => handleHoleSelect(holeId, e)}
                    onMouseEnter={() => setHoveredHoleId(holeId)}
                    onMouseLeave={() => setHoveredHoleId(null)}
                  >
                    <circle
                      cx="8"
                      cy="12"
                      r={hoveredHoleId === holeId || activeWireStart?.holeId === holeId ? 5.5 : 4}
                      fill={isHigh ? '#2563eb' : '#1e293b'}
                      stroke={isHigh ? '#93c5fd' : '#475569'}
                      strokeWidth="1.5"
                      filter={isHigh ? 'drop-shadow(0 0 4px #3b82f6)' : undefined}
                    />
                    <text x="8" y="24" fill={isHigh ? '#93c5fd' : '#cbd5e1'} fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                      {i}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Section 2: Digital I/O (DIO 8 - 15: Digital Reader Outputs) */}
            <g transform="translate(195, 6)">
              <text x="75" y="10" fill="#34d399" fontSize="9" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                DIGITAL I/O (DIO 8 - 15) [READERS]
              </text>
              <text x="75" y="19" fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="middle">
                Digital Reader Channels
              </text>

              {Array.from({ length: 8 }, (_, i) => {
                const holeId = `dio-${i + 8}`;
                const state = simulationResult.outputStates[i];
                const isHigh = state === 'HIGH';
                const x = i * 20;

                return (
                  <g
                    key={holeId}
                    transform={`translate(${x}, 24)`}
                    className="cursor-pointer"
                    onClick={(e) => handleHoleSelect(holeId, e)}
                    onMouseEnter={() => setHoveredHoleId(holeId)}
                    onMouseLeave={() => setHoveredHoleId(null)}
                  >
                    <circle
                      cx="8"
                      cy="12"
                      r={hoveredHoleId === holeId || activeWireStart?.holeId === holeId ? 5.5 : 4}
                      fill={isHigh ? '#10b981' : '#1e293b'}
                      stroke={isHigh ? '#6ee7b7' : '#475569'}
                      strokeWidth="1.5"
                      filter={isHigh ? 'drop-shadow(0 0 4px #10b981)' : undefined}
                    />
                    <text x="8" y="24" fill={isHigh ? '#6ee7b7' : '#cbd5e1'} fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                      {i + 8}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Section 3: User Configurable I/O - LEDs (LED 0 - 7 as on the real NI ELVIS II board!) */}
            <g transform="translate(380, 6)">
              <text x="85" y="10" fill="#facc15" fontSize="9" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                USER LEDs (LED 0 - 7)
              </text>
              <text x="85" y="19" fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="middle">
                220Ω, V_OH=3.3V (Output Indicators)
              </text>

              {Array.from({ length: 8 }, (_, i) => {
                const holeId = `led-${i}`;
                const isOn = simulationResult.userLedStates?.[i] ?? false;
                const x = i * 22;

                return (
                  <g
                    key={holeId}
                    transform={`translate(${x}, 24)`}
                    className="cursor-pointer"
                    onClick={(e) => handleHoleSelect(holeId, e)}
                    onMouseEnter={() => setHoveredHoleId(holeId)}
                    onMouseLeave={() => setHoveredHoleId(null)}
                  >
                    {/* SMT Yellow LED indicator (glows when HIGH!) */}
                    <rect
                      x="3"
                      cy="0"
                      y="-2"
                      width="8"
                      height="5"
                      rx="1"
                      fill={isOn ? '#fbbf24' : '#78350f'}
                      stroke={isOn ? '#fef08a' : '#451a03'}
                      strokeWidth="0.5"
                      filter={isOn ? 'drop-shadow(0 0 6px #f59e0b)' : undefined}
                    />

                    {/* Connectable Socket Pin */}
                    <circle
                      cx="7"
                      cy="12"
                      r={hoveredHoleId === holeId || activeWireStart?.holeId === holeId ? 5.5 : 4}
                      fill={isOn ? '#d97706' : '#1e293b'}
                      stroke={hoveredHoleId === holeId ? '#facc15' : '#ca8a04'}
                      strokeWidth="1.5"
                    />
                    <text x="7" y="24" fill={isOn ? '#fef08a' : '#cbd5e1'} fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                      {i}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Section 4: DSUB-17 Connector (Silkscreen realism) */}
            <g transform="translate(565, 14)">
              <rect x="0" y="0" width="100" height="34" rx="3" fill="#334155" stroke="#64748b" strokeWidth="1" />
              <text x="50" y="14" fill="#cbd5e1" fontSize="7" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                DSUB J7 / PFI
              </text>
              <text x="50" y="26" fill="#94a3b8" fontSize="6" fontFamily="monospace" textAnchor="middle">
                COUNTERS & TIMERS
              </text>
            </g>
          </g>

          {/* 7. Placed TTL IC Packages across Center Trough */}
          {placedICs.map((ic) => {
            const def = IC_DEFINITIONS[ic.icDefId];
            if (!def) return null;

            const half = def.pinCount / 2;
            const startX = getColX(ic.startCol) - BB_GEOM.colPitch / 2;
            const width = half * BB_GEOM.colPitch;
            const height = 36;
            const icY = BB_GEOM.troughCenterY - height / 2;
            const isSelected = selectedICInstanceId === ic.instanceId;

            return (
              <g
                key={ic.instanceId}
                id={`placed-ic-${ic.instanceId}`}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  circuitStore.setSelectedIC(ic.instanceId);
                }}
              >
                {/* Chip body */}
                <rect
                  x={startX}
                  y={icY}
                  width={width}
                  height={height}
                  rx="3"
                  fill="#18181b"
                  stroke={isSelected ? '#facc15' : '#27272a'}
                  strokeWidth={isSelected ? 2.5 : 1}
                  filter="drop-shadow(0 4px 6px rgba(0,0,0,0.7))"
                />

                {/* Notch Pin 1 */}
                <path
                  d={
                    ic.rotation === 0
                      ? `M ${startX} ${BB_GEOM.troughCenterY - 6} A 6 6 0 0 1 ${startX} ${BB_GEOM.troughCenterY + 6}`
                      : `M ${startX + width} ${BB_GEOM.troughCenterY - 6} A 6 6 0 0 0 ${startX + width} ${BB_GEOM.troughCenterY + 6}`
                  }
                  fill="#27272a"
                  stroke="#3f3f46"
                />

                {/* Pin 1 Dot */}
                <circle
                  cx={ic.rotation === 0 ? startX + 8 : startX + width - 8}
                  cy={icY + height - 8}
                  r="1.8"
                  fill="#ffffff"
                />

                {/* Part Number Text */}
                <text
                  x={startX + width / 2}
                  y={BB_GEOM.troughCenterY + 3}
                  textAnchor="middle"
                  fill="#f4f4f5"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                  letterSpacing="1"
                >
                  {def.partNumber}
                </text>

                {/* Metallic DIP Pins */}
                {Array.from({ length: half }, (_, i) => {
                  const col = ic.startCol + i;
                  const pinX = getColX(col);
                  const botPinNum = ic.rotation === 0 ? i + 1 : def.pinCount - i;
                  const topPinNum = ic.rotation === 0 ? def.pinCount - i : i + 1;

                  const isTopSelected = selectedPin?.instanceId === ic.instanceId && selectedPin?.pinNumber === topPinNum;
                  const isBotSelected = selectedPin?.instanceId === ic.instanceId && selectedPin?.pinNumber === botPinNum;

                  const topHoleId = `ic-${ic.instanceId}-pin-${topPinNum}`;
                  const botHoleId = `ic-${ic.instanceId}-pin-${botPinNum}`;

                  return (
                    <g key={i}>
                      {/* Top Pin Lead */}
                      <rect
                        x={pinX - 2.5}
                        y={BB_GEOM.rowEY}
                        width={5}
                        height={icY - BB_GEOM.rowEY + 2}
                        fill={isTopSelected ? '#facc15' : '#cbd5e1'}
                        stroke={isTopSelected ? '#eab308' : '#64748b'}
                        strokeWidth={isTopSelected ? 1.5 : 0.5}
                        className="cursor-pointer hover:fill-amber-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (activeWireStart) {
                            handleHoleSelect(topHoleId, e);
                          } else {
                            circuitStore.setSelectedPin({ instanceId: ic.instanceId, pinNumber: topPinNum });
                          }
                        }}
                      />
                      <text x={pinX} y={icY - 2} textAnchor="middle" fill="#94a3b8" fontSize="6" fontFamily="monospace">
                        {topPinNum}
                      </text>

                      {/* Bottom Pin Lead */}
                      <rect
                        x={pinX - 2.5}
                        y={icY + height - 2}
                        width={5}
                        height={BB_GEOM.rowFY - (icY + height) + 2}
                        fill={isBotSelected ? '#facc15' : '#cbd5e1'}
                        stroke={isBotSelected ? '#eab308' : '#64748b'}
                        strokeWidth={isBotSelected ? 1.5 : 0.5}
                        className="cursor-pointer hover:fill-amber-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (activeWireStart) {
                            handleHoleSelect(botHoleId, e);
                          } else {
                            circuitStore.setSelectedPin({ instanceId: ic.instanceId, pinNumber: botPinNum });
                          }
                        }}
                      />
                      <text x={pinX} y={icY + height + 7} textAnchor="middle" fill="#94a3b8" fontSize="6" fontFamily="monospace">
                        {botPinNum}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* 8. Jumper Wires Layer */}
          {wires.map((wire) => {
            const fromCoord = getHoleCoordinates(wire.fromHoleId);
            const toCoord = getHoleCoordinates(wire.toHoleId);
            if (!fromCoord || !toCoord) return null;

            const isSelected = selectedWireId === wire.id;
            const pathData = computeWirePath(fromCoord.x, fromCoord.y, toCoord.x, toCoord.y);
            const colorCfg = WIRE_COLORS[wire.color] || WIRE_COLORS.blue;

            return (
              <g
                key={wire.id}
                id={`wire-${wire.id}`}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  circuitStore.setSelectedWire(wire.id);
                }}
              >
                {/* Wire Shadow */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="rgba(0,0,0,0.4)"
                  strokeWidth="5.5"
                  strokeLinecap="round"
                  transform="translate(0, 5)"
                />

                {/* Selection Glow */}
                {isSelected && (
                  <path
                    d={pathData}
                    fill="none"
                    stroke="#facc15"
                    strokeWidth="8.5"
                    strokeLinecap="round"
                    className="animate-pulse"
                  />
                )}

                {/* Main Jumper Wire */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={colorCfg.stroke}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Wire Core Highlight */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="rgba(255,255,255,0.45)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />

                {/* Endpoint Snap Rings */}
                <circle cx={fromCoord.x} cy={fromCoord.y} r="3.5" fill={colorCfg.stroke} stroke="#0f172a" strokeWidth="1" />
                <circle cx={toCoord.x} cy={toCoord.y} r="3.5" fill={colorCfg.stroke} stroke="#0f172a" strokeWidth="1" />
              </g>
            );
          })}

          {/* 9. Live Wire Dragging Preview */}
          {activeWireStart && (
            <g className="pointer-events-none">
              <path
                d={computeWirePath(activeWireStart.x, activeWireStart.y, mousePos.x, mousePos.y)}
                fill="none"
                stroke={WIRE_COLORS[currentWireColor]?.stroke || '#2563eb'}
                strokeWidth="3"
                strokeDasharray="6 3"
                className="animate-pulse"
              />
              <circle
                cx={activeWireStart.x}
                cy={activeWireStart.y}
                r="5"
                fill={WIRE_COLORS[currentWireColor]?.stroke || '#2563eb'}
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <circle
                cx={mousePos.x}
                cy={mousePos.y}
                r="5"
                fill="#ffffff"
                stroke={WIRE_COLORS[currentWireColor]?.stroke || '#2563eb'}
                strokeWidth="2"
              />
            </g>
          )}

          {/* 10. Right Digital Trainer Panel: Physical Digital I/O Terminals (D0-D7 Inputs, D8-D15 Outputs) */}
          <g transform="translate(825, 42)">
            <rect
              x="0"
              y="0"
              width="315"
              height="400"
              rx="8"
              fill="#0f172a"
              stroke="#334155"
              strokeWidth="2"
              filter="drop-shadow(0 8px 16px rgba(0,0,0,0.5))"
            />

            {/* Panel Title Bar */}
            <rect x="0" y="0" width="315" height="26" rx="8" fill="#1e293b" />
            <text x="157" y="16" fill="#f8fafc" fontSize="9.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" letterSpacing="0.8">
              PHYSICAL DIGITAL I/O TERMINALS
            </text>

            {/* SECTION 1: DIGITAL INPUTS (D0 - D7) */}
            <g transform="translate(0, 30)">
              <rect x="6" y="0" width="303" height="175" rx="5" fill="#020617" stroke="#1e293b" strokeWidth="1" />
              <text x="12" y="14" fill="#38bdf8" fontSize="8" fontWeight="bold" fontFamily="sans-serif">
                DIGITAL INPUTS (D0 – D7) • TOGGLE SWITCHES
              </text>
              <text x="210" y="14" fill="#64748b" fontSize="7" fontFamily="sans-serif">
                CLICK ● TO WIRE
              </text>

              {Array.from({ length: 8 }, (_, i) => {
                const holeId = `d${i}`;
                const isHigh = !!ioSettings.inputStates[i];
                // Y coordinate relative to (825, 42) + (0, 30): (80 + i * 26) - 42 - 30 = 8 + i * 26 + 12
                const rowY = 32 + i * 17;
                const isHoleHovered = hoveredHoleId === holeId || activeWireStart?.holeId === holeId;

                return (
                  <g key={holeId} transform={`translate(0, ${rowY})`}>
                    {/* 1. Terminal Socket Dot ● (at x: 30 inside group, which gives 825 + 30 = 855 BB_GEOM.dioInputsX) */}
                    <g
                      className="cursor-pointer"
                      onClick={(e) => handleHoleSelect(holeId, e)}
                      onMouseEnter={() => setHoveredHoleId(holeId)}
                      onMouseLeave={() => setHoveredHoleId(null)}
                    >
                      <circle
                        cx="30"
                        cy="0"
                        r={isHoleHovered ? 6.5 : 5}
                        fill="#1e293b"
                        stroke={isHoleHovered ? '#38bdf8' : '#f59e0b'}
                        strokeWidth={isHoleHovered ? 2 : 1.2}
                        filter={isHoleHovered ? 'drop-shadow(0 0 6px #38bdf8)' : undefined}
                      />
                      <circle cx="30" cy="0" r="2.2" fill={isHigh ? '#22c55e' : '#64748b'} />
                    </g>

                    {/* 2. Terminal Label */}
                    <text x="44" y="3" fill="#38bdf8" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                      D{i} ●
                    </text>

                    {/* 3. Physical Rocker Switch [0 / 1] */}
                    <g
                      transform="translate(85, -6)"
                      className="cursor-pointer"
                      onClick={() => circuitStore.toggleInput(i)}
                    >
                      <rect x="0" y="0" width="38" height="13" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1" />
                      <rect
                        x={isHigh ? 19 : 2}
                        y="1.5"
                        width="17"
                        height="10"
                        rx="2"
                        fill={isHigh ? '#22c55e' : '#475569'}
                        filter={isHigh ? 'drop-shadow(0 0 4px #22c55e)' : undefined}
                      />
                      <text
                        x={isHigh ? 27.5 : 10.5}
                        y="9"
                        fill="#ffffff"
                        fontSize="7"
                        fontWeight="bold"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {isHigh ? '1' : '0'}
                      </text>
                    </g>

                    {/* 4. Logic State Readout Badge */}
                    <rect
                      x="132"
                      y="-6"
                      width="58"
                      height="13"
                      rx="3"
                      fill={isHigh ? 'rgba(34,197,94,0.15)' : 'rgba(100,116,139,0.15)'}
                      stroke={isHigh ? '#22c55e' : '#475569'}
                      strokeWidth="0.5"
                    />
                    <text
                      x="161"
                      y="3.5"
                      fill={isHigh ? '#4ade80' : '#94a3b8'}
                      fontSize="7.5"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {isHigh ? 'HIGH (5V)' : 'LOW (0V)'}
                    </text>

                    {/* 5. Connected Status indicator */}
                    {(simulationResult.connectedNets[holeId]?.length ?? 0) > 1 ? (
                      <text x="200" y="3" fill="#a7f3d0" fontSize="7" fontFamily="sans-serif">
                        ● Connected ({simulationResult.connectedNets[holeId].length - 1} node)
                      </text>
                    ) : (
                      <text x="200" y="3" fill="#64748b" fontSize="6.5" fontFamily="sans-serif">
                        ○ Open endpoint
                      </text>
                    )}
                  </g>
                );
              })}
            </g>

            {/* SECTION 2: DIGITAL OUTPUTS (D8 - D15) */}
            <g transform="translate(0, 215)">
              <rect x="6" y="0" width="303" height="175" rx="5" fill="#020617" stroke="#1e293b" strokeWidth="1" />
              <text x="12" y="14" fill="#a78bfa" fontSize="8" fontWeight="bold" fontFamily="sans-serif">
                DIGITAL OUTPUTS (D8 – D15) • LED READERS
              </text>
              <text x="210" y="14" fill="#64748b" fontSize="7" fontFamily="sans-serif">
                CLICK ● TO WIRE
              </text>

              {Array.from({ length: 8 }, (_, idx) => {
                const i = idx + 8;
                const holeId = `d${i}`;
                const outState = simulationResult.outputStates[i] || 'FLOATING';
                const voltage = simulationResult.nodeVoltages[holeId] ?? 0;
                const rowY = 32 + idx * 17;
                const isHoleHovered = hoveredHoleId === holeId || activeWireStart?.holeId === holeId;

                return (
                  <g key={holeId} transform={`translate(0, ${rowY})`}>
                    {/* 1. Terminal Socket Dot ● (at x: 30 inside group, gives 825 + 30 = 855 BB_GEOM.dioOutputsX) */}
                    <g
                      className="cursor-pointer"
                      onClick={(e) => handleHoleSelect(holeId, e)}
                      onMouseEnter={() => setHoveredHoleId(holeId)}
                      onMouseLeave={() => setHoveredHoleId(null)}
                    >
                      <circle
                        cx="30"
                        cy="0"
                        r={isHoleHovered ? 6.5 : 5}
                        fill="#1e293b"
                        stroke={isHoleHovered ? '#a78bfa' : '#f59e0b'}
                        strokeWidth={isHoleHovered ? 2 : 1.2}
                        filter={isHoleHovered ? 'drop-shadow(0 0 6px #a78bfa)' : undefined}
                      />
                      <circle
                        cx="30"
                        cy="0"
                        r="2.2"
                        fill={outState === 'HIGH' ? '#22c55e' : outState === 'LOW' ? '#15803d' : '#eab308'}
                      />
                    </g>

                    {/* 2. Terminal Label */}
                    <text x="44" y="3" fill="#a78bfa" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                      D{i} ●
                    </text>

                    {/* 3. Physical SMT LED Indicator */}
                    <circle
                      cx="95"
                      cy="0"
                      r={outState === 'HIGH' ? 5.5 : 4.5}
                      fill={
                        outState === 'HIGH'
                          ? '#22c55e'
                          : outState === 'LOW'
                          ? '#14532d'
                          : '#334155'
                      }
                      stroke={
                        outState === 'HIGH'
                          ? '#86efac'
                          : outState === 'LOW'
                          ? '#166534'
                          : '#64748b'
                      }
                      strokeWidth="1"
                      filter={outState === 'HIGH' ? 'drop-shadow(0 0 8px #22c55e)' : undefined}
                    />

                    {/* 4. Logic State Readout Badge */}
                    <rect
                      x="115"
                      y="-6"
                      width="70"
                      height="13"
                      rx="3"
                      fill={
                        outState === 'HIGH'
                          ? 'rgba(34,197,94,0.2)'
                          : outState === 'LOW'
                          ? 'rgba(30,41,59,0.5)'
                          : 'rgba(234,179,8,0.1)'
                      }
                      stroke={
                        outState === 'HIGH'
                          ? '#22c55e'
                          : outState === 'LOW'
                          ? '#475569'
                          : '#ca8a04'
                      }
                      strokeWidth="0.5"
                    />
                    <text
                      x="150"
                      y="3.5"
                      fill={
                        outState === 'HIGH'
                          ? '#4ade80'
                          : outState === 'LOW'
                          ? '#94a3b8'
                          : '#fbbf24'
                      }
                      fontSize="7.5"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {outState === 'HIGH'
                        ? '1 (5.0V)'
                        : outState === 'LOW'
                        ? '0 (0.0V)'
                        : '○ FLOAT'}
                    </text>

                    {/* 5. Voltage Reading */}
                    <text x="195" y="3" fill="#cbd5e1" fontSize="7" fontFamily="monospace">
                      {voltage.toFixed(1)}V
                    </text>
                  </g>
                );
              })}
            </g>
          </g>

          {/* 11. Highlighted Nodes Beacon Halo (from connection checker, guided steps, or signal trace) */}
          {highlightedNodes.map((holeId) => {
            const coord = getHoleCoordinates(holeId);
            if (!coord) return null;
            return (
              <g key={`hl-${holeId}`} className="pointer-events-none">
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r="12"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r="7"
                  fill="rgba(56,189,248,0.35)"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                />
              </g>
            );
          })}

          {/* 12. Floating Hole Hover Tooltip */}
          {hoveredHoleId && (
            <g transform={`translate(${mousePos.x + 12}, ${mousePos.y - 20})`} className="pointer-events-none">
              <rect
                x="0"
                y="0"
                width={Math.max(90, formatHoleTooltip(hoveredHoleId).length * 6.8 + 16)}
                height="22"
                rx="4"
                fill="#020617"
                stroke="#38bdf8"
                strokeWidth="1"
                filter="drop-shadow(0 4px 8px rgba(0,0,0,0.6))"
              />
              <text x="8" y="14" fill="#38bdf8" fontSize="8" fontWeight="bold" fontFamily="monospace">
                {formatHoleTooltip(hoveredHoleId)}
              </text>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};
