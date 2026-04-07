'use client';

import type {
	AnswerWithExercise,
	SessionSummary,
} from '@/client/application/services/ProfileService';
import { Badge } from '@/presentation/components/ui/badge';
import { TENSES_GROUPS } from '@/shared/config/tenses';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { TENSE_LABELS } from '../../../TenseTrainer/logic/tenseLabels';
import { SessionDetail } from './SessionDetail';

interface Props {
	summaries: SessionSummary[];
	getSessionAnswers: (sessionId: string) => AnswerWithExercise[];
}

export function SessionHistory({ summaries, getSessionAnswers }: Props) {
	const t = useTranslations('profile');
	const locale = useLocale();

	const [openId, setOpenId] = useState<string | null>(null);

	if (summaries.length === 0) {
		return <p className='text-muted-foreground text-sm'>{t('emptyHistory')}</p>;
	}

	return (
		<div className='flex flex-col gap-3'>
			{summaries.map(({ session, total, correct, skipped, accuracy }) => {
				const isOpen = openId === session.id;
				const date = new Date(session.createdAt).toLocaleDateString('ru-RU', {
					day: 'numeric',
					month: 'short',
					hour: '2-digit',
					minute: '2-digit',
				});

				const groupDefs = [
					{ labelKey: 'presentTenses' as const, tenses: TENSES_GROUPS.present },
					{ labelKey: 'pastTenses' as const, tenses: TENSES_GROUPS.past },
					{ labelKey: 'futureTenses' as const, tenses: TENSES_GROUPS.future },
				];

				const groupedTenses = new Set<string>();
				const groupLabels: string[] = [];

				const allTenses = session.tenses.length === 12;

				if (!allTenses) {
					groupDefs.forEach(({ labelKey, tenses }) => {
						if (tenses.every(t => session.tenses.includes(t))) {
							groupLabels.push(t(labelKey));
							tenses.forEach(t => groupedTenses.add(t));
						}
					});
				}

				const finalTenses = allTenses
					? [t('allTenses')]
					: [
							...groupLabels,
							...session.tenses.filter(t => !groupedTenses.has(t)).map(t => TENSE_LABELS[t]),
						];

				return (
					<div key={session.id} className='border-border bg-card rounded-xl border'>
						<button
							className='flex w-full items-start justify-between gap-4 p-4 text-left'
							onClick={() => setOpenId(isOpen ? null : session.id)}
						>
							<div className='flex flex-col gap-1'>
								<span className='text-foreground text-sm font-medium'>{date}</span>
								<div className='flex flex-wrap gap-1'>
									{finalTenses.map(label => (
										<Badge key={label} variant='outline' className='text-xs'>
											{label}
										</Badge>
									))}
								</div>
							</div>
							<div className='text-muted-foreground shrink-0 text-right text-sm'>
								<p>{t('sessionCorrect', { correct, attempted: total - skipped })}</p>
								<p>{accuracy}%</p>
							</div>
						</button>

						{isOpen && (
							<div className='border-border border-t px-4 pb-4'>
								<SessionDetail answers={getSessionAnswers(session.id)} />
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
}
