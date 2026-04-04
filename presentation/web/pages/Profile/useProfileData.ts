'use client';

import { ProfileStats } from '@/client/application/services/ProfileService';
import { profileService } from '@/client/infrastructure/container';

import { useEffect, useState } from 'react';

type ProfileData = ProfileStats & {
	isLoading: boolean;
};

export function useProfileData(): ProfileData {
	const [stats, setStats] = useState<ProfileStats | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		profileService
			.getProfileStats()
			.then(setStats)
			.finally(() => setIsLoading(false));
	}, []);

	if (!stats) {
		return {
			overallStats: { total: 0, correct: 0, skipped: 0, accuracy: 0 },
			tenseStats: [],
			sessionSummaries: [],
			getSessionAnswers: () => [],
			isLoading: true,
		};
	}

	return {
		...stats,
		isLoading,
	};
}
