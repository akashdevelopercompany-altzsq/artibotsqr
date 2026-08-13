import { generateShortCode } from './shortcode.util';

describe('ShortCode Util', () => {
  it('should generate a string of default length 6', () => {
    const code = generateShortCode();
    expect(code).toBeDefined();
    expect(code.length).toBe(6);
  });

  it('should generate a string of specified length', () => {
    const code = generateShortCode(10);
    expect(code.length).toBe(10);
  });

  it('should only contain base62 characters', () => {
    const code = generateShortCode(100);
    expect(/^[0-9A-Za-z]+$/.test(code)).toBe(true);
  });

  it('should generate unique codes across multiple calls', () => {
    const code1 = generateShortCode();
    const code2 = generateShortCode();
    expect(code1).not.toBe(code2);
  });
});
