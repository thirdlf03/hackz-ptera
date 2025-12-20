import { useMutation } from "@tanstack/react-query";
import { transformVoiceInput } from "../api/voice-input";

export const voiceInputKeys = {
  all: ["voice-input"] as const,
  transform: () => [...voiceInputKeys.all, "transform"] as const,
};

export function useVoiceInputTransform() {
  return useMutation({
    mutationFn: transformVoiceInput,
  });
}
