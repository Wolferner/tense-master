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

export const TENSE_GROUPS: { label: string; tenses: TenseType[] }[] = [
	{
		label: 'Present',
		tenses: [
			Tense.PRESENT_SIMPLE,
			Tense.PRESENT_CONTINUOUS,
			Tense.PRESENT_PERFECT,
			Tense.PRESENT_PERFECT_CONTINUOUS,
		],
	},
	{
		label: 'Past',
		tenses: [
			Tense.PAST_SIMPLE,
			Tense.PAST_CONTINUOUS,
			Tense.PAST_PERFECT,
			Tense.PAST_PERFECT_CONTINUOUS,
		],
	},
	{
		label: 'Future',
		tenses: [
			Tense.FUTURE_SIMPLE,
			Tense.FUTURE_CONTINUOUS,
			Tense.FUTURE_PERFECT,
			Tense.FUTURE_PERFECT_CONTINUOUS,
		],
	},
];
