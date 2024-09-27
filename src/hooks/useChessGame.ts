import { useRef, useState, useEffect } from "react";
import { Chess, type Move as ChessMove, validateFen } from "chess.js";
import { updateStatus } from "@/lib/utils";

/**
 *
 * @param setStatus
 */
export function useChessGame(setStatus: (status: string) => void) {
  const boardRef = useRef<Required<JSX.IntrinsicElements["chess-board"]>>(null);
  const gameRef = useRef(new Chess());
  const [preMove, setPreMove] = useState<ChessMove | null>(null);

  // Initialize game state
  useEffect(() => {
    const board = boardRef.current;
    if (!board) return undefined;

    const game = gameRef.current;

    // Load game state from localStorage
    const savedFen = localStorage.getItem("savedGame");
    if (savedFen !== null && validateFen(savedFen).ok) {
      game.load(savedFen);
      board.setPosition(savedFen);
    } else {
      board.setPosition(game.fen());
    }

    // Initialize status
    updateStatus(game, setStatus);

    // Save game state on unload
    const handleUnload = () => {
      localStorage.setItem("savedGame", game.fen());
    };
    window.addEventListener("beforeunload", handleUnload);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [setStatus]);

  /**
   *
   */
  function resetGame() {
    boardRef.current?.setPosition("start");
    gameRef.current.reset();
    localStorage.removeItem("savedGame");
    updateStatus(gameRef.current, setStatus);
    setPreMove(null);
  }

  return {
    boardRef,
    gameRef,
    preMove,
    setPreMove,
    resetGame,
  };
}
