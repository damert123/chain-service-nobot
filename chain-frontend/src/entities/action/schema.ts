import { z } from "zod";

export const waitActionSchema = z.object({
  actionType: z.literal("wait"),
  waitFor: z.number(),
});

export const commentActionSchema = z.object({
  actionType: z.literal("comment"),
  text: z.string().nullable(),
  fileUrls: z.array(z.string()),
});

export const actionSchema = z.union([waitActionSchema, commentActionSchema]);
export type Action = z.infer<typeof actionSchema>;

export type WaitAction = z.infer<typeof waitActionSchema>;
export type CommentAction = z.infer<typeof commentActionSchema>;
