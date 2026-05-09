import { describe, expect, it } from 'vitest';
import { agentRuntimePackage } from './index';

describe('agent runtime package', () => {
  it('exports a package marker', () => {
    expect(agentRuntimePackage).toBe('agent-runtime');
  });
});
