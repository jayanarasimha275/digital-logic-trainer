import { CircuitDiagnostic, DigitalIOSettings, LogicLevel, PlacedIC, SimulationResult, Wire } from '../types/circuit';
import { IC_DEFINITIONS } from '../data/icDefinitions';

export interface BreadboardLayoutConfig {
  numCols: number;
}

export const DEFAULT_LAYOUT: BreadboardLayoutConfig = {
  numCols: 30,
};

// Helper to determine the hole an IC pin plugs into
export function getPinPluggedHoleId(ic: PlacedIC, pinNumber: number): string {
  const def = IC_DEFINITIONS[ic.icDefId];
  if (!def) return '';

  const half = def.pinCount / 2; // 7 for DIP-14, 8 for DIP-16

  if (ic.rotation === 0) {
    // Notch left:
    // Pins 1..half are on bottom (Row F), cols startCol .. startCol + half - 1
    // Pins half+1..pinCount are on top (Row E), cols (startCol + half - 1) down to startCol
    if (pinNumber <= half) {
      const col = ic.startCol + (pinNumber - 1);
      return `bb-F-${col}`;
    } else {
      const col = ic.startCol + (def.pinCount - pinNumber);
      return `bb-E-${col}`;
    }
  } else {
    // Notch right (180 deg):
    if (pinNumber <= half) {
      const col = ic.startCol + (half - pinNumber);
      return `bb-E-${col}`;
    } else {
      const col = ic.startCol + (pinNumber - half - 1);
      return `bb-F-${col}`;
    }
  }
}

// Disjoint Set Union (DSU) for electrical connectivity
class DisjointSet {
  parent: Record<string, string> = {};

  find(item: string): string {
    if (!this.parent[item]) {
      this.parent[item] = item;
      return item;
    }
    if (this.parent[item] !== item) {
      this.parent[item] = this.find(this.parent[item]);
    }
    return this.parent[item];
  }

  union(a: string, b: string) {
    const rootA = this.find(a);
    const rootB = this.find(b);
    if (rootA !== rootB) {
      this.parent[rootB] = rootA;
    }
  }
}

export function simulateCircuit(
  placedICs: PlacedIC[],
  wires: Wire[],
  ioSettings: DigitalIOSettings,
  layout: BreadboardLayoutConfig = DEFAULT_LAYOUT
): SimulationResult {
  const dsu = new DisjointSet();
  const errors: CircuitDiagnostic[] = [];
  const warnings: CircuitDiagnostic[] = [];

  // 1. Internal Breadboard Connections
  // 1a. Power Rails:
  // Top Plus rail: all top-power-plus-1..numCols are connected together
  for (let c = 2; c <= layout.numCols; c++) {
    dsu.union(`top-power-plus-1`, `top-power-plus-${c}`);
    dsu.union(`top-power-minus-1`, `top-power-minus-${c}`);
    dsu.union(`bot-power-plus-1`, `bot-power-plus-${c}`);
    dsu.union(`bot-power-minus-1`, `bot-power-minus-${c}`);
  }

  // 1b. Column Tie-strips:
  // Rows A..E on column c are electrically connected together
  // Rows F..J on column c are electrically connected together
  const rowsTop = ['A', 'B', 'C', 'D', 'E'];
  const rowsBot = ['F', 'G', 'H', 'I', 'J'];

  for (let c = 1; c <= layout.numCols; c++) {
    for (let r = 1; r < rowsTop.length; r++) {
      dsu.union(`bb-${rowsTop[0]}-${c}`, `bb-${rowsTop[r]}-${c}`);
    }
    for (let r = 1; r < rowsBot.length; r++) {
      dsu.union(`bb-${rowsBot[0]}-${c}`, `bb-${rowsBot[r]}-${c}`);
    }
  }

  // Alias DIO terminals: d0..d15 with dio-0..dio-15
  for (let i = 0; i < 16; i++) {
    dsu.union(`d${i}`, `dio-${i}`);
  }
  // Alias Power Terminals
  dsu.union('vcc-src', '+5v');
  dsu.union('vcc-src', 'p5v');
  dsu.union('gnd-src', 'gnd');
  dsu.union('gnd-src', 'ground');

  // 1c. IC Pins inserted into breadboard holes
  for (const ic of placedICs) {
    const def = IC_DEFINITIONS[ic.icDefId];
    if (!def) continue;
    for (let p = 1; p <= def.pinCount; p++) {
      const pinHoleId = getPinPluggedHoleId(ic, p);
      const pinId = `ic-${ic.instanceId}-pin-${p}`;
      if (pinHoleId) {
        dsu.union(pinId, pinHoleId);
      }
    }
  }

  // 1d. Jumper Wires
  for (const wire of wires) {
    if (wire.fromHoleId && wire.toHoleId) {
      dsu.union(wire.fromHoleId, wire.toHoleId);
    }
  }

  // Check for Short Circuit between VCC and GND
  const vccRoot = dsu.find('vcc-src');
  const gndRoot = dsu.find('gnd-src');

  if (vccRoot === gndRoot && ioSettings.powerOn) {
    errors.push({
      id: 'err-vcc-gnd-short',
      type: 'short_circuit',
      severity: 'error',
      title: 'CRITICAL: Short Circuit Detected',
      message: 'VCC (+5V) and GND (0V) are directly short-circuited together! Check your power rail wiring.',
    });
  }

  // 2. Determine Power Status for each IC
  const icPowerStatus: Record<string, { vccOk: boolean; gndOk: boolean; error?: string }> = {};

  for (const ic of placedICs) {
    const def = IC_DEFINITIONS[ic.icDefId];
    if (!def) continue;

    const vccPinId = `ic-${ic.instanceId}-pin-${def.vccPin}`;
    const gndPinId = `ic-${ic.instanceId}-pin-${def.gndPin}`;

    const vccPinRoot = dsu.find(vccPinId);
    const gndPinRoot = dsu.find(gndPinId);

    const vccOk = ioSettings.powerOn && vccPinRoot === vccRoot;
    const gndOk = ioSettings.powerOn && gndPinRoot === gndRoot;

    let errMessage = '';
    if (!vccOk && !gndOk) {
      errMessage = `IC ${def.partNumber} at Col ${ic.startCol}: Neither VCC nor GND is connected.`;
      warnings.push({
        id: `warn-power-${ic.instanceId}`,
        type: 'power_error',
        severity: 'warning',
        title: `IC ${def.id} Power Error`,
        message: errMessage,
        targetICInstanceId: ic.instanceId,
      });
    } else if (!vccOk) {
      errMessage = `IC ${def.partNumber} at Col ${ic.startCol}: Pin ${def.vccPin} (VCC) is not connected to +5V.`;
      warnings.push({
        id: `warn-vcc-${ic.instanceId}`,
        type: 'power_error',
        severity: 'warning',
        title: `IC ${def.id} VCC Missing`,
        message: errMessage,
        targetICInstanceId: ic.instanceId,
        targetPinNumber: def.vccPin,
      });
    } else if (!gndOk) {
      errMessage = `IC ${def.partNumber} at Col ${ic.startCol}: Pin ${def.gndPin} (GND) is not connected to ground (0V).`;
      warnings.push({
        id: `warn-gnd-${ic.instanceId}`,
        type: 'power_error',
        severity: 'warning',
        title: `IC ${def.id} GND Missing`,
        message: errMessage,
        targetICInstanceId: ic.instanceId,
        targetPinNumber: def.gndPin,
      });
    }

    icPowerStatus[ic.instanceId] = {
      vccOk,
      gndOk,
      error: errMessage || undefined,
    };
  }

  // 3. Iterative Combinational Circuit Evaluation
  // Active IC outputs will drive their root net.
  const icOutputDrivers: Record<string, { level: LogicLevel; source: string }> = {};

  // Propagate for multiple iterations until stable (handles chained combinational gates like Full Adders)
  const maxIterations = 8;
  let changed = true;
  let iteration = 0;

  while (changed && iteration < maxIterations) {
    changed = false;
    iteration++;

    // Helper to get current level of any net
    const getNetLevel = (item: string): LogicLevel => {
      const root = dsu.find(item);

      if (!ioSettings.powerOn) return 'LOW';

      // Power supply rails
      if (root === vccRoot) return 'HIGH';
      if (root === gndRoot) return 'LOW';

      // Digital inputs D0..D7
      for (let i = 0; i < 8; i++) {
        if (dsu.find(`d${i}`) === root) {
          return ioSettings.inputStates[i] ? 'HIGH' : 'LOW';
        }
      }

      // Check if driven by any IC output
      for (const [outPinId, driver] of Object.entries(icOutputDrivers)) {
        if (dsu.find(outPinId) === root) {
          return driver.level;
        }
      }

      return 'FLOATING';
    };

    // Evaluate each IC
    for (const ic of placedICs) {
      const def = IC_DEFINITIONS[ic.icDefId];
      if (!def) continue;

      const pStatus = icPowerStatus[ic.instanceId];
      if (!pStatus || !pStatus.vccOk || !pStatus.gndOk) {
        // Unpowered IC cannot drive outputs
        continue;
      }

      // Evaluate custom IC if defined (e.g. 74138, 74148, 74153, 74139)
      if (def.evaluateCustom) {
        const inputLevels: Record<number, LogicLevel> = {};
        for (const pin of def.pins) {
          if (pin.type === 'INPUT' || pin.type === 'ENABLE') {
            const pinId = `ic-${ic.instanceId}-pin-${pin.number}`;
            inputLevels[pin.number] = getNetLevel(pinId);
          }
        }

        const outLevels = def.evaluateCustom(inputLevels);
        for (const [pinNumStr, lvl] of Object.entries(outLevels)) {
          const pinNum = Number(pinNumStr);
          const outPinId = `ic-${ic.instanceId}-pin-${pinNum}`;
          if (!icOutputDrivers[outPinId] || icOutputDrivers[outPinId].level !== lvl) {
            icOutputDrivers[outPinId] = {
              level: lvl,
              source: `${def.id}.${pinNum}`,
            };
            changed = true;
          }
        }
        continue;
      }

      // Evaluate standard gates
      if (def.gates) {
        for (const gate of def.gates) {
          const inLevels: LogicLevel[] = gate.inputs.map((pinNum) => {
            const pinId = `ic-${ic.instanceId}-pin-${pinNum}`;
            return getNetLevel(pinId);
          });

          // Check for floating input on the final iteration to generate warning
          if (iteration === maxIterations - 1) {
            gate.inputs.forEach((pinNum, idx) => {
              if (inLevels[idx] === 'FLOATING') {
                const pinDef = def.pins.find((p) => p.number === pinNum);
                warnings.push({
                  id: `floating-in-${ic.instanceId}-${pinNum}`,
                  type: 'floating_input',
                  severity: 'warning',
                  title: `Floating Input at ${def.id} Pin ${pinNum}`,
                  message: `Gate ${gate.gateIndex} input (${pinDef?.name || pinNum}) is floating/unconnected. Connect it to an input or ground.`,
                  targetICInstanceId: ic.instanceId,
                  targetPinNumber: pinNum,
                });
              }
            });
          }

          let outLevel: LogicLevel = 'FLOATING';

          if (inLevels.includes('ERROR')) {
            outLevel = 'ERROR';
          } else if (inLevels.includes('FLOATING')) {
            outLevel = 'FLOATING';
          } else {
            // All inputs are valid HIGH or LOW
            const bools = inLevels.map((l) => l === 'HIGH');
            switch (gate.type) {
              case 'AND':
                outLevel = bools.every(Boolean) ? 'HIGH' : 'LOW';
                break;
              case 'OR':
                outLevel = bools.some(Boolean) ? 'HIGH' : 'LOW';
                break;
              case 'NOT':
                outLevel = !bools[0] ? 'HIGH' : 'LOW';
                break;
              case 'NAND':
                outLevel = !bools.every(Boolean) ? 'HIGH' : 'LOW';
                break;
              case 'NOR':
                outLevel = !bools.some(Boolean) ? 'HIGH' : 'LOW';
                break;
              case 'XOR':
                outLevel = bools[0] !== bools[1] ? 'HIGH' : 'LOW';
                break;
              default:
                outLevel = 'LOW';
            }
          }

          const outPinId = `ic-${ic.instanceId}-pin-${gate.output}`;
          if (!icOutputDrivers[outPinId] || icOutputDrivers[outPinId].level !== outLevel) {
            icOutputDrivers[outPinId] = {
              level: outLevel,
              source: `${def.id}.${gate.output}`,
            };
            changed = true;
          }
        }
      }
    }
  }

  // 4. Resolve Output Channels D8 - D15
  const outputStates: LogicLevel[] = [];
  const outputVoltages: number[] = [];

  for (let i = 8; i <= 15; i++) {
    const termId = `d${i}`;
    const termRoot = dsu.find(termId);

    if (!ioSettings.powerOn) {
      outputStates.push('LOW');
      outputVoltages.push(0.0);
      continue;
    }

    if (termRoot === vccRoot) {
      outputStates.push('HIGH');
      outputVoltages.push(5.0);
      continue;
    }
    if (termRoot === gndRoot) {
      outputStates.push('LOW');
      outputVoltages.push(0.0);
      continue;
    }

    // Check if connected directly to an input switch D0..D7
    let connectedToInput = false;
    for (let inIdx = 0; inIdx < 8; inIdx++) {
      if (dsu.find(`d${inIdx}`) === termRoot) {
        const val = ioSettings.inputStates[inIdx] ? 'HIGH' : 'LOW';
        outputStates.push(val);
        outputVoltages.push(val === 'HIGH' ? 5.0 : 0.0);
        connectedToInput = true;
        break;
      }
    }
    if (connectedToInput) continue;

    // Check if driven by an IC output
    let foundDriver = false;
    for (const [outPinId, driver] of Object.entries(icOutputDrivers)) {
      if (dsu.find(outPinId) === termRoot) {
        outputStates.push(driver.level);
        outputVoltages.push(driver.level === 'HIGH' ? 5.0 : driver.level === 'LOW' ? 0.0 : 0.0);
        foundDriver = true;
        break;
      }
    }

    if (!foundDriver) {
      outputStates.push('FLOATING');
      outputVoltages.push(0.0);
    }
  }

  // 4b. Resolve On-Board User LEDs (LED 0 - LED 7 as on NI ELVIS II)
  const userLedStates: boolean[] = [];
  for (let i = 0; i < 8; i++) {
    const ledTerm = `led-${i}`;
    const ledRoot = dsu.find(ledTerm);

    if (!ioSettings.powerOn) {
      userLedStates.push(false);
      continue;
    }

    if (ledRoot === vccRoot) {
      userLedStates.push(true);
      continue;
    }

    let isHigh = false;
    // Check if connected to an input that is HIGH
    for (let inIdx = 0; inIdx < 8; inIdx++) {
      if (dsu.find(`dio-${inIdx}`) === ledRoot || dsu.find(`d${inIdx}`) === ledRoot) {
        if (ioSettings.inputStates[inIdx]) {
          isHigh = true;
          break;
        }
      }
    }

    // Check if connected to an IC driver that is HIGH
    if (!isHigh) {
      for (const [outPinId, driver] of Object.entries(icOutputDrivers)) {
        if (dsu.find(outPinId) === ledRoot && driver.level === 'HIGH') {
          isHigh = true;
          break;
        }
      }
    }

    userLedStates.push(isHigh);
  }

  // 5. Build global nodeStates & voltages mapping and connectedNets
  const nodeStates: Record<string, LogicLevel> = {};
  const nodeVoltages: Record<string, number> = {};

  // Collect all known circuit nodes for state resolution
  const allNodes = new Set<string>();
  allNodes.add('vcc-src');
  allNodes.add('gnd-src');
  for (let i = 0; i < 16; i++) {
    allNodes.add(`d${i}`);
    allNodes.add(`dio-${i}`);
  }
  for (let i = 0; i < 8; i++) {
    allNodes.add(`led-${i}`);
  }
  for (const wire of wires) {
    if (wire.fromHoleId) allNodes.add(wire.fromHoleId);
    if (wire.toHoleId) allNodes.add(wire.toHoleId);
  }
  for (const ic of placedICs) {
    const def = IC_DEFINITIONS[ic.icDefId];
    if (!def) continue;
    for (let p = 1; p <= def.pinCount; p++) {
      allNodes.add(`ic-${ic.instanceId}-pin-${p}`);
    }
  }

  // Also include breadboard holes that have pins or wires
  for (let c = 1; c <= layout.numCols; c++) {
    for (const r of [...rowsTop, ...rowsBot]) {
      allNodes.add(`bb-${r}-${c}`);
    }
    allNodes.add(`top-power-plus-${c}`);
    allNodes.add(`top-power-minus-${c}`);
    allNodes.add(`bot-power-plus-${c}`);
    allNodes.add(`bot-power-minus-${c}`);
  }

  // Group nodes into electrical nets by their DSU root
  const rootToNodes: Record<string, string[]> = {};
  for (const node of allNodes) {
    const root = dsu.find(node);
    if (!rootToNodes[root]) rootToNodes[root] = [];
    rootToNodes[root].push(node);
  }

  const connectedNets: Record<string, string[]> = {};
  for (const [root, nodes] of Object.entries(rootToNodes)) {
    for (const node of nodes) {
      connectedNets[node] = nodes;
    }
  }

  // Resolve state and voltage for all nodes based on net driving source
  for (const node of allNodes) {
    const root = dsu.find(node);

    if (!ioSettings.powerOn) {
      nodeStates[node] = 'LOW';
      nodeVoltages[node] = 0.0;
      continue;
    }

    if (root === vccRoot) {
      nodeStates[node] = 'HIGH';
      nodeVoltages[node] = 5.0;
      continue;
    }

    if (root === gndRoot) {
      nodeStates[node] = 'LOW';
      nodeVoltages[node] = 0.0;
      continue;
    }

    // Check if driven by an input terminal (D0 - D7)
    let foundInput = false;
    for (let i = 0; i < 8; i++) {
      if (dsu.find(`d${i}`) === root || dsu.find(`dio-${i}`) === root) {
        const isHigh = ioSettings.inputStates[i];
        nodeStates[node] = isHigh ? 'HIGH' : 'LOW';
        nodeVoltages[node] = isHigh ? 5.0 : 0.0;
        foundInput = true;
        break;
      }
    }
    if (foundInput) continue;

    // Check if driven by an IC output gate
    let foundGate = false;
    for (const [outPinId, driver] of Object.entries(icOutputDrivers)) {
      if (dsu.find(outPinId) === root) {
        nodeStates[node] = driver.level;
        nodeVoltages[node] = driver.level === 'HIGH' ? 5.0 : 0.0;
        foundGate = true;
        break;
      }
    }
    if (foundGate) continue;

    // User LEDs
    if (node.startsWith('led-')) {
      const idx = Number(node.replace('led-', ''));
      const on = userLedStates[idx];
      nodeStates[node] = on ? 'HIGH' : 'LOW';
      nodeVoltages[node] = on ? 3.3 : 0.0;
      continue;
    }

    // Default: floating
    nodeStates[node] = 'FLOATING';
    nodeVoltages[node] = 0.0;
  }

  return {
    nodeStates,
    nodeVoltages,
    outputStates,
    outputVoltages,
    userLedStates,
    icPowerStatus,
    connectedNets,
    errors,
    warnings,
  };
}

// User-friendly Node Label Formatter for the Connection Inspector
export function formatNodeLabel(nodeId: string, placedICs?: PlacedIC[]): string {
  if (!nodeId) return 'Unconnected';

  // Digital Inputs
  if (nodeId.startsWith('d') && !nodeId.includes('-')) {
    const num = parseInt(nodeId.replace('d', ''), 10);
    if (num <= 7) return `Input Terminal D${num}`;
    return `Output Terminal D${num}`;
  }
  if (nodeId.startsWith('dio-')) {
    const num = parseInt(nodeId.replace('dio-', ''), 10);
    if (num <= 7) return `Input Terminal D${num}`;
    return `Output Terminal D${num}`;
  }

  // Power
  if (nodeId === 'vcc-src' || nodeId === '+5v' || nodeId === 'p5v') return '+5V Power Supply';
  if (nodeId === 'gnd-src' || nodeId === 'gnd' || nodeId === 'ground') return '0V Ground Reference';

  // Rails
  if (nodeId.startsWith('top-power-plus-')) {
    const col = nodeId.replace('top-power-plus-', '');
    return `Top Rail (+) Col ${col}`;
  }
  if (nodeId.startsWith('top-power-minus-')) {
    const col = nodeId.replace('top-power-minus-', '');
    return `Top Rail (-) Col ${col}`;
  }
  if (nodeId.startsWith('bot-power-plus-')) {
    const col = nodeId.replace('bot-power-plus-', '');
    return `Bottom Rail (+) Col ${col}`;
  }
  if (nodeId.startsWith('bot-power-minus-')) {
    const col = nodeId.replace('bot-power-minus-', '');
    return `Bottom Rail (-) Col ${col}`;
  }

  // Breadboard holes: bb-[ROW]-[COL] -> e.g. Breadboard 10A
  if (nodeId.startsWith('bb-')) {
    const parts = nodeId.split('-');
    const row = parts[1];
    const col = parts[2];
    return `Breadboard ${col}${row}`;
  }

  // IC Pins: ic-[id]-pin-[p]
  if (nodeId.startsWith('ic-') && nodeId.includes('-pin-')) {
    const match = nodeId.match(/ic-(.+)-pin-(\d+)/);
    if (match) {
      const instanceId = match[1];
      const pinNum = parseInt(match[2], 10);
      const ic = placedICs?.find((i) => i.instanceId === `ic-${instanceId}` || i.instanceId === instanceId);
      if (ic) {
        const def = IC_DEFINITIONS[ic.icDefId];
        const pinDef = def?.pins.find((p) => p.number === pinNum);
        return `${def?.partNumber || 'IC'} Pin ${pinNum} (${pinDef?.name || ''})`;
      }
      return `IC Pin ${pinNum}`;
    }
  }

  if (nodeId.startsWith('led-')) {
    const num = nodeId.replace('led-', '');
    return `User LED ${num}`;
  }

  return nodeId;
}
