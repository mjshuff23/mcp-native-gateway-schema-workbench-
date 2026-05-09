import { loadWorkbenchEnv } from '@workbench/config';

const env = loadWorkbenchEnv();

console.log(`gateway shell ready on port ${env.GATEWAY_PORT}`);
