import { describe, expect, it, vi } from 'vitest';
import { debounce } from '../debounce';

describe('debounce', () => {
  it('should delay function execution', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledOnce();

    vi.useRealTimers();
  });

  it('should cancel previous call when called again within delay', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced();
    debounced();
    debounced();

    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledOnce();

    vi.useRealTimers();
  });

  it('should pass arguments to the original function', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced('hello', 42);

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledWith('hello', 42);

    vi.useRealTimers();
  });
});
