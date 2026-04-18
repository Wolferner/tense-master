import messages from '@/shared/i18n/messages/ru.json';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';
import { TenseBreakdown } from '../TenseBreakdown';

describe('TenseBreakdown', () => {
	it('shows empty placeholder when no stats', () => {
		render(
			<NextIntlClientProvider locale='ru' messages={messages}>
				<TenseBreakdown stats={[]} />
			</NextIntlClientProvider>,
		);
		expect(screen.getByText('Нет данных')).toBeInTheDocument();
	});

	it('renders tense label and accuracy for each entry', () => {
		render(
			<NextIntlClientProvider locale='ru' messages={messages}>
				<TenseBreakdown
					stats={[
						{ tense: 'PRESENT_SIMPLE', total: 10, correct: 8, accuracy: 80 },
						{ tense: 'PAST_SIMPLE', total: 5, correct: 2, accuracy: 40 },
					]}
				/>
			</NextIntlClientProvider>,
		);

		expect(screen.getByText('Present Simple')).toBeInTheDocument();
		expect(screen.getByText('Past Simple')).toBeInTheDocument();
		expect(screen.getByText('80%')).toBeInTheDocument();
		expect(screen.getByText('40%')).toBeInTheDocument();
	});

	it('sets bar width to accuracy percent via inline style', () => {
		const { container } = render(
			<NextIntlClientProvider locale='ru' messages={messages}>
				<TenseBreakdown
					stats={[{ tense: 'PRESENT_SIMPLE', total: 10, correct: 6, accuracy: 60 }]}
				/>
			</NextIntlClientProvider>,
		);
		const bar = container.querySelector<HTMLElement>('.bg-primary');
		expect(bar?.style.width).toBe('60%');
	});
});
