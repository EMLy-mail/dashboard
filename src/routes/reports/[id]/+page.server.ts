import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getReport, ApiError } from '$lib/server/api';

export const load: PageServerLoad = async ({ params, locals }) => {
	const id = Number(params.id);
	if (isNaN(id)) throw error(400, 'Invalid report ID');

	let result;
	try {
		result = await getReport(id);
	} catch (err) {
		if (err instanceof ApiError && err.status === 404) throw error(404, 'Report not found');
		throw error(500, 'Failed to load report');
	}

	return {
		report: {
			...result.report,
			system_info: result.report.system_info
				? JSON.stringify(result.report.system_info, null, 2)
				: null
		},
		files: result.files,
		currentUserId: locals.user?.id ?? ''
	};
};
