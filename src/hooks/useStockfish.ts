import { useEffect, useRef } from "react";
import type { Square } from "@/lib/chess-types";
import type { Chess, Move as ChessMove } from "chess.js";
import {
  type DifficultyLevel,
  removePreMoveHighlights,
  updateStatus,
} from "@/lib/utils";

interface StockfishHookProps {
  gameRef: React.MutableRefObject<Chess>;
  boardRef: React.MutableRefObject<
    Required<JSX.IntrinsicElements["chess-board"]>
  >;
  preMove: ChessMove | null;
  setPreMove: React.Dispatch<React.SetStateAction<ChessMove | null>>;
  setIsThinking: React.Dispatch<React.SetStateAction<boolean>>;
  setStatus: (status: string) => void;
  level: DifficultyLevel;
}

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
  const preMoveRef = useRef<ChessMove | null>(preMove);

  useEffect(() => {
    preMoveRef.current = preMove;
  }, [preMove]);

  useEffect(() => {
    // Initialize Stockfish
    const stockfish =
      typeof Worker !== "undefined"
        ? new Worker("/stockfish/stockfish.js")
        : null;

    stockfishRef.current = stockfish;

    if (stockfish) {
      stockfish.postMessage("uci");

      if (level.elo !== undefined) {
        // Set UCI_LimitStrength and UCI_Elo
        stockfish.postMessage("setoption name UCI_LimitStrength value true");
        stockfish.postMessage(`setoption name UCI_Elo value ${level.elo}`);
      } else if (level.skillLevel !== undefined) {
        // Set Skill Level
        stockfish.postMessage(
          `setoption name Skill Level value ${level.skillLevel}`,
        );
      }

      stockfish.onmessage = (event: MessageEvent) => {
        const message = event.data;
        if (typeof message === "string" && message.startsWith("bestmove")) {
          setIsThinking(false);
          const bestMove = message.split(" ")[1];
          if (bestMove && bestMove !== "(none)") {
            const game = gameRef.current;
            const board = boardRef.current;

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
              const result = game.move(preMoveRef.current);
              if (result === null) {
                setPreMove(null);
                removePreMoveHighlights();
              } else {
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
              }
            }
          }
        }
      };
    } else {
      console.error("Web Workers are not supported in this environment.");
    }

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
