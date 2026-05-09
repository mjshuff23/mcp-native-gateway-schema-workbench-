import { describe, expect, it } from 'vitest';
import { loadWorkbenchEnv } from './index';

describe('config package', () => {
  it('exports the environment parser', () => {
    expect(typeof loadWorkbenchEnv).toBe('function');
  });
});
