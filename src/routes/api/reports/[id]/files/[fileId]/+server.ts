import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getFile, ApiError } from '$lib/server/api';

export const GET: RequestHandler = async ({ params }) => {
	const reportId = Number(params.id);
	const fileId = Number(params.fileId);

	if (isNaN(reportId) || isNaN(fileId)) throw error(400, 'Invalid ID');

	let upstream: Response;
	try {
		upstream = await getFile(reportId, fileId);
	} catch (err) {
		if (err instanceof ApiError && err.status === 404) throw error(404, 'File not found');
		throw error(500, 'Failed to fetch file');
	}

	const contentType = upstream.headers.get('content-type') ?? 'application/octet-stream';
	const contentDisposition =
		upstream.headers.get('content-disposition') ?? 'inline';

	return new Response(upstream.body, {
		headers: {
			'Content-Type': contentType,
			'Content-Disposition': contentDisposition,
			...(upstream.headers.get('content-length')
				? { 'Content-Length': upstream.headers.get('content-length')! }
				: {})
		}
	});
};
