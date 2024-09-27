"use client";
import { useState, useRef } from "react";
import type {
  Square,
  DragStartEventDetail,
  DropEventDetail,
  MouseoverSquareEventDetail,
  SnapEndEventDetail,
} from "@/lib/chess-types";
import { useChessGame } from "@/hooks/useChessGame";
import { useStockfish } from "@/hooks/useStockfish";
import ChessBoard from "@/components/ChessBoard";
import type { Move as ChessMove } from "chess.js";
import {
  type DifficultyLevel,
  updateStatus,
  greySquare,
  removeGreySquares,
  highlightPreMoveSquares,
  removePreMoveHighlights,
} from "@/lib/utils";

/**
 *
 * @param root0
 * @param root0.level
 */
export default function ChessGame({ level }: { level: DifficultyLevel }) {
  const [status, setStatus] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const highlightStylesRef = useRef<HTMLStyleElement | null>(null);

  const { boardRef, gameRef, preMove, setPreMove, resetGame } =
    useChessGame(setStatus);

  const { stockfishRef } = useStockfish({
    gameRef,
    boardRef,
    preMove,
    setPreMove,
    setIsThinking,
    setStatus,
    level,
  });

  // Event handlers
  /**
   *
   * @param event
   */
  function onDragStart(event: CustomEvent<DragStartEventDetail>) {
    const { piece } = event.detail;

    // Do not pick up pieces if the game is over
    if (gameRef.current.isGameOver()) {
      event.preventDefault();
      return;
    }

    // Only pick up pieces for white
    if (piece.startsWith("b")) {
      event.preventDefault();
    }
  }

  /**
   *
   * @param event
   */
  function onDrop(event: CustomEvent<DropEventDetail>) {
    const { source, target, setAction } = event.detail;

    const highlightStyles = highlightStylesRef.current;
    if (highlightStyles) removeGreySquares(highlightStyles);

    if (target === "offboard" || target === undefined) {
      setAction("snapback");
      return;
    }

    if (source === target) {
      setAction("snapback");
      return;
    }

    try {
      const move = {
        from: source,
        to: target,
        promotion: "q",
      } as ChessMove;

      if (gameRef.current.turn() === "w") {
        gameRef.current.move(move);

        boardRef.current!.setPosition(gameRef.current.fen());

        updateStatus(gameRef.current, setStatus);

        if (gameRef.current.isGameOver()) {
          return;
        }

        if (stockfishRef.current) {
          setIsThinking(true);
          stockfishRef.current.postMessage(
            `position fen ${gameRef.current.fen()}`,
          );
          stockfishRef.current.postMessage(`go depth ${level.depth ?? 1}`);
        }
      } else {
        removePreMoveHighlights();
        setPreMove(move);
        setAction("snapback");

        highlightPreMoveSquares(move.from, move.to);
      }
    } catch {
      setAction("snapback");
    }
  }

  /**
   *
   * @param event
   */
  function onMouseoverSquare(event: CustomEvent<MouseoverSquareEventDetail>) {
    const { square } = event.detail;

    const moves = gameRef.current.moves({
      square,
      verbose: true,
    });

    if (moves.length === 0) {
      return;
    }

    const highlightStyles = highlightStylesRef.current;
    if (highlightStyles) {
      greySquare(highlightStyles, square);
      for (const move of moves) {
        greySquare(highlightStyles, move.to as Square);
      }
    }
  }

  /**
   *
   */
  function onMouseoutSquare() {
    const highlightStyles = highlightStylesRef.current;
    if (highlightStyles) {
      removeGreySquares(highlightStyles);
    }
  }

  /**
   *
   * @param event
   */
  function onSnapEnd(event: CustomEvent<SnapEndEventDetail>) {
    // Do nothing
    console.log("onSnapEnd");
    console.log(event);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="rounded bg-white p-4 shadow-md">
        <ChessBoard
          boardRef={boardRef}
          highlightStylesRef={highlightStylesRef}
          onDragStart={onDragStart}
          onDrop={onDrop}
          onMouseoverSquare={onMouseoverSquare}
          onMouseoutSquare={onMouseoutSquare}
          onSnapEnd={onSnapEnd}
          draggablePieces={!isThinking} // Disable dragging when AI is thinking
        />
        <div className="flex flex-col items-center">
          <div
            className={`mb-2 text-lg font-semibold ${
              gameRef.current.isGameOver() ? "text-red-600" : "text-black"
            }`}
          >
            {status}
          </div>
          {isThinking && (
            <div className="mb-4 flex items-center text-blue-600">
              <svg
                className="mr-2 size-5 animate-spin text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              Chessstake is thinking...
            </div>
          )}
          <button
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={() => {
              resetGame();
              setIsThinking(false);
              removePreMoveHighlights();
            }}
          >
            Restart Game
          </button>
        </div>
      </div>
    </div>
  );
}
