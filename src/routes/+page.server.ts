import type { PageServerLoad } from './$types';
import { listReports } from '$lib/server/api';

export const load: PageServerLoad = async ({ url }) => {
	const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
	const pageSize = Math.min(50, Math.max(10, Number(url.searchParams.get('pageSize')) || 20));
	const status = url.searchParams.get('status') || '';
	const search = url.searchParams.get('search') || '';

	const result = await listReports({
		page,
		pageSize,
		status: status || undefined,
		search: search || undefined
	});

	return {
		reports: result.data,
		pagination: {
			page: result.page,
			pageSize: result.pageSize,
			total: result.total,
			totalPages: result.totalPages
		},
		filters: {
			status,
			search
		}
	};
};
