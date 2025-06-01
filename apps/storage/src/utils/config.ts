import { Config } from '@woovi/common/src/interfaces/Config';
import dotenv from 'dotenv';

const dotenvResult = dotenv.config();

if (dotenvResult.error) {
  throw new Error(`Failed to load .env file: ${dotenvResult.error.message}`);
}

function validateConfig(): Config {
  const { DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_URI } = process.env;

  const requiredEnvVars: Record<string, string | undefined> = {
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    DATABASE_URI,
  };

  const missingOrInvalidVars = Object.entries(requiredEnvVars)
    .filter(([value]) => !value || value.trim() === '')
    .map(([key]) => key);

  if (missingOrInvalidVars.length > 0) {
    throw new Error(
      `Missing or invalid environment variables: ${missingOrInvalidVars.join(
        ', ',
      )}. Ensure they are defined in the .env file.`,
    );
  }
  // Additional validation for DATABASE_URI format (basic check)
  if (
    !DATABASE_URI!.startsWith('mongodb://') &&
    !DATABASE_URI!.startsWith('mongodb+srv://')
  ) {
    throw new Error(
      'DATABASE_URI must be a valid MongoDB connection string (e.g., mongodb:// or mongodb+srv://)',
    );
  }

  return {
    DATABASE_USERNAME: DATABASE_USERNAME!,
    DATABASE_PASSWORD: DATABASE_PASSWORD!,
    DATABASE_URI: DATABASE_URI!,
  } as Config;
}

/**
 * Checks if the config is valid and then sets the object.
 */
const config: Config = validateConfig();
export { config };
