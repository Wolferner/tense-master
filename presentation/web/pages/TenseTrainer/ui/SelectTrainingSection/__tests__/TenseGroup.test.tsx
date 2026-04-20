import { Tense } from '@/domain/value-objects';
import { type ITenseGroup } from '@/presentation/web/pages/TenseTrainer/logic/tenseLabels';
import messages from '@/shared/i18n/messages/ru.json';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';
import TenseGroup from '../TenseGroup';

const group: ITenseGroup = {
	label: 'Present',
	tenses: [Tense.PRESENT_SIMPLE, Tense.PRESENT_CONTINUOUS],
};

const baseProps = {
	group,
	selectedTenses: [] as Tense[],
	onToggle: vi.fn(),
	onToggleGroup: vi.fn(),
};

describe('TenseGroup', () => {
	it('shows the group label', () => {
		render(
			<NextIntlClientProvider locale='ru' messages={messages}>
				<TenseGroup {...baseProps} />
			</NextIntlClientProvider>,
		);
		expect(screen.getByText('Present')).toBeInTheDocument();
	});

	it('shows "Выбрать все" when not all tenses are selected', () => {
		render(
			<NextIntlClientProvider locale='ru' messages={messages}>
				<TenseGroup {...baseProps} selectedTenses={[Tense.PRESENT_SIMPLE]} />
			</NextIntlClientProvider>,
		);
		expect(screen.getByRole('button')).toHaveTextContent('Выбрать все');
	});

	it('shows "Снять" when all tenses are selected', () => {
		render(
			<NextIntlClientProvider locale='ru' messages={messages}>
				<TenseGroup
					{...baseProps}
					selectedTenses={[Tense.PRESENT_SIMPLE, Tense.PRESENT_CONTINUOUS]}
				/>
			</NextIntlClientProvider>,
		);
		expect(screen.getByRole('button')).toHaveTextContent('Снять');
	});

	it('calls onToggleGroup with the group tenses when toggle button is clicked', async () => {
		const user = userEvent.setup();
		const onToggleGroup = vi.fn();
		render(
			<NextIntlClientProvider locale='ru' messages={messages}>
				<TenseGroup {...baseProps} onToggleGroup={onToggleGroup} />
			</NextIntlClientProvider>,
		);
		await user.click(screen.getByRole('button'));
		expect(onToggleGroup).toHaveBeenCalledWith(group.tenses);
	});

	it('renders a tense item for each tense in the group', () => {
		render(
			<NextIntlClientProvider locale='ru' messages={messages}>
				<TenseGroup {...baseProps} />
			</NextIntlClientProvider>,
		);
		expect(screen.getByText('Present Simple')).toBeInTheDocument();
		expect(screen.getByText('Present Continuous')).toBeInTheDocument();
	});

	it('calls onToggle with the correct tense when a checkbox is clicked', async () => {
		const user = userEvent.setup();
		const onToggle = vi.fn();
		render(
			<NextIntlClientProvider locale='ru' messages={messages}>
				<TenseGroup {...baseProps} onToggle={onToggle} />
			</NextIntlClientProvider>,
		);
		const checkboxes = screen.getAllByRole('checkbox');
		await user.click(checkboxes[0]);
		expect(onToggle).toHaveBeenCalledWith(Tense.PRESENT_SIMPLE);
	});
});
