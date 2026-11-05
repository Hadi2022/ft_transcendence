// src/utils/username.utils.ts

export function generateBaseUsername(email: string): string {
  // 1. Extraer la parte antes del '@' o usar 'user' por defecto
  const localPart = email.split('@')[0] || 'user';

  // 2. Reemplazar cualquier carácter que NO sea letra, número o guión bajo por '_'
  let sanitized = localPart.replace(/[^a-zA-Z0-9_]/g, '_');

  // 3. Colapsar guiones bajos múltiples consecutivos en uno solo (ej. "john...doe" -> "john_doe")
  sanitized = sanitized.replace(/_+/g, '_');

  // 4. Limpiar guiones bajos al inicio o al final
  sanitized = sanitized.replace(/^_+|_+$/g, '');

  // 5. Asegurar longitud mínima de 3 caracteres
  if (sanitized.length < 3) {
    sanitized = `user_${sanitized}`.padEnd(3, '0');
  }

  // 6. Truncar a un máximo de 30 caracteres para dejar espacio a posibles sufijos de colisión
  if (sanitized.length > 25) {
    sanitized = sanitized.substring(0, 25).replace(/_+$/, '');
  }

  return sanitized;
}
