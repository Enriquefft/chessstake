import { useEffect, useRef } from "react";
import type { Square } from "@/lib/chess-types";
import type { Chess, Move } from "chess.js";
import {
  type DifficultyLevel,
  removePreMoveHighlights,
  updateStatus,
} from "@/lib/utils";

type StockfishHookProps = {
  gameRef: React.MutableRefObject<Chess>;
  boardRef: React.RefObject<
    Required<React.JSX.IntrinsicElements["chess-board"]>
  >;
  preMove: Move | null;
  setPreMove: React.Dispatch<React.SetStateAction<Move | null>>;
  setIsThinking: React.Dispatch<React.SetStateAction<boolean>>;
  setStatus: (status: string) => void;
  level: DifficultyLevel;
};

/**
 *
 * @param root0
 * @param root0.gameRef
 * @param root0.boardRef
 * @param root0.preMove
 * @param root0.setPreMove
 * @param root0.setIsThinking
 * @param root0.setStatus
 * @param root0.level
 */
export function useStockfish({
  gameRef,
  boardRef,
  preMove,
  setPreMove,
  setIsThinking,
  setStatus,
  level,
}: StockfishHookProps) {
  const stockfishRef = useRef<Worker | null>(null);
  const preMoveRef = useRef<Move | null>(preMove);

  useEffect(() => {
    preMoveRef.current = preMove;
  }, [preMove]);

  useEffect(() => {
    if (typeof Worker === "undefined") {
      throw new Error(
        "Web Workers are not supported in this environment. Please use a modern browser.",
      );
    }

    const stockfish = new Worker("/stockfish/stockfish.js");

    stockfishRef.current = stockfish;

    stockfish.postMessage("uci");

    if (level.skillLevel === undefined) {
      // Set UCI_LimitStrength and UCI_Elo
      stockfish.postMessage("setoption name UCI_LimitStrength value true");
      stockfish.postMessage(`setoption name UCI_Elo value ${level.elo}`);
    } else {
      // Set Skill Level
      stockfish.postMessage(
        `setoption name Skill Level value ${level.skillLevel}`,
      );
    }
    stockfish.onmessage = (event: MessageEvent<unknown>) => {
      const message = event.data;

      if (typeof message !== "string") {
        return;
      }

      if (!message.startsWith("bestmove")) {
        return;
      }

      setIsThinking(false);
      const [, bestMove] = message.split(" ");

      if (bestMove === undefined || bestMove === "(none)") {
        return;
      }

      const game = gameRef.current;
      const board = boardRef.current;

      if (!board) return;

      if (game.isGameOver()) {
        return;
      }
      game.move({
        from: bestMove.slice(0, 2) as Square,
        to: bestMove.slice(2, 4) as Square,
        promotion: "q",
      });
      board.setPosition(game.fen());
      updateStatus(game, setStatus);

      // After bot moves, check if user has a pre-move
      if (preMoveRef.current) {
        try {
          game.move(preMoveRef.current);

          board.setPosition(game.fen());
          updateStatus(game, setStatus);

          setPreMove(null);
          removePreMoveHighlights();

          if (game.isGameOver()) {
            return;
          }

          setIsThinking(true);
          stockfish.postMessage(`position fen ${game.fen()}`);
          stockfish.postMessage(`go depth ${level.depth ?? 1}`);
          // eslint-disable-next-line no-empty
        } catch {}
      }
    };

    // Cleanup on unmount
    return () => {
      if (stockfishRef.current) {
        stockfishRef.current.terminate();
      }
    };
  }, []);

  return {
    stockfishRef,
  };
}
