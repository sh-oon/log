import { describe, expect, it } from 'vitest';
import { formatDate } from '../formatDate';

describe('formatDate', () => {
  it('should format date as YYYY-MM-DD', () => {
    const date = new Date(2024, 0, 15);
    expect(formatDate(date)).toBe('2024-01-15');
  });

  it('should pad single digit month and day', () => {
    const date = new Date(2024, 2, 5);
    expect(formatDate(date)).toBe('2024-03-05');
  });

  it('should handle December correctly', () => {
    const date = new Date(2024, 11, 31);
    expect(formatDate(date)).toBe('2024-12-31');
  });
});
