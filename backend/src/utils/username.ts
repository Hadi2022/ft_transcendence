// src/utils/username.utils.ts

import { usernameSchema } from "@transcendence/shared/schemas/user";
import { BadRequestError } from "../errors/HttpErrors.ts";
import { formatZodErrors } from "./zod.ts";

export function generateBaseUsername(email: string): string {
  // 1. Extract the part before the '@' or use 'user' by default
  const localPart = email.split('@')[0] || 'user';
  // 2. saniteze
  let sanitized = localPart.replace(/[^a-zA-Z0-9_]/g, '_');
  sanitized = sanitized.replace(/_+/g, '_');
  sanitized = sanitized.replace(/^_+|_+$/g, '');
  if (sanitized.length < 3) {
    sanitized = `user_${sanitized}`.padEnd(3, '0');
  }
  //3. truncate
  if (sanitized.length > 25) {
    sanitized = sanitized.substring(0, 25).replace(/_+$/, '');
  }
  const parsed = usernameSchema.safeParse({ username: sanitized });
  if (parsed.error) {
    throw new BadRequestError({
      message: "Input contains invalid fields",
      details: formatZodErrors(parsed.error),
    })
  }
  let username = parsed.data.username;
  return username;
}
