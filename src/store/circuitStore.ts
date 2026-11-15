import { useState, useEffect, useCallback } from 'react';
import { CircuitSimState, DigitalIOSettings, LogicLevel, PlacedIC, SimulationResult, Wire, WireColor, SignalHistorySample } from '../types/circuit';
import { LAB_EXPERIMENTS } from '../data/experiments';
import { IC_DEFINITIONS } from '../data/icDefinitions';
import { DEFAULT_LAYOUT, simulateCircuit } from '../simulation/engine';

import { PRACTICAL_EXAM_IDS } from '../data/practicalExamData';

export interface CircuitState {
  placedICs: PlacedIC[];
  wires: Wire[];
  ioSettings: DigitalIOSettings;
  selectedExperimentId: string | null;
  selectedExamVariantId: string | null;
  selectedWireId: string | null;
  selectedICInstanceId: string | null;
  selectedPin: { instanceId: string; pinNumber: number } | null;
  activeWireStart: { holeId: string; x: number; y: number } | null;
  currentWireColor: WireColor;
  signalProbeMode: boolean;
  probedHoleId: string | null;
  simulationResult: SimulationResult;
  signalHistory: SignalHistorySample[];
  canUndo: boolean;
  canRedo: boolean;
  // UI & Lab Mode enhancements
  boardLocked: boolean;
  interactionMode: 'wire' | 'camera';
  viewMode: 'precision' | '3d' | 'schematic';
  labMode: 'free' | 'guided' | 'exam';
  activeTool: 'wire' | 'probe' | 'delete';
  highlightedNodes: string[];
  tracedSignalNet: string[] | null;
}

interface HistorySnapshot {
  placedICs: PlacedIC[];
  wires: Wire[];
  ioSettings: DigitalIOSettings;
  simState: CircuitSimState;
}

// Initial state
const INITIAL_IO_SETTINGS: DigitalIOSettings = {
  inputStates: [false, false, false, false, false, false, false, false],
  powerOn: true,
};

const EMPTY_SIM_STATE: CircuitSimState = { icStates: {} };

let globalState: {
  placedICs: PlacedIC[];
  wires: Wire[];
  ioSettings: DigitalIOSettings;
  selectedExperimentId: string | null;
  selectedExamVariantId: string | null;
  selectedWireId: string | null;
  selectedICInstanceId: string | null;
  selectedPin: { instanceId: string; pinNumber: number } | null;
  activeWireStart: { holeId: string; x: number; y: number } | null;
  currentWireColor: WireColor;
  signalProbeMode: boolean;
  probedHoleId: string | null;
  simState: CircuitSimState;
  simulationResult: SimulationResult;
  signalHistory: SignalHistorySample[];
  history: HistorySnapshot[];
  future: HistorySnapshot[];
  boardLocked: boolean;
  interactionMode: 'wire' | 'camera';
  viewMode: 'precision' | '3d' | 'schematic';
  labMode: 'free' | 'guided' | 'exam';
  activeTool: 'wire' | 'probe' | 'delete';
  highlightedNodes: string[];
  tracedSignalNet: string[] | null;
} = {
  placedICs: [],
  wires: [],
  ioSettings: INITIAL_IO_SETTINGS,
  selectedExperimentId: null,
  selectedExamVariantId: null,
  selectedWireId: null,
  selectedICInstanceId: null,
  selectedPin: null,
  activeWireStart: null,
  currentWireColor: 'blue',
  signalProbeMode: false,
  probedHoleId: null,
  simState: EMPTY_SIM_STATE,
  simulationResult: simulateCircuit([], [], INITIAL_IO_SETTINGS, DEFAULT_LAYOUT, EMPTY_SIM_STATE),
  signalHistory: [],
  history: [],
  future: [],
  boardLocked: true,
  interactionMode: 'wire',
  viewMode: 'precision',
  labMode: 'free',
  activeTool: 'wire',
  highlightedNodes: [],
  tracedSignalNet: null,
};

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function pushHistory() {
  globalState.history.push({
    placedICs: JSON.parse(JSON.stringify(globalState.placedICs)),
    wires: JSON.parse(JSON.stringify(globalState.wires)),
    ioSettings: JSON.parse(JSON.stringify(globalState.ioSettings)),
    simState: JSON.parse(JSON.stringify(globalState.simState)),
  });
  if (globalState.history.length > 25) {
    globalState.history.shift();
  }
  globalState.future = [];
}

function recomputeSimulation() {
  const result = simulateCircuit(
    globalState.placedICs,
    globalState.wires,
    globalState.ioSettings,
    DEFAULT_LAYOUT,
    globalState.simState
  );
  globalState.simulationResult = result;
  globalState.simState = result.nextState;

  // Append to signal history
  const inByte = globalState.ioSettings.inputStates.reduce((acc, bit, idx) => acc | ((bit ? 1 : 0) << idx), 0);
  const outByte = result.outputStates.reduce((acc, state, idx) => acc | ((state === 'HIGH' ? 1 : 0) << idx), 0);

  const formattedIn = globalState.ioSettings.inputStates.map((b) => (b ? '1' : '0')).reverse().join('');
  const formattedOut = result.outputStates.map((s) => (s === 'HIGH' ? '1' : s === 'LOW' ? '0' : 'Z')).reverse().join('');

  const newSample: SignalHistorySample = {
    timestamp: Date.now(),
    d0_7: inByte,
    d8_15: outByte,
    formattedInputs: formattedIn,
    formattedOutputs: formattedOut,
  };

  globalState.signalHistory = [newSample, ...globalState.signalHistory.slice(0, 49)];
}

export const circuitStore = {
  getState(): CircuitState {
    return {
      placedICs: globalState.placedICs,
      wires: globalState.wires,
      ioSettings: globalState.ioSettings,
      selectedExperimentId: globalState.selectedExperimentId,
      selectedExamVariantId: globalState.selectedExamVariantId,
      selectedWireId: globalState.selectedWireId,
      selectedICInstanceId: globalState.selectedICInstanceId,
      selectedPin: globalState.selectedPin,
      activeWireStart: globalState.activeWireStart,
      currentWireColor: globalState.currentWireColor,
      signalProbeMode: globalState.signalProbeMode,
      probedHoleId: globalState.probedHoleId,
      simulationResult: globalState.simulationResult,
      signalHistory: globalState.signalHistory,
      canUndo: globalState.history.length > 0,
      canRedo: globalState.future.length > 0,
      boardLocked: globalState.boardLocked,
      interactionMode: globalState.interactionMode,
      viewMode: globalState.viewMode,
      labMode: globalState.labMode,
      activeTool: globalState.activeTool,
      highlightedNodes: globalState.highlightedNodes,
      tracedSignalNet: globalState.tracedSignalNet,
    };
  },

  addIC(icDefId: string, startCol: number) {
    pushHistory();
    const def = IC_DEFINITIONS[icDefId];
    if (!def) return;
    const instanceId = `ic-${icDefId}-${Date.now().toString(36)}`;
    globalState.placedICs.push({
      instanceId,
      icDefId,
      startCol: Math.max(1, Math.min(30 - Math.floor(def.pinCount / 2) + 1, startCol)),
      rotation: 0,
    });
    globalState.selectedICInstanceId = instanceId;
    recomputeSimulation();
    notify();
  },

  removeIC(instanceId: string) {
    pushHistory();
    globalState.placedICs = globalState.placedICs.filter((ic) => ic.instanceId !== instanceId);
    if (globalState.selectedICInstanceId === instanceId) {
      globalState.selectedICInstanceId = null;
    }
    recomputeSimulation();
    notify();
  },

  rotateIC(instanceId: string) {
    pushHistory();
    const ic = globalState.placedICs.find((item) => item.instanceId === instanceId);
    if (ic) {
      ic.rotation = ic.rotation === 0 ? 180 : 0;
      recomputeSimulation();
      notify();
    }
  },

  moveIC(instanceId: string, newCol: number) {
    pushHistory();
    const ic = globalState.placedICs.find((item) => item.instanceId === instanceId);
    if (ic) {
      const def = IC_DEFINITIONS[ic.icDefId];
      const maxCol = 30 - Math.floor((def?.pinCount || 14) / 2) + 1;
      ic.startCol = Math.max(1, Math.min(maxCol, newCol));
      recomputeSimulation();
      notify();
    }
  },

  startWire(holeId: string, x: number, y: number) {
    globalState.activeWireStart = { holeId, x, y };
    notify();
  },

  completeWire(toHoleId: string) {
    if (!globalState.activeWireStart) return;
    const fromHoleId = globalState.activeWireStart.holeId;

    if (fromHoleId !== toHoleId) {
      pushHistory();
      const newWire: Wire = {
        id: `w-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
        fromHoleId,
        toHoleId,
        color: globalState.currentWireColor,
      };
      globalState.wires.push(newWire);
      globalState.selectedWireId = newWire.id;
    }

    globalState.activeWireStart = null;
    recomputeSimulation();
    notify();
  },

  addWire(fromHoleId: string, toHoleId: string, color?: WireColor) {
    if (fromHoleId === toHoleId) return;
    pushHistory();
    const newWire: Wire = {
      id: `w-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      fromHoleId,
      toHoleId,
      color: color || globalState.currentWireColor,
    };
    globalState.wires.push(newWire);
    globalState.selectedWireId = newWire.id;
    recomputeSimulation();
    notify();
  },

  cancelWire() {
    globalState.activeWireStart = null;
    notify();
  },

  deleteWire(wireId: string) {
    pushHistory();
    globalState.wires = globalState.wires.filter((w) => w.id !== wireId);
    if (globalState.selectedWireId === wireId) {
      globalState.selectedWireId = null;
    }
    recomputeSimulation();
    notify();
  },

  setSelectedWire(wireId: string | null) {
    globalState.selectedWireId = wireId;
    if (wireId) {
      globalState.selectedICInstanceId = null;
      globalState.selectedPin = null;
    }
    notify();
  },

  setSelectedIC(instanceId: string | null) {
    globalState.selectedICInstanceId = instanceId;
    if (instanceId) {
      globalState.selectedWireId = null;
      globalState.selectedPin = null;
    }
    notify();
  },

  setSelectedPin(pin: { instanceId: string; pinNumber: number } | null) {
    globalState.selectedPin = pin;
    if (pin) {
      globalState.selectedWireId = null;
      globalState.selectedICInstanceId = null;
    }
    notify();
  },

  setWireColor(color: WireColor) {
    globalState.currentWireColor = color;
    if (globalState.selectedWireId) {
      const w = globalState.wires.find((item) => item.id === globalState.selectedWireId);
      if (w) {
        pushHistory();
        w.color = color;
      }
    }
    notify();
  },

  toggleInput(index: number) {
    if (index >= 0 && index < 8) {
      pushHistory();
      const updated = [...globalState.ioSettings.inputStates];
      updated[index] = !updated[index];
      globalState.ioSettings = { ...globalState.ioSettings, inputStates: updated };
      recomputeSimulation();
      notify();
    }
  },

  setInputBit(index: number, value: boolean, recordHistory: boolean = true) {
    if (index >= 0 && index < 8) {
      if (globalState.ioSettings.inputStates[index] === value) return;
      if (recordHistory) pushHistory();
      const updated = [...globalState.ioSettings.inputStates];
      updated[index] = value;
      globalState.ioSettings = { ...globalState.ioSettings, inputStates: updated };
      recomputeSimulation();
      notify();
    }
  },

  setInputBits(updates: Record<number, boolean>, recordHistory: boolean = true) {
    const entries = Object.entries(updates);
    if (entries.length === 0) return;
    const updated = [...globalState.ioSettings.inputStates];
    let changed = false;
    for (const [idxStr, val] of entries) {
      const idx = Number(idxStr);
      if (idx >= 0 && idx < 8 && updated[idx] !== val) {
        updated[idx] = val;
        changed = true;
      }
    }
    if (!changed) return;
    if (recordHistory) pushHistory();
    globalState.ioSettings = { ...globalState.ioSettings, inputStates: updated };
    recomputeSimulation();
    notify();
  },

  setInputByte(byteVal: number) {
    pushHistory();
    const clamped = Math.max(0, Math.min(255, byteVal));
    const bits = Array.from({ length: 8 }, (_, i) => Boolean((clamped >> i) & 1));
    globalState.ioSettings = { ...globalState.ioSettings, inputStates: bits };
    recomputeSimulation();
    notify();
  },

  togglePower() {
    pushHistory();
    globalState.ioSettings = {
      ...globalState.ioSettings,
      powerOn: !globalState.ioSettings.powerOn,
    };
    recomputeSimulation();
    notify();
  },

  resetInputs() {
    pushHistory();
    globalState.ioSettings = {
      ...globalState.ioSettings,
      inputStates: [false, false, false, false, false, false, false, false],
    };
    recomputeSimulation();
    notify();
  },

  resetCircuit() {
    pushHistory();
    globalState.placedICs = [];
    globalState.wires = [];
    globalState.selectedWireId = null;
    globalState.selectedICInstanceId = null;
    globalState.activeWireStart = null;
    globalState.probedHoleId = null;
    globalState.ioSettings = { ...INITIAL_IO_SETTINGS };
    globalState.simState = { icStates: {} };
    recomputeSimulation();
    notify();
  },

  loadExperiment(expId: string, loadReference: boolean = false, variantId?: string | null) {
    pushHistory();
    globalState.selectedExperimentId = expId;
    const exp = LAB_EXPERIMENTS.find((e) => e.id === expId);
    const activeVariant =
      exp?.variants && exp.variants.length > 0
        ? exp.variants.find((v) => v.id === variantId) || exp.variants[0]
        : null;
    globalState.selectedExamVariantId = activeVariant ? activeVariant.id : null;

    const refToLoad = activeVariant?.referenceCircuit ?? exp?.referenceCircuit;
    if (loadReference && refToLoad) {
      globalState.placedICs = JSON.parse(JSON.stringify(refToLoad.ics));
      globalState.wires = JSON.parse(JSON.stringify(refToLoad.wires));
      globalState.ioSettings = { ...INITIAL_IO_SETTINGS };
      globalState.simState = { icStates: {} };
    }
    recomputeSimulation();
    notify();
  },

  loadCircuitJson(data: { placedICs: PlacedIC[]; wires: Wire[]; ioSettings?: DigitalIOSettings; selectedExperimentId?: string }) {
    pushHistory();
    if (Array.isArray(data.placedICs)) {
      globalState.placedICs = data.placedICs;
    }
    if (Array.isArray(data.wires)) {
      globalState.wires = data.wires;
    }
    if (data.ioSettings) {
      globalState.ioSettings = data.ioSettings;
    }
    if (data.selectedExperimentId) {
      globalState.selectedExperimentId = data.selectedExperimentId;
    }
    globalState.simState = { icStates: {} };
    recomputeSimulation();
    notify();
  },

  undo() {
    if (globalState.history.length === 0) return;
    const prev = globalState.history.pop()!;
    globalState.future.push({
      placedICs: JSON.parse(JSON.stringify(globalState.placedICs)),
      wires: JSON.parse(JSON.stringify(globalState.wires)),
      ioSettings: JSON.parse(JSON.stringify(globalState.ioSettings)),
      simState: JSON.parse(JSON.stringify(globalState.simState)),
    });
    globalState.placedICs = prev.placedICs;
    globalState.wires = prev.wires;
    globalState.ioSettings = prev.ioSettings;
    globalState.simState = prev.simState;
    recomputeSimulation();
    notify();
  },

  redo() {
    if (globalState.future.length === 0) return;
    const next = globalState.future.pop()!;
    globalState.history.push({
      placedICs: JSON.parse(JSON.stringify(globalState.placedICs)),
      wires: JSON.parse(JSON.stringify(globalState.wires)),
      ioSettings: JSON.parse(JSON.stringify(globalState.ioSettings)),
      simState: JSON.parse(JSON.stringify(globalState.simState)),
    });
    globalState.placedICs = next.placedICs;
    globalState.wires = next.wires;
    globalState.ioSettings = next.ioSettings;
    globalState.simState = next.simState;
    recomputeSimulation();
    notify();
  },

  setSignalProbeMode(enabled: boolean) {
    globalState.signalProbeMode = enabled;
    if (!enabled) globalState.probedHoleId = null;
    notify();
  },

  probeHole(holeId: string | null) {
    globalState.probedHoleId = holeId;
    notify();
  },

  setBoardLocked(locked: boolean) {
    globalState.boardLocked = locked;
    notify();
  },

  toggleBoardLock() {
    globalState.boardLocked = !globalState.boardLocked;
    globalState.interactionMode = globalState.boardLocked ? 'wire' : 'camera';
    notify();
  },

  setInteractionMode(mode: 'wire' | 'camera') {
    globalState.interactionMode = mode;
    notify();
  },

  setViewMode(mode: 'precision' | '3d' | 'schematic') {
    globalState.viewMode = mode;
    notify();
  },

  setLabMode(mode: 'free' | 'guided' | 'exam') {
    globalState.labMode = mode;
    if (mode === 'exam') {
      const isPractical =
        globalState.selectedExperimentId && PRACTICAL_EXAM_IDS.includes(globalState.selectedExperimentId);
      if (!isPractical) {
        const firstId = PRACTICAL_EXAM_IDS[0];
        globalState.selectedExperimentId = firstId;
        const exp = LAB_EXPERIMENTS.find((e) => e.id === firstId);
        globalState.selectedExamVariantId = exp?.variants?.[0]?.id ?? null;
      } else if (!globalState.selectedExamVariantId) {
        const exp = LAB_EXPERIMENTS.find((e) => e.id === globalState.selectedExperimentId);
        globalState.selectedExamVariantId = exp?.variants?.[0]?.id ?? null;
      }
    }
    notify();
  },

  setSelectedExamVariant(variantId: string | null) {
    globalState.selectedExamVariantId = variantId;
    notify();
  },

  setActiveTool(tool: 'wire' | 'probe' | 'delete') {
    globalState.activeTool = tool;
    if (tool === 'probe') {
      globalState.signalProbeMode = true;
    } else {
      globalState.signalProbeMode = false;
      globalState.probedHoleId = null;
    }
    notify();
  },

  setHighlightedNodes(nodes: string[]) {
    globalState.highlightedNodes = nodes;
    notify();
  },

  traceSignalFromNode(nodeId: string) {
    const net = globalState.simulationResult.connectedNets[nodeId] || [nodeId];
    globalState.tracedSignalNet = net;
    globalState.highlightedNodes = net;
    notify();
  },

  clearTrace() {
    globalState.tracedSignalNet = null;
    globalState.highlightedNodes = [];
    notify();
  },

  setSelectedExperiment(expId: string) {
    globalState.selectedExperimentId = expId;
    const exp = LAB_EXPERIMENTS.find((e) => e.id === expId);
    globalState.selectedExamVariantId = exp?.variants?.[0]?.id ?? null;
    notify();
  },
};

export function useCircuitStore(): CircuitState {
  const [state, setState] = useState<CircuitState>(circuitStore.getState());

  useEffect(() => {
    const handleUpdate = () => {
      setState(circuitStore.getState());
    };
    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  return state;
}
