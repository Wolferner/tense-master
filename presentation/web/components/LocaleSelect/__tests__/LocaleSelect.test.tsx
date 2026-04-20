import messages from '@/shared/i18n/messages/ru.json';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/i18n/navigation', () => ({
	usePathname: vi.fn(() => '/'),
}));

import { usePathname } from '@/shared/i18n/navigation';
import LocaleSelect from '../LocaleSelect';

const renderSelect = (locale = 'ru') =>
	render(
		<NextIntlClientProvider locale={locale} messages={messages}>
			<LocaleSelect />
		</NextIntlClientProvider>,
	);

describe('LocaleSelect', () => {
	it('renders the trigger with aria-label', () => {
		renderSelect();
		expect(screen.getByRole('combobox', { name: 'Выбор языка' })).toBeInTheDocument();
	});

	it('shows short label on the trigger', () => {
		renderSelect('ru');
		expect(screen.getByText('RU')).toBeInTheDocument();
	});

	it('shows full label on the trigger', () => {
		renderSelect('ru');
		expect(screen.getByText('Русский')).toBeInTheDocument();
	});

	it('lists all locale options when opened', async () => {
		renderSelect();
		await userEvent.click(screen.getByRole('combobox'));
		expect(screen.getByRole('option', { name: 'Русский' })).toBeInTheDocument();
		expect(screen.getByRole('option', { name: 'Français' })).toBeInTheDocument();
		expect(screen.getByRole('option', { name: 'Deutsch' })).toBeInTheDocument();
		expect(screen.getByRole('option', { name: 'Español' })).toBeInTheDocument();
	});

	it('navigates to selected locale on change', async () => {
		vi.mocked(usePathname).mockReturnValue('/tense-trainer');
		const assignMock = vi.fn();
		Object.defineProperty(window, 'location', {
			value: { href: '' },
			writable: true,
		});
		Object.defineProperty(window.location, 'href', {
			set: assignMock,
			configurable: true,
		});

		renderSelect('ru');
		await userEvent.click(screen.getByRole('combobox'));
		await userEvent.click(screen.getByRole('option', { name: 'Français' }));

		expect(assignMock).toHaveBeenCalledWith('/fr/tense-trainer');
	});

	it('navigates to root when pathname is /', async () => {
		vi.mocked(usePathname).mockReturnValue('/');
		const assignMock = vi.fn();
		Object.defineProperty(window, 'location', {
			value: { href: '' },
			writable: true,
		});
		Object.defineProperty(window.location, 'href', {
			set: assignMock,
			configurable: true,
		});

		renderSelect('ru');
		await userEvent.click(screen.getByRole('combobox'));
		await userEvent.click(screen.getByRole('option', { name: 'Deutsch' }));

		expect(assignMock).toHaveBeenCalledWith('/de');
	});
});
