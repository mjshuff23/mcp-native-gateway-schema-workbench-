import { describe, expect, it } from 'vitest';
import { uiSchemaPackage } from './index';

describe('ui schema package', () => {
  it('exports a package marker', () => {
    expect(uiSchemaPackage).toBe('ui-schema');
  });
});
