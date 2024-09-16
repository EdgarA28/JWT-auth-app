import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/drizzle/schema.ts',
  out: './src/drizzle/migrations',
  dialect: 'postgresql', // 'postgresql' | 'mysql' | 'sqlite'
      dbCredentials:{
        url: process.env.DATABASE_URL as string
    },
});

