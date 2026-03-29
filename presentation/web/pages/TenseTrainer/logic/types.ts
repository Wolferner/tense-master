export type Step = 'select' | 'training';
export type TrainingMode = 'fixed' | 'infinite';
export type FixedLimit = (typeof FIXED_LIMITS)[number];

export const FIXED_LIMITS = [5, 10, 20] as const;
export const MODE_LABELS: Record<TrainingMode, string> = {
	fixed: 'Фиксированное количество',
	infinite: 'Бесконечный режим',
};
