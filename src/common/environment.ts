import * as dotenv from 'dotenv';
dotenv.config();

type Environment = {
  API_URL: string;
  DATABASE_URL: string;
} & NodeJS.ProcessEnv;

export const environment = process.env as Environment;
