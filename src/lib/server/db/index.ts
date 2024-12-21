import { drizzle } from 'drizzle-orm/d1';

export class Db {
	db: ReturnType<typeof drizzle>;
	static instance: Db;

	private constructor(database: D1Database) {
		this.db = drizzle(database);
	}

	static initialize(database: D1Database) {
		Db.instance = new Db(database);
	}

	static getInstance() {
		return Db.instance;
	}
}

export const db = Db.getInstance()?.db;
