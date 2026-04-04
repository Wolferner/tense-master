'use client';

import { StatsOverview } from './ui/StatsOverview/StatsOverview';
import { TenseBreakdown } from './ui/TenseBreakdown/TenseBreakdown';
import { SessionHistory } from './ui/SessionHistory/SessionHistory';
import { useProfileData } from './useProfileData';

const ProfilePage = () => {
	const { overallStats, tenseStats, sessionSummaries, getSessionAnswers, isLoading } =
		useProfileData();

	if (isLoading) {
		return (
			<main className='flex flex-1 items-center justify-center'>
				<p className='text-muted-foreground text-sm'>Загрузка...</p>
			</main>
		);
	}

	return (
		<main className='bg-background text-foreground flex flex-1 flex-col'>
			<div className='mx-auto flex w-full max-w-2xl flex-col gap-10 px-6 py-16'>
				<section>
					<h2 className='text-foreground mb-4 text-lg font-semibold'>Общая статистика</h2>
					<StatsOverview stats={overallStats} />
				</section>

				<section>
					<h2 className='text-foreground mb-4 text-lg font-semibold'>По временам</h2>
					<TenseBreakdown stats={tenseStats} />
				</section>

				<section>
					<h2 className='text-foreground mb-4 text-lg font-semibold'>История сессий</h2>
					<SessionHistory summaries={sessionSummaries} getSessionAnswers={getSessionAnswers} />
				</section>
			</div>
		</main>
	);
};

export default ProfilePage;
