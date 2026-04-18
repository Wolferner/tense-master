import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import messages from '@/shared/i18n/messages/ru.json';
import { NextIntlClientProvider } from 'next-intl';

vi.mock('next/navigation', () => ({
	useRouter: vi.fn(() => ({
		replace: vi.fn(),
		push: vi.fn(),
		back: vi.fn(),
		forward: vi.fn(),
	})),
	usePathname: vi.fn(() => '/'),
	useSearchParams: vi.fn(() => new URLSearchParams()),
	useParams: vi.fn(() => ({})),
}));

vi.mock('next-intl/server', () => ({
	getTranslations: vi.fn(),
}));

// 🔹 Мокаем Link
vi.mock('@/shared/i18n/navigation', () => ({
	Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
		<a href={href}>{children}</a>
	),
}));

const renderWithIntl = (ui: React.ReactElement) =>
	render(
		<NextIntlClientProvider locale='ru' messages={messages}>
			{ui}
		</NextIntlClientProvider>,
	);

describe('HomePage', () => {
	//FIXME: Need to implement test
	it('need to implement tests', async () => {
		expect(true).toBe(true);
	});

	// it('renders the main heading', async () => {
	// 	const component = await HomePage();
	// 	renderWithIntl(component);
	// 	expect(
	// 		screen.getByRole('heading', { name: 'Практикуй английские времена офлайн' }),
	// 	).toBeInTheDocument();
	// });
	// it('renders the CTA link pointing to /tense-trainer', async () => {
	// 	const component = await HomePage();
	// 	renderWithIntl(component);
	// 	const cta = screen.getByRole('link', { name: 'Начать тренировку по английским временам' });
	// 	expect(cta).toBeInTheDocument();
	// 	expect(cta).toHaveAttribute('href', ROUTES.trainer);
	// });
	// it('renders a card for every reason', async () => {
	// 	const component = await HomePage();
	// 	renderWithIntl(component);
	// 	for (const reason of REASONS) {
	// 		expect(screen.getByText(reason.title)).toBeInTheDocument();
	// 	}
	// });
	// it('renders the privacy section heading', async () => {
	// 	const component = await HomePage();
	// 	renderWithIntl(component);
	// 	expect(screen.getByRole('heading', { name: 'Ваши данные остаются у вас' })).toBeInTheDocument();
	// });
	// it('renders all three privacy points', async () => {
	// 	const component = await HomePage();
	// 	renderWithIntl(component);
	// 	expect(screen.getByText('Локальное хранилище')).toBeInTheDocument();
	// 	expect(screen.getByText('Без слежки')).toBeInTheDocument();
	// 	expect(screen.getByText('Работает офлайн')).toBeInTheDocument();
	// });
});
