'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'pwa-install-dismissed';

export function useInstallPrompt() {
	const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
	const [isInstalled, setIsInstalled] = useState(false);
	const [isDismissed, setIsDismissed] = useState(false);

	useEffect(() => {
		// уже установлено
		if (window.matchMedia('(display-mode: standalone)').matches) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setIsInstalled(true);
			return;
		}

		// пользователь ранее закрыл баннер
		if (localStorage.getItem(DISMISSED_KEY)) {
			setIsDismissed(true);
		}

		const handler = (e: Event) => {
			e.preventDefault();
			setPromptEvent(e as BeforeInstallPromptEvent);
		};

		const installedHandler = () => {
			setIsInstalled(true);
			setPromptEvent(null);
		};

		window.addEventListener('beforeinstallprompt', handler);
		window.addEventListener('appinstalled', installedHandler);

		return () => {
			window.removeEventListener('beforeinstallprompt', handler);
			window.removeEventListener('appinstalled', installedHandler);
		};
	}, []);

	const install = async () => {
		if (!promptEvent) return;
		await promptEvent.prompt();
		const { outcome } = await promptEvent.userChoice;
		if (outcome === 'accepted') {
			setIsInstalled(true);
			setPromptEvent(null);
		}
	};

	const dismiss = () => {
		localStorage.setItem(DISMISSED_KEY, '1');
		setIsDismissed(true);
		setPromptEvent(null);
	};

	return {
		canInstall: !!promptEvent && !isInstalled && !isDismissed,
		isInstalled,
		install,
		dismiss,
	};
}
