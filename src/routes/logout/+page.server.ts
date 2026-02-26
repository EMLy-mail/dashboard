import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { SESSION_COOKIE_NAME } from '$lib/server/auth';
import { logout } from '$lib/server/api';

export const load: PageServerLoad = async () => {
	redirect(302, '/');
};

export const actions: Actions = {
	default: async ({ locals, cookies }) => {
		if (!locals.session) {
			redirect(302, '/login');
		}

		await logout(locals.session).catch(() => {
			// Best-effort: clear cookie regardless
		});

		cookies.delete(SESSION_COOKIE_NAME, { path: '/' });

		redirect(302, '/login');
	}
};
