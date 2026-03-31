import { createSerwistRoute } from '@serwist/turbopack';

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } = createSerwistRoute(
	{
		swSrc: 'shared/pwa/sw.ts',
		useNativeEsbuild: true,
	},
);
