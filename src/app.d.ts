import type { DashboardUser } from '$lib/server/auth';

declare global {
	namespace App {
		interface Locals {
			user: DashboardUser | null;
			session: string | null;
			dbEnv: 'prod' | 'test';
		}
	}
}

export {};
