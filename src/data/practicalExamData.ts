import { ExperimentDef, PracticalExamSupplement } from '../types/experiment';
import { LAB_EXPERIMENTS } from './experiments';

/**
 * Exact 12 Practical Examination Experiments prescribed in
 * SRM University AP CSE 207 Digital Electronics Laboratory Final Practical Examination.
 */
export const PRACTICAL_EXAM_IDS: readonly string[] = [
  'exp-multiplexer',
  'exp-decoder',
  'exp-comparator',
  'exp-sr-flipflop',
  'exp-jk-flipflop',
  'exp-d-flipflop',
  'exp-t-flipflop',
  'exp-ring-counter',
  'exp-johnson-counter',
  'exp-decade-counter',
  'exp-encoder',
  'exp-demultiplexer',
] as const;

export const PRACTICAL_EXAM_SUPPLEMENTS: Record<string, PracticalExamSupplement> = {
  'exp-multiplexer': {
    examNumber: 1,
    examTitle: '4:1 Multiplexer',
    icSubtitle: 'IC 74153',
    apparatus: [
      'IC 74153 (Dual 4:1 Data Selector / Multiplexer, DIP-16)',
      'NI ELVIS II / DLT-01 Digital Logic Trainer',
      'Regulated DC Power Supply (+5V & GND)',
      'Single-strand Hookup / Jumper Wires',
    ],
    connectionInstructions: [
      { signal: 'VCC / GND', from: '+5V / GND', to: '74153 Pin 16 (+5V) / Pin 8 (GND)' },
      { signal: 'Strobe / Enable EA\'', from: 'D6', to: '74153 Pin 1 (1G\', Active-LOW: 0=Enable, 1=Disable)' },
      { signal: 'Data Inputs (I0–I3)', from: 'D0, D1, D2, D3', to: '74153 Pins 6 (1C0), 5 (1C1), 4 (1C2), 3 (1C3)' },
      { signal: 'Select Lines (S0, S1)', from: 'D4 (S0), D5 (S1)', to: '74153 Pin 14 (A / S0), Pin 2 (B / S1)' },
      { signal: 'MUX Output (Y)', from: '74153 Pin 7 (1Y)', to: 'D8 (User LED 0)' },
    ],
    resultStatement:
      'Implemented the 4:1 Multiplexer using IC 74153 and verified Y = S1\'S0\'I0 + S1\'S0I1 + S1S0\'I2 + S1S0I3 across all four select combinations as well as the active-LOW disable state (EA\' = 1 forces Y = 0).',
    vivaQuestions: [
      {
        question: 'What is the Boolean expression for a 4:1 Multiplexer output Y?',
        answer: 'Y = EA\'\' · (S1\'S0\'I0 + S1\'S0I1 + S1S0\'I2 + S1S0I3), where EA\' is the active-LOW enable.',
      },
      {
        question: 'What happens to output Y of IC 74153 when the strobe pin 1G\' (Pin 1) is HIGH?',
        answer: 'The multiplexer is disabled and output 1Y (Pin 7) is forced LOW (0) regardless of data or select inputs.',
      },
      {
        question: 'How many select lines are required for a 16:1 multiplexer?',
        answer: 'Four select lines (log2(16) = 4).',
      },
      {
        question: 'Why is a multiplexer called a universal combinational building block?',
        answer: 'Any Boolean function of N variables can be realized directly by applying variables to select lines and 0/1/variable literals to data inputs.',
      },
    ],
  },

  'exp-decoder': {
    examNumber: 2,
    examTitle: '3:8 Decoder',
    icSubtitle: 'IC 74138',
    apparatus: [
      'IC 74138 (3-to-8 Line Decoder / Demultiplexer, DIP-16)',
      'NI ELVIS II / DLT-01 Digital Logic Trainer',
      'Regulated DC Power Supply (+5V & GND)',
      'Single-strand Hookup / Jumper Wires',
    ],
    connectionInstructions: [
      { signal: 'VCC / GND', from: '+5V / GND', to: '74138 Pin 16 (+5V) / Pin 8 (GND)' },
      { signal: 'Enable Inputs', from: 'D3 (G1), D4 (G2A\'), D5 (G2B\')', to: '74138 Pin 6 (G1=1), Pin 4 (G2A\'=0), Pin 5 (G2B\'=0)' },
      { signal: 'Address Inputs (A, B, C)', from: 'D0 (A LSB), D1 (B), D2 (C MSB)', to: '74138 Pins 1 (A), 2 (B), 3 (C)' },
      { signal: 'Active-LOW Outputs (Y0\'–Y7\')', from: '74138 Pins 15, 14, 13, 12, 11, 10, 9, 7', to: 'D8, D9, D10, D11, D12, D13, D14, D15 (LEDs 0–7)' },
    ],
    resultStatement:
      'Constructed the 3:8 Line Decoder using IC 74138 and verified all 3 enable conditions and 8 binary address inputs, confirming that exactly one active-LOW output becomes LOW when enabled.',
    vivaQuestions: [
      {
        question: 'What enable conditions must hold for IC 74138 to decode?',
        answer: 'G1 (Pin 6) must be HIGH (1), while both G2A\' (Pin 4) and G2B\' (Pin 5) must be LOW (0).',
      },
      {
        question: 'Why are the outputs of 74138 active-LOW (Y0\'–Y7\')?',
        answer: 'TTL outputs sink current more strongly in the LOW state, and active-LOW minterm outputs act as NAND terms for sum-of-minterms or chip-select decoding.',
      },
      {
        question: 'How many 3:8 decoders are needed to build a 4:16 decoder?',
        answer: 'Two 74138 ICs, using the MSB input connected to G1 on one IC and G2A\' on the other.',
      },
      {
        question: 'What is the output state if G2A\' = 1 while G1 = 1 and G2B\' = 0?',
        answer: 'The IC is disabled and all eight outputs Y0\'–Y7\' stay HIGH (1).',
      },
    ],
  },

  'exp-comparator': {
    examNumber: 3,
    examTitle: 'Magnitude Comparator',
    icSubtitle: 'IC 7485, 7486, 7408, 7404',
    apparatus: [
      'IC 7485 (4-Bit Magnitude Comparator, DIP-16)',
      'IC 7486 (Quad 2-Input XOR Gate, DIP-14)',
      'IC 7408 (Quad 2-Input AND Gate, DIP-14)',
      'IC 7404 (Hex Inverter, DIP-14)',
      'NI ELVIS II / DLT-01 Digital Logic Trainer & Jumper Wires',
    ],
    connectionInstructions: [
      { signal: 'VCC / GND', from: '+5V / GND', to: '7485 Pin 16 (+5V) / Pin 8 (GND)' },
      { signal: 'Word A (A0–A3)', from: 'D0, D1, D2, D3', to: '7485 Pins 10 (A0), 12 (A1), 13 (A2), 15 (A3)' },
      { signal: 'Word B (B0–B3)', from: 'D4, D5, D6, D7', to: '7485 Pins 9 (B0), 11 (B1), 14 (B2), 1 (B3)' },
      { signal: 'Cascade Inputs', from: 'GND / +5V / GND', to: 'IA<B (Pin 2)=0, IA=B (Pin 3)=1, IA>B (Pin 4)=0' },
      { signal: 'Comparison Outputs', from: '7485 Pins 5 (A>B), 6 (A=B), 7 (A<B)', to: 'D8, D9, D10 (LEDs)' },
    ],
    resultStatement:
      'Designed and verified both the 1-bit gate-level Magnitude Comparator (7486, 7408, 7404) and the 4-bit Magnitude Comparator (IC 7485) including cascade inputs, confirming mutually exclusive A>B, A=B, and A<B outputs.',
    vivaQuestions: [
      {
        question: 'Write the Boolean equations for a 1-bit magnitude comparator.',
        answer: 'A>B = A·B\', A<B = A\'·B, and A=B = (A ⊕ B)\' = A\'B\' + AB.',
      },
      {
        question: 'What is the purpose of cascade inputs IA>B, IA=B, and IA<B on IC 7485?',
        answer: 'They allow multiple 7485 ICs to be cascaded to compare 8-bit, 12-bit, or wider binary words; when the upper bits are equal, lower-stage outputs drive these pins.',
      },
      {
        question: 'How should cascade pins be connected for standalone 4-bit comparison on a single 7485?',
        answer: 'Tie IA=B (Pin 3) to +5V (HIGH) and tie IA>B (Pin 4) and IA<B (Pin 2) to GND (LOW).',
      },
      {
        question: 'In a 4-bit comparator, which bit pair is evaluated first?',
        answer: 'The Most Significant Bits (A3 vs B3). Only if A3 = B3 does the comparison proceed to lower bits.',
      },
    ],
  },

  'exp-sr-flipflop': {
    examNumber: 4,
    examTitle: 'Clocked SR Flip-Flop',
    icSubtitle: 'IC 7400',
    apparatus: [
      'IC 7400 (Quad 2-Input NAND Gate, DIP-14)',
      'NI ELVIS II / DLT-01 Digital Logic Trainer',
      'Regulated DC Power Supply (+5V & GND)',
      'Single-strand Hookup / Jumper Wires',
    ],
    connectionInstructions: [
      { signal: 'VCC / GND', from: '+5V / GND', to: '7400 Pin 14 (+5V) / Pin 7 (GND)' },
      { signal: 'Inputs S, R, CLK', from: 'D0 (S), D1 (R), D2 (CLK)', to: 'S -> Pin 1, R -> Pin 5, CLK -> Pins 2 & 4' },
      { signal: 'Steering to Latch', from: 'Pins 3 (S\'), 6 (R\')', to: 'Pin 3 -> Pin 10, Pin 6 -> Pin 13' },
      { signal: 'Cross-Coupled Latch', from: 'Pins 8 (Q), 11 (Q\')', to: 'Pin 8 -> Pin 12, Pin 11 -> Pin 9' },
      { signal: 'Outputs Q, Q\'', from: '7400 Pin 8 (Q), Pin 11 (Q\')', to: 'D8 (Q), D9 (Q\')' },
    ],
    clockConfig: {
      clkChannel: 2,
      clkLabel: 'D2 (CLK)',
      activeEdge: 'level',
    },
    resultStatement:
      'Constructed the Clocked SR Flip-Flop using four 2-input NAND gates (IC 7400) and verified Hold, Set (S=1, R=0), Reset (S=0, R=1), CLK=0 Latching, and the Forbidden state (S=1, R=1 -> Q=Q\'=1).',
    vivaQuestions: [
      {
        question: 'Why does the NAND clocked SR flip-flop produce Q=1 and Q\'=1 in the S=1, R=1 state?',
        answer: 'When CLK=1, S=1, R=1, both steering NAND outputs S\' and R\' become 0, forcing both cross-coupled latch NAND gates to output 1.',
      },
      {
        question: 'How does the circuit behave when CLK = 0?',
        answer: 'Both steering NAND gates output 1 (S\'=1, R\'=1) regardless of S and R, so the cross-coupled NAND latch holds its previous state.',
      },
      {
        question: 'What is the difference between a latch and an edge-triggered flip-flop?',
        answer: 'A latch responds whenever the enable/clock level is active, whereas an edge-triggered flip-flop changes state only on a clock transition (rising or falling edge).',
      },
      {
        question: 'How can the forbidden state S=R=1 be eliminated?',
        answer: 'By adding feedback from Q and Q\' to the input gates (forming a JK flip-flop) or tying S and R through an inverter (forming a D flip-flop).',
      },
    ],
  },

  'exp-jk-flipflop': {
    examNumber: 5,
    examTitle: 'JK Flip-Flop',
    icSubtitle: 'IC 7476',
    apparatus: [
      'IC 7476 (Dual J-K Flip-Flop with Preset & Clear, DIP-16)',
      'NI ELVIS II / DLT-01 Digital Logic Trainer',
      'Regulated DC Power Supply (+5V & GND)',
      'Single-strand Hookup / Jumper Wires',
    ],
    connectionInstructions: [
      { signal: 'Non-Standard VCC / GND', from: '+5V / GND', to: '7476 Pin 5 (+5V) / Pin 13 (GND)' },
      { signal: 'Sync Inputs J, K', from: 'D0 (J), D1 (K)', to: '7476 Pin 4 (1J), Pin 16 (1K)' },
      { signal: 'Clock CLK\'', from: 'D2 (CLK)', to: '7476 Pin 1 (1CLK\', Falling Edge)' },
      { signal: 'Async Controls PRE\', CLR\'', from: 'D3 (PRE\'), D4 (CLR\')', to: '7476 Pin 2 (1PRE\'), Pin 3 (1CLR\')' },
      { signal: 'Outputs Q, Q\'', from: '7476 Pin 15 (1Q), Pin 14 (1Q\')', to: 'D8 (Q), D9 (Q\')' },
    ],
    clockConfig: {
      clkChannel: 2,
      clkLabel: 'D2 (CLK\')',
      resetChannel: 4,
      resetLabel: 'CLR\' (D4)',
      resetActiveLow: true,
      preChannel: 3,
      activeEdge: 'falling',
    },
    resultStatement:
      'Verified all synchronous J-K operations (Hold, Reset, Set, Toggle on falling clock edges) and asynchronous active-LOW Preset (PRE\') and Clear (CLR\') inputs on IC 7476.',
    vivaQuestions: [
      {
        question: 'Which pins supply power (+5V and GND) to IC 7476?',
        answer: 'IC 7476 uses non-standard power pins: Pin 5 is VCC (+5V) and Pin 13 is GND (0V).',
      },
      {
        question: 'What is the race-around condition in a level-triggered JK flip-flop?',
        answer: 'When J=K=1 and clock pulse width exceeds propagation delay, Q toggles repeatedly during one clock HIGH interval. Master-slave or edge-triggered 74LS76 eliminates this.',
      },
      {
        question: 'How do asynchronous PRE\' and CLR\' affect outputs compared to J, K, and CLK?',
        answer: 'PRE\' and CLR\' are active-LOW and override J, K, and CLK immediately without waiting for a clock edge.',
      },
      {
        question: 'What is the characteristic equation of a JK flip-flop?',
        answer: 'Q(next) = J·Q\' + K\'·Q.',
      },
    ],
  },

  'exp-d-flipflop': {
    examNumber: 6,
    examTitle: 'D Flip-Flop',
    icSubtitle: 'IC 7474',
    apparatus: [
      'IC 7474 (Dual Positive-Edge-Triggered D Flip-Flop, DIP-14)',
      'NI ELVIS II / DLT-01 Digital Logic Trainer',
      'Regulated DC Power Supply (+5V & GND)',
      'Single-strand Hookup / Jumper Wires',
    ],
    connectionInstructions: [
      { signal: 'VCC / GND', from: '+5V / GND', to: '7474 Pin 14 (+5V) / Pin 7 (GND)' },
      { signal: 'Data Input D', from: 'D0 (D)', to: '7474 Pin 2 (1D)' },
      { signal: 'Clock Input CLK', from: 'D1 (CLK)', to: '7474 Pin 3 (1CLK, Rising Edge)' },
      { signal: 'Async Controls PRE\', CLR\'', from: 'D2 (PRE\'), D3 (CLR\')', to: '7474 Pin 4 (1PRE\'), Pin 1 (1CLR\')' },
      { signal: 'Outputs Q, Q\'', from: '7474 Pin 5 (1Q), Pin 6 (1Q\')', to: 'D8 (Q), D9 (Q\')' },
    ],
    clockConfig: {
      clkChannel: 1,
      clkLabel: 'D1 (CLK)',
      resetChannel: 3,
      resetLabel: 'CLR\' (D3)',
      resetActiveLow: true,
      preChannel: 2,
      activeEdge: 'rising',
    },
    resultStatement:
      'Verified positive-edge-triggered data capture on IC 7474, confirming that changes to D without a rising clock edge leave Q unchanged while active-LOW PRE\' and CLR\' asynchronously force Q=1 or Q=0.',
    vivaQuestions: [
      {
        question: 'On which clock transition does IC 7474 capture the D input?',
        answer: 'On the positive-going (rising, LOW → HIGH) edge of the clock pulse.',
      },
      {
        question: 'If D changes from 1 to 0 while CLK stays HIGH, does Q change on 7474?',
        answer: 'No. Because 7474 is positive-edge-triggered, Q holds its stored state until the next rising clock edge (or async PRE\'/CLR\').',
      },
      {
        question: 'What are setup time and hold time for a D flip-flop?',
        answer: 'Setup time is the minimum interval D must remain stable before the rising clock edge; hold time is the minimum interval D must remain stable after the clock edge.',
      },
      {
        question: 'Why is a D flip-flop also called a Delay or Data flip-flop?',
        answer: 'It transfers the Data bit present at D to Q delayed by one clock cycle, making it ideal for registers and shift registers.',
      },
    ],
  },

  'exp-t-flipflop': {
    examNumber: 7,
    examTitle: 'T Flip-Flop using JK',
    icSubtitle: 'IC 7476',
    apparatus: [
      'IC 7476 (Dual J-K Flip-Flop, DIP-16)',
      'NI ELVIS II / DLT-01 Digital Logic Trainer',
      'Regulated DC Power Supply (+5V & GND)',
      'Single-strand Hookup / Jumper Wires',
    ],
    connectionInstructions: [
      { signal: 'Non-Standard VCC / GND', from: '+5V / GND', to: '7476 Pin 5 (+5V) / Pin 13 (GND)' },
      { signal: 'Preset Tied High', from: '+5V', to: '7476 Pin 2 (1PRE\') -> +5V' },
      { signal: 'Clear Reset CLR\'', from: 'D2 (CLR\')', to: '7476 Pin 3 (1CLR\')' },
      { signal: 'Toggle Input T (J = K)', from: 'D0 (T)', to: '7476 Pin 4 (1J) bridged to Pin 16 (1K)' },
      { signal: 'Clock CLK\' & Outputs', from: 'D1 (CLK) / Pins 15, 14', to: 'Pin 1 (1CLK\'); Q (15)->D8, Q\' (14)->D9' },
    ],
    clockConfig: {
      clkChannel: 1,
      clkLabel: 'D1 (CLK\')',
      resetChannel: 2,
      resetLabel: 'CLR\' (D2)',
      resetActiveLow: true,
      activeEdge: 'falling',
    },
    resultStatement:
      'Constructed the T Flip-Flop by tying J and K together on IC 7476, verifying Hold when T=0 and toggle-on-every-clock-cycle (divide-by-2 frequency division) when T=1.',
    vivaQuestions: [
      {
        question: 'How is a JK flip-flop converted into a T flip-flop?',
        answer: 'By tying both J and K inputs together to form the single Toggle input T (J = K = T).',
      },
      {
        question: 'What is the output frequency if a 10 kHz clock drives a T flip-flop with T = 1?',
        answer: '5 kHz (f_out = f_clk / 2), because Q requires two clock periods to complete one output cycle.',
      },
      {
        question: 'What does Q do on active clock edges when T = 0?',
        answer: 'Since J = K = 0, the flip-flop holds its previous state.',
      },
      {
        question: 'How do you convert a D flip-flop into a T flip-flop?',
        answer: 'Connect D = T ⊕ Q using an XOR gate so D becomes Q\' when T=1 and Q when T=0.',
      },
    ],
  },

  'exp-ring-counter': {
    examNumber: 8,
    examTitle: '3-bit Ring Counter',
    icSubtitle: 'IC 7474',
    apparatus: [
      '2 × IC 7474 (Dual Positive-Edge D Flip-Flop, DIP-14)',
      'NI ELVIS II / DLT-01 Digital Logic Trainer',
      'Regulated DC Power Supply (+5V & GND)',
      'Single-strand Hookup / Jumper Wires',
    ],
    connectionInstructions: [
      { signal: 'VCC / GND (Both ICs)', from: '+5V / GND', to: 'IC1 & IC2 Pin 14 (+5V) / Pin 7 (GND)' },
      { signal: 'Common Clock CLK', from: 'D0 (CLK)', to: 'IC1 Pin 3, IC1 Pin 11, IC2 Pin 3' },
      { signal: 'ORI\' Initialize (100)', from: 'D1 (ORI\')', to: 'IC1 Pin 4 (1PRE\'), IC1 Pin 13 (2CLR\'), IC2 Pin 1 (1CLR\')' },
      { signal: 'Inactive Async Pins', from: '+5V', to: 'IC1 Pin 1 (1CLR\'), IC1 Pin 10 (2PRE\'), IC2 Pin 4 (1PRE\')' },
      { signal: 'Shift + Ring Feedback', from: 'Q2->D1, Q1->D0, Q0->D2', to: 'IC1 5->12, IC1 9->IC2 2, IC2 5->IC1 2; Q2,Q1,Q0 -> D8,D9,D10' },
    ],
    clockConfig: {
      clkChannel: 0,
      clkLabel: 'D0 (CLK)',
      resetChannel: 1,
      resetLabel: 'ORI\' (Init 100)',
      resetActiveLow: true,
      activeEdge: 'rising',
    },
    resultStatement:
      'Built the 3-bit Ring Counter using two 7474 D flip-flop ICs and verified the circulating single-1 sequence 100 → 010 → 001 → 100 on successive clock pulses.',
    vivaQuestions: [
      {
        question: 'How many states does an N-bit Ring Counter cycle through?',
        answer: 'N states (3 states for a 3-bit ring counter: 100, 010, 001), making it a Mod-N counter.',
      },
      {
        question: 'Why must a Ring Counter be initialized with ORI\' before clocking?',
        answer: 'If all flip-flops power up at 000, feeding Q0=0 back to D2 would leave the counter stuck at 000 forever.',
      },
      {
        question: 'How is feedback connected in a Ring Counter?',
        answer: 'The true (non-inverted) output Q0 of the last stage connects directly to the serial data input D2 of the first stage.',
      },
      {
        question: 'What is a key advantage of a Ring Counter?',
        answer: 'Its outputs are already one-hot decoded, requiring no external decoding gates.',
      },
    ],
  },

  'exp-johnson-counter': {
    examNumber: 9,
    examTitle: '3-bit Johnson Counter',
    icSubtitle: 'IC 7474',
    apparatus: [
      '2 × IC 7474 (Dual Positive-Edge D Flip-Flop, DIP-14)',
      'NI ELVIS II / DLT-01 Digital Logic Trainer',
      'Regulated DC Power Supply (+5V & GND)',
      'Single-strand Hookup / Jumper Wires',
    ],
    connectionInstructions: [
      { signal: 'VCC / GND (Both ICs)', from: '+5V / GND', to: 'IC1 & IC2 Pin 14 (+5V) / Pin 7 (GND)' },
      { signal: 'Common Clock CLK', from: 'D0 (CLK)', to: 'IC1 Pin 3, IC1 Pin 11, IC2 Pin 3' },
      { signal: 'ORI\' Clear All (000)', from: 'D1 (ORI\')', to: 'IC1 Pin 1 (1CLR\'), IC1 Pin 13 (2CLR\'), IC2 Pin 1 (1CLR\')' },
      { signal: 'Preset Pins Tied High', from: '+5V', to: 'IC1 Pin 4 (1PRE\'), IC1 Pin 10 (2PRE\'), IC2 Pin 4 (1PRE\')' },
      { signal: 'Twisted Feedback', from: 'Q2->D1, Q1->D0, Q0\'->D2', to: 'IC1 5->12, IC1 9->IC2 2, IC2 6 (Q0\')->IC1 2; Q2,Q1,Q0 -> D8,D9,D10' },
    ],
    clockConfig: {
      clkChannel: 0,
      clkLabel: 'D0 (CLK)',
      resetChannel: 1,
      resetLabel: 'ORI\' (Clear 000)',
      resetActiveLow: true,
      activeEdge: 'rising',
    },
    resultStatement:
      'Implemented the 3-bit Johnson (twisted-ring) Counter using IC 7474 and verified the complete 6-state counting sequence 000 → 100 → 110 → 111 → 011 → 001 → 000.',
    vivaQuestions: [
      {
        question: 'What distinguishes a Johnson Counter from a Ring Counter?',
        answer: 'A Johnson (twisted-ring) counter feeds the inverted output Q0\' of the last flip-flop back to the D input of the first stage, yielding 2N states instead of N.',
      },
      {
        question: 'List all 6 valid states of a 3-bit Johnson Counter.',
        answer: '000 → 100 → 110 → 111 → 011 → 001 → 000.',
      },
      {
        question: 'Does a Johnson Counter require a non-zero preset like a Ring Counter to start?',
        answer: 'No. Starting from 000, Q0\' = 1 shifts into the MSB on the first clock pulse, self-starting into 100.',
      },
      {
        question: 'How many unused (lock-out) states exist in a 3-bit Johnson Counter?',
        answer: '2^3 - 2(3) = 8 - 6 = 2 unused states (010 and 101).',
      },
    ],
  },

  'exp-decade-counter': {
    examNumber: 10,
    examTitle: 'Decade Counter',
    icSubtitle: 'IC 74LS90',
    apparatus: [
      'IC 74LS90 (BCD Decade Ripple Counter, DIP-14)',
      'NI ELVIS II / DLT-01 Digital Logic Trainer',
      'Regulated DC Power Supply (+5V & GND)',
      'Single-strand Hookup / Jumper Wires',
    ],
    connectionInstructions: [
      { signal: 'Non-Standard VCC / GND', from: '+5V / GND', to: '74LS90 Pin 5 (+5V) / Pin 10 (GND)' },
      { signal: 'Clock & Mod-10 Bridge', from: 'D0 (CLK) & Pin 12 (QA)', to: 'D0 -> Pin 14 (CKA); Bridge Pin 12 (QA) -> Pin 1 (CKB)' },
      { signal: 'Master Reset MR (R0)', from: 'D1 (MR)', to: '74LS90 Pin 2 (R0(1)) and Pin 3 (R0(2))' },
      { signal: 'Preset-9 Disabled', from: 'GND', to: '74LS90 Pin 6 (R9(1)) and Pin 7 (R9(2)) -> GND' },
      { signal: 'BCD Outputs (QD QC QB QA)', from: 'Pins 11 (QD), 8 (QC), 9 (QB), 12 (QA)', to: 'D8 (QA), D9 (QB), D10 (QC), D11 (QD)' },
    ],
    clockConfig: {
      clkChannel: 0,
      clkLabel: 'D0 (CKA\')',
      resetChannel: 1,
      resetLabel: 'MR (Reset 0)',
      resetActiveLow: false,
      activeEdge: 'falling',
    },
    resultStatement:
      'Constructed the BCD Decade Counter using IC 74LS90 and verified decimal counting from 0000 to 1001 with automatic reset back to 0000 upon reaching decimal 10.',
    vivaQuestions: [
      {
        question: 'Why must Pin 12 (QA) be connected externally to Pin 1 (CKB) in IC 74LS90?',
        answer: '74LS90 internally separates its Mod-2 stage (CKA → QA) and Mod-5 stage (CKB → QB, QC, QD). Bridging QA to CKB cascades them into a Mod-10 (8421 BCD) counter.',
      },
      {
        question: 'Which pins are VCC and GND on IC 74LS90?',
        answer: 'Non-standard pinout: Pin 5 is VCC (+5V) and Pin 10 is GND (0V). Pins 4 and 13 are No Connection (NC).',
      },
      {
        question: 'How does the counter reset cleanly at decimal 10 (1010)?',
        answer: 'When both R0(1) and R0(2) are LOW, the internal Mod-5 resets to 0 after state 4 (QD=1, QB=0 → 1001 wraps to 0000 on the 10th falling pulse).',
      },
      {
        question: 'What happens if R9(1) Pin 6 and R9(2) Pin 7 are both set HIGH?',
        answer: 'The asynchronous Preset-9 overrides the counter and immediately sets QD QC QB QA = 1001 (decimal 9).',
      },
    ],
  },

  'exp-encoder': {
    examNumber: 11,
    examTitle: '8:3 Priority Encoder',
    icSubtitle: 'IC 74148',
    apparatus: [
      'IC 74148 (8-to-3 Line Priority Encoder, DIP-16)',
      'NI ELVIS II / DLT-01 Digital Logic Trainer',
      'Regulated DC Power Supply (+5V & GND)',
      'Single-strand Hookup / Jumper Wires',
    ],
    connectionInstructions: [
      { signal: 'VCC / GND', from: '+5V / GND', to: '74148 Pin 16 (+5V) / Pin 8 (GND)' },
      { signal: 'Enable Input EI\'', from: 'GND', to: '74148 Pin 5 (EI\') -> GND (Active-LOW Enable)' },
      { signal: 'Active-LOW Inputs 0\'–3\'', from: 'D0, D1, D2, D3', to: '74148 Pins 10 (0\'), 11 (1\'), 12 (2\'), 13 (3\')' },
      { signal: 'Active-LOW Inputs 4\'–7\'', from: 'D4, D5, D6, D7', to: '74148 Pins 1 (4\'), 2 (5\'), 3 (6\'), 4 (7\')' },
      { signal: 'Encoded & Status Outputs', from: 'Pins 9 (A0\'), 7 (A1\'), 6 (A2\'), 14 (GS\'), 15 (EO\')', to: 'D8 (A0\'), D9 (A1\'), D10 (A2\'), D11 (GS\'), D12 (EO\')' },
    ],
    resultStatement:
      'Verified the 8:3 Priority Encoder using IC 74148 across inactive, single-input, and multiple simultaneous active-LOW inputs, confirming highest-input priority resolution along with GS\' and EO\' indicators.',
    vivaQuestions: [
      {
        question: 'Which input line has the highest priority in IC 74148?',
        answer: 'Input 7\' (Pin 4) has the highest priority, overriding inputs 6\' down to 0\' whenever 7\' = 0 (LOW).',
      },
      {
        question: 'Distinguish between GS\' (Group Signal) and EO\' (Enable Output).',
        answer: 'When EI\'=0, GS\' goes LOW if ANY data input (0\'–7\') is LOW; EO\' goes LOW only when ALL data inputs are HIGH (none active), enabling cascading.',
      },
      {
        question: 'What are the outputs (A2\' A1\' A0\', GS\', EO\') when EI\'=0 and inputs 5\'=0 and 2\'=0?',
        answer: 'Input 5\' wins priority (binary 101), so active-LOW A2\'A1\'A0\' = 010, GS\' = 0, and EO\' = 1.',
      },
      {
        question: 'How can two 74148 ICs be cascaded into a 16:4 priority encoder?',
        answer: 'Connect the upper-priority IC\'s EO\' (Pin 15) to the lower-priority IC\'s EI\' (Pin 5).',
      },
    ],
  },

  'exp-demultiplexer': {
    examNumber: 12,
    examTitle: '1:4 Demultiplexer',
    icSubtitle: 'IC 74139',
    apparatus: [
      'IC 74139 (Dual 2-to-4 Decoder / 1-to-4 Demultiplexer, DIP-16)',
      'NI ELVIS II / DLT-01 Digital Logic Trainer',
      'Regulated DC Power Supply (+5V & GND)',
      'Single-strand Hookup / Jumper Wires',
    ],
    connectionInstructions: [
      { signal: 'VCC / GND', from: '+5V / GND', to: '74139 Pin 16 (+5V) / Pin 8 (GND)' },
      { signal: 'Data / Enable Control (1G\')', from: 'D0 (Data / Ea\')', to: '74139 Pin 1 (1G\' / Ea\', Active-LOW)' },
      { signal: 'Select Inputs (S0, S1)', from: 'D1 (S0), D2 (S1)', to: '74139 Pin 2 (1A / S0), Pin 3 (1B / S1)' },
      { signal: 'Active-LOW Outputs (Y0\'–Y3\')', from: '74139 Pins 4 (Y0\'), 5 (Y1\'), 6 (Y2\'), 7 (Y3\')', to: 'D8 (Y0\'), D9 (Y1\'), D10 (Y2\'), D11 (Y3\')' },
    ],
    resultStatement:
      'Implemented the 1:4 Demultiplexer using IC 74139 with the active-LOW enable serving as the data line, verifying that only the selected output follows Data=0 LOW across all four select combinations.',
    vivaQuestions: [
      {
        question: 'How does IC 74139 (a 2:4 decoder) function as a 1:4 demultiplexer?',
        answer: 'The data signal is applied to the active-LOW enable input 1G\' (Pin 1), while select lines S1, S0 choose which output channel receives the LOW pulse when Data = 0.',
      },
      {
        question: 'What are outputs Y0\'–Y3\' when Data (1G\') = 1 regardless of S1, S0?',
        answer: 'All four outputs remain HIGH (1111) because the enable is inactive.',
      },
      {
        question: 'Why are the 74139 outputs Y0\'–Y3\' inverted (active-LOW)?',
        answer: 'Because the internal decoding gates use NAND/NOR stages matching active-LOW enable gating, so selected output Yk\' follows G\' (0 when G\'=0, 1 when G\'=1).',
      },
      {
        question: 'Compare a Multiplexer and a Demultiplexer.',
        answer: 'A MUX routes one of 2^N inputs onto 1 shared output line (many-to-one), whereas a DEMUX routes 1 input signal onto one of 2^N output lines (one-to-many).',
      },
    ],
  },
};

export function getPracticalExamExperiments(): ExperimentDef[] {
  return PRACTICAL_EXAM_IDS.map((id) => {
    const found = LAB_EXPERIMENTS.find((e) => e.id === id);
    if (!found) {
      throw new Error(`Missing practical exam experiment definition: ${id}`);
    }
    return found;
  });
}
