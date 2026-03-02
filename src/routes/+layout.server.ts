import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { countNewReports } from '$lib/server/api';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (url.pathname === '/login') {
		return { newCount: 0, user: null };
	}

	if (!locals.user) {
		redirect(302, '/login');
	}

	const newCount = await countNewReports(locals.dbEnv).catch(() => 0);

	return {
		newCount,
		user: locals.user,
		dbEnv: locals.dbEnv
	};
};
