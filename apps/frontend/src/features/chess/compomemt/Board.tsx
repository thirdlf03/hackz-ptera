import { Line, Text } from "@react-three/drei";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import ChessPieces from "./ChessPieces";
import { Microphone } from "@/features/microphone";
import { useVoiceInputTransform } from "@/features/voice-input";

import * as THREE from "three";
import type React from "react";
import type { VoiceInput } from "@repo/schema";

interface BoardProps {
  className?: string;
}

function ChessLine() {
  const squares = [];
  const squareSize = 0.6; // 1マスのサイズ
  const borderColor = new THREE.Color("rgba(228, 221, 209, 1)").convertSRGBToLinear();

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
  const [transformedData, setTransformedData] = useState<VoiceInput | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { mutate: transformVoice, isPending } = useVoiceInputTransform();

  const handleRecordingComplete = (transcript: string) => {
    if (!transcript || transcript.trim() === "") {
      return;
    }

    setErrorMessage(null);
    transformVoice(
      { text: transcript },
      {
        onSuccess: (response) => {
          if (response.success) {
            setTransformedData(response.data);
            console.log("変換成功:", response.data);
          } else {
            setErrorMessage(response.error);
            console.error("変換エラー:", response.error);
          }
        },
        onError: (error) => {
          const errorMsg = error instanceof Error ? error.message : "Unknown error";
          setErrorMessage(errorMsg);
          console.error("API呼び出しエラー:", errorMsg);
        },
      },
    );
  };

  return (
    <Canvas className={className}>
      <OrbitControls />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} />
      <Microphone
        onTranscript={(text) => console.log("認識結果:", text)}
        onListeningChange={(listening) => console.log("録音中:", listening)}
        onError={(err) => console.error(err)}
        position={[0, 1.5, 2.5]}
        speechRecognitionOptions={{
          onRecordingComplete: handleRecordingComplete,
        }}
      />
      <group rotation={[-Math.PI / 3, 0, 0]} scale={[1.5, 1, 1]}>
        <mesh>
          <planeGeometry args={[6, 6]} />
          <meshPhongMaterial color="rgba(173, 138, 41, 1)" />
        </mesh>
        <ChessLine />
        <ChessPieces />
      </group>
      {/* Display loading state */}
      {isPending && (
        <Text
          position={[0, 3.5, 2.5]}
          fontSize={0.15}
          color="blue"
          anchorX="center"
          anchorY="middle"
        >
          変換中...
        </Text>
      )}
      {/* Display transformed data */}
      {transformedData && !isPending && (
        <Text
          position={[0, 3.5, 2.5]}
          fontSize={0.12}
          color="green"
          anchorX="center"
          anchorY="middle"
          maxWidth={3}
        >
          {`駒: ${transformedData.piece}`}
          {transformedData.from && `\nFrom: ${transformedData.from}`}
          {transformedData.to && `\nTo: ${transformedData.to}`}
          {transformedData.order && `\n命令: ${transformedData.order}`}
        </Text>
      )}
      {/* Display error message */}
      {errorMessage && !isPending && (
        <Text
          position={[0, 3.5, 2.5]}
          fontSize={0.12}
          color="red"
          anchorX="center"
          anchorY="middle"
          maxWidth={3}
        >
          {`エラー: ${errorMessage}`}
        </Text>
      )}
    </Canvas>
  );
};

export default Board;
