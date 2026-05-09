import { describe, expect, it } from 'vitest';
import { createDatabase, workspaces } from './index';

describe('persistence package', () => {
  it('exports the database client and schema', () => {
    expect(typeof createDatabase).toBe('function');
    expect(workspaces).toBeDefined();
  });
});
