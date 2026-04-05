import { NextRequest } from 'next/server';
import { exerciseController } from '@/server/infrastructure/http/container';

export async function GET(req: NextRequest) {
	return exerciseController.getRandom(req);
}
