import { z } from "zod";
import { actionSchema } from "../action/schema";

export const chainSchema = z.object({
  _id: z.string().uuid().optional(),
  namespaceId: z.string(),
  name: z.string().nullable(),
  actions: z.array(actionSchema).optional(),
  lastModified: z.string().optional(),
});

export type Chain = z.infer<typeof chainSchema>;
