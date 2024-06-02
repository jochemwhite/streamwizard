import {z} from 'zod';

export const overlaySchema = z.object({
  name: z.string().max(50).min(4),
  height: z.number().min(720),
  width: z.number().min(1280),
});