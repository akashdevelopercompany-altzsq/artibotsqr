import * as crypto from 'crypto';

const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const ALPHABET_LENGTH = ALPHABET.length;

/**
 * Generates a collision-resistant, URL-safe random string.
 * @param length The length of the generated shortcode
 */
export function generateShortCode(length: number = 6): string {
  const bytes = crypto.randomBytes(length);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += ALPHABET[bytes[i] % ALPHABET_LENGTH];
  }
  return result;
}
