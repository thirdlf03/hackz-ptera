import { Line } from "@react-three/drei";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import ChessPieces from "./ChessPieces";

import * as THREE from "three";
import type React from "react";

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
const Board: React.FC<BoardProps> = ({ className }) => {
  return (
    <Canvas className={className}>
      <OrbitControls />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} />
      <group rotation={[-Math.PI / 3, 0, 0]} scale={[1.5, 1, 1]}>
        <mesh>
          <planeGeometry args={[6, 6]} />
          <meshPhongMaterial color='rgba(173, 138, 41, 1)' />
        </mesh>
        <ChessLine />
        <ChessPieces />
      </group>
    </Canvas>
  );
};

export default Board;
