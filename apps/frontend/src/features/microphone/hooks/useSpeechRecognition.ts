import { useCallback, useEffect, useRef, useState } from "react";

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export interface UseSpeechRecognitionOptions {
  /** 言語コード */
  lang?: string;
  /** 継続的に認識を行うか */
  continuous?: boolean;
  /** 中間結果を返すか */
  interimResults?: boolean;
  /** 録音開始時に自動でtranscriptをリセットするか */
  autoResetOnStart?: boolean;
  /** 録音完了時のコールバック */
  onRecordingComplete?: (transcript: string) => void;
}

export interface UseSpeechRecognitionReturn {
  /** 最新の認識結果（確定テキスト） */
  transcript: string;
  /** 中間結果のテキスト */
  interimTranscript: string;
  /** 認識中かどうか */
  isListening: boolean;
  /** 実際に音声認識が動作中かどうか（onstartからonendまで） */
  isActive: boolean;
  /** ブラウザがサポートしているか */
  isSupported: boolean;
  /** エラーメッセージ */
  error: string | null;
  /** 音声認識を開始 */
  start: () => void;
  /** 音声認識を停止 */
  stop: () => void;
  /** transcriptをクリア */
  resetTranscript: () => void;
}

export const useSpeechRecognition = (
  options: UseSpeechRecognitionOptions = {},
): UseSpeechRecognitionReturn => {
  const {
    lang = "ja-JP",
    continuous = true,
    interimResults = true,
    autoResetOnStart = false,
    onRecordingComplete,
  } = options;

  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const manualStopRef = useRef(false);
  const errorStopRef = useRef(false);
  const transcriptOnStopRef = useRef("");
  const onRecordingCompleteRef = useRef(onRecordingComplete);

  useEffect(() => {
    onRecordingCompleteRef.current = onRecordingComplete;
  }, [onRecordingComplete]);

  // Keep transcriptOnStopRef in sync with transcript
  useEffect(() => {
    transcriptOnStopRef.current = transcript;
  }, [transcript]);

  const isSupported =
    typeof window !== "undefined" &&
    (window.SpeechRecognition !== undefined || window.webkitSpeechRecognition !== undefined);

  useEffect(() => {
    if (!isSupported) {
      return;
    }

    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      return;
    }

    const recognition = new SpeechRecognitionClass();
    recognition.lang = lang;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;

    recognition.onstart = () => {
      setIsListening(true);
      setIsActive(true);
      setError(null);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalText = "";
      let interimText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;

        if (result.isFinal) {
          finalText += text;
        } else {
          interimText += text;
        }
      }

      if (finalText) {
        setTranscript(finalText);
        // Update ref immediately to ensure latest transcript is captured on stop
        transcriptOnStopRef.current = finalText;
      }
      setInterimTranscript(interimText);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      const errorMessages: Record<string, string> = {
        "no-speech": "音声が検出されませんでした",
        "audio-capture": "マイクが見つかりません",
        "not-allowed": "マイクへのアクセスが拒否されました",
        network: "ネットワークエラーが発生しました",
        aborted: "音声認識が中断されました",
        "service-not-allowed": "音声認識サービスが許可されていません",
      };

      // 'aborted' エラーは初回起動時やブラウザの内部処理で発生することがあるため、
      // エラーフラグを設定せず、onendで自動再起動されるようにする
      // UIのチラつきを防ぐため、isListeningはfalseにしない
      // ただし、isActiveはfalseにして、UIが赤色のままにならないようにする
      if (event.error === "aborted") {
        console.warn("音声認識が中断されました（内部処理） - onendで自動再起動されます");
        setIsActive(false);
        // errorStopRefは設定しない（自動再起動を許可）
        // setIsListening(false)も呼ばない（UIのチラつき防止）
        return;
      }

      errorStopRef.current = true;
      setError(errorMessages[event.error] || `エラー: ${event.error}`);
      setIsListening(false);
      setIsActive(false);
    };

    recognition.onend = () => {
      // isActiveは常にfalseにする（自動再起動時は新しいonstartで再度trueになる）
      setIsActive(false);

      // エラーで停止した場合は自動再起動しない
      if (continuous && !manualStopRef.current && !errorStopRef.current && recognitionRef.current) {
        try {
          recognitionRef.current.start();
          return;
        } catch (e) {
          console.error("音声認識の自動再起動に失敗しました:", e);
          return;
        }
      }

      if (manualStopRef.current && onRecordingCompleteRef.current) {
        onRecordingCompleteRef.current(transcriptOnStopRef.current);
      }

      setIsListening(false);
      setInterimTranscript("");
      manualStopRef.current = false;
      errorStopRef.current = false;
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
      recognitionRef.current = null;
    };
  }, [isSupported, lang, continuous, interimResults]);

  const start = useCallback(() => {
    if (!isSupported) {
      setError("このブラウザは音声認識をサポートしていません");
      return;
    }

    if (recognitionRef.current && !isListening) {
      if (autoResetOnStart) {
        setTranscript("");
        setInterimTranscript("");
      }
      setError(null);
      errorStopRef.current = false; // エラーフラグをリセット
      try {
        recognitionRef.current.start();
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        }
      }
    }
  }, [isSupported, isListening, autoResetOnStart]);

  const stop = useCallback(() => {
    if (recognitionRef.current && isListening) {
      manualStopRef.current = true;
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
  }, []);

  return {
    transcript,
    interimTranscript,
    isListening,
    isActive,
    isSupported,
    error,
    start,
    stop,
    resetTranscript,
  };
};
