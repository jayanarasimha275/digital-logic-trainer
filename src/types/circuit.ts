export type LogicLevel = 'LOW' | 'HIGH' | 'FLOATING' | 'ERROR';

export type WireColor = 'red' | 'black' | 'blue' | 'green' | 'yellow' | 'orange' | 'purple' | 'white';

export interface Wire {
  id: string;
  fromHoleId: string;
  toHoleId: string;
  color: WireColor;
  label?: string;
}

export type BreadboardRow = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J';

export interface BreadboardHoleInfo {
  id: string;
  type: 'tie_point' | 'power_rail' | 'terminal';
  row?: BreadboardRow;
  col?: number;
  rail?: 'top_plus' | 'top_minus' | 'bot_plus' | 'bot_minus';
  terminalId?: string; // 'vcc_src' | 'gnd_src' | 'd0'..'d15'
  x: number;
  y: number;
}

export interface PlacedIC {
  instanceId: string;
  icDefId: string; // e.g. '7408', '7486'
  startCol: number; // column where pin 1 starts (e.g. 5)
  rotation: 0 | 180; // 0 = standard notch left, 180 = notch right
}

export interface DigitalIOSettings {
  inputStates: boolean[]; // D0 - D7 (true = 1 / HIGH, false = 0 / LOW)
  powerOn: boolean; // Main power supply switch (+5V)
}

export interface SimulationResult {
  nodeStates: Record<string, LogicLevel>; // Hole ID / Net ID -> LogicLevel
  nodeVoltages: Record<string, number>; // in Volts (e.g. 5.0, 0.0, NaN)
  outputStates: LogicLevel[]; // D8 - D15 / DIO 8 - 15
  outputVoltages: number[]; // D8 - D15 / DIO 8 - 15
  userLedStates: boolean[]; // On-board User LEDs: LED 0 - LED 7 (as shown in NI ELVIS II photo)
  icPowerStatus: Record<string, { vccOk: boolean; gndOk: boolean; error?: string }>;
  connectedNets: Record<string, string[]>; // Map node ID -> list of all electrically connected node IDs
  errors: CircuitDiagnostic[];
  warnings: CircuitDiagnostic[];
}

export interface CircuitDiagnostic {
  id: string;
  type: 'power_error' | 'floating_input' | 'contention' | 'short_circuit' | 'unconnected' | 'wrong_output' | 'missing_ic' | 'invalid_wiring';
  severity: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  targetHoleId?: string;
  targetICInstanceId?: string;
  targetPinNumber?: number;
  suggestedFix?: string;
  suggestedHoles?: string[];
}

export interface ConnectionCheckResult {
  passed: boolean;
  score: number; // 0 - 100%
  checks: {
    id: string;
    label: string;
    passed: boolean;
    details?: string;
    severity?: 'error' | 'warning' | 'info';
    suggestedFix?: string;
    highlightNodes?: string[];
  }[];
  truthTableResults?: {
    testCaseId: string;
    inputs: Record<string, number>;
    expected: Record<string, number>;
    actual: Record<string, number>;
    passed: boolean;
  }[];
}

export interface GuidedStep {
  stepNumber: number;
  title: string;
  description: string;
  actionType: 'place_ic' | 'wire' | 'test';
  highlightHoles?: string[];
  targetCol?: number;
  icDefId?: string;
  fromHole?: string;
  toHole?: string;
  isComplete: boolean;
}

export interface SignalHistorySample {
  timestamp: number;
  d0_7: number; // 8-bit byte (0-255)
  d8_15: number; // 8-bit byte (0-255)
  formattedInputs: string;
  formattedOutputs: string;
}
