import { Line, Loader } from "@react-three/drei";
import { OrbitControls } from "@react-three/drei";
import ChessPieces from "./ChessPieces";
import { Microphone } from "@/features/microphone";
import { useState } from "react";
import type { VoiceInput } from "@repo/schema";
import { useTurnStore } from "./store";
import Mark from "./Mark";

import * as THREE from "three";
import type React from "react";
// import { T } from "node_modules/vitest/dist/chunks/traces.d.402V_yFI";

interface BoardProps {
  className?: string;
}

function ChessLine() {
  const squares = [];
  const squareSize = 0.6; // 1マスのサイズ
  const borderColor = new THREE.Color(
    "rgba(228, 221, 209, 1)"
  ).convertSRGBToLinear();

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const isWhite = (row + col) % 2 === 0;
      const x = (col - 3.5) * squareSize;
      const y = (row - 3.5) * squareSize;

      squares.push({
        key: `${row}-${col}`,
        position: [x, y, 0.01] as [number, number, number],
        color: isWhite ? "rgba(248, 239, 201, 1)" : "rgba(153, 97, 41, 1)",
      });
    }
  }

  return (
    <>
      {squares.map((sq) => (
        <mesh key={sq.key} position={sq.position}>
          <planeGeometry args={[squareSize, squareSize]} />
          <meshStandardMaterial color={sq.color} />
        </mesh>
      ))}
      <Line
        points={[
          [-2.4, -2.4, 0.02],
          [2.4, -2.4, 0.02],
          [2.4, 2.4, 0.02],
          [-2.4, 2.4, 0.02],
          [-2.4, -2.4, 0.02],
        ]}
        color={borderColor} // THREE.Colorオブジェクトを渡す
        lineWidth={6}
      />
    </>
  );
}
const Board: React.FC<BoardProps> = ({}) => {
  const [commanddata, setCommanddata] = useState<VoiceInput | null>(null);
  const { turn } = useTurnStore();

  return (
    <>
      <OrbitControls />
      <Loader />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 6.5, 5]} />
      {turn == "white" && (
        <Microphone
          onTranscript={(text) => console.log("認識結果:", text)}
          onTransformSuccess={(data) => {
            console.log("親で変換成功データを取得:", data);
            setCommanddata({ piece: data.piece, from: data.from, to: data.to });
          }}
          onListeningChange={(listening) => console.log("録音中:", listening)}
          onError={(err) => console.error(err)}
          position={[3, 0.8, 1.8]}
        />
      )}
      {turn == "black" && (
        <Microphone
          onTranscript={(text) => console.log("認識結果:", text)}
          onTransformSuccess={(data) => {
            console.log("親で変換成功データを取得:", data);
            setCommanddata({ piece: data.piece, from: data.from, to: data.to });
          }}
          onListeningChange={(listening) => console.log("録音中:", listening)}
          onError={(err) => console.error(err)}
          position={[3, 0.8, 1.8]}
        />
      )}

      <group
        rotation={[-Math.PI / 5, 0, turn === "black" ? 3.15 : 0]}
        scale={[1.5, 1, 1]}
      >
        <mesh>
          <planeGeometry args={[6, 6]} />
          <Mark color={turn} />
          <meshPhongMaterial color='rgba(173, 138, 41, 1)' />
        </mesh>
        <ChessLine />
        <ChessPieces command={commanddata} />
      </group>
    </>
  );
};

export default Board;
