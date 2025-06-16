import { MongoClient, ServerApiVersion } from 'mongodb';
import { config } from './utils/config';

const db = new MongoClient(config.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export default db;
