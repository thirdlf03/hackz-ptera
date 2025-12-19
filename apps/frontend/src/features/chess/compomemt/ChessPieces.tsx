import type { Piece, Position } from "@repo/schema";
import { Vector3 } from "three";

interface ChessPieceProps {
  piece: Piece;
}

const ChessPiece = ({ piece }: ChessPieceProps) => {
  const { position, color } = piece;
  const vectorPosition = new Vector3(position.x, position.y, position.z);
  const pieceColor = color === "white" ? "#f5f5dc" : "#4a3728";

  return (
    <mesh position={vectorPosition}>
      <boxGeometry args={[0.3, 0.3, 0.7]} />
      <meshStandardMaterial color={pieceColor} />
    </mesh>
  );
};

// ボード座標(0-7)からワールド座標へ変換
const squareSize = 0.6;
const boardToWorld = (col: number, row: number): Position => ({
  x: (col - 3.5) * squareSize,
  y: (row - 3.5) * squareSize,
  z: 0.35,
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
    pieces.push({ type, color: "white", position: boardToWorld(col, 0) });
  });
  for (let col = 0; col < 8; col++) {
    pieces.push({
      type: "pawn",
      color: "white",
      position: boardToWorld(col, 1),
    });
  }

  // 黒駒 (row 6, 7)
  for (let col = 0; col < 8; col++) {
    pieces.push({
      type: "pawn",
      color: "black",
      position: boardToWorld(col, 6),
    });
  }
  backRow.forEach((type, col) => {
    pieces.push({ type, color: "black", position: boardToWorld(col, 7) });
  });

  return pieces;
};

const ChessPieces = () => {
  const pieces = createInitialPieces();

  return (
    <>
      {pieces.map((piece, index) => (
        <ChessPiece key={`${piece.color}-${piece.type}-${index}`} piece={piece} />
      ))}
    </>
  );
};

export default ChessPieces;
