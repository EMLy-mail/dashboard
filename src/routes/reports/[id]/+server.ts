import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { updateStatus, deleteReport, ApiError } from '$lib/server/api';
import type { BugReportStatus } from '$lib/server/api';

export const PATCH: RequestHandler = async ({ params, request }) => {
	const id = Number(params.id);
	if (isNaN(id)) throw error(400, 'Invalid report ID');

	const body = await request.json();
	const { status } = body;

	if (!['new', 'in_review', 'resolved', 'closed'].includes(status)) {
		throw error(400, 'Invalid status');
	}

	try {
		await updateStatus(id, status as BugReportStatus);
	} catch (err) {
		if (err instanceof ApiError && err.status === 404) throw error(404, 'Report not found');
		throw error(500, 'Failed to update status');
	}

	return json({ success: true });
};

export const DELETE: RequestHandler = async ({ params }) => {
	const id = Number(params.id);
	if (isNaN(id)) throw error(400, 'Invalid report ID');

	try {
		await deleteReport(id);
	} catch (err) {
		if (err instanceof ApiError && err.status === 404) throw error(404, 'Report not found');
		throw error(500, 'Failed to delete report');
	}

	return json({ success: true });
};
