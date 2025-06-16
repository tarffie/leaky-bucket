import { generateConfig } from '@woovi/common';
import path from 'path';

const cwd = process.cwd();
const root = path.join.bind(cwd);

const raw = JSON.stringify(generateConfig(root()));
export const config = JSON.parse(raw);
