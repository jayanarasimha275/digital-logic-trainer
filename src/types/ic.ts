import { LogicLevel } from './circuit';

export type PinType = 'INPUT' | 'OUTPUT' | 'POWER' | 'ENABLE';

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

export interface ICDefinition {
  id: string; // e.g. '7408'
  partNumber: string; // e.g. 'SN74LS08N'
  name: string; // 'Quad 2-Input AND Gate'
  category: 'Gates' | 'Arithmetic' | 'MUX/DEMUX' | 'Decoders/Encoders';
  package: 'DIP-14' | 'DIP-16';
  pinCount: 14 | 16;
  vccPin: number;
  gndPin: number;
  pins: ICPinDef[];
  gates?: GateDef[];
  description: string;
  datasheetRef: string;
  // Custom evaluator for complex MSI ICs (like 74138, 74148, 74153, 74139)
  evaluateCustom?: (inputLevels: Record<number, LogicLevel>) => Record<number, LogicLevel>;
}
