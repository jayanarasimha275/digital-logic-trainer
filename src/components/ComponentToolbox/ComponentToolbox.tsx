import React, { useState } from 'react';
import { circuitStore, useCircuitStore } from '../../store/circuitStore';
import { IC_DEFINITIONS } from '../../data/icDefinitions';
import { Plus, AlertTriangle, CheckCircle, ShieldAlert, Layers } from 'lucide-react';

export const ComponentToolbox: React.FC = () => {
  const { placedICs, simulationResult } = useCircuitStore();
  const [activeTab, setActiveTab] = useState<'all' | 'gates' | 'msi'>('all');

  const handleAddIC = (icId: string) => {
    // Find a clean starting column on breadboard not already colliding with existing ICs
    const def = IC_DEFINITIONS[icId];
    if (!def) return;
    const chipWidth = Math.floor(def.pinCount / 2);

    let targetCol = 4;
    // Offset target col if another IC is already in that spot
    const occupiedCols = placedICs.map((i) => i.startCol);
    while (occupiedCols.some((c) => Math.abs(c - targetCol) < chipWidth + 2) && targetCol < 22) {
      targetCol += chipWidth + 2;
    }

    circuitStore.addIC(icId, targetCol);
  };

  const icList = Object.values(IC_DEFINITIONS).filter((ic) => {
    if (activeTab === 'gates') return ic.category === 'Gates';
    if (activeTab === 'msi') return ic.category !== 'Gates';
    return true;
  });

  return (
    <aside id="component-toolbox" className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full select-none">
      {/* Sidebar Header */}
      <div className="p-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" />
          <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            IC Component Library
          </h2>
        </div>
        <p className="text-[10px] text-slate-400 mt-0.5">Verified Standard TTL DIP Packages</p>

        {/* Filter Category Tabs */}
        <div className="flex items-center gap-1 mt-2 bg-slate-950 p-0.5 rounded border border-slate-800 text-[11px]">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-0.5 rounded font-semibold transition cursor-pointer ${
              activeTab === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('gates')}
            className={`flex-1 py-0.5 rounded font-semibold transition cursor-pointer ${
              activeTab === 'gates' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Gates
          </button>
          <button
            onClick={() => setActiveTab('msi')}
            className={`flex-1 py-0.5 rounded font-semibold transition cursor-pointer ${
              activeTab === 'msi' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            MSI ICs
          </button>
        </div>
      </div>

      {/* IC Components Scroll Area */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
        {icList.map((ic) => {
          const isPlaced = placedICs.some((item) => item.icDefId === ic.id);

          return (
            <div
              key={ic.id}
              id={`toolbox-ic-${ic.id}`}
              className="bg-slate-950/70 border border-slate-800 hover:border-blue-500/60 rounded-lg p-2.5 transition flex flex-col gap-1.5 shadow-sm group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-extrabold text-sm text-blue-300 group-hover:text-blue-200">
                    {ic.id}
                  </span>
                  <span className="text-[9px] bg-slate-800 text-slate-400 px-1 py-0.5 rounded font-mono">
                    {ic.package}
                  </span>
                </div>
                {isPlaced && (
                  <span className="text-[9px] text-emerald-400 font-mono font-semibold flex items-center gap-0.5">
                    <CheckCircle className="w-2.5 h-2.5" /> Placed
                  </span>
                )}
              </div>

              <p className="text-xs font-medium text-slate-200">{ic.name}</p>
              <p className="text-[10px] text-slate-400 leading-tight line-clamp-2">{ic.description}</p>

              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono">
                <span>VCC: #{ic.vccPin} | GND: #{ic.gndPin}</span>
                <button
                  onClick={() => handleAddIC(ic.id)}
                  id={`btn-place-ic-${ic.id}`}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Place
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Diagnostics / Status Summary Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-xs">
        <div className="flex items-center justify-between font-semibold">
          <span className="text-[10px] uppercase tracking-wider text-slate-400">Circuit Diagnostics</span>
          {simulationResult.errors.length > 0 ? (
            <span className="flex items-center gap-1 text-[10px] text-red-400 font-bold">
              <ShieldAlert className="w-3 h-3" /> {simulationResult.errors.length} Errors
            </span>
          ) : simulationResult.warnings.length > 0 ? (
            <span className="flex items-center gap-1 text-[10px] text-amber-400 font-bold">
              <AlertTriangle className="w-3 h-3" /> {simulationResult.warnings.length} Warnings
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
              <CheckCircle className="w-3 h-3" /> No Faults
            </span>
          )}
        </div>
      </div>
    </aside>
  );
};
