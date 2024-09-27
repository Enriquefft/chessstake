export type Square =
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  `${"a" | "b" | "c" | "d" | "e" | "f" | "g" | "h"}${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`;

export type Piece = string | false;

export type DragStartEventDetail = {
  source: Square;
  piece: string;
};

export type DropEventDetail = {
  source: Square;
  target?: Square | "offboard";
  setAction: (action: "snapback" | "trash" | "move") => void;
};

export type MouseoverSquareEventDetail = {
  square: Square;
  piece: Piece;
};

export type SnapbackEventDetail = {
  piece: Piece;
  square: Square;
  position: unknown;
};

export type SnapEndEventDetail = {
  source: Square;
};
