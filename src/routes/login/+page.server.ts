import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { SESSION_COOKIE_NAME } from '$lib/server/auth';
import { login, ApiError } from '$lib/server/api';
import { dev } from '$app/environment';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		redirect(302, '/');
	}
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (typeof username !== 'string' || typeof password !== 'string') {
			return fail(400, { message: 'Invalid input' });
		}

		if (!username || !password) {
			return fail(400, { message: 'Username and password are required' });
		}

		let result;
		try {
			result = await login(username, password);
		} catch (err) {
			if (err instanceof ApiError) {
				if (err.status === 401) {
					return fail(400, { message: 'Invalid username or password' });
				}
				return fail(500, { message: 'Server error: ' + err.message });
			}
			return fail(500, { message: 'Internal server error' });
		}

		cookies.set(SESSION_COOKIE_NAME, result.session_id, {
			path: '/',
			httpOnly: true,
			secure: !dev,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 30 // 30 days
		});

		redirect(302, '/');
	}
};
