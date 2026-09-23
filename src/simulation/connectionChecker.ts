import { ConnectionCheckResult, PlacedIC, Wire, DigitalIOSettings } from '../types/circuit';
import { IC_DEFINITIONS } from '../data/icDefinitions';
import { LAB_EXPERIMENTS } from '../data/experiments';
import { simulateCircuit, formatNodeLabel, getPinPluggedHoleId } from './engine';

export function runConnectionCheck(
  placedICs: PlacedIC[],
  wires: Wire[],
  ioSettings: DigitalIOSettings,
  selectedExpId: string | null
): ConnectionCheckResult {
  const sim = simulateCircuit(placedICs, wires, ioSettings);
  const connectedNets = sim.connectedNets;
  const exp = selectedExpId ? LAB_EXPERIMENTS.find((e) => e.id === selectedExpId) : null;

  const checks: ConnectionCheckResult['checks'] = [];

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
    checks.push({
      id: 'check-ic-present',
      label: 'Components on Breadboard',
      passed: false,
      details: exp ? `Place required ICs (e.g. ${exp.suggestedICs.join(', ')}) onto the breadboard.` : 'No ICs placed on breadboard.',
      severity: 'warning',
      suggestedFix: exp ? `Select ${exp.suggestedICs[0]} from the left IC toolbox and click Place.` : 'Place an IC from the left toolbox.',
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
      : 'No digital input signals connected. Wire D0/D1 switches to IC gate inputs.',
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
      : 'No digital outputs connected. Wire IC gate output to D8 or D9 LED terminal.',
    severity: outputsUsed.length > 0 ? undefined : 'warning',
    suggestedFix: 'Run a jumper wire from your gate output pin to terminal D8.',
    highlightNodes: ['d8'],
  });

  // 7. Check: Floating Inputs on Used ICs
  const floatingInputs: { icDefId: string; pinNum: number; pinName: string; holeId: string }[] = [];
  for (const ic of placedICs) {
    const def = IC_DEFINITIONS[ic.icDefId];
    if (!def) continue;

    for (const gate of def.gates || []) {
      // Check if this gate is being used (its output has a connection)
      const outPinId = `ic-${ic.instanceId}-pin-${gate.output}`;
      const outNet = getNet(outPinId);
      const isGateUsed = outNet.length > 1;

      if (isGateUsed) {
        for (const inPin of gate.inputs) {
          const inPinId = `ic-${ic.instanceId}-pin-${inPin}`;
          const inNet = getNet(inPinId);
          // If inNet only contains itself or its breadboard column and has no signal source
          const hasDriver = inNet.some(
            (n) => n.startsWith('d') || n === 'vcc-src' || n === 'gnd-src' || n.includes('power-') || n.startsWith('dio-')
          );
          if (!hasDriver && inNet.length <= 5) {
            const holeId = getPinPluggedHoleId(ic, inPin);
            const pinDef = def.pins.find((p) => p.number === inPin);
            floatingInputs.push({
              icDefId: def.partNumber,
              pinNum: inPin,
              pinName: pinDef?.name || `Pin ${inPin}`,
              holeId,
            });
          }
        }
      }
    }
  }

  checks.push({
    id: 'check-floating-inputs',
    label: 'Gate Inputs Floating Check',
    passed: floatingInputs.length === 0,
    details: floatingInputs.length === 0
      ? 'No active gate inputs are left floating.'
      : `Floating input detected on ${floatingInputs.map((f) => `${f.icDefId} ${f.pinName}`).join(', ')}. Connect to an input switch (D0-D7) or ground.`,
    severity: floatingInputs.length === 0 ? undefined : 'warning',
    suggestedFix: floatingInputs.length > 0 ? `Connect D0 or D1 to ${floatingInputs[0].holeId}.` : undefined,
    highlightNodes: floatingInputs.map((f) => f.holeId),
  });

  // 8. Check: Output Contention (Multiple Outputs or Output tied to Power)
  let outputConflict = false;
  let conflictNodes: string[] = [];
  for (const ic of placedICs) {
    const def = IC_DEFINITIONS[ic.icDefId];
    if (!def) continue;
    for (const gate of def.gates || []) {
      const outPinId = `ic-${ic.instanceId}-pin-${gate.output}`;
      const net = getNet(outPinId);
      if (net.includes('vcc-src') || net.includes('gnd-src')) {
        outputConflict = true;
        conflictNodes.push(getPinPluggedHoleId(ic, gate.output));
      }
    }
  }

  checks.push({
    id: 'check-contention',
    label: 'No Output Bus Contention',
    passed: !outputConflict,
    details: outputConflict
      ? 'FAULT: Gate output is shorted directly to +5V or GND power rail!'
      : 'Outputs are cleanly isolated from direct power shorting.',
    severity: outputConflict ? 'error' : undefined,
    highlightNodes: conflictNodes,
  });

  // 9. Experiment Specific Topology Check (if an experiment is selected)
  let expCheckPassed = true;
  let expCheckDetails = '';
  let expSuggestedFix: string | undefined = undefined;
  let expHighlightNodes: string[] = [];

  if (exp) {
    // Check if required ICs are placed
    const missingICs = exp.suggestedICs.filter(
      (reqIc) => !placedICs.some((p) => p.icDefId.includes(reqIc) || reqIc.includes(p.icDefId))
    );

    if (missingICs.length > 0) {
      expCheckPassed = false;
      expCheckDetails = `Missing required IC: ${missingICs.join(', ')}. Place this chip to complete ${exp.title}.`;
      expSuggestedFix = `Add ${missingICs[0]} from the left toolbox onto the breadboard.`;
    } else if (exp.id === 'exp-half-adder') {
      // Half Adder verification:
      // SUM must be XOR(D0, D1) -> D8
      // CARRY must be AND(D0, D1) -> D9
      const xorIc = placedICs.find((p) => p.icDefId.includes('7486'));
      const andIc = placedICs.find((p) => p.icDefId.includes('7408'));

      if (!xorIc || !andIc) {
        expCheckPassed = false;
        expCheckDetails = 'Half Adder requires both 7486 (XOR) and 7408 (AND) ICs.';
        expSuggestedFix = 'Place 7486 and 7408 on the board.';
      } else {
        // Check SUM: D8 must be driven by 7486 output pin 3, 6, 8, or 11
        const xorOutHole = getPinPluggedHoleId(xorIc, 3);
        const andOutHole = getPinPluggedHoleId(andIc, 3);
        const d8Net = getNet('d8');
        const d9Net = getNet('d9');

        const sumOnD8 = areConnected('d8', xorOutHole) || d8Net.some((n) => n.includes(`ic-${xorIc.instanceId}`));
        const carryOnD9 = areConnected('d9', andOutHole) || d9Net.some((n) => n.includes(`ic-${andIc.instanceId}`));

        // Check if user accidentally swapped D8 and D9
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
      // General check: verify required inputs and outputs are wired
      const reqInputs = Object.values(exp.pinMapping.inputNames);
      const reqOutputs = Object.values(exp.pinMapping.outputNames);

      const missingInputs = reqInputs.filter((inName) => getNet(inName.toLowerCase()).length <= 1);
      const missingOutputs = reqOutputs.filter((outName) => getNet(outName.toLowerCase()).length <= 1);

      if (missingInputs.length > 0 || missingOutputs.length > 0) {
        expCheckPassed = false;
        expCheckDetails = `Unwired experiment terminals: ${[...missingInputs, ...missingOutputs].join(', ')}.`;
        expSuggestedFix = missingInputs.length > 0 ? `Wire ${missingInputs[0]} to logic gate inputs.` : `Wire gate output to ${missingOutputs[0]}.`;
        expHighlightNodes = [...missingInputs, ...missingOutputs].map((s) => s.toLowerCase());
      } else {
        expCheckDetails = `All required terminals (${reqInputs.join(', ')} and ${reqOutputs.join(', ')}) are connected.`;
      }
    }

    checks.push({
      id: 'check-experiment-topology',
      label: `Experiment Logic Topology: ${exp.title}`,
      passed: expCheckPassed,
      details: expCheckDetails,
      severity: expCheckPassed ? undefined : 'error',
      suggestedFix: expSuggestedFix,
      highlightNodes: expHighlightNodes,
    });
  }

  // 10. Truth Table Verification (if experiment exists)
  let truthTableResults: ConnectionCheckResult['truthTableResults'] = undefined;
  if (exp && exp.truthTable && exp.truthTable.length > 0) {
    truthTableResults = [];
    const inputNames = exp.pinMapping.inputNames; // { A: 'D0', B: 'D1' }
    const outputNames = exp.pinMapping.outputNames; // { SUM: 'D8', CARRY: 'D9' }

    for (const testCase of exp.truthTable) {
      // Construct simulated inputs
      const testInputs: boolean[] = [false, false, false, false, false, false, false, false];
      for (const [inKey, bitVal] of Object.entries(testCase.inputs)) {
        const terminal = inputNames[inKey]; // e.g. 'D0'
        if (terminal) {
          const idx = parseInt(terminal.replace(/[^0-9]/g, ''), 10);
          if (idx >= 0 && idx < 8) {
            testInputs[idx] = bitVal === 1;
          }
        }
      }

      // Simulate with these test inputs
      const testSim = simulateCircuit(placedICs, wires, {
        inputStates: testInputs,
        powerOn: true,
      });

      const actualOutputs: Record<string, number> = {};
      let casePassed = true;

      for (const [outKey, expectedVal] of Object.entries(testCase.expectedOutputs)) {
        const terminal = outputNames[outKey]; // e.g. 'D8'
        if (terminal) {
          const idx = parseInt(terminal.replace(/[^0-9]/g, ''), 10);
          const outState = testSim.outputStates[idx - 8];
          const actualBit = outState === 'HIGH' ? 1 : 0;
          actualOutputs[outKey] = actualBit;
          if (actualBit !== expectedVal) {
            casePassed = false;
          }
        }
      }

      truthTableResults.push({
        testCaseId: testCase.id,
        inputs: testCase.inputs,
        expected: testCase.expectedOutputs,
        actual: actualOutputs,
        passed: casePassed,
      });
    }

    const allPassed = truthTableResults.every((t) => t.passed);
    checks.push({
      id: 'check-truth-table',
      label: 'Truth Table Functional Verification',
      passed: allPassed,
      details: allPassed
        ? `All ${truthTableResults.length}/${truthTableResults.length} test vectors passed truth table verification!`
        : `${truthTableResults.filter((t) => t.passed).length}/${truthTableResults.length} test vectors passed. Some logic states differ from expected truth table.`,
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
