import { exerciseController } from '@/server/infrastructure/http/container';

export const revalidate = 3600;

export async function GET() {
	return exerciseController.getMeta();
}
