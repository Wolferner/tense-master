import { type ITenseGroup } from '@/presentation/web/pages/TenseTrainer/logic/tenseLabels';
import { Tense } from '@/server/domain/value-objects';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
		render(<TenseGroup {...baseProps} />);
		expect(screen.getByText('Present')).toBeInTheDocument();
	});

	it('shows "Выбрать все" when not all tenses are selected', () => {
		render(<TenseGroup {...baseProps} selectedTenses={[Tense.PRESENT_SIMPLE]} />);
		expect(screen.getByRole('button')).toHaveTextContent('Выбрать все');
	});

	it('shows "Снять" when all tenses are selected', () => {
		render(
			<TenseGroup
				{...baseProps}
				selectedTenses={[Tense.PRESENT_SIMPLE, Tense.PRESENT_CONTINUOUS]}
			/>,
		);
		expect(screen.getByRole('button')).toHaveTextContent('Снять');
	});

	it('calls onToggleGroup with the group when toggle button is clicked', async () => {
		const user = userEvent.setup();
		const onToggleGroup = vi.fn();
		render(<TenseGroup {...baseProps} onToggleGroup={onToggleGroup} />);
		await user.click(screen.getByRole('button'));
		expect(onToggleGroup).toHaveBeenCalledWith(group);
	});

	it('renders a tense item for each tense in the group', () => {
		render(<TenseGroup {...baseProps} />);
		expect(screen.getByText('Present Simple')).toBeInTheDocument();
		expect(screen.getByText('Present Continuous')).toBeInTheDocument();
	});

	it('calls onToggle with the correct tense when a checkbox is clicked', async () => {
		const user = userEvent.setup();
		const onToggle = vi.fn();
		render(<TenseGroup {...baseProps} onToggle={onToggle} />);
		const checkboxes = screen.getAllByRole('checkbox');
		await user.click(checkboxes[0]);
		expect(onToggle).toHaveBeenCalledWith(Tense.PRESENT_SIMPLE);
	});
});
