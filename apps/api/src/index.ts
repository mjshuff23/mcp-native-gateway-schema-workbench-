import { loadWorkbenchEnv } from '@workbench/config';

const env = loadWorkbenchEnv();

console.log(`api shell ready on port ${env.API_PORT}`);
