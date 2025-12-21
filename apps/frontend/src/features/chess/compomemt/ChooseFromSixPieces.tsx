import { Group, Vector3 } from "three";
import type { Piece } from "@repo/schema";
import { useAnimationStore, useTurnStore, useTextLocationStore } from "./store";
import { useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";

interface ChessPieceProps {
  piece: Piece;
}

function Pawn({ color }: { color: THREE.Color }) {
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh position={[0, 0.065, 0]}>
        <cylinderGeometry args={[0.2, 0.22, 0.13, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.325, 0]}>
        <cylinderGeometry args={[0.08, 0.15, 0.39, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.65, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

// ルーク
function Rook({ color }: { color: THREE.Color }) {
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh position={[0, 0.065, 0]}>
        <cylinderGeometry args={[0.22, 0.24, 0.13, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.39, 0]}>
        <cylinderGeometry args={[0.12, 0.18, 0.52, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.715, 0]}>
        <cylinderGeometry args={[0.18, 0.14, 0.13, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {[0, 90, 180, 270].map((angle) => (
        <mesh
          key={angle}
          position={[
            Math.cos((angle * Math.PI) / 180) * 0.12,
            0.845,
            Math.sin((angle * Math.PI) / 180) * 0.12,
          ]}
        >
          <boxGeometry args={[0.08, 0.13, 0.08]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}

// ナイト
function Knight({ color }: { color: THREE.Color }) {
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh position={[0, 0.065, 0]}>
        <cylinderGeometry args={[0.22, 0.24, 0.13, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.455, -0.05]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.15, 0.52, 0.25]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.715, -0.15]} rotation={[-0.5, 0, 0]}>
        <boxGeometry args={[0.12, 0.195, 0.3]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.05, 0.845, -0.1]} rotation={[-0.3, 0, 0.2]}>
        <boxGeometry args={[0.04, 0.13, 0.06]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.05, 0.845, -0.1]} rotation={[-0.3, 0, -0.2]}>
        <boxGeometry args={[0.04, 0.13, 0.06]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

// ビショップ
function Bishop({ color }: { color: THREE.Color }) {
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh position={[0, 0.065, 0]}>
        <cylinderGeometry args={[0.22, 0.24, 0.13, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.39, 0]}>
        <cylinderGeometry args={[0.1, 0.18, 0.52, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.715, 0]}>
        <coneGeometry args={[0.12, 0.325, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.936, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

// クイーン
function Queen({ color }: { color: THREE.Color }) {
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh position={[0, 0.065, 0]}>
        <cylinderGeometry args={[0.24, 0.26, 0.13, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.455, 0]}>
        <cylinderGeometry args={[0.1, 0.2, 0.65, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.845, 0]}>
        <cylinderGeometry args={[0.14, 0.1, 0.13, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {[0, 72, 144, 216, 288].map((angle) => (
        <mesh
          key={angle}
          position={[
            Math.cos((angle * Math.PI) / 180) * 0.1,
            0.975,
            Math.sin((angle * Math.PI) / 180) * 0.1,
          ]}
        >
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
      <mesh position={[0, 1.04, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

// キング
function King({ color }: { color: THREE.Color }) {
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh position={[0, 0.065, 0]}>
        <cylinderGeometry args={[0.24, 0.26, 0.13, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.455, 0]}>
        <cylinderGeometry args={[0.1, 0.2, 0.65, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.845, 0]}>
        <cylinderGeometry args={[0.12, 0.1, 0.13, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 1.04, 0]}>
        <boxGeometry args={[0.04, 0.26, 0.04]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 1.105, 0]}>
        <boxGeometry args={[0.12, 0.052, 0.04]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

// 駒のレンダリング
const ChooseFromSixPieces = ({ piece }: ChessPieceProps) => {
  const { position, color, type, id } = piece;
  const groupRef = useRef<Group>(null);
  const { animatingPiece, clearAnimation } = useAnimationStore();
  const { change: changeTurn } = useTurnStore();
  const { clearText } = useTextLocationStore();

  const threeColor = new THREE.Color(
    color === "white" ? "rgba(205, 188, 139, 1)" : "hsla(37, 68%, 24%, 1.00)",
  );

  // この駒がアニメーション対象かどうか
  const isAnimating = animatingPiece?.id === id;

  // アニメーション開始時に初期位置をセット
  useEffect(() => {
    if (isAnimating && animatingPiece && groupRef.current) {
      groupRef.current.position.set(
        animatingPiece.from.x!,
        animatingPiece.from.y!,
        animatingPiece.from.z!,
      );
    }
  }, [isAnimating, animatingPiece]);

  useFrame(() => {
    if (!groupRef.current) return;

    if (isAnimating && animatingPiece) {
      const target = new Vector3(animatingPiece.to.x, animatingPiece.to.y, animatingPiece.to.z);

      // 滑らかに移動（lerpの係数を調整で速度変更可能）
      groupRef.current.position.lerp(target, 0.04);

      // 目標位置に十分近づいたらアニメーション完了
      if (groupRef.current.position.distanceTo(target) < 0.01) {
        groupRef.current.position.copy(target); // 正確な位置にスナップ
        clearAnimation();
        clearText();
        changeTurn(); // ターン切り替え
      }
    }
  });

  const PieceComponent = {
    pawn: Pawn,
    rook: Rook,
    knight: Knight,
    bishop: Bishop,
    queen: Queen,
    king: King,
  }[type];

  return (
    <group ref={groupRef} position={[position.x!, position.y!, position.z!]}>
      <PieceComponent color={threeColor} />
    </group>
  );
};

export default ChooseFromSixPieces;
// ```

// ## 動作の流れ
// ```
// 1. 音声コマンド受信
// 2. MoveCommand で startAnimation(id, from, to) を呼ぶ
// 3. useAnimationStore に animatingPiece がセットされる
// 4. ChooseFromSixPieces で該当の駒が isAnimating = true になる
// 5. useEffect で初期位置（from）にセット
// 6. useFrame で毎フレーム lerp して目標位置（to）へ移動
// 7. 目標に到達したら clearAnimation() と changeTurn()
