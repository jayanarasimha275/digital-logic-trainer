import { CircuitSimState, PlacedIC, Wire } from '../types/circuit';
import { ExperimentDef } from '../types/experiment';
import { DEFAULT_LAYOUT, simulateCircuit } from './engine';

export interface ExperimentStepResult {
  testCaseId: string;
  label?: string;
  inputs: Record<string, number>;
  expected: Record<string, number>;
  actual: Record<string, number | string>;
  passed: boolean;
}

export interface ExperimentEvaluationResult {
  isSequential: boolean;
  passed: boolean;
  results: ExperimentStepResult[];
}

function parseChannelIndex(terminal: string | undefined): number | null {
  if (!terminal) return null;
  const match = terminal.trim().match(/^D(\d+)$/i);
  if (!match) return null;
  return parseInt(match[1], 10);
}

export function resolveExperimentVariant(exp: ExperimentDef, variantId?: string | null) {
  const variant =
    exp.variants && exp.variants.length > 0
      ? exp.variants.find((v) => v.id === variantId) || exp.variants[0]
      : null;

  return {
    variant,
    suggestedICs: variant?.suggestedICs ?? exp.suggestedICs,
    pinMapping: variant?.pinMapping ?? exp.pinMapping,
    truthTable: variant?.truthTable ?? exp.truthTable,
    sequentialTests: exp.sequentialTests,
    referenceCircuit: variant?.referenceCircuit ?? exp.referenceCircuit,
  };
}

/**
 * Single source of truth for evaluating any combinational or sequential experiment
 * against a wired breadboard circuit using the physical simulation engine.
 */
export function evaluateExperiment(
  exp: ExperimentDef,
  placedICs: PlacedIC[],
  wires: Wire[],
  baseInputStates?: boolean[],
  variantId?: string | null
): ExperimentEvaluationResult {
  const resolved = resolveExperimentVariant(exp, variantId);
  const inMap = resolved.pinMapping.inputNames;
  const outMap = resolved.pinMapping.outputNames;
  const results: ExperimentStepResult[] = [];

  const applyInputs = (inputs: Record<string, number>): boolean[] => {
    const arr = baseInputStates
      ? [...baseInputStates]
      : [false, false, false, false, false, false, false, false];
    for (const [inVar, bitVal] of Object.entries(inputs)) {
      const idx = parseChannelIndex(inMap[inVar]);
      if (idx !== null && idx >= 0 && idx < 8) {
        arr[idx] = bitVal === 1;
      }
    }
    return arr;
  };

  const evaluateOutputs = (
    expectedOutputs: Record<string, number>,
    simOutputStates: string[]
  ): { actualOutputs: Record<string, number | string>; pass: boolean } => {
    const actualOutputs: Record<string, number | string> = {};
    let pass = true;

    for (const [outVar, expectedBit] of Object.entries(expectedOutputs)) {
      const chIdx = parseChannelIndex(outMap[outVar]);
      if (chIdx !== null && chIdx >= 8 && chIdx <= 15) {
        const state = simOutputStates[chIdx - 8];
        const actualVal: number | string =
          state === 'HIGH' ? 1 : state === 'LOW' ? 0 : state || 'FLOATING';
        actualOutputs[outVar] = actualVal;
        if (actualVal !== expectedBit) {
          pass = false;
        }
      } else {
        actualOutputs[outVar] = 'UNMAPPED';
        pass = false;
      }
    }

    return { actualOutputs, pass };
  };

  if (resolved.sequentialTests && resolved.sequentialTests.length > 0) {
    let simState: CircuitSimState = { icStates: {} };

    for (const step of resolved.sequentialTests) {
      if (step.resetState) {
        simState = { icStates: {} };
      }

      const testInputs = applyInputs(step.inputs);
      const sim = simulateCircuit(
        placedICs,
        wires,
        { inputStates: testInputs, powerOn: true },
        DEFAULT_LAYOUT,
        simState
      );
      simState = sim.nextState;

      const { actualOutputs, pass } = evaluateOutputs(step.expectedOutputs, sim.outputStates);
      results.push({
        testCaseId: step.id,
        label: step.label,
        inputs: step.inputs,
        expected: step.expectedOutputs,
        actual: actualOutputs,
        passed: pass,
      });
    }

    return {
      isSequential: true,
      passed: results.length > 0 && results.every((r) => r.passed),
      results,
    };
  }

  for (const row of resolved.truthTable) {
    const testInputs = applyInputs(row.inputs);
    const sim = simulateCircuit(placedICs, wires, {
      inputStates: testInputs,
      powerOn: true,
    });

    const { actualOutputs, pass } = evaluateOutputs(row.expectedOutputs, sim.outputStates);
    results.push({
      testCaseId: row.id,
      inputs: row.inputs,
      expected: row.expectedOutputs,
      actual: actualOutputs,
      passed: pass,
    });
  }

  return {
    isSequential: false,
    passed: results.length > 0 && results.every((r) => r.passed),
    results,
  };
}
