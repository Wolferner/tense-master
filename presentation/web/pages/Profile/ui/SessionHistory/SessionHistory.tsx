'use client';

import type {
	AnswerWithExercise,
	SessionSummary,
} from '@/client/application/services/ProfileService';
import { Badge } from '@/presentation/components/ui/badge';
import { TENSE_LABELS } from '@/presentation/web/pages/TenseTrainer/logic/tenseLabels';
import { useState } from 'react';
import { SessionDetail } from './SessionDetail';

interface Props {
	summaries: SessionSummary[];
	getSessionAnswers: (sessionId: string) => AnswerWithExercise[];
}

export function SessionHistory({ summaries, getSessionAnswers }: Props) {
	const [openId, setOpenId] = useState<string | null>(null);

	if (summaries.length === 0) {
		return <p className='text-muted-foreground text-sm'>История пуста</p>;
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

				return (
					<div key={session.id} className='border-border bg-card rounded-xl border'>
						<button
							className='flex w-full items-start justify-between gap-4 p-4 text-left'
							onClick={() => setOpenId(isOpen ? null : session.id)}
						>
							<div className='flex flex-col gap-1'>
								<span className='text-foreground text-sm font-medium'>{date}</span>
								<div className='flex flex-wrap gap-1'>
									{session.tenses.map(t => (
										<Badge key={t} variant='outline' className='text-xs'>
											{TENSE_LABELS[t]}
										</Badge>
									))}
								</div>
							</div>
							<div className='text-muted-foreground shrink-0 text-right text-sm'>
								<p>
									{correct}/{total - skipped} верно
								</p>
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
