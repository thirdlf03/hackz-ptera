import { Text3D } from "@react-three/drei";
// import { T } from "node_modules/vitest/dist/chunks/traces.d.402V_yFI";
// import { T } from "node_modules/vitest/dist/chunks/traces.d.402V_yFI";

const FONT_URL =
  "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json";

type MarkProps = {
  color: "white" | "black";
};

export default function Mark({ color }: MarkProps) {
  const isBlack = color === "black";

  // 黒の場合は180度回転
  const rotation: [number, number, number] = isBlack
    ? [0, Math.PI, 0]
    : [0, 0, 0];

  // 数字のY座標（2〜8）
  const numberPositions = [
    { num: "1", y: -2.25 },
    { num: "2", y: -1.65 },
    { num: "3", y: -1.05 },
    { num: "4", y: -0.45 },
    { num: "5", y: 0.15 },
    { num: "6", y: 0.73 },
    { num: "7", y: 1.3 },
    { num: "8", y: 1.9 },
  ];

  // アルファベットのX座標（A〜H）
  const letterPositions = [
    { letter: "A", x: -2.25 },
    { letter: "B", x: -1.6 },
    { letter: "C", x: -1.05 },
    { letter: "D", x: -0.42 },
    { letter: "E", x: 0.17 },
    { letter: "F", x: 0.78 },
    { letter: "G", x: 1.32 },
    { letter: "H", x: 1.93 },
  ];

  // 白: 左側に数字、下にアルファベット
  // 黒: 右側に数字、上にアルファベット（180度回転）
  const numberX = isBlack ? 2.5 : -2.8;
  const letterY = isBlack ? 2.52 : -2.87;

  return (
    <group rotation={rotation}>
      {/* 数字 2-8 */}
      {numberPositions.map(({ num, y }) => (
        <Text3D
          key={`num-${num}`}
          position={[numberX, y, 0.03]}
          size={0.35}
          height={0.05}
          font={FONT_URL}
        >
          {num}
          <meshStandardMaterial color={color} />
        </Text3D>
      ))}

      {/* アルファベット A-H */}
      {letterPositions.map(({ letter, x }) => (
        <Text3D
          key={`letter-${letter}`}
          position={[x, letterY, 0.03]}
          size={0.35}
          height={0.05}
          font={FONT_URL}
        >
          {letter}
          <meshStandardMaterial color={color} />
        </Text3D>
      ))}
    </group>
  );
}
