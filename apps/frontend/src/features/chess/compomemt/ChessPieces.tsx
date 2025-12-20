import type { Piece, Position } from "@repo/schema";
import ChooseFromSixPieces from "./ChooseFromSixPieces";

// ボード座標(0-7)からワールド座標へ変換
const squareSize = 0.6;
const boardToWorld = (col: number, row: number): Position => ({
  x: (col - 3.5) * squareSize,
  y: (row - 3.5) * squareSize,
  z: 0.03,
});

const createInitialPieces = (): Piece[] => {
  const backRow: Piece["type"][] = [
    "rook",
    "knight",
    "bishop",
    "queen",
    "king",
    "bishop",
    "knight",
    "rook",
  ];

  const pieces: Piece[] = [];

  // 白駒 (row 0, 1)
  backRow.forEach((type, col) => {
    pieces.push({ id: col, exist: true, type, color: "white", position: boardToWorld(col, 0) });
  });
  for (let col = 0; col < 8; col++) {
    pieces.push({
      id: 8 + col,
      exist: true,
      type: "pawn",
      color: "white",
      position: boardToWorld(col, 1),
    });
  }

  // 黒駒 (row 6, 7)
  for (let col = 0; col < 8; col++) {
    pieces.push({
      id: 16 + col,
      exist: true,
      type: "pawn",
      color: "black",
      position: boardToWorld(col, 6),
    });
  }
  backRow.forEach((type, col) => {
    pieces.push({
      id: 24 + col,
      exist: true,
      type,
      color: "black",
      position: boardToWorld(col, 7),
    });
  });

  return pieces;
};

const ChessPieces = () => {
  const pieces = createInitialPieces();

  return (
    <>
      {pieces.map((piece, index) => (
        <ChooseFromSixPieces key={`${piece.color}-${piece.type}-${index}`} piece={piece} />
      ))}
    </>
  );
};

export default ChessPieces;
