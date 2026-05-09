import { describe, expect, it } from 'vitest';
import { domainGraphPackage } from './index';

describe('domain graph package', () => {
  it('exports a package marker', () => {
    expect(domainGraphPackage).toBe('domain-graph');
  });
});
