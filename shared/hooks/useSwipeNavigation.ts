import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useEffectEvent } from 'react';

const MINIMUM_SWIPE_DISTANCE = 80;

export function useSwipeNavigation(routes: string[]) {
	const router = useRouter();
	const pathname = usePathname();

	const onTouchEndHandler = useEffectEvent((e: TouchEvent, startX: number) => {
		const diff = startX - e.changedTouches[0].clientX;
		if (Math.abs(diff) < MINIMUM_SWIPE_DISTANCE) return;

		const currentPathIndex = routes.indexOf(pathname); // if pathname is not in routes, current will be -1, so no navigation will happen

		if (diff > 0 && currentPathIndex < routes.length - 1) {
			// swipe left - if not on the last route navigate to the next one
			router.push(routes[currentPathIndex + 1]);
		} else if (diff < 0 && currentPathIndex > 0) {
			// swipe right - if not on the first route navigate to the previous one
			router.push(routes[currentPathIndex - 1]);
		}
	});

	useEffect(() => {
		let startX = 0;

		const onTouchStart = (e: TouchEvent) => {
			startX = e.touches[0].clientX;
		};

		const onTouchEnd = (e: TouchEvent) => onTouchEndHandler(e, startX);

		document.addEventListener('touchstart', onTouchStart);
		document.addEventListener('touchend', onTouchEnd);
		return () => {
			document.removeEventListener('touchstart', onTouchStart);
			document.removeEventListener('touchend', onTouchEnd);
		};
	}, []);
}
