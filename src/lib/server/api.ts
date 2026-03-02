import { SERVER_URL, API_KEY, ADMIN_KEY } from '$env/static/private';

export type BugReportStatus = 'new' | 'in_review' | 'resolved' | 'closed';

export interface DashboardUser {
	id: string;
	username: string;
	role: 'admin' | 'user';
	displayname: string;
	enabled: boolean;
}

export interface BugReportListItem {
	id: number;
	name: string;
	email: string;
	description: string;
	hwid: string;
	hostname: string;
	os_user: string;
	submitter_ip: string;
	status: BugReportStatus;
	created_at: string;
	updated_at: string;
	file_count: number;
}

export interface BugReportFile {
	id: number;
	report_id: number;
	file_role: string;
	filename: string;
	mime_type: string;
	file_size: number;
	created_at: string;
}

export interface BugReport {
	id: number;
	name: string;
	email: string;
	description: string;
	hwid: string;
	hostname: string;
	os_user: string;
	submitter_ip: string;
	system_info: string | null;
	status: BugReportStatus;
	created_at: string;
	updated_at: string;
}

export interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}

export interface User {
	id: string;
	username: string;
	displayname: string;
	role: 'admin' | 'user';
	enabled: boolean;
	created_at: string;
}

function baseHeaders(sessionId?: string): Record<string, string> {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		'X-Api-Key': API_KEY,
		'X-Admin-Key': ADMIN_KEY
	};
	if (sessionId) {
		headers['X-Session-Token'] = sessionId;
	}
	return headers;
}

async function apiFetch<T>(
	path: string,
	options: RequestInit & { sessionId?: string } = {}
): Promise<T> {
	const { sessionId, ...fetchOptions } = options;

	const res = await fetch(`${SERVER_URL}${path}`, {
		...fetchOptions,
		headers: {
			...baseHeaders(sessionId),
			...(fetchOptions.headers as Record<string, string> | undefined)
		}
	});

	if (!res.ok) {
		const body = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
		throw new ApiError(res.status, body.message ?? `HTTP ${res.status}`);
	}

	return res.json() as Promise<T>;
}

export class ApiError extends Error {
	constructor(
		public readonly status: number,
		message: string
	) {
		super(message);
	}
}

// Auth
export async function login(
	username: string,
	password: string
): Promise<{ session_id: string; user: DashboardUser }> {
	return apiFetch('/api/admin/auth/login', {
		method: 'POST',
		body: JSON.stringify({ username, password })
	});
}

export async function logout(sessionId: string): Promise<void> {
	await apiFetch('/api/admin/auth/logout', {
		method: 'POST',
		sessionId
	});
}

export async function validateSession(
	sessionId: string
): Promise<{ user: DashboardUser } | null> {
	try {
		return await apiFetch('/api/admin/auth/validate', { sessionId });
	} catch (err) {
		if (err instanceof ApiError && err.status === 401) return null;
		throw err;
	}
}

// Bug reports
export async function listReports(opts: {
	page: number;
	pageSize: number;
	status?: string;
	search?: string;
}): Promise<PaginatedResponse<BugReportListItem>> {
	const params = new URLSearchParams();
	params.set('page', String(opts.page));
	params.set('pageSize', String(opts.pageSize));
	if (opts.status) params.set('status', opts.status);
	if (opts.search) params.set('search', opts.search);
	return apiFetch(`/api/admin/bug-reports?${params}`);
}

export async function countNewReports(): Promise<number> {
	const res = await apiFetch<{ count: number }>('/api/admin/bug-reports/count');
	return res.count;
}

export async function getReport(
	id: number
): Promise<{ report: BugReport; files: BugReportFile[] }> {
	return apiFetch(`/api/admin/bug-reports/${id}`);
}

export async function updateStatus(id: number, status: BugReportStatus): Promise<void> {
	await apiFetch(`/api/admin/bug-reports/${id}/status`, {
		method: 'PATCH',
		body: JSON.stringify({ status })
	});
}

export async function deleteReport(id: number): Promise<void> {
	await apiFetch(`/api/admin/bug-reports/${id}`, { method: 'DELETE' });
}

export async function downloadZip(id: number): Promise<Response> {
	const res = await fetch(`${SERVER_URL}/api/admin/bug-reports/${id}/download`, {
		headers: {
			'X-Admin-Key': ADMIN_KEY,
			'X-Api-Key': API_KEY
		}
	});
	if (!res.ok) throw new ApiError(res.status, `HTTP ${res.status}`);
	return res;
}

export async function getFile(reportId: number, fileId: number): Promise<Response> {
	const res = await fetch(`${SERVER_URL}/api/admin/bug-reports/${reportId}/files/${fileId}`, {
		headers: {
			'X-Admin-Key': ADMIN_KEY,
			'X-Api-Key': API_KEY
		}
	});
	if (!res.ok) throw new ApiError(res.status, `HTTP ${res.status}`);
	return res;
}

// Users
export async function listUsers(): Promise<User[]> {
	return apiFetch('/api/admin/users');
}

export async function createUser(data: {
	username: string;
	displayname: string;
	password: string;
	role: 'admin' | 'user';
}): Promise<{ success: boolean; user: User }> {
	return apiFetch('/api/admin/users', {
		method: 'POST',
		body: JSON.stringify(data)
	});
}

export async function updateUser(
	id: string,
	data: { displayname?: string; enabled?: boolean }
): Promise<void> {
	await apiFetch(`/api/admin/users/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(data)
	});
}

export async function resetPassword(id: string, password: string): Promise<void> {
	await apiFetch(`/api/admin/users/${id}/reset-password`, {
		method: 'POST',
		body: JSON.stringify({ password })
	});
}

export async function deleteUser(id: string): Promise<void> {
	try {		
		await apiFetch(`/api/admin/users/${id}`, {
			method: 'DELETE'
		});
	} catch (err) {
		console.log("Error in deleteUser API call:", err);
		if (err instanceof ApiError && err.status === 400) {
			throw new ApiError(400, err.message);
		}
		throw err;
	}
}
