import { dev } from '$app/environment';
import type { Handle } from '@sveltejs/kit';
import * as auth from '$lib/server/auth.js';
import { Db } from '$lib/server/db';
import { sequence } from '@sveltejs/kit/hooks';

let platform: App.Platform;

const devShim: Handle = async ({ event, resolve }) => {
	if (dev) {
		const { getPlatformProxy } = await import('wrangler');
		platform = (await getPlatformProxy<Env>()) as unknown as App.Platform;
		event.platform = {
			...event.platform,
			...platform
		};
	}
	return resolve(event);
};

const initDb: Handle = async ({ event, resolve }) => {
	Db.initialize(event.platform!.env.DB);
	return resolve(event);
};

const authHook: Handle = async ({ event, resolve }) => {
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

export const handle: Handle = sequence(devShim, initDb, authHook);
