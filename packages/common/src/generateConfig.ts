import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const BASE_CONFIG_DIR = '/packages/common/';

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

    const dotenvResult = config({
      path: servicePath,
      encoding: 'utf-8',
    });

    if (dotenvResult.error) {
      throw new Error(dotenvResult.error.message);
    }

    const missingVars = Object.entries(envkeys.keys)
      .filter(([key]) => !process.env[key])
      .map(([key]) => key);
    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(', ')}`,
      );
    }

    let envConfig: Record<string, string> = {};
    for (const key of envkeys.keys) {
      const value = process.env[key];
      if (typeof value === 'string') {
        envConfig[key] = process.env[key] as string;
      } else {
        console.warn(
          `Environment variable ${key} is not a string or is undefined`,
        );
      }
    }

    return envConfig;
  } catch (error) {
    console.error((error as Error).message);
    return undefined;
  }
}

export { generateConfig };
