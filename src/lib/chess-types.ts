export type Square =
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  `${"a" | "b" | "c" | "d" | "e" | "f" | "g" | "h"}${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`;

export type Piece = string | false;

export interface DragStartEventDetail {
  source: Square;
  piece: string;
}

export interface DropEventDetail {
  source: Square;
  target?: Square | "offboard";
  setAction: (action: "snapback" | "trash" | "move") => void;
}

export interface MouseoverSquareEventDetail {
  square: Square;
  piece: Piece;
}
