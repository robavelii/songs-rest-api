import { config } from 'dotenv';
config({ path: '.env' });

export const {
  NODE_ENV,
  PORT,
  MONGO_URI,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} = process.env;

