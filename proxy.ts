import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? '')
	.split(',')
	.map(o => o.trim())
	.filter(Boolean);

export function proxy(request: NextRequest) {
	const origin = request.headers.get('origin');

	if (origin && !allowedOrigins.includes(origin)) {
		return Response.json({ error: 'Forbidden' }, { status: 403 });
	}

	return NextResponse.next();
}

export const config = {
	matcher: '/api/:path*',
};
