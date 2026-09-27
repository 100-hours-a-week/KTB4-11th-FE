import { z } from "zod";
import { accountNameSchema } from "@/features/account/schemas/accountCreationFormSchema";

export const accountNameEditFormSchema = z.object({
  accountName: accountNameSchema,
});

export type AccountNameEditFormValues = z.infer<
  typeof accountNameEditFormSchema
>;
