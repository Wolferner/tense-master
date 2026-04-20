import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './shared/i18n/config';

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? '')
	.split(';')
	.map(o => o.trim())
	.filter(Boolean);
const handleI18nRouting = createMiddleware(routing);

export default function proxy(request: NextRequest) {
	const origin = request.headers.get('origin');
	const isOriginNotAllowed =
		origin && allowedOrigins.length > 0 && !allowedOrigins.includes(origin);
	if (isOriginNotAllowed) {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	}

	if (request.nextUrl.pathname.startsWith('/api')) {
		return NextResponse.next();
	}

	return handleI18nRouting(request);
}

export const config = {
	matcher: ['/((?!_next|telegram|.*\\..*).*)'],
};
