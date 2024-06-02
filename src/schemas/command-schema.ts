import { z } from "zod";

export const CommandSchema = z.object({
  command: z.string().max(50),
  message: z.string().max(500),
  userlevel: z.string().max(50),
  cooldown: z.number().int().min(0),
  status: z.boolean(),
  action: z.string()
});


export type CommandSchemaType = z.infer<typeof CommandSchema>;