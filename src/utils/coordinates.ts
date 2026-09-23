import { BreadboardRow } from '../types/circuit';
import { circuitStore } from '../store/circuitStore';
import { IC_DEFINITIONS } from '../data/icDefinitions';

// Layout geometry constants for Digital Logic Trainer Board (in SVG units)
export const BB_GEOM = {
  numCols: 30,
  colPitch: 22,
  rowPitch: 18,
  startX: 135, // breadboard start X
  topPowerPlusY: 100,
  topPowerMinusY: 118,
  rowAY: 155,
  rowBY: 173,
  rowCY: 191,
  rowDY: 209,
  rowEY: 227,
  troughCenterY: 250, // Center DIP IC trough
  rowFY: 273,
  rowGY: 291,
  rowHY: 309,
  rowIY: 327,
  rowJY: 345,
  botPowerPlusY: 382,
  botPowerMinusY: 400,

  // Trainer Board dimensions
  boardWidth: 1160,
  boardHeight: 520,

  // DC Power Supply Station (left side)
  vccX: 52,
  vccY: 130,
  gndX: 52,
  gndY: 190,

  // Physical Digital I/O Terminals (right panel)
  dioInputsX: 855,
  dioInputsStartY: 104,
  dioInputsPitchY: 17,

  dioOutputsX: 855,
  dioOutputsStartY: 289,
  dioOutputsPitchY: 17,

  // Optional bottom strip (for ELVIS II compatibility)
  userLedsStartX: 480,
  userLedsPitch: 22,
  userLedsY: 458,
};

export function getRowY(row: BreadboardRow): number {
  switch (row) {
    case 'A': return BB_GEOM.rowAY;
    case 'B': return BB_GEOM.rowBY;
    case 'C': return BB_GEOM.rowCY;
    case 'D': return BB_GEOM.rowDY;
    case 'E': return BB_GEOM.rowEY;
    case 'F': return BB_GEOM.rowFY;
    case 'G': return BB_GEOM.rowGY;
    case 'H': return BB_GEOM.rowHY;
    case 'I': return BB_GEOM.rowIY;
    case 'J': return BB_GEOM.rowJY;
  }
}

export function getColX(col: number): number {
  return BB_GEOM.startX + (col - 1) * BB_GEOM.colPitch;
}

export function getHoleCoordinates(holeId: string): { x: number; y: number } | null {
  if (!holeId) return null;

  // Breadboard tie-points: bb-[ROW]-[COL]
  if (holeId.startsWith('bb-')) {
    const parts = holeId.split('-');
    const row = parts[1] as BreadboardRow;
    const col = parseInt(parts[2], 10);
    return {
      x: getColX(col),
      y: getRowY(row),
    };
  }

  // Top power rails
  if (holeId.startsWith('top-power-plus-')) {
    const col = parseInt(holeId.replace('top-power-plus-', ''), 10);
    return { x: getColX(col), y: BB_GEOM.topPowerPlusY };
  }
  if (holeId.startsWith('top-power-minus-')) {
    const col = parseInt(holeId.replace('top-power-minus-', ''), 10);
    return { x: getColX(col), y: BB_GEOM.topPowerMinusY };
  }

  // Bottom power rails
  if (holeId.startsWith('bot-power-plus-')) {
    const col = parseInt(holeId.replace('bot-power-plus-', ''), 10);
    return { x: getColX(col), y: BB_GEOM.botPowerPlusY };
  }
  if (holeId.startsWith('bot-power-minus-')) {
    const col = parseInt(holeId.replace('bot-power-minus-', ''), 10);
    return { x: getColX(col), y: BB_GEOM.botPowerMinusY };
  }

  // DC Power Supplies (+5V, GND)
  if (holeId === 'vcc-src' || holeId === '+5v' || holeId === 'p5v') {
    return { x: BB_GEOM.vccX, y: BB_GEOM.vccY };
  }
  if (holeId === 'gnd-src' || holeId === 'ground' || holeId === 'gnd') {
    return { x: BB_GEOM.gndX, y: BB_GEOM.gndY };
  }

  // Digital Input Terminals: D0 - D7
  if (holeId.startsWith('d') && !holeId.includes('-')) {
    const num = parseInt(holeId.replace('d', ''), 10);
    if (num >= 0 && num <= 7) {
      return {
        x: BB_GEOM.dioInputsX,
        y: BB_GEOM.dioInputsStartY + num * BB_GEOM.dioInputsPitchY,
      };
    }
    if (num >= 8 && num <= 15) {
      return {
        x: BB_GEOM.dioOutputsX,
        y: BB_GEOM.dioOutputsStartY + (num - 8) * BB_GEOM.dioOutputsPitchY,
      };
    }
  }

  // DIO aliases (dio-0 .. dio-15)
  if (holeId.startsWith('dio-')) {
    const num = parseInt(holeId.replace('dio-', ''), 10);
    if (num >= 0 && num <= 7) {
      return {
        x: BB_GEOM.dioInputsX,
        y: BB_GEOM.dioInputsStartY + num * BB_GEOM.dioInputsPitchY,
      };
    }
    if (num >= 8 && num <= 15) {
      return {
        x: BB_GEOM.dioOutputsX,
        y: BB_GEOM.dioOutputsStartY + (num - 8) * BB_GEOM.dioOutputsPitchY,
      };
    }
  }

  // Direct IC Pin connection: ic-[instanceId]-pin-[p]
  if (holeId.startsWith('ic-') && holeId.includes('-pin-')) {
    const match = holeId.match(/ic-(.+)-pin-(\d+)/);
    if (match) {
      const fullInstanceId = `ic-${match[1]}`;
      const pinNum = parseInt(match[2], 10);
      const state = circuitStore.getState();
      const ic = state.placedICs.find((i) => i.instanceId === fullInstanceId || i.instanceId === match[1]);
      if (ic) {
        const def = IC_DEFINITIONS[ic.icDefId];
        if (def) {
          const half = def.pinCount / 2;
          if (pinNum <= half) {
            const col = ic.startCol + (pinNum - 1);
            return { x: getColX(col), y: BB_GEOM.rowFY - 4 };
          } else {
            const col = ic.startCol + (def.pinCount - pinNum);
            return { x: getColX(col), y: BB_GEOM.rowEY + 4 };
          }
        }
      }
    }
  }

  // User LEDs (LED 0 - LED 7 on board)
  if (holeId.startsWith('led-')) {
    const num = parseInt(holeId.replace('led-', ''), 10);
    if (num >= 0 && num <= 7) {
      return {
        x: BB_GEOM.userLedsStartX + num * BB_GEOM.userLedsPitch,
        y: BB_GEOM.userLedsY,
      };
    }
  }

  return null;
}
