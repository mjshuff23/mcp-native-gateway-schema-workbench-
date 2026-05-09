import { describe, expect, it } from 'vitest';
import { authPackage } from './index';

describe('auth package', () => {
  it('exports a package marker', () => {
    expect(authPackage).toBe('auth');
  });
});
