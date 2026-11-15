import { ICDefinition } from '../types/ic';
import { LogicLevel } from '../types/circuit';

export const IC_DEFINITIONS: Record<string, ICDefinition> = {
  // -------------------------------------------------------------
  // 7400: Quad 2-Input NAND Gate (DIP-14)
  // Datasheet reference: TI SN74LS00 / SN7400
  // -------------------------------------------------------------
  '7400': {
    id: '7400',
    partNumber: 'SN74LS00N',
    name: 'Quad 2-Input NAND Gate',
    category: 'Gates',
    package: 'DIP-14',
    pinCount: 14,
    vccPin: 14,
    gndPin: 7,
    description: 'Contains four independent 2-input positive-NAND logic gates.',
    datasheetRef: 'Texas Instruments SN74LS00 / Standard TTL Pinout',
    pins: [
      { number: 1, name: '1A', type: 'INPUT', description: 'Gate 1 Input A' },
      { number: 2, name: '1B', type: 'INPUT', description: 'Gate 1 Input B' },
      { number: 3, name: '1Y', type: 'OUTPUT', description: 'Gate 1 Output (NAND)' },
      { number: 4, name: '2A', type: 'INPUT', description: 'Gate 2 Input A' },
      { number: 5, name: '2B', type: 'INPUT', description: 'Gate 2 Input B' },
      { number: 6, name: '2Y', type: 'OUTPUT', description: 'Gate 2 Output (NAND)' },
      { number: 7, name: 'GND', type: 'POWER', description: 'Ground (0V)' },
      { number: 8, name: '3Y', type: 'OUTPUT', description: 'Gate 3 Output (NAND)' },
      { number: 9, name: '3A', type: 'INPUT', description: 'Gate 3 Input A' },
      { number: 10, name: '3B', type: 'INPUT', description: 'Gate 3 Input B' },
      { number: 11, name: '4Y', type: 'OUTPUT', description: 'Gate 4 Output (NAND)' },
      { number: 12, name: '4A', type: 'INPUT', description: 'Gate 4 Input A' },
      { number: 13, name: '4B', type: 'INPUT', description: 'Gate 4 Input B' },
      { number: 14, name: 'VCC', type: 'POWER', description: 'Supply Voltage (+5V)' },
    ],
    gates: [
      { gateIndex: 1, inputs: [1, 2], output: 3, type: 'NAND' },
      { gateIndex: 2, inputs: [4, 5], output: 6, type: 'NAND' },
      { gateIndex: 3, inputs: [9, 10], output: 8, type: 'NAND' },
      { gateIndex: 4, inputs: [12, 13], output: 11, type: 'NAND' },
    ],
  },

  // -------------------------------------------------------------
  // 7402: Quad 2-Input NOR Gate (DIP-14)
  // Datasheet reference: TI SN74LS02
  // Note: Output pins are 1, 4, 10, 13 (Standard 7402 pinout!)
  // -------------------------------------------------------------
  '7402': {
    id: '7402',
    partNumber: 'SN74LS02N',
    name: 'Quad 2-Input NOR Gate',
    category: 'Gates',
    package: 'DIP-14',
    pinCount: 14,
    vccPin: 14,
    gndPin: 7,
    description: 'Contains four independent 2-input positive-NOR logic gates. Outputs on pins 1, 4, 10, 13.',
    datasheetRef: 'Texas Instruments SN74LS02 Pinout',
    pins: [
      { number: 1, name: '1Y', type: 'OUTPUT', description: 'Gate 1 Output (NOR)' },
      { number: 2, name: '1A', type: 'INPUT', description: 'Gate 1 Input A' },
      { number: 3, name: '1B', type: 'INPUT', description: 'Gate 1 Input B' },
      { number: 4, name: '2Y', type: 'OUTPUT', description: 'Gate 2 Output (NOR)' },
      { number: 5, name: '2A', type: 'INPUT', description: 'Gate 2 Input A' },
      { number: 6, name: '2B', type: 'INPUT', description: 'Gate 2 Input B' },
      { number: 7, name: 'GND', type: 'POWER', description: 'Ground (0V)' },
      { number: 8, name: '3A', type: 'INPUT', description: 'Gate 3 Input A' },
      { number: 9, name: '3B', type: 'INPUT', description: 'Gate 3 Input B' },
      { number: 10, name: '3Y', type: 'OUTPUT', description: 'Gate 3 Output (NOR)' },
      { number: 11, name: '4A', type: 'INPUT', description: 'Gate 4 Input A' },
      { number: 12, name: '4B', type: 'INPUT', description: 'Gate 4 Input B' },
      { number: 13, name: '4Y', type: 'OUTPUT', description: 'Gate 4 Output (NOR)' },
      { number: 14, name: 'VCC', type: 'POWER', description: 'Supply Voltage (+5V)' },
    ],
    gates: [
      { gateIndex: 1, inputs: [2, 3], output: 1, type: 'NOR' },
      { gateIndex: 2, inputs: [5, 6], output: 4, type: 'NOR' },
      { gateIndex: 3, inputs: [8, 9], output: 10, type: 'NOR' },
      { gateIndex: 4, inputs: [11, 12], output: 13, type: 'NOR' },
    ],
  },

  // -------------------------------------------------------------
  // 7404: Hex Inverter / NOT Gate (DIP-14)
  // Datasheet reference: TI SN74LS04
  // -------------------------------------------------------------
  '7404': {
    id: '7404',
    partNumber: 'SN74LS04N',
    name: 'Hex Inverter (NOT)',
    category: 'Gates',
    package: 'DIP-14',
    pinCount: 14,
    vccPin: 14,
    gndPin: 7,
    description: 'Contains six independent inverter (NOT) logic circuits.',
    datasheetRef: 'Texas Instruments SN74LS04 Pinout',
    pins: [
      { number: 1, name: '1A', type: 'INPUT', description: 'Inverter 1 Input' },
      { number: 2, name: '1Y', type: 'OUTPUT', description: 'Inverter 1 Output' },
      { number: 3, name: '2A', type: 'INPUT', description: 'Inverter 2 Input' },
      { number: 4, name: '2Y', type: 'OUTPUT', description: 'Inverter 2 Output' },
      { number: 5, name: '3A', type: 'INPUT', description: 'Inverter 3 Input' },
      { number: 6, name: '3Y', type: 'OUTPUT', description: 'Inverter 3 Output' },
      { number: 7, name: 'GND', type: 'POWER', description: 'Ground (0V)' },
      { number: 8, name: '4Y', type: 'OUTPUT', description: 'Inverter 4 Output' },
      { number: 9, name: '4A', type: 'INPUT', description: 'Inverter 4 Input' },
      { number: 10, name: '5Y', type: 'OUTPUT', description: 'Inverter 5 Output' },
      { number: 11, name: '5A', type: 'INPUT', description: 'Inverter 5 Input' },
      { number: 12, name: '6Y', type: 'OUTPUT', description: 'Inverter 6 Output' },
      { number: 13, name: '6A', type: 'INPUT', description: 'Inverter 6 Input' },
      { number: 14, name: 'VCC', type: 'POWER', description: 'Supply Voltage (+5V)' },
    ],
    gates: [
      { gateIndex: 1, inputs: [1], output: 2, type: 'NOT' },
      { gateIndex: 2, inputs: [3], output: 4, type: 'NOT' },
      { gateIndex: 3, inputs: [5], output: 6, type: 'NOT' },
      { gateIndex: 4, inputs: [9], output: 8, type: 'NOT' },
      { gateIndex: 5, inputs: [11], output: 10, type: 'NOT' },
      { gateIndex: 6, inputs: [13], output: 12, type: 'NOT' },
    ],
  },

  // -------------------------------------------------------------
  // 7408: Quad 2-Input AND Gate (DIP-14)
  // Datasheet reference: TI SN74LS08
  // -------------------------------------------------------------
  '7408': {
    id: '7408',
    partNumber: 'SN74LS08N',
    name: 'Quad 2-Input AND Gate',
    category: 'Gates',
    package: 'DIP-14',
    pinCount: 14,
    vccPin: 14,
    gndPin: 7,
    description: 'Contains four independent 2-input positive-AND logic gates.',
    datasheetRef: 'Texas Instruments SN74LS08 Pinout',
    pins: [
      { number: 1, name: '1A', type: 'INPUT', description: 'Gate 1 Input A' },
      { number: 2, name: '1B', type: 'INPUT', description: 'Gate 1 Input B' },
      { number: 3, name: '1Y', type: 'OUTPUT', description: 'Gate 1 Output (AND)' },
      { number: 4, name: '2A', type: 'INPUT', description: 'Gate 2 Input A' },
      { number: 5, name: '2B', type: 'INPUT', description: 'Gate 2 Input B' },
      { number: 6, name: '2Y', type: 'OUTPUT', description: 'Gate 2 Output (AND)' },
      { number: 7, name: 'GND', type: 'POWER', description: 'Ground (0V)' },
      { number: 8, name: '3Y', type: 'OUTPUT', description: 'Gate 3 Output (AND)' },
      { number: 9, name: '3A', type: 'INPUT', description: 'Gate 3 Input A' },
      { number: 10, name: '3B', type: 'INPUT', description: 'Gate 3 Input B' },
      { number: 11, name: '4Y', type: 'OUTPUT', description: 'Gate 4 Output (AND)' },
      { number: 12, name: '4A', type: 'INPUT', description: 'Gate 4 Input A' },
      { number: 13, name: '4B', type: 'INPUT', description: 'Gate 4 Input B' },
      { number: 14, name: 'VCC', type: 'POWER', description: 'Supply Voltage (+5V)' },
    ],
    gates: [
      { gateIndex: 1, inputs: [1, 2], output: 3, type: 'AND' },
      { gateIndex: 2, inputs: [4, 5], output: 6, type: 'AND' },
      { gateIndex: 3, inputs: [9, 10], output: 8, type: 'AND' },
      { gateIndex: 4, inputs: [12, 13], output: 11, type: 'AND' },
    ],
  },

  // -------------------------------------------------------------
  // 7432: Quad 2-Input OR Gate (DIP-14)
  // Datasheet reference: TI SN74LS32
  // -------------------------------------------------------------
  '7432': {
    id: '7432',
    partNumber: 'SN74LS32N',
    name: 'Quad 2-Input OR Gate',
    category: 'Gates',
    package: 'DIP-14',
    pinCount: 14,
    vccPin: 14,
    gndPin: 7,
    description: 'Contains four independent 2-input positive-OR logic gates.',
    datasheetRef: 'Texas Instruments SN74LS32 Pinout',
    pins: [
      { number: 1, name: '1A', type: 'INPUT', description: 'Gate 1 Input A' },
      { number: 2, name: '1B', type: 'INPUT', description: 'Gate 1 Input B' },
      { number: 3, name: '1Y', type: 'OUTPUT', description: 'Gate 1 Output (OR)' },
      { number: 4, name: '2A', type: 'INPUT', description: 'Gate 2 Input A' },
      { number: 5, name: '2B', type: 'INPUT', description: 'Gate 2 Input B' },
      { number: 6, name: '2Y', type: 'OUTPUT', description: 'Gate 2 Output (OR)' },
      { number: 7, name: 'GND', type: 'POWER', description: 'Ground (0V)' },
      { number: 8, name: '3Y', type: 'OUTPUT', description: 'Gate 3 Output (OR)' },
      { number: 9, name: '3A', type: 'INPUT', description: 'Gate 3 Input A' },
      { number: 10, name: '3B', type: 'INPUT', description: 'Gate 3 Input B' },
      { number: 11, name: '4Y', type: 'OUTPUT', description: 'Gate 4 Output (OR)' },
      { number: 12, name: '4A', type: 'INPUT', description: 'Gate 4 Input A' },
      { number: 13, name: '4B', type: 'INPUT', description: 'Gate 4 Input B' },
      { number: 14, name: 'VCC', type: 'POWER', description: 'Supply Voltage (+5V)' },
    ],
    gates: [
      { gateIndex: 1, inputs: [1, 2], output: 3, type: 'OR' },
      { gateIndex: 2, inputs: [4, 5], output: 6, type: 'OR' },
      { gateIndex: 3, inputs: [9, 10], output: 8, type: 'OR' },
      { gateIndex: 4, inputs: [12, 13], output: 11, type: 'OR' },
    ],
  },

  // -------------------------------------------------------------
  // 7486: Quad 2-Input XOR Gate (DIP-14)
  // Datasheet reference: TI SN74LS86
  // -------------------------------------------------------------
  '7486': {
    id: '7486',
    partNumber: 'SN74LS86N',
    name: 'Quad 2-Input XOR Gate',
    category: 'Gates',
    package: 'DIP-14',
    pinCount: 14,
    vccPin: 14,
    gndPin: 7,
    description: 'Contains four independent 2-input Exclusive-OR logic gates.',
    datasheetRef: 'Texas Instruments SN74LS86 Pinout',
    pins: [
      { number: 1, name: '1A', type: 'INPUT', description: 'Gate 1 Input A' },
      { number: 2, name: '1B', type: 'INPUT', description: 'Gate 1 Input B' },
      { number: 3, name: '1Y', type: 'OUTPUT', description: 'Gate 1 Output (XOR)' },
      { number: 4, name: '2A', type: 'INPUT', description: 'Gate 2 Input A' },
      { number: 5, name: '2B', type: 'INPUT', description: 'Gate 2 Input B' },
      { number: 6, name: '2Y', type: 'OUTPUT', description: 'Gate 2 Output (XOR)' },
      { number: 7, name: 'GND', type: 'POWER', description: 'Ground (0V)' },
      { number: 8, name: '3Y', type: 'OUTPUT', description: 'Gate 3 Output (XOR)' },
      { number: 9, name: '3A', type: 'INPUT', description: 'Gate 3 Input A' },
      { number: 10, name: '3B', type: 'INPUT', description: 'Gate 3 Input B' },
      { number: 11, name: '4Y', type: 'OUTPUT', description: 'Gate 4 Output (XOR)' },
      { number: 12, name: '4A', type: 'INPUT', description: 'Gate 4 Input A' },
      { number: 13, name: '4B', type: 'INPUT', description: 'Gate 4 Input B' },
      { number: 14, name: 'VCC', type: 'POWER', description: 'Supply Voltage (+5V)' },
    ],
    gates: [
      { gateIndex: 1, inputs: [1, 2], output: 3, type: 'XOR' },
      { gateIndex: 2, inputs: [4, 5], output: 6, type: 'XOR' },
      { gateIndex: 3, inputs: [9, 10], output: 8, type: 'XOR' },
      { gateIndex: 4, inputs: [12, 13], output: 11, type: 'XOR' },
    ],
  },

  // -------------------------------------------------------------
  // 74138: 3-to-8 Line Decoder / Demultiplexer (DIP-16)
  // Datasheet reference: TI SN74LS138
  // Pins:
  // 1: A, 2: B, 3: C, 4: G2A'(low), 5: G2B'(low), 6: G1(high)
  // 7: Y7', 8: GND, 9: Y6', 10: Y5', 11: Y4', 12: Y3', 13: Y2', 14: Y1', 15: Y0', 16: VCC
  // -------------------------------------------------------------
  '74138': {
    id: '74138',
    partNumber: 'SN74LS138N',
    name: '3-to-8 Line Decoder/Demux',
    category: 'Decoders/Encoders',
    package: 'DIP-16',
    pinCount: 16,
    vccPin: 16,
    gndPin: 8,
    description: 'Decodes a 3-bit binary address (A, B, C) into one of 8 active-low outputs (Y0\'-Y7\').',
    datasheetRef: 'Texas Instruments SN74LS138 Standard Pinout',
    pins: [
      { number: 1, name: 'A', type: 'INPUT', description: 'Address Select A (LSB)' },
      { number: 2, name: 'B', type: 'INPUT', description: 'Address Select B' },
      { number: 3, name: 'C', type: 'INPUT', description: 'Address Select C (MSB)' },
      { number: 4, name: 'G2A\'', type: 'ENABLE', description: 'Active-Low Enable 2A', inverted: true },
      { number: 5, name: 'G2B\'', type: 'ENABLE', description: 'Active-Low Enable 2B', inverted: true },
      { number: 6, name: 'G1', type: 'ENABLE', description: 'Active-High Enable 1' },
      { number: 7, name: 'Y7\'', type: 'OUTPUT', description: 'Active-Low Output 7', inverted: true },
      { number: 8, name: 'GND', type: 'POWER', description: 'Ground (0V)' },
      { number: 9, name: 'Y6\'', type: 'OUTPUT', description: 'Active-Low Output 6', inverted: true },
      { number: 10, name: 'Y5\'', type: 'OUTPUT', description: 'Active-Low Output 5', inverted: true },
      { number: 11, name: 'Y4\'', type: 'OUTPUT', description: 'Active-Low Output 4', inverted: true },
      { number: 12, name: 'Y3\'', type: 'OUTPUT', description: 'Active-Low Output 3', inverted: true },
      { number: 13, name: 'Y2\'', type: 'OUTPUT', description: 'Active-Low Output 2', inverted: true },
      { number: 14, name: 'Y1\'', type: 'OUTPUT', description: 'Active-Low Output 1', inverted: true },
      { number: 15, name: 'Y0\'', type: 'OUTPUT', description: 'Active-Low Output 0', inverted: true },
      { number: 16, name: 'VCC', type: 'POWER', description: 'Supply Voltage (+5V)' },
    ],
    evaluateCustom: (levels) => {
      const g1 = levels[6];
      const g2a = levels[4];
      const g2b = levels[5];
      const a = levels[1];
      const b = levels[2];
      const c = levels[3];

      // Default all active-low outputs to HIGH
      const outputs: Record<number, LogicLevel> = {
        15: 'HIGH', // Y0'
        14: 'HIGH', // Y1'
        13: 'HIGH', // Y2'
        12: 'HIGH', // Y3'
        11: 'HIGH', // Y4'
        10: 'HIGH', // Y5'
        9: 'HIGH',  // Y6'
        7: 'HIGH',  // Y7'
      };

      // If any enable is in its disabling state, all outputs are unconditionally HIGH
      if (g1 === 'LOW' || g2a === 'HIGH' || g2b === 'HIGH') {
        return outputs;
      }

      if (g1 === 'FLOATING' || g2a === 'FLOATING' || g2b === 'FLOATING') {
        Object.keys(outputs).forEach((k) => (outputs[Number(k)] = 'FLOATING'));
        return outputs;
      }

      if (a === 'FLOATING' || b === 'FLOATING' || c === 'FLOATING') {
        Object.keys(outputs).forEach((k) => (outputs[Number(k)] = 'FLOATING'));
        return outputs;
      }

      const bitA = a === 'HIGH' ? 1 : 0;
      const bitB = b === 'HIGH' ? 1 : 0;
      const bitC = c === 'HIGH' ? 1 : 0;
      const selectedIndex = bitC * 4 + bitB * 2 + bitA;

      const pinMap: Record<number, number> = {
        0: 15, // Y0
        1: 14, // Y1
        2: 13, // Y2
        3: 12, // Y3
        4: 11, // Y4
        5: 10, // Y5
        6: 9,  // Y6
        7: 7,  // Y7
      };

      const targetPin = pinMap[selectedIndex];
      if (targetPin) {
        outputs[targetPin] = 'LOW'; // Active LOW output
      }

      return outputs;
    },
  },

  // -------------------------------------------------------------
  // 74148: 8-to-3 Line Priority Encoder (DIP-16)
  // Datasheet reference: TI SN74LS148 & SRM AP CSE 207 Manual p.18-19
  // Pins: 1=4', 2=5', 3=6', 4=7', 5=EI', 6=A2', 7=A1', 8=GND,
  //       9=A0', 10=0', 11=1', 12=2', 13=3', 14=GS', 15=EO', 16=VCC
  // -------------------------------------------------------------
  '74148': {
    id: '74148',
    partNumber: 'SN74LS148N',
    name: '8-to-3 Priority Encoder',
    category: 'Decoders/Encoders',
    package: 'DIP-16',
    pinCount: 16,
    vccPin: 16,
    gndPin: 8,
    description: 'Encodes 8 active-low data inputs (0\'-7\') to 3-bit active-low binary code (A2\',A1\',A0\') with priority (7\' highest).',
    datasheetRef: 'Texas Instruments SN74LS148 / SRM AP Manual p.18-19',
    pins: [
      { number: 1, name: '4\'', type: 'INPUT', description: 'Data Input 4 (Active-Low)', inverted: true },
      { number: 2, name: '5\'', type: 'INPUT', description: 'Data Input 5 (Active-Low)', inverted: true },
      { number: 3, name: '6\'', type: 'INPUT', description: 'Data Input 6 (Active-Low)', inverted: true },
      { number: 4, name: '7\'', type: 'INPUT', description: 'Data Input 7 (Highest Priority, Active-Low)', inverted: true },
      { number: 5, name: 'EI\'', type: 'ENABLE', description: 'Enable Input (Active-Low)', inverted: true },
      { number: 6, name: 'A2\'', type: 'OUTPUT', description: 'Address Output A2 (Active-Low)', inverted: true },
      { number: 7, name: 'A1\'', type: 'OUTPUT', description: 'Address Output A1 (Active-Low)', inverted: true },
      { number: 8, name: 'GND', type: 'POWER', description: 'Ground (0V)' },
      { number: 9, name: 'A0\'', type: 'OUTPUT', description: 'Address Output A0 (Active-Low)', inverted: true },
      { number: 10, name: '0\'', type: 'INPUT', description: 'Data Input 0 (Lowest Priority, Active-Low)', inverted: true },
      { number: 11, name: '1\'', type: 'INPUT', description: 'Data Input 1 (Active-Low)', inverted: true },
      { number: 12, name: '2\'', type: 'INPUT', description: 'Data Input 2 (Active-Low)', inverted: true },
      { number: 13, name: '3\'', type: 'INPUT', description: 'Data Input 3 (Active-Low)', inverted: true },
      { number: 14, name: 'GS\'', type: 'OUTPUT', description: 'Group Signal (Active-Low when enabled & any input active)', inverted: true },
      { number: 15, name: 'EO\'', type: 'OUTPUT', description: 'Enable Output (Active-Low when enabled & all inputs inactive)', inverted: true },
      { number: 16, name: 'VCC', type: 'POWER', description: 'Supply Voltage (+5V)' },
    ],
    evaluateCustom: (levels) => {
      const ei = levels[5];
      const outputs: Record<number, LogicLevel> = {
        6: 'HIGH',  // A2'
        7: 'HIGH',  // A1'
        9: 'HIGH',  // A0'
        14: 'HIGH', // GS'
        15: 'HIGH', // EO'
      };

      if (ei === 'FLOATING') {
        Object.keys(outputs).forEach((k) => (outputs[Number(k)] = 'FLOATING'));
        return outputs;
      }

      if (ei !== 'LOW') {
        // Disabled (EI' = HIGH): all outputs remain HIGH (inactive)
        return outputs;
      }

      // Input pins (highest priority first): 7'->pin 4, 6'->pin 3, 5'->pin 2, 4'->pin 1, 3'->pin 13, 2'->pin 12, 1'->pin 11, 0'->pin 10
      const inputPinOrder = [
        { index: 7, pin: 4 },
        { index: 6, pin: 3 },
        { index: 5, pin: 2 },
        { index: 4, pin: 1 },
        { index: 3, pin: 13 },
        { index: 2, pin: 12 },
        { index: 1, pin: 11 },
        { index: 0, pin: 10 },
      ];

      let highestActive = -1;
      let anyDriven = false;
      for (const item of inputPinOrder) {
        const lvl = levels[item.pin];
        if (lvl === 'HIGH' || lvl === 'LOW') {
          anyDriven = true;
        }
        if (lvl === 'LOW') {
          highestActive = item.index;
          break;
        }
      }

      if (highestActive === -1) {
        if (!anyDriven) {
          Object.keys(outputs).forEach((k) => (outputs[Number(k)] = 'FLOATING'));
          return outputs;
        }
        // Enabled and no input active (all HIGH)
        outputs[15] = 'LOW';  // EO' goes LOW
        outputs[14] = 'HIGH'; // GS' stays HIGH
        outputs[6] = 'HIGH';
        outputs[7] = 'HIGH';
        outputs[9] = 'HIGH';
      } else {
        outputs[14] = 'LOW';  // GS' goes LOW (group signal active)
        outputs[15] = 'HIGH'; // EO' stays HIGH

        outputs[6] = (highestActive & 4) !== 0 ? 'LOW' : 'HIGH';
        outputs[7] = (highestActive & 2) !== 0 ? 'LOW' : 'HIGH';
        outputs[9] = (highestActive & 1) !== 0 ? 'LOW' : 'HIGH';
      }

      return outputs;
    },
  },

  // -------------------------------------------------------------
  // 74153: Dual 4-to-1 Data Selector / Multiplexer (DIP-16)
  // Datasheet reference: TI SN74LS153
  // Common selects: S0 = pin 14 (A), S1 = pin 2 (B)
  // MUX 1: 1G'=pin 1, 1C0=pin 6, 1C1=pin 5, 1C2=pin 4, 1C3=pin 3, 1Y=pin 7
  // MUX 2: 2G'=pin 15, 2C0=pin 10, 2C1=pin 11, 2C2=pin 12, 2C3=pin 13, 2Y=pin 9
  // -------------------------------------------------------------
  '74153': {
    id: '74153',
    partNumber: 'SN74LS153N',
    name: 'Dual 4:1 Data Selector / MUX',
    category: 'MUX/DEMUX',
    package: 'DIP-16',
    pinCount: 16,
    vccPin: 16,
    gndPin: 8,
    description: 'Dual 4-line to 1-line multiplexer with common select inputs (A, B) and individual strobes.',
    datasheetRef: 'Texas Instruments SN74LS153 Pinout',
    pins: [
      { number: 1, name: '1G\'', type: 'ENABLE', description: 'Strobe 1 (Active-Low)', inverted: true },
      { number: 2, name: 'B', type: 'INPUT', description: 'Common Select S1 (MSB)' },
      { number: 3, name: '1C3', type: 'INPUT', description: 'MUX 1 Input 3' },
      { number: 4, name: '1C2', type: 'INPUT', description: 'MUX 1 Input 2' },
      { number: 5, name: '1C1', type: 'INPUT', description: 'MUX 1 Input 1' },
      { number: 6, name: '1C0', type: 'INPUT', description: 'MUX 1 Input 0' },
      { number: 7, name: '1Y', type: 'OUTPUT', description: 'MUX 1 Output' },
      { number: 8, name: 'GND', type: 'POWER', description: 'Ground (0V)' },
      { number: 9, name: '2Y', type: 'OUTPUT', description: 'MUX 2 Output' },
      { number: 10, name: '2C0', type: 'INPUT', description: 'MUX 2 Input 0' },
      { number: 11, name: '2C1', type: 'INPUT', description: 'MUX 2 Input 1' },
      { number: 12, name: '2C2', type: 'INPUT', description: 'MUX 2 Input 2' },
      { number: 13, name: '2C3', type: 'INPUT', description: 'MUX 2 Input 3' },
      { number: 14, name: 'A', type: 'INPUT', description: 'Common Select S0 (LSB)' },
      { number: 15, name: '2G\'', type: 'ENABLE', description: 'Strobe 2 (Active-Low)', inverted: true },
      { number: 16, name: 'VCC', type: 'POWER', description: 'Supply Voltage (+5V)' },
    ],
    evaluateCustom: (levels) => {
      const s0 = levels[14]; // A
      const s1 = levels[2];  // B

      const outputs: Record<number, LogicLevel> = {
        7: 'LOW', // 1Y
        9: 'LOW', // 2Y
      };

      const evalSection = (g: LogicLevel, dataPins: Record<number, number>): LogicLevel => {
        if (g === 'HIGH') return 'LOW';
        if (g === 'FLOATING') return 'FLOATING';
        if (s0 === 'FLOATING' || s1 === 'FLOATING') return 'FLOATING';
        const selIdx = (s1 === 'HIGH' ? 2 : 0) + (s0 === 'HIGH' ? 1 : 0);
        const selectedPin = dataPins[selIdx];
        return levels[selectedPin] ?? 'FLOATING';
      };

      outputs[7] = evalSection(levels[1], { 0: 6, 1: 5, 2: 4, 3: 3 });
      outputs[9] = evalSection(levels[15], { 0: 10, 1: 11, 2: 12, 3: 13 });

      return outputs;
    },
  },

  // -------------------------------------------------------------
  // 74139: Dual 2-to-4 Line Decoder / Demultiplexer (DIP-16)
  // Datasheet reference: TI SN74LS139
  // Section 1: 1G'=pin 1, 1A=pin 2, 1B=pin 3, 1Y0'=pin 4, 1Y1'=pin 5, 1Y2'=pin 6, 1Y3'=pin 7
  // Section 2: 2G'=pin 15, 2A=pin 14, 2B=pin 13, 2Y0'=pin 12, 2Y1'=pin 11, 2Y2'=pin 10, 2Y3'=pin 9
  // -------------------------------------------------------------
  '74139': {
    id: '74139',
    partNumber: 'SN74LS139N',
    name: 'Dual 2-to-4 Line Decoder/Demux',
    category: 'Decoders/Encoders',
    package: 'DIP-16',
    pinCount: 16,
    vccPin: 16,
    gndPin: 8,
    description: 'Dual independent 2-to-4 line decoders / demultiplexers with active-low enables and outputs.',
    datasheetRef: 'Texas Instruments SN74LS139 Pinout',
    pins: [
      { number: 1, name: '1G\'', type: 'ENABLE', description: 'Enable 1 (Active-Low)', inverted: true },
      { number: 2, name: '1A', type: 'INPUT', description: 'Section 1 Select A (LSB)' },
      { number: 3, name: '1B', type: 'INPUT', description: 'Section 1 Select B (MSB)' },
      { number: 4, name: '1Y0\'', type: 'OUTPUT', description: 'Section 1 Output 0 (Active-Low)', inverted: true },
      { number: 5, name: '1Y1\'', type: 'OUTPUT', description: 'Section 1 Output 1 (Active-Low)', inverted: true },
      { number: 6, name: '1Y2\'', type: 'OUTPUT', description: 'Section 1 Output 2 (Active-Low)', inverted: true },
      { number: 7, name: '1Y3\'', type: 'OUTPUT', description: 'Section 1 Output 3 (Active-Low)', inverted: true },
      { number: 8, name: 'GND', type: 'POWER', description: 'Ground (0V)' },
      { number: 9, name: '2Y3\'', type: 'OUTPUT', description: 'Section 2 Output 3 (Active-Low)', inverted: true },
      { number: 10, name: '2Y2\'', type: 'OUTPUT', description: 'Section 2 Output 2 (Active-Low)', inverted: true },
      { number: 11, name: '2Y1\'', type: 'OUTPUT', description: 'Section 2 Output 1 (Active-Low)', inverted: true },
      { number: 12, name: '2Y0\'', type: 'OUTPUT', description: 'Section 2 Output 0 (Active-Low)', inverted: true },
      { number: 13, name: '2B', type: 'INPUT', description: 'Section 2 Select B (MSB)' },
      { number: 14, name: '2A', type: 'INPUT', description: 'Section 2 Select A (LSB)' },
      { number: 15, name: '2G\'', type: 'ENABLE', description: 'Enable 2 (Active-Low)', inverted: true },
      { number: 16, name: 'VCC', type: 'POWER', description: 'Supply Voltage (+5V)' },
    ],
    evaluateCustom: (levels) => {
      const outputs: Record<number, LogicLevel> = {
        4: 'HIGH', // 1Y0'
        5: 'HIGH', // 1Y1'
        6: 'HIGH', // 1Y2'
        7: 'HIGH', // 1Y3'
        12: 'HIGH', // 2Y0'
        11: 'HIGH', // 2Y1'
        10: 'HIGH', // 2Y2'
        9: 'HIGH',  // 2Y3'
      };

      // Section 1
      const g1 = levels[1];
      const a1 = levels[2];
      const b1 = levels[3];
      if (g1 === 'FLOATING') {
        outputs[4] = outputs[5] = outputs[6] = outputs[7] = 'FLOATING';
      } else if (g1 === 'LOW') {
        if (a1 === 'FLOATING' || b1 === 'FLOATING') {
          outputs[4] = outputs[5] = outputs[6] = outputs[7] = 'FLOATING';
        } else {
          const idx1 = (b1 === 'HIGH' ? 2 : 0) + (a1 === 'HIGH' ? 1 : 0);
          const map1: Record<number, number> = { 0: 4, 1: 5, 2: 6, 3: 7 };
          outputs[map1[idx1]] = 'LOW';
        }
      }

      // Section 2
      const g2 = levels[15];
      const a2 = levels[14];
      const b2 = levels[13];
      if (g2 === 'FLOATING') {
        outputs[12] = outputs[11] = outputs[10] = outputs[9] = 'FLOATING';
      } else if (g2 === 'LOW') {
        if (a2 === 'FLOATING' || b2 === 'FLOATING') {
          outputs[12] = outputs[11] = outputs[10] = outputs[9] = 'FLOATING';
        } else {
          const idx2 = (b2 === 'HIGH' ? 2 : 0) + (a2 === 'HIGH' ? 1 : 0);
          const map2: Record<number, number> = { 0: 12, 1: 11, 2: 10, 3: 9 };
          outputs[map2[idx2]] = 'LOW';
        }
      }

      return outputs;
    },
  },

  // -------------------------------------------------------------
  // 7485: 4-Bit Magnitude Comparator (DIP-16)
  // Datasheet reference: TI SN74LS85 & SRM AP CSE 207 Manual p.20
  // Pins: 1=B3, 2=IA<B, 3=IA=B, 4=IA>B, 5=OA>B, 6=OA=B, 7=OA<B, 8=GND,
  //       9=B0, 10=A0, 11=B1, 12=A1, 13=A2, 14=B2, 15=A3, 16=VCC
  // -------------------------------------------------------------
  '7485': {
    id: '7485',
    partNumber: 'SN74LS85N',
    name: '4-Bit Magnitude Comparator',
    category: 'Arithmetic',
    package: 'DIP-16',
    pinCount: 16,
    vccPin: 16,
    gndPin: 8,
    description: 'Compares two 4-bit binary words (A3..A0 and B3..B0) with cascade inputs (IA<B, IA=B, IA>B) and outputs OA>B, OA=B, OA<B.',
    datasheetRef: 'Texas Instruments SN74LS85 / SRM AP Manual p.20',
    pins: [
      { number: 1, name: 'B3', type: 'INPUT', description: 'Word B Input Bit 3 (MSB)' },
      { number: 2, name: 'IA<B', type: 'INPUT', description: 'Cascade Input (A < B)' },
      { number: 3, name: 'IA=B', type: 'INPUT', description: 'Cascade Input (A = B)' },
      { number: 4, name: 'IA>B', type: 'INPUT', description: 'Cascade Input (A > B)' },
      { number: 5, name: 'OA>B', type: 'OUTPUT', description: 'Output (A > B)' },
      { number: 6, name: 'OA=B', type: 'OUTPUT', description: 'Output (A = B)' },
      { number: 7, name: 'OA<B', type: 'OUTPUT', description: 'Output (A < B)' },
      { number: 8, name: 'GND', type: 'POWER', description: 'Ground (0V)' },
      { number: 9, name: 'B0', type: 'INPUT', description: 'Word B Input Bit 0 (LSB)' },
      { number: 10, name: 'A0', type: 'INPUT', description: 'Word A Input Bit 0 (LSB)' },
      { number: 11, name: 'B1', type: 'INPUT', description: 'Word B Input Bit 1' },
      { number: 12, name: 'A1', type: 'INPUT', description: 'Word A Input Bit 1' },
      { number: 13, name: 'A2', type: 'INPUT', description: 'Word A Input Bit 2' },
      { number: 14, name: 'B2', type: 'INPUT', description: 'Word B Input Bit 2' },
      { number: 15, name: 'A3', type: 'INPUT', description: 'Word A Input Bit 3 (MSB)' },
      { number: 16, name: 'VCC', type: 'POWER', description: 'Supply Voltage (+5V)' },
    ],
    evaluateCustom: (levels) => {
      const requiredPins = [1, 2, 3, 4, 9, 10, 11, 12, 13, 14, 15];
      if (requiredPins.some((p) => levels[p] === 'FLOATING' || !levels[p])) {
        return { 5: 'FLOATING', 6: 'FLOATING', 7: 'FLOATING' };
      }
      if (requiredPins.some((p) => levels[p] === 'ERROR')) {
        return { 5: 'ERROR', 6: 'ERROR', 7: 'ERROR' };
      }

      const bit = (p: number) => (levels[p] === 'HIGH' ? 1 : 0);
      const valA = (bit(15) << 3) | (bit(13) << 2) | (bit(12) << 1) | bit(10);
      const valB = (bit(1) << 3) | (bit(14) << 2) | (bit(11) << 1) | bit(9);

      if (valA > valB) {
        return { 5: 'HIGH', 6: 'LOW', 7: 'LOW' };
      }
      if (valA < valB) {
        return { 5: 'LOW', 6: 'LOW', 7: 'HIGH' };
      }

      // A == B: resolve via SN74LS85 cascade truth table
      const iGt = levels[4] === 'HIGH';
      const iEq = levels[3] === 'HIGH';
      const iLt = levels[2] === 'HIGH';

      if (iEq) {
        return { 5: 'LOW', 6: 'HIGH', 7: 'LOW' };
      }
      if (iGt && !iLt) {
        return { 5: 'HIGH', 6: 'LOW', 7: 'LOW' };
      }
      if (!iGt && iLt) {
        return { 5: 'LOW', 6: 'LOW', 7: 'HIGH' };
      }
      if (iGt && iLt) {
        return { 5: 'LOW', 6: 'LOW', 7: 'LOW' };
      }
      // iGt === false && iLt === false && iEq === false
      return { 5: 'HIGH', 6: 'LOW', 7: 'HIGH' };
    },
  },

  // -------------------------------------------------------------
  // 7474: Dual D-Type Positive-Edge-Triggered Flip-Flop (DIP-14)
  // Datasheet reference: TI SN74LS74A & SRM AP CSE 207 Manual p.5, 23-25
  // -------------------------------------------------------------
  '7474': {
    id: '7474',
    partNumber: 'SN74LS74AN',
    name: 'Dual Positive-Edge D Flip-Flop',
    category: 'Flip-Flops',
    package: 'DIP-14',
    pinCount: 14,
    vccPin: 14,
    gndPin: 7,
    isSequential: true,
    description: 'Dual positive-edge-triggered D flip-flops with active-low asynchronous preset (PRE\') and clear (CLR\').',
    datasheetRef: 'Texas Instruments SN74LS74A / SRM AP Manual p.5, 23',
    pins: [
      { number: 1, name: '1CLR\'', type: 'ENABLE', description: 'FF1 Clear (Active-Low)', inverted: true },
      { number: 2, name: '1D', type: 'INPUT', description: 'FF1 Data Input' },
      { number: 3, name: '1CLK', type: 'INPUT', description: 'FF1 Clock Input (Rising Edge)' },
      { number: 4, name: '1PRE\'', type: 'ENABLE', description: 'FF1 Preset (Active-Low)', inverted: true },
      { number: 5, name: '1Q', type: 'OUTPUT', description: 'FF1 Output Q' },
      { number: 6, name: '1Q\'', type: 'OUTPUT', description: 'FF1 Complement Output Q\'', inverted: true },
      { number: 7, name: 'GND', type: 'POWER', description: 'Ground (0V)' },
      { number: 8, name: '2Q\'', type: 'OUTPUT', description: 'FF2 Complement Output Q\'', inverted: true },
      { number: 9, name: '2Q', type: 'OUTPUT', description: 'FF2 Output Q' },
      { number: 10, name: '2PRE\'', type: 'ENABLE', description: 'FF2 Preset (Active-Low)', inverted: true },
      { number: 11, name: '2CLK', type: 'INPUT', description: 'FF2 Clock Input (Rising Edge)' },
      { number: 12, name: '2D', type: 'INPUT', description: 'FF2 Data Input' },
      { number: 13, name: '2CLR\'', type: 'ENABLE', description: 'FF2 Clear (Active-Low)', inverted: true },
      { number: 14, name: 'VCC', type: 'POWER', description: 'Supply Voltage (+5V)' },
    ],
    evaluateSequential: (levels, state) => {
      const outputs: Record<number, LogicLevel> = {};
      const nextRegisters: Record<string, number> = { ...state.registers };

      const evalD = (
        key: string,
        clrPin: number,
        dPin: number,
        clkPin: number,
        prePin: number,
        qPin: number,
        qbPin: number
      ) => {
        const clr = levels[clrPin];
        const pre = levels[prePin];
        const d = levels[dPin];
        const clk = levels[clkPin];

        if (pre === 'FLOATING' || clr === 'FLOATING') {
          outputs[qPin] = 'FLOATING';
          outputs[qbPin] = 'FLOATING';
          return;
        }

        // Asynchronous active-LOW PRE' and CLR'
        if (pre === 'LOW' && clr === 'LOW') {
          // Invalid state on 74LS74: both Q and Q' go HIGH (non-stable when released)
          nextRegisters[key] = 1;
          outputs[qPin] = 'HIGH';
          outputs[qbPin] = 'HIGH';
          return;
        }
        if (pre === 'LOW') {
          nextRegisters[key] = 1;
          outputs[qPin] = 'HIGH';
          outputs[qbPin] = 'LOW';
          return;
        }
        if (clr === 'LOW') {
          nextRegisters[key] = 0;
          outputs[qPin] = 'LOW';
          outputs[qbPin] = 'HIGH';
          return;
        }

        if (d === 'FLOATING' || clk === 'FLOATING') {
          outputs[qPin] = 'FLOATING';
          outputs[qbPin] = 'FLOATING';
          return;
        }

        let q = nextRegisters[key] ?? 0;
        const prevClk = state.prevClocks[clkPin] ?? clk;
        // Positive-edge triggered: LOW -> HIGH
        if (prevClk === 'LOW' && clk === 'HIGH') {
          q = d === 'HIGH' ? 1 : 0;
        }

        nextRegisters[key] = q;
        outputs[qPin] = q === 1 ? 'HIGH' : 'LOW';
        outputs[qbPin] = q === 1 ? 'LOW' : 'HIGH';
      };

      evalD('q1', 1, 2, 3, 4, 5, 6);
      evalD('q2', 13, 12, 11, 10, 9, 8);

      return { outputs, nextRegisters };
    },
  },

  // -------------------------------------------------------------
  // 7476: Dual J-K Negative-Edge-Triggered Flip-Flop (DIP-16)
  // Datasheet reference: TI SN74LS76A & SRM AP CSE 207 Manual p.5, 22, 26
  // Note NON-STANDARD POWER: Pin 5 = VCC, Pin 13 = GND
  // -------------------------------------------------------------
  '7476': {
    id: '7476',
    partNumber: 'SN74LS76AN',
    name: 'Dual J-K Flip-Flop',
    category: 'Flip-Flops',
    package: 'DIP-16',
    pinCount: 16,
    vccPin: 5,
    gndPin: 13,
    isSequential: true,
    description: 'Dual J-K flip-flops with active-low Preset/Clear and falling-edge (bubble) clock. Non-standard power: Pin 5=VCC, Pin 13=GND.',
    datasheetRef: 'Texas Instruments SN74LS76A / SRM AP Manual p.5, 22',
    pins: [
      { number: 1, name: '1CLK\'', type: 'INPUT', description: 'FF1 Clock Input (Falling Edge)', inverted: true },
      { number: 2, name: '1PRE\'', type: 'ENABLE', description: 'FF1 Preset (Active-Low)', inverted: true },
      { number: 3, name: '1CLR\'', type: 'ENABLE', description: 'FF1 Clear (Active-Low)', inverted: true },
      { number: 4, name: '1J', type: 'INPUT', description: 'FF1 J Input' },
      { number: 5, name: 'VCC', type: 'POWER', description: 'Supply Voltage (+5V, Pin 5)' },
      { number: 6, name: '2CLK\'', type: 'INPUT', description: 'FF2 Clock Input (Falling Edge)', inverted: true },
      { number: 7, name: '2PRE\'', type: 'ENABLE', description: 'FF2 Preset (Active-Low)', inverted: true },
      { number: 8, name: '2CLR\'', type: 'ENABLE', description: 'FF2 Clear (Active-Low)', inverted: true },
      { number: 9, name: '2J', type: 'INPUT', description: 'FF2 J Input' },
      { number: 10, name: '2Q\'', type: 'OUTPUT', description: 'FF2 Complement Output Q\'', inverted: true },
      { number: 11, name: '2Q', type: 'OUTPUT', description: 'FF2 Output Q' },
      { number: 12, name: '2K', type: 'INPUT', description: 'FF2 K Input' },
      { number: 13, name: 'GND', type: 'POWER', description: 'Ground (0V, Pin 13)' },
      { number: 14, name: '1Q\'', type: 'OUTPUT', description: 'FF1 Complement Output Q\'', inverted: true },
      { number: 15, name: '1Q', type: 'OUTPUT', description: 'FF1 Output Q' },
      { number: 16, name: '1K', type: 'INPUT', description: 'FF1 K Input' },
    ],
    evaluateSequential: (levels, state) => {
      const outputs: Record<number, LogicLevel> = {};
      const nextRegisters: Record<string, number> = { ...state.registers };

      const evalJK = (
        key: string,
        clkPin: number,
        prePin: number,
        clrPin: number,
        jPin: number,
        kPin: number,
        qPin: number,
        qbPin: number
      ) => {
        const pre = levels[prePin];
        const clr = levels[clrPin];
        const j = levels[jPin];
        const k = levels[kPin];
        const clk = levels[clkPin];

        if (pre === 'FLOATING' || clr === 'FLOATING') {
          outputs[qPin] = 'FLOATING';
          outputs[qbPin] = 'FLOATING';
          return;
        }

        if (pre === 'LOW' && clr === 'LOW') {
          // Invalid state: both Q and Q' go HIGH while PRE'=CLR'=LOW
          nextRegisters[key] = 1;
          outputs[qPin] = 'HIGH';
          outputs[qbPin] = 'HIGH';
          return;
        }
        if (pre === 'LOW') {
          nextRegisters[key] = 1;
          outputs[qPin] = 'HIGH';
          outputs[qbPin] = 'LOW';
          return;
        }
        if (clr === 'LOW') {
          nextRegisters[key] = 0;
          outputs[qPin] = 'LOW';
          outputs[qbPin] = 'HIGH';
          return;
        }

        if (j === 'FLOATING' || k === 'FLOATING' || clk === 'FLOATING') {
          outputs[qPin] = 'FLOATING';
          outputs[qbPin] = 'FLOATING';
          return;
        }

        let q = nextRegisters[key] ?? 0;
        const prevClk = state.prevClocks[clkPin] ?? clk;
        // Negative-edge triggered per 74LS76A datasheet & manual p.22 schematic bubble: HIGH -> LOW
        if (prevClk === 'HIGH' && clk === 'LOW') {
          const jHigh = j === 'HIGH';
          const kHigh = k === 'HIGH';
          if (!jHigh && !kHigh) {
            // Hold
          } else if (!jHigh && kHigh) {
            q = 0; // Reset
          } else if (jHigh && !kHigh) {
            q = 1; // Set
          } else {
            q = q === 1 ? 0 : 1; // Toggle
          }
        }

        nextRegisters[key] = q;
        outputs[qPin] = q === 1 ? 'HIGH' : 'LOW';
        outputs[qbPin] = q === 1 ? 'LOW' : 'HIGH';
      };

      evalJK('q1', 1, 2, 3, 4, 16, 15, 14);
      evalJK('q2', 6, 7, 8, 9, 12, 11, 10);

      return { outputs, nextRegisters };
    },
  },

  // -------------------------------------------------------------
  // 7490: Decade Counter (DIP-14)
  // Datasheet reference: TI SN74LS90 & SRM AP CSE 207 Manual p.28-29
  // Note NON-STANDARD POWER: Pin 5 = VCC, Pin 10 = GND; Pins 4 & 13 = NC
  // -------------------------------------------------------------
  '7490': {
    id: '7490',
    partNumber: 'SN74LS90N',
    name: 'BCD Decade Counter',
    category: 'Counters',
    package: 'DIP-14',
    pinCount: 14,
    vccPin: 5,
    gndPin: 10,
    isSequential: true,
    description: '4-bit ripple decade counter (Mod-2 on CKA + Mod-5 on CKB) with gated async Reset-0 and Reset-9. Pin 5=VCC, Pin 10=GND.',
    datasheetRef: 'Texas Instruments SN74LS90 / SRM AP Manual p.28',
    pins: [
      { number: 1, name: 'CKB', type: 'INPUT', description: 'Mod-5 Clock Input B (Falling Edge)', inverted: true },
      { number: 2, name: 'R0(1)', type: 'ENABLE', description: 'Gated Reset-to-0 Input 1' },
      { number: 3, name: 'R0(2)', type: 'ENABLE', description: 'Gated Reset-to-0 Input 2' },
      { number: 4, name: 'NC', type: 'NC', description: 'No Internal Connection' },
      { number: 5, name: 'VCC', type: 'POWER', description: 'Supply Voltage (+5V, Pin 5)' },
      { number: 6, name: 'R9(1)', type: 'ENABLE', description: 'Gated Set-to-9 Input 1' },
      { number: 7, name: 'R9(2)', type: 'ENABLE', description: 'Gated Set-to-9 Input 2' },
      { number: 8, name: 'QC', type: 'OUTPUT', description: 'Bit 2 Output (A2)' },
      { number: 9, name: 'QB', type: 'OUTPUT', description: 'Bit 1 Output (A1)' },
      { number: 10, name: 'GND', type: 'POWER', description: 'Ground (0V, Pin 10)' },
      { number: 11, name: 'QD', type: 'OUTPUT', description: 'Bit 3 Output (A3 / MSB)' },
      { number: 12, name: 'QA', type: 'OUTPUT', description: 'Bit 0 Output (A0 / LSB)' },
      { number: 13, name: 'NC', type: 'NC', description: 'No Internal Connection' },
      { number: 14, name: 'CKA', type: 'INPUT', description: 'Mod-2 Clock Input A (Falling Edge)', inverted: true },
    ],
    evaluateSequential: (levels, state) => {
      const cka = levels[14];
      const ckb = levels[1];
      const r0Active = levels[2] === 'HIGH' && levels[3] === 'HIGH';
      const r9Active = levels[6] === 'HIGH' && levels[7] === 'HIGH';

      let qa = state.registers['qa'] ?? 0;
      let mod5 = state.registers['mod5'] ?? 0;

      if (r9Active) {
        // Async Set to 9 (1001): QD=1 (mod5=4), QC=0, QB=0, QA=1
        qa = 1;
        mod5 = 4;
      } else if (r0Active) {
        // Async Reset to 0 (0000)
        qa = 0;
        mod5 = 0;
      } else {
        if (cka !== 'FLOATING') {
          const prevCka = state.prevClocks[14] ?? cka;
          if (prevCka === 'HIGH' && cka === 'LOW') {
            qa = qa === 1 ? 0 : 1;
          }
        }
        if (ckb !== 'FLOATING') {
          const prevCkb = state.prevClocks[1] ?? ckb;
          if (prevCkb === 'HIGH' && ckb === 'LOW') {
            mod5 = (mod5 + 1) % 5;
          }
        }
      }

      const outputs: Record<number, LogicLevel> = {
        12: cka === 'FLOATING' && !r0Active && !r9Active ? 'FLOATING' : qa === 1 ? 'HIGH' : 'LOW',
        9: ckb === 'FLOATING' && !r0Active && !r9Active ? 'FLOATING' : (mod5 & 1) !== 0 ? 'HIGH' : 'LOW',
        8: ckb === 'FLOATING' && !r0Active && !r9Active ? 'FLOATING' : (mod5 & 2) !== 0 ? 'HIGH' : 'LOW',
        11: ckb === 'FLOATING' && !r0Active && !r9Active ? 'FLOATING' : (mod5 & 4) !== 0 ? 'HIGH' : 'LOW',
      };

      return {
        outputs,
        nextRegisters: { qa, mod5 },
      };
    },
  },
};
