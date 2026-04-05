import type { TenseType } from '@/domain/value-objects';
import type { FixedLimit, TrainingMode } from '@/shared/config/training';

export class Session {
	constructor(
		readonly id: string,
		readonly tenses: TenseType[],
		readonly mode: TrainingMode,
		readonly fixedLimit: FixedLimit,
		readonly status: 'active' | 'completed',
		readonly createdAt: string,
		readonly completedAt?: string,
	) {}
}
