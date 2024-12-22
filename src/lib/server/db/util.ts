import { sql } from 'drizzle-orm';
import { text } from 'drizzle-orm/sqlite-core';

export const timestamps = {
	createdAt: text('created_at')
		.notNull()
		.default(sql`(CURRENT_TIMESTAMP)`)
		.$type<Date>(),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`(CURRENT_TIMESTAMP)`)
		.$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
		.$type<Date>()
};
