import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Chess } from "chess.js";

import { z } from "zod";
import type { Square } from "./chess-types";

/**
 * @param inputs - Class values to merge
 * @returns A tailwindcsj string of merged class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 *
 * @param highlightStyles
 */
export function removeGreySquares(highlightStyles: HTMLStyleElement) {
  highlightStyles.textContent = "";
}

/**
 *
 * @param highlightStyles
 * @param square
 */
export function greySquare(highlightStyles: HTMLStyleElement, square: Square) {
  const file = square.charCodeAt(0) - "a".charCodeAt(0);
  const rank = parseInt(square.charAt(1), 10) - 1;
  const isWhiteSquare = (file + rank) % 2 === 0;

  const whiteSquareGrey = "#a9a9a9";
  const blackSquareGrey = "#696969";
  const highlightColor = isWhiteSquare ? whiteSquareGrey : blackSquareGrey;

  highlightStyles.textContent += `
    chess-board::part(${square}) {
      background-color: ${highlightColor};
    }
  `;
}

/**
 *
 */
export function removePreMoveHighlights() {
  const preMoveStyles = document.getElementById("preMoveStyles");
  if (preMoveStyles) {
    preMoveStyles.remove();
  }
}

/**
 *
 * @param from
 * @param to
 */
export function highlightPreMoveSquares(from: Square, to: Square) {
  removePreMoveHighlights();

  const preMoveStyles = document.createElement("style");
  preMoveStyles.id = "preMoveStyles";
  document.head.appendChild(preMoveStyles);

  preMoveStyles.textContent += `
    chess-board::part(${from}) {
      background-color: rgba(0, 255, 0, 0.5);
    }
    chess-board::part(${to}) {
      background-color: rgba(0, 255, 0, 0.5);
    }
  `;
}

/**
 * @param game
 * @param setStatus
 */
export function updateStatus(game: Chess, setStatus: (status: string) => void) {
  let statusText = "";

  let moveColor = "White";
  if (game.turn() === "b") {
    moveColor = "Black";
  }

  if (game.isCheckmate()) {
    statusText = `Game over, ${moveColor} is in checkmate.`;
  } else if (game.isDraw()) {
    statusText = "Game over, drawn position";
  } else {
    statusText = `${moveColor} to move`;
    if (game.isCheck()) {
      statusText += `, ${moveColor} is in check`;
    }
  }

  setStatus(statusText);
}
export type DifficultyLevel = {
  skillLevel?: number; // Made optional
  depth?: number; // Made optional
  elo?: number; // Add elo property
};

const difficultyLevels = {
  baby: { elo: 200 },
  easy: { skillLevel: 1, depth: 5 },
  medium: { skillLevel: 10, depth: 10 },
  hard: { skillLevel: 20, depth: 15 },
} as const satisfies Record<string, DifficultyLevel>;

export const levels = ["baby", "easy", "medium", "hard"] as const;
const levelSchema = z.enum(levels);
/**
 * Gets the necessary stockfish configuration for a given level
 * @param level - The level of difficulty
 * @returns The stockfish configuration
 */
export function getLevel(level: string) {
  const parsedLevel = levelSchema.parse(level);
  return difficultyLevels[parsedLevel];
}
