import { z } from "zod";

export const idParamSchema = z.object({ id: z.uuid({ error: 'Id parameter must be a valid UUID' }) });
