import { randomBytes } from 'node:crypto';

export function generateBaseUsername(): string {
    return `user_${randomBytes(6).toString('hex')}`;
}
