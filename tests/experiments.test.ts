import test from 'node:test';
import assert from 'node:assert/strict';

import { LAB_EXPERIMENTS } from '../src/data/experiments';
import {
  PRACTICAL_EXAM_IDS,
  PRACTICAL_EXAM_SUPPLEMENTS,
  getPracticalExamExperiments,
} from '../src/data/practicalExamData';
import { IC_DEFINITIONS } from '../src/data/icDefinitions';
import { simulateCircuit, getPinPluggedHoleId } from '../src/simulation/engine';
import { evaluateExperiment, resolveExperimentVariant } from '../src/simulation/experimentEvaluator';
import { runConnectionCheck } from '../src/simulation/connectionChecker';
import { CircuitSimState, LogicLevel, PlacedIC, Wire } from '../src/types/circuit';

function levelToBit(lvl: LogicLevel): number {
  assert.ok(
    lvl === 'HIGH' || lvl === 'LOW',
    `Expected definite HIGH/LOW logic level, got "${lvl}"`
  );
  return lvl === 'HIGH' ? 1 : 0;
}

function buildWiredICTestRig(
  icDefId: string,
  pinToChannel: Record<number, number>, // IC pin -> D0..D7
  pinToFixedPower: Record<number, 'VCC' | 'GND'>, // IC pin -> +5V or GND
  outputPinToChannel: Record<number, number> // IC output pin -> D8..D15
): { ics: PlacedIC[]; wires: Wire[] } {
  const def = IC_DEFINITIONS[icDefId];
  assert.ok(def, `IC definition ${icDefId} must exist`);

  const ic: PlacedIC = {
    instanceId: `test-${icDefId}`,
    icDefId,
    startCol: 8,
    rotation: 0,
  };

  const wires: Wire[] = [
    { id: 'w-vcc-src', fromHoleId: 'vcc-src', toHoleId: 'top-power-plus-1', color: 'red' },
    { id: 'w-gnd-src', fromHoleId: 'gnd-src', toHoleId: 'top-power-minus-1', color: 'black' },
    {
      id: 'w-ic-vcc',
      fromHoleId: 'top-power-plus-8',
      toHoleId: getPinPluggedHoleId(ic, def.vccPin),
      color: 'red',
    },
    {
      id: 'w-ic-gnd',
      fromHoleId: 'top-power-minus-8',
      toHoleId: getPinPluggedHoleId(ic, def.gndPin),
      color: 'black',
    },
  ];

  for (const [pinStr, ch] of Object.entries(pinToChannel)) {
    wires.push({
      id: `w-in-${pinStr}`,
      fromHoleId: `d${ch}`,
      toHoleId: getPinPluggedHoleId(ic, Number(pinStr)),
      color: 'blue',
    });
  }

  for (const [pinStr, pwr] of Object.entries(pinToFixedPower)) {
    wires.push({
      id: `w-fix-${pinStr}`,
      fromHoleId: pwr === 'VCC' ? 'top-power-plus-10' : 'top-power-minus-10',
      toHoleId: getPinPluggedHoleId(ic, Number(pinStr)),
      color: pwr === 'VCC' ? 'red' : 'black',
    });
  }

  for (const [pinStr, ch] of Object.entries(outputPinToChannel)) {
    wires.push({
      id: `w-out-${pinStr}`,
      fromHoleId: getPinPluggedHoleId(ic, Number(pinStr)),
      toHoleId: `d${ch}`,
      color: 'green',
    });
  }

  return { ics: [ic], wires };
}

// =====================================================================
// 1. EXHAUSTIVE COMBINATIONAL IC TESTS (ALL INPUT COMBINATIONS)
// =====================================================================

test('74153 Dual 4:1 MUX - exhaustive 128 combinations per section + floating enable check', () => {
  // Section 1: 1G'=pin1(D0), S1=pin2(D1), S0=pin14(D2), 1C0=pin6(D3), 1C1=pin5(D4), 1C2=pin4(D5), 1C3=pin3(D6) -> 1Y=pin7(D8)
  const rig1 = buildWiredICTestRig(
    '74153',
    { 1: 0, 2: 1, 14: 2, 6: 3, 5: 4, 4: 5, 3: 6 },
    {},
    { 7: 8 }
  );

  for (let mask = 0; mask < 128; mask++) {
    const g = (mask >> 0) & 1;
    const s1 = (mask >> 1) & 1;
    const s0 = (mask >> 2) & 1;
    const i0 = (mask >> 3) & 1;
    const i1 = (mask >> 4) & 1;
    const i2 = (mask >> 5) & 1;
    const i3 = (mask >> 6) & 1;

    const inputStates = [!!g, !!s1, !!s0, !!i0, !!i1, !!i2, !!i3, false];
    const sim = simulateCircuit(rig1.ics, rig1.wires, { inputStates, powerOn: true });
    const actualY = levelToBit(sim.outputStates[0]);

    const sel = (s1 << 1) | s0;
    const data = [i0, i1, i2, i3][sel];
    const expectedY = g === 1 ? 0 : data;

    assert.equal(
      actualY,
      expectedY,
      `74153 Sec1 failed at mask=${mask} (1G'=${g}, S1=${s1}, S0=${s0}, I=${i0}${i1}${i2}${i3})`
    );
  }

  // Section 2: 2G'=pin15(D0), S1=pin2(D1), S0=pin14(D2), 2C0=pin10(D3), 2C1=pin11(D4), 2C2=pin12(D5), 2C3=pin13(D6) -> 2Y=pin9(D8)
  const rig2 = buildWiredICTestRig(
    '74153',
    { 15: 0, 2: 1, 14: 2, 10: 3, 11: 4, 12: 5, 13: 6 },
    {},
    { 9: 8 }
  );

  for (let mask = 0; mask < 128; mask++) {
    const g = (mask >> 0) & 1;
    const s1 = (mask >> 1) & 1;
    const s0 = (mask >> 2) & 1;
    const c0 = (mask >> 3) & 1;
    const c1 = (mask >> 4) & 1;
    const c2 = (mask >> 5) & 1;
    const c3 = (mask >> 6) & 1;

    const inputStates = [!!g, !!s1, !!s0, !!c0, !!c1, !!c2, !!c3, false];
    const sim = simulateCircuit(rig2.ics, rig2.wires, { inputStates, powerOn: true });
    const actualY = levelToBit(sim.outputStates[0]);

    const sel = (s1 << 1) | s0;
    const data = [c0, c1, c2, c3][sel];
    const expectedY = g === 1 ? 0 : data;

    assert.equal(actualY, expectedY, `74153 Sec2 failed at mask=${mask}`);
  }
});

test('74139 Dual 1:4 DEMUX - exhaustive combinations for both sections', () => {
  // Section 1: 1G'=pin1(D0), 1A=pin2(D1), 1B=pin3(D2) -> 1Y0'..1Y3'=pins 4,5,6,7 -> D8..D11
  const rig1 = buildWiredICTestRig('74139', { 1: 0, 2: 1, 3: 2 }, {}, { 4: 8, 5: 9, 6: 10, 7: 11 });
  for (let mask = 0; mask < 8; mask++) {
    const g = (mask >> 0) & 1;
    const a = (mask >> 1) & 1;
    const b = (mask >> 2) & 1;
    const sim = simulateCircuit(rig1.ics, rig1.wires, {
      inputStates: [!!g, !!a, !!b, false, false, false, false, false],
      powerOn: true,
    });
    const sel = (b << 1) | a;
    for (let y = 0; y < 4; y++) {
      const expected = g === 0 && sel === y ? 0 : 1;
      assert.equal(levelToBit(sim.outputStates[y]), expected, `74139 Sec1 Y${y}' mismatch at mask=${mask}`);
    }
  }

  // Section 2: 2G'=pin15(D0), 2A=pin14(D1), 2B=pin13(D2) -> 2Y0'..2Y3'=pins 12,11,10,9 -> D8..D11
  const rig2 = buildWiredICTestRig('74139', { 15: 0, 14: 1, 13: 2 }, {}, { 12: 8, 11: 9, 10: 10, 9: 11 });
  for (let mask = 0; mask < 8; mask++) {
    const g = (mask >> 0) & 1;
    const a = (mask >> 1) & 1;
    const b = (mask >> 2) & 1;
    const sim = simulateCircuit(rig2.ics, rig2.wires, {
      inputStates: [!!g, !!a, !!b, false, false, false, false, false],
      powerOn: true,
    });
    const sel = (b << 1) | a;
    for (let y = 0; y < 4; y++) {
      const expected = g === 0 && sel === y ? 0 : 1;
      assert.equal(levelToBit(sim.outputStates[y]), expected, `74139 Sec2 Y${y}' mismatch at mask=${mask}`);
    }
  }
});

test('74138 3:8 Decoder - exhaustive 64 input & enable combinations', () => {
  // G1=pin6(D0), G2A'=pin4(D1), G2B'=pin5(D2), C=pin3(D3), B=pin2(D4), A=pin1(D5)
  // Outputs Y0'..Y7' = pins 15,14,13,12,11,10,9,7 -> D8..D15
  const rig = buildWiredICTestRig(
    '74138',
    { 6: 0, 4: 1, 5: 2, 3: 3, 2: 4, 1: 5 },
    {},
    { 15: 8, 14: 9, 13: 10, 12: 11, 11: 12, 10: 13, 9: 14, 7: 15 }
  );

  for (let mask = 0; mask < 64; mask++) {
    const g1 = (mask >> 0) & 1;
    const g2a = (mask >> 1) & 1;
    const g2b = (mask >> 2) & 1;
    const c = (mask >> 3) & 1;
    const b = (mask >> 4) & 1;
    const a = (mask >> 5) & 1;

    const sim = simulateCircuit(rig.ics, rig.wires, {
      inputStates: [!!g1, !!g2a, !!g2b, !!c, !!b, !!a, false, false],
      powerOn: true,
    });

    const enabled = g1 === 1 && g2a === 0 && g2b === 0;
    const idx = (c << 2) | (b << 1) | a;
    const actualOutputs = sim.outputStates.map(levelToBit);

    if (!enabled) {
      assert.deepEqual(actualOutputs, [1, 1, 1, 1, 1, 1, 1, 1], `74138 must disable at mask=${mask}`);
    } else {
      const lowCount = actualOutputs.filter((v) => v === 0).length;
      assert.equal(lowCount, 1, `74138 must have exactly one LOW output when enabled (mask=${mask})`);
      assert.equal(actualOutputs[idx], 0, `74138 Y${idx}' must be LOW at mask=${mask}`);
    }
  }
});

test('74148 8:3 Priority Encoder - exhaustive 512 combinations of EI\' and 7\'..0\'', () => {
  // Using two passes or direct IC pin + D0..D7: wait, 74148 has 9 inputs (EI' + 0'..7'), D0..D7 only has 8 switches!
  // We can test EI'=0 across all 2^8 = 256 combinations of 0'..7' via D0..D7 with EI' wired to GND,
  // AND test EI'=1 across all 2^8 = 256 combinations with EI' wired to VCC! Total = 512!
  const makeRig = (eiPower: 'VCC' | 'GND') =>
    buildWiredICTestRig(
      '74148',
      { 10: 0, 11: 1, 12: 2, 13: 3, 1: 4, 2: 5, 3: 6, 4: 7 },
      { 5: eiPower },
      { 6: 8, 7: 9, 9: 10, 14: 11, 15: 12 } // A2'=D8, A1'=D9, A0'=D10, GS'=D11, EO'=D12
    );

  const rigEnabled = makeRig('GND');
  const rigDisabled = makeRig('VCC');

  for (let mask = 0; mask < 256; mask++) {
    const inputStates = Array.from({ length: 8 }, (_, bit) => ((mask >> bit) & 1) === 1);

    // 1) EI' = 1 (Disabled) -> all outputs must be HIGH
    const simDis = simulateCircuit(rigDisabled.ics, rigDisabled.wires, { inputStates, powerOn: true });
    assert.deepEqual(
      simDis.outputStates.slice(0, 5).map(levelToBit),
      [1, 1, 1, 1, 1],
      `74148 EI'=1 must set A2',A1',A0',GS',EO' all HIGH (mask=${mask})`
    );

    // 2) EI' = 0 (Enabled) -> highest priority LOW input determines encoded active-LOW output
    const simEn = simulateCircuit(rigEnabled.ics, rigEnabled.wires, { inputStates, powerOn: true });
    const actual = simEn.outputStates.slice(0, 5).map(levelToBit);

    let highestActive = -1;
    for (let i = 7; i >= 0; i--) {
      if (!inputStates[i]) {
        highestActive = i;
        break;
      }
    }

    if (highestActive === -1) {
      // All 8 inputs HIGH -> EO'=0, GS'=1, A2'A1'A0'=111
      assert.deepEqual(actual, [1, 1, 1, 1, 0], `74148 no-active failed at mask=${mask}`);
    } else {
      const expA2 = (highestActive & 4) !== 0 ? 0 : 1;
      const expA1 = (highestActive & 2) !== 0 ? 0 : 1;
      const expA0 = (highestActive & 1) !== 0 ? 0 : 1;
      // GS'=0, EO'=1
      assert.deepEqual(
        actual,
        [expA2, expA1, expA0, 0, 1],
        `74148 priority failed for highestActive=${highestActive} (mask=${mask})`
      );
    }
  }
});

test('7485 Magnitude Comparator - exhaustive 256 4-bit word pairs + 8 cascade combinations', () => {
  // Standalone 4-bit comparison (IA<B=0, IA=B=1, IA>B=0)
  // A3..A0 = pins 15,13,12,10 -> D3..D0; B3..B0 = pins 1,14,11,9 -> D7..D4
  const rigWord = buildWiredICTestRig(
    '7485',
    { 10: 0, 12: 1, 13: 2, 15: 3, 9: 4, 11: 5, 14: 6, 1: 7 },
    { 2: 'GND', 3: 'VCC', 4: 'GND' },
    { 5: 8, 6: 9, 7: 10 } // OA>B=D8, OA=B=D9, OA<B=D10
  );

  for (let a = 0; a < 16; a++) {
    for (let b = 0; b < 16; b++) {
      const inputStates = [
        !!((a >> 0) & 1),
        !!((a >> 1) & 1),
        !!((a >> 2) & 1),
        !!((a >> 3) & 1),
        !!((b >> 0) & 1),
        !!((b >> 1) & 1),
        !!((b >> 2) & 1),
        !!((b >> 3) & 1),
      ];
      const sim = simulateCircuit(rigWord.ics, rigWord.wires, { inputStates, powerOn: true });
      const actual = sim.outputStates.slice(0, 3).map(levelToBit);
      const expected = a > b ? [1, 0, 0] : a === b ? [0, 1, 0] : [0, 0, 1];
      assert.deepEqual(actual, expected, `7485 failed for A=${a}, B=${b}`);
      assert.equal(actual.filter((x) => x === 1).length, 1, `Exactly one comparison output must be HIGH`);
    }
  }

  // Cascade test when A == B (tie A0=B0=0, A1=B1=1, A2=B2=0, A3=B3=1)
  const rigCascade = buildWiredICTestRig(
    '7485',
    { 4: 0, 3: 1, 2: 2 }, // IA>B=D0, IA=B=D1, IA<B=D2
    { 10: 'GND', 9: 'GND', 12: 'VCC', 11: 'VCC', 13: 'GND', 14: 'GND', 15: 'VCC', 1: 'VCC' },
    { 5: 8, 6: 9, 7: 10 }
  );

  // TI SN74LS85 cascade truth table for A == B
  const cascadeExpected: Record<string, [number, number, number]> = {
    '1,0,0': [1, 0, 0], // IA>B=1, IA=B=0, IA<B=0 -> OA>B=1
    '0,0,1': [0, 0, 1], // IA>B=0, IA=B=0, IA<B=1 -> OA<B=1
    '0,1,0': [0, 1, 0], // IA=B=1 -> OA=B=1
    '1,1,0': [0, 1, 0], // L,H -> per TI datasheet IA=B=H forces OA=B=H, others L
    '0,1,1': [0, 1, 0],
    '1,1,1': [0, 1, 0],
    '0,0,0': [1, 0, 1], // TI datasheet: all cascade L -> OA>B=H, OA=B=L, OA<B=H
    '1,0,1': [0, 0, 0], // TI datasheet: H,L,H -> L,L,L
  };

  for (const [key, expOut] of Object.entries(cascadeExpected)) {
    const [igt, ieq, ilt] = key.split(',').map(Number);
    const sim = simulateCircuit(rigCascade.ics, rigCascade.wires, {
      inputStates: [!!igt, !!ieq, !!ilt, false, false, false, false, false],
      powerOn: true,
    });
    assert.deepEqual(
      sim.outputStates.slice(0, 3).map(levelToBit),
      expOut,
      `7485 cascade failed for IA>B,IA=B,IA<B=${key}`
    );
  }
});

// =====================================================================
// 2. SEQUENTIAL CIRCUITS & CLOCK EDGE / HOLD / RESET / SEQUENCE TESTS
// =====================================================================

function stepCircuit(
  ics: PlacedIC[],
  wires: Wire[],
  inputStates: boolean[],
  simState: CircuitSimState
): { outputs: number[]; nextState: CircuitSimState } {
  const sim = simulateCircuit(ics, wires, { inputStates, powerOn: true }, undefined, simState);
  return {
    outputs: sim.outputStates.map((s) => (s === 'HIGH' ? 1 : s === 'LOW' ? 0 : -1)),
    nextState: sim.nextState,
  };
}

test('7400 Clocked SR Flip-Flop - hold, set, reset, CLK=0 latching, and forbidden state', () => {
  const exp = LAB_EXPERIMENTS.find((e) => e.id === 'exp-sr-flipflop')!;
  assert.ok(exp.referenceCircuit);
  const { ics, wires } = exp.referenceCircuit!;

  // Inputs: S=D0, R=D1, CLK=D2; Outputs: Q=D8, Qb=D9
  let state: CircuitSimState = { icStates: {} };

  // Set (S=1, R=0, CLK=1) -> Q=1, Qb=0
  let step = stepCircuit(ics, wires, [true, false, true, false, false, false, false, false], state);
  state = step.nextState;
  assert.deepEqual(step.outputs.slice(0, 2), [1, 0]);

  // CLK=1, S=0, R=0 -> Hold 1, 0
  step = stepCircuit(ics, wires, [false, false, true, false, false, false, false, false], state);
  state = step.nextState;
  assert.deepEqual(step.outputs.slice(0, 2), [1, 0]);

  // CLK=0, S=0, R=1 -> Hold 1, 0 (clock disabled must ignore R=1)
  step = stepCircuit(ics, wires, [false, true, false, false, false, false, false, false], state);
  state = step.nextState;
  assert.deepEqual(step.outputs.slice(0, 2), [1, 0]);

  // CLK=1, S=0, R=1 -> Reset (Q=0, Qb=1)
  step = stepCircuit(ics, wires, [false, true, true, false, false, false, false, false], state);
  state = step.nextState;
  assert.deepEqual(step.outputs.slice(0, 2), [0, 1]);

  // CLK=0, S=1, R=0 -> Hold 0, 1 (clock disabled must ignore S=1)
  step = stepCircuit(ics, wires, [true, false, false, false, false, false, false, false], state);
  state = step.nextState;
  assert.deepEqual(step.outputs.slice(0, 2), [0, 1]);

  // CLK=1, S=1, R=1 -> Forbidden (Q=1, Qb=1)
  step = stepCircuit(ics, wires, [true, true, true, false, false, false, false, false], state);
  assert.deepEqual(step.outputs.slice(0, 2), [1, 1]);
});

test('7476 JK Flip-Flop - async PRE\'/CLR\', falling-edge J/K states, and rising-edge hold', () => {
  const exp = LAB_EXPERIMENTS.find((e) => e.id === 'exp-jk-flipflop')!;
  const { ics, wires } = exp.referenceCircuit!;
  // J=D0, K=D1, CLK=D2, PRE'=D3, CLR'=D4; Q=D8, Qb=D9
  let state: CircuitSimState = { icStates: {} };

  // Async Clear (PRE'=1, CLR'=0) -> 0, 1
  let step = stepCircuit(ics, wires, [true, true, true, true, false, false, false, false], state);
  state = step.nextState;
  assert.deepEqual(step.outputs.slice(0, 2), [0, 1]);

  // Rising edge when J=1, K=0 (from CLK=0 -> CLK=1): first bring CLK=0 with J=0, K=0 (Hold 0)
  step = stepCircuit(ics, wires, [false, false, false, true, true, false, false, false], state);
  state = step.nextState;
  assert.deepEqual(step.outputs.slice(0, 2), [0, 1]);

  // Rising edge (CLK 0->1) with J=1, K=0 must NOT set (still 0, 1)
  step = stepCircuit(ics, wires, [true, false, true, true, true, false, false, false], state);
  state = step.nextState;
  assert.deepEqual(step.outputs.slice(0, 2), [0, 1]);

  // Falling edge (CLK 1->0) with J=1, K=0 -> Set (1, 0)
  step = stepCircuit(ics, wires, [true, false, false, true, true, false, false, false], state);
  state = step.nextState;
  assert.deepEqual(step.outputs.slice(0, 2), [1, 0]);

  // Toggle twice across 2 full clock cycles (J=1, K=1)
  step = stepCircuit(ics, wires, [true, true, true, true, true, false, false, false], state);
  state = step.nextState;
  assert.deepEqual(step.outputs.slice(0, 2), [1, 0]); // rising holds 1
  step = stepCircuit(ics, wires, [true, true, false, true, true, false, false, false], state);
  state = step.nextState;
  assert.deepEqual(step.outputs.slice(0, 2), [0, 1]); // falling toggles 1->0

  step = stepCircuit(ics, wires, [true, true, true, true, true, false, false, false], state);
  state = step.nextState;
  assert.deepEqual(step.outputs.slice(0, 2), [0, 1]); // rising holds 0
  step = stepCircuit(ics, wires, [true, true, false, true, true, false, false, false], state);
  state = step.nextState;
  assert.deepEqual(step.outputs.slice(0, 2), [1, 0]); // falling toggles 0->1

  // Reset (J=0, K=1)
  step = stepCircuit(ics, wires, [false, true, true, true, true, false, false, false], state);
  state = step.nextState;
  step = stepCircuit(ics, wires, [false, true, false, true, true, false, false, false], state);
  state = step.nextState;
  assert.deepEqual(step.outputs.slice(0, 2), [0, 1]);

  // Async Preset (PRE'=0, CLR'=1) -> 1, 0
  step = stepCircuit(ics, wires, [false, false, false, false, true, false, false, false], state);
  state = step.nextState;
  assert.deepEqual(step.outputs.slice(0, 2), [1, 0]);

  // Async Invalid (PRE'=0, CLR'=0) -> 1, 1
  step = stepCircuit(ics, wires, [false, false, false, false, false, false, false, false], state);
  assert.deepEqual(step.outputs.slice(0, 2), [1, 1]);
});

test('7474 D Flip-Flop - positive-edge capture, hold without edge, falling-edge hold, async PRE\'/CLR\'', () => {
  const exp = LAB_EXPERIMENTS.find((e) => e.id === 'exp-d-flipflop')!;
  const { ics, wires } = exp.referenceCircuit!;
  // D=D0, CLK=D1, PRE'=D2, CLR'=D3
  let state: CircuitSimState = { icStates: {} };

  // Async Clear -> 0, 1
  let step = stepCircuit(ics, wires, [false, false, true, false, false, false, false, false], state);
  state = step.nextState;
  assert.deepEqual(step.outputs.slice(0, 2), [0, 1]);

  // Release CLR'=1, change D=1 without clock edge (CLK stays 0) -> must hold 0, 1
  step = stepCircuit(ics, wires, [true, false, true, true, false, false, false, false], state);
  state = step.nextState;
  assert.deepEqual(step.outputs.slice(0, 2), [0, 1]);

  // Rising edge CLK 0->1 captures D=1 -> 1, 0
  step = stepCircuit(ics, wires, [true, true, true, true, false, false, false, false], state);
  state = step.nextState;
  assert.deepEqual(step.outputs.slice(0, 2), [1, 0]);

  // Change D=0 while CLK stays 1 -> must hold 1, 0
  step = stepCircuit(ics, wires, [false, true, true, true, false, false, false, false], state);
  state = step.nextState;
  assert.deepEqual(step.outputs.slice(0, 2), [1, 0]);

  // Falling edge CLK 1->0 with D=0 -> must hold 1, 0
  step = stepCircuit(ics, wires, [false, false, true, true, false, false, false, false], state);
  state = step.nextState;
  assert.deepEqual(step.outputs.slice(0, 2), [1, 0]);

  // Rising edge CLK 0->1 captures D=0 -> 0, 1
  step = stepCircuit(ics, wires, [false, true, true, true, false, false, false, false], state);
  state = step.nextState;
  assert.deepEqual(step.outputs.slice(0, 2), [0, 1]);

  // Async Preset -> 1, 0
  step = stepCircuit(ics, wires, [false, false, false, true, false, false, false, false], state);
  assert.deepEqual(step.outputs.slice(0, 2), [1, 0]);
});

test('T Flip-Flop using 7476 - T=0 hold, T=1 divide-by-2 frequency division across 4 clock cycles', () => {
  const exp = LAB_EXPERIMENTS.find((e) => e.id === 'exp-t-flipflop')!;
  const { ics, wires } = exp.referenceCircuit!;
  // T=D0, CLK=D1, CLR'=D2
  let state: CircuitSimState = { icStates: {} };

  // Reset
  let step = stepCircuit(ics, wires, [false, true, false, false, false, false, false, false], state);
  state = step.nextState;
  assert.equal(step.outputs[0], 0);

  // T=0 across 2 full clock pulses -> always stays 0
  for (let i = 0; i < 2; i++) {
    step = stepCircuit(ics, wires, [false, false, true, false, false, false, false, false], state);
    state = step.nextState;
    assert.equal(step.outputs[0], 0);
    step = stepCircuit(ics, wires, [false, true, true, false, false, false, false, false], state);
    state = step.nextState;
    assert.equal(step.outputs[0], 0);
  }

  // T=1 across 4 full clock pulses -> Q waveform [1, 0, 1, 0] (frequency = f_clk / 2)
  const observedAfterFalling: number[] = [];
  for (let i = 0; i < 4; i++) {
    step = stepCircuit(ics, wires, [true, false, true, false, false, false, false, false], state);
    state = step.nextState;
    observedAfterFalling.push(step.outputs[0]);
    step = stepCircuit(ics, wires, [true, true, true, false, false, false, false, false], state);
    state = step.nextState;
    assert.equal(step.outputs[0], observedAfterFalling[i], 'Q must not toggle on rising edge');
  }
  assert.deepEqual(observedAfterFalling, [1, 0, 1, 0]);
});

test('3-Bit Ring Counter - exact sequence 100 -> 010 -> 001 -> 100 repeating over 2 full cycles', () => {
  const exp = LAB_EXPERIMENTS.find((e) => e.id === 'exp-ring-counter')!;
  const { ics, wires } = exp.referenceCircuit!;
  // CLK=D0, ORI'=D1; Q2=D8, Q1=D9, Q0=D10
  let state: CircuitSimState = { icStates: {} };

  // Init ORI'=0, CLK=0 -> 100
  let step = stepCircuit(ics, wires, [false, false, false, false, false, false, false, false], state);
  state = step.nextState;
  assert.deepEqual(step.outputs.slice(0, 3), [1, 0, 0]);

  // Release ORI'=1 without rising edge -> holds 100
  step = stepCircuit(ics, wires, [false, true, false, false, false, false, false, false], state);
  state = step.nextState;
  assert.deepEqual(step.outputs.slice(0, 3), [1, 0, 0]);

  const expectedSeq = [
    [0, 1, 0],
    [0, 0, 1],
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
    [1, 0, 0],
  ];

  for (const expBits of expectedSeq) {
    // Rising edge shifts
    step = stepCircuit(ics, wires, [true, true, false, false, false, false, false, false], state);
    state = step.nextState;
    assert.deepEqual(step.outputs.slice(0, 3), expBits);

    // Falling edge holds
    step = stepCircuit(ics, wires, [false, true, false, false, false, false, false, false], state);
    state = step.nextState;
    assert.deepEqual(step.outputs.slice(0, 3), expBits);
  }
});

test('3-Bit Johnson Counter - exact sequence 000 -> 100 -> 110 -> 111 -> 011 -> 001 -> 000 repeating', () => {
  const exp = LAB_EXPERIMENTS.find((e) => e.id === 'exp-johnson-counter')!;
  const { ics, wires } = exp.referenceCircuit!;
  // CLK=D0, ORI'=D1; Q2=D8, Q1=D9, Q0=D10
  let state: CircuitSimState = { icStates: {} };

  // Init ORI'=0, CLK=0 -> 000
  let step = stepCircuit(ics, wires, [false, false, false, false, false, false, false, false], state);
  state = step.nextState;
  assert.deepEqual(step.outputs.slice(0, 3), [0, 0, 0]);

  // Release ORI'=1 without rising edge -> holds 000
  step = stepCircuit(ics, wires, [false, true, false, false, false, false, false, false], state);
  state = step.nextState;
  assert.deepEqual(step.outputs.slice(0, 3), [0, 0, 0]);

  const expectedSeq = [
    [1, 0, 0],
    [1, 1, 0],
    [1, 1, 1],
    [0, 1, 1],
    [0, 0, 1],
    [0, 0, 0],
    [1, 0, 0],
    [1, 1, 0],
  ];

  for (const expBits of expectedSeq) {
    step = stepCircuit(ics, wires, [true, true, false, false, false, false, false, false], state);
    state = step.nextState;
    assert.deepEqual(step.outputs.slice(0, 3), expBits);

    step = stepCircuit(ics, wires, [false, true, false, false, false, false, false, false], state);
    state = step.nextState;
    assert.deepEqual(step.outputs.slice(0, 3), expBits);
  }
});

test('74LS90 Decade Counter - BCD 0000..1001->0000 repeating + R9 set-to-9 + Mod-6 reset configuration', () => {
  const exp = LAB_EXPERIMENTS.find((e) => e.id === 'exp-decade-counter')!;
  const { ics, wires } = exp.referenceCircuit!;
  // CLK=D0, MR=D1; QA=D8, QB=D9, QC=D10, QD=D11
  let state: CircuitSimState = { icStates: {} };

  // Reset MR=1, CLK=1 -> 0000
  let step = stepCircuit(ics, wires, [true, true, false, false, false, false, false, false], state);
  state = step.nextState;
  assert.deepEqual(step.outputs.slice(0, 4), [0, 0, 0, 0]);

  // Release MR=0 -> 0000
  step = stepCircuit(ics, wires, [true, false, false, false, false, false, false, false], state);
  state = step.nextState;

  // Run 20 falling clock pulses (two full BCD decades 0..9 -> 0)
  for (let pulse = 1; pulse <= 20; pulse++) {
    // Falling edge
    step = stepCircuit(ics, wires, [false, false, false, false, false, false, false, false], state);
    state = step.nextState;
    const count = pulse % 10;
    const qa = count & 1;
    const qb = (count >> 1) & 1;
    const qc = (count >> 2) & 1;
    const qd = (count >> 3) & 1;
    assert.deepEqual(
      step.outputs.slice(0, 4),
      [qa, qb, qc, qd],
      `74LS90 mismatch at pulse ${pulse} (expected decimal ${count})`
    );

    // Rising edge must hold
    step = stepCircuit(ics, wires, [true, false, false, false, false, false, false, false], state);
    state = step.nextState;
    assert.deepEqual(step.outputs.slice(0, 4), [qa, qb, qc, qd], `74LS90 must hold on rising edge at pulse ${pulse}`);
  }

  // Test Async Set-to-9 (R9(1)=pin6, R9(2)=pin7 HIGH) + Mod-6 Reset (QB, QC -> R0(1), R0(2))
  const icMod6: PlacedIC = { instanceId: 'ic-7490-m6', icDefId: '7490', startCol: 10, rotation: 0 };
  const wiresMod6: Wire[] = [
    { id: 'w1', fromHoleId: 'vcc-src', toHoleId: 'top-power-plus-1', color: 'red' },
    { id: 'w2', fromHoleId: 'gnd-src', toHoleId: 'top-power-minus-1', color: 'black' },
    { id: 'wv', fromHoleId: 'top-power-plus-14', toHoleId: 'bb-J-14', color: 'red' },
    { id: 'wg', fromHoleId: 'top-power-minus-14', toHoleId: 'bb-A-14', color: 'black' },
    { id: 'wcka', fromHoleId: 'd0', toHoleId: 'bb-A-10', color: 'orange' },
    { id: 'wrip', fromHoleId: 'bb-A-12', toHoleId: 'bb-J-10', color: 'yellow' },
    // Mod-6 feedback: QB(pin9 col15 top) -> R0(1)(pin2 col11 bot); QC(pin8 col16 top) -> R0(2)(pin3 col12 bot)
    { id: 'wqb-r01', fromHoleId: 'bb-B-15', toHoleId: 'bb-J-11', color: 'purple' },
    { id: 'wqc-r02', fromHoleId: 'bb-B-16', toHoleId: 'bb-J-12', color: 'purple' },
    // R9(1), R9(2) controlled via D1 to test Set-to-9 too
    { id: 'wr91', fromHoleId: 'd1', toHoleId: 'bb-J-15', color: 'blue' },
    { id: 'wr92', fromHoleId: 'bb-I-15', toHoleId: 'bb-J-16', color: 'blue' },
    { id: 'wqa', fromHoleId: 'bb-B-12', toHoleId: 'd8', color: 'green' },
    { id: 'wqb', fromHoleId: 'bb-A-15', toHoleId: 'd9', color: 'green' },
    { id: 'wqc', fromHoleId: 'bb-A-16', toHoleId: 'd10', color: 'green' },
    { id: 'wqd', fromHoleId: 'bb-A-13', toHoleId: 'd11', color: 'green' },
  ];

  // Set-to-9 with D1=1 -> 1001 (QA=1, QB=0, QC=0, QD=1)
  let m6State: CircuitSimState = { icStates: {} };
  let m6Step = stepCircuit([icMod6], wiresMod6, [true, true, false, false, false, false, false, false], m6State);
  m6State = m6Step.nextState;
  assert.deepEqual(m6Step.outputs.slice(0, 4), [1, 0, 0, 1], 'R9 active must set 74LS90 to 1001');

  // Clear by stepping once from 9 -> 10 triggers wrap to 0000, then verify Mod-6 0..5 -> 0
  m6Step = stepCircuit([icMod6], wiresMod6, [false, false, false, false, false, false, false, false], m6State);
  m6State = m6Step.nextState;
  assert.deepEqual(m6Step.outputs.slice(0, 4), [0, 0, 0, 0]);

  const mod6Counts: number[] = [];
  for (let p = 1; p <= 8; p++) {
    m6Step = stepCircuit([icMod6], wiresMod6, [true, false, false, false, false, false, false, false], m6State);
    m6State = m6Step.nextState;
    m6Step = stepCircuit([icMod6], wiresMod6, [false, false, false, false, false, false, false, false], m6State);
    m6State = m6Step.nextState;
    const [qa, qb, qc, qd] = m6Step.outputs;
    mod6Counts.push((qd << 3) | (qc << 2) | (qb << 1) | qa);
  }
  assert.deepEqual(mod6Counts, [1, 2, 3, 4, 5, 0, 1, 2], '74LS90 Mod-6 wiring must reset on 6');
});

// =====================================================================
// 3. SINGLE SOURCE OF TRUTH: ALL 19 LAB_EXPERIMENTS REFERENCE CIRCUITS
// =====================================================================

test('All 19 LAB_EXPERIMENTS referenceCircuits pass both evaluateExperiment and runConnectionCheck', () => {
  assert.equal(LAB_EXPERIMENTS.length, 19, 'Expected 19 total experiments (01-07 foundational + 08-19 practical)');

  for (const exp of LAB_EXPERIMENTS) {
    assert.ok(exp.referenceCircuit, `Experiment ${exp.id} must define a referenceCircuit`);
    const { ics, wires } = exp.referenceCircuit!;

    const evalRes = evaluateExperiment(exp, ics, wires);
    assert.equal(
      evalRes.passed,
      true,
      `evaluateExperiment failed for ${exp.id} (${exp.title}): ${JSON.stringify(
        evalRes.results.filter((r) => !r.passed)
      )}`
    );

    const checkRes = runConnectionCheck(
      ics,
      wires,
      { inputStates: Array(8).fill(false), powerOn: true },
      exp.id
    );
    assert.equal(
      checkRes.passed,
      true,
      `runConnectionCheck failed for ${exp.id} (${exp.title}): ${JSON.stringify(
        checkRes.checks.filter((c) => !c.passed)
      )}`
    );
    assert.equal(checkRes.score, 100, `Expected 100% score for ${exp.id}`);
  }
});

// =====================================================================
// 4. NEGATIVE TESTS: UNWIRED / BROKEN / UNPOWERED CIRCUITS MUST FAIL
// =====================================================================

test('Negative tests: empty circuit, unpowered IC, and swapped Half Adder outputs fail verification', () => {
  for (const exp of LAB_EXPERIMENTS) {
    const emptyEval = evaluateExperiment(exp, [], []);
    assert.equal(emptyEval.passed, false, `Empty circuit must NOT pass ${exp.id}`);
    for (const r of emptyEval.results) {
      for (const v of Object.values(r.actual)) {
        assert.equal(v, 'FLOATING', `Unwired outputs must read FLOATING (never 0) in ${exp.id}`);
      }
    }
  }

  // Unpowered IC test on 74138 Decoder
  const decExp = LAB_EXPERIMENTS.find((e) => e.id === 'exp-decoder')!;
  const noVccWires = decExp.referenceCircuit!.wires.filter((w) => w.id !== 'w1');
  const unpoweredEval = evaluateExperiment(decExp, decExp.referenceCircuit!.ics, noVccWires);
  assert.equal(unpoweredEval.passed, false, 'Unpowered 74138 must fail evaluateExperiment');

  // Swapped D8/D9 on Half Adder
  const haExp = LAB_EXPERIMENTS.find((e) => e.id === 'exp-half-adder')!;
  const swappedWires = haExp.referenceCircuit!.wires.map((w) => {
    if (w.toHoleId === 'd8') return { ...w, toHoleId: 'd9' };
    if (w.toHoleId === 'd9') return { ...w, toHoleId: 'd8' };
    return w;
  });
  const haEval = evaluateExperiment(haExp, haExp.referenceCircuit!.ics, swappedWires);
  assert.equal(haEval.passed, false, 'Swapped Half Adder outputs must fail evaluateExperiment');
  const haCheck = runConnectionCheck(
    haExp.referenceCircuit!.ics,
    swappedWires,
    { inputStates: Array(8).fill(false), powerOn: true },
    haExp.id
  );
  assert.equal(haCheck.passed, false, 'Swapped Half Adder outputs must fail runConnectionCheck');
});

// =====================================================================
// 5. PRACTICAL EXAMINATION: STRICT 12 EXPERIMENTS, VARIANTS & DIAGNOSTICS
// =====================================================================

test('PRACTICAL EXAMINATION contains strictly the 12 prescribed SRM AP experiments in exact order', () => {
  const examExperiments = getPracticalExamExperiments();
  assert.equal(examExperiments.length, 12, 'Practical Examination must contain strictly 12 experiments');

  const expectedOrder = [
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
  ];
  assert.deepEqual(
    examExperiments.map((e) => e.id),
    expectedOrder
  );
  assert.deepEqual([...PRACTICAL_EXAM_IDS], expectedOrder);

  for (const exp of examExperiments) {
    const sup = PRACTICAL_EXAM_SUPPLEMENTS[exp.id];
    assert.ok(sup, `Missing PRACTICAL_EXAM_SUPPLEMENTS for ${exp.id}`);
    assert.ok(sup.apparatus.length >= 3, `Apparatus missing for ${exp.id}`);
    assert.ok(sup.connectionInstructions.length >= 3, `Connection instructions missing for ${exp.id}`);
    assert.ok(sup.resultStatement.length > 20, `Result statement missing for ${exp.id}`);
    assert.ok(sup.vivaQuestions.length >= 4, `Viva questions missing for ${exp.id}`);
    assert.ok(exp.procedure.length >= 4, `Procedure steps missing for ${exp.id}`);

    // Verify every Practical Exam referenceCircuit passes 100%
    const evalRes = evaluateExperiment(exp, exp.referenceCircuit.ics, exp.referenceCircuit.wires);
    assert.equal(evalRes.passed, true, `Practical Exam ${exp.id} failed evaluateExperiment`);
    const chk = runConnectionCheck(
      exp.referenceCircuit.ics,
      exp.referenceCircuit.wires,
      { inputStates: Array(8).fill(false), powerOn: true },
      exp.id
    );
    assert.equal(chk.passed, true, `Practical Exam ${exp.id} failed runConnectionCheck`);
    assert.equal(chk.score, 100, `Practical Exam ${exp.id} expected score 100`);
  }
});

test('Magnitude Comparator supports all 3 variants: 4-bit (7485), 4-bit cascade (7485), and 1-bit (7486+7404+7408)', () => {
  const cmpExp = LAB_EXPERIMENTS.find((e) => e.id === 'exp-comparator')!;
  assert.ok(cmpExp.variants && cmpExp.variants.length === 3);

  for (const variant of cmpExp.variants!) {
    const resolved = resolveExperimentVariant(cmpExp, variant.id);
    assert.equal(resolved.variant?.id, variant.id);

    const evalRes = evaluateExperiment(
      cmpExp,
      variant.referenceCircuit.ics,
      variant.referenceCircuit.wires,
      undefined,
      variant.id
    );
    assert.equal(
      evalRes.passed,
      true,
      `Comparator variant "${variant.id}" failed evaluateExperiment: ${JSON.stringify(
        evalRes.results.filter((r) => !r.passed)
      )}`
    );

    const checkRes = runConnectionCheck(
      variant.referenceCircuit.ics,
      variant.referenceCircuit.wires,
      { inputStates: Array(8).fill(false), powerOn: true },
      cmpExp.id,
      variant.id
    );
    assert.equal(
      checkRes.passed,
      true,
      `Comparator variant "${variant.id}" failed runConnectionCheck: ${JSON.stringify(
        checkRes.checks.filter((c) => !c.passed)
      )}`
    );
    assert.equal(checkRes.score, 100);
  }
});

test('ConnectionChecker detects missing enables, bad clock connections, missing PRE\'/CLR\', and missing second IC', () => {
  const io = { inputStates: Array(8).fill(false), powerOn: true };

  // 1) Missing Enable signal on 74138 (remove G2A' wire w-g2a)
  const decExp = LAB_EXPERIMENTS.find((e) => e.id === 'exp-decoder')!;
  const decNoEnWires = decExp.referenceCircuit.wires.filter((w) => w.id !== 'w-g2a');
  const decChk = runConnectionCheck(decExp.referenceCircuit.ics, decNoEnWires, io, decExp.id);
  assert.equal(decChk.passed, false);
  assert.ok(
    decChk.checks.some((c) => c.id === 'check-missing-enables' && !c.passed),
    'Must flag missing enable G2A\' on 74138'
  );

  // 2) Missing Clock on 7474 D Flip-Flop & Clock shorted to GND
  const dExp = LAB_EXPERIMENTS.find((e) => e.id === 'exp-d-flipflop')!;
  const dNoClkWires = dExp.referenceCircuit.wires.filter((w) => w.id !== 'w-clk');
  const dNoClkChk = runConnectionCheck(dExp.referenceCircuit.ics, dNoClkWires, io, dExp.id);
  assert.ok(
    dNoClkChk.checks.some((c) => c.id === 'check-clock-connections' && !c.passed),
    'Must flag floating clock on 7474'
  );

  const dGndClkWires = dExp.referenceCircuit.wires.map((w) =>
    w.id === 'w-clk' ? { ...w, fromHoleId: 'top-power-minus-12' } : w
  );
  const dGndClkChk = runConnectionCheck(dExp.referenceCircuit.ics, dGndClkWires, io, dExp.id);
  assert.ok(
    dGndClkChk.checks.some((c) => c.id === 'check-clock-connections' && !c.passed),
    'Must flag clock shorted directly to GND on 7474'
  );

  // 3) Floating Preset/Clear on 7476 JK Flip-Flop & shorted PRE'+CLR' to GND
  const jkExp = LAB_EXPERIMENTS.find((e) => e.id === 'exp-jk-flipflop')!;
  const jkNoPreWires = jkExp.referenceCircuit.wires.filter((w) => w.id !== 'w-pre');
  const jkNoPreChk = runConnectionCheck(jkExp.referenceCircuit.ics, jkNoPreWires, io, jkExp.id);
  assert.ok(
    jkNoPreChk.checks.some((c) => c.id === 'check-async-controls' && !c.passed),
    'Must flag floating PRE\' on 7476'
  );

  // 4) Missing second 7474 on 3-bit Ring Counter
  const rcExp = LAB_EXPERIMENTS.find((e) => e.id === 'exp-ring-counter')!;
  const rcOneICChk = runConnectionCheck([rcExp.referenceCircuit.ics[0]], rcExp.referenceCircuit.wires, io, rcExp.id);
  assert.equal(rcOneICChk.passed, false);
  assert.ok(
    rcOneICChk.checks.some((c) => c.id === 'check-experiment-topology' && !c.passed && c.details?.includes('1/2')),
    'Must flag missing second 7474 (1/2) on Ring Counter'
  );
});

