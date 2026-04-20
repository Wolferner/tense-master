import { NextRequest } from 'next/server';
import { exerciseController } from '@/server/infrastructure/http/container';

export const revalidate = 3600;

export async function GET(req: NextRequest) {
	return exerciseController.getAll(req);
}
