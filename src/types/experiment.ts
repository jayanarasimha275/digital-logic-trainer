import { LogicLevel, PlacedIC, Wire } from './circuit';

export interface TruthTableRow {
  id: string;
  inputs: Record<string, number>; // e.g. { A: 0, B: 1 } or { D0: 0, D1: 1 }
  expectedOutputs: Record<string, number>; // e.g. { SUM: 1, CARRY: 0 }
}

export interface PinMapping {
  inputNames: Record<string, string>; // e.g. { A: 'D0', B: 'D1', Cin: 'D2' }
  outputNames: Record<string, string>; // e.g. { SUM: 'D8', CARRY: 'D9' }
}

export interface ExperimentDef {
  id: string;
  number: string;
  title: string;
  aim: string;
  components: string[];
  theory: string;
  procedure: string[];
  suggestedICs: string[];
  pinMapping: PinMapping;
  truthTable: TruthTableRow[];
  schematicAscii?: string;
  // Reference circuit for [LOAD REFERENCE CIRCUIT]
  referenceCircuit: {
    ics: PlacedIC[];
    wires: Wire[];
  };
}
