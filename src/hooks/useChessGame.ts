"use client";
import { useRef, useState, useEffect } from "react";
import { Chess, type Move as ChessMove } from "chess.js";
import { updateStatus } from "@/lib/utils";
import { getUserFen, storeUserFen } from "@/lib/user";

/**
 *
 * @param setStatus
 * @param onGameFinish
 */
export function useChessGame(
  setStatus: (status: string) => void,
  onGameFinish: (game: Chess) => Promise<void>,
) {
  const boardRef =
    useRef<Required<React.JSX.IntrinsicElements["chess-board"]>>(null);
  const gameRef = useRef(new Chess());
  const [preMove, setPreMove] = useState<ChessMove | null>(null);

  // Initialize game state
  useEffect(() => {
    const board = boardRef.current;
    if (!board) return undefined;

    const game = gameRef.current;

    // Load game state from localStorage
    getUserFen()
      .then((fen) => {
        if (fen === undefined) {
          board.setPosition(game.fen());
        } else {
          game.load(fen);
          board.setPosition(fen);
        }
      })
      .catch(() => {
        board.setPosition(game.fen());
      });

    // Initialize status
    updateStatus(game, setStatus);

    // Save game state on unload
    const handleUnload = async () => {
      await storeUserFen(game.fen());
    };
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    window.addEventListener("beforeunload", handleUnload);

    // Cleanup on unmount
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [setStatus]);

  useEffect(() => {
    if (gameRef.current.isGameOver()) {
      onGameFinish(gameRef.current).catch((error: unknown) => {
        console.error(error);
      });
    }
  }, [setStatus, onGameFinish]); // Dependency on status update for the hook to recheck game over

  return {
    boardRef,
    gameRef,
    preMove,
    setPreMove,
  };
}
