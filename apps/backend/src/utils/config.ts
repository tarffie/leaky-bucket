import { Config } from '../interfaces/Config';
import dotenv from 'dotenv';

dotenv.config();

function validateConfig(): Config {
  const { API_PORT_LOCAL } = process.env;

  const requiredEnvVars = {
    API_PORT_LOCAL,
  };

  const missingVars = Object.entries(requiredEnvVars)
    .filter((config) => !config[1])
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`,
    );
  }

  return {
    PORT: API_PORT_LOCAL!,
  };
}

const config: Config = validateConfig();

export { config };
