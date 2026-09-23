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

      if (g1 === 'FLOATING' || g2a === 'FLOATING' || g2b === 'FLOATING') {
        Object.keys(outputs).forEach((k) => (outputs[Number(k)] = 'FLOATING'));
        return outputs;
      }

      // Enabled condition: G1 is HIGH, G2A' is LOW, G2B' is LOW
      const isEnabled = g1 === 'HIGH' && g2a === 'LOW' && g2b === 'LOW';

      if (!isEnabled) {
        return outputs; // All stay HIGH when disabled
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
  // Datasheet reference: TI SN74LS148
  // Inputs: 0'..7' (pins 10,11,12,13,1,2,3,4 - actually standard:
  // pin 10=EO', 11=GS', 12=3', 13=2', 14=1', 15=0', 1=4', 2=5', 3=6', 4=7', 5=EI', 6=A2', 7=A1', 8=GND, 9=A0', 16=VCC)
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
    description: 'Encodes 8 active-low data inputs to 3-bit active-low binary code according to priority (7 highest).',
    datasheetRef: 'Texas Instruments SN74LS148 Priority Encoder Pinout',
    pins: [
      { number: 1, name: '4\'', type: 'INPUT', description: 'Data Input 4 (Active-Low)', inverted: true },
      { number: 2, name: '5\'', type: 'INPUT', description: 'Data Input 5 (Active-Low)', inverted: true },
      { number: 3, name: '6\'', type: 'INPUT', description: 'Data Input 6 (Active-Low)', inverted: true },
      { number: 4, name: '7\'', type: 'INPUT', description: 'Data Input 7 (Highest Priority)', inverted: true },
      { number: 5, name: 'EI\'', type: 'ENABLE', description: 'Enable Input (Active-Low)', inverted: true },
      { number: 6, name: 'A2\'', type: 'OUTPUT', description: 'Address Output A2 (Active-Low)', inverted: true },
      { number: 7, name: 'A1\'', type: 'OUTPUT', description: 'Address Output A1 (Active-Low)', inverted: true },
      { number: 8, name: 'GND', type: 'POWER', description: 'Ground (0V)' },
      { number: 9, name: 'A0\'', type: 'OUTPUT', description: 'Address Output A0 (Active-Low)', inverted: true },
      { number: 10, name: 'EO\'', type: 'OUTPUT', description: 'Enable Output (Active-Low)', inverted: true },
      { number: 11, name: 'GS\'', type: 'OUTPUT', description: 'Group Signal (Active-Low)', inverted: true },
      { number: 12, name: '3\'', type: 'INPUT', description: 'Data Input 3 (Active-Low)', inverted: true },
      { number: 13, name: '2\'', type: 'INPUT', description: 'Data Input 2 (Active-Low)', inverted: true },
      { number: 14, name: '1\'', type: 'INPUT', description: 'Data Input 1 (Active-Low)', inverted: true },
      { number: 15, name: '0\'', type: 'INPUT', description: 'Data Input 0 (Active-Low)', inverted: true },
      { number: 16, name: 'VCC', type: 'POWER', description: 'Supply Voltage (+5V)' },
    ],
    evaluateCustom: (levels) => {
      const ei = levels[5];
      const outputs: Record<number, LogicLevel> = {
        6: 'HIGH',  // A2'
        7: 'HIGH',  // A1'
        9: 'HIGH',  // A0'
        10: 'HIGH', // EO'
        11: 'HIGH', // GS'
      };

      if (ei === 'FLOATING') {
        Object.keys(outputs).forEach((k) => (outputs[Number(k)] = 'FLOATING'));
        return outputs;
      }

      if (ei !== 'LOW') {
        // Disabled: all outputs remain HIGH (inactive)
        return outputs;
      }

      // Input pins: 7'->pin 4, 6'->pin 3, 5'->pin 2, 4'->pin 1, 3'->pin 12, 2'->pin 13, 1'->pin 14, 0'->pin 15
      const inputPinOrder = [
        { index: 7, pin: 4 },
        { index: 6, pin: 3 },
        { index: 5, pin: 2 },
        { index: 4, pin: 1 },
        { index: 3, pin: 12 },
        { index: 2, pin: 13 },
        { index: 1, pin: 14 },
        { index: 0, pin: 15 },
      ];

      let highestActive = -1;
      for (const item of inputPinOrder) {
        if (levels[item.pin] === 'LOW') {
          highestActive = item.index;
          break;
        }
      }

      if (highestActive === -1) {
        // No input active (all are HIGH or floating)
        outputs[10] = 'LOW'; // EO' goes LOW when enabled and no inputs active
        outputs[11] = 'HIGH'; // GS' stays HIGH
        outputs[6] = 'HIGH';
        outputs[7] = 'HIGH';
        outputs[9] = 'HIGH';
      } else {
        outputs[11] = 'LOW'; // GS' goes LOW (group signal active)
        outputs[10] = 'HIGH'; // EO' stays HIGH

        // Active-low encoding of highestActive
        // e.g. 7 (binary 111): active-low is 000 (LOW, LOW, LOW)
        // 0 (binary 000): active-low is 111 (HIGH, HIGH, HIGH)
        const a2 = (highestActive & 4) !== 0 ? 'LOW' : 'HIGH';
        const a1 = (highestActive & 2) !== 0 ? 'LOW' : 'HIGH';
        const a0 = (highestActive & 1) !== 0 ? 'LOW' : 'HIGH';

        outputs[6] = a2;
        outputs[7] = a1;
        outputs[9] = a0;
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

      if (s0 === 'FLOATING' || s1 === 'FLOATING') {
        outputs[7] = 'FLOATING';
        outputs[9] = 'FLOATING';
        return outputs;
      }

      const selIdx = (s1 === 'HIGH' ? 2 : 0) + (s0 === 'HIGH' ? 1 : 0);

      // Section 1
      const g1 = levels[1];
      if (g1 === 'LOW') {
        const c1Map: Record<number, number> = { 0: 6, 1: 5, 2: 4, 3: 3 };
        const selectedPin = c1Map[selIdx];
        outputs[7] = levels[selectedPin] ?? 'FLOATING';
      } else {
        outputs[7] = 'LOW';
      }

      // Section 2
      const g2 = levels[15];
      if (g2 === 'LOW') {
        const c2Map: Record<number, number> = { 0: 10, 1: 11, 2: 12, 3: 13 };
        const selectedPin = c2Map[selIdx];
        outputs[9] = levels[selectedPin] ?? 'FLOATING';
      } else {
        outputs[9] = 'LOW';
      }

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
      if (g1 === 'LOW') {
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
      if (g2 === 'LOW') {
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
};
