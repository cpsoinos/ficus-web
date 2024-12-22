import { drizzle, type DrizzleD1Database } from 'drizzle-orm/d1';
import * as schema from './schema';

export type SchematizedDatabase = DrizzleD1Database<typeof schema>;

export class DbSingleton {
	static _db: SchematizedDatabase;

	static initialize(database: D1Database) {
		DbSingleton._db = drizzle(database);
	}
}

type DbSingletonType = typeof DbSingleton & SchematizedDatabase;

export const db = new Proxy(DbSingleton, {
	get(target, prop, receiver) {
		if (prop in target) {
			return Reflect.get(target, prop, receiver);
		}
		if (DbSingleton._db && prop in DbSingleton._db) {
			return DbSingleton._db[prop as keyof typeof DbSingleton._db];
		}
		return undefined;
	}
}) as DbSingletonType;
