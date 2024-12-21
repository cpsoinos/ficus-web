import { defineConfig } from 'drizzle-kit';

const { DATABASE_URL, CF_D1_DB_ID, CF_D1_TOKEN, CF_ACCOUNT_ID } = process.env;

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	out: './migrations',
	dialect: 'sqlite',
	verbose: true,
	strict: true,

	...(DATABASE_URL
		? { dbCredentials: { url: DATABASE_URL } }
		: {
				driver: 'd1-http',
				dbCredentials: {
					databaseId: CF_D1_DB_ID!,
					token: CF_D1_TOKEN!,
					accountId: CF_ACCOUNT_ID!
				}
			})
});
