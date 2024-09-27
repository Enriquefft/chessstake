"use client";
import "chessboard-element";
import { useEffect } from "react";
import type {
  DragStartEventDetail,
  DropEventDetail,
  MouseoverSquareEventDetail,
} from "@/lib/chess-types";

interface ChessBoardProps {
  boardRef: React.RefObject<Required<JSX.IntrinsicElements["chess-board"]>>;
  highlightStylesRef: React.MutableRefObject<HTMLStyleElement | null>;
  onDragStart: (e: CustomEvent<DragStartEventDetail>) => void;
  onDrop: (e: CustomEvent<DropEventDetail>) => void;
  onMouseoverSquare: (e: CustomEvent<MouseoverSquareEventDetail>) => void;
  onMouseoutSquare: () => void;
  onSnapEnd: () => void;
  draggablePieces: boolean;
}

const ChessBoard: React.FC<ChessBoardProps> = ({
  boardRef,
  highlightStylesRef,
  onDragStart,
  onDrop,
  onMouseoverSquare,
  onMouseoutSquare,
  onSnapEnd,
  draggablePieces,
}) => {
  useEffect(() => {
    const board = boardRef.current;
    if (!board) return undefined;

    // Create a style element for highlighting squares
    const highlightStyles = document.createElement("style");
    document.head.appendChild(highlightStyles);
    highlightStylesRef.current = highlightStyles;

    // Add event listeners
    board.addEventListener("drag-start", onDragStart as (e: Event) => void);
    board.addEventListener("drop", onDrop as (e: Event) => void);
    board.addEventListener(
      "mouseover-square",
      onMouseoverSquare as (e: Event) => void,
    );
    board.addEventListener(
      "mouseout-square",
      onMouseoutSquare as (e: Event) => void,
    );
    board.addEventListener("snap-end", onSnapEnd as (e: Event) => void);

    // Cleanup on unmount
    return () => {
      board.removeEventListener(
        "drag-start",
        onDragStart as (e: Event) => void,
      );
      board.removeEventListener("drop", onDrop as (e: Event) => void);
      board.removeEventListener(
        "mouseover-square",
        onMouseoverSquare as (e: Event) => void,
      );
      board.removeEventListener(
        "mouseout-square",
        onMouseoutSquare as (e: Event) => void,
      );
      board.removeEventListener("snap-end", onSnapEnd as (e: Event) => void);
      highlightStyles.remove();
    };
  }, [
    boardRef,
    highlightStylesRef,
    onDragStart,
    onDrop,
    onMouseoverSquare,
    onMouseoutSquare,
    onSnapEnd,
  ]);

  return (
    <chess-board
      class="mb-4 size-80 md:size-96"
      draggable-pieces={draggablePieces}
      position="start"
      ref={boardRef}
    ></chess-board>
  );
};

export default ChessBoard;
