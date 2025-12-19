import { z } from "zod";

export const SixtyFourPositionSchema = z.object({
  x: z.number().optional(),
  y: z.number().optional(),
  z: z.number().optional(),
});

export type Position = z.infer<typeof SixtyFourPositionSchema>;
