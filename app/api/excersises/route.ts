import { NextRequest } from 'next/server';
import { exerciseController } from '@/server/infastructure/http/container';

export async function GET(req: NextRequest) {
	return exerciseController.getRandom(req);
}
