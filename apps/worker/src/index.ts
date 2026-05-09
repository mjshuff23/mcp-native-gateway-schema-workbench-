import { loadWorkbenchEnv } from '@workbench/config';

const env = loadWorkbenchEnv();

console.log(`worker shell ready with Redis at ${env.REDIS_URL}`);
