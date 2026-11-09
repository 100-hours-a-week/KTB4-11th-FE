import { z } from "zod";
import {
  duelCreationBaseSchema,
  withDuelPeriodValidation,
} from "@/features/ai/schemas/duelCreationFormSchema";

export const MODEL_COUNT_OPTIONS = [2, 3] as const;
export type ModelCount = (typeof MODEL_COUNT_OPTIONS)[number];

export const aiVsAiDuelCreationFormSchema = withDuelPeriodValidation(
  duelCreationBaseSchema.extend({
    modelCount: z.union([z.literal(2), z.literal(3)]),
  }),
);

export type AiVsAiDuelCreationFormValues = z.infer<
  typeof aiVsAiDuelCreationFormSchema
>;
