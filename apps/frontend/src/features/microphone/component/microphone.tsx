import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import type { UseSpeechRecognitionOptions } from "../hooks/useSpeechRecognition";
import { useVoiceInputTransform } from "@/features/voice-input";
import type { VoiceInput } from "@repo/schema";

export interface MicrophoneHandle {
  /** 音声認識を開始 */
  start: () => void;
  /** 音声認識を停止 */
  stop: () => void;
  /** 現在のtranscriptを取得 */
  getTranscript: () => string;
  /** transcriptをリセット */
  reset: () => void;
  /** 現在認識中かどうか */
  isListening: () => boolean;
}

export interface MicrophoneProps {
  /** 認識テキストが更新されたときのコールバック */
  onTranscript?: (transcript: string) => void;
  /** 中間結果が更新されたときのコールバック */
  onInterimTranscript?: (interimTranscript: string) => void;
  /** エラー発生時のコールバック */
  onError?: (error: string) => void;
  /** 録音状態が変化したときのコールバック */
  onListeningChange?: (isListening: boolean) => void;
  /** 最終的に音声変換が成功したときのコールバック */
  onTransformSuccess?: (data: VoiceInput) => void;
  /** 音声認識オプション */
  speechRecognitionOptions?: UseSpeechRecognitionOptions;
  /** メッシュの位置 */
  position?: [number, number, number];
  /** メッシュのスケール */
  scale?: number;
  /** テキストを表示するかどうか */
  showText?: boolean;
  /** テキストの最大幅 */
  maxTextWidth?: number;
  /** テキストのフォントサイズ */
  textFontSize?: number;
  /** 音声変換APIを有効にするかどうか */
  enableVoiceTransform?: boolean;
  /** 変換結果を表示するかどうか */
  showTransformResult?: boolean;
  /** 変換結果表示の位置オフセット */
  transformResultPosition?: [number, number, number];
}

const Microphone = forwardRef<MicrophoneHandle, MicrophoneProps>(
  (
    {
      onTranscript,
      onInterimTranscript,
      onError,
      onListeningChange,
      onTransformSuccess,
      speechRecognitionOptions,
      position = [0, 0, 0],
      scale = 1,
      showText = true,
      maxTextWidth = 2,
      textFontSize = 0.1,
      enableVoiceTransform = true,
      showTransformResult = true,
      transformResultPosition = [0, 1, 0],
    },
    ref,
  ) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [transformedData, setTransformedData] = useState<VoiceInput | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { mutate: transformVoice, isPending } = useVoiceInputTransform();

    const handleRecordingComplete = (transcript: string) => {
      // Call the original callback if provided
      if (speechRecognitionOptions?.onRecordingComplete) {
        speechRecognitionOptions.onRecordingComplete(transcript);
      }

      if (!enableVoiceTransform || !transcript || transcript.trim() === "") {
        return;
      }

      // Reset previous state
      setTransformedData(null);
      setErrorMessage(null);

      transformVoice(
        { text: transcript },
        {
          onSuccess: (response) => {
            if (response.success) {
              setTransformedData(response.data);
              console.log("変換成功:", response.data);
              onTransformSuccess?.(response.data);
            } else {
              console.error("変換エラー:", response.error);
            }
          },
          onError: (error) => {
            const errorMsg = error instanceof Error ? error.message : "Unknown error";
            console.error("API呼び出しエラー:", errorMsg);
          },
        },
      );
    };

    const {
      transcript,
      interimTranscript,
      isListening,
      isActive,
      isSupported,
      error,
      start,
      stop,
      resetTranscript,
    } = useSpeechRecognition({
      ...speechRecognitionOptions,
      onRecordingComplete: handleRecordingComplete,
    });

    useImperativeHandle(
      ref,
      () => ({
        start,
        stop,
        getTranscript: () => transcript,
        reset: resetTranscript,
        isListening: () => isListening,
      }),
      [start, stop, transcript, resetTranscript, isListening],
    );

    useEffect(() => {
      if (transcript) {
        onTranscript?.(transcript);
      }
    }, [transcript, onTranscript]);

    useEffect(() => {
      onInterimTranscript?.(interimTranscript);
    }, [interimTranscript, onInterimTranscript]);

    useEffect(() => {
      onListeningChange?.(isListening);
    }, [isListening, onListeningChange]);

    useEffect(() => {
      if (error) {
        onError?.(error);
      }
    }, [error, onError]);

    useFrame((state) => {
      if (meshRef.current && isActive) {
        const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
        meshRef.current.scale.set(pulse * scale, pulse * scale, pulse * scale);
      } else if (meshRef.current) {
        meshRef.current.scale.set(scale, scale, scale);
      }
    });

    const handleClick = () => {
      if (!isSupported) {
        onError?.("このブラウザは音声認識をサポートしていません");
        return;
      }

      if (isListening) {
        stop();
      } else {
        start();
      }
    };

    const displayText = interimTranscript || transcript || "";

    return (
      <group position={position}>
        <mesh ref={meshRef} onClick={handleClick}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial
            color={isActive ? "#ef4444" : "#6b7280"}
            emissive={isActive ? "#dc2626" : "#000000"}
            emissiveIntensity={isActive ? 0.5 : 0}
          />
        </mesh>
        {showText && (
          <Text
            position={[0, 0.6, 0]}
            fontSize={textFontSize}
            color="black"
            anchorX="center"
            anchorY="bottom"
            maxWidth={maxTextWidth}
            textAlign="center"
          >
            {displayText || (isListening ? "話してください..." : "クリックして話す")}
          </Text>
        )}
        {/* Display loading state */}
        {enableVoiceTransform && showTransformResult && isPending && (
          <Text
            position={transformResultPosition}
            fontSize={0.15}
            color="blue"
            anchorX="center"
            anchorY="middle"
          >
            変換中...
          </Text>
        )}
        {/* Display transformed data */}
        {enableVoiceTransform && showTransformResult && transformedData && !isPending && (
          <Text
            position={transformResultPosition}
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
        {enableVoiceTransform && showTransformResult && errorMessage && !isPending && (
          <Text
            position={transformResultPosition}
            fontSize={0.12}
            color="red"
            anchorX="center"
            anchorY="middle"
            maxWidth={3}
          >
            {`エラー: ${errorMessage}`}
          </Text>
        )}
      </group>
    );
  },
);

Microphone.displayName = "Microphone";

export default Microphone;
