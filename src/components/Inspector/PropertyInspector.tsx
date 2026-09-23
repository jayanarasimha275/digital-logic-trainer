import React, { useState } from 'react';
import { circuitStore, useCircuitStore } from '../../store/circuitStore';
import { IC_DEFINITIONS } from '../../data/icDefinitions';
import { WireColor } from '../../types/circuit';
import { formatNodeLabel } from '../../simulation/engine';
import { ConnectionCheckerTab } from './ConnectionCheckerTab';
import {
  RotateCw,
  Trash2,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Zap,
  Info,
  Network,
  Activity,
  ArrowRight,
  SlidersHorizontal,
  CheckCircle2,
} from 'lucide-react';

const WIRE_COLORS: { color: WireColor; hex: string }[] = [
  { color: 'red', hex: '#ef4444' },
  { color: 'black', hex: '#0f172a' },
  { color: 'blue', hex: '#3b82f6' },
  { color: 'green', hex: '#10b981' },
  { color: 'yellow', hex: '#eab308' },
  { color: 'orange', hex: '#f97316' },
  { color: 'purple', hex: '#a855f7' },
  { color: 'white', hex: '#f8fafc' },
];

export const PropertyInspector: React.FC = () => {
  const {
    placedICs,
    wires,
    selectedICInstanceId,
    selectedWireId,
    selectedPin,
    simulationResult,
    ioSettings,
  } = useCircuitStore();

  const [activeTab, setActiveTab] = useState<'inspector' | 'checker'>('inspector');

  const selectedIC = placedICs.find((i) => i.instanceId === selectedICInstanceId);
  const selectedWire = wires.find((w) => w.id === selectedWireId);
  const icDef = selectedIC ? IC_DEFINITIONS[selectedIC.icDefId] : null;
  const pwrStatus = selectedIC ? simulationResult.icPowerStatus[selectedIC.instanceId] : null;

  // Pin Inspector Details
  const pinIC = selectedPin ? placedICs.find((i) => i.instanceId === selectedPin.instanceId) : null;
  const pinICDef = pinIC ? IC_DEFINITIONS[pinIC.icDefId] : null;
  const pinDef = pinICDef?.pins.find((p) => p.number === selectedPin?.pinNumber);
  const pinNodeId = selectedPin ? `ic-${selectedPin.instanceId}-pin-${selectedPin.pinNumber}` : null;
  const pinState = pinNodeId ? (simulationResult.nodeStates[pinNodeId] ?? 'FLOATING') : 'FLOATING';
  const pinVoltage = pinNodeId ? (simulationResult.nodeVoltages[pinNodeId] ?? 0.0) : 0.0;
  const pinConnectedNet = pinNodeId ? (simulationResult.connectedNets[pinNodeId] || [pinNodeId]) : [];

  return (
    <aside id="property-inspector" className="w-84 bg-slate-900 border-l border-slate-800 flex flex-col h-full select-none text-xs">
      {/* Header Tabs */}
      <div className="p-2 border-b border-slate-800 bg-slate-950/60">
        <div className="grid grid-cols-2 gap-1 p-0.5 bg-slate-900 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('inspector')}
            className={`py-1.5 px-2 rounded-md font-semibold text-[11px] flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'inspector'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Inspector</span>
          </button>
          <button
            onClick={() => setActiveTab('checker')}
            className={`py-1.5 px-2 rounded-md font-semibold text-[11px] flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'checker'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Check Circuit</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3.5">
        {activeTab === 'checker' ? (
          <ConnectionCheckerTab />
        ) : (
          <>
            {/* CASE 1: Specific IC Pin Selected (Connection Inspector) */}
            {selectedPin && pinIC && pinICDef && pinDef ? (
              <div className="space-y-3">
                <div className="bg-slate-950/90 border border-yellow-500/60 rounded-lg p-3 space-y-2.5 shadow-lg">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-yellow-400" />
                      <span className="font-bold text-yellow-400 uppercase tracking-wider text-[11px]">
                        PIN CONNECTION INSPECTOR
                      </span>
                    </div>
                    <button
                      onClick={() => circuitStore.setSelectedPin(null)}
                      className="text-[10px] text-slate-400 hover:text-slate-200 px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 cursor-pointer"
                    >
                      Close
                    </button>
                  </div>

                  {/* Pin Header Info */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono font-extrabold text-sm text-slate-100">
                        Pin {pinDef.number}: {pinDef.name}
                      </span>
                      <p className="text-[11px] text-slate-400">
                        {pinICDef.partNumber} ({pinICDef.name})
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                      pinDef.type === 'INPUT' ? 'bg-blue-900/60 text-blue-300 border border-blue-500/40' :
                      pinDef.type === 'OUTPUT' ? 'bg-purple-900/60 text-purple-300 border border-purple-500/40' :
                      pinDef.type === 'POWER' ? 'bg-red-900/60 text-red-300 border border-red-500/40' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {pinDef.type}
                    </span>
                  </div>

                  {pinDef.description && (
                    <p className="text-[10.5px] text-slate-300 bg-slate-900/80 p-2 rounded border border-slate-800">
                      {pinDef.description}
                    </p>
                  )}

                  {/* Live Electrical Readings */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="bg-slate-900/90 border border-slate-800 rounded p-2 text-center">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                        Logic State
                      </span>
                      <span className={`text-sm font-extrabold font-mono ${
                        pinState === 'HIGH' ? 'text-emerald-400' : pinState === 'LOW' ? 'text-slate-300' : 'text-amber-400'
                      }`}>
                        {pinState}
                      </span>
                    </div>
                    <div className="bg-slate-900/90 border border-slate-800 rounded p-2 text-center">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                        Voltage Level
                      </span>
                      <span className="text-sm font-extrabold font-mono text-cyan-400">
                        {pinVoltage.toFixed(2)} V
                      </span>
                    </div>
                  </div>

                  {/* Connected Electrical Net */}
                  <div className="pt-2 border-t border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <Network className="w-3 h-3 text-blue-400" />
                        Connected Net ({pinConnectedNet.length} Nodes)
                      </span>
                      <button
                        onClick={() => circuitStore.traceSignalFromNode(pinNodeId!)}
                        className="text-[9.5px] text-cyan-300 hover:text-cyan-200 flex items-center gap-0.5 font-mono cursor-pointer"
                        title="Highlight full signal path on breadboard"
                      >
                        <Zap className="w-2.5 h-2.5" /> Trace Net
                      </button>
                    </div>
                    <div className="max-h-36 overflow-y-auto space-y-1 font-mono text-[10.5px] bg-slate-900/70 p-2 rounded border border-slate-800/80">
                      {pinConnectedNet.length > 0 ? (
                        pinConnectedNet.map((node) => (
                          <div key={node} className="flex items-center gap-1.5 text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                            <span className="truncate">{formatNodeLabel(node)}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-500 italic">Isolated node (No wires connected)</span>
                      )}
                    </div>
                  </div>

                  {/* Inspect Full IC button */}
                  <button
                    onClick={() => {
                      circuitStore.setSelectedPin(null);
                      circuitStore.setSelectedIC(pinIC.instanceId);
                    }}
                    className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-semibold text-center cursor-pointer transition"
                  >
                    Inspect Entire {pinICDef.partNumber} IC
                  </button>
                </div>
              </div>
            ) : selectedIC && icDef ? (
              /* CASE 2: Selected IC */
              <div className="space-y-3">
                {/* IC Overview Card */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-extrabold text-sm text-yellow-400">
                      {icDef.partNumber}
                    </span>
                    <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                      Col {selectedIC.startCol}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-200">{icDef.name}</p>
                  <p className="text-[11px] text-slate-400 leading-tight">{icDef.description}</p>

                  {/* Power Supply Status Card */}
                  <div className="pt-2 border-t border-slate-800/80 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Power Supply Check
                    </span>
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span>Pin {icDef.vccPin} (VCC):</span>
                      {pwrStatus?.vccOk ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> +5V Connected
                        </span>
                      ) : (
                        <span className="text-red-400 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Unconnected
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span>Pin {icDef.gndPin} (GND):</span>
                      {pwrStatus?.gndOk ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> GND (0V) Connected
                        </span>
                      ) : (
                        <span className="text-red-400 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Unconnected
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions: Rotate & Delete */}
                  <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => circuitStore.rotateIC(selectedIC.instanceId)}
                      className="flex-1 py-1 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-center flex items-center justify-center gap-1 cursor-pointer font-semibold"
                      title="Rotate 180° (R key)"
                    >
                      <RotateCw className="w-3 h-3" /> Rotate 180° (R)
                    </button>
                    <button
                      onClick={() => circuitStore.removeIC(selectedIC.instanceId)}
                      className="py-1 px-2.5 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 rounded flex items-center justify-center cursor-pointer"
                      title="Remove IC (Del key)"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Real-time Pin State Table (Clickable for Connection Inspector) */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2.5">
                  <div className="flex items-center justify-between mb-1.5 px-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Live Pin Voltages & States
                    </span>
                    <span className="text-[9px] text-blue-400">Click to inspect</span>
                  </div>
                  <div className="max-h-56 overflow-y-auto font-mono text-[11px] space-y-1">
                    {icDef.pins.map((pin) => {
                      const pNodeId = `ic-${selectedIC.instanceId}-pin-${pin.number}`;
                      const state = simulationResult.nodeStates[pNodeId] ?? 'FLOATING';
                      const voltage = simulationResult.nodeVoltages[pNodeId] ?? 0.0;

                      return (
                        <div
                          key={pin.number}
                          onClick={() => circuitStore.setSelectedPin({ instanceId: selectedIC.instanceId, pinNumber: pin.number })}
                          className="flex items-center justify-between p-1.5 rounded hover:bg-slate-800/80 border border-transparent hover:border-slate-700 cursor-pointer transition"
                          title="Click to inspect this pin's electrical net and connections"
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-slate-500 font-bold w-4 text-right">{pin.number}</span>
                            <span className="font-semibold text-slate-200 truncate">{pin.name}</span>
                            <span className="text-[9px] text-slate-500 uppercase">({pin.type.slice(0, 3)})</span>
                          </div>
                          <div className="flex items-center gap-2 text-right">
                            <span className="text-[10px] text-slate-400">{voltage.toFixed(1)}V</span>
                            <span className={`font-bold ${state === 'HIGH' ? 'text-emerald-400' : state === 'LOW' ? 'text-slate-400' : 'text-amber-400'}`}>
                              {state}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : selectedWire ? (
              /* CASE 3: Selected Wire (Connection Inspector) */
              <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-2.5 shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="font-mono font-bold text-slate-200 uppercase flex items-center gap-1.5">
                    <Network className="w-3.5 h-3.5 text-blue-400" />
                    WIRE CONNECTION INSPECTOR
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{selectedWire.id}</span>
                </div>

                {/* Endpoints */}
                <div className="space-y-1.5 font-mono text-slate-300 bg-slate-900/80 p-2 rounded border border-slate-800">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500">From:</span>
                    <span className="font-bold text-blue-400 text-right">{formatNodeLabel(selectedWire.fromHoleId)}</span>
                  </div>
                  <div className="flex justify-center text-slate-600">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500">To:</span>
                    <span className="font-bold text-emerald-400 text-right">{formatNodeLabel(selectedWire.toHoleId)}</span>
                  </div>
                </div>

                {/* Wire Live Readings */}
                {(() => {
                  const wState = simulationResult.nodeStates[selectedWire.fromHoleId] ?? 'FLOATING';
                  const wVolt = simulationResult.nodeVoltages[selectedWire.fromHoleId] ?? 0.0;
                  const wNet = simulationResult.connectedNets[selectedWire.fromHoleId] || [selectedWire.fromHoleId, selectedWire.toHoleId];

                  return (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-900/90 border border-slate-800 rounded p-2 text-center">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                            Net State
                          </span>
                          <span className={`text-sm font-extrabold font-mono ${
                            wState === 'HIGH' ? 'text-emerald-400' : wState === 'LOW' ? 'text-slate-300' : 'text-amber-400'
                          }`}>
                            {wState}
                          </span>
                        </div>
                        <div className="bg-slate-900/90 border border-slate-800 rounded p-2 text-center">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                            Net Voltage
                          </span>
                          <span className="text-sm font-extrabold font-mono text-cyan-400">
                            {wVolt.toFixed(2)} V
                          </span>
                        </div>
                      </div>

                      {/* Connected Net List */}
                      <div className="pt-2 border-t border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                            <Network className="w-3 h-3 text-blue-400" />
                            Connected Net ({wNet.length})
                          </span>
                          <button
                            onClick={() => circuitStore.traceSignalFromNode(selectedWire.fromHoleId)}
                            className="text-[9.5px] text-cyan-300 hover:text-cyan-200 flex items-center gap-0.5 font-mono cursor-pointer"
                            title="Highlight full signal path on breadboard"
                          >
                            <Zap className="w-2.5 h-2.5" /> Trace Net
                          </button>
                        </div>
                        <div className="max-h-28 overflow-y-auto space-y-1 font-mono text-[10.5px] bg-slate-900/70 p-2 rounded border border-slate-800/80">
                          {wNet.map((node) => (
                            <div key={node} className="flex items-center gap-1.5 text-slate-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                              <span className="truncate">{formatNodeLabel(node)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  );
                })()}

                {/* Wire Color Switcher */}
                <div className="pt-2 border-t border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Change Wire Color
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {WIRE_COLORS.map(({ color, hex }) => (
                      <button
                        key={color}
                        onClick={() => circuitStore.setWireColor(color)}
                        className={`w-5 h-5 rounded-full border transition-transform cursor-pointer ${
                          selectedWire.color === color ? 'scale-125 ring-2 ring-yellow-400' : 'border-slate-600'
                        }`}
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => circuitStore.deleteWire(selectedWire.id)}
                  className="w-full py-1.5 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 rounded flex items-center justify-center gap-1 cursor-pointer font-semibold transition mt-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Wire (Del)
                </button>
              </div>
            ) : (
              /* CASE 4: Empty Selection */
              <div className="bg-slate-950/40 border border-dashed border-slate-800 rounded-lg p-4 text-center text-slate-500 space-y-2">
                <Info className="w-5 h-5 mx-auto text-slate-600" />
                <p className="font-semibold text-slate-300">Ready for Inspection</p>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Click any IC pin, jumper wire, or chip on the breadboard to inspect live logic states, voltage, and electrical net connectivity.
                </p>
                <div className="pt-2 border-t border-slate-800/80 text-left font-mono text-[10.5px] space-y-1 text-slate-400">
                  <div className="flex justify-between">
                    <span>Placed ICs:</span>
                    <span className="text-slate-200 font-bold">{placedICs.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Jumper Wires:</span>
                    <span className="text-slate-200 font-bold">{wires.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Trainer Power:</span>
                    <span className={ioSettings.powerOn ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                      {ioSettings.powerOn ? 'ON (+5.0V)' : 'OFF'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
};
