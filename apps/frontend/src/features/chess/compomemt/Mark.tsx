import { Text3D } from "@react-three/drei";

const FONT_URL =
  "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json";

export default function Mark({ color }: { color: string }) {
  const isBlack = color === "black";

  // 黒は Z軸で180度回転（文字を正しい向きに）
  const rotation: [number, number, number] = isBlack
    ? [0, 0, Math.PI]
    : [0, 0, 0];

  // 白側の数字（左側、1が下）
  const whiteNumbers = [
    { num: "1", position: [-2.8, -2.25, 0.03] },
    { num: "2", position: [-2.8, -1.65, 0.03] },
    { num: "3", position: [-2.8, -1.05, 0.03] },
    { num: "4", position: [-2.8, -0.45, 0.03] },
    { num: "5", position: [-2.8, 0.15, 0.03] },
    { num: "6", position: [-2.8, 0.73, 0.03] },
    { num: "7", position: [-2.8, 1.3, 0.03] },
    { num: "8", position: [-2.8, 1.97, 0.03] },
  ];

  // 黒側の数字（右側）- 黒から見て8が下、1が上になるように
  const blackNumbers = [
    { num: "8", position: [2.82, -1.93, 0.03] },
    { num: "7", position: [2.82, -1.33, 0.03] },
    { num: "6", position: [2.82, -0.74, 0.03] },
    { num: "5", position: [2.82, -0.1, 0.03] },
    { num: "4", position: [2.82, 0.5, 0.03] },
    { num: "3", position: [2.82, 1.08, 0.03] },
    { num: "2", position: [2.82, 1.72, 0.03] },
    { num: "1", position: [2.82, 2.33, 0.03] },
  ];

  // 白側のアルファベット（下側、AからH）
  const whiteLetters = [
    { letter: "A", position: [-2.25, -2.87, 0.03] },
    { letter: "B", position: [-1.63, -2.87, 0.03] },
    { letter: "C", position: [-1.05, -2.87, 0.03] },
    { letter: "D", position: [-0.43, -2.87, 0.03] },
    { letter: "E", position: [0.17, -2.87, 0.03] },
    { letter: "F", position: [0.78, -2.87, 0.03] },
    { letter: "G", position: [1.32, -2.87, 0.03] },
    { letter: "H", position: [1.93, -2.87, 0.03] },
  ];

  // 黒側のアルファベット（上側）- 黒から見てAが左、Hが右になるように
  const blackLetters = [
    { letter: "H", position: [-1.93, 2.9, 0.03] },
    { letter: "G", position: [-1.3, 2.9, 0.03] },
    { letter: "F", position: [-0.8, 2.9, 0.03] },
    { letter: "E", position: [-0.2, 2.9, 0.03] },
    { letter: "D", position: [0.41, 2.9, 0.03] },
    { letter: "C", position: [1.05, 2.9, 0.03] },
    { letter: "B", position: [1.6, 2.9, 0.03] },
    { letter: "A", position: [2.2, 2.9, 0.03] },
  ];

  const numbers = isBlack ? blackNumbers : whiteNumbers;
  const letters = isBlack ? blackLetters : whiteLetters;

  return (
    <group>
      {/* 数字 */}
      {numbers.map(({ num, position }) => (
        <Text3D
          key={`num-${num}-${color}`}
          position={position as [number, number, number]}
          rotation={rotation}
          size={0.35}
          height={0.05}
          font={FONT_URL}
        >
          {num}
          <meshStandardMaterial color={color} />
        </Text3D>
      ))}

      {/* アルファベット */}
      {letters.map(({ letter, position }) => (
        <Text3D
          key={`letter-${letter}-${color}`}
          position={position as [number, number, number]}
          rotation={rotation}
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
