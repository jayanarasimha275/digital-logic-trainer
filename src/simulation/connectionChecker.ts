import { ConnectionCheckResult, PlacedIC, Wire, DigitalIOSettings } from '../types/circuit';
import { IC_DEFINITIONS } from '../data/icDefinitions';
import { LAB_EXPERIMENTS } from '../data/experiments';
import { simulateCircuit, getPinPluggedHoleId } from './engine';
import { evaluateExperiment, resolveExperimentVariant } from './experimentEvaluator';

interface PinSectionSpec {
  inputs: number[];
  outputs: number[];
  enables?: number[];
  clocks?: number[];
  asyncControls?: number[];
}

function getICSectionsForCheck(icDefId: string): PinSectionSpec[] | null {
  switch (icDefId) {
    case '74138':
      return [{ inputs: [1, 2, 3, 4, 5, 6], enables: [4, 5, 6], outputs: [7, 9, 10, 11, 12, 13, 14, 15] }];
    case '74148':
      return [{ inputs: [1, 2, 3, 4, 5, 10, 11, 12, 13], enables: [5], outputs: [6, 7, 9, 14, 15] }];
    case '7485':
      return [{ inputs: [1, 2, 3, 4, 9, 10, 11, 12, 13, 14, 15], outputs: [5, 6, 7] }];
    case '74153':
      return [
        { inputs: [1, 2, 3, 4, 5, 6, 14], enables: [1], outputs: [7] },
        { inputs: [2, 10, 11, 12, 13, 14, 15], enables: [15], outputs: [9] },
      ];
    case '74139':
      return [
        { inputs: [1, 2, 3], enables: [1], outputs: [4, 5, 6, 7] },
        { inputs: [13, 14, 15], enables: [15], outputs: [9, 10, 11, 12] },
      ];
    case '7474':
      return [
        { inputs: [1, 2, 3, 4], clocks: [3], asyncControls: [1, 4], outputs: [5, 6] },
        { inputs: [10, 11, 12, 13], clocks: [11], asyncControls: [10, 13], outputs: [8, 9] },
      ];
    case '7476':
      return [
        { inputs: [1, 2, 3, 4, 16], clocks: [1], asyncControls: [2, 3], outputs: [14, 15] },
        { inputs: [6, 7, 8, 9, 12], clocks: [6], asyncControls: [7, 8], outputs: [10, 11] },
      ];
    case '7490':
      return [
        { inputs: [14, 2, 3, 6, 7], clocks: [14], asyncControls: [2, 3, 6, 7], outputs: [12] },
        { inputs: [1, 2, 3, 6, 7], clocks: [1], asyncControls: [2, 3, 6, 7], outputs: [8, 9, 11] },
      ];
    default:
      return null;
  }
}

export function runConnectionCheck(
  placedICs: PlacedIC[],
  wires: Wire[],
  ioSettings: DigitalIOSettings,
  selectedExpId: string | null,
  variantId?: string | null
): ConnectionCheckResult {
  const sim = simulateCircuit(placedICs, wires, ioSettings);
  const connectedNets = sim.connectedNets;
  const exp = selectedExpId ? LAB_EXPERIMENTS.find((e) => e.id === selectedExpId) : null;
  const resolved = exp ? resolveExperimentVariant(exp, variantId) : null;

  const checks: ConnectionCheckResult['checks'] = [];

  // Map every IC output pin nodeId for signal-driver detection across cascaded stages
  const allOutputPinNodes = new Set<string>();
  for (const ic of placedICs) {
    const def = IC_DEFINITIONS[ic.icDefId];
    if (!def) continue;
    for (const p of def.pins) {
      if (p.type === 'OUTPUT') {
        allOutputPinNodes.add(`ic-${ic.instanceId}-pin-${p.number}`);
      }
    }
  }

  // Helper: check if two nodes are connected
  const areConnected = (nodeA: string, nodeB: string): boolean => {
    const net = connectedNets[nodeA];
    if (!net) return false;
    return net.includes(nodeB);
  };

  // Helper: find all nodes connected to a given node
  const getNet = (nodeId: string): string[] => {
    return connectedNets[nodeId] || [nodeId];
  };

  // Helper: check if a node connects to any node matching predicate
  const netHas = (nodeId: string, predicate: (n: string) => boolean): boolean => {
    const net = getNet(nodeId);
    return net.some(predicate);
  };

  const netHasDriver = (net: string[]): boolean => {
    return net.some(
      (n) =>
        /^d\d+$/.test(n) ||
        n === 'vcc-src' ||
        n === 'gnd-src' ||
        n.includes('power-') ||
        n.startsWith('dio-') ||
        allOutputPinNodes.has(n)
    );
  };

  // 1. Check: VCC Power Connected
  const vccConnected = netHas('vcc-src', (n) =>
    n.startsWith('top-power-plus-') || n.startsWith('bot-power-plus-') || n.startsWith('bb-') || n.startsWith('ic-')
  );
  checks.push({
    id: 'check-vcc',
    label: 'VCC (+5V) Supply Connected',
    passed: vccConnected,
    details: vccConnected
      ? '+5V DC source is routed to circuit power rails.'
      : '+5V source terminal is not connected. Connect jumper wire from +5V to the (+) rail.',
    severity: vccConnected ? undefined : 'error',
    suggestedFix: 'Connect a red jumper wire from the left +5V terminal to the top (+) rail.',
    highlightNodes: ['vcc-src', 'top-power-plus-1'],
  });

  // 2. Check: Ground Connected
  const gndConnected = netHas('gnd-src', (n) =>
    n.startsWith('top-power-minus-') || n.startsWith('bot-power-minus-') || n.startsWith('bb-') || n.startsWith('ic-')
  );
  checks.push({
    id: 'check-gnd',
    label: 'Ground (0V) Reference Connected',
    passed: gndConnected,
    details: gndConnected
      ? '0V Ground reference is connected.'
      : 'GND reference terminal is not connected. Connect jumper wire from GND to the (-) rail.',
    severity: gndConnected ? undefined : 'error',
    suggestedFix: 'Connect a black jumper wire from the left GND terminal to the top (-) rail.',
    highlightNodes: ['gnd-src', 'top-power-minus-1'],
  });

  // 3. Check: Short Circuit (VCC to GND)
  const isShortCircuit = areConnected('vcc-src', 'gnd-src');
  checks.push({
    id: 'check-short',
    label: 'No VCC-to-GND Short Circuit',
    passed: !isShortCircuit,
    details: isShortCircuit
      ? 'CRITICAL FAULT: +5V is directly bridged to 0V GND! Remove the shorting wire.'
      : 'Power rails are isolated (no ground short detected).',
    severity: isShortCircuit ? 'error' : undefined,
    suggestedFix: isShortCircuit ? 'Remove the jumper wire creating a direct loop between (+) and (-).' : undefined,
    highlightNodes: isShortCircuit ? ['vcc-src', 'gnd-src'] : undefined,
  });

  // 4. Check: Every Placed IC is Powered
  if (placedICs.length === 0) {
    const expectedList = resolved?.suggestedICs ?? exp?.suggestedICs;
    checks.push({
      id: 'check-ic-present',
      label: 'Components on Breadboard',
      passed: false,
      details: exp && expectedList ? `Place required ICs (e.g. ${expectedList.join(', ')}) onto the breadboard.` : 'No ICs placed on breadboard.',
      severity: 'warning',
      suggestedFix: exp && expectedList ? `Select ${expectedList[0]} from the left IC toolbox and click Place.` : 'Place an IC from the left toolbox.',
    });
  } else {
    for (const ic of placedICs) {
      const def = IC_DEFINITIONS[ic.icDefId];
      if (!def) continue;

      const pStatus = sim.icPowerStatus[ic.instanceId];
      const vccHole = getPinPluggedHoleId(ic, def.vccPin);
      const gndHole = getPinPluggedHoleId(ic, def.gndPin);

      const vccOk = pStatus?.vccOk ?? areConnected(`ic-${ic.instanceId}-pin-${def.vccPin}`, 'vcc-src');
      const gndOk = pStatus?.gndOk ?? areConnected(`ic-${ic.instanceId}-pin-${def.gndPin}`, 'gnd-src');

      checks.push({
        id: `check-pwr-${ic.instanceId}`,
        label: `${def.partNumber} Power Rails (VCC & GND)`,
        passed: vccOk && gndOk,
        details: vccOk && gndOk
          ? `${def.partNumber} Pin ${def.vccPin} (VCC) and Pin ${def.gndPin} (GND) are properly powered.`
          : `Power incomplete: ${!vccOk ? `Pin ${def.vccPin} (VCC) unconnected. ` : ''}${!gndOk ? `Pin ${def.gndPin} (GND) unconnected.` : ''}`,
        severity: vccOk && gndOk ? undefined : 'error',
        suggestedFix: !vccOk
          ? `Wire Pin ${def.vccPin} of ${def.partNumber} (${vccHole}) to the +5V rail.`
          : `Wire Pin ${def.gndPin} of ${def.partNumber} (${gndHole}) to the GND rail.`,
        highlightNodes: [vccHole, gndHole],
      });
    }
  }

  // 5. Check: Digital Inputs Connected
  const inputsUsed: number[] = [];
  for (let i = 0; i < 8; i++) {
    const net = getNet(`d${i}`);
    const hasConnection = net.some((n) => n.startsWith('bb-') || n.startsWith('ic-'));
    if (hasConnection) inputsUsed.push(i);
  }

  checks.push({
    id: 'check-inputs',
    label: 'Digital Inputs (D0-D7) Connected',
    passed: inputsUsed.length > 0,
    details: inputsUsed.length > 0
      ? `Active inputs: ${inputsUsed.map((i) => `D${i}`).join(', ')} wired to logic targets.`
      : 'No digital input signals connected. Wire D0/D1 switches to IC inputs.',
    severity: inputsUsed.length > 0 ? undefined : 'warning',
    suggestedFix: 'Run a jumper wire from D0 or D1 to an input pin on your logic IC.',
    highlightNodes: ['d0', 'd1'],
  });

  // 6. Check: Digital Outputs Connected
  const outputsUsed: number[] = [];
  for (let i = 8; i <= 15; i++) {
    const net = getNet(`d${i}`);
    const hasConnection = net.some((n) => n.startsWith('bb-') || n.startsWith('ic-'));
    if (hasConnection) outputsUsed.push(i);
  }

  checks.push({
    id: 'check-outputs',
    label: 'Digital Outputs (D8-D15) Connected',
    passed: outputsUsed.length > 0,
    details: outputsUsed.length > 0
      ? `Connected outputs: ${outputsUsed.map((i) => `D${i}`).join(', ')} connected to monitor signals.`
      : 'No digital outputs connected. Wire IC output to D8 or D9 LED terminal.',
    severity: outputsUsed.length > 0 ? undefined : 'warning',
    suggestedFix: 'Run a jumper wire from your output pin to terminal D8.',
    highlightNodes: ['d8'],
  });

  // 7. Check: Floating Inputs on Used ICs / Sections
  const floatingInputs: { icDefId: string; pinNum: number; pinName: string; holeId: string }[] = [];
  const seenFloating = new Set<string>();

  const isPinWiredOut = (icInstanceId: string, pinNum: number): boolean => {
    const outPinId = `ic-${icInstanceId}-pin-${pinNum}`;
    const outNet = getNet(outPinId);
    if (outNet.some((n) => !n.startsWith('bb-') && n !== outPinId)) {
      return true;
    }
    const strips = new Set(
      outNet
        .filter((n) => n.startsWith('bb-'))
        .map((n) => {
          const parts = n.split('-');
          const side = ['A', 'B', 'C', 'D', 'E'].includes(parts[1]) ? 'T' : 'B';
          return `${side}-${parts[2]}`;
        })
    );
    return strips.size > 1;
  };

  const recordIfFloating = (ic: PlacedIC, def: typeof IC_DEFINITIONS[string], inPin: number) => {
    const inPinId = `ic-${ic.instanceId}-pin-${inPin}`;
    if (seenFloating.has(inPinId)) return;
    const pinDef = def.pins.find((p) => p.number === inPin);
    if (!pinDef || pinDef.type === 'NC' || pinDef.type === 'POWER' || pinDef.type === 'OUTPUT') return;

    const inNet = getNet(inPinId);
    if (!netHasDriver(inNet)) {
      seenFloating.add(inPinId);
      floatingInputs.push({
        icDefId: def.partNumber,
        pinNum: inPin,
        pinName: pinDef.name || `Pin ${inPin}`,
        holeId: getPinPluggedHoleId(ic, inPin),
      });
    }
  };

  for (const ic of placedICs) {
    const def = IC_DEFINITIONS[ic.icDefId];
    if (!def) continue;

    if (def.gates && def.gates.length > 0) {
      for (const gate of def.gates) {
        if (isPinWiredOut(ic.instanceId, gate.output)) {
          for (const inPin of gate.inputs) {
            recordIfFloating(ic, def, inPin);
          }
        }
      }
    } else {
      const sections = getICSectionsForCheck(def.id);
      if (sections) {
        for (const sec of sections) {
          const isSecUsed = sec.outputs.some((outPin) => isPinWiredOut(ic.instanceId, outPin));
          if (isSecUsed) {
            for (const inPin of sec.inputs) {
              recordIfFloating(ic, def, inPin);
            }
          }
        }
      }
    }
  }

  checks.push({
    id: 'check-floating-inputs',
    label: 'IC Inputs Floating Check',
    passed: floatingInputs.length === 0,
    details: floatingInputs.length === 0
      ? 'No active IC inputs are left floating.'
      : `Floating input detected on ${floatingInputs.map((f) => `${f.icDefId} ${f.pinName}`).join(', ')}. Connect to an input switch (D0-D7), +5V, or GND.`,
    severity: floatingInputs.length === 0 ? undefined : 'warning',
    suggestedFix: floatingInputs.length > 0 ? `Connect a valid logic level or switch to ${floatingInputs[0].holeId}.` : undefined,
    highlightNodes: floatingInputs.map((f) => f.holeId),
  });

  // 7b. Missing Enable, Clock, and Flip-Flop Preset/Clear Diagnostics on active sections
  const missingEnables: { label: string; holeId: string }[] = [];
  const clockFaults: { label: string; holeId: string; reason: string }[] = [];
  const asyncFaults: { label: string; holeId: string; reason: string }[] = [];

  for (const ic of placedICs) {
    const def = IC_DEFINITIONS[ic.icDefId];
    if (!def) continue;
    const sections = getICSectionsForCheck(def.id);
    if (!sections) continue;

    for (const sec of sections) {
      const isSecUsed = sec.outputs.some((outPin) => isPinWiredOut(ic.instanceId, outPin));
      if (!isSecUsed) continue;

      if (sec.enables) {
        for (const enPin of sec.enables) {
          const pinDef = def.pins.find((p) => p.number === enPin);
          const enNet = getNet(`ic-${ic.instanceId}-pin-${enPin}`);
          if (!netHasDriver(enNet)) {
            missingEnables.push({
              label: `${def.partNumber} Pin ${enPin} (${pinDef?.name || 'EN'})`,
              holeId: getPinPluggedHoleId(ic, enPin),
            });
          }
        }
      }

      if (sec.clocks) {
        for (const clkPin of sec.clocks) {
          const pinDef = def.pins.find((p) => p.number === clkPin);
          const clkNet = getNet(`ic-${ic.instanceId}-pin-${clkPin}`);
          const holeId = getPinPluggedHoleId(ic, clkPin);
          const hasSwitchOrIC = clkNet.some((n) => /^d[0-7]$/.test(n) || allOutputPinNodes.has(n));
          const tiedStatic = clkNet.includes('vcc-src') || clkNet.includes('gnd-src');
          if (!netHasDriver(clkNet)) {
            clockFaults.push({
              label: `${def.partNumber} Pin ${clkPin} (${pinDef?.name || 'CLK'})`,
              holeId,
              reason: 'unconnected (floating)',
            });
          } else if (tiedStatic && !hasSwitchOrIC) {
            clockFaults.push({
              label: `${def.partNumber} Pin ${clkPin} (${pinDef?.name || 'CLK'})`,
              holeId,
              reason: 'tied directly to static +5V/GND instead of a clock switch or upstream output',
            });
          }
        }
      }

      if (sec.asyncControls) {
        for (const ctrlPin of sec.asyncControls) {
          const pinDef = def.pins.find((p) => p.number === ctrlPin);
          const ctrlNet = getNet(`ic-${ic.instanceId}-pin-${ctrlPin}`);
          if (!netHasDriver(ctrlNet)) {
            asyncFaults.push({
              label: `${def.partNumber} Pin ${ctrlPin} (${pinDef?.name || 'CTRL'})`,
              holeId: getPinPluggedHoleId(ic, ctrlPin),
              reason: 'floating (must be driven by D0-D7, +5V, or GND)',
            });
          }
        }

        // Check active-LOW PRE' and CLR' simultaneously tied permanently to GND
        if ((def.id === '7474' || def.id === '7476') && sec.asyncControls.length === 2) {
          const [pA, pB] = sec.asyncControls;
          const netA = getNet(`ic-${ic.instanceId}-pin-${pA}`);
          const netB = getNet(`ic-${ic.instanceId}-pin-${pB}`);
          if (netA.includes('gnd-src') && netB.includes('gnd-src')) {
            asyncFaults.push({
              label: `${def.partNumber} Pins ${pA} & ${pB}`,
              holeId: getPinPluggedHoleId(ic, pA),
              reason: 'both active-LOW PRE\' and CLR\' are permanently shorted to GND (forbidden state)',
            });
          }
        }
      }
    }
  }

  if (missingEnables.length > 0) {
    checks.push({
      id: 'check-missing-enables',
      label: 'IC Enable Signals Connected',
      passed: false,
      details: `Missing enable signal(s): ${missingEnables.map((e) => e.label).join(', ')}.`,
      severity: 'error',
      suggestedFix: `Drive ${missingEnables[0].label} (${missingEnables[0].holeId}) from an input switch (D0-D7), +5V, or GND.`,
      highlightNodes: missingEnables.map((e) => e.holeId),
    });
  }

  if (clockFaults.length > 0) {
    checks.push({
      id: 'check-clock-connections',
      label: 'Clock Input Connections',
      passed: false,
      details: `Clock connection issue: ${clockFaults.map((c) => `${c.label} is ${c.reason}`).join('; ')}.`,
      severity: 'error',
      suggestedFix: `Connect ${clockFaults[0].label} (${clockFaults[0].holeId}) to a clock switch (D0-D7) or QA ripple output.`,
      highlightNodes: clockFaults.map((c) => c.holeId),
    });
  }

  if (asyncFaults.length > 0) {
    checks.push({
      id: 'check-async-controls',
      label: 'Preset / Clear / Reset Connections',
      passed: false,
      details: `Async control issue: ${asyncFaults.map((a) => `${a.label} is ${a.reason}`).join('; ')}.`,
      severity: 'error',
      suggestedFix: `Wire ${asyncFaults[0].label} (${asyncFaults[0].holeId}) cleanly to a control switch or inactive rail (+5V for PRE'/CLR', GND for 7490 R0/R9).`,
      highlightNodes: asyncFaults.map((a) => a.holeId),
    });
  }

  // 8. Check: Output Contention (Output tied directly to Power Rail)
  let outputConflict = false;
  const conflictNodes: string[] = [];
  for (const ic of placedICs) {
    const def = IC_DEFINITIONS[ic.icDefId];
    if (!def) continue;
    for (const pin of def.pins) {
      if (pin.type !== 'OUTPUT') continue;
      const outPinId = `ic-${ic.instanceId}-pin-${pin.number}`;
      const net = getNet(outPinId);
      if (net.includes('vcc-src') || net.includes('gnd-src')) {
        outputConflict = true;
        conflictNodes.push(getPinPluggedHoleId(ic, pin.number));
      }
    }
  }

  checks.push({
    id: 'check-contention',
    label: 'No Output Bus Contention',
    passed: !outputConflict,
    details: outputConflict
      ? 'FAULT: IC output is shorted directly to +5V or GND power rail!'
      : 'Outputs are cleanly isolated from direct power shorting.',
    severity: outputConflict ? 'error' : undefined,
    highlightNodes: conflictNodes,
  });

  // 9. Experiment Specific Topology Check (if an experiment is selected)
  let expCheckPassed = true;
  let expCheckDetails = '';
  let expSuggestedFix: string | undefined = undefined;
  let expHighlightNodes: string[] = [];

  if (exp && resolved) {
    const missingICMessages: string[] = [];
    let firstMissingIc: string | null = null;

    if (exp.id === 'exp-basic-gates') {
      const hasAnyGateIC = resolved.suggestedICs.some((reqIc) =>
        placedICs.some((p) => p.icDefId.includes(reqIc) || reqIc.includes(p.icDefId))
      );
      if (!hasAnyGateIC) {
        firstMissingIc = resolved.suggestedICs[0];
        missingICMessages.push(`one of ${resolved.suggestedICs.join('/')}`);
      }
    } else {
      const requiredList =
        resolved.referenceCircuit?.ics && resolved.referenceCircuit.ics.length > 0
          ? resolved.referenceCircuit.ics.map((i) => i.icDefId)
          : resolved.suggestedICs;
      const requiredCounts: Record<string, number> = {};
      for (const reqIc of requiredList) {
        requiredCounts[reqIc] = (requiredCounts[reqIc] || 0) + 1;
      }

      for (const [reqIc, reqCount] of Object.entries(requiredCounts)) {
        const placedCount = placedICs.filter(
          (p) => p.icDefId.includes(reqIc) || reqIc.includes(p.icDefId)
        ).length;
        if (placedCount < reqCount) {
          if (!firstMissingIc) firstMissingIc = reqIc;
          missingICMessages.push(reqCount > 1 ? `${reqIc} (${placedCount}/${reqCount})` : reqIc);
        }
      }
    }

    if (missingICMessages.length > 0) {
      expCheckPassed = false;
      expCheckDetails = `Missing required IC(s): ${missingICMessages.join(', ')}. Place chip(s) to complete ${exp.title}.`;
      expSuggestedFix = `Add ${firstMissingIc} from the left toolbox onto the breadboard.`;
    } else if (exp.id === 'exp-half-adder') {
      const xorIc = placedICs.find((p) => p.icDefId.includes('7486'));
      const andIc = placedICs.find((p) => p.icDefId.includes('7408'));

      if (!xorIc || !andIc) {
        expCheckPassed = false;
        expCheckDetails = 'Half Adder requires both 7486 (XOR) and 7408 (AND) ICs.';
        expSuggestedFix = 'Place 7486 and 7408 on the board.';
      } else {
        const xorOutHole = getPinPluggedHoleId(xorIc, 3);
        const andOutHole = getPinPluggedHoleId(andIc, 3);
        const d8Net = getNet('d8');
        const d9Net = getNet('d9');

        const sumOnD8 = areConnected('d8', xorOutHole) || d8Net.some((n) => n.includes(`ic-${xorIc.instanceId}`));
        const carryOnD9 = areConnected('d9', andOutHole) || d9Net.some((n) => n.includes(`ic-${andIc.instanceId}`));

        const sumOnD9 = areConnected('d9', xorOutHole) || d9Net.some((n) => n.includes(`ic-${xorIc.instanceId}`));
        const carryOnD8 = areConnected('d8', andOutHole) || d8Net.some((n) => n.includes(`ic-${andIc.instanceId}`));

        if (sumOnD9 && carryOnD8) {
          expCheckPassed = false;
          expCheckDetails = '⚠ WRONG OUTPUT ASSIGNMENT: SUM is wired to D9 and CARRY is wired to D8. Expected: SUM -> D8, CARRY -> D9.';
          expSuggestedFix = 'Swap output wires so 7486 XOR output connects to D8 and 7408 AND output connects to D9.';
          expHighlightNodes = ['d8', 'd9', xorOutHole, andOutHole];
        } else if (!sumOnD8 || !carryOnD9) {
          expCheckPassed = false;
          expCheckDetails = `Half Adder wiring incomplete: ${!sumOnD8 ? 'SUM (7486 pin 3) must connect to D8. ' : ''}${!carryOnD9 ? 'CARRY (7408 pin 3) must connect to D9.' : ''}`;
          expSuggestedFix = !sumOnD8 ? 'Connect a jumper wire from 7486 Pin 3 to D8.' : 'Connect a jumper wire from 7408 Pin 3 to D9.';
          expHighlightNodes = [!sumOnD8 ? xorOutHole : andOutHole, !sumOnD8 ? 'd8' : 'd9'];
        } else {
          expCheckDetails = 'Topology verified: XOR gate mapped to SUM (D8), AND gate mapped to CARRY (D9).';
        }
      }
    } else {
      const reqInputs = Object.values(resolved.pinMapping.inputNames);
      const reqOutputs = Object.values(resolved.pinMapping.outputNames);

      const missingInputs = reqInputs.filter((inName) => getNet(inName.toLowerCase()).length <= 1);
      const missingOutputs = reqOutputs.filter((outName) => getNet(outName.toLowerCase()).length <= 1);

      if (missingInputs.length > 0 || missingOutputs.length > 0) {
        expCheckPassed = false;
        expCheckDetails = `Unwired experiment terminals: ${[...missingInputs, ...missingOutputs].join(', ')}.`;
        expSuggestedFix = missingInputs.length > 0 ? `Wire ${missingInputs[0]} to IC inputs.` : `Wire IC output to ${missingOutputs[0]}.`;
        expHighlightNodes = [...missingInputs, ...missingOutputs].map((s) => s.toLowerCase());
      } else {
        expCheckDetails = `All required terminals (${reqInputs.join(', ')} and ${reqOutputs.join(', ')}) are connected.`;
      }
    }

    checks.push({
      id: 'check-experiment-topology',
      label: `Experiment Logic Topology: ${resolved.variant ? resolved.variant.label : exp.title}`,
      passed: expCheckPassed,
      details: expCheckDetails,
      severity: expCheckPassed ? undefined : 'error',
      suggestedFix: expSuggestedFix,
      highlightNodes: expHighlightNodes,
    });
  }

  // 10. Functional Truth Table / Sequential Verification via Shared Engine Evaluator
  let truthTableResults: ConnectionCheckResult['truthTableResults'] = undefined;
  if (
    exp &&
    resolved &&
    ((resolved.truthTable && resolved.truthTable.length > 0) ||
      (resolved.sequentialTests && resolved.sequentialTests.length > 0))
  ) {
    const evalRes = evaluateExperiment(exp, placedICs, wires, ioSettings.inputStates, variantId);
    truthTableResults = evalRes.results;

    const passedCount = evalRes.results.filter((t) => t.passed).length;
    const totalCount = evalRes.results.length;
    const allPassed = evalRes.passed;

    checks.push({
      id: 'check-truth-table',
      label: evalRes.isSequential ? 'Sequential State & Sequence Verification' : 'Truth Table Functional Verification',
      passed: allPassed,
      details: allPassed
        ? `All ${totalCount}/${totalCount} ${evalRes.isSequential ? 'sequential transition steps' : 'test vectors'} passed functional verification!`
        : `${passedCount}/${totalCount} ${evalRes.isSequential ? 'sequential steps' : 'test vectors'} passed. Some logic states differ from expected behavior.`,
      severity: allPassed ? undefined : 'error',
    });
  }

  // Calculate overall score
  const totalChecks = checks.length;
  const passedChecks = checks.filter((c) => c.passed).length;
  const score = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 0;
  const passed = checks.every((c) => c.passed || c.severity === 'info');

  return {
    passed,
    score,
    checks,
    truthTableResults,
  };
}
