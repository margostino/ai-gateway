import fs from 'fs';

import toml from '@iarna/toml';

import { logger } from '@/logger';

export const parseTomlFile = (path: string): any => {
  try {
    const dataFile = fs.readFileSync(path, 'utf-8');
    return toml.parse(dataFile);
  } catch (error) {
    logger.fatal(error, 'Error reading AI API Gateway config file.');
    process.exit(1);
  }
};
