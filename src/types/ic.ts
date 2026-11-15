import { LogicLevel } from './circuit';

export type PinType = 'INPUT' | 'OUTPUT' | 'POWER' | 'ENABLE' | 'NC';

export interface ICPinDef {
  number: number;
  name: string;
  type: PinType;
  description: string;
  inverted?: boolean;
}

export interface GateDef {
  gateIndex: number;
  inputs: number[]; // Pin numbers
  output: number; // Pin number
  type: 'NAND' | 'NOR' | 'NOT' | 'AND' | 'OR' | 'XOR' | 'CUSTOM';
}

export interface ICInternalState {
  registers: Record<string, number>;
  prevClocks: Record<number, LogicLevel>;
  prevOutputs: Record<number, LogicLevel>;
}

export interface SequentialEvalResult {
  outputs: Record<number, LogicLevel>;
  nextRegisters: Record<string, number>;
}

export interface ICDefinition {
  id: string; // e.g. '7408'
  partNumber: string; // e.g. 'SN74LS08N'
  name: string; // 'Quad 2-Input AND Gate'
  category: 'Gates' | 'Arithmetic' | 'MUX/DEMUX' | 'Decoders/Encoders' | 'Flip-Flops' | 'Counters';
  package: 'DIP-14' | 'DIP-16';
  pinCount: 14 | 16;
  vccPin: number;
  gndPin: number;
  pins: ICPinDef[];
  gates?: GateDef[];
  description: string;
  datasheetRef: string;
  isSequential?: boolean;
  // Custom evaluator for combinational MSI ICs (like 74138, 74148, 74153, 74139, 7485)
  evaluateCustom?: (inputLevels: Record<number, LogicLevel>) => Record<number, LogicLevel>;
  // Sequential evaluator for clocked/latched ICs (like 7474, 7476, 7490)
  evaluateSequential?: (
    inputLevels: Record<number, LogicLevel>,
    state: ICInternalState
  ) => SequentialEvalResult;
}
