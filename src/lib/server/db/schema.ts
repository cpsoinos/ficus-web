import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { timestamps } from './util';

export const user = sqliteTable('user', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	email: text('email').notNull().unique(),
	name: text('name'),
	passwordHash: text('password_hash'),
	...timestamps
});

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;

export const oAuthAccount = sqliteTable('oauth_account', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	provider: text('provider').notNull(),
	providerUserId: text('provider_user_id').notNull(),
	...timestamps
});

export type OAuthAccount = typeof oAuthAccount.$inferSelect;
export type NewOAuthAccount = typeof oAuthAccount.$inferInsert;
