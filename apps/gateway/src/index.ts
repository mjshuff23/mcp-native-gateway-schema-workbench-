import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { InMemoryCapabilityRegistry } from '@workbench/connector-sdk';
import { loadWorkbenchEnv } from '@workbench/config';
import { getGatewayStatus } from './status';

const env = loadWorkbenchEnv();
const registry = new InMemoryCapabilityRegistry();

registry.upsert({
  id: 'gateway.status.resource',
  kind: 'resource',
  namespace: 'gateway',
  name: 'status',
  title: 'Gateway Status',
  description: 'Current gateway health and capability counts',
  riskLabels: ['read_only'],
  discoveredAt: new Date().toISOString(),
});

const mcpServer = new McpServer({
  name: 'mcp-native-gateway-schema-workbench',
  version: env.WORKBENCH_VERSION,
});

mcpServer.registerResource(
  'gateway-status',
  'gateway://status',
  {
    title: 'Gateway Status',
    description: 'Current gateway health and capability counts',
    mimeType: 'application/json',
  },
  (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: 'application/json',
        text: JSON.stringify(getGatewayStatus(registry), null, 2),
      },
    ],
  }),
);

const app = express();

app.get('/healthz', (_req, res) => {
  res.json(getGatewayStatus(registry));
});

app.listen(env.GATEWAY_PORT, () => {
  console.log(`gateway shell ready on port ${env.GATEWAY_PORT}`);
});
