import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { resolve } from 'path';

function generateConfig(
  servicePath: string,
): Record<string, string> | undefined {
  try {
    if (!servicePath) {
      throw new Error("Service Environment Path wasn't provided");
    }

    let envkeys;
    const fileContent = readFileSync(resolve(servicePath, 'envkeys.json'), {
      encoding: 'utf-8',
    });
    envkeys = JSON.parse(fileContent);

    if (!envkeys) {
      throw new Error(
        "Couldn't find envkeys.json file, maybe the file doesn't exist?",
      );
    }

    config({
      path: resolve(servicePath, '.env'),
      encoding: 'utf-8',
    });

    const missingVars = Object.entries(envkeys.keys)
      .filter(([key, value]) => !value || !process.env[envkeys.keys[key]])
      .map(([key]) => key);
    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(', ')}`,
      );
    }

    let envConfig = {};
    for (const key of envkeys.keys) {
      envConfig = { ...envConfig, [key]: process.env[key] };
    }

    return envConfig;
  } catch (error) {
    console.error((error as Error).message);
    return undefined;
  }
}

export { generateConfig };
