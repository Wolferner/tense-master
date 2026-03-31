'use client';

import { useEffect, useState } from 'react';

type NetworkInformation = {
	effectiveType: string;
	rtt: number;
	downlink: number;
	addEventListener: (type: string, cb: () => void) => void;
	removeEventListener: (type: string, cb: () => void) => void;
};

declare global {
	interface Navigator {
		connection?: NetworkInformation;
	}
}

export function useConnection() {
	const [conn, setConn] = useState(getInitialConnectionState);

	useEffect(() => {
		const update = () => setConn(getInitialConnectionState());

		window.addEventListener('online', update);
		window.addEventListener('offline', update);
		navigator.connection?.addEventListener('change', update);

		return () => {
			window.removeEventListener('online', update);
			window.removeEventListener('offline', update);
			navigator.connection?.removeEventListener('change', update);
		};
	}, []);

	return conn;
}

const getInitialConnectionState = () => {
	if (!navigator.onLine) return { status: 'offline' };

	const c = navigator.connection;
	if (c) {
		const isSlowConnection =
			['slow-2g', '2g'].includes(c.effectiveType) || c.rtt > 800 || c.downlink < 0.5;

		if (isSlowConnection)
			return {
				status: 'slow',
				type: c.effectiveType,
				rtt: c.rtt,
				downlink: c.downlink,
			};
	}

	return { status: 'online' };
};
