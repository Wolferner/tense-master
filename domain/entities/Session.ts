import type { TenseType } from '@/domain/value-objects';
import type { FixedLimit, TrainingMode } from '@/shared/config/training';

export type Session = {
	id: string;
	tenses: TenseType[];
	mode: TrainingMode;
	fixedLimit: FixedLimit;
	status: 'active' | 'completed';
	createdAt: string;
	completedAt?: string;
};
