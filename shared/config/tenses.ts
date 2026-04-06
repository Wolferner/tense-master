import { Tense } from '@/domain/value-objects';

export const TENSES_GROUPS = {
	present: [
		Tense.PRESENT_SIMPLE,
		Tense.PRESENT_CONTINUOUS,
		Tense.PRESENT_PERFECT,
		Tense.PRESENT_PERFECT_CONTINUOUS,
	],
	past: [
		Tense.PAST_SIMPLE,
		Tense.PAST_CONTINUOUS,
		Tense.PAST_PERFECT,
		Tense.PAST_PERFECT_CONTINUOUS,
	],
	future: [
		Tense.FUTURE_SIMPLE,
		Tense.FUTURE_CONTINUOUS,
		Tense.FUTURE_PERFECT,
		Tense.FUTURE_PERFECT_CONTINUOUS,
	],
};
