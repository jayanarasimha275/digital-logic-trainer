import { GuidedStep, PlacedIC, Wire } from '../types/circuit';
import { LAB_EXPERIMENTS } from '../data/experiments';
import { IC_DEFINITIONS } from '../data/icDefinitions';
import { getPinPluggedHoleId } from './engine';

export function getGuidedStepsForExperiment(
  expId: string | null,
  placedICs: PlacedIC[],
  wires: Wire[]
): GuidedStep[] {
  const exp = expId ? LAB_EXPERIMENTS.find((e) => e.id === expId) : null;
  if (!exp) {
    return [
      {
        stepNumber: 1,
        title: 'Select an Experiment',
        description: 'Choose an experiment from the top navigation bar to begin guided laboratory mode.',
        actionType: 'place_ic',
        isComplete: false,
      },
    ];
  }

  const steps: GuidedStep[] = [];

  // Helper to check if two holes are wired
  const areHolesWired = (h1: string, h2: string): boolean => {
    return wires.some(
      (w) =>
        (w.fromHoleId === h1 && w.toHoleId === h2) ||
        (w.fromHoleId === h2 && w.toHoleId === h1)
    );
  };

  if (exp.id === 'exp-half-adder') {
    // Half Adder Guided Steps
    const has7486 = placedICs.some((ic) => ic.icDefId.includes('7486'));
    const has7408 = placedICs.some((ic) => ic.icDefId.includes('7408'));
    const xorIc = placedICs.find((ic) => ic.icDefId.includes('7486'));
    const andIc = placedICs.find((ic) => ic.icDefId.includes('7408'));

    // Step 1: Place 7486 XOR IC
    steps.push({
      stepNumber: 1,
      title: 'Place 7486 (Quad XOR) IC',
      description: 'Click "Place" on 7486 in the left IC toolbox. Position it across the center trough at Column 5.',
      actionType: 'place_ic',
      icDefId: '7486',
      targetCol: 5,
      isComplete: has7486,
    });

    // Step 2: Place 7408 AND IC
    steps.push({
      stepNumber: 2,
      title: 'Place 7408 (Quad AND) IC',
      description: 'Click "Place" on 7408 in the left IC toolbox. Position it across the center trough at Column 15.',
      actionType: 'place_ic',
      icDefId: '7408',
      targetCol: 15,
      isComplete: has7408,
    });

    // Step 3: Connect Power Supplies
    const hasVccRail = wires.some((w) => w.fromHoleId === 'vcc-src' || w.toHoleId === 'vcc-src');
    const hasGndRail = wires.some((w) => w.fromHoleId === 'gnd-src' || w.toHoleId === 'gnd-src');
    const powerRailsComplete = hasVccRail && hasGndRail;

    steps.push({
      stepNumber: 3,
      title: 'Energize Breadboard Power Rails',
      description: 'Connect red wire from +5V terminal to Top (+) Rail, and black wire from GND to Top (-) Rail.',
      actionType: 'wire',
      highlightHoles: ['vcc-src', 'top-power-plus-1', 'gnd-src', 'top-power-minus-1'],
      isComplete: powerRailsComplete,
    });

    // Step 4: Power IC Pins (VCC to Pin 14, GND to Pin 7)
    let icPowerComplete = false;
    if (xorIc && andIc) {
      const xorVccHole = getPinPluggedHoleId(xorIc, 14);
      const xorGndHole = getPinPluggedHoleId(xorIc, 7);
      const andVccHole = getPinPluggedHoleId(andIc, 14);
      const andGndHole = getPinPluggedHoleId(andIc, 7);

      const xorVccWired = wires.some((w) => (w.fromHoleId === xorVccHole || w.toHoleId === xorVccHole) && (w.fromHoleId.includes('plus') || w.toHoleId.includes('plus') || w.fromHoleId === 'vcc-src' || w.toHoleId === 'vcc-src'));
      const andVccWired = wires.some((w) => (w.fromHoleId === andVccHole || w.toHoleId === andVccHole) && (w.fromHoleId.includes('plus') || w.toHoleId.includes('plus') || w.fromHoleId === 'vcc-src' || w.toHoleId === 'vcc-src'));
      const xorGndWired = wires.some((w) => (w.fromHoleId === xorGndHole || w.toHoleId === xorGndHole) && (w.fromHoleId.includes('minus') || w.toHoleId.includes('minus') || w.fromHoleId === 'gnd-src' || w.toHoleId === 'gnd-src'));
      const andGndWired = wires.some((w) => (w.fromHoleId === andGndHole || w.toHoleId === andGndHole) && (w.fromHoleId.includes('minus') || w.toHoleId.includes('minus') || w.fromHoleId === 'gnd-src' || w.toHoleId === 'gnd-src'));

      icPowerComplete = xorVccWired && andVccWired && xorGndWired && andGndWired;

      steps.push({
        stepNumber: 4,
        title: 'Power IC Pins (VCC & GND)',
        description: 'Connect Pin 14 of both chips to (+) Rail, and Pin 7 of both chips to (-) Rail.',
        actionType: 'wire',
        highlightHoles: [xorVccHole, xorGndHole, andVccHole, andGndHole],
        isComplete: icPowerComplete,
      });
    }

    // Step 5: Route Input Signals (A -> D0, B -> D1)
    if (xorIc && andIc) {
      const xorPin1 = getPinPluggedHoleId(xorIc, 1);
      const xorPin2 = getPinPluggedHoleId(xorIc, 2);
      const andPin1 = getPinPluggedHoleId(andIc, 1);
      const andPin2 = getPinPluggedHoleId(andIc, 2);

      const d0Wired = wires.some((w) => w.fromHoleId === 'd0' || w.toHoleId === 'd0');
      const d1Wired = wires.some((w) => w.fromHoleId === 'd1' || w.toHoleId === 'd1');
      const inputsWired = d0Wired && d1Wired;

      steps.push({
        stepNumber: 5,
        title: 'Connect Inputs A (D0) & B (D1)',
        description: 'Connect D0 to 7486 Pin 1 and 7408 Pin 1. Connect D1 to 7486 Pin 2 and 7408 Pin 2.',
        actionType: 'wire',
        highlightHoles: ['d0', xorPin1, andPin1, 'd1', xorPin2, andPin2],
        isComplete: inputsWired,
      });

      // Step 6: Route Output Signals (SUM -> D8, CARRY -> D9)
      const xorPin3 = getPinPluggedHoleId(xorIc, 3);
      const andPin3 = getPinPluggedHoleId(andIc, 3);
      const d8Wired = wires.some((w) => (w.fromHoleId === 'd8' || w.toHoleId === 'd8') && (w.fromHoleId === xorPin3 || w.toHoleId === xorPin3 || w.fromHoleId.includes('bb-') || w.toHoleId.includes('bb-')));
      const d9Wired = wires.some((w) => (w.fromHoleId === 'd9' || w.toHoleId === 'd9') && (w.fromHoleId === andPin3 || w.toHoleId === andPin3 || w.fromHoleId.includes('bb-') || w.toHoleId.includes('bb-')));

      steps.push({
        stepNumber: 6,
        title: 'Connect Outputs (SUM -> D8, CARRY -> D9)',
        description: 'Connect 7486 Pin 3 (SUM) to D8 LED terminal. Connect 7408 Pin 3 (CARRY) to D9 LED terminal.',
        actionType: 'wire',
        highlightHoles: [xorPin3, 'd8', andPin3, 'd9'],
        isComplete: d8Wired && d9Wired,
      });

      // Step 7: Verify Truth Table
      steps.push({
        stepNumber: 7,
        title: 'Verify Half Adder Truth Table',
        description: 'Toggle switches D0 & D1 to test all combinations (00, 01, 10, 11). Click [VERIFY] in the top toolbar.',
        actionType: 'test',
        isComplete: false,
      });
    }
  } else {
    // Generic Guided Steps for other experiments
    const firstIcDef = exp.suggestedICs[0];
    const hasFirstIc = placedICs.some((ic) => ic.icDefId.includes(firstIcDef));
    const targetIc = placedICs.find((ic) => ic.icDefId.includes(firstIcDef));

    steps.push({
      stepNumber: 1,
      title: `Place ${firstIcDef} on Breadboard`,
      description: `Locate ${firstIcDef} in the left toolbox and place it on the breadboard across the center trough.`,
      actionType: 'place_ic',
      icDefId: firstIcDef,
      isComplete: hasFirstIc,
    });

    const hasPower = wires.some((w) => w.fromHoleId === 'vcc-src' || w.toHoleId === 'vcc-src');
    const hasGnd = wires.some((w) => w.fromHoleId === 'gnd-src' || w.toHoleId === 'gnd-src');
    steps.push({
      stepNumber: 2,
      title: 'Connect Power & Ground Rails',
      description: 'Route a red wire from +5V to the Top (+) rail, and a black wire from GND to the Top (-) rail.',
      actionType: 'wire',
      highlightHoles: ['vcc-src', 'top-power-plus-1', 'gnd-src', 'top-power-minus-1'],
      isComplete: hasPower && hasGnd,
    });

    if (targetIc) {
      const def = IC_DEFINITIONS[targetIc.icDefId];
      const vccHole = def ? getPinPluggedHoleId(targetIc, def.vccPin) : '';
      const gndHole = def ? getPinPluggedHoleId(targetIc, def.gndPin) : '';

      steps.push({
        stepNumber: 3,
        title: `Power IC Pins (${def?.vccPin || 14} & ${def?.gndPin || 7})`,
        description: `Connect Pin ${def?.vccPin || 14} to +5V and Pin ${def?.gndPin || 7} to GND.`,
        actionType: 'wire',
        highlightHoles: [vccHole, gndHole].filter(Boolean),
        isComplete: false,
      });
    }

    steps.push({
      stepNumber: 4,
      title: 'Wire Signal Terminals',
      description: `Connect inputs (${Object.values(exp.pinMapping.inputNames).join(', ')}) and outputs (${Object.values(exp.pinMapping.outputNames).join(', ')}).`,
      actionType: 'wire',
      isComplete: false,
    });
  }

  return steps;
}
