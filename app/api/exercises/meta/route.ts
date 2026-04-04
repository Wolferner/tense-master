import { exerciseController } from '@/server/infrastructure/http/container';

export async function GET() {
	return exerciseController.getMeta();
}
