import {
  boolean,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

export const providerEnum = pgEnum('provider', [
  'github',
  'google',
  'microsoft',
  'notion',
  'linear',
  'local',
  'database',
]);

export const connectionStatusEnum = pgEnum('connection_status', [
  'active',
  'revoked',
  'expired',
  'reauth_required',
]);

export const policyResultEnum = pgEnum('policy_result', ['allow', 'deny', 'approval_required']);

export const workspaces = pgTable('workspaces', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id),
    displayName: text('display_name').notNull(),
    primaryIdentityProvider: providerEnum('primary_identity_provider').notNull().default('local'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('users_workspace_idx').on(table.workspaceId)],
);

export const externalIdentities = pgTable(
  'external_identities',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    provider: providerEnum('provider').notNull(),
    providerSubjectId: text('provider_subject_id').notNull(),
    email: text('email'),
    isPrimaryLogin: boolean('is_primary_login').notNull().default(false),
    linkedAt: timestamp('linked_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('external_identities_provider_subject_unique').on(
      table.provider,
      table.providerSubjectId,
    ),
    index('external_identities_user_provider_idx').on(table.userId, table.provider),
  ],
);

export const providerConnections = pgTable(
  'provider_connections',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    provider: providerEnum('provider').notNull(),
    connectionType: text('connection_type').notNull(),
    scopes: jsonb('scopes').$type<string[]>().notNull().default([]),
    status: connectionStatusEnum('status').notNull().default('active'),
    encryptedRefreshToken: text('encrypted_refresh_token'),
    encryptedAccessTokenCache: text('encrypted_access_token_cache'),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('provider_connections_user_provider_idx').on(table.userId, table.provider)],
);

export const clients = pgTable(
  'clients',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    kind: text('kind').notNull(),
    name: text('name').notNull(),
    publicKey: text('public_key'),
    lastSeenAt: timestamp('last_seen_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('clients_user_idx').on(table.userId)],
);

export const delegations = pgTable(
  'delegations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    clientId: uuid('client_id')
      .notNull()
      .references(() => clients.id),
    provider: providerEnum('provider').notNull(),
    resource: text('resource').notNull(),
    scopes: jsonb('scopes').$type<string[]>().notNull().default([]),
    reason: text('reason').notNull(),
    workflowId: text('workflow_id'),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    approvedAt: timestamp('approved_at', { withTimezone: true }),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('delegations_user_client_idx').on(table.userId, table.clientId),
    index('delegations_expires_idx').on(table.expiresAt),
  ],
);

export const sources = pgTable(
  'sources',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id),
    provider: providerEnum('provider').notNull(),
    externalId: text('external_id').notNull(),
    name: text('name').notNull(),
    url: text('url'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('sources_workspace_provider_idx').on(table.workspaceId, table.provider),
    uniqueIndex('sources_provider_external_unique').on(table.provider, table.externalId),
  ],
);

export const schemaSnapshots = pgTable(
  'schema_snapshots',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id),
    sourceId: uuid('source_id').references(() => sources.id),
    name: text('name').notNull(),
    graph: jsonb('graph').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('schema_snapshots_workspace_created_idx').on(table.workspaceId, table.createdAt),
  ],
);

export const capabilitySnapshots = pgTable(
  'capability_snapshots',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id),
    sourceId: uuid('source_id').references(() => sources.id),
    capabilities: jsonb('capabilities').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('capability_snapshots_workspace_created_idx').on(table.workspaceId, table.createdAt),
  ],
);

export const auditEvents = pgTable(
  'audit_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id),
    userId: uuid('user_id').references(() => users.id),
    clientId: uuid('client_id').references(() => clients.id),
    workflowId: text('workflow_id'),
    actorType: text('actor_type').notNull(),
    actorId: text('actor_id').notNull(),
    action: text('action').notNull(),
    provider: providerEnum('provider'),
    resource: text('resource'),
    riskLabel: text('risk_label').notNull(),
    policyResult: policyResultEnum('policy_result').notNull(),
    result: text('result').notNull(),
    metadata: jsonb('metadata').$type<Record<string, unknown>>().notNull().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('audit_events_workspace_created_idx').on(table.workspaceId, table.createdAt),
    index('audit_events_actor_idx').on(table.actorType, table.actorId),
  ],
);
