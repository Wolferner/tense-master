import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { routing } from './shared/i18n/config';

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? '')
	.split(';')
	.map(o => o.trim())
	.filter(Boolean);

const handleI18nRouting = createMiddleware(routing);

export function proxy(request: NextRequest) {
	const origin = request.headers.get('origin');

	if (origin && !allowedOrigins.includes(origin)) {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	}

	return handleI18nRouting(request);
}

export const config = {
	matcher: ['/((?!api|_next|telegram|.*\\..*).*)'],
};
