import React from 'react';
import { useCircuitStore } from '../../store/circuitStore';
import { IC_DEFINITIONS } from '../../data/icDefinitions';
import { Network, AlertCircle } from 'lucide-react';

export const SchematicView: React.FC = () => {
  const { placedICs, wires, ioSettings, simulationResult } = useCircuitStore();

  return (
    <div id="schematic-view-container" className="w-full h-[520px] bg-[#0b1120] border-2 border-slate-700/80 rounded-xl p-6 overflow-auto shadow-2xl flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-blue-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Logic Circuit Schematic
          </h2>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <span>ICs: {placedICs.length}</span>
          <span>Wires: {wires.length}</span>
        </div>
      </div>

      {placedICs.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 gap-2">
          <AlertCircle className="w-8 h-8 text-slate-600" />
          <p className="font-semibold text-slate-400">Breadboard is Empty</p>
          <p className="text-xs max-w-sm">
            Place TTL ICs and connect wires on the physical breadboard to view their schematic diagram.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {placedICs.map((ic) => {
            const def = IC_DEFINITIONS[ic.icDefId];
            if (!def) return null;

            return (
              <div
                key={ic.instanceId}
                className="bg-slate-900 border border-slate-700/80 rounded-xl p-4 shadow-md flex flex-col gap-3"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-mono font-extrabold text-base text-blue-400">
                    {def.partNumber}
                  </span>
                  <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                    {def.name}
                  </span>
                </div>

                {/* Gates or functional blocks */}
                <div className="space-y-2">
                  {def.gates ? (
                    def.gates.map((gate) => (
                      <div
                        key={gate.gateIndex}
                        className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between text-xs font-mono"
                      >
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-blue-600/30 text-blue-300 font-bold">
                            {gate.type}
                          </span>
                          <span className="text-slate-400">Gate {gate.gateIndex}</span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="text-slate-500">
                            IN: [{gate.inputs.join(', ')}]
                          </span>
                          <span className="text-emerald-400 font-bold">
                            OUT: Pin {gate.output}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs text-slate-300">
                      <p className="font-semibold text-blue-300 mb-1">MSI Functional Block</p>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{def.description}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
