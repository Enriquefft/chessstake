/* eslint-disable @typescript-eslint/consistent-type-imports */
declare namespace JSX {
  interface IntrinsicElements {
    "chess-board": Omit<
      Partial<import("chessboard-element").ChessBoardElement>,
      "position"
    > & {
      ref?: MutableRefObject<import("chessboard-element").ChessBoardElement>;
      position?: import("chessboard-element").Position;
    };
  }
}
