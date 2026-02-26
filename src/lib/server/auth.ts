export const SESSION_COOKIE_NAME = 'emly_session';

export interface DashboardUser {
	id: string;
	username: string;
	role: 'admin' | 'user';
	displayname: string;
	enabled: boolean;
}
