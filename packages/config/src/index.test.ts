import { describe, expect, it } from 'vitest';
import { configPackage } from './index';

describe('config package', () => {
  it('exports a package marker', () => {
    expect(configPackage).toBe('config');
  });
});
