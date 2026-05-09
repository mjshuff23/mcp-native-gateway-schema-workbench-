import { describe, expect, it } from 'vitest';
import { connectorSdkPackage } from './index';

describe('connector SDK package', () => {
  it('exports a package marker', () => {
    expect(connectorSdkPackage).toBe('connector-sdk');
  });
});
