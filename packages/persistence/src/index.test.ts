import { describe, expect, it } from 'vitest';
import { persistencePackage } from './index';

describe('persistence package', () => {
  it('exports a package marker', () => {
    expect(persistencePackage).toBe('persistence');
  });
});
