export type CapabilityKind = 'tool' | 'resource' | 'prompt' | 'completion' | 'task' | 'policy';

export interface CapabilitySnapshotItem {
  id: string;
  kind: CapabilityKind;
  namespace: string;
  name: string;
  title: string;
  description: string;
  riskLabels: string[];
  discoveredAt: string;
}

export interface CapabilityRegistry {
  list(kind?: CapabilityKind): CapabilitySnapshotItem[];
  upsert(item: CapabilitySnapshotItem): void;
}

export class InMemoryCapabilityRegistry implements CapabilityRegistry {
  private readonly items = new Map<string, CapabilitySnapshotItem>();

  list(kind?: CapabilityKind): CapabilitySnapshotItem[] {
    const values = [...this.items.values()];
    return kind ? values.filter((item) => item.kind === kind) : values;
  }

  upsert(item: CapabilitySnapshotItem): void {
    this.items.set(item.id, item);
  }
}
