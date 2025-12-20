import { Vector3 } from "three";
import type { Piece } from "@repo/schema";

interface ChessPieceProps {
  piece: Piece;
}

// ポーン - シンプルな形
const Pawn = ({ color }: { color: string }) => (
  <group rotation={[Math.PI / 2, 0, 0]}>
    {/* 土台 */}
    <mesh position={[0, 0.05, 0]}>
      <cylinderGeometry args={[0.2, 0.22, 0.1, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
    {/* 胴体 */}
    <mesh position={[0, 0.25, 0]}>
      <cylinderGeometry args={[0.08, 0.15, 0.3, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
    {/* 頭 */}
    <mesh position={[0, 0.5, 0]}>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
  </group>
);

// ルーク - 城の形
const Rook = ({ color }: { color: string }) => (
  <group rotation={[Math.PI / 2, 0, 0]}>
    {/* 土台 */}
    <mesh position={[0, 0.05, 0]}>
      <cylinderGeometry args={[0.22, 0.24, 0.1, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
    {/* 胴体 */}
    <mesh position={[0, 0.3, 0]}>
      <cylinderGeometry args={[0.12, 0.18, 0.4, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
    {/* 城壁トップ */}
    <mesh position={[0, 0.55, 0]}>
      <cylinderGeometry args={[0.18, 0.14, 0.1, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
    {/* 城壁の凹凸 */}
    {[0, 90, 180, 270].map((angle) => (
      <mesh
        key={angle}
        position={[
          Math.cos((angle * Math.PI) / 180) * 0.12,
          0.65,
          Math.sin((angle * Math.PI) / 180) * 0.12,
        ]}
      >
        <boxGeometry args={[0.08, 0.1, 0.08]} />
        <meshStandardMaterial color={color} />
      </mesh>
    ))}
  </group>
);

// ナイト - 馬の形
const Knight = ({ color }: { color: string }) => (
  <group rotation={[Math.PI / 2, 0, 0]}>
    {/* 土台 */}
    <mesh position={[0, 0.05, 0]}>
      <cylinderGeometry args={[0.22, 0.24, 0.1, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
    {/* 首 */}
    <mesh position={[0, 0.35, -0.05]} rotation={[-0.3, 0, 0]}>
      <boxGeometry args={[0.15, 0.4, 0.25]} />
      <meshStandardMaterial color={color} />
    </mesh>
    {/* 頭 */}
    <mesh position={[0, 0.55, -0.15]} rotation={[-0.5, 0, 0]}>
      <boxGeometry args={[0.12, 0.15, 0.3]} />
      <meshStandardMaterial color={color} />
    </mesh>
    {/* 耳 */}
    <mesh position={[0.05, 0.65, -0.1]} rotation={[-0.3, 0, 0.2]}>
      <boxGeometry args={[0.04, 0.1, 0.06]} />
      <meshStandardMaterial color={color} />
    </mesh>
    <mesh position={[-0.05, 0.65, -0.1]} rotation={[-0.3, 0, -0.2]}>
      <boxGeometry args={[0.04, 0.1, 0.06]} />
      <meshStandardMaterial color={color} />
    </mesh>
  </group>
);

// ビショップ - 尖った帽子
const Bishop = ({ color }: { color: string }) => (
  <group rotation={[Math.PI / 2, 0, 0]}>
    {/* 土台 */}
    <mesh position={[0, 0.05, 0]}>
      <cylinderGeometry args={[0.22, 0.24, 0.1, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
    {/* 胴体 */}
    <mesh position={[0, 0.3, 0]}>
      <cylinderGeometry args={[0.1, 0.18, 0.4, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
    {/* 頭（尖った部分） */}
    <mesh position={[0, 0.55, 0]}>
      <coneGeometry args={[0.12, 0.25, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
    {/* てっぺんの球 */}
    <mesh position={[0, 0.72, 0]}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
  </group>
);

// クイーン - 王冠付き
const Queen = ({ color }: { color: string }) => (
  <group rotation={[Math.PI / 2, 0, 0]}>
    {/* 土台 */}
    <mesh position={[0, 0.05, 0]}>
      <cylinderGeometry args={[0.24, 0.26, 0.1, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
    {/* 胴体 */}
    <mesh position={[0, 0.35, 0]}>
      <cylinderGeometry args={[0.1, 0.2, 0.5, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
    {/* 王冠ベース */}
    <mesh position={[0, 0.65, 0]}>
      <cylinderGeometry args={[0.14, 0.1, 0.1, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
    {/* 王冠の尖り */}
    {[0, 72, 144, 216, 288].map((angle) => (
      <mesh
        key={angle}
        position={[
          Math.cos((angle * Math.PI) / 180) * 0.1,
          0.75,
          Math.sin((angle * Math.PI) / 180) * 0.1,
        ]}
      >
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
    ))}
    {/* てっぺんの球 */}
    <mesh position={[0, 0.8, 0]}>
      <sphereGeometry args={[0.06, 16, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
  </group>
);

// キング - 十字架付き
const King = ({ color }: { color: string }) => (
  <group rotation={[Math.PI / 2, 0, 0]}>
    {/* 土台 */}
    <mesh position={[0, 0.05, 0]}>
      <cylinderGeometry args={[0.24, 0.26, 0.1, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
    {/* 胴体 */}
    <mesh position={[0, 0.35, 0]}>
      <cylinderGeometry args={[0.1, 0.2, 0.5, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
    {/* 王冠ベース */}
    <mesh position={[0, 0.65, 0]}>
      <cylinderGeometry args={[0.12, 0.1, 0.1, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
    {/* 十字架（縦） */}
    <mesh position={[0, 0.8, 0]}>
      <boxGeometry args={[0.04, 0.2, 0.04]} />
      <meshStandardMaterial color={color} />
    </mesh>
    {/* 十字架（横） */}
    <mesh position={[0, 0.85, 0]}>
      <boxGeometry args={[0.12, 0.04, 0.04]} />
      <meshStandardMaterial color={color} />
    </mesh>
  </group>
);

// 駒のレンダリング
const ChooseFromSixPieces = ({ piece }: ChessPieceProps) => {
  const { position, color, type } = piece;
  const vectorPosition = new Vector3(position.x, position.y, position.z);
  const pieceColor = color === "white" ? "#f5f5dc" : "#4a3728";

  const PieceComponent = {
    pawn: Pawn,
    rook: Rook,
    knight: Knight,
    bishop: Bishop,
    queen: Queen,
    king: King,
  }[type];

  return (
    <group position={vectorPosition}>
      <PieceComponent color={pieceColor} />
    </group>
  );
};

export default ChooseFromSixPieces;
