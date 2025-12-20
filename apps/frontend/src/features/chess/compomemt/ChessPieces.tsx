import type { Piece, Position } from "@repo/schema";
import ChooseFromSixPieces from "./ChooseFromSixPieces";
import { useEffect, useState } from "react";
import type { VoiceInput } from "@repo/schema";
import { useAnimationStore } from "./store";

const squareSize = 0.6;
const boardToWorld = (col: number, row: number): Position => ({
  x: Math.round((col - 3.5) * squareSize * 10) / 10,
  y: Math.round((row - 3.5) * squareSize * 10) / 10,
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
    pieces.push({
      id: col,
      exist: true,
      type,
      color: "white",
      position: boardToWorld(col, 0),
    });
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

const vectors = new Map<string, Position>([
  ["A1", { x: -2.1, y: -2.1, z: 0.03 }],
  ["A2", { x: -2.1, y: -1.5, z: 0.03 }],
  ["A3", { x: -2.1, y: -0.9, z: 0.03 }],
  ["A4", { x: -2.1, y: -0.3, z: 0.03 }],
  ["A5", { x: -2.1, y: 0.3, z: 0.03 }],
  ["A6", { x: -2.1, y: 0.9, z: 0.03 }],
  ["A7", { x: -2.1, y: 1.5, z: 0.03 }],
  ["A8", { x: -2.1, y: 2.1, z: 0.03 }],
  ["B1", { x: -1.5, y: -2.1, z: 0.03 }],
  ["B2", { x: -1.5, y: -1.5, z: 0.03 }],
  ["B3", { x: -1.5, y: -0.9, z: 0.03 }],
  ["B4", { x: -1.5, y: -0.3, z: 0.03 }],
  ["B5", { x: -1.5, y: 0.3, z: 0.03 }],
  ["B6", { x: -1.5, y: 0.9, z: 0.03 }],
  ["B7", { x: -1.5, y: 1.5, z: 0.03 }],
  ["B8", { x: -1.5, y: 2.1, z: 0.03 }],
  ["C1", { x: -0.9, y: -2.1, z: 0.03 }],
  ["C2", { x: -0.9, y: -1.5, z: 0.03 }],
  ["C3", { x: -0.9, y: -0.9, z: 0.03 }],
  ["C4", { x: -0.9, y: -0.3, z: 0.03 }],
  ["C5", { x: -0.9, y: 0.3, z: 0.03 }],
  ["C6", { x: -0.9, y: 0.9, z: 0.03 }],
  ["C7", { x: -0.9, y: 1.5, z: 0.03 }],
  ["C8", { x: -0.9, y: 2.1, z: 0.03 }],
  ["D1", { x: -0.3, y: -2.1, z: 0.03 }],
  ["D2", { x: -0.3, y: -1.5, z: 0.03 }],
  ["D3", { x: -0.3, y: -0.9, z: 0.03 }],
  ["D4", { x: -0.3, y: -0.3, z: 0.03 }],
  ["D5", { x: -0.3, y: 0.3, z: 0.03 }],
  ["D6", { x: -0.3, y: 0.9, z: 0.03 }],
  ["D7", { x: -0.3, y: 1.5, z: 0.03 }],
  ["D8", { x: -0.3, y: 2.1, z: 0.03 }],
  ["E1", { x: 0.3, y: -2.1, z: 0.03 }],
  ["E2", { x: 0.3, y: -1.5, z: 0.03 }],
  ["E3", { x: 0.3, y: -0.9, z: 0.03 }],
  ["E4", { x: 0.3, y: -0.3, z: 0.03 }],
  ["E5", { x: 0.3, y: 0.3, z: 0.03 }],
  ["E6", { x: 0.3, y: 0.9, z: 0.03 }],
  ["E7", { x: 0.3, y: 1.5, z: 0.03 }],
  ["E8", { x: 0.3, y: 2.1, z: 0.03 }],
  ["F1", { x: 0.9, y: -2.1, z: 0.03 }],
  ["F2", { x: 0.9, y: -1.5, z: 0.03 }],
  ["F3", { x: 0.9, y: -0.9, z: 0.03 }],
  ["F4", { x: 0.9, y: -0.3, z: 0.03 }],
  ["F5", { x: 0.9, y: 0.3, z: 0.03 }],
  ["F6", { x: 0.9, y: 0.9, z: 0.03 }],
  ["F7", { x: 0.9, y: 1.5, z: 0.03 }],
  ["F8", { x: 0.9, y: 2.1, z: 0.03 }],
  ["G1", { x: 1.5, y: -2.1, z: 0.03 }],
  ["G2", { x: 1.5, y: -1.5, z: 0.03 }],
  ["G3", { x: 1.5, y: -0.9, z: 0.03 }],
  ["G4", { x: 1.5, y: -0.3, z: 0.03 }],
  ["G5", { x: 1.5, y: 0.3, z: 0.03 }],
  ["G6", { x: 1.5, y: 0.9, z: 0.03 }],
  ["G7", { x: 1.5, y: 1.5, z: 0.03 }],
  ["G8", { x: 1.5, y: 2.1, z: 0.03 }],
  ["H1", { x: 2.1, y: -2.1, z: 0.03 }],
  ["H2", { x: 2.1, y: -1.5, z: 0.03 }],
  ["H3", { x: 2.1, y: -0.9, z: 0.03 }],
  ["H4", { x: 2.1, y: -0.3, z: 0.03 }],
  ["H5", { x: 2.1, y: 0.3, z: 0.03 }],
  ["H6", { x: 2.1, y: 0.9, z: 0.03 }],
  ["H7", { x: 2.1, y: 1.5, z: 0.03 }],
  ["H8", { x: 2.1, y: 2.1, z: 0.03 }],
]);

function LinkVoiceAndId(
  pieces: Piece[],
  command: VoiceInput | null
): [Piece["id"], Position | null] {
  if (!command) return [-1, null];

  const location = command.from?.toUpperCase();
  const toLocation = command.to?.toUpperCase();

  if (!location || !toLocation) return [-1, null];

  const fromPosition = vectors.get(location);
  const toPosition = vectors.get(toLocation);

  if (!fromPosition || !toPosition) {
    console.log("無効な位置です");
    return [-1, null];
  }

  const piece = pieces.find(
    (p) =>
      p.position.x === fromPosition.x &&
      p.position.y === fromPosition.y &&
      p.position.z === fromPosition.z
  );

  if (!piece) {
    console.log("そこに駒はありません");
    return [-1, null];
  }

  return [piece.id, toPosition];
}

function MoveCommand(
  pieces: Piece[],
  command: VoiceInput | null,
  startAnimation: (id: number, from: Position, to: Position) => void
): Piece[] {
  const [pieceID, toPosition] = LinkVoiceAndId(pieces, command);

  if (pieceID === -1 || !toPosition) return pieces;

  return pieces.map((piece) => {
    if (piece.id === pieceID) {
      // アニメーション開始
      startAnimation(piece.id, piece.position, toPosition);

      return {
        ...piece,
        position: toPosition,
      };
    }
    return piece;
  });
}


const ChessPieces = ({ command }: { command: VoiceInput | null }) => {
  const [pieces, setPieces] = useState(createInitialPieces());
  const { startAnimation } = useAnimationStore();

  useEffect(() => {
    if (command) {
      setPieces((prev) => MoveCommand(prev, command, startAnimation));
    }
  }, [command, startAnimation]);

  return (
    <>
      {pieces.map((piece) => (
        <ChooseFromSixPieces key={piece.id} piece={piece} />
      ))}
    </>
  );
};

export default ChessPieces;
