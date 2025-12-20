import { z } from "zod";

export const personalitySchema = z.object({
  obedience: z.number().min(0).max(1).refine(n =>
  Math.abs(n * 10 - Math.round(n * 10)) < Number.EPSILON
),
  aggressiveness: z.number().min(0).max(1).refine(n =>
  Math.abs(n * 10 - Math.round(n * 10)) < Number.EPSILON
),
  fear: z.number().min(0).max(1).refine(n =>
  Math.abs(n * 10 - Math.round(n * 10)) < Number.EPSILON
),
  randomness: z.number().min(0).max(1).refine(n =>
  Math.abs(n * 10 - Math.round(n * 10)) < Number.EPSILON
)
});

export type Personality = z.infer<typeof personalitySchema>;

