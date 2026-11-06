// src/utils/username.utils.ts

import { usernameSchema } from "@transcendence/shared/schemas/user";
import { BadRequestError } from "../errors/HttpErrors.ts";
import { formatZodErrors } from "./zod.ts";

export function generateBaseUsername(email: string): string {
// 1. Extract the part before the '@' or use 'user' by default
  const localPart = email.split('@')[0] || 'user';

  const parsed = usernameSchema.safeParse({username:localPart});
  if (parsed.error)
  {
    throw new BadRequestError({
          message: "Input contains invalid fields",
          details: formatZodErrors (parsed.error),
        })
  }
  // Truncate to a maximum of 30 characters to allow space for potential collision-handling suffixes
  let username = parsed.data.username;
  if (username.length > 25) {
    username = username.substring(0, 25).replace(/_+$/, '');
  }
  return username;
}
