export type Step = 'select' | 'training' | 'result';
export type SessionMode = 'fixed' | 'infinite';
export const FIXED_LIMITS = [5, 10, 20] as const;
export type FixedLimit = (typeof FIXED_LIMITS)[number];
export const MODE_LABELS: Record<SessionMode, string> = {
	fixed: 'Фиксированное количество',
	infinite: 'Бесконечный режим',
};
