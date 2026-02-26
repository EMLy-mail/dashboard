import type { Handle } from '@sveltejs/kit';
import { SESSION_COOKIE_NAME } from '$lib/server/auth';
import { validateSession } from '$lib/server/api';
import { initLogger, Log } from '$lib/server/logger';

// Initialize dashboard logger
initLogger();

export const handle: Handle = async ({ event, resolve }) => {
	const ip =
		event.request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
		event.request.headers.get('x-real-ip') ||
		event.getClientAddress?.() ||
		'unknown';
	Log('HTTP', `${event.request.method} ${event.url.pathname} from ${ip}`);

	const sessionId = event.cookies.get(SESSION_COOKIE_NAME);

	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const result = await validateSession(sessionId).catch((err) => {
		Log('AUTH', `Session validation error: ${err?.message ?? err}`);
		return null;
	});

	if (!result) {
		Log('AUTH', `Invalid/expired session from ip=${ip}`);
		event.cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const user = result.user;

	// If user is disabled, clear cookie
	if (!user.enabled) {
		Log('AUTH', `Disabled user rejected: username=${user.username} ip=${ip}`);
		event.cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	event.locals.user = user;
	event.locals.session = sessionId;
	return resolve(event);
};
