import { Tense, TenseType } from '@/server/domain/value-objects';

export const TENSE_LABELS: Record<TenseType, string> = {
	[Tense.PRESENT_SIMPLE]: 'Present Simple',
	[Tense.PRESENT_CONTINUOUS]: 'Present Continuous',
	[Tense.PRESENT_PERFECT]: 'Present Perfect',
	[Tense.PRESENT_PERFECT_CONTINUOUS]: 'Present Perfect Continuous',
	[Tense.PAST_SIMPLE]: 'Past Simple',
	[Tense.PAST_CONTINUOUS]: 'Past Continuous',
	[Tense.PAST_PERFECT]: 'Past Perfect',
	[Tense.PAST_PERFECT_CONTINUOUS]: 'Past Perfect Continuous',
	[Tense.FUTURE_SIMPLE]: 'Future Simple',
	[Tense.FUTURE_CONTINUOUS]: 'Future Continuous',
	[Tense.FUTURE_PERFECT]: 'Future Perfect',
	[Tense.FUTURE_PERFECT_CONTINUOUS]: 'Future Perfect Continuous',
};
