import { withSerwist } from '@serwist/turbopack';
import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./shared/i18n/request.ts');

const nextConfig: NextConfig = {};

export default withNextIntl(withSerwist(nextConfig));
