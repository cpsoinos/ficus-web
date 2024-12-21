import { dev } from '$app/environment';
import type { Handle } from '@sveltejs/kit';
import * as auth from '$lib/server/auth.js';
import { Db } from '$lib/server/db';

let platform: App.Platform;

if (dev) {
	const { getPlatformProxy } = await import('wrangler');
	platform = (await getPlatformProxy()) as unknown as App.Platform;
}

export const handle: Handle = async ({ event, resolve }) => {
	// initialize database
	if (dev && platform) {
		event.platform = {
			...event.platform,
			...platform
		};
	}
	Db.initialize(event.platform!.env.DB);

	const sessionToken = event.cookies.get(auth.sessionCookieName);
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await auth.validateSessionToken(sessionToken);
	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};
