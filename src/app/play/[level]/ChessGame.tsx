/* eslint-disable max-lines */
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
import type { Chess, Move as ChessMove } from "chess.js";
import {
  type DifficultyLevel,
  updateStatus,
  greySquare,
  removeGreySquares,
  highlightPreMoveSquares,
  removePreMoveHighlights,
} from "@/lib/utils";
import { resetLastMatch } from "@/lib/user";
import { updateMatch } from "@/lib/matches";
import { ClipboardIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import WhatsappButton from "@/components/WhatsappSubmit";
import { buildWhatsappLink } from "@/lib/whatsapp";
const COPIED_SIGN_WAIT = 2000;

/**
 *
 * @param root0
 * @param root0.level
 * @param root0.matchId
 */
export default function ChessGame({
  level,
  matchId,
}: {
  level: DifficultyLevel;
  matchId: number;
}) {
  const [status, setStatus] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [gameResult, setGameResult] = useState<"win" | "lose" | "draw" | null>(
    null,
  );
  const [copied, setCopied] = useState(false);

  const highlightStylesRef = useRef<HTMLStyleElement | null>(null);

  /**
   *
   * @param game
   */
  async function setMatchFinished(game: Chess) {
    // Determine the result
    if (game.isCheckmate()) {
      const winner = game.turn() === "w" ? "black" : "white";
      setGameResult(winner === "white" ? "win" : "lose");
    } else if (game.isDraw()) {
      setGameResult("draw");
    } else {
      setGameResult(null);
    }

    // Reset user's last match
    await resetLastMatch();

    // Update the stored match information
    await updateMatch(
      matchId,
      game.pgn(),
      // White won?
      game.isCheckmate() && game.turn() === "w",
    );

    // Open the dialog after updating the match
    setIsDialogOpen(true);
  }

  const { boardRef, gameRef, preMove, setPreMove } = useChessGame(
    setStatus,
    setMatchFinished,
  );

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

  // Copy to clipboard handler
  const copyMatchId = async () => {
    await navigator.clipboard.writeText(matchId.toString()).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, COPIED_SIGN_WAIT);
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-gray-200 to-gray-100 p-6">
      <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-lg">
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
        <div className="mb-4 flex flex-col items-center">
          <div
            className={`mb-2 text-xl font-semibold ${
              gameRef.current.isGameOver() ? "text-red-600" : "text-gray-800"
            }`}
          >
            {status}
          </div>
          {isThinking && (
            <div className="mb-4 flex items-center text-blue-600">
              <svg
                className="mr-2 size-6 animate-spin text-blue-600"
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
        </div>
        {/* Copiable Match ID */}
        <div className="mt-4 flex items-center justify-center rounded-lg bg-gray-50 p-4 shadow-inner">
          <span className="mr-2 text-gray-700">Match ID:</span>
          <code className="rounded-md bg-gray-200 px-2 py-1 font-mono text-sm">
            {matchId}
          </code>
          <button
            onClick={copyMatchId}
            className="ml-3 rounded-md bg-blue-500 p-2 text-white transition-colors hover:bg-blue-600"
            aria-label="Copy Match ID"
          >
            <ClipboardIcon className="size-5" />
          </button>
          {copied && (
            <span className="ml-2 text-sm text-green-500">Copied!</span>
          )}
        </div>
        {/* Result Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger></DialogTrigger>{" "}
          {/* Empty trigger since we control it programmatically */}
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {gameResult === "win"
                  ? "Congratulations!"
                  : "Better Luck Next Time!"}
              </DialogTitle>
              <DialogDescription>
                {gameResult === "win" && "You have won the match! "}
                {gameResult === "lose" && "You have lost the match. "}
                {gameResult === "draw" && "The match ended in a draw. "}
                Please contact{" "}
                <WhatsappButton
                  onClick={() => {
                    window.open(
                      buildWhatsappLink(
                        "+51 984724707",
                        `Hola, he finalizado mi partida de ajedrez con el ID ${matchId} y el resultado es: ${gameResult}.`,
                      ),
                    );
                  }}
                >
                  +51 984724707
                </WhatsappButton>
                and send your Match ID <strong>{matchId}</strong> along with the
                result of the match.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
