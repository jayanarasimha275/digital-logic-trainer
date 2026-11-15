import { PlacedIC, Wire } from './circuit';

export interface TruthTableRow {
  id: string;
  inputs: Record<string, number>; // e.g. { A: 0, B: 1 } or { D0: 0, D1: 1 }
  expectedOutputs: Record<string, number>; // e.g. { SUM: 1, CARRY: 0 }
}

export interface SequentialStep {
  id: string;
  label: string;
  inputs: Record<string, number>;
  expectedOutputs: Record<string, number>;
  resetState?: boolean;
}

export interface PinMapping {
  inputNames: Record<string, string>; // e.g. { A: 'D0', B: 'D1', Cin: 'D2' }
  outputNames: Record<string, string>; // e.g. { SUM: 'D8', CARRY: 'D9' }
}

export interface ExperimentVariant {
  id: string;
  label: string;
  description: string;
  suggestedICs: string[];
  pinMapping: PinMapping;
  truthTable: TruthTableRow[];
  connectionInstructions?: ConnectionInstruction[];
  referenceCircuit: {
    ics: PlacedIC[];
    wires: Wire[];
  };
}

export interface ConnectionInstruction {
  signal: string;
  from: string;
  to: string;
  notes?: string;
}

export interface ClockConfig {
  clkChannel: number; // D0..D7 index
  clkLabel: string;
  resetChannel?: number; // D0..D7 index
  resetLabel?: string;
  resetActiveLow?: boolean;
  preChannel?: number; // optional PRE' channel to hold HIGH during reset
  activeEdge: 'rising' | 'falling' | 'level';
}

export interface VivaQuestion {
  question: string;
  answer: string;
}

export interface ExperimentDef {
  id: string;
  number: string;
  title: string;
  aim: string;
  components: string[];
  theory: string;
  discrepancyNote?: string;
  procedure: string[];
  suggestedICs: string[];
  pinMapping: PinMapping;
  truthTable: TruthTableRow[];
  sequentialTests?: SequentialStep[];
  schematicAscii?: string;
  variants?: ExperimentVariant[];
  // Reference circuit for [LOAD REFERENCE CIRCUIT]
  referenceCircuit: {
    ics: PlacedIC[];
    wires: Wire[];
  };
}

export interface PracticalExamSupplement {
  examNumber: number; // 1..12
  examTitle: string;
  icSubtitle: string;
  apparatus: string[];
  connectionInstructions: ConnectionInstruction[];
  clockConfig?: ClockConfig;
  resultStatement: string;
  vivaQuestions: VivaQuestion[];
}
