"use client";
import type { ChessBoardElement } from "chessboard-element";
import "chessboard-element";
import { useState, useRef, useEffect } from "react";

export default function PlayPage() {
  const [flipped, setFlipped] = useState(false);
  const boardRef = useRef<ChessBoardElement | null>(null);

  useEffect(() => {
    if (boardRef.current) {
      // Additional setup if needed
    }
  }, []);

  const flipBoard = () => {
    if (boardRef.current) {
      boardRef.current.flip();
      setFlipped(!flipped);
    }
  };

  const clearBoard = () => {
    if (boardRef.current) {
      boardRef.current.clear();
    }
  };

  const setStartPosition = () => {
    if (boardRef.current) {
      boardRef.current.setPosition("start");
    }
  };

  return (
    <div>
      <h1>&lt;chess-board&gt; and React</h1>
      <p>Here is &lt;chess-board&gt; inside a React app!</p>
      <chess-board
        orientation={flipped ? "black" : "white"}
        draggable-pieces
      ></chess-board>
      <button onClick={flipBoard}>Flip Board</button>
      <button onClick={clearBoard}>Clear Board</button>
      <button onClick={setStartPosition}>Start Position</button>
    </div>
  );
}
