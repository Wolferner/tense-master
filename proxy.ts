import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { routing } from './shared/i18n/config';

const handleI18nRouting = createMiddleware(routing);

export function proxy(request: NextRequest) {
	return handleI18nRouting(request);
}

export const config = {
	matcher: ['/((?!api|_next|telegram|.*\..*).*) '],
};
