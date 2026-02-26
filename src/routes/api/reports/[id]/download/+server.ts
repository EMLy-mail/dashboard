import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { downloadZip, ApiError } from '$lib/server/api';

export const GET: RequestHandler = async ({ params }) => {
	const id = Number(params.id);
	if (isNaN(id)) throw error(400, 'Invalid report ID');

	let upstream: Response;
	try {
		upstream = await downloadZip(id);
	} catch (err) {
		if (err instanceof ApiError && err.status === 404) throw error(404, 'Report not found');
		throw error(500, 'Failed to download ZIP');
	}

	return new Response(upstream.body, {
		headers: {
			'Content-Type': 'application/zip',
			'Content-Disposition': `attachment; filename="report-${id}.zip"`,
			...(upstream.headers.get('content-length')
				? { 'Content-Length': upstream.headers.get('content-length')! }
				: {})
		}
	});
};
