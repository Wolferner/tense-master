'use client';

import {
	type AnswerWithExercise,
	type OverallStats,
	type SessionSummary,
	type TenseStat,
} from '@/client/application/services/ProfileService';
import {
	answerRepository,
	exerciseLocalRepository,
	profileService,
	sessionRepository,
} from '@/client/infrastructure/container';
import { useLiveQuery } from 'dexie-react-hooks';

type ProfileData = {
	overallStats: OverallStats;
	tenseStats: TenseStat[];
	sessionSummaries: SessionSummary[];
	getSessionAnswers: (sessionId: string) => AnswerWithExercise[];
	isLoading: boolean;
};

export function useProfileData(): ProfileData {
	const data = useLiveQuery(async () => {
		const [sessions, answers, exercises] = await Promise.all([
			sessionRepository.findAll(),
			answerRepository.findAll(),
			exerciseLocalRepository.findAll(),
		]);
		return { sessions, answers, exercises };
	});

	if (!data) {
		return {
			overallStats: { total: 0, correct: 0, skipped: 0, accuracy: 0 },
			tenseStats: [],
			sessionSummaries: [],
			getSessionAnswers: () => [],
			isLoading: true,
		};
	}

	const { sessions, answers, exercises } = data;
	const allAnswersWithExercise = profileService.joinAnswersWithExercises(answers, exercises);

	return {
		overallStats: profileService.getOverallStats(answers),
		tenseStats: profileService.getTenseStats(answers, exercises),
		sessionSummaries: profileService.getSessionSummaries(sessions, answers),
		getSessionAnswers: (sessionId: string) =>
			allAnswersWithExercise.filter(a => a.sessionId === sessionId),
		isLoading: false,
	};
}
