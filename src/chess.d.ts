/* eslint-disable @typescript-eslint/consistent-type-imports */
declare namespace JSX {
  interface IntrinsicElements {
    "chess-board": Partial<import("chessboard-element").ChessBoardElement> & {
      ref?: MutableRefObject<import("chessboard-element").ChessBoardElement>;
    };
  }
}
