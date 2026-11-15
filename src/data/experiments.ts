import { ExperimentDef } from '../types/experiment';

export const LAB_EXPERIMENTS: ExperimentDef[] = [
  // -------------------------------------------------------------
  // EXPERIMENT 01: Realization of Basic Logic Gates (Manual Exp 1)
  // -------------------------------------------------------------
  {
    id: 'exp-basic-gates',
    number: '01',
    title: 'Realization of Basic Logic Gates',
    aim: 'To verify the truth tables of basic logic gates (AND, OR, NOT, NAND, NOR, XOR) using TTL ICs.',
    components: ['7408 (AND)', '7432 (OR)', '7404 (NOT)', '7400 (NAND)', '7402 (NOR)', '7486 (XOR)', 'Digital Logic Trainer DLT-01', 'Jumper Wires'],
    suggestedICs: ['7408', '7432', '7404', '7400', '7402', '7486'],
    theory: `Basic logic gates perform elementary logical operations fundamental to all digital circuits:
- AND (7408): Output Y = A · B (HIGH only when all inputs are HIGH).
- OR (7432): Output Y = A + B (HIGH when any input is HIGH).
- NOT (7404): Output Y = A' (Inverts the input signal).
- NAND (7400): Output Y = (A · B)' (Universal gate).
- NOR (7402): Output Y = (A + B)' (Universal gate, note output on pin 1).
- XOR (7486): Output Y = A ⊕ B (HIGH when inputs differ).`,
    procedure: [
      '1. Place the desired TTL IC (e.g. 7408 Quad AND) straddling the center trough on the breadboard.',
      '2. Connect Pin 14 (VCC) of the IC to the +5V power rail.',
      '3. Connect Pin 7 (GND) of the IC to the 0V GND rail.',
      '4. Connect digital input terminal D0 to Pin 1 (1A) and D1 to Pin 2 (1B).',
      '5. Connect output Pin 3 (1Y) to digital output terminal D8.',
      '6. Toggle input switches D0 and D1 through all 4 binary states (00, 01, 10, 11) and record D8 LED state.',
      '7. Click [Run All Test Cases] to auto-verify the circuit.',
    ],
    pinMapping: {
      inputNames: { A: 'D0', B: 'D1' },
      outputNames: { Y: 'D8' },
    },
    truthTable: [
      { id: '1-1', inputs: { A: 0, B: 0 }, expectedOutputs: { Y: 0 } },
      { id: '1-2', inputs: { A: 0, B: 1 }, expectedOutputs: { Y: 0 } },
      { id: '1-3', inputs: { A: 1, B: 0 }, expectedOutputs: { Y: 0 } },
      { id: '1-4', inputs: { A: 1, B: 1 }, expectedOutputs: { Y: 1 } },
    ],
    referenceCircuit: {
      ics: [
        { instanceId: 'ic-7408-1', icDefId: '7408', startCol: 10, rotation: 0 },
      ],
      wires: [
        { id: 'w-pwr-vcc', fromHoleId: 'vcc-src', toHoleId: 'top-power-plus-1', color: 'red' },
        { id: 'w-pwr-gnd', fromHoleId: 'gnd-src', toHoleId: 'top-power-minus-1', color: 'black' },
        { id: 'w-ic-vcc', fromHoleId: 'top-power-plus-10', toHoleId: 'bb-A-10', color: 'red' },
        { id: 'w-ic-gnd', fromHoleId: 'top-power-minus-16', toHoleId: 'bb-J-16', color: 'black' },
        { id: 'w-in-d0', fromHoleId: 'd0', toHoleId: 'bb-J-10', color: 'blue' },
        { id: 'w-in-d1', fromHoleId: 'd1', toHoleId: 'bb-J-11', color: 'blue' },
        { id: 'w-out-d8', fromHoleId: 'bb-J-12', toHoleId: 'd8', color: 'green' },
      ],
    },
  },

  // -------------------------------------------------------------
  // EXPERIMENT 02: Binary to Gray Code Converter (Manual Exp 2a)
  // -------------------------------------------------------------
  {
    id: 'exp-binary-gray',
    number: '02',
    title: 'Binary to Gray Code Converter',
    aim: 'To design and implement a 4-bit Binary to Gray code converter using XOR gates (7486).',
    components: ['7486 (Quad 2-Input XOR)', 'Digital Logic Trainer DLT-01', 'Jumper Wires'],
    suggestedICs: ['7486'],
    theory: `In Gray code, consecutive numbers differ in only one bit position (unit distance code), preventing spurious transient states in rotary encoders.
Equations for 4-bit conversion (B3 B2 B1 B0 -> G3 G2 G1 G0):
- G3 = B3
- G2 = B3 ⊕ B2
- G1 = B2 ⊕ B1
- G0 = B1 ⊕ B0`,
    procedure: [
      '1. Insert 7486 IC into breadboard. Connect Pin 14 to +5V and Pin 7 to GND.',
      '2. Assign inputs: B3=D3, B2=D2, B1=D1, B0=D0.',
      '3. Connect D3 directly to D11 (G3 = B3).',
      '4. Connect D3 and D2 to XOR gate 1 inputs (pins 1 & 2); connect output pin 3 to D10 (G2).',
      '5. Connect D2 and D1 to XOR gate 2 inputs (pins 4 & 5); connect output pin 6 to D9 (G1).',
      '6. Connect D1 and D0 to XOR gate 3 inputs (pins 9 & 10); connect output pin 8 to D8 (G0).',
      '7. Verify all 16 combinations of D11, D10, D9, D8 against the Gray code table.',
    ],
    pinMapping: {
      inputNames: { B0: 'D0', B1: 'D1', B2: 'D2', B3: 'D3' },
      outputNames: { G0: 'D8', G1: 'D9', G2: 'D10', G3: 'D11' },
    },
    truthTable: [
      { id: 'bg-0', inputs: { B3: 0, B2: 0, B1: 0, B0: 0 }, expectedOutputs: { G3: 0, G2: 0, G1: 0, G0: 0 } },
      { id: 'bg-1', inputs: { B3: 0, B2: 0, B1: 0, B0: 1 }, expectedOutputs: { G3: 0, G2: 0, G1: 0, G0: 1 } },
      { id: 'bg-2', inputs: { B3: 0, B2: 0, B1: 1, B0: 0 }, expectedOutputs: { G3: 0, G2: 0, G1: 1, G0: 1 } },
      { id: 'bg-3', inputs: { B3: 0, B2: 0, B1: 1, B0: 1 }, expectedOutputs: { G3: 0, G2: 0, G1: 1, G0: 0 } },
      { id: 'bg-4', inputs: { B3: 0, B2: 1, B1: 0, B0: 0 }, expectedOutputs: { G3: 0, G2: 1, G1: 1, G0: 0 } },
      { id: 'bg-5', inputs: { B3: 0, B2: 1, B1: 0, B0: 1 }, expectedOutputs: { G3: 0, G2: 1, G1: 1, G0: 1 } },
      { id: 'bg-6', inputs: { B3: 0, B2: 1, B1: 1, B0: 0 }, expectedOutputs: { G3: 0, G2: 1, G1: 0, G0: 1 } },
      { id: 'bg-7', inputs: { B3: 0, B2: 1, B1: 1, B0: 1 }, expectedOutputs: { G3: 0, G2: 1, G1: 0, G0: 0 } },
      { id: 'bg-8', inputs: { B3: 1, B2: 0, B1: 0, B0: 0 }, expectedOutputs: { G3: 1, G2: 1, G1: 0, G0: 0 } },
      { id: 'bg-9', inputs: { B3: 1, B2: 0, B1: 0, B0: 1 }, expectedOutputs: { G3: 1, G2: 1, G1: 0, G0: 1 } },
      { id: 'bg-10', inputs: { B3: 1, B2: 0, B1: 1, B0: 0 }, expectedOutputs: { G3: 1, G2: 1, G1: 1, G0: 1 } },
      { id: 'bg-11', inputs: { B3: 1, B2: 0, B1: 1, B0: 1 }, expectedOutputs: { G3: 1, G2: 1, G1: 1, G0: 0 } },
      { id: 'bg-12', inputs: { B3: 1, B2: 1, B1: 0, B0: 0 }, expectedOutputs: { G3: 1, G2: 0, G1: 1, G0: 0 } },
      { id: 'bg-13', inputs: { B3: 1, B2: 1, B1: 0, B0: 1 }, expectedOutputs: { G3: 1, G2: 0, G1: 1, G0: 1 } },
      { id: 'bg-14', inputs: { B3: 1, B2: 1, B1: 1, B0: 0 }, expectedOutputs: { G3: 1, G2: 0, G1: 0, G0: 1 } },
      { id: 'bg-15', inputs: { B3: 1, B2: 1, B1: 1, B0: 1 }, expectedOutputs: { G3: 1, G2: 0, G1: 0, G0: 0 } },
    ],
    referenceCircuit: {
      ics: [
        { instanceId: 'ic-7486-1', icDefId: '7486', startCol: 10, rotation: 0 },
      ],
      wires: [
        { id: 'w1', fromHoleId: 'vcc-src', toHoleId: 'top-power-plus-1', color: 'red' },
        { id: 'w2', fromHoleId: 'gnd-src', toHoleId: 'top-power-minus-1', color: 'black' },
        { id: 'w3', fromHoleId: 'top-power-plus-10', toHoleId: 'bb-A-10', color: 'red' },
        { id: 'w4', fromHoleId: 'top-power-minus-16', toHoleId: 'bb-J-16', color: 'black' },
        { id: 'w-g3', fromHoleId: 'd3', toHoleId: 'd11', color: 'green' },
        { id: 'w-b3-g1', fromHoleId: 'd3', toHoleId: 'bb-J-10', color: 'blue' },
        { id: 'w-b2-g1', fromHoleId: 'd2', toHoleId: 'bb-J-11', color: 'blue' },
        { id: 'w-g2-out', fromHoleId: 'bb-J-12', toHoleId: 'd10', color: 'green' },
        { id: 'w-b2-g2', fromHoleId: 'd2', toHoleId: 'bb-J-13', color: 'blue' },
        { id: 'w-b1-g2', fromHoleId: 'd1', toHoleId: 'bb-J-14', color: 'blue' },
        { id: 'w-g1-out', fromHoleId: 'bb-J-15', toHoleId: 'd9', color: 'green' },
        { id: 'w-b1-g3', fromHoleId: 'd1', toHoleId: 'bb-A-15', color: 'blue' },
        { id: 'w-b0-g3', fromHoleId: 'd0', toHoleId: 'bb-A-14', color: 'blue' },
        { id: 'w-g0-out', fromHoleId: 'bb-A-16', toHoleId: 'd8', color: 'green' },
      ],
    },
  },

  // -------------------------------------------------------------
  // EXPERIMENT 03: Gray to Binary Code Converter (Manual Exp 2b)
  // -------------------------------------------------------------
  {
    id: 'exp-gray-binary',
    number: '03',
    title: 'Gray to Binary Code Converter',
    aim: 'To design and implement a 4-bit Gray to Binary code converter using 7486 XOR gates.',
    components: ['7486 (Quad 2-Input XOR)', 'Digital Logic Trainer DLT-01', 'Jumper Wires'],
    suggestedICs: ['7486'],
    theory: `Conversion equations from 4-bit Gray code (G3 G2 G1 G0) back to Binary (B3 B2 B1 B0):
- B3 = G3
- B2 = B3 ⊕ G2
- B1 = B2 ⊕ G1
- B0 = B1 ⊕ G0`,
    procedure: [
      '1. Insert 7486 into breadboard. Connect Pin 14 (VCC) to +5V and Pin 7 (GND) to GND.',
      '2. Map inputs: G0=D0, G1=D1, G2=D2, G3=D3. Outputs: B0=D8, B1=D9, B2=D10, B3=D11.',
      '3. Connect D3 to D11 (B3 = G3).',
      '4. Connect B3 (D3) and G2 (D2) to XOR gate 1 to produce B2 on D10.',
      '5. Connect B2 (pin 3 output) and G1 (D1) to XOR gate 2 to produce B1 on D9.',
      '6. Connect B1 (pin 6 output) and G0 (D0) to XOR gate 3 to produce B0 on D8.',
      '7. Test all 16 input combinations.',
    ],
    pinMapping: {
      inputNames: { G0: 'D0', G1: 'D1', G2: 'D2', G3: 'D3' },
      outputNames: { B0: 'D8', B1: 'D9', B2: 'D10', B3: 'D11' },
    },
    truthTable: [
      { id: 'gb-0', inputs: { G3: 0, G2: 0, G1: 0, G0: 0 }, expectedOutputs: { B3: 0, B2: 0, B1: 0, B0: 0 } },
      { id: 'gb-1', inputs: { G3: 0, G2: 0, G1: 0, G0: 1 }, expectedOutputs: { B3: 0, B2: 0, B1: 0, B0: 1 } },
      { id: 'gb-2', inputs: { G3: 0, G2: 0, G1: 1, G0: 0 }, expectedOutputs: { B3: 0, B2: 0, B1: 1, B0: 1 } },
      { id: 'gb-3', inputs: { G3: 0, G2: 0, G1: 1, G0: 1 }, expectedOutputs: { B3: 0, B2: 0, B1: 1, B0: 0 } },
      { id: 'gb-4', inputs: { G3: 0, G2: 1, G1: 0, G0: 0 }, expectedOutputs: { B3: 0, B2: 1, B1: 1, B0: 1 } },
      { id: 'gb-5', inputs: { G3: 0, G2: 1, G1: 0, G0: 1 }, expectedOutputs: { B3: 0, B2: 1, B1: 1, B0: 0 } },
      { id: 'gb-6', inputs: { G3: 0, G2: 1, G1: 1, G0: 0 }, expectedOutputs: { B3: 0, B2: 1, B1: 0, B0: 0 } },
      { id: 'gb-7', inputs: { G3: 0, G2: 1, G1: 1, G0: 1 }, expectedOutputs: { B3: 0, B2: 1, B1: 0, B0: 1 } },
      { id: 'gb-8', inputs: { G3: 1, G2: 0, G1: 0, G0: 0 }, expectedOutputs: { B3: 1, B2: 1, B1: 1, B0: 1 } },
      { id: 'gb-9', inputs: { G3: 1, G2: 0, G1: 0, G0: 1 }, expectedOutputs: { B3: 1, B2: 1, B1: 1, B0: 0 } },
      { id: 'gb-10', inputs: { G3: 1, G2: 0, G1: 1, G0: 0 }, expectedOutputs: { B3: 1, B2: 1, B1: 0, B0: 0 } },
      { id: 'gb-11', inputs: { G3: 1, G2: 0, G1: 1, G0: 1 }, expectedOutputs: { B3: 1, B2: 1, B1: 0, B0: 1 } },
      { id: 'gb-12', inputs: { G3: 1, G2: 1, G1: 0, G0: 0 }, expectedOutputs: { B3: 1, B2: 0, B1: 0, B0: 0 } },
      { id: 'gb-13', inputs: { G3: 1, G2: 1, G1: 0, G0: 1 }, expectedOutputs: { B3: 1, B2: 0, B1: 0, B0: 1 } },
      { id: 'gb-14', inputs: { G3: 1, G2: 1, G1: 1, G0: 0 }, expectedOutputs: { B3: 1, B2: 0, B1: 1, B0: 1 } },
      { id: 'gb-15', inputs: { G3: 1, G2: 1, G1: 1, G0: 1 }, expectedOutputs: { B3: 1, B2: 0, B1: 1, B0: 0 } },
    ],
    referenceCircuit: {
      ics: [
        { instanceId: 'ic-7486-1', icDefId: '7486', startCol: 10, rotation: 0 },
      ],
      wires: [
        { id: 'w1', fromHoleId: 'vcc-src', toHoleId: 'top-power-plus-1', color: 'red' },
        { id: 'w2', fromHoleId: 'gnd-src', toHoleId: 'top-power-minus-1', color: 'black' },
        { id: 'w3', fromHoleId: 'top-power-plus-10', toHoleId: 'bb-A-10', color: 'red' },
        { id: 'w4', fromHoleId: 'top-power-minus-16', toHoleId: 'bb-J-16', color: 'black' },
        { id: 'w-b3', fromHoleId: 'd3', toHoleId: 'd11', color: 'green' },
        { id: 'w-b3-xor1', fromHoleId: 'd3', toHoleId: 'bb-J-10', color: 'blue' },
        { id: 'w-g2-xor1', fromHoleId: 'd2', toHoleId: 'bb-J-11', color: 'blue' },
        { id: 'w-b2-out', fromHoleId: 'bb-J-12', toHoleId: 'd10', color: 'green' },
        { id: 'w-b2-xor2', fromHoleId: 'bb-J-12', toHoleId: 'bb-J-13', color: 'yellow' },
        { id: 'w-g1-xor2', fromHoleId: 'd1', toHoleId: 'bb-J-14', color: 'blue' },
        { id: 'w-b1-out', fromHoleId: 'bb-J-15', toHoleId: 'd9', color: 'green' },
        { id: 'w-b1-xor3', fromHoleId: 'bb-J-15', toHoleId: 'bb-A-15', color: 'yellow' },
        { id: 'w-g0-xor3', fromHoleId: 'd0', toHoleId: 'bb-A-14', color: 'blue' },
        { id: 'w-b0-out', fromHoleId: 'bb-A-16', toHoleId: 'd8', color: 'green' },
      ],
    },
  },

  // -------------------------------------------------------------
  // EXPERIMENT 04: Half Adder (Manual Exp 3a)
  // -------------------------------------------------------------
  {
    id: 'exp-half-adder',
    number: '04',
    title: 'Half Adder',
    aim: 'To construct and verify a Half Adder combinational circuit using XOR and AND gates.',
    components: ['7486 (Quad XOR)', '7408 (Quad AND)', 'Digital Logic Trainer DLT-01', 'Jumper Wires'],
    suggestedICs: ['7486', '7408'],
    theory: `A Half Adder adds two single-bit binary inputs A and B and produces two outputs:
- SUM = A ⊕ B (implemented with XOR gate 7486)
- CARRY = A · B (implemented with AND gate 7408)`,
    procedure: [
      '1. Place 7486 (XOR) at column 5 and 7408 (AND) at column 15.',
      '2. Connect VCC (Pin 14) of both ICs to +5V, and GND (Pin 7) of both ICs to GND.',
      '3. Connect input D0 (A) to 7486 Pin 1 and 7408 Pin 1.',
      '4. Connect input D1 (B) to 7486 Pin 2 and 7408 Pin 2.',
      '5. Connect 7486 Pin 3 (SUM output) to D8.',
      '6. Connect 7408 Pin 3 (CARRY output) to D9.',
      '7. Verify truth table: 0+0=00, 0+1=01, 1+0=01, 1+1=10.',
    ],
    pinMapping: {
      inputNames: { A: 'D0', B: 'D1' },
      outputNames: { SUM: 'D8', CARRY: 'D9' },
    },
    truthTable: [
      { id: 'ha-1', inputs: { A: 0, B: 0 }, expectedOutputs: { SUM: 0, CARRY: 0 } },
      { id: 'ha-2', inputs: { A: 0, B: 1 }, expectedOutputs: { SUM: 1, CARRY: 0 } },
      { id: 'ha-3', inputs: { A: 1, B: 0 }, expectedOutputs: { SUM: 1, CARRY: 0 } },
      { id: 'ha-4', inputs: { A: 1, B: 1 }, expectedOutputs: { SUM: 0, CARRY: 1 } },
    ],
    referenceCircuit: {
      ics: [
        { instanceId: 'ic-7486-ha', icDefId: '7486', startCol: 5, rotation: 0 },
        { instanceId: 'ic-7408-ha', icDefId: '7408', startCol: 15, rotation: 0 },
      ],
      wires: [
        { id: 'w-p1', fromHoleId: 'vcc-src', toHoleId: 'top-power-plus-1', color: 'red' },
        { id: 'w-p2', fromHoleId: 'gnd-src', toHoleId: 'top-power-minus-1', color: 'black' },
        { id: 'w-vcc1', fromHoleId: 'top-power-plus-5', toHoleId: 'bb-A-5', color: 'red' },
        { id: 'w-vcc2', fromHoleId: 'top-power-plus-15', toHoleId: 'bb-A-15', color: 'red' },
        { id: 'w-gnd1', fromHoleId: 'top-power-minus-11', toHoleId: 'bb-J-11', color: 'black' },
        { id: 'w-gnd2', fromHoleId: 'top-power-minus-21', toHoleId: 'bb-J-21', color: 'black' },
        { id: 'w-in-a1', fromHoleId: 'd0', toHoleId: 'bb-J-5', color: 'blue' },
        { id: 'w-in-a2', fromHoleId: 'bb-I-5', toHoleId: 'bb-J-15', color: 'blue' },
        { id: 'w-in-b1', fromHoleId: 'd1', toHoleId: 'bb-J-6', color: 'blue' },
        { id: 'w-in-b2', fromHoleId: 'bb-I-6', toHoleId: 'bb-J-16', color: 'blue' },
        { id: 'w-out-sum', fromHoleId: 'bb-J-7', toHoleId: 'd8', color: 'green' },
        { id: 'w-out-carry', fromHoleId: 'bb-J-17', toHoleId: 'd9', color: 'green' },
      ],
    },
  },

  // -------------------------------------------------------------
  // EXPERIMENT 05: Half Subtractor (Manual Exp 3a)
  // -------------------------------------------------------------
  {
    id: 'exp-half-subtractor',
    number: '05',
    title: 'Half Subtractor',
    aim: 'To construct and verify a Half Subtractor circuit using XOR, NOT, and AND gates.',
    components: ['7486 (XOR)', '7404 (NOT)', '7408 (AND)', 'Digital Logic Trainer DLT-01', 'Jumper Wires'],
    suggestedICs: ['7486', '7404', '7408'],
    theory: `A Half Subtractor subtracts bit B from bit A:
- DIFFERENCE = A ⊕ B
- BORROW = A' · B`,
    procedure: [
      '1. Place 7486 (XOR), 7404 (NOT), and 7408 (AND) on the breadboard.',
      '2. Power all ICs: connect Pin 14 to +5V and Pin 7 to GND.',
      '3. Connect input A (D0) to 7486 Pin 1 (XOR) and 7404 Pin 1 (NOT).',
      '4. Connect input B (D1) to 7486 Pin 2 (XOR) and 7408 Pin 2 (AND).',
      '5. Connect 7404 Pin 2 (A\' output) to 7408 Pin 1 (AND).',
      '6. Connect 7486 Pin 3 to D8 (DIFFERENCE).',
      '7. Connect 7408 Pin 3 to D9 (BORROW).',
      '8. Test all combinations: 0-0=0/0, 0-1=1/1, 1-0=1/0, 1-1=0/0.',
    ],
    pinMapping: {
      inputNames: { A: 'D0', B: 'D1' },
      outputNames: { DIFF: 'D8', BORROW: 'D9' },
    },
    truthTable: [
      { id: 'hs-1', inputs: { A: 0, B: 0 }, expectedOutputs: { DIFF: 0, BORROW: 0 } },
      { id: 'hs-2', inputs: { A: 0, B: 1 }, expectedOutputs: { DIFF: 1, BORROW: 1 } },
      { id: 'hs-3', inputs: { A: 1, B: 0 }, expectedOutputs: { DIFF: 1, BORROW: 0 } },
      { id: 'hs-4', inputs: { A: 1, B: 1 }, expectedOutputs: { DIFF: 0, BORROW: 0 } },
    ],
    referenceCircuit: {
      ics: [
        { instanceId: 'ic-7486-hs', icDefId: '7486', startCol: 3, rotation: 0 },
        { instanceId: 'ic-7404-hs', icDefId: '7404', startCol: 12, rotation: 0 },
        { instanceId: 'ic-7408-hs', icDefId: '7408', startCol: 21, rotation: 0 },
      ],
      wires: [
        { id: 'w-p1', fromHoleId: 'vcc-src', toHoleId: 'top-power-plus-1', color: 'red' },
        { id: 'w-p2', fromHoleId: 'gnd-src', toHoleId: 'top-power-minus-1', color: 'black' },
        { id: 'w-v1', fromHoleId: 'top-power-plus-3', toHoleId: 'bb-A-3', color: 'red' },
        { id: 'w-v2', fromHoleId: 'top-power-plus-12', toHoleId: 'bb-A-12', color: 'red' },
        { id: 'w-v3', fromHoleId: 'top-power-plus-21', toHoleId: 'bb-A-21', color: 'red' },
        { id: 'w-g1', fromHoleId: 'top-power-minus-9', toHoleId: 'bb-J-9', color: 'black' },
        { id: 'w-g2', fromHoleId: 'top-power-minus-18', toHoleId: 'bb-J-18', color: 'black' },
        { id: 'w-g3', fromHoleId: 'top-power-minus-27', toHoleId: 'bb-J-27', color: 'black' },
        { id: 'w-a-xor', fromHoleId: 'd0', toHoleId: 'bb-J-3', color: 'blue' },
        { id: 'w-a-not', fromHoleId: 'bb-I-3', toHoleId: 'bb-J-12', color: 'blue' },
        { id: 'w-b-xor', fromHoleId: 'd1', toHoleId: 'bb-J-4', color: 'blue' },
        { id: 'w-b-and', fromHoleId: 'bb-I-4', toHoleId: 'bb-J-22', color: 'blue' },
        { id: 'w-not-and', fromHoleId: 'bb-J-13', toHoleId: 'bb-J-21', color: 'yellow' },
        { id: 'w-diff', fromHoleId: 'bb-J-5', toHoleId: 'd8', color: 'green' },
        { id: 'w-borrow', fromHoleId: 'bb-J-23', toHoleId: 'd9', color: 'green' },
      ],
    },
  },

  // -------------------------------------------------------------
  // EXPERIMENT 06: Full Adder (Manual Exp 3b)
  // -------------------------------------------------------------
  {
    id: 'exp-full-adder',
    number: '06',
    title: 'Full Adder',
    aim: 'To construct and verify a 1-bit Full Adder circuit using XOR, AND, and OR gates.',
    components: ['7486 (XOR)', '7408 (AND)', '7432 (OR)', 'Digital Logic Trainer DLT-01', 'Jumper Wires'],
    suggestedICs: ['7486', '7408', '7432'],
    theory: `A Full Adder adds three 1-bit inputs A, B, and Cin:
- SUM = A ⊕ B ⊕ Cin
- Cout = (A · B) + (Cin · (A ⊕ B))`,
    procedure: [
      '1. Insert 7486 (col 3), 7408 (col 12), and 7432 (col 21). Connect VCC to Pin 14 and GND to Pin 7 of each.',
      '2. Input A = D0, B = D1, Cin = D2. Output SUM = D8, Cout = D9.',
      '3. Connect A & B to XOR Gate 1 (pins 1,2) -> pin 3 = (A ⊕ B).',
      '4. Connect (A ⊕ B) and Cin to XOR Gate 2 (pins 4,5) -> pin 6 = SUM (D8).',
      '5. Connect A & B to AND Gate 1 (pins 1,2) -> pin 3 = (A · B).',
      '6. Connect (A ⊕ B) and Cin to AND Gate 2 (pins 4,5) -> pin 6 = Cin · (A ⊕ B).',
      '7. Connect the two AND outputs to OR Gate 1 (pins 1,2) -> pin 3 = Cout (D9).',
      '8. Test all 8 binary combinations.',
    ],
    pinMapping: {
      inputNames: { A: 'D0', B: 'D1', Cin: 'D2' },
      outputNames: { SUM: 'D8', Cout: 'D9' },
    },
    truthTable: [
      { id: 'fa-0', inputs: { A: 0, B: 0, Cin: 0 }, expectedOutputs: { SUM: 0, Cout: 0 } },
      { id: 'fa-1', inputs: { A: 0, B: 0, Cin: 1 }, expectedOutputs: { SUM: 1, Cout: 0 } },
      { id: 'fa-2', inputs: { A: 0, B: 1, Cin: 0 }, expectedOutputs: { SUM: 1, Cout: 0 } },
      { id: 'fa-3', inputs: { A: 0, B: 1, Cin: 1 }, expectedOutputs: { SUM: 0, Cout: 1 } },
      { id: 'fa-4', inputs: { A: 1, B: 0, Cin: 0 }, expectedOutputs: { SUM: 1, Cout: 0 } },
      { id: 'fa-5', inputs: { A: 1, B: 0, Cin: 1 }, expectedOutputs: { SUM: 0, Cout: 1 } },
      { id: 'fa-6', inputs: { A: 1, B: 1, Cin: 0 }, expectedOutputs: { SUM: 0, Cout: 1 } },
      { id: 'fa-7', inputs: { A: 1, B: 1, Cin: 1 }, expectedOutputs: { SUM: 1, Cout: 1 } },
    ],
    referenceCircuit: {
      ics: [
        { instanceId: 'ic-7486-fa', icDefId: '7486', startCol: 3, rotation: 0 },
        { instanceId: 'ic-7408-fa', icDefId: '7408', startCol: 12, rotation: 0 },
        { instanceId: 'ic-7432-fa', icDefId: '7432', startCol: 21, rotation: 0 },
      ],
      wires: [
        { id: 'w-p1', fromHoleId: 'vcc-src', toHoleId: 'top-power-plus-1', color: 'red' },
        { id: 'w-p2', fromHoleId: 'gnd-src', toHoleId: 'top-power-minus-1', color: 'black' },
        { id: 'w-v1', fromHoleId: 'top-power-plus-3', toHoleId: 'bb-A-3', color: 'red' },
        { id: 'w-v2', fromHoleId: 'top-power-plus-12', toHoleId: 'bb-A-12', color: 'red' },
        { id: 'w-v3', fromHoleId: 'top-power-plus-21', toHoleId: 'bb-A-21', color: 'red' },
        { id: 'w-g1', fromHoleId: 'top-power-minus-9', toHoleId: 'bb-J-9', color: 'black' },
        { id: 'w-g2', fromHoleId: 'top-power-minus-18', toHoleId: 'bb-J-18', color: 'black' },
        { id: 'w-g3', fromHoleId: 'top-power-minus-27', toHoleId: 'bb-J-27', color: 'black' },
        { id: 'w-a-xor', fromHoleId: 'd0', toHoleId: 'bb-J-3', color: 'blue' },
        { id: 'w-a-and', fromHoleId: 'bb-I-3', toHoleId: 'bb-J-12', color: 'blue' },
        { id: 'w-b-xor', fromHoleId: 'd1', toHoleId: 'bb-J-4', color: 'blue' },
        { id: 'w-b-and', fromHoleId: 'bb-I-4', toHoleId: 'bb-J-13', color: 'blue' },
        { id: 'w-ab-xor2', fromHoleId: 'bb-J-5', toHoleId: 'bb-J-6', color: 'yellow' },
        { id: 'w-ab-and2', fromHoleId: 'bb-I-5', toHoleId: 'bb-J-15', color: 'yellow' },
        { id: 'w-cin-xor', fromHoleId: 'd2', toHoleId: 'bb-J-7', color: 'blue' },
        { id: 'w-cin-and', fromHoleId: 'bb-I-7', toHoleId: 'bb-J-16', color: 'blue' },
        { id: 'w-sum', fromHoleId: 'bb-J-8', toHoleId: 'd8', color: 'green' },
        { id: 'w-ab-or', fromHoleId: 'bb-J-14', toHoleId: 'bb-J-21', color: 'orange' },
        { id: 'w-cinab-or', fromHoleId: 'bb-J-17', toHoleId: 'bb-J-22', color: 'orange' },
        { id: 'w-cout', fromHoleId: 'bb-J-23', toHoleId: 'd9', color: 'green' },
      ],
    },
  },

  // -------------------------------------------------------------
  // EXPERIMENT 07: Full Subtractor (Manual Exp 3b)
  // -------------------------------------------------------------
  {
    id: 'exp-full-subtractor',
    number: '07',
    title: 'Full Subtractor',
    aim: 'To construct and verify a 1-bit Full Subtractor using XOR, NOT, AND, and OR gates.',
    components: ['7486 (XOR)', '7404 (NOT)', '7408 (AND)', '7432 (OR)', 'Digital Logic Trainer DLT-01', 'Jumper Wires'],
    suggestedICs: ['7486', '7404', '7408', '7432'],
    theory: `A Full Subtractor subtracts bit B and borrow-in Bin (labeled C in the manual) from minuend bit A:
- DIFFERENCE (D) = A ⊕ B ⊕ Bin
- Bout = (A' · B) + (Bin · (A ⊕ B)')`,
    procedure: [
      '1. Place 7486 (col 1), 7404 (col 9), 7408 (col 17), and 7432 (col 24) on the breadboard and supply +5V (pin 14) and GND (pin 7).',
      '2. Connect A=D0, B=D1, Bin=D2. Outputs DIFF=D8, Bout=D9.',
      '3. Form DIFFERENCE using 7486 XOR Gate 1 (pins 1,2 -> 3) and Gate 2 (pins 4,5 -> 6 -> D8).',
      '4. Invert A (7404 pins 1 -> 2) and (A ⊕ B) (7404 pins 3 -> 4).',
      '5. Compute (A\' · B) using 7408 Gate 1 (pins 1,2 -> 3) and (Bin · (A ⊕ B)\') using 7408 Gate 2 (pins 4,5 -> 6).',
      '6. OR the two borrow terms using 7432 Gate 1 (pins 1,2 -> 3 -> D9).',
      '7. Verify truth table against all 8 combinations.',
    ],
    pinMapping: {
      inputNames: { A: 'D0', B: 'D1', Bin: 'D2' },
      outputNames: { DIFF: 'D8', Bout: 'D9' },
    },
    truthTable: [
      { id: 'fs-0', inputs: { A: 0, B: 0, Bin: 0 }, expectedOutputs: { DIFF: 0, Bout: 0 } },
      { id: 'fs-1', inputs: { A: 0, B: 0, Bin: 1 }, expectedOutputs: { DIFF: 1, Bout: 1 } },
      { id: 'fs-2', inputs: { A: 0, B: 1, Bin: 0 }, expectedOutputs: { DIFF: 1, Bout: 1 } },
      { id: 'fs-3', inputs: { A: 0, B: 1, Bin: 1 }, expectedOutputs: { DIFF: 0, Bout: 1 } },
      { id: 'fs-4', inputs: { A: 1, B: 0, Bin: 0 }, expectedOutputs: { DIFF: 1, Bout: 0 } },
      { id: 'fs-5', inputs: { A: 1, B: 0, Bin: 1 }, expectedOutputs: { DIFF: 0, Bout: 0 } },
      { id: 'fs-6', inputs: { A: 1, B: 1, Bin: 0 }, expectedOutputs: { DIFF: 0, Bout: 0 } },
      { id: 'fs-7', inputs: { A: 1, B: 1, Bin: 1 }, expectedOutputs: { DIFF: 1, Bout: 1 } },
    ],
    referenceCircuit: {
      ics: [
        { instanceId: 'ic-7486-fs', icDefId: '7486', startCol: 1, rotation: 0 },
        { instanceId: 'ic-7404-fs', icDefId: '7404', startCol: 9, rotation: 0 },
        { instanceId: 'ic-7408-fs', icDefId: '7408', startCol: 17, rotation: 0 },
        { instanceId: 'ic-7432-fs', icDefId: '7432', startCol: 24, rotation: 0 },
      ],
      wires: [
        { id: 'w-p1', fromHoleId: 'vcc-src', toHoleId: 'top-power-plus-1', color: 'red' },
        { id: 'w-p2', fromHoleId: 'gnd-src', toHoleId: 'top-power-minus-1', color: 'black' },
        // Power to 7486 (col 1..7), 7404 (col 9..15), 7408 (col 17..23), 7432 (col 24..30)
        { id: 'w-v1', fromHoleId: 'top-power-plus-1', toHoleId: 'bb-A-1', color: 'red' },
        { id: 'w-v2', fromHoleId: 'top-power-plus-9', toHoleId: 'bb-A-9', color: 'red' },
        { id: 'w-v3', fromHoleId: 'top-power-plus-17', toHoleId: 'bb-A-17', color: 'red' },
        { id: 'w-v4', fromHoleId: 'top-power-plus-24', toHoleId: 'bb-A-24', color: 'red' },
        { id: 'w-g1', fromHoleId: 'top-power-minus-7', toHoleId: 'bb-J-7', color: 'black' },
        { id: 'w-g2', fromHoleId: 'top-power-minus-15', toHoleId: 'bb-J-15', color: 'black' },
        { id: 'w-g3', fromHoleId: 'top-power-minus-23', toHoleId: 'bb-J-23', color: 'black' },
        { id: 'w-g4', fromHoleId: 'top-power-minus-30', toHoleId: 'bb-J-30', color: 'black' },
        // DIFF = (A ^ B) ^ Bin
        { id: 'w-a-xor', fromHoleId: 'd0', toHoleId: 'bb-J-1', color: 'blue' },
        { id: 'w-b-xor', fromHoleId: 'd1', toHoleId: 'bb-J-2', color: 'blue' },
        { id: 'w-ab-xor', fromHoleId: 'bb-J-3', toHoleId: 'bb-J-4', color: 'yellow' },
        { id: 'w-bin-xor', fromHoleId: 'd2', toHoleId: 'bb-J-5', color: 'blue' },
        { id: 'w-diff', fromHoleId: 'bb-J-6', toHoleId: 'd8', color: 'green' },
        // 7404 inversions: A' (pin 1->2 col 9->10), (A^B)' (pin 3->4 col 11->12)
        { id: 'w-a-not', fromHoleId: 'bb-I-1', toHoleId: 'bb-J-9', color: 'blue' },
        { id: 'w-ab-not', fromHoleId: 'bb-I-3', toHoleId: 'bb-J-11', color: 'yellow' },
        // 7408 AND1: A' (col 10 -> col 17) & B (col 2 -> col 18) -> col 19
        { id: 'w-na-and', fromHoleId: 'bb-J-10', toHoleId: 'bb-J-17', color: 'orange' },
        { id: 'w-b-and', fromHoleId: 'bb-I-2', toHoleId: 'bb-J-18', color: 'blue' },
        // 7408 AND2: (A^B)' (col 12 -> col 20) & Bin (col 5 -> col 21) -> col 22
        { id: 'w-nab-and', fromHoleId: 'bb-J-12', toHoleId: 'bb-J-20', color: 'orange' },
        { id: 'w-bin-and', fromHoleId: 'bb-I-5', toHoleId: 'bb-J-21', color: 'blue' },
        // 7432 OR1: (A'·B) (col 19 -> col 24) + (Bin·(A^B)') (col 22 -> col 25) -> col 26 -> D9 (Bout)
        { id: 'w-bterm1', fromHoleId: 'bb-J-19', toHoleId: 'bb-J-24', color: 'purple' },
        { id: 'w-bterm2', fromHoleId: 'bb-J-22', toHoleId: 'bb-J-25', color: 'purple' },
        { id: 'w-bout', fromHoleId: 'bb-J-26', toHoleId: 'd9', color: 'green' },
      ],
    },
  },

  // =============================================================
  // 12 PRACTICAL EXAMINATION EXPERIMENTS (SRM AP CSE 207 MANUAL)
  // =============================================================

  // -------------------------------------------------------------
  // EXPERIMENT 08 (Practical 1): 74153 – 4:1 Multiplexer (Manual Exp 4a)
  // -------------------------------------------------------------
  {
    id: 'exp-multiplexer',
    number: '08',
    title: '4:1 Multiplexer (IC 74153)',
    aim: 'To design and implement a 4:1 Multiplexer using IC 74153 and verify its truth table including active-LOW enable.',
    components: ['74153 (Dual 4:1 MUX)', 'Digital Logic Trainer DLT-01', 'Jumper Wires'],
    suggestedICs: ['74153'],
    theory: `IC 74153 contains two independent 4:1 multiplexers sharing common select lines S0 (Pin 14) and S1 (Pin 2).
For Channel A (MUX 1):
- Strobe / Enable EA' (Pin 1) is active-LOW: when EA' = 1 (HIGH), output ZA (Pin 7) is forced LOW (0).
- When EA' = 0 (LOW), ZA = I0A (Pin 6), I1A (Pin 5), I2A (Pin 4), or I3A (Pin 3) as selected by (S1, S0).`,
    procedure: [
      '1. Insert 74153 (DIP-16) at column 8.',
      '2. Connect Pin 16 (VCC) to +5V and Pin 8 (GND) to GND.',
      '3. Connect D6 to Pin 1 (EA\' active-low enable) so disable (EA\'=1) and enable (EA\'=0) states can both be tested.',
      '4. Connect D0->I0A (Pin 6), D1->I1A (Pin 5), D2->I2A (Pin 4), D3->I3A (Pin 3).',
      '5. Connect D4->Pin 14 (S0) and D5->Pin 2 (S1).',
      '6. Connect Pin 7 (ZA / 1Y) to output D8.',
      '7. Verify disabled output (EA\'=1 -> 0) and all four select combinations for 0 and 1 data.',
    ],
    pinMapping: {
      inputNames: { I0: 'D0', I1: 'D1', I2: 'D2', I3: 'D3', S0: 'D4', S1: 'D5', 'EA\'': 'D6' },
      outputNames: { Y: 'D8' },
    },
    truthTable: [
      { id: 'mux-dis-0', inputs: { 'EA\'': 1, S1: 0, S0: 0, I0: 1, I1: 1, I2: 1, I3: 1 }, expectedOutputs: { Y: 0 } },
      { id: 'mux-dis-1', inputs: { 'EA\'': 1, S1: 1, S0: 1, I0: 1, I1: 1, I2: 1, I3: 1 }, expectedOutputs: { Y: 0 } },
      { id: 'mux-0-0', inputs: { 'EA\'': 0, S1: 0, S0: 0, I0: 0, I1: 1, I2: 1, I3: 1 }, expectedOutputs: { Y: 0 } },
      { id: 'mux-0-1', inputs: { 'EA\'': 0, S1: 0, S0: 0, I0: 1, I1: 0, I2: 0, I3: 0 }, expectedOutputs: { Y: 1 } },
      { id: 'mux-1-0', inputs: { 'EA\'': 0, S1: 0, S0: 1, I0: 1, I1: 0, I2: 1, I3: 1 }, expectedOutputs: { Y: 0 } },
      { id: 'mux-1-1', inputs: { 'EA\'': 0, S1: 0, S0: 1, I0: 0, I1: 1, I2: 0, I3: 0 }, expectedOutputs: { Y: 1 } },
      { id: 'mux-2-0', inputs: { 'EA\'': 0, S1: 1, S0: 0, I0: 1, I1: 1, I2: 0, I3: 1 }, expectedOutputs: { Y: 0 } },
      { id: 'mux-2-1', inputs: { 'EA\'': 0, S1: 1, S0: 0, I0: 0, I1: 0, I2: 1, I3: 0 }, expectedOutputs: { Y: 1 } },
      { id: 'mux-3-0', inputs: { 'EA\'': 0, S1: 1, S0: 1, I0: 1, I1: 1, I2: 1, I3: 0 }, expectedOutputs: { Y: 0 } },
      { id: 'mux-3-1', inputs: { 'EA\'': 0, S1: 1, S0: 1, I0: 0, I1: 0, I2: 0, I3: 1 }, expectedOutputs: { Y: 1 } },
    ],
    referenceCircuit: {
      ics: [
        { instanceId: 'ic-74153-1', icDefId: '74153', startCol: 8, rotation: 0 },
      ],
      wires: [
        { id: 'w1', fromHoleId: 'vcc-src', toHoleId: 'top-power-plus-1', color: 'red' },
        { id: 'w2', fromHoleId: 'gnd-src', toHoleId: 'top-power-minus-1', color: 'black' },
        { id: 'w-vcc', fromHoleId: 'top-power-plus-8', toHoleId: 'bb-A-8', color: 'red' },
        { id: 'w-gnd', fromHoleId: 'top-power-minus-15', toHoleId: 'bb-J-15', color: 'black' },
        { id: 'w-strobe', fromHoleId: 'd6', toHoleId: 'bb-J-8', color: 'orange' },
        { id: 'w-s1', fromHoleId: 'd5', toHoleId: 'bb-J-9', color: 'purple' },
        { id: 'w-s0', fromHoleId: 'd4', toHoleId: 'bb-A-10', color: 'purple' },
        { id: 'w-c0', fromHoleId: 'd0', toHoleId: 'bb-J-13', color: 'blue' },
        { id: 'w-c1', fromHoleId: 'd1', toHoleId: 'bb-J-12', color: 'blue' },
        { id: 'w-c2', fromHoleId: 'd2', toHoleId: 'bb-J-11', color: 'blue' },
        { id: 'w-c3', fromHoleId: 'd3', toHoleId: 'bb-J-10', color: 'blue' },
        { id: 'w-out', fromHoleId: 'bb-J-14', toHoleId: 'd8', color: 'green' },
      ],
    },
  },

  // -------------------------------------------------------------
  // EXPERIMENT 09 (Practical 2): 74139 – 1:4 Demultiplexer (Manual Exp 4b)
  // -------------------------------------------------------------
  {
    id: 'exp-demultiplexer',
    number: '09',
    title: '1:4 Demultiplexer (IC 74139)',
    aim: 'To verify the operation of a 1-to-4 Demultiplexer using IC 74139.',
    components: ['74139 (Dual 2:4 Decoder/Demux)', 'Digital Logic Trainer DLT-01', 'Jumper Wires'],
    suggestedICs: ['74139'],
    theory: `IC 74139 is a dual 2-to-4 decoder/demultiplexer with active-LOW enable (Ea', Pin 1) and active-LOW outputs (Y0'–Y3').
Using Ea' as the data control input:
- When Ea' = 1 (HIGH), all four outputs Y0', Y1', Y2', Y3' remain HIGH (1).
- When Ea' = 0 (LOW), only the output selected by (S1, S0) = (Pin 3, Pin 2) goes LOW (0).`,
    procedure: [
      '1. Insert 74139 (DIP-16) at column 10.',
      '2. Connect Pin 16 to +5V and Pin 8 to GND.',
      '3. Connect Data/Enable input D0 to Pin 1 (Ea\' / 1G\').',
      '4. Connect Select inputs S0=D1 to Pin 2 (S0a) and S1=D2 to Pin 3 (S1a).',
      '5. Connect outputs Pin 4 (Y0a\')->D8, Pin 5 (Y1a\')->D9, Pin 6 (Y2a\')->D10, Pin 7 (Y3a\')->D11.',
      '6. Verify both Data=1 (disabled) and Data=0 (enabled) across all four select states.',
    ],
    pinMapping: {
      inputNames: { Data: 'D0', S0: 'D1', S1: 'D2' },
      outputNames: { Y0: 'D8', Y1: 'D9', Y2: 'D10', Y3: 'D11' },
    },
    truthTable: [
      { id: 'dm-dis-0', inputs: { Data: 1, S1: 0, S0: 0 }, expectedOutputs: { Y0: 1, Y1: 1, Y2: 1, Y3: 1 } },
      { id: 'dm-dis-1', inputs: { Data: 1, S1: 0, S0: 1 }, expectedOutputs: { Y0: 1, Y1: 1, Y2: 1, Y3: 1 } },
      { id: 'dm-dis-2', inputs: { Data: 1, S1: 1, S0: 0 }, expectedOutputs: { Y0: 1, Y1: 1, Y2: 1, Y3: 1 } },
      { id: 'dm-dis-3', inputs: { Data: 1, S1: 1, S0: 1 }, expectedOutputs: { Y0: 1, Y1: 1, Y2: 1, Y3: 1 } },
      { id: 'dm-0', inputs: { Data: 0, S1: 0, S0: 0 }, expectedOutputs: { Y0: 0, Y1: 1, Y2: 1, Y3: 1 } },
      { id: 'dm-1', inputs: { Data: 0, S1: 0, S0: 1 }, expectedOutputs: { Y0: 1, Y1: 0, Y2: 1, Y3: 1 } },
      { id: 'dm-2', inputs: { Data: 0, S1: 1, S0: 0 }, expectedOutputs: { Y0: 1, Y1: 1, Y2: 0, Y3: 1 } },
      { id: 'dm-3', inputs: { Data: 0, S1: 1, S0: 1 }, expectedOutputs: { Y0: 1, Y1: 1, Y2: 1, Y3: 0 } },
    ],
    referenceCircuit: {
      ics: [
        { instanceId: 'ic-74139-1', icDefId: '74139', startCol: 10, rotation: 0 },
      ],
      wires: [
        { id: 'w1', fromHoleId: 'vcc-src', toHoleId: 'top-power-plus-1', color: 'red' },
        { id: 'w2', fromHoleId: 'gnd-src', toHoleId: 'top-power-minus-1', color: 'black' },
        { id: 'w-vcc', fromHoleId: 'top-power-plus-10', toHoleId: 'bb-A-10', color: 'red' },
        { id: 'w-gnd', fromHoleId: 'top-power-minus-17', toHoleId: 'bb-J-17', color: 'black' },
        { id: 'w-data', fromHoleId: 'd0', toHoleId: 'bb-J-10', color: 'blue' },
        { id: 'w-s0', fromHoleId: 'd1', toHoleId: 'bb-J-11', color: 'purple' },
        { id: 'w-s1', fromHoleId: 'd2', toHoleId: 'bb-J-12', color: 'purple' },
        { id: 'w-y0', fromHoleId: 'bb-J-13', toHoleId: 'd8', color: 'green' },
        { id: 'w-y1', fromHoleId: 'bb-J-14', toHoleId: 'd9', color: 'green' },
        { id: 'w-y2', fromHoleId: 'bb-J-15', toHoleId: 'd10', color: 'green' },
        { id: 'w-y3', fromHoleId: 'bb-J-16', toHoleId: 'd11', color: 'green' },
      ],
    },
  },

  // -------------------------------------------------------------
  // EXPERIMENT 10 (Practical 3): 74138 – 3:8 Decoder (Manual Exp 5a)
  // -------------------------------------------------------------
  {
    id: 'exp-decoder',
    number: '10',
    title: '3-to-8 Line Decoder (IC 74138)',
    aim: 'To verify all 8 decoded active-LOW outputs and 3 enable conditions of IC 74138.',
    components: ['74138 (3-to-8 Decoder)', 'Digital Logic Trainer DLT-01', 'Jumper Wires'],
    suggestedICs: ['74138'],
    theory: `The 74138 decodes a 3-bit binary input (C, B, A) into one of 8 active-LOW outputs (Y0'–Y7').
Three enable inputs control operation (Manual p.18-19):
- E1 (G1, Pin 6) = 1 (active HIGH), E2' (G2A', Pin 4) = 0 (active LOW), E3' (G2B', Pin 5) = 0 (active LOW).
- If E1=0, E2'=1, or E3'=1, all eight outputs stay HIGH (1).`,
    procedure: [
      '1. Place 74138 (DIP-16) at column 8. Connect Pin 16 to +5V and Pin 8 to GND.',
      '2. Connect enables: E1 (Pin 6) to D3, E2\' (Pin 4) to D4, E3\' (Pin 5) to D5.',
      '3. Connect inputs: A (D0) to Pin 1, B (D1) to Pin 2, C (D2) to Pin 3.',
      '4. Connect all eight outputs Y0\'..Y7\' (Pins 15,14,13,12,11,10,9,7) to D8..D15.',
      '5. Verify all 3 disable conditions and all 8 binary input combinations (000–111).',
    ],
    pinMapping: {
      inputNames: { A: 'D0', B: 'D1', C: 'D2', E1: 'D3', 'E2\'': 'D4', 'E3\'': 'D5' },
      outputNames: { Y0: 'D8', Y1: 'D9', Y2: 'D10', Y3: 'D11', Y4: 'D12', Y5: 'D13', Y6: 'D14', Y7: 'D15' },
    },
    truthTable: [
      { id: 'dec-dis-e1', inputs: { E1: 0, 'E2\'': 0, 'E3\'': 0, C: 0, B: 0, A: 0 }, expectedOutputs: { Y0: 1, Y1: 1, Y2: 1, Y3: 1, Y4: 1, Y5: 1, Y6: 1, Y7: 1 } },
      { id: 'dec-dis-e2', inputs: { E1: 1, 'E2\'': 1, 'E3\'': 0, C: 0, B: 1, A: 0 }, expectedOutputs: { Y0: 1, Y1: 1, Y2: 1, Y3: 1, Y4: 1, Y5: 1, Y6: 1, Y7: 1 } },
      { id: 'dec-dis-e3', inputs: { E1: 1, 'E2\'': 0, 'E3\'': 1, C: 1, B: 1, A: 1 }, expectedOutputs: { Y0: 1, Y1: 1, Y2: 1, Y3: 1, Y4: 1, Y5: 1, Y6: 1, Y7: 1 } },
      { id: 'dec-0', inputs: { E1: 1, 'E2\'': 0, 'E3\'': 0, C: 0, B: 0, A: 0 }, expectedOutputs: { Y0: 0, Y1: 1, Y2: 1, Y3: 1, Y4: 1, Y5: 1, Y6: 1, Y7: 1 } },
      { id: 'dec-1', inputs: { E1: 1, 'E2\'': 0, 'E3\'': 0, C: 0, B: 0, A: 1 }, expectedOutputs: { Y0: 1, Y1: 0, Y2: 1, Y3: 1, Y4: 1, Y5: 1, Y6: 1, Y7: 1 } },
      { id: 'dec-2', inputs: { E1: 1, 'E2\'': 0, 'E3\'': 0, C: 0, B: 1, A: 0 }, expectedOutputs: { Y0: 1, Y1: 1, Y2: 0, Y3: 1, Y4: 1, Y5: 1, Y6: 1, Y7: 1 } },
      { id: 'dec-3', inputs: { E1: 1, 'E2\'': 0, 'E3\'': 0, C: 0, B: 1, A: 1 }, expectedOutputs: { Y0: 1, Y1: 1, Y2: 1, Y3: 0, Y4: 1, Y5: 1, Y6: 1, Y7: 1 } },
      { id: 'dec-4', inputs: { E1: 1, 'E2\'': 0, 'E3\'': 0, C: 1, B: 0, A: 0 }, expectedOutputs: { Y0: 1, Y1: 1, Y2: 1, Y3: 1, Y4: 0, Y5: 1, Y6: 1, Y7: 1 } },
      { id: 'dec-5', inputs: { E1: 1, 'E2\'': 0, 'E3\'': 0, C: 1, B: 0, A: 1 }, expectedOutputs: { Y0: 1, Y1: 1, Y2: 1, Y3: 1, Y4: 1, Y5: 0, Y6: 1, Y7: 1 } },
      { id: 'dec-6', inputs: { E1: 1, 'E2\'': 0, 'E3\'': 0, C: 1, B: 1, A: 0 }, expectedOutputs: { Y0: 1, Y1: 1, Y2: 1, Y3: 1, Y4: 1, Y5: 1, Y6: 0, Y7: 1 } },
      { id: 'dec-7', inputs: { E1: 1, 'E2\'': 0, 'E3\'': 0, C: 1, B: 1, A: 1 }, expectedOutputs: { Y0: 1, Y1: 1, Y2: 1, Y3: 1, Y4: 1, Y5: 1, Y6: 1, Y7: 0 } },
    ],
    referenceCircuit: {
      ics: [
        { instanceId: 'ic-74138-1', icDefId: '74138', startCol: 8, rotation: 0 },
      ],
      wires: [
        { id: 'w1', fromHoleId: 'vcc-src', toHoleId: 'top-power-plus-1', color: 'red' },
        { id: 'w2', fromHoleId: 'gnd-src', toHoleId: 'top-power-minus-1', color: 'black' },
        { id: 'w-vcc', fromHoleId: 'top-power-plus-8', toHoleId: 'bb-A-8', color: 'red' },
        { id: 'w-gnd', fromHoleId: 'top-power-minus-15', toHoleId: 'bb-J-15', color: 'black' },
        // Enables: E1 (pin 6, col 13 bot)->D3, E2' (pin 4, col 11 bot)->D4, E3' (pin 5, col 12 bot)->D5
        { id: 'w-g1', fromHoleId: 'd3', toHoleId: 'bb-J-13', color: 'orange' },
        { id: 'w-g2a', fromHoleId: 'd4', toHoleId: 'bb-J-11', color: 'orange' },
        { id: 'w-g2b', fromHoleId: 'd5', toHoleId: 'bb-J-12', color: 'orange' },
        // Inputs: A (pin 1, col 8 bot)->D0, B (pin 2, col 9 bot)->D1, C (pin 3, col 10 bot)->D2
        { id: 'w-in-a', fromHoleId: 'd0', toHoleId: 'bb-J-8', color: 'blue' },
        { id: 'w-in-b', fromHoleId: 'd1', toHoleId: 'bb-J-9', color: 'blue' },
        { id: 'w-in-c', fromHoleId: 'd2', toHoleId: 'bb-J-10', color: 'blue' },
        // All 8 active-LOW outputs Y0'..Y7' -> D8..D15
        { id: 'w-y0', fromHoleId: 'bb-A-9', toHoleId: 'd8', color: 'green' },   // pin 15
        { id: 'w-y1', fromHoleId: 'bb-A-10', toHoleId: 'd9', color: 'green' },  // pin 14
        { id: 'w-y2', fromHoleId: 'bb-A-11', toHoleId: 'd10', color: 'green' }, // pin 13
        { id: 'w-y3', fromHoleId: 'bb-A-12', toHoleId: 'd11', color: 'green' }, // pin 12
        { id: 'w-y4', fromHoleId: 'bb-A-13', toHoleId: 'd12', color: 'green' }, // pin 11
        { id: 'w-y5', fromHoleId: 'bb-A-14', toHoleId: 'd13', color: 'green' }, // pin 10
        { id: 'w-y6', fromHoleId: 'bb-A-15', toHoleId: 'd14', color: 'green' }, // pin 9
        { id: 'w-y7', fromHoleId: 'bb-J-14', toHoleId: 'd15', color: 'green' }, // pin 7
      ],
    },
  },

  // -------------------------------------------------------------
  // EXPERIMENT 11 (Practical 4): 74148 – 8:3 Priority Encoder (Manual Exp 5b)
  // -------------------------------------------------------------
  {
    id: 'exp-encoder',
    number: '11',
    title: '8-to-3 Priority Encoder (IC 74148)',
    aim: 'To verify the active-LOW truth table, priority resolution, GS\', and EO\' signals of IC 74148.',
    components: ['74148 (8-to-3 Priority Encoder)', 'Digital Logic Trainer DLT-01', 'Jumper Wires'],
    suggestedICs: ['74148'],
    theory: `The 74148 encodes 8 active-LOW data inputs (0'–7') into a 3-bit active-LOW binary code (A2', A1', A0').
Per Manual p.18-19 and TI SN74LS148 pinout:
- Inputs: 0'=Pin 10, 1'=Pin 11, 2'=Pin 12, 3'=Pin 13, 4'=Pin 1, 5'=Pin 2, 6'=Pin 3, 7'=Pin 4.
- EI' (Pin 5) = LOW enables encoding (if HIGH, all outputs A2',A1',A0',GS',EO' remain HIGH).
- GS' (Pin 14) goes LOW when enabled and at least one input is LOW.
- EO' (Pin 15) goes LOW when enabled and all 8 inputs are HIGH (inactive).
- Input 7' has highest priority; lower inputs are ignored whenever a higher-numbered input is LOW.`,
    procedure: [
      '1. Place 74148 (DIP-16) at column 8. Connect Pin 16 to +5V and Pin 8 to GND.',
      '2. Connect Pin 5 (EI\') to GND to enable the priority encoder.',
      '3. Connect inputs D0–D7 to active-LOW data pins: 0\'(Pin 10)..3\'(Pin 13) and 4\'(Pin 1)..7\'(Pin 4).',
      '4. Connect outputs: A0\' (Pin 9)->D8, A1\' (Pin 7)->D9, A2\' (Pin 6)->D10, GS\' (Pin 14)->D11, EO\' (Pin 15)->D12.',
      '5. Test all inputs inactive (all 1s -> EO\'=0, GS\'=1), each single active input, and simultaneous active inputs to verify highest-number priority.',
    ],
    pinMapping: {
      inputNames: { '0\'': 'D0', '1\'': 'D1', '2\'': 'D2', '3\'': 'D3', '4\'': 'D4', '5\'': 'D5', '6\'': 'D6', '7\'': 'D7' },
      outputNames: { 'A0\'': 'D8', 'A1\'': 'D9', 'A2\'': 'D10', 'GS\'': 'D11', 'EO\'': 'D12' },
    },
    truthTable: [
      { id: 'enc-none', inputs: { '7\'': 1, '6\'': 1, '5\'': 1, '4\'': 1, '3\'': 1, '2\'': 1, '1\'': 1, '0\'': 1 }, expectedOutputs: { 'A2\'': 1, 'A1\'': 1, 'A0\'': 1, 'GS\'': 1, 'EO\'': 0 } },
      { id: 'enc-0', inputs: { '7\'': 1, '6\'': 1, '5\'': 1, '4\'': 1, '3\'': 1, '2\'': 1, '1\'': 1, '0\'': 0 }, expectedOutputs: { 'A2\'': 1, 'A1\'': 1, 'A0\'': 1, 'GS\'': 0, 'EO\'': 1 } },
      { id: 'enc-1', inputs: { '7\'': 1, '6\'': 1, '5\'': 1, '4\'': 1, '3\'': 1, '2\'': 1, '1\'': 0, '0\'': 1 }, expectedOutputs: { 'A2\'': 1, 'A1\'': 1, 'A0\'': 0, 'GS\'': 0, 'EO\'': 1 } },
      { id: 'enc-2', inputs: { '7\'': 1, '6\'': 1, '5\'': 1, '4\'': 1, '3\'': 1, '2\'': 0, '1\'': 1, '0\'': 1 }, expectedOutputs: { 'A2\'': 1, 'A1\'': 0, 'A0\'': 1, 'GS\'': 0, 'EO\'': 1 } },
      { id: 'enc-3', inputs: { '7\'': 1, '6\'': 1, '5\'': 1, '4\'': 1, '3\'': 0, '2\'': 1, '1\'': 1, '0\'': 1 }, expectedOutputs: { 'A2\'': 1, 'A1\'': 0, 'A0\'': 0, 'GS\'': 0, 'EO\'': 1 } },
      { id: 'enc-4', inputs: { '7\'': 1, '6\'': 1, '5\'': 1, '4\'': 0, '3\'': 1, '2\'': 1, '1\'': 1, '0\'': 1 }, expectedOutputs: { 'A2\'': 0, 'A1\'': 1, 'A0\'': 1, 'GS\'': 0, 'EO\'': 1 } },
      { id: 'enc-5', inputs: { '7\'': 1, '6\'': 1, '5\'': 0, '4\'': 1, '3\'': 1, '2\'': 1, '1\'': 1, '0\'': 1 }, expectedOutputs: { 'A2\'': 0, 'A1\'': 1, 'A0\'': 0, 'GS\'': 0, 'EO\'': 1 } },
      { id: 'enc-6', inputs: { '7\'': 1, '6\'': 0, '5\'': 1, '4\'': 1, '3\'': 1, '2\'': 1, '1\'': 1, '0\'': 1 }, expectedOutputs: { 'A2\'': 0, 'A1\'': 0, 'A0\'': 1, 'GS\'': 0, 'EO\'': 1 } },
      { id: 'enc-7', inputs: { '7\'': 0, '6\'': 1, '5\'': 1, '4\'': 1, '3\'': 1, '2\'': 1, '1\'': 1, '0\'': 1 }, expectedOutputs: { 'A2\'': 0, 'A1\'': 0, 'A0\'': 0, 'GS\'': 0, 'EO\'': 1 } },
      // Multiple active inputs priority tests
      { id: 'enc-prio-3', inputs: { '7\'': 1, '6\'': 1, '5\'': 1, '4\'': 1, '3\'': 0, '2\'': 0, '1\'': 1, '0\'': 0 }, expectedOutputs: { 'A2\'': 1, 'A1\'': 0, 'A0\'': 0, 'GS\'': 0, 'EO\'': 1 } },
      { id: 'enc-prio-5', inputs: { '7\'': 1, '6\'': 1, '5\'': 0, '4\'': 0, '3\'': 1, '2\'': 0, '1\'': 0, '0\'': 1 }, expectedOutputs: { 'A2\'': 0, 'A1\'': 1, 'A0\'': 0, 'GS\'': 0, 'EO\'': 1 } },
      { id: 'enc-prio-7', inputs: { '7\'': 0, '6\'': 0, '5\'': 1, '4\'': 0, '3\'': 0, '2\'': 1, '1\'': 0, '0\'': 0 }, expectedOutputs: { 'A2\'': 0, 'A1\'': 0, 'A0\'': 0, 'GS\'': 0, 'EO\'': 1 } },
    ],
    referenceCircuit: {
      ics: [
        { instanceId: 'ic-74148-1', icDefId: '74148', startCol: 8, rotation: 0 },
      ],
      wires: [
        { id: 'w1', fromHoleId: 'vcc-src', toHoleId: 'top-power-plus-1', color: 'red' },
        { id: 'w2', fromHoleId: 'gnd-src', toHoleId: 'top-power-minus-1', color: 'black' },
        { id: 'w-vcc', fromHoleId: 'top-power-plus-8', toHoleId: 'bb-A-8', color: 'red' },
        { id: 'w-gnd', fromHoleId: 'top-power-minus-15', toHoleId: 'bb-J-15', color: 'black' },
        // EI' (pin 5, col 12 bot) -> GND
        { id: 'w-ei', fromHoleId: 'top-power-minus-12', toHoleId: 'bb-J-12', color: 'black' },
        // Inputs 0'..7' -> D0..D7
        { id: 'w-in-0', fromHoleId: 'd0', toHoleId: 'bb-A-14', color: 'blue' }, // pin 10
        { id: 'w-in-1', fromHoleId: 'd1', toHoleId: 'bb-A-13', color: 'blue' }, // pin 11
        { id: 'w-in-2', fromHoleId: 'd2', toHoleId: 'bb-A-12', color: 'blue' }, // pin 12
        { id: 'w-in-3', fromHoleId: 'd3', toHoleId: 'bb-A-11', color: 'blue' }, // pin 13
        { id: 'w-in-4', fromHoleId: 'd4', toHoleId: 'bb-J-8', color: 'blue' },  // pin 1
        { id: 'w-in-5', fromHoleId: 'd5', toHoleId: 'bb-J-9', color: 'blue' },  // pin 2
        { id: 'w-in-6', fromHoleId: 'd6', toHoleId: 'bb-J-10', color: 'blue' }, // pin 3
        { id: 'w-in-7', fromHoleId: 'd7', toHoleId: 'bb-J-11', color: 'blue' }, // pin 4
        // Outputs: A0'(pin 9)->D8, A1'(pin 7)->D9, A2'(pin 6)->D10, GS'(pin 14)->D11, EO'(pin 15)->D12
        { id: 'w-a0', fromHoleId: 'bb-A-15', toHoleId: 'd8', color: 'green' },  // pin 9
        { id: 'w-a1', fromHoleId: 'bb-J-14', toHoleId: 'd9', color: 'green' },  // pin 7
        { id: 'w-a2', fromHoleId: 'bb-J-13', toHoleId: 'd10', color: 'green' }, // pin 6
        { id: 'w-gs', fromHoleId: 'bb-A-10', toHoleId: 'd11', color: 'green' }, // pin 14
        { id: 'w-eo', fromHoleId: 'bb-A-9', toHoleId: 'd12', color: 'green' },  // pin 15
      ],
    },
  },

  // -------------------------------------------------------------
  // EXPERIMENT 12 (Practical 3): Magnitude Comparator – IC 7485, 7486, 7408, 7404
  // -------------------------------------------------------------
  {
    id: 'exp-comparator',
    number: '12',
    title: 'Magnitude Comparator (IC 7485, 7486, 7408, 7404)',
    aim: 'To design and verify a 1-bit Magnitude Comparator using basic gates (7486, 7408, 7404) and a 4-bit Magnitude Comparator using IC 7485 including cascade inputs.',
    components: [
      '7485 (4-Bit Magnitude Comparator)',
      '7486 (Quad XOR Gate)',
      '7408 (Quad AND Gate)',
      '7404 (Hex Inverter)',
      'Digital Logic Trainer DLT-01',
      'Jumper Wires',
    ],
    suggestedICs: ['7485', '7486', '7408', '7404'],
    theory: `Magnitude comparators determine the relative order of two binary numbers A and B (A > B, A = B, A < B):
1. 1-Bit Magnitude Comparator (Basic Gates: 7486, 7408, 7404):
   - (A > B) = A · B'  (7404 + 7408)
   - (A < B) = A' · B  (7404 + 7408)
   - (A = B) = (A ⊕ B)' = A'·B' + A·B  (7486 XOR + 7404 NOT = XNOR)
2. 4-Bit Magnitude Comparator (IC 7485):
   - Compares 4-bit words A3A2A1A0 and B3B2B1B0 starting from MSB (A3, B3).
   - Standalone mode: tie IA=B (Pin 3) = +5V and IA>B (Pin 4) = IA<B (Pin 2) = GND.
   - Cascade mode: when A = B, outputs OA>B, OA=B, OA<B follow cascade inputs IA>B, IA=B, IA<B.
   - Exactly one output among OA>B (Pin 5), OA=B (Pin 6), OA<B (Pin 7) goes HIGH for valid comparison conditions.`,
    discrepancyNote: `Manual vs Datasheet Note: Manual p.20 schematic illustrates a 2-bit wired subset of 7485 leaving A2, A3, B2, B3, IA<B (Pin 2), and IA>B (Pin 4) unconnected while noting Pin 3 (IA=B) = 1. Per TI SN74LS85 datasheet, unused MSB inputs must never float—either drive all 4 bits (A3..A0, B3..B0) as in the 4-Bit mode or tie unused A2,A3,B2,B3 to GND when testing cascade inputs.`,
    procedure: [
      'Part A (4-Bit Comparator using IC 7485): Place 7485 at col 8. Connect Pin 16 to +5V and Pin 8 to GND.',
      'Wire word A (A0..A3 -> Pins 10,12,13,15) to D0..D3 and word B (B0..B3 -> Pins 9,11,14,1) to D4..D7.',
      'Tie IA=B (Pin 3) to +5V, IA<B (Pin 2) and IA>B (Pin 4) to GND. Wire OA>B (5)->D8, OA=B (6)->D9, OA<B (7)->D10.',
      'Part B (Cascade Verification): Switch to the 4-Bit + Cascade variant to drive IA<B (D4), IA=B (D5), IA>B (D6) and verify cascade propagation when A = B.',
      'Part C (1-Bit Comparator using 7486, 7404, 7408): Switch to 1-Bit Gate Comparator variant; implement A>B = A·B\', A=B = (A⊕B)\', A<B = A\'·B.',
    ],
    pinMapping: {
      inputNames: { A0: 'D0', A1: 'D1', A2: 'D2', A3: 'D3', B0: 'D4', B1: 'D5', B2: 'D6', B3: 'D7' },
      outputNames: { 'A>B': 'D8', 'A=B': 'D9', 'A<B': 'D10' },
    },
    truthTable: [
      { id: 'cmp4-0-0', inputs: { A3: 0, A2: 0, A1: 0, A0: 0, B3: 0, B2: 0, B1: 0, B0: 0 }, expectedOutputs: { 'A>B': 0, 'A=B': 1, 'A<B': 0 } },
      { id: 'cmp4-5-5', inputs: { A3: 0, A2: 1, A1: 0, A0: 1, B3: 0, B2: 1, B1: 0, B0: 1 }, expectedOutputs: { 'A>B': 0, 'A=B': 1, 'A<B': 0 } },
      { id: 'cmp4-10-10', inputs: { A3: 1, A2: 0, A1: 1, A0: 0, B3: 1, B2: 0, B1: 1, B0: 0 }, expectedOutputs: { 'A>B': 0, 'A=B': 1, 'A<B': 0 } },
      { id: 'cmp4-15-15', inputs: { A3: 1, A2: 1, A1: 1, A0: 1, B3: 1, B2: 1, B1: 1, B0: 1 }, expectedOutputs: { 'A>B': 0, 'A=B': 1, 'A<B': 0 } },
      { id: 'cmp4-1-0', inputs: { A3: 0, A2: 0, A1: 0, A0: 1, B3: 0, B2: 0, B1: 0, B0: 0 }, expectedOutputs: { 'A>B': 1, 'A=B': 0, 'A<B': 0 } },
      { id: 'cmp4-8-7', inputs: { A3: 1, A2: 0, A1: 0, A0: 0, B3: 0, B2: 1, B1: 1, B0: 1 }, expectedOutputs: { 'A>B': 1, 'A=B': 0, 'A<B': 0 } },
      { id: 'cmp4-12-5', inputs: { A3: 1, A2: 1, A1: 0, A0: 0, B3: 0, B2: 1, B1: 0, B0: 1 }, expectedOutputs: { 'A>B': 1, 'A=B': 0, 'A<B': 0 } },
      { id: 'cmp4-9-8', inputs: { A3: 1, A2: 0, A1: 0, A0: 1, B3: 1, B2: 0, B1: 0, B0: 0 }, expectedOutputs: { 'A>B': 1, 'A=B': 0, 'A<B': 0 } },
      { id: 'cmp4-15-0', inputs: { A3: 1, A2: 1, A1: 1, A0: 1, B3: 0, B2: 0, B1: 0, B0: 0 }, expectedOutputs: { 'A>B': 1, 'A=B': 0, 'A<B': 0 } },
      { id: 'cmp4-0-1', inputs: { A3: 0, A2: 0, A1: 0, A0: 0, B3: 0, B2: 0, B1: 0, B0: 1 }, expectedOutputs: { 'A>B': 0, 'A=B': 0, 'A<B': 1 } },
      { id: 'cmp4-7-8', inputs: { A3: 0, A2: 1, A1: 1, A0: 1, B3: 1, B2: 0, B1: 0, B0: 0 }, expectedOutputs: { 'A>B': 0, 'A=B': 0, 'A<B': 1 } },
      { id: 'cmp4-5-12', inputs: { A3: 0, A2: 1, A1: 0, A0: 1, B3: 1, B2: 1, B1: 0, B0: 0 }, expectedOutputs: { 'A>B': 0, 'A=B': 0, 'A<B': 1 } },
      { id: 'cmp4-2-14', inputs: { A3: 0, A2: 0, A1: 1, A0: 0, B3: 1, B2: 1, B1: 1, B0: 0 }, expectedOutputs: { 'A>B': 0, 'A=B': 0, 'A<B': 1 } },
      { id: 'cmp4-0-15', inputs: { A3: 0, A2: 0, A1: 0, A0: 0, B3: 1, B2: 1, B1: 1, B0: 1 }, expectedOutputs: { 'A>B': 0, 'A=B': 0, 'A<B': 1 } },
    ],
    referenceCircuit: {
      ics: [
        { instanceId: 'ic-7485-4bit', icDefId: '7485', startCol: 8, rotation: 0 },
      ],
      wires: [
        { id: 'w1', fromHoleId: 'vcc-src', toHoleId: 'top-power-plus-1', color: 'red' },
        { id: 'w2', fromHoleId: 'gnd-src', toHoleId: 'top-power-minus-1', color: 'black' },
        { id: 'w-vcc', fromHoleId: 'top-power-plus-8', toHoleId: 'bb-A-8', color: 'red' },
        { id: 'w-gnd', fromHoleId: 'top-power-minus-15', toHoleId: 'bb-J-15', color: 'black' },
        // Cascade standalone: IA<B(pin2 col9 bot)->GND, IA=B(pin3 col10 bot)->+5V, IA>B(pin4 col11 bot)->GND
        { id: 'w-ilt', fromHoleId: 'top-power-minus-9', toHoleId: 'bb-J-9', color: 'black' },
        { id: 'w-ieq', fromHoleId: 'top-power-plus-10', toHoleId: 'bb-J-10', color: 'red' },
        { id: 'w-igt', fromHoleId: 'top-power-minus-11', toHoleId: 'bb-J-11', color: 'black' },
        // Word A (A0..A3): A0(pin10 col14 top)->D0, A1(pin12 col12 top)->D1, A2(pin13 col11 top)->D2, A3(pin15 col9 top)->D3
        { id: 'w-a0', fromHoleId: 'd0', toHoleId: 'bb-A-14', color: 'blue' },
        { id: 'w-a1', fromHoleId: 'd1', toHoleId: 'bb-A-12', color: 'blue' },
        { id: 'w-a2', fromHoleId: 'd2', toHoleId: 'bb-A-11', color: 'blue' },
        { id: 'w-a3', fromHoleId: 'd3', toHoleId: 'bb-A-9', color: 'blue' },
        // Word B (B0..B3): B0(pin9 col15 top)->D4, B1(pin11 col13 top)->D5, B2(pin14 col10 top)->D6, B3(pin1 col8 bot)->D7
        { id: 'w-b0', fromHoleId: 'd4', toHoleId: 'bb-A-15', color: 'purple' },
        { id: 'w-b1', fromHoleId: 'd5', toHoleId: 'bb-A-13', color: 'purple' },
        { id: 'w-b2', fromHoleId: 'd6', toHoleId: 'bb-A-10', color: 'purple' },
        { id: 'w-b3', fromHoleId: 'd7', toHoleId: 'bb-J-8', color: 'purple' },
        // Outputs: OA>B(pin5 col12 bot)->D8, OA=B(pin6 col13 bot)->D9, OA<B(pin7 col14 bot)->D10
        { id: 'w-ogt', fromHoleId: 'bb-J-12', toHoleId: 'd8', color: 'green' },
        { id: 'w-oeq', fromHoleId: 'bb-J-13', toHoleId: 'd9', color: 'green' },
        { id: 'w-olt', fromHoleId: 'bb-J-14', toHoleId: 'd10', color: 'green' },
      ],
    },
    variants: [
      {
        id: '4bit',
        label: '4-Bit Comparator (IC 7485)',
        description: 'Full 4-bit binary word comparison (A3..A0 via D0–D3 vs B3..B0 via D4–D7) with standalone IA=B tied HIGH.',
        suggestedICs: ['7485'],
        pinMapping: {
          inputNames: { A0: 'D0', A1: 'D1', A2: 'D2', A3: 'D3', B0: 'D4', B1: 'D5', B2: 'D6', B3: 'D7' },
          outputNames: { 'A>B': 'D8', 'A=B': 'D9', 'A<B': 'D10' },
        },
        truthTable: [
          { id: 'cmp4-0-0', inputs: { A3: 0, A2: 0, A1: 0, A0: 0, B3: 0, B2: 0, B1: 0, B0: 0 }, expectedOutputs: { 'A>B': 0, 'A=B': 1, 'A<B': 0 } },
          { id: 'cmp4-5-5', inputs: { A3: 0, A2: 1, A1: 0, A0: 1, B3: 0, B2: 1, B1: 0, B0: 1 }, expectedOutputs: { 'A>B': 0, 'A=B': 1, 'A<B': 0 } },
          { id: 'cmp4-10-10', inputs: { A3: 1, A2: 0, A1: 1, A0: 0, B3: 1, B2: 0, B1: 1, B0: 0 }, expectedOutputs: { 'A>B': 0, 'A=B': 1, 'A<B': 0 } },
          { id: 'cmp4-15-15', inputs: { A3: 1, A2: 1, A1: 1, A0: 1, B3: 1, B2: 1, B1: 1, B0: 1 }, expectedOutputs: { 'A>B': 0, 'A=B': 1, 'A<B': 0 } },
          { id: 'cmp4-1-0', inputs: { A3: 0, A2: 0, A1: 0, A0: 1, B3: 0, B2: 0, B1: 0, B0: 0 }, expectedOutputs: { 'A>B': 1, 'A=B': 0, 'A<B': 0 } },
          { id: 'cmp4-8-7', inputs: { A3: 1, A2: 0, A1: 0, A0: 0, B3: 0, B2: 1, B1: 1, B0: 1 }, expectedOutputs: { 'A>B': 1, 'A=B': 0, 'A<B': 0 } },
          { id: 'cmp4-12-5', inputs: { A3: 1, A2: 1, A1: 0, A0: 0, B3: 0, B2: 1, B1: 0, B0: 1 }, expectedOutputs: { 'A>B': 1, 'A=B': 0, 'A<B': 0 } },
          { id: 'cmp4-9-8', inputs: { A3: 1, A2: 0, A1: 0, A0: 1, B3: 1, B2: 0, B1: 0, B0: 0 }, expectedOutputs: { 'A>B': 1, 'A=B': 0, 'A<B': 0 } },
          { id: 'cmp4-15-0', inputs: { A3: 1, A2: 1, A1: 1, A0: 1, B3: 0, B2: 0, B1: 0, B0: 0 }, expectedOutputs: { 'A>B': 1, 'A=B': 0, 'A<B': 0 } },
          { id: 'cmp4-0-1', inputs: { A3: 0, A2: 0, A1: 0, A0: 0, B3: 0, B2: 0, B1: 0, B0: 1 }, expectedOutputs: { 'A>B': 0, 'A=B': 0, 'A<B': 1 } },
          { id: 'cmp4-7-8', inputs: { A3: 0, A2: 1, A1: 1, A0: 1, B3: 1, B2: 0, B1: 0, B0: 0 }, expectedOutputs: { 'A>B': 0, 'A=B': 0, 'A<B': 1 } },
          { id: 'cmp4-5-12', inputs: { A3: 0, A2: 1, A1: 0, A0: 1, B3: 1, B2: 1, B1: 0, B0: 0 }, expectedOutputs: { 'A>B': 0, 'A=B': 0, 'A<B': 1 } },
          { id: 'cmp4-2-14', inputs: { A3: 0, A2: 0, A1: 1, A0: 0, B3: 1, B2: 1, B1: 1, B0: 0 }, expectedOutputs: { 'A>B': 0, 'A=B': 0, 'A<B': 1 } },
          { id: 'cmp4-0-15', inputs: { A3: 0, A2: 0, A1: 0, A0: 0, B3: 1, B2: 1, B1: 1, B0: 1 }, expectedOutputs: { 'A>B': 0, 'A=B': 0, 'A<B': 1 } },
        ],
        connectionInstructions: [
          { signal: 'VCC / GND', from: '+5V / GND', to: '7485 Pin 16 (+5V) / Pin 8 (GND)' },
          { signal: 'A0..A3', from: 'D0, D1, D2, D3', to: '7485 Pins 10, 12, 13, 15' },
          { signal: 'B0..B3', from: 'D4, D5, D6, D7', to: '7485 Pins 9, 11, 14, 1' },
          { signal: 'Cascade Standalone', from: 'GND / +5V / GND', to: 'IA<B (Pin 2)=0, IA=B (Pin 3)=1, IA>B (Pin 4)=0' },
          { signal: 'Outputs A>B, A=B, A<B', from: '7485 Pins 5, 6, 7', to: 'D8, D9, D10 (LEDs)' },
        ],
        referenceCircuit: {
          ics: [{ instanceId: 'ic-7485-4bit', icDefId: '7485', startCol: 8, rotation: 0 }],
          wires: [
            { id: 'w1', fromHoleId: 'vcc-src', toHoleId: 'top-power-plus-1', color: 'red' },
            { id: 'w2', fromHoleId: 'gnd-src', toHoleId: 'top-power-minus-1', color: 'black' },
            { id: 'w-vcc', fromHoleId: 'top-power-plus-8', toHoleId: 'bb-A-8', color: 'red' },
            { id: 'w-gnd', fromHoleId: 'top-power-minus-15', toHoleId: 'bb-J-15', color: 'black' },
            { id: 'w-ilt', fromHoleId: 'top-power-minus-9', toHoleId: 'bb-J-9', color: 'black' },
            { id: 'w-ieq', fromHoleId: 'top-power-plus-10', toHoleId: 'bb-J-10', color: 'red' },
            { id: 'w-igt', fromHoleId: 'top-power-minus-11', toHoleId: 'bb-J-11', color: 'black' },
            { id: 'w-a0', fromHoleId: 'd0', toHoleId: 'bb-A-14', color: 'blue' },
            { id: 'w-a1', fromHoleId: 'd1', toHoleId: 'bb-A-12', color: 'blue' },
            { id: 'w-a2', fromHoleId: 'd2', toHoleId: 'bb-A-11', color: 'blue' },
            { id: 'w-a3', fromHoleId: 'd3', toHoleId: 'bb-A-9', color: 'blue' },
            { id: 'w-b0', fromHoleId: 'd4', toHoleId: 'bb-A-15', color: 'purple' },
            { id: 'w-b1', fromHoleId: 'd5', toHoleId: 'bb-A-13', color: 'purple' },
            { id: 'w-b2', fromHoleId: 'd6', toHoleId: 'bb-A-10', color: 'purple' },
            { id: 'w-b3', fromHoleId: 'd7', toHoleId: 'bb-J-8', color: 'purple' },
            { id: 'w-ogt', fromHoleId: 'bb-J-12', toHoleId: 'd8', color: 'green' },
            { id: 'w-oeq', fromHoleId: 'bb-J-13', toHoleId: 'd9', color: 'green' },
            { id: 'w-olt', fromHoleId: 'bb-J-14', toHoleId: 'd10', color: 'green' },
          ],
        },
      },
      {
        id: '4bit-cascade',
        label: '7485 Cascade Inputs Mode',
        description: '2-bit inputs (A1A0 vs B1B0, MSB tied GND) with switchable cascade lines IA<B (D4), IA=B (D5), IA>B (D6).',
        suggestedICs: ['7485'],
        pinMapping: {
          inputNames: { A0: 'D0', A1: 'D1', B0: 'D2', B1: 'D3', 'IA<B': 'D4', 'IA=B': 'D5', 'IA>B': 'D6' },
          outputNames: { 'A>B': 'D8', 'A=B': 'D9', 'A<B': 'D10' },
        },
        truthTable: [
          { id: 'cmp-00-00', inputs: { A1: 0, A0: 0, B1: 0, B0: 0, 'IA>B': 0, 'IA=B': 1, 'IA<B': 0 }, expectedOutputs: { 'A>B': 0, 'A=B': 1, 'A<B': 0 } },
          { id: 'cmp-00-01', inputs: { A1: 0, A0: 0, B1: 0, B0: 1, 'IA>B': 0, 'IA=B': 1, 'IA<B': 0 }, expectedOutputs: { 'A>B': 0, 'A=B': 0, 'A<B': 1 } },
          { id: 'cmp-00-10', inputs: { A1: 0, A0: 0, B1: 1, B0: 0, 'IA>B': 0, 'IA=B': 1, 'IA<B': 0 }, expectedOutputs: { 'A>B': 0, 'A=B': 0, 'A<B': 1 } },
          { id: 'cmp-00-11', inputs: { A1: 0, A0: 0, B1: 1, B0: 1, 'IA>B': 0, 'IA=B': 1, 'IA<B': 0 }, expectedOutputs: { 'A>B': 0, 'A=B': 0, 'A<B': 1 } },
          { id: 'cmp-01-00', inputs: { A1: 0, A0: 1, B1: 0, B0: 0, 'IA>B': 0, 'IA=B': 1, 'IA<B': 0 }, expectedOutputs: { 'A>B': 1, 'A=B': 0, 'A<B': 0 } },
          { id: 'cmp-01-01', inputs: { A1: 0, A0: 1, B1: 0, B0: 1, 'IA>B': 0, 'IA=B': 1, 'IA<B': 0 }, expectedOutputs: { 'A>B': 0, 'A=B': 1, 'A<B': 0 } },
          { id: 'cmp-01-10', inputs: { A1: 0, A0: 1, B1: 1, B0: 0, 'IA>B': 0, 'IA=B': 1, 'IA<B': 0 }, expectedOutputs: { 'A>B': 0, 'A=B': 0, 'A<B': 1 } },
          { id: 'cmp-01-11', inputs: { A1: 0, A0: 1, B1: 1, B0: 1, 'IA>B': 0, 'IA=B': 1, 'IA<B': 0 }, expectedOutputs: { 'A>B': 0, 'A=B': 0, 'A<B': 1 } },
          { id: 'cmp-10-00', inputs: { A1: 1, A0: 0, B1: 0, B0: 0, 'IA>B': 0, 'IA=B': 1, 'IA<B': 0 }, expectedOutputs: { 'A>B': 1, 'A=B': 0, 'A<B': 0 } },
          { id: 'cmp-10-01', inputs: { A1: 1, A0: 0, B1: 0, B0: 1, 'IA>B': 0, 'IA=B': 1, 'IA<B': 0 }, expectedOutputs: { 'A>B': 1, 'A=B': 0, 'A<B': 0 } },
          { id: 'cmp-10-10', inputs: { A1: 1, A0: 0, B1: 1, B0: 0, 'IA>B': 0, 'IA=B': 1, 'IA<B': 0 }, expectedOutputs: { 'A>B': 0, 'A=B': 1, 'A<B': 0 } },
          { id: 'cmp-10-11', inputs: { A1: 1, A0: 0, B1: 1, B0: 1, 'IA>B': 0, 'IA=B': 1, 'IA<B': 0 }, expectedOutputs: { 'A>B': 0, 'A=B': 0, 'A<B': 1 } },
          { id: 'cmp-11-00', inputs: { A1: 1, A0: 1, B1: 0, B0: 0, 'IA>B': 0, 'IA=B': 1, 'IA<B': 0 }, expectedOutputs: { 'A>B': 1, 'A=B': 0, 'A<B': 0 } },
          { id: 'cmp-11-01', inputs: { A1: 1, A0: 1, B1: 0, B0: 1, 'IA>B': 0, 'IA=B': 1, 'IA<B': 0 }, expectedOutputs: { 'A>B': 1, 'A=B': 0, 'A<B': 0 } },
          { id: 'cmp-11-10', inputs: { A1: 1, A0: 1, B1: 1, B0: 0, 'IA>B': 0, 'IA=B': 1, 'IA<B': 0 }, expectedOutputs: { 'A>B': 1, 'A=B': 0, 'A<B': 0 } },
          { id: 'cmp-11-11', inputs: { A1: 1, A0: 1, B1: 1, B0: 1, 'IA>B': 0, 'IA=B': 1, 'IA<B': 0 }, expectedOutputs: { 'A>B': 0, 'A=B': 1, 'A<B': 0 } },
          { id: 'cmp-cas-gt', inputs: { A1: 1, A0: 0, B1: 1, B0: 0, 'IA>B': 1, 'IA=B': 0, 'IA<B': 0 }, expectedOutputs: { 'A>B': 1, 'A=B': 0, 'A<B': 0 } },
          { id: 'cmp-cas-lt', inputs: { A1: 1, A0: 0, B1: 1, B0: 0, 'IA>B': 0, 'IA=B': 0, 'IA<B': 1 }, expectedOutputs: { 'A>B': 0, 'A=B': 0, 'A<B': 1 } },
        ],
        connectionInstructions: [
          { signal: 'VCC / GND', from: '+5V / GND', to: '7485 Pin 16 (+5V) / Pin 8 (GND)' },
          { signal: 'Unused MSB Inputs', from: 'GND', to: '7485 Pins 1 (B3), 14 (B2), 13 (A2), 15 (A3)' },
          { signal: 'A0, A1 / B0, B1', from: 'D0, D1 / D2, D3', to: '7485 Pins 10, 12 / Pins 9, 11' },
          { signal: 'Cascade IA<B, IA=B, IA>B', from: 'D4, D5, D6', to: '7485 Pins 2, 3, 4 (Set D5=1 for standalone)' },
          { signal: 'Outputs A>B, A=B, A<B', from: '7485 Pins 5, 6, 7', to: 'D8, D9, D10' },
        ],
        referenceCircuit: {
          ics: [{ instanceId: 'ic-7485-cas', icDefId: '7485', startCol: 8, rotation: 0 }],
          wires: [
            { id: 'w1', fromHoleId: 'vcc-src', toHoleId: 'top-power-plus-1', color: 'red' },
            { id: 'w2', fromHoleId: 'gnd-src', toHoleId: 'top-power-minus-1', color: 'black' },
            { id: 'w-vcc', fromHoleId: 'top-power-plus-8', toHoleId: 'bb-A-8', color: 'red' },
            { id: 'w-gnd', fromHoleId: 'top-power-minus-15', toHoleId: 'bb-J-15', color: 'black' },
            { id: 'w-b3', fromHoleId: 'top-power-minus-8', toHoleId: 'bb-J-8', color: 'black' },
            { id: 'w-a3', fromHoleId: 'top-power-minus-9', toHoleId: 'bb-A-9', color: 'black' },
            { id: 'w-b2', fromHoleId: 'top-power-minus-10', toHoleId: 'bb-A-10', color: 'black' },
            { id: 'w-a2', fromHoleId: 'top-power-minus-11', toHoleId: 'bb-A-11', color: 'black' },
            { id: 'w-a0', fromHoleId: 'd0', toHoleId: 'bb-A-14', color: 'blue' },
            { id: 'w-a1', fromHoleId: 'd1', toHoleId: 'bb-A-12', color: 'blue' },
            { id: 'w-b0', fromHoleId: 'd2', toHoleId: 'bb-A-15', color: 'purple' },
            { id: 'w-b1', fromHoleId: 'd3', toHoleId: 'bb-A-13', color: 'purple' },
            { id: 'w-ilt', fromHoleId: 'd4', toHoleId: 'bb-J-9', color: 'orange' },
            { id: 'w-ieq', fromHoleId: 'd5', toHoleId: 'bb-J-10', color: 'orange' },
            { id: 'w-igt', fromHoleId: 'd6', toHoleId: 'bb-J-11', color: 'orange' },
            { id: 'w-ogt', fromHoleId: 'bb-J-12', toHoleId: 'd8', color: 'green' },
            { id: 'w-oeq', fromHoleId: 'bb-J-13', toHoleId: 'd9', color: 'green' },
            { id: 'w-olt', fromHoleId: 'bb-J-14', toHoleId: 'd10', color: 'green' },
          ],
        },
      },
      {
        id: '1bit',
        label: '1-Bit Comparator (7486, 7404, 7408)',
        description: 'Gate-level 1-bit comparator implementing A>B = A·B\', A=B = (A⊕B)\', and A<B = A\'·B.',
        suggestedICs: ['7486', '7404', '7408'],
        pinMapping: {
          inputNames: { A: 'D0', B: 'D1' },
          outputNames: { 'A>B': 'D8', 'A=B': 'D9', 'A<B': 'D10' },
        },
        truthTable: [
          { id: 'cmp1-00', inputs: { A: 0, B: 0 }, expectedOutputs: { 'A>B': 0, 'A=B': 1, 'A<B': 0 } },
          { id: 'cmp1-01', inputs: { A: 0, B: 1 }, expectedOutputs: { 'A>B': 0, 'A=B': 0, 'A<B': 1 } },
          { id: 'cmp1-10', inputs: { A: 1, B: 0 }, expectedOutputs: { 'A>B': 1, 'A=B': 0, 'A<B': 0 } },
          { id: 'cmp1-11', inputs: { A: 1, B: 1 }, expectedOutputs: { 'A>B': 0, 'A=B': 1, 'A<B': 0 } },
        ],
        connectionInstructions: [
          { signal: 'VCC / GND', from: '+5V / GND', to: 'Pin 14 (+5V) and Pin 7 (GND) on 7486, 7404, 7408' },
          { signal: 'Input A', from: 'D0', to: '7486 Pin 1, 7404 Pin 1, 7408 Pin 1' },
          { signal: 'Input B', from: 'D1', to: '7486 Pin 2, 7404 Pin 3, 7408 Pin 5' },
          { signal: 'A\' and B\'', from: '7404 Pin 2 (A\') & Pin 4 (B\')', to: '7408 Pin 4 (A\') & Pin 2 (B\')' },
          { signal: 'A = B', from: '7486 Pin 3 -> 7404 Pin 5 -> Pin 6', to: 'D9 (LED)' },
          { signal: 'A > B / A < B', from: '7408 Pin 3 (A·B\') / Pin 6 (A\'·B)', to: 'D8 / D10 (LEDs)' },
        ],
        referenceCircuit: {
          ics: [
            { instanceId: 'ic-7486-1b', icDefId: '7486', startCol: 3, rotation: 0 },
            { instanceId: 'ic-7404-1b', icDefId: '7404', startCol: 12, rotation: 0 },
            { instanceId: 'ic-7408-1b', icDefId: '7408', startCol: 21, rotation: 0 },
          ],
          wires: [
            { id: 'w1', fromHoleId: 'vcc-src', toHoleId: 'top-power-plus-1', color: 'red' },
            { id: 'w2', fromHoleId: 'gnd-src', toHoleId: 'top-power-minus-1', color: 'black' },
            // Power for 7486 (col 3..9), 7404 (col 12..18), 7408 (col 21..27)
            { id: 'w-v1', fromHoleId: 'top-power-plus-3', toHoleId: 'bb-A-3', color: 'red' },
            { id: 'w-g1', fromHoleId: 'top-power-minus-9', toHoleId: 'bb-J-9', color: 'black' },
            { id: 'w-v2', fromHoleId: 'top-power-plus-12', toHoleId: 'bb-A-12', color: 'red' },
            { id: 'w-g2', fromHoleId: 'top-power-minus-18', toHoleId: 'bb-J-18', color: 'black' },
            { id: 'w-v3', fromHoleId: 'top-power-plus-21', toHoleId: 'bb-A-21', color: 'red' },
            { id: 'w-g3', fromHoleId: 'top-power-minus-27', toHoleId: 'bb-J-27', color: 'black' },
            // Input A (D0) -> 7486 pin1 (col3), 7404 pin1 (col12), 7408 pin1 (col21)
            { id: 'w-a1', fromHoleId: 'd0', toHoleId: 'bb-J-3', color: 'blue' },
            { id: 'w-a2', fromHoleId: 'bb-I-3', toHoleId: 'bb-J-12', color: 'blue' },
            { id: 'w-a3', fromHoleId: 'bb-I-12', toHoleId: 'bb-J-21', color: 'blue' },
            // Input B (D1) -> 7486 pin2 (col4), 7404 pin3 (col14), 7408 pin5 (col25)
            { id: 'w-b1', fromHoleId: 'd1', toHoleId: 'bb-J-4', color: 'purple' },
            { id: 'w-b2', fromHoleId: 'bb-I-4', toHoleId: 'bb-J-14', color: 'purple' },
            { id: 'w-b3', fromHoleId: 'bb-I-14', toHoleId: 'bb-J-25', color: 'purple' },
            // A=B: 7486 pin3 (col5) -> 7404 pin5 (col16) -> 7404 pin6 (col17) -> D9
            { id: 'w-xor', fromHoleId: 'bb-J-5', toHoleId: 'bb-J-16', color: 'yellow' },
            { id: 'w-eq', fromHoleId: 'bb-J-17', toHoleId: 'd9', color: 'green' },
            // A>B: 7404 pin4 (B', col15) -> 7408 pin2 (col22); 7408 pin3 (col23) -> D8
            { id: 'w-bp', fromHoleId: 'bb-J-15', toHoleId: 'bb-J-22', color: 'orange' },
            { id: 'w-gt', fromHoleId: 'bb-J-23', toHoleId: 'd8', color: 'green' },
            // A<B: 7404 pin2 (A', col13) -> 7408 pin4 (col24); 7408 pin6 (col26) -> D10
            { id: 'w-ap', fromHoleId: 'bb-J-13', toHoleId: 'bb-J-24', color: 'orange' },
            { id: 'w-lt', fromHoleId: 'bb-J-26', toHoleId: 'd10', color: 'green' },
          ],
        },
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPERIMENT 13 (Practical 6): 7400 – Clocked SR Flip-Flop (Manual Exp 7a)
  // -------------------------------------------------------------
  {
    id: 'exp-sr-flipflop',
    number: '13',
    title: 'Clocked SR Flip-Flop (IC 7400)',
    aim: 'To construct a Clocked SR Flip-Flop using 4 NAND gates (IC 7400) and verify hold, set, reset, and forbidden conditions.',
    components: ['7400 (Quad 2-Input NAND)', 'Digital Logic Trainer DLT-01', 'Jumper Wires'],
    suggestedICs: ['7400'],
    theory: `Per Manual p.22 ("R-S flip-flop using NAND gates"):
- Input steering NAND gates: Gate 1 (Pins 1=S, 2=CLK -> Pin 3=S'), Gate 2 (Pins 4=CLK, 5=R -> Pin 6=R').
- Cross-coupled NAND latch: Gate 3 (Pins 9=Q', 10=Pin 3 -> Pin 8=Q), Gate 4 (Pins 12=Q, 13=Pin 6 -> Pin 11=Q').
- When CLK = 0, both S'=1 and R'=1, so Q holds its state regardless of S and R.
- When CLK = 1: (0,0)=Hold, (0,1)=Reset (Q=0, Q'=1), (1,0)=Set (Q=1, Q'=0), (1,1)=Forbidden (Q=1, Q'=1).`,
    procedure: [
      '1. Place 7400 (DIP-14) at column 10. Connect Pin 14 to +5V and Pin 7 to GND.',
      '2. Connect S (D0) to Pin 1, R (D1) to Pin 5, and CLK (D2) to Pins 2 and 4.',
      '3. Connect Gate 1 output Pin 3 to Gate 3 input Pin 10, and Gate 2 output Pin 6 to Gate 4 input Pin 13.',
      '4. Cross-couple the latch: Pin 8 (Q) -> Pin 12, and Pin 11 (Q\') -> Pin 9.',
      '5. Connect outputs Pin 8 (Q) -> D8 and Pin 11 (Q\') -> D9.',
      '6. Verify Set, Hold, Reset, Hold, CLK=0 Hold, and Forbidden (S=1, R=1, CLK=1 -> Q=1, Q\'=1).',
    ],
    pinMapping: {
      inputNames: { S: 'D0', R: 'D1', CLK: 'D2' },
      outputNames: { Q: 'D8', Qb: 'D9' },
    },
    truthTable: [],
    sequentialTests: [
      { id: 'sr-set', label: 'Set (CLK=1, S=1, R=0)', inputs: { CLK: 1, S: 1, R: 0 }, expectedOutputs: { Q: 1, Qb: 0 }, resetState: true },
      { id: 'sr-hold-1', label: 'Hold after Set (CLK=1, S=0, R=0)', inputs: { CLK: 1, S: 0, R: 0 }, expectedOutputs: { Q: 1, Qb: 0 } },
      { id: 'sr-clk0-r', label: 'Clock Disabled (CLK=0, S=0, R=1)', inputs: { CLK: 0, S: 0, R: 1 }, expectedOutputs: { Q: 1, Qb: 0 } },
      { id: 'sr-reset', label: 'Reset (CLK=1, S=0, R=1)', inputs: { CLK: 1, S: 0, R: 1 }, expectedOutputs: { Q: 0, Qb: 1 } },
      { id: 'sr-hold-0', label: 'Hold after Reset (CLK=1, S=0, R=0)', inputs: { CLK: 1, S: 0, R: 0 }, expectedOutputs: { Q: 0, Qb: 1 } },
      { id: 'sr-clk0-s', label: 'Clock Disabled (CLK=0, S=1, R=0)', inputs: { CLK: 0, S: 1, R: 0 }, expectedOutputs: { Q: 0, Qb: 1 } },
      { id: 'sr-forb', label: 'Forbidden State (CLK=1, S=1, R=1)', inputs: { CLK: 1, S: 1, R: 1 }, expectedOutputs: { Q: 1, Qb: 1 } },
    ],
    referenceCircuit: {
      ics: [
        { instanceId: 'ic-7400-sr', icDefId: '7400', startCol: 10, rotation: 0 },
      ],
      wires: [
        { id: 'w1', fromHoleId: 'vcc-src', toHoleId: 'top-power-plus-1', color: 'red' },
        { id: 'w2', fromHoleId: 'gnd-src', toHoleId: 'top-power-minus-1', color: 'black' },
        { id: 'w-vcc', fromHoleId: 'top-power-plus-10', toHoleId: 'bb-A-10', color: 'red' },
        { id: 'w-gnd', fromHoleId: 'top-power-minus-16', toHoleId: 'bb-J-16', color: 'black' },
        // Inputs: S=D0->pin1(col10 bot), R=D1->pin5(col14 bot), CLK=D2->pin2(col11 bot)&pin4(col13 bot)
        { id: 'w-s', fromHoleId: 'd0', toHoleId: 'bb-J-10', color: 'blue' },
        { id: 'w-r', fromHoleId: 'd1', toHoleId: 'bb-J-14', color: 'blue' },
        { id: 'w-clk1', fromHoleId: 'd2', toHoleId: 'bb-J-11', color: 'orange' },
        { id: 'w-clk2', fromHoleId: 'bb-I-11', toHoleId: 'bb-J-13', color: 'orange' },
        // Gate1 out pin3(col12 bot) -> Gate3 in pin10(col14 top)
        { id: 'w-sbar', fromHoleId: 'bb-J-12', toHoleId: 'bb-A-14', color: 'yellow' },
        // Gate2 out pin6(col15 bot) -> Gate4 in pin13(col11 top)
        { id: 'w-rbar', fromHoleId: 'bb-J-15', toHoleId: 'bb-A-11', color: 'yellow' },
        // Cross-coupled latch: pin8(col16 top, Q)->pin12(col12 top); pin11(col13 top, Q')->pin9(col15 top)
        { id: 'w-q-fb', fromHoleId: 'bb-B-16', toHoleId: 'bb-A-12', color: 'purple' },
        { id: 'w-qb-fb', fromHoleId: 'bb-B-13', toHoleId: 'bb-A-15', color: 'purple' },
        // Outputs
        { id: 'w-q', fromHoleId: 'bb-A-16', toHoleId: 'd8', color: 'green' },
        { id: 'w-qb', fromHoleId: 'bb-A-13', toHoleId: 'd9', color: 'green' },
      ],
    },
  },

  // -------------------------------------------------------------
  // EXPERIMENT 14 (Practical 7): 7476 – JK Flip-Flop (Manual Exp 7b)
  // -------------------------------------------------------------
  {
    id: 'exp-jk-flipflop',
    number: '14',
    title: 'JK Flip-Flop (IC 7476)',
    aim: 'To verify synchronous J-K states (Hold, Reset, Set, Toggle) and asynchronous Preset/Clear on IC 7476.',
    components: ['7476 (Dual J-K Flip-Flop)', 'Digital Logic Trainer DLT-01', 'Jumper Wires'],
    suggestedICs: ['7476'],
    theory: `IC 7476 contains two J-K flip-flops with active-LOW asynchronous Preset (PRE') and Clear (CLR').
Notice NON-STANDARD power pins: VCC = Pin 5, GND = Pin 13.
Truth Table (when PRE'=1, CLR'=1):
- J=0, K=0 -> Hold (no change on falling clock edge)
- J=0, K=1 -> Reset (Q=0, Q'=1)
- J=1, K=0 -> Set (Q=1, Q'=0)
- J=1, K=1 -> Toggle (Q becomes Q')`,
    discrepancyNote: `Manual vs Datasheet Note: Manual p.21 prose states "when a positive edge arrives", whereas Manual p.22 schematic draws a clock inversion bubble (o>) on Pin 1 and TI SN74LS76A / SN7476 is negative-edge triggered (falling edge HIGH → LOW). Simulation implements falling-edge clocking matching the manual schematic bubble and datasheet.`,
    procedure: [
      '1. Insert 7476 (DIP-16) at column 8.',
      '2. Connect NON-STANDARD power: Pin 5 (VCC) to +5V and Pin 13 (GND) to GND.',
      '3. Connect J=D0 (Pin 4), K=D1 (Pin 16), CLK=D2 (Pin 1), PRE\'=D3 (Pin 2), CLR\'=D4 (Pin 3).',
      '4. Connect outputs Q (Pin 15)->D8 and Q\' (Pin 14)->D9.',
      '5. Verify asynchronous PRE\'/CLR\', falling-edge J/K operations, and non-triggering on rising edges.',
    ],
    pinMapping: {
      inputNames: { J: 'D0', K: 'D1', CLK: 'D2', 'PRE\'': 'D3', 'CLR\'': 'D4' },
      outputNames: { Q: 'D8', Qb: 'D9' },
    },
    truthTable: [],
    sequentialTests: [
      { id: 'jk-clr', label: 'Async Clear (PRE\'=1, CLR\'=0)', inputs: { 'PRE\'': 1, 'CLR\'': 0, CLK: 1, J: 0, K: 0 }, expectedOutputs: { Q: 0, Qb: 1 }, resetState: true },
      { id: 'jk-hold-fall', label: 'J=0, K=0 Hold (Falling Edge)', inputs: { 'PRE\'': 1, 'CLR\'': 1, CLK: 0, J: 0, K: 0 }, expectedOutputs: { Q: 0, Qb: 1 } },
      { id: 'jk-set-rise', label: 'J=1, K=0 Rising Edge (Must Hold 0)', inputs: { 'PRE\'': 1, 'CLR\'': 1, CLK: 1, J: 1, K: 0 }, expectedOutputs: { Q: 0, Qb: 1 } },
      { id: 'jk-set-fall', label: 'J=1, K=0 Set (Falling Edge)', inputs: { 'PRE\'': 1, 'CLR\'': 1, CLK: 0, J: 1, K: 0 }, expectedOutputs: { Q: 1, Qb: 0 } },
      { id: 'jk-rst-rise', label: 'J=0, K=1 Rising Edge (Must Hold 1)', inputs: { 'PRE\'': 1, 'CLR\'': 1, CLK: 1, J: 0, K: 1 }, expectedOutputs: { Q: 1, Qb: 0 } },
      { id: 'jk-rst-fall', label: 'J=0, K=1 Reset (Falling Edge)', inputs: { 'PRE\'': 1, 'CLR\'': 1, CLK: 0, J: 0, K: 1 }, expectedOutputs: { Q: 0, Qb: 1 } },
      { id: 'jk-tog-1a', label: 'Toggle Prep (CLK=1, J=1, K=1)', inputs: { 'PRE\'': 1, 'CLR\'': 1, CLK: 1, J: 1, K: 1 }, expectedOutputs: { Q: 0, Qb: 1 } },
      { id: 'jk-tog-1b', label: 'J=1, K=1 Toggle 0->1 (Falling Edge)', inputs: { 'PRE\'': 1, 'CLR\'': 1, CLK: 0, J: 1, K: 1 }, expectedOutputs: { Q: 1, Qb: 0 } },
      { id: 'jk-tog-2a', label: 'Toggle Prep 2 (CLK=1, J=1, K=1)', inputs: { 'PRE\'': 1, 'CLR\'': 1, CLK: 1, J: 1, K: 1 }, expectedOutputs: { Q: 1, Qb: 0 } },
      { id: 'jk-tog-2b', label: 'J=1, K=1 Toggle 1->0 (Falling Edge)', inputs: { 'PRE\'': 1, 'CLR\'': 1, CLK: 0, J: 1, K: 1 }, expectedOutputs: { Q: 0, Qb: 1 } },
      { id: 'jk-pre', label: 'Async Preset (PRE\'=0, CLR\'=1)', inputs: { 'PRE\'': 0, 'CLR\'': 1, CLK: 0, J: 0, K: 0 }, expectedOutputs: { Q: 1, Qb: 0 } },
      { id: 'jk-inv', label: 'Async Invalid (PRE\'=0, CLR\'=0)', inputs: { 'PRE\'': 0, 'CLR\'': 0, CLK: 0, J: 0, K: 0 }, expectedOutputs: { Q: 1, Qb: 1 } },
    ],
    referenceCircuit: {
      ics: [
        { instanceId: 'ic-7476-1', icDefId: '7476', startCol: 8, rotation: 0 },
      ],
      wires: [
        { id: 'w1', fromHoleId: 'vcc-src', toHoleId: 'top-power-plus-1', color: 'red' },
        { id: 'w2', fromHoleId: 'gnd-src', toHoleId: 'top-power-minus-1', color: 'black' },
        // Non-standard power: VCC = pin 5 (col 12 bot), GND = pin 13 (col 11 top)
        { id: 'w-vcc', fromHoleId: 'top-power-plus-12', toHoleId: 'bb-J-12', color: 'red' },
        { id: 'w-gnd', fromHoleId: 'top-power-minus-11', toHoleId: 'bb-A-11', color: 'black' },
        // Inputs: J=D0->pin4(col11 bot), K=D1->pin16(col8 top), CLK=D2->pin1(col8 bot), PRE'=D3->pin2(col9 bot), CLR'=D4->pin3(col10 bot)
        { id: 'w-j', fromHoleId: 'd0', toHoleId: 'bb-J-11', color: 'blue' },
        { id: 'w-k', fromHoleId: 'd1', toHoleId: 'bb-A-8', color: 'blue' },
        { id: 'w-clk', fromHoleId: 'd2', toHoleId: 'bb-J-8', color: 'orange' },
        { id: 'w-pre', fromHoleId: 'd3', toHoleId: 'bb-J-9', color: 'purple' },
        { id: 'w-clr', fromHoleId: 'd4', toHoleId: 'bb-J-10', color: 'purple' },
        // Outputs: Q(pin15 col9 top)->D8, Q'(pin14 col10 top)->D9
        { id: 'w-q', fromHoleId: 'bb-A-9', toHoleId: 'd8', color: 'green' },
        { id: 'w-qb', fromHoleId: 'bb-A-10', toHoleId: 'd9', color: 'green' },
      ],
    },
  },

  // -------------------------------------------------------------
  // EXPERIMENT 15 (Practical 8): 7474 – D Flip-Flop (Manual Exp 7c)
  // -------------------------------------------------------------
  {
    id: 'exp-d-flipflop',
    number: '15',
    title: 'D Flip-Flop (IC 7474)',
    aim: 'To verify positive-edge-triggered data capture and asynchronous Preset/Clear operation of IC 7474.',
    components: ['7474 (Dual D Flip-Flop)', 'Digital Logic Trainer DLT-01', 'Jumper Wires'],
    suggestedICs: ['7474'],
    theory: `IC 7474 contains two positive-edge-triggered (LOW → HIGH) D flip-flops with active-LOW asynchronous Preset (PRE') and Clear (CLR').
- Changing D without a rising clock edge must NOT change stored Q.
- On the rising edge of CLK (0 → 1), Q captures D.`,
    discrepancyNote: `Manual vs Datasheet Note: Manual p.21 Theory prose describes a level-sensitive transparent D latch ("when clock is high, Q is forced to equal D"), whereas IC 7474 (TI SN74LS74A, p.23 schematic and Exp 8 shift registers) is strictly positive-edge-triggered (LOW → HIGH). Manual p.23 also omits PRE'/CLR' voltage connections; here PRE' (Pin 4) and CLR' (Pin 1) are wired to D2 and D3 so they are cleanly driven and testable.`,
    procedure: [
      '1. Place 7474 (DIP-14) at column 10. Connect Pin 14 to +5V and Pin 7 to GND.',
      '2. Connect D=D0 (Pin 2), CLK=D1 (Pin 3), PRE\'=D2 (Pin 4), CLR\'=D3 (Pin 1).',
      '3. Connect outputs 1Q (Pin 5)->D8 and 1Q\' (Pin 6)->D9.',
      '4. Verify changing D without a clock edge holds state, rising edges capture D, falling edges hold state, and PRE\'/CLR\' override synchronously.',
    ],
    pinMapping: {
      inputNames: { D: 'D0', CLK: 'D1', 'PRE\'': 'D2', 'CLR\'': 'D3' },
      outputNames: { Q: 'D8', Qb: 'D9' },
    },
    truthTable: [],
    sequentialTests: [
      { id: 'd-clr', label: 'Async Clear (PRE\'=1, CLR\'=0)', inputs: { 'PRE\'': 1, 'CLR\'': 0, CLK: 0, D: 0 }, expectedOutputs: { Q: 0, Qb: 1 }, resetState: true },
      { id: 'd-hold-lo', label: 'D=1 while CLK=0 (No Edge, Holds 0)', inputs: { 'PRE\'': 1, 'CLR\'': 1, CLK: 0, D: 1 }, expectedOutputs: { Q: 0, Qb: 1 } },
      { id: 'd-cap-1', label: 'Rising Edge CLK 0->1 Captures D=1', inputs: { 'PRE\'': 1, 'CLR\'': 1, CLK: 1, D: 1 }, expectedOutputs: { Q: 1, Qb: 0 } },
      { id: 'd-hold-hi', label: 'D=0 while CLK=1 (No Edge, Holds 1)', inputs: { 'PRE\'': 1, 'CLR\'': 1, CLK: 1, D: 0 }, expectedOutputs: { Q: 1, Qb: 0 } },
      { id: 'd-fall', label: 'Falling Edge CLK 1->0 (Holds 1)', inputs: { 'PRE\'': 1, 'CLR\'': 1, CLK: 0, D: 0 }, expectedOutputs: { Q: 1, Qb: 0 } },
      { id: 'd-cap-0', label: 'Rising Edge CLK 0->1 Captures D=0', inputs: { 'PRE\'': 1, 'CLR\'': 1, CLK: 1, D: 0 }, expectedOutputs: { Q: 0, Qb: 1 } },
      { id: 'd-pre', label: 'Async Preset (PRE\'=0, CLR\'=1)', inputs: { 'PRE\'': 0, 'CLR\'': 1, CLK: 0, D: 0 }, expectedOutputs: { Q: 1, Qb: 0 } },
      { id: 'd-inv', label: 'Async Invalid (PRE\'=0, CLR\'=0)', inputs: { 'PRE\'': 0, 'CLR\'': 0, CLK: 0, D: 0 }, expectedOutputs: { Q: 1, Qb: 1 } },
    ],
    referenceCircuit: {
      ics: [
        { instanceId: 'ic-7474-1', icDefId: '7474', startCol: 10, rotation: 0 },
      ],
      wires: [
        { id: 'w1', fromHoleId: 'vcc-src', toHoleId: 'top-power-plus-1', color: 'red' },
        { id: 'w2', fromHoleId: 'gnd-src', toHoleId: 'top-power-minus-1', color: 'black' },
        { id: 'w-vcc', fromHoleId: 'top-power-plus-10', toHoleId: 'bb-A-10', color: 'red' },
        { id: 'w-gnd', fromHoleId: 'top-power-minus-16', toHoleId: 'bb-J-16', color: 'black' },
        // Inputs: CLR'=D3->pin1(col10 bot), D=D0->pin2(col11 bot), CLK=D1->pin3(col12 bot), PRE'=D2->pin4(col13 bot)
        { id: 'w-clr', fromHoleId: 'd3', toHoleId: 'bb-J-10', color: 'purple' },
        { id: 'w-d', fromHoleId: 'd0', toHoleId: 'bb-J-11', color: 'blue' },
        { id: 'w-clk', fromHoleId: 'd1', toHoleId: 'bb-J-12', color: 'orange' },
        { id: 'w-pre', fromHoleId: 'd2', toHoleId: 'bb-J-13', color: 'purple' },
        // Outputs: Q(pin5 col14 bot)->D8, Q'(pin6 col15 bot)->D9
        { id: 'w-q', fromHoleId: 'bb-J-14', toHoleId: 'd8', color: 'green' },
        { id: 'w-qb', fromHoleId: 'bb-J-15', toHoleId: 'd9', color: 'green' },
      ],
    },
  },

  // -------------------------------------------------------------
  // EXPERIMENT 16 (Practical 9): T Flip-Flop using 7476 (Manual Exp 7d)
  // -------------------------------------------------------------
  {
    id: 'exp-t-flipflop',
    number: '16',
    title: 'T Flip-Flop using IC 7476',
    aim: 'To construct a Toggle (T) Flip-Flop by tying J and K inputs together on IC 7476 and verify frequency division by 2.',
    components: ['7476 (Dual J-K Flip-Flop)', 'Digital Logic Trainer DLT-01', 'Jumper Wires'],
    suggestedICs: ['7476'],
    theory: `Connecting J = K = T converts a J-K flip-flop (7476) into a T flip-flop (Manual p.22):
- T = 0: Hold (no change on active clock edge)
- T = 1: Toggle on every falling clock edge (output frequency = f_clk / 2).`,
    discrepancyNote: `Note: Consistent with IC 7476 (SN74LS76A) and Manual p.22 schematic clock bubble, toggling occurs on the falling edge (HIGH → LOW) of CLK, giving exact divide-by-2 frequency division across full clock periods.`,
    procedure: [
      '1. Insert 7476 (DIP-16) at column 8. Connect Pin 5 (VCC) to +5V and Pin 13 (GND) to GND.',
      '2. Tie Pin 2 (1PRE\') to +5V. Connect Pin 3 (1CLR\') to D2 for deterministic reset.',
      '3. Tie Pin 4 (1J) and Pin 16 (1K) together to input T (D0).',
      '4. Connect CLK (D1) to Pin 1 (1CLK\').',
      '5. Connect outputs Q (Pin 15)->D8 and Q\' (Pin 14)->D9.',
      '6. Verify T=0 holds state and T=1 toggles Q once per full clock cycle (divide-by-2).',
    ],
    pinMapping: {
      inputNames: { T: 'D0', CLK: 'D1', 'CLR\'': 'D2' },
      outputNames: { Q: 'D8', Qb: 'D9' },
    },
    truthTable: [],
    sequentialTests: [
      { id: 't-clr', label: 'Async Clear (CLR\'=0)', inputs: { 'CLR\'': 0, CLK: 1, T: 0 }, expectedOutputs: { Q: 0, Qb: 1 }, resetState: true },
      { id: 't-hold-fall', label: 'T=0 Hold (Falling Edge)', inputs: { 'CLR\'': 1, CLK: 0, T: 0 }, expectedOutputs: { Q: 0, Qb: 1 } },
      { id: 't-hold-rise', label: 'T=0 Hold (Rising Edge)', inputs: { 'CLR\'': 1, CLK: 1, T: 0 }, expectedOutputs: { Q: 0, Qb: 1 } },
      { id: 't-c1-hi', label: 'Pulse 1 Rising (T=1, Holds 0)', inputs: { 'CLR\'': 1, CLK: 1, T: 1 }, expectedOutputs: { Q: 0, Qb: 1 } },
      { id: 't-c1-lo', label: 'Pulse 1 Falling (Toggles 0->1)', inputs: { 'CLR\'': 1, CLK: 0, T: 1 }, expectedOutputs: { Q: 1, Qb: 0 } },
      { id: 't-c2-hi', label: 'Pulse 2 Rising (T=1, Holds 1)', inputs: { 'CLR\'': 1, CLK: 1, T: 1 }, expectedOutputs: { Q: 1, Qb: 0 } },
      { id: 't-c2-lo', label: 'Pulse 2 Falling (Toggles 1->0, Div-by-2)', inputs: { 'CLR\'': 1, CLK: 0, T: 1 }, expectedOutputs: { Q: 0, Qb: 1 } },
      { id: 't-c3-hi', label: 'Pulse 3 Rising (T=1, Holds 0)', inputs: { 'CLR\'': 1, CLK: 1, T: 1 }, expectedOutputs: { Q: 0, Qb: 1 } },
      { id: 't-c3-lo', label: 'Pulse 3 Falling (Toggles 0->1)', inputs: { 'CLR\'': 1, CLK: 0, T: 1 }, expectedOutputs: { Q: 1, Qb: 0 } },
    ],
    referenceCircuit: {
      ics: [
        { instanceId: 'ic-7476-t', icDefId: '7476', startCol: 8, rotation: 0 },
      ],
      wires: [
        { id: 'w1', fromHoleId: 'vcc-src', toHoleId: 'top-power-plus-1', color: 'red' },
        { id: 'w2', fromHoleId: 'gnd-src', toHoleId: 'top-power-minus-1', color: 'black' },
        { id: 'w-vcc', fromHoleId: 'top-power-plus-12', toHoleId: 'bb-J-12', color: 'red' },  // pin 5
        { id: 'w-gnd', fromHoleId: 'top-power-minus-11', toHoleId: 'bb-A-11', color: 'black' }, // pin 13
        // 1PRE' (pin 2, col 9 bot) -> +5V
        { id: 'w-pre', fromHoleId: 'top-power-plus-9', toHoleId: 'bb-J-9', color: 'red' },
        // CLR'=D2->pin3(col10 bot)
        { id: 'w-clr', fromHoleId: 'd2', toHoleId: 'bb-J-10', color: 'purple' },
        // CLK=D1->pin1(col8 bot)
        { id: 'w-clk', fromHoleId: 'd1', toHoleId: 'bb-J-8', color: 'orange' },
        // T=D0 -> 1J(pin4 col11 bot) bridged to 1K(pin16 col8 top)
        { id: 'w-tj', fromHoleId: 'd0', toHoleId: 'bb-J-11', color: 'blue' },
        { id: 'w-tk', fromHoleId: 'bb-I-11', toHoleId: 'bb-A-8', color: 'blue' },
        // Outputs: Q(pin15 col9 top)->D8, Q'(pin14 col10 top)->D9
        { id: 'w-q', fromHoleId: 'bb-A-9', toHoleId: 'd8', color: 'green' },
        { id: 'w-qb', fromHoleId: 'bb-A-10', toHoleId: 'd9', color: 'green' },
      ],
    },
  },

  // -------------------------------------------------------------
  // EXPERIMENT 17 (Practical 10): 3-bit Ring Counter (Manual Exp 8a)
  // -------------------------------------------------------------
  {
    id: 'exp-ring-counter',
    number: '17',
    title: '3-Bit Ring Counter (IC 7474)',
    aim: 'To construct a 3-bit Ring Counter using two 7474 ICs and verify the circulating 100 → 010 → 001 → 100 sequence.',
    components: ['2 × 7474 (Dual D Flip-Flop)', 'Digital Logic Trainer DLT-01', 'Jumper Wires'],
    suggestedICs: ['7474'],
    theory: `A 3-bit Ring Counter shifts Q2 -> Q1 -> Q0 and feeds Q0 back to D2 (Manual p.24).
Initialized via ORI' = 0 (active-LOW):
- FF1 (Q2) is Preset to 1 via 1PRE' (IC1 Pin 4) = ORI', with 1CLR' (Pin 1) = +5V.
- FF2 (Q1) and FF3 (Q0) are Cleared to 0 via 2CLR' (IC1 Pin 13) and 1CLR' (IC2 Pin 1) = ORI', with PRE' = +5V.
With ORI' = 1, rising edges on CLK step cleanly through: 100 -> 010 -> 001 -> 100.`,
    discrepancyNote: `Manual Diagram Correction (p.24): The printed diagram overlaps the ORI i/p line near FF1 Pin 1 while omitting +5V above FF1 Pin 4 (PRE'). To produce the manual's exact 100 initial state on ORI'=0, ORI' drives FF1 PRE' (IC1 Pin 4) and FF2/FF3 CLR' (IC1 Pin 13, IC2 Pin 1), while FF1 CLR' (IC1 Pin 1) and FF2/FF3 PRE' (IC1 Pin 10, IC2 Pin 4) are tied to +5V.`,
    procedure: [
      '1. Place two 7474 ICs at Col 4 (FF1=Q2, FF2=Q1) and Col 15 (FF3=Q0). Connect Pin 14 to +5V and Pin 7 to GND on both.',
      '2. Connect CLK (D0) to IC1 Pin 3, IC1 Pin 11, and IC2 Pin 3.',
      '3. Connect ORI\' (D1) to IC1 Pin 4 (PRE1\'), IC1 Pin 13 (CLR2\'), and IC2 Pin 1 (CLR3\'); tie IC1 Pin 1, IC1 Pin 10, and IC2 Pin 4 to +5V.',
      '4. Connect shift chain: Q2 (IC1 Pin 5)->D1 (IC1 Pin 12), Q1 (IC1 Pin 9)->D0 (IC2 Pin 2), and Q0 (IC2 Pin 5)->D2 (IC1 Pin 2).',
      '5. Connect outputs Q2->D8, Q1->D9, Q0->D10 and verify 100 -> 010 -> 001 -> 100 repeating.',
    ],
    pinMapping: {
      inputNames: { CLK: 'D0', 'ORI\'': 'D1' },
      outputNames: { Q2: 'D8', Q1: 'D9', Q0: 'D10' },
    },
    truthTable: [],
    sequentialTests: [
      { id: 'rc-init', label: 'Initialize 100 (ORI\'=0, CLK=0)', inputs: { 'ORI\'': 0, CLK: 0 }, expectedOutputs: { Q2: 1, Q1: 0, Q0: 0 }, resetState: true },
      { id: 'rc-hold0', label: 'Release ORI\'=1 (No Edge, Holds 100)', inputs: { 'ORI\'': 1, CLK: 0 }, expectedOutputs: { Q2: 1, Q1: 0, Q0: 0 } },
      { id: 'rc-clk1-hi', label: 'Clock 1 Rising -> 010', inputs: { 'ORI\'': 1, CLK: 1 }, expectedOutputs: { Q2: 0, Q1: 1, Q0: 0 } },
      { id: 'rc-clk1-lo', label: 'Clock 1 Falling (Holds 010)', inputs: { 'ORI\'': 1, CLK: 0 }, expectedOutputs: { Q2: 0, Q1: 1, Q0: 0 } },
      { id: 'rc-clk2-hi', label: 'Clock 2 Rising -> 001', inputs: { 'ORI\'': 1, CLK: 1 }, expectedOutputs: { Q2: 0, Q1: 0, Q0: 1 } },
      { id: 'rc-clk2-lo', label: 'Clock 2 Falling (Holds 001)', inputs: { 'ORI\'': 1, CLK: 0 }, expectedOutputs: { Q2: 0, Q1: 0, Q0: 1 } },
      { id: 'rc-clk3-hi', label: 'Clock 3 Rising -> 100 (Repeat)', inputs: { 'ORI\'': 1, CLK: 1 }, expectedOutputs: { Q2: 1, Q1: 0, Q0: 0 } },
      { id: 'rc-clk3-lo', label: 'Clock 3 Falling (Holds 100)', inputs: { 'ORI\'': 1, CLK: 0 }, expectedOutputs: { Q2: 1, Q1: 0, Q0: 0 } },
      { id: 'rc-clk4-hi', label: 'Clock 4 Rising -> 010 (Cycle 2)', inputs: { 'ORI\'': 1, CLK: 1 }, expectedOutputs: { Q2: 0, Q1: 1, Q0: 0 } },
    ],
    referenceCircuit: {
      ics: [
        { instanceId: 'ic-7474-rc1', icDefId: '7474', startCol: 4, rotation: 0 },
        { instanceId: 'ic-7474-rc2', icDefId: '7474', startCol: 15, rotation: 0 },
      ],
      wires: [
        { id: 'w1', fromHoleId: 'vcc-src', toHoleId: 'top-power-plus-1', color: 'red' },
        { id: 'w2', fromHoleId: 'gnd-src', toHoleId: 'top-power-minus-1', color: 'black' },
        // IC1 (col 4..10) & IC2 (col 15..21) power
        { id: 'w-v1', fromHoleId: 'top-power-plus-4', toHoleId: 'bb-A-4', color: 'red' },
        { id: 'w-g1', fromHoleId: 'top-power-minus-10', toHoleId: 'bb-J-10', color: 'black' },
        { id: 'w-v2', fromHoleId: 'top-power-plus-15', toHoleId: 'bb-A-15', color: 'red' },
        { id: 'w-g2', fromHoleId: 'top-power-minus-21', toHoleId: 'bb-J-21', color: 'black' },
        // Common CLK (D0): IC1 pin3(col6 bot), IC1 pin11(col7 top), IC2 pin3(col17 bot)
        { id: 'w-clk1', fromHoleId: 'd0', toHoleId: 'bb-J-6', color: 'orange' },
        { id: 'w-clk2', fromHoleId: 'bb-I-6', toHoleId: 'bb-A-7', color: 'orange' },
        { id: 'w-clk3', fromHoleId: 'bb-B-7', toHoleId: 'bb-J-17', color: 'orange' },
        // ORI' (D1): IC1 1PRE'(pin4 col7 bot), IC1 2CLR'(pin13 col5 top), IC2 1CLR'(pin1 col15 bot)
        { id: 'w-ori1', fromHoleId: 'd1', toHoleId: 'bb-J-7', color: 'purple' },
        { id: 'w-ori2', fromHoleId: 'bb-I-7', toHoleId: 'bb-A-5', color: 'purple' },
        { id: 'w-ori3', fromHoleId: 'bb-B-5', toHoleId: 'bb-J-15', color: 'purple' },
        // Inactive async pins tied +5V: IC1 1CLR'(pin1 col4 bot), IC1 2PRE'(pin10 col8 top), IC2 1PRE'(pin4 col18 bot)
        { id: 'w-clr1-hi', fromHoleId: 'top-power-plus-4', toHoleId: 'bb-J-4', color: 'red' },
        { id: 'w-pre2-hi', fromHoleId: 'top-power-plus-8', toHoleId: 'bb-A-8', color: 'red' },
        { id: 'w-pre3-hi', fromHoleId: 'top-power-plus-18', toHoleId: 'bb-J-18', color: 'red' },
        // Shift feedback chain: Q2(IC1 pin5 col8 bot)->D1(IC1 pin12 col6 top); Q1(IC1 pin9 col9 top)->D0(IC2 pin2 col16 bot); Q0(IC2 pin5 col19 bot)->D2(IC1 pin2 col5 bot)
        { id: 'w-s1', fromHoleId: 'bb-J-8', toHoleId: 'bb-A-6', color: 'yellow' },
        { id: 'w-s2', fromHoleId: 'bb-A-9', toHoleId: 'bb-J-16', color: 'yellow' },
        { id: 'w-s3', fromHoleId: 'bb-J-19', toHoleId: 'bb-J-5', color: 'yellow' },
        // Outputs Q2->D8, Q1->D9, Q0->D10
        { id: 'w-q2', fromHoleId: 'bb-I-8', toHoleId: 'd8', color: 'green' },
        { id: 'w-q1', fromHoleId: 'bb-B-9', toHoleId: 'd9', color: 'green' },
        { id: 'w-q0', fromHoleId: 'bb-I-19', toHoleId: 'd10', color: 'green' },
      ],
    },
  },

  // -------------------------------------------------------------
  // EXPERIMENT 18 (Practical 11): 3-bit Johnson Counter (Manual Exp 8b)
  // -------------------------------------------------------------
  {
    id: 'exp-johnson-counter',
    number: '18',
    title: '3-Bit Johnson Counter (IC 7474)',
    aim: 'To construct a 3-bit Johnson (twisted-ring) Counter using two 7474 ICs and verify 000 → 100 → 110 → 111 → 011 → 001 → 000.',
    components: ['2 × 7474 (Dual D Flip-Flop)', 'Digital Logic Trainer DLT-01', 'Jumper Wires'],
    suggestedICs: ['7474'],
    theory: `A 3-bit Johnson Counter shifts Q2 -> Q1 -> Q0 and feeds Q0' (inverted output of the last stage, IC2 Pin 6) back to D2 (IC1 Pin 2) per Manual p.25.
All 3 CLR' pins connect to ORI' (active-LOW clear to 000) and all 3 PRE' pins tie to +5V.
With 3 flip-flops, it cycles through 2N = 6 unique states: 000 -> 100 -> 110 -> 111 -> 011 -> 001 -> 000.`,
    procedure: [
      '1. Place two 7474 ICs at Col 4 (FF1=Q2, FF2=Q1) and Col 15 (FF3=Q0). Connect Pin 14 to +5V and Pin 7 to GND.',
      '2. Connect common CLK (D0) to IC1 Pin 3, IC1 Pin 11, and IC2 Pin 3.',
      '3. Connect ORI\' (D1) to all three CLR\' pins (IC1 Pin 1, IC1 Pin 13, IC2 Pin 1) and tie all three PRE\' pins to +5V.',
      '4. Connect Q2 (IC1 Pin 5)->D1 (IC1 Pin 12), Q1 (IC1 Pin 9)->D0 (IC2 Pin 2), and twisted feedback Q0\' (IC2 Pin 6)->D2 (IC1 Pin 2).',
      '5. Connect outputs Q2->D8, Q1->D9, Q0->D10 and verify the complete 6-state repeating sequence.',
    ],
    pinMapping: {
      inputNames: { CLK: 'D0', 'ORI\'': 'D1' },
      outputNames: { Q2: 'D8', Q1: 'D9', Q0: 'D10' },
    },
    truthTable: [],
    sequentialTests: [
      { id: 'jc-init', label: 'Initialize 000 (ORI\'=0, CLK=0)', inputs: { 'ORI\'': 0, CLK: 0 }, expectedOutputs: { Q2: 0, Q1: 0, Q0: 0 }, resetState: true },
      { id: 'jc-hold0', label: 'Release ORI\'=1 (No Edge, Holds 000)', inputs: { 'ORI\'': 1, CLK: 0 }, expectedOutputs: { Q2: 0, Q1: 0, Q0: 0 } },
      { id: 'jc-c1-hi', label: 'Clock 1 Rising -> 100', inputs: { 'ORI\'': 1, CLK: 1 }, expectedOutputs: { Q2: 1, Q1: 0, Q0: 0 } },
      { id: 'jc-c1-lo', label: 'Clock 1 Falling (Holds 100)', inputs: { 'ORI\'': 1, CLK: 0 }, expectedOutputs: { Q2: 1, Q1: 0, Q0: 0 } },
      { id: 'jc-c2-hi', label: 'Clock 2 Rising -> 110', inputs: { 'ORI\'': 1, CLK: 1 }, expectedOutputs: { Q2: 1, Q1: 1, Q0: 0 } },
      { id: 'jc-c2-lo', label: 'Clock 2 Falling (Holds 110)', inputs: { 'ORI\'': 1, CLK: 0 }, expectedOutputs: { Q2: 1, Q1: 1, Q0: 0 } },
      { id: 'jc-c3-hi', label: 'Clock 3 Rising -> 111', inputs: { 'ORI\'': 1, CLK: 1 }, expectedOutputs: { Q2: 1, Q1: 1, Q0: 1 } },
      { id: 'jc-c3-lo', label: 'Clock 3 Falling (Holds 111)', inputs: { 'ORI\'': 1, CLK: 0 }, expectedOutputs: { Q2: 1, Q1: 1, Q0: 1 } },
      { id: 'jc-c4-hi', label: 'Clock 4 Rising -> 011', inputs: { 'ORI\'': 1, CLK: 1 }, expectedOutputs: { Q2: 0, Q1: 1, Q0: 1 } },
      { id: 'jc-c4-lo', label: 'Clock 4 Falling (Holds 011)', inputs: { 'ORI\'': 1, CLK: 0 }, expectedOutputs: { Q2: 0, Q1: 1, Q0: 1 } },
      { id: 'jc-c5-hi', label: 'Clock 5 Rising -> 001', inputs: { 'ORI\'': 1, CLK: 1 }, expectedOutputs: { Q2: 0, Q1: 0, Q0: 1 } },
      { id: 'jc-c5-lo', label: 'Clock 5 Falling (Holds 001)', inputs: { 'ORI\'': 1, CLK: 0 }, expectedOutputs: { Q2: 0, Q1: 0, Q0: 1 } },
      { id: 'jc-c6-hi', label: 'Clock 6 Rising -> 000 (Repeat)', inputs: { 'ORI\'': 1, CLK: 1 }, expectedOutputs: { Q2: 0, Q1: 0, Q0: 0 } },
      { id: 'jc-c6-lo', label: 'Clock 6 Falling (Holds 000)', inputs: { 'ORI\'': 1, CLK: 0 }, expectedOutputs: { Q2: 0, Q1: 0, Q0: 0 } },
      { id: 'jc-c7-hi', label: 'Clock 7 Rising -> 100 (Cycle 2)', inputs: { 'ORI\'': 1, CLK: 1 }, expectedOutputs: { Q2: 1, Q1: 0, Q0: 0 } },
    ],
    referenceCircuit: {
      ics: [
        { instanceId: 'ic-7474-jc1', icDefId: '7474', startCol: 4, rotation: 0 },
        { instanceId: 'ic-7474-jc2', icDefId: '7474', startCol: 15, rotation: 0 },
      ],
      wires: [
        { id: 'w1', fromHoleId: 'vcc-src', toHoleId: 'top-power-plus-1', color: 'red' },
        { id: 'w2', fromHoleId: 'gnd-src', toHoleId: 'top-power-minus-1', color: 'black' },
        { id: 'w-v1', fromHoleId: 'top-power-plus-4', toHoleId: 'bb-A-4', color: 'red' },
        { id: 'w-g1', fromHoleId: 'top-power-minus-10', toHoleId: 'bb-J-10', color: 'black' },
        { id: 'w-v2', fromHoleId: 'top-power-plus-15', toHoleId: 'bb-A-15', color: 'red' },
        { id: 'w-g2', fromHoleId: 'top-power-minus-21', toHoleId: 'bb-J-21', color: 'black' },
        // Common CLK (D0)
        { id: 'w-clk1', fromHoleId: 'd0', toHoleId: 'bb-J-6', color: 'orange' },
        { id: 'w-clk2', fromHoleId: 'bb-I-6', toHoleId: 'bb-A-7', color: 'orange' },
        { id: 'w-clk3', fromHoleId: 'bb-B-7', toHoleId: 'bb-J-17', color: 'orange' },
        // ORI' (D1) -> all 3 CLR' pins: IC1 pin1(col4 bot), IC1 pin13(col5 top), IC2 pin1(col15 bot)
        { id: 'w-ori1', fromHoleId: 'd1', toHoleId: 'bb-J-4', color: 'purple' },
        { id: 'w-ori2', fromHoleId: 'bb-I-4', toHoleId: 'bb-A-5', color: 'purple' },
        { id: 'w-ori3', fromHoleId: 'bb-B-5', toHoleId: 'bb-J-15', color: 'purple' },
        // All 3 PRE' pins tied +5V: IC1 pin4(col7 bot), IC1 pin10(col8 top), IC2 pin4(col18 bot)
        { id: 'w-pre1-hi', fromHoleId: 'top-power-plus-7', toHoleId: 'bb-J-7', color: 'red' },
        { id: 'w-pre2-hi', fromHoleId: 'top-power-plus-8', toHoleId: 'bb-A-8', color: 'red' },
        { id: 'w-pre3-hi', fromHoleId: 'top-power-plus-18', toHoleId: 'bb-J-18', color: 'red' },
        // Shift chain: Q2(IC1 pin5)->D1(IC1 pin12); Q1(IC1 pin9)->D0(IC2 pin2); Q0'(IC2 pin6 col20 bot)->D2(IC1 pin2 col5 bot)
        { id: 'w-s1', fromHoleId: 'bb-J-8', toHoleId: 'bb-A-6', color: 'yellow' },
        { id: 'w-s2', fromHoleId: 'bb-A-9', toHoleId: 'bb-J-16', color: 'yellow' },
        { id: 'w-s3', fromHoleId: 'bb-J-20', toHoleId: 'bb-J-5', color: 'yellow' },
        // Outputs Q2->D8, Q1->D9, Q0->D10 (IC2 pin5 col19 bot)
        { id: 'w-q2', fromHoleId: 'bb-I-8', toHoleId: 'd8', color: 'green' },
        { id: 'w-q1', fromHoleId: 'bb-B-9', toHoleId: 'd9', color: 'green' },
        { id: 'w-q0', fromHoleId: 'bb-J-19', toHoleId: 'd10', color: 'green' },
      ],
    },
  },

  // -------------------------------------------------------------
  // EXPERIMENT 19 (Practical 12): 74LS90 Decade Counter (Manual Exp 10)
  // -------------------------------------------------------------
  {
    id: 'exp-decade-counter',
    number: '19',
    title: 'BCD Decade Counter (IC 74LS90)',
    aim: 'To construct a BCD Decade Counter using IC 74LS90 and verify decimal counting 0000 → 1001 → 0000.',
    components: ['7490 (BCD Decade Counter)', 'Digital Logic Trainer DLT-01', 'Jumper Wires'],
    suggestedICs: ['7490'],
    theory: `IC 74LS90 consists of an independent Mod-2 counter (clocked on CKA, Pin 14 -> QA, Pin 12) and Mod-5 counter (clocked on CKB, Pin 1 -> QD, QC, QB).
Connecting QA (Pin 12) externally to CKB (Pin 1) creates a full 8421 BCD Decade Counter (0000 to 1001, resetting cleanly to 0000 on the 10th clock pulse).
Notice NON-STANDARD power pins: VCC = Pin 5, GND = Pin 10.`,
    discrepancyNote: `Manual Diagram Correction (p.28): The printed schematic leaves Pin 1 (CKB) routed to the left bus without showing the external bridge from Pin 12 (QA) to Pin 1 (CKB), and the table ends with a Mod-6 reset arrow after 0101 (matching Procedure Step 4). Here Pin 12 (QA) is bridged to Pin 1 (CKB) per the TI SN74LS90 BCD configuration to verify full 0–9 decade counting and automatic reset at decimal 10 (plus MR reset control).`,
    procedure: [
      '1. Insert 7490 (DIP-14) at column 10. Connect Pin 5 (VCC) to +5V and Pin 10 (GND) to GND.',
      '2. Connect clock input CLK (D0) to Pin 14 (CKA) and bridge Pin 12 (QA) to Pin 1 (CKB).',
      '3. Connect Reset control MR (D1) to R0(1) Pin 2 and R0(2) Pin 3; tie R9(1) Pin 6 and R9(2) Pin 7 to GND.',
      '4. Connect BCD outputs: QA (Pin 12)->D8, QB (Pin 9)->D9, QC (Pin 8)->D10, QD (Pin 11)->D11.',
      '5. Pulse MR=1 then MR=0 to clear, then pulse CLK 10+ times to verify 0000 through 1001 and reset to 0000 on count 10.',
    ],
    pinMapping: {
      inputNames: { CLK: 'D0', MR: 'D1' },
      outputNames: { QA: 'D8', QB: 'D9', QC: 'D10', QD: 'D11' },
    },
    truthTable: [],
    sequentialTests: [
      { id: 'dc-rst', label: 'Async Reset (MR=1)', inputs: { MR: 1, CLK: 1 }, expectedOutputs: { QD: 0, QC: 0, QB: 0, QA: 0 }, resetState: true },
      { id: 'dc-0', label: 'Release Reset (Count = 0)', inputs: { MR: 0, CLK: 1 }, expectedOutputs: { QD: 0, QC: 0, QB: 0, QA: 0 } },
      { id: 'dc-1', label: 'Pulse 1 (Count = 1)', inputs: { MR: 0, CLK: 0 }, expectedOutputs: { QD: 0, QC: 0, QB: 0, QA: 1 } },
      { id: 'dc-2-hi', label: 'Pulse 2 High (Holds 1)', inputs: { MR: 0, CLK: 1 }, expectedOutputs: { QD: 0, QC: 0, QB: 0, QA: 1 } },
      { id: 'dc-2', label: 'Pulse 2 Falling (Count = 2)', inputs: { MR: 0, CLK: 0 }, expectedOutputs: { QD: 0, QC: 0, QB: 1, QA: 0 } },
      { id: 'dc-3-hi', label: 'Pulse 3 High', inputs: { MR: 0, CLK: 1 }, expectedOutputs: { QD: 0, QC: 0, QB: 1, QA: 0 } },
      { id: 'dc-3', label: 'Pulse 3 Falling (Count = 3)', inputs: { MR: 0, CLK: 0 }, expectedOutputs: { QD: 0, QC: 0, QB: 1, QA: 1 } },
      { id: 'dc-4-hi', label: 'Pulse 4 High', inputs: { MR: 0, CLK: 1 }, expectedOutputs: { QD: 0, QC: 0, QB: 1, QA: 1 } },
      { id: 'dc-4', label: 'Pulse 4 Falling (Count = 4)', inputs: { MR: 0, CLK: 0 }, expectedOutputs: { QD: 0, QC: 1, QB: 0, QA: 0 } },
      { id: 'dc-5-hi', label: 'Pulse 5 High', inputs: { MR: 0, CLK: 1 }, expectedOutputs: { QD: 0, QC: 1, QB: 0, QA: 0 } },
      { id: 'dc-5', label: 'Pulse 5 Falling (Count = 5)', inputs: { MR: 0, CLK: 0 }, expectedOutputs: { QD: 0, QC: 1, QB: 0, QA: 1 } },
      { id: 'dc-6-hi', label: 'Pulse 6 High', inputs: { MR: 0, CLK: 1 }, expectedOutputs: { QD: 0, QC: 1, QB: 0, QA: 1 } },
      { id: 'dc-6', label: 'Pulse 6 Falling (Count = 6)', inputs: { MR: 0, CLK: 0 }, expectedOutputs: { QD: 0, QC: 1, QB: 1, QA: 0 } },
      { id: 'dc-7-hi', label: 'Pulse 7 High', inputs: { MR: 0, CLK: 1 }, expectedOutputs: { QD: 0, QC: 1, QB: 1, QA: 0 } },
      { id: 'dc-7', label: 'Pulse 7 Falling (Count = 7)', inputs: { MR: 0, CLK: 0 }, expectedOutputs: { QD: 0, QC: 1, QB: 1, QA: 1 } },
      { id: 'dc-8-hi', label: 'Pulse 8 High', inputs: { MR: 0, CLK: 1 }, expectedOutputs: { QD: 0, QC: 1, QB: 1, QA: 1 } },
      { id: 'dc-8', label: 'Pulse 8 Falling (Count = 8)', inputs: { MR: 0, CLK: 0 }, expectedOutputs: { QD: 1, QC: 0, QB: 0, QA: 0 } },
      { id: 'dc-9-hi', label: 'Pulse 9 High', inputs: { MR: 0, CLK: 1 }, expectedOutputs: { QD: 1, QC: 0, QB: 0, QA: 0 } },
      { id: 'dc-9', label: 'Pulse 9 Falling (Count = 9)', inputs: { MR: 0, CLK: 0 }, expectedOutputs: { QD: 1, QC: 0, QB: 0, QA: 1 } },
      { id: 'dc-10-hi', label: 'Pulse 10 High', inputs: { MR: 0, CLK: 1 }, expectedOutputs: { QD: 1, QC: 0, QB: 0, QA: 1 } },
      { id: 'dc-10', label: 'Pulse 10 Falling (Decimal 10 -> 0000)', inputs: { MR: 0, CLK: 0 }, expectedOutputs: { QD: 0, QC: 0, QB: 0, QA: 0 } },
      { id: 'dc-11-hi', label: 'Pulse 11 High', inputs: { MR: 0, CLK: 1 }, expectedOutputs: { QD: 0, QC: 0, QB: 0, QA: 0 } },
      { id: 'dc-11', label: 'Pulse 11 Falling (Repeats -> 0001)', inputs: { MR: 0, CLK: 0 }, expectedOutputs: { QD: 0, QC: 0, QB: 0, QA: 1 } },
    ],
    referenceCircuit: {
      ics: [
        { instanceId: 'ic-7490-1', icDefId: '7490', startCol: 10, rotation: 0 },
      ],
      wires: [
        { id: 'w1', fromHoleId: 'vcc-src', toHoleId: 'top-power-plus-1', color: 'red' },
        { id: 'w2', fromHoleId: 'gnd-src', toHoleId: 'top-power-minus-1', color: 'black' },
        // Non-standard power: Pin 5 (VCC) = col 14 bot, Pin 10 (GND) = col 14 top
        { id: 'w-vcc', fromHoleId: 'top-power-plus-14', toHoleId: 'bb-J-14', color: 'red' },
        { id: 'w-gnd', fromHoleId: 'top-power-minus-14', toHoleId: 'bb-A-14', color: 'black' },
        // Clock CKA (pin 14, col 10 top) <- D0; ripple QA (pin 12, col 12 top) -> CKB (pin 1, col 10 bot)
        { id: 'w-cka', fromHoleId: 'd0', toHoleId: 'bb-A-10', color: 'orange' },
        { id: 'w-ripple', fromHoleId: 'bb-A-12', toHoleId: 'bb-J-10', color: 'yellow' },
        // Reset R0(1)=pin2(col11 bot), R0(2)=pin3(col12 bot) <- MR (D1)
        { id: 'w-r01', fromHoleId: 'd1', toHoleId: 'bb-J-11', color: 'purple' },
        { id: 'w-r02', fromHoleId: 'bb-I-11', toHoleId: 'bb-J-12', color: 'purple' },
        // R9(1)=pin6(col15 bot), R9(2)=pin7(col16 bot) -> GND
        { id: 'w-r91', fromHoleId: 'top-power-minus-15', toHoleId: 'bb-J-15', color: 'black' },
        { id: 'w-r92', fromHoleId: 'top-power-minus-16', toHoleId: 'bb-J-16', color: 'black' },
        // Outputs: QA(pin12 col12 top)->D8, QB(pin9 col15 top)->D9, QC(pin8 col16 top)->D10, QD(pin11 col13 top)->D11
        { id: 'w-qa', fromHoleId: 'bb-B-12', toHoleId: 'd8', color: 'green' },
        { id: 'w-qb', fromHoleId: 'bb-A-15', toHoleId: 'd9', color: 'green' },
        { id: 'w-qc', fromHoleId: 'bb-A-16', toHoleId: 'd10', color: 'green' },
        { id: 'w-qd', fromHoleId: 'bb-A-13', toHoleId: 'd11', color: 'green' },
      ],
    },
  },
];
