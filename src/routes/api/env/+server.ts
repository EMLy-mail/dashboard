import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies, locals }) => {
	if (!locals.user) throw error(401, 'Unauthorized');

	const body = await request.json().catch(() => null);
	const env = body?.env;

	if (env !== 'prod' && env !== 'test') {
		throw error(400, 'Invalid env value. Must be "prod" or "test".');
	}

	cookies.set('db_env', env, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 30 // 30 days
	});

	return json({ env });
};
