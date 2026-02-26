import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { listReports } from '$lib/server/api';

export const GET: RequestHandler = async () => {
	const result = await listReports({ page: 1, pageSize: 1 });
	return json({ total: result.total });
};
