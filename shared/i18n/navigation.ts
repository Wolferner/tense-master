import { createNavigation } from 'next-intl/navigation';
import { routing } from './config';

export const { Link, useRouter, usePathname, redirect } = createNavigation(routing);
