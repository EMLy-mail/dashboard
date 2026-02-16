// @ts-nocheck
import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { lucia } from '$lib/server/auth';

export const load = async () => {
	redirect(302, '/');
};

export const actions = {
	default: async ({ locals, cookies }: import('./$types').RequestEvent) => {
		if (!locals.session) {
			redirect(302, '/login');
		}

		await lucia.invalidateSession(locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, '/login');
	}
};
;null as any as PageServerLoad;;null as any as Actions;