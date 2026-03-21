import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const res = await {
			message:
				'This is the exercises API endpoint. You can use this endpoint to fetch exercises data.',
		};
		return NextResponse.json(res, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: 'Failed to fetch billing info' }, { status: 500 });
	}
}
