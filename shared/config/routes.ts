export const ROUTES = {
	home: '/',
	trainer: '/tense-trainer',
	profile: '/profile',
} as const;

export const API_ROUTES = {
	exercises: {
		meta: '/api/exercises/meta',
		all: '/api/exercises/all',
	},
} as const;

export const NAV_ROUTES = [ROUTES.home, ROUTES.trainer, ROUTES.profile] as const;
