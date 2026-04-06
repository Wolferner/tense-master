import { Tense, TenseType } from '@/domain/value-objects';
import { TENSES_GROUPS } from '@/shared/config/tenses';

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

export type ITenseGroup = {
	label: string;
	tenses: TenseType[];
};
export const TENSE_GROUPS: ITenseGroup[] = [
	{
		label: 'Present',
		tenses: TENSES_GROUPS.present,
	},
	{
		label: 'Past',
		tenses: TENSES_GROUPS.past,
	},
	{
		label: 'Future',
		tenses: TENSES_GROUPS.future,
	},
];
