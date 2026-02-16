
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/api" | "/api/reports" | "/api/reports/refresh" | "/api/reports/[id]" | "/api/reports/[id]/download" | "/api/reports/[id]/files" | "/api/reports/[id]/files/[fileId]" | "/login" | "/logout" | "/reports" | "/reports/[id]" | "/users";
		RouteParams(): {
			"/api/reports/[id]": { id: string };
			"/api/reports/[id]/download": { id: string };
			"/api/reports/[id]/files": { id: string };
			"/api/reports/[id]/files/[fileId]": { id: string; fileId: string };
			"/reports/[id]": { id: string }
		};
		LayoutParams(): {
			"/": { id?: string; fileId?: string };
			"/api": { id?: string; fileId?: string };
			"/api/reports": { id?: string; fileId?: string };
			"/api/reports/refresh": Record<string, never>;
			"/api/reports/[id]": { id: string; fileId?: string };
			"/api/reports/[id]/download": { id: string };
			"/api/reports/[id]/files": { id: string; fileId?: string };
			"/api/reports/[id]/files/[fileId]": { id: string; fileId: string };
			"/login": Record<string, never>;
			"/logout": Record<string, never>;
			"/reports": { id?: string };
			"/reports/[id]": { id: string };
			"/users": Record<string, never>
		};
		Pathname(): "/" | "/api" | "/api/" | "/api/reports" | "/api/reports/" | "/api/reports/refresh" | "/api/reports/refresh/" | `/api/reports/${string}` & {} | `/api/reports/${string}/` & {} | `/api/reports/${string}/download` & {} | `/api/reports/${string}/download/` & {} | `/api/reports/${string}/files` & {} | `/api/reports/${string}/files/` & {} | `/api/reports/${string}/files/${string}` & {} | `/api/reports/${string}/files/${string}/` & {} | "/login" | "/login/" | "/logout" | "/logout/" | "/reports" | "/reports/" | `/reports/${string}` & {} | `/reports/${string}/` & {} | "/users" | "/users/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): string & {};
	}
}