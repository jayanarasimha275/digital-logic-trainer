import { ExperimentDef } from '../types/experiment';

export const LAB_EXPERIMENTS: ExperimentDef[] = [
  // -------------------------------------------------------------
  // EXPERIMENT 1: Realization of Basic Logic Gates
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
      '7. Click [RUN ALL TEST CASES] to auto-verify the circuit.',
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
        // Power rails
        { id: 'w-pwr-vcc', fromHoleId: 'vcc-src', toHoleId: 'top-power-plus-1', color: 'red' },
        { id: 'w-pwr-gnd', fromHoleId: 'gnd-src', toHoleId: 'top-power-minus-1', color: 'black' },
        // IC Power: VCC to pin 14 (col 10 top row A), GND to pin 7 (col 16 bot row J)
        { id: 'w-ic-vcc', fromHoleId: 'top-power-plus-10', toHoleId: 'bb-A-10', color: 'red' },
        { id: 'w-ic-gnd', fromHoleId: 'top-power-minus-16', toHoleId: 'bb-J-16', color: 'black' },
        // Inputs: D0 -> Pin 1 (col 10 bot row J), D1 -> Pin 2 (col 11 bot row J)
        { id: 'w-in-d0', fromHoleId: 'd0', toHoleId: 'bb-J-10', color: 'blue' },
        { id: 'w-in-d1', fromHoleId: 'd1', toHoleId: 'bb-J-11', color: 'blue' },
        // Output: Pin 3 (col 12 bot row J) -> D8
        { id: 'w-out-d8', fromHoleId: 'bb-J-12', toHoleId: 'd8', color: 'green' },
      ],
    },
  },

  // -------------------------------------------------------------
  // EXPERIMENT 2: Binary to Gray Code Converter
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
      '7. Verify outputs D11, D10, D9, D8 against Gray code table.',
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
      { id: 'bg-4', inputs: { B3: 0, B2: 1, B0: 0, B1: 0 }, expectedOutputs: { G3: 0, G2: 1, G1: 1, G0: 0 } },
      { id: 'bg-7', inputs: { B3: 0, B2: 1, B1: 1, B0: 1 }, expectedOutputs: { G3: 0, G2: 1, G1: 0, G0: 0 } },
      { id: 'bg-8', inputs: { B3: 1, B2: 0, B1: 0, B0: 0 }, expectedOutputs: { G3: 1, G2: 1, G1: 0, G0: 0 } },
      { id: 'bg-15', inputs: { B3: 1, B2: 1, B1: 1, B0: 1 }, expectedOutputs: { G3: 1, G2: 0, G1: 0, G0: 0 } },
    ],
    referenceCircuit: {
      ics: [
        { instanceId: 'ic-7486-1', icDefId: '7486', startCol: 10, rotation: 0 },
      ],
      wires: [
        { id: 'w1', fromHoleId: 'vcc-src', toHoleId: 'top-power-plus-1', color: 'red' },
        { id: 'w2', fromHoleId: 'gnd-src', toHoleId: 'top-power-minus-1', color: 'black' },
        { id: 'w3', fromHoleId: 'top-power-plus-10', toHoleId: 'bb-A-10', color: 'red' }, // VCC Pin 14
        { id: 'w4', fromHoleId: 'top-power-minus-16', toHoleId: 'bb-J-16', color: 'black' }, // GND Pin 7
        // G3 = B3 directly
        { id: 'w-g3', fromHoleId: 'd3', toHoleId: 'd11', color: 'green' },
        // G2 = B3 ⊕ B2: Gate 1 pins 1, 2 -> 3
        { id: 'w-b3-g1', fromHoleId: 'd3', toHoleId: 'bb-J-10', color: 'blue' },
        { id: 'w-b2-g1', fromHoleId: 'd2', toHoleId: 'bb-J-11', color: 'blue' },
        { id: 'w-g2-out', fromHoleId: 'bb-J-12', toHoleId: 'd10', color: 'green' },
        // G1 = B2 ⊕ B1: Gate 2 pins 4, 5 -> 6
        { id: 'w-b2-g2', fromHoleId: 'd2', toHoleId: 'bb-J-13', color: 'blue' },
        { id: 'w-b1-g2', fromHoleId: 'd1', toHoleId: 'bb-J-14', color: 'blue' },
        { id: 'w-g1-out', fromHoleId: 'bb-J-15', toHoleId: 'd9', color: 'green' },
        // G0 = B1 ⊕ B0: Gate 3 pins 9, 10 -> 8
        { id: 'w-b1-g3', fromHoleId: 'd1', toHoleId: 'bb-A-15', color: 'blue' }, // Pin 9 is col 15 top
        { id: 'w-b0-g3', fromHoleId: 'd0', toHoleId: 'bb-A-14', color: 'blue' }, // Pin 10 is col 14 top
        { id: 'w-g0-out', fromHoleId: 'bb-A-16', toHoleId: 'd8', color: 'green' }, // Pin 8 is col 16 top
      ],
    },
  },

  // -------------------------------------------------------------
  // EXPERIMENT 3: Gray to Binary Code Converter
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
      '4. Connect B3 (D11 or D3) and G2 (D2) to XOR gate 1 to produce B2 on D10.',
      '5. Connect B2 (D10) and G1 (D1) to XOR gate 2 to produce B1 on D9.',
      '6. Connect B1 (D9) and G0 (D0) to XOR gate 3 to produce B0 on D8.',
      '7. Test all input combinations.',
    ],
    pinMapping: {
      inputNames: { G0: 'D0', G1: 'D1', G2: 'D2', G3: 'D3' },
      outputNames: { B0: 'D8', B1: 'D9', B2: 'D10', B3: 'D11' },
    },
    truthTable: [
      { id: 'gb-0', inputs: { G3: 0, G2: 0, G1: 0, G0: 0 }, expectedOutputs: { B3: 0, B2: 0, B1: 0, B0: 0 } },
      { id: 'gb-1', inputs: { G3: 0, G2: 0, G1: 0, G0: 1 }, expectedOutputs: { B3: 0, B2: 0, B1: 0, B0: 1 } },
      { id: 'gb-2', inputs: { G3: 0, G2: 0, G1: 1, G0: 1 }, expectedOutputs: { B3: 0, B2: 0, B1: 1, B0: 0 } },
      { id: 'gb-3', inputs: { G3: 0, G2: 0, G1: 1, G0: 0 }, expectedOutputs: { B3: 0, B2: 0, B1: 1, B0: 1 } },
      { id: 'gb-4', inputs: { G3: 0, G2: 1, G1: 1, G0: 0 }, expectedOutputs: { B3: 0, B2: 1, B1: 0, B0: 0 } },
      { id: 'gb-7', inputs: { G3: 1, G2: 1, G1: 0, G0: 0 }, expectedOutputs: { B3: 1, B2: 0, B1: 0, B0: 0 } },
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
        // B3 = G3
        { id: 'w-b3', fromHoleId: 'd3', toHoleId: 'd11', color: 'green' },
        // B2 = B3 ^ G2
        { id: 'w-b3-xor1', fromHoleId: 'd3', toHoleId: 'bb-J-10', color: 'blue' },
        { id: 'w-g2-xor1', fromHoleId: 'd2', toHoleId: 'bb-J-11', color: 'blue' },
        { id: 'w-b2-out', fromHoleId: 'bb-J-12', toHoleId: 'd10', color: 'green' },
        // B1 = B2 ^ G1
        { id: 'w-b2-xor2', fromHoleId: 'bb-J-12', toHoleId: 'bb-J-13', color: 'yellow' },
        { id: 'w-g1-xor2', fromHoleId: 'd1', toHoleId: 'bb-J-14', color: 'blue' },
        { id: 'w-b1-out', fromHoleId: 'bb-J-15', toHoleId: 'd9', color: 'green' },
        // B0 = B1 ^ G0
        { id: 'w-b1-xor3', fromHoleId: 'bb-J-15', toHoleId: 'bb-A-15', color: 'yellow' },
        { id: 'w-g0-xor3', fromHoleId: 'd0', toHoleId: 'bb-A-14', color: 'blue' },
        { id: 'w-b0-out', fromHoleId: 'bb-A-16', toHoleId: 'd8', color: 'green' },
      ],
    },
  },

  // -------------------------------------------------------------
  // EXPERIMENT 4: Half Adder
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
        // VCC
        { id: 'w-vcc1', fromHoleId: 'top-power-plus-5', toHoleId: 'bb-A-5', color: 'red' },
        { id: 'w-vcc2', fromHoleId: 'top-power-plus-15', toHoleId: 'bb-A-15', color: 'red' },
        // GND
        { id: 'w-gnd1', fromHoleId: 'top-power-minus-11', toHoleId: 'bb-J-11', color: 'black' },
        { id: 'w-gnd2', fromHoleId: 'top-power-minus-21', toHoleId: 'bb-J-21', color: 'black' },
        // Input A (D0) -> 7486 pin 1 (col 5 bot), bridge to 7408 pin 1 (col 15 bot)
        { id: 'w-in-a1', fromHoleId: 'd0', toHoleId: 'bb-J-5', color: 'blue' },
        { id: 'w-in-a2', fromHoleId: 'bb-I-5', toHoleId: 'bb-J-15', color: 'blue' },
        // Input B (D1) -> 7486 pin 2 (col 6 bot), bridge to 7408 pin 2 (col 16 bot)
        { id: 'w-in-b1', fromHoleId: 'd1', toHoleId: 'bb-J-6', color: 'blue' },
        { id: 'w-in-b2', fromHoleId: 'bb-I-6', toHoleId: 'bb-J-16', color: 'blue' },
        // SUM: 7486 pin 3 (col 7 bot) -> D8
        { id: 'w-out-sum', fromHoleId: 'bb-J-7', toHoleId: 'd8', color: 'green' },
        // CARRY: 7408 pin 3 (col 17 bot) -> D9
        { id: 'w-out-carry', fromHoleId: 'bb-J-17', toHoleId: 'd9', color: 'green' },
      ],
    },
  },

  // -------------------------------------------------------------
  // EXPERIMENT 5: Half Subtractor
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
        // VCC to cols 3, 12, 21
        { id: 'w-v1', fromHoleId: 'top-power-plus-3', toHoleId: 'bb-A-3', color: 'red' },
        { id: 'w-v2', fromHoleId: 'top-power-plus-12', toHoleId: 'bb-A-12', color: 'red' },
        { id: 'w-v3', fromHoleId: 'top-power-plus-21', toHoleId: 'bb-A-21', color: 'red' },
        // GND to cols 9, 18, 27
        { id: 'w-g1', fromHoleId: 'top-power-minus-9', toHoleId: 'bb-J-9', color: 'black' },
        { id: 'w-g2', fromHoleId: 'top-power-minus-18', toHoleId: 'bb-J-18', color: 'black' },
        { id: 'w-g3', fromHoleId: 'top-power-minus-27', toHoleId: 'bb-J-27', color: 'black' },
        // Input A (D0) -> 7486 pin 1 (col 3), 7404 pin 1 (col 12)
        { id: 'w-a-xor', fromHoleId: 'd0', toHoleId: 'bb-J-3', color: 'blue' },
        { id: 'w-a-not', fromHoleId: 'bb-I-3', toHoleId: 'bb-J-12', color: 'blue' },
        // Input B (D1) -> 7486 pin 2 (col 4), 7408 pin 2 (col 22)
        { id: 'w-b-xor', fromHoleId: 'd1', toHoleId: 'bb-J-4', color: 'blue' },
        { id: 'w-b-and', fromHoleId: 'bb-I-4', toHoleId: 'bb-J-22', color: 'blue' },
        // 7404 output pin 2 (col 13) -> 7408 input pin 1 (col 21)
        { id: 'w-not-and', fromHoleId: 'bb-J-13', toHoleId: 'bb-J-21', color: 'yellow' },
        // Outputs: 7486 pin 3 (col 5) -> D8 (DIFF), 7408 pin 3 (col 23) -> D9 (BORROW)
        { id: 'w-diff', fromHoleId: 'bb-J-5', toHoleId: 'd8', color: 'green' },
        { id: 'w-borrow', fromHoleId: 'bb-J-23', toHoleId: 'd9', color: 'green' },
      ],
    },
  },

  // -------------------------------------------------------------
  // EXPERIMENT 6: Full Adder
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
        // Power to all 3 ICs
        { id: 'w-v1', fromHoleId: 'top-power-plus-3', toHoleId: 'bb-A-3', color: 'red' },
        { id: 'w-v2', fromHoleId: 'top-power-plus-12', toHoleId: 'bb-A-12', color: 'red' },
        { id: 'w-v3', fromHoleId: 'top-power-plus-21', toHoleId: 'bb-A-21', color: 'red' },
        { id: 'w-g1', fromHoleId: 'top-power-minus-9', toHoleId: 'bb-J-9', color: 'black' },
        { id: 'w-g2', fromHoleId: 'top-power-minus-18', toHoleId: 'bb-J-18', color: 'black' },
        { id: 'w-g3', fromHoleId: 'top-power-minus-27', toHoleId: 'bb-J-27', color: 'black' },
        // Input A (D0) -> 7486 pin 1 (col 3), 7408 pin 1 (col 12)
        { id: 'w-a-xor', fromHoleId: 'd0', toHoleId: 'bb-J-3', color: 'blue' },
        { id: 'w-a-and', fromHoleId: 'bb-I-3', toHoleId: 'bb-J-12', color: 'blue' },
        // Input B (D1) -> 7486 pin 2 (col 4), 7408 pin 2 (col 13)
        { id: 'w-b-xor', fromHoleId: 'd1', toHoleId: 'bb-J-4', color: 'blue' },
        { id: 'w-b-and', fromHoleId: 'bb-I-4', toHoleId: 'bb-J-13', color: 'blue' },
        // (A ^ B) is 7486 pin 3 (col 5) -> goes to 7486 pin 4 (col 6) and 7408 pin 4 (col 15)
        { id: 'w-ab-xor2', fromHoleId: 'bb-J-5', toHoleId: 'bb-J-6', color: 'yellow' },
        { id: 'w-ab-and2', fromHoleId: 'bb-I-5', toHoleId: 'bb-J-15', color: 'yellow' },
        // Input Cin (D2) -> 7486 pin 5 (col 7), 7408 pin 5 (col 16)
        { id: 'w-cin-xor', fromHoleId: 'd2', toHoleId: 'bb-J-7', color: 'blue' },
        { id: 'w-cin-and', fromHoleId: 'bb-I-7', toHoleId: 'bb-J-16', color: 'blue' },
        // SUM: 7486 pin 6 (col 8) -> D8
        { id: 'w-sum', fromHoleId: 'bb-J-8', toHoleId: 'd8', color: 'green' },
        // Carry terms into 7432 OR gate (pins 1,2 col 21,22):
        // (A · B) is 7408 pin 3 (col 14) -> 7432 pin 1 (col 21)
        { id: 'w-ab-or', fromHoleId: 'bb-J-14', toHoleId: 'bb-J-21', color: 'orange' },
        // (Cin · (A ^ B)) is 7408 pin 6 (col 17) -> 7432 pin 2 (col 22)
        { id: 'w-cinab-or', fromHoleId: 'bb-J-17', toHoleId: 'bb-J-22', color: 'orange' },
        // Cout: 7432 pin 3 (col 23) -> D9
        { id: 'w-cout', fromHoleId: 'bb-J-23', toHoleId: 'd9', color: 'green' },
      ],
    },
  },

  // -------------------------------------------------------------
  // EXPERIMENT 7: Full Subtractor
  // -------------------------------------------------------------
  {
    id: 'exp-full-subtractor',
    number: '07',
    title: 'Full Subtractor',
    aim: 'To construct and verify a 1-bit Full Subtractor using XOR, NOT, AND, and OR gates.',
    components: ['7486 (XOR)', '7404 (NOT)', '7408 (AND)', '7432 (OR)', 'Digital Logic Trainer DLT-01', 'Jumper Wires'],
    suggestedICs: ['7486', '7404', '7408', '7432'],
    theory: `A Full Subtractor subtracts bit B and borrow-in Bin from minuend bit A:
- DIFFERENCE = A ⊕ B ⊕ Bin
- Bout = (A' · B) + (Bin · (A ⊕ B)')`,
    procedure: [
      '1. Place 7486, 7404, 7408, 7432 on breadboard and supply +5V and GND.',
      '2. Connect A=D0, B=D1, Bin=D2. Outputs DIFF=D8, Bout=D9.',
      '3. Form DIFFERENCE using cascaded XOR gates.',
      '4. Form Bout by inverting A and (A ⊕ B), ANDing with B and Bin respectively, and ORing the two borrow terms.',
      '5. Verify truth table against all 8 combinations.',
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
        { instanceId: 'ic-7486-fs', icDefId: '7486', startCol: 2, rotation: 0 },
        { instanceId: 'ic-7404-fs', icDefId: '7404', startCol: 10, rotation: 0 },
        { instanceId: 'ic-7408-fs', icDefId: '7408', startCol: 18, rotation: 0 },
        { instanceId: 'ic-7432-fs', icDefId: '7432', startCol: 25, rotation: 0 },
      ],
      wires: [
        { id: 'w-p1', fromHoleId: 'vcc-src', toHoleId: 'top-power-plus-1', color: 'red' },
        { id: 'w-p2', fromHoleId: 'gnd-src', toHoleId: 'top-power-minus-1', color: 'black' },
        { id: 'w-v1', fromHoleId: 'top-power-plus-2', toHoleId: 'bb-A-2', color: 'red' },
        { id: 'w-v2', fromHoleId: 'top-power-plus-10', toHoleId: 'bb-A-10', color: 'red' },
        { id: 'w-v3', fromHoleId: 'top-power-plus-18', toHoleId: 'bb-A-18', color: 'red' },
        { id: 'w-v4', fromHoleId: 'top-power-plus-25', toHoleId: 'bb-A-25', color: 'red' },
        { id: 'w-g1', fromHoleId: 'top-power-minus-8', toHoleId: 'bb-J-8', color: 'black' },
        { id: 'w-g2', fromHoleId: 'top-power-minus-16', toHoleId: 'bb-J-16', color: 'black' },
        { id: 'w-g3', fromHoleId: 'top-power-minus-24', toHoleId: 'bb-J-24', color: 'black' },
        // DIFF wire:
        { id: 'w-a-xor', fromHoleId: 'd0', toHoleId: 'bb-J-2', color: 'blue' },
        { id: 'w-b-xor', fromHoleId: 'd1', toHoleId: 'bb-J-3', color: 'blue' },
        { id: 'w-ab-xor', fromHoleId: 'bb-J-4', toHoleId: 'bb-J-5', color: 'yellow' },
        { id: 'w-bin-xor', fromHoleId: 'd2', toHoleId: 'bb-J-6', color: 'blue' },
        { id: 'w-diff', fromHoleId: 'bb-J-7', toHoleId: 'd8', color: 'green' },
      ],
    },
  },

  // -------------------------------------------------------------
  // EXPERIMENT 8: Multiplexer (4:1 MUX)
  // -------------------------------------------------------------
  {
    id: 'exp-multiplexer',
    number: '08',
    title: '4:1 Multiplexer',
    aim: 'To verify the functionality of a 4-to-1 Multiplexer (Data Selector) using 74153.',
    components: ['74153 (Dual 4:1 MUX)', 'Digital Logic Trainer DLT-01', 'Jumper Wires'],
    suggestedICs: ['74153'],
    theory: `A 4:1 Multiplexer selects one of 4 data inputs (1C0, 1C1, 1C2, 1C3) according to 2 select lines (S0, S1) and routes it to output 1Y.
Strobe (1G') must be LOW (active-low enable) for MUX 1 to function.
Pinout: S0=Pin 14, S1=Pin 2, 1G'=Pin 1, 1C0=Pin 6, 1C1=Pin 5, 1C2=Pin 4, 1C3=Pin 3, 1Y=Pin 7.`,
    procedure: [
      '1. Insert 74153 (DIP-16) at column 8.',
      '2. Connect Pin 16 (VCC) to +5V and Pin 8 (GND) to GND.',
      '3. Connect Pin 1 (1G\') to GND (to enable MUX 1).',
      '4. Connect D0->1C0, D1->1C1, D2->1C2, D3->1C3 (data inputs).',
      '5. Connect D4->Pin 14 (S0) and D5->Pin 2 (S1) (select lines).',
      '6. Connect Pin 7 (1Y) to output D8.',
      '7. Toggle S1 S0 to verify that only the selected input channel appears at D8.',
    ],
    pinMapping: {
      inputNames: { I0: 'D0', I1: 'D1', I2: 'D2', I3: 'D3', S0: 'D4', S1: 'D5' },
      outputNames: { Y: 'D8' },
    },
    truthTable: [
      { id: 'mux-0', inputs: { S1: 0, S0: 0, I0: 1, I1: 0, I2: 0, I3: 0 }, expectedOutputs: { Y: 1 } },
      { id: 'mux-1', inputs: { S1: 0, S0: 1, I0: 0, I1: 1, I2: 0, I3: 0 }, expectedOutputs: { Y: 1 } },
      { id: 'mux-2', inputs: { S1: 1, S0: 0, I0: 0, I1: 0, I2: 1, I3: 0 }, expectedOutputs: { Y: 1 } },
      { id: 'mux-3', inputs: { S1: 1, S0: 1, I0: 0, I1: 0, I2: 0, I3: 1 }, expectedOutputs: { Y: 1 } },
    ],
    referenceCircuit: {
      ics: [
        { instanceId: 'ic-74153-1', icDefId: '74153', startCol: 8, rotation: 0 },
      ],
      wires: [
        { id: 'w1', fromHoleId: 'vcc-src', toHoleId: 'top-power-plus-1', color: 'red' },
        { id: 'w2', fromHoleId: 'gnd-src', toHoleId: 'top-power-minus-1', color: 'black' },
        // 74153 DIP-16: VCC=pin 16 (col 8 top A), GND=pin 8 (col 15 bot J)
        { id: 'w-vcc', fromHoleId: 'top-power-plus-8', toHoleId: 'bb-A-8', color: 'red' },
        { id: 'w-gnd', fromHoleId: 'top-power-minus-15', toHoleId: 'bb-J-15', color: 'black' },
        // 1G' (pin 1, col 8 bot J) to GND
        { id: 'w-strobe', fromHoleId: 'top-power-minus-8', toHoleId: 'bb-J-8', color: 'black' },
        // Select lines: S1 (pin 2, col 9 bot) -> D5; S0 (pin 14, col 10 top) -> D4
        { id: 'w-s1', fromHoleId: 'd5', toHoleId: 'bb-J-9', color: 'purple' },
        { id: 'w-s0', fromHoleId: 'd4', toHoleId: 'bb-A-10', color: 'purple' },
        // Data inputs: 1C0=pin 6 (col 13 bot J) -> D0
        { id: 'w-c0', fromHoleId: 'd0', toHoleId: 'bb-J-13', color: 'blue' },
        // 1C1=pin 5 (col 12 bot J) -> D1
        { id: 'w-c1', fromHoleId: 'd1', toHoleId: 'bb-J-12', color: 'blue' },
        // 1C2=pin 4 (col 11 bot J) -> D2
        { id: 'w-c2', fromHoleId: 'd2', toHoleId: 'bb-J-11', color: 'blue' },
        // 1C3=pin 3 (col 10 bot J) -> D3
        { id: 'w-c3', fromHoleId: 'd3', toHoleId: 'bb-J-10', color: 'blue' },
        // Output: 1Y = pin 7 (col 14 bot J) -> D8
        { id: 'w-out', fromHoleId: 'bb-J-14', toHoleId: 'd8', color: 'green' },
      ],
    },
  },

  // -------------------------------------------------------------
  // EXPERIMENT 9: Demultiplexer (1:4 DEMUX)
  // -------------------------------------------------------------
  {
    id: 'exp-demultiplexer',
    number: '09',
    title: '1:4 Demultiplexer',
    aim: 'To verify the operation of a 1-to-4 Demultiplexer using 74139 decoder/demux IC.',
    components: ['74139 (Dual 2:4 Decoder/Demux)', 'Digital Logic Trainer DLT-01', 'Jumper Wires'],
    suggestedICs: ['74139'],
    theory: `A Demultiplexer takes a single data input and distributes it to one of multiple output lines depending on select address inputs.
Using 74139 Section 1:
- Select inputs: 1A (Pin 2, S0), 1B (Pin 3, S1).
- Data input is applied to the active-low enable pin 1G' (Pin 1).
- Outputs: 1Y0' (Pin 4), 1Y1' (Pin 5), 1Y2' (Pin 6), 1Y3' (Pin 7).`,
    procedure: [
      '1. Insert 74139 (DIP-16) at column 10.',
      '2. Connect Pin 16 to +5V and Pin 8 to GND.',
      '3. Connect Data Input D0 to Pin 1 (1G\').',
      '4. Connect Select inputs S0=D1 to Pin 2 (1A) and S1=D2 to Pin 3 (1B).',
      '5. Connect outputs Pin 4 (1Y0) -> D8, Pin 5 (1Y1) -> D9, Pin 6 (1Y2) -> D10, Pin 7 (1Y3) -> D11.',
      '6. Verify that when D0 is transmitted, it appears at the channel selected by S1 S0.',
    ],
    pinMapping: {
      inputNames: { Data: 'D0', S0: 'D1', S1: 'D2' },
      outputNames: { Y0: 'D8', Y1: 'D9', Y2: 'D10', Y3: 'D11' },
    },
    truthTable: [
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
        // Data input D0 -> 1G' (pin 1, col 10 bot J)
        { id: 'w-data', fromHoleId: 'd0', toHoleId: 'bb-J-10', color: 'blue' },
        // S0 (D1) -> 1A (pin 2, col 11 bot J), S1 (D2) -> 1B (pin 3, col 12 bot J)
        { id: 'w-s0', fromHoleId: 'd1', toHoleId: 'bb-J-11', color: 'purple' },
        { id: 'w-s1', fromHoleId: 'd2', toHoleId: 'bb-J-12', color: 'purple' },
        // Outputs: 1Y0' (pin 4, col 13) -> D8, 1Y1' (pin 5, col 14) -> D9, 1Y2' (pin 6, col 15) -> D10, 1Y3' (pin 7, col 16) -> D11
        { id: 'w-y0', fromHoleId: 'bb-J-13', toHoleId: 'd8', color: 'green' },
        { id: 'w-y1', fromHoleId: 'bb-J-14', toHoleId: 'd9', color: 'green' },
        { id: 'w-y2', fromHoleId: 'bb-J-15', toHoleId: 'd10', color: 'green' },
        { id: 'w-y3', fromHoleId: 'bb-J-16', toHoleId: 'd11', color: 'green' },
      ],
    },
  },

  // -------------------------------------------------------------
  // EXPERIMENT 10: Decoder (3-to-8 Decoder)
  // -------------------------------------------------------------
  {
    id: 'exp-decoder',
    number: '10',
    title: '3-to-8 Line Decoder',
    aim: 'To verify the operation of the 74138 3-to-8 Line Decoder/Demultiplexer.',
    components: ['74138 (3-to-8 Decoder)', 'Digital Logic Trainer DLT-01', 'Jumper Wires'],
    suggestedICs: ['74138'],
    theory: `The 74138 decodes a 3-bit binary address (A, B, C) into one of 8 active-low outputs (Y0' through Y7').
Enables required: G1 = HIGH (+5V), G2A' = LOW (GND), G2B' = LOW (GND).`,
    procedure: [
      '1. Place 74138 (DIP-16) at column 8.',
      '2. Connect Pin 16 to +5V and Pin 8 to GND.',
      '3. Connect Pin 6 (G1) to +5V, and Pin 4 (G2A\') and Pin 5 (G2B\') to GND.',
      '4. Connect inputs: A (D0) to Pin 1, B (D1) to Pin 2, C (D2) to Pin 3.',
      '5. Connect outputs Y0\'-Y7\' to D8 through D15.',
      '6. Verify that for each 3-bit input combination, the corresponding output LED turns LOW (0).',
    ],
    pinMapping: {
      inputNames: { A: 'D0', B: 'D1', C: 'D2' },
      outputNames: { Y0: 'D8', Y1: 'D9', Y2: 'D10', Y3: 'D11', Y4: 'D12', Y5: 'D13', Y6: 'D14', Y7: 'D15' },
    },
    truthTable: [
      { id: 'dec-0', inputs: { C: 0, B: 0, A: 0 }, expectedOutputs: { Y0: 0, Y1: 1, Y2: 1, Y3: 1, Y4: 1, Y5: 1, Y6: 1, Y7: 1 } },
      { id: 'dec-1', inputs: { C: 0, B: 0, A: 1 }, expectedOutputs: { Y0: 1, Y1: 0, Y2: 1, Y3: 1, Y4: 1, Y5: 1, Y6: 1, Y7: 1 } },
      { id: 'dec-2', inputs: { C: 0, B: 1, A: 0 }, expectedOutputs: { Y0: 1, Y1: 1, Y2: 0, Y3: 1, Y4: 1, Y5: 1, Y6: 1, Y7: 1 } },
      { id: 'dec-3', inputs: { C: 0, B: 1, A: 1 }, expectedOutputs: { Y0: 1, Y1: 1, Y2: 1, Y3: 0, Y4: 1, Y5: 1, Y6: 1, Y7: 1 } },
      { id: 'dec-7', inputs: { C: 1, B: 1, A: 1 }, expectedOutputs: { Y0: 1, Y1: 1, Y2: 1, Y3: 1, Y4: 1, Y5: 1, Y6: 1, Y7: 0 } },
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
        // Enables: G1 (pin 6, col 13 bot J) -> +5V
        { id: 'w-g1', fromHoleId: 'top-power-plus-13', toHoleId: 'bb-J-13', color: 'red' },
        // G2A' (pin 4, col 11 bot J) -> GND, G2B' (pin 5, col 12 bot J) -> GND
        { id: 'w-g2a', fromHoleId: 'top-power-minus-11', toHoleId: 'bb-J-11', color: 'black' },
        { id: 'w-g2b', fromHoleId: 'top-power-minus-12', toHoleId: 'bb-J-12', color: 'black' },
        // Inputs: A (pin 1, col 8 bot J) -> D0, B (pin 2, col 9 bot J) -> D1, C (pin 3, col 10 bot J) -> D2
        { id: 'w-in-a', fromHoleId: 'd0', toHoleId: 'bb-J-8', color: 'blue' },
        { id: 'w-in-b', fromHoleId: 'd1', toHoleId: 'bb-J-9', color: 'blue' },
        { id: 'w-in-c', fromHoleId: 'd2', toHoleId: 'bb-J-10', color: 'blue' },
        // Y0' (pin 15, col 9 top A) -> D8
        { id: 'w-y0', fromHoleId: 'bb-A-9', toHoleId: 'd8', color: 'green' },
        // Y1' (pin 14, col 10 top A) -> D9
        { id: 'w-y1', fromHoleId: 'bb-A-10', toHoleId: 'd9', color: 'green' },
        // Y2' (pin 13, col 11 top A) -> D10
        { id: 'w-y2', fromHoleId: 'bb-A-11', toHoleId: 'd10', color: 'green' },
        // Y7' (pin 7, col 14 bot J) -> D15
        { id: 'w-y7', fromHoleId: 'bb-J-14', toHoleId: 'd15', color: 'green' },
      ],
    },
  },

  // -------------------------------------------------------------
  // EXPERIMENT 11: Encoder (8-to-3 Priority Encoder)
  // -------------------------------------------------------------
  {
    id: 'exp-encoder',
    number: '11',
    title: '8-to-3 Priority Encoder',
    aim: 'To verify the truth table and priority logic of the 74148 8-to-3 Priority Encoder.',
    components: ['74148 (8-to-3 Priority Encoder)', 'Digital Logic Trainer DLT-01', 'Jumper Wires'],
    suggestedICs: ['74148'],
    theory: `The 74148 encodes 8 active-low data inputs (0'-7') into a 3-bit active-low binary code (A2', A1', A0').
Input 7' has the highest priority: when active (LOW), lower-order inputs are ignored.
Enable Input EI' must be LOW (0V) for the encoder to operate.`,
    procedure: [
      '1. Place 74148 (DIP-16) at column 8. Connect Pin 16 to +5V and Pin 8 to GND.',
      '2. Connect Pin 5 (EI\') to GND to enable the chip.',
      '3. Connect inputs D0-D7 to active-low inputs 0\'-7\'.',
      '4. Connect outputs A0\' (pin 9)->D8, A1\' (pin 7)->D9, A2\' (pin 6)->D10.',
      '5. Connect GS\' (pin 11)->D11 (Group Signal indicates active input).',
      '6. Test each input active low and observe priority resolution.',
    ],
    pinMapping: {
      inputNames: { '0\'': 'D0', '1\'': 'D1', '2\'': 'D2', '3\'': 'D3', '4\'': 'D4', '5\'': 'D5', '6\'': 'D6', '7\'': 'D7' },
      outputNames: { 'A0\'': 'D8', 'A1\'': 'D9', 'A2\'': 'D10', 'GS\'': 'D11' },
    },
    truthTable: [
      { id: 'enc-none', inputs: { '0\'': 1, '1\'': 1, '2\'': 1, '3\'': 1, '4\'': 1, '5\'': 1, '6\'': 1, '7\'': 1 }, expectedOutputs: { 'A2\'': 1, 'A1\'': 1, 'A0\'': 1, 'GS\'': 1 } },
      { id: 'enc-7', inputs: { '0\'': 1, '1\'': 1, '2\'': 1, '3\'': 1, '4\'': 1, '5\'': 1, '6\'': 1, '7\'': 0 }, expectedOutputs: { 'A2\'': 0, 'A1\'': 0, 'A0\'': 0, 'GS\'': 0 } },
      { id: 'enc-0', inputs: { '0\'': 0, '1\'': 1, '2\'': 1, '3\'': 1, '4\'': 1, '5\'': 1, '6\'': 1, '7\'': 1 }, expectedOutputs: { 'A2\'': 1, 'A1\'': 1, 'A0\'': 1, 'GS\'': 0 } },
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
        // EI' (pin 5, col 12 bot J) to GND
        { id: 'w-ei', fromHoleId: 'top-power-minus-12', toHoleId: 'bb-J-12', color: 'black' },
        // Input 7' (pin 4, col 11 bot J) -> D7
        { id: 'w-in-7', fromHoleId: 'd7', toHoleId: 'bb-J-11', color: 'blue' },
        // Outputs: A2' (pin 6, col 13 bot J) -> D10, A1' (pin 7, col 14 bot J) -> D9, A0' (pin 9, col 15 top A) -> D8
        { id: 'w-a2', fromHoleId: 'bb-J-13', toHoleId: 'd10', color: 'green' },
        { id: 'w-a1', fromHoleId: 'bb-J-14', toHoleId: 'd9', color: 'green' },
        { id: 'w-a0', fromHoleId: 'bb-A-15', toHoleId: 'd8', color: 'green' },
      ],
    },
  },
];
