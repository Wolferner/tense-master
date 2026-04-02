import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ModeSelector from '../ModeSelector';
import {
	FIXED_LIMITS,
	type FixedLimit,
	type TrainingMode,
} from '@/presentation/web/pages/TenseTrainer/logic/config';

const baseProps = {
	mode: 'fixed' as TrainingMode,
	fixedLimit: 10 as FixedLimit,
	onUpdate: vi.fn(),
};

describe('ModeSelector', () => {
	it('renders fixed and infinite mode buttons', () => {
		render(<ModeSelector {...baseProps} />);
		expect(screen.getByText('Фиксированное количество')).toBeInTheDocument();
		expect(screen.getByText('Бесконечный режим')).toBeInTheDocument();
	});

	it('calls onUpdate with {mode: "infinite"} when infinite button is clicked', async () => {
		const user = userEvent.setup();
		const onUpdate = vi.fn();
		render(<ModeSelector {...baseProps} onUpdate={onUpdate} />);
		await user.click(screen.getByText('Бесконечный режим'));
		expect(onUpdate).toHaveBeenCalledWith({ mode: 'infinite' });
	});

	it('calls onUpdate with {mode: "fixed"} when fixed button is clicked', async () => {
		const user = userEvent.setup();
		const onUpdate = vi.fn();
		render(<ModeSelector {...baseProps} mode='infinite' onUpdate={onUpdate} />);
		await user.click(screen.getByText('Фиксированное количество'));
		expect(onUpdate).toHaveBeenCalledWith({ mode: 'fixed' });
	});

	it('renders all limit buttons', () => {
		render(<ModeSelector {...baseProps} />);
		for (const limit of FIXED_LIMITS) {
			expect(screen.getByText(String(limit))).toBeInTheDocument();
		}
	});

	it('calls onUpdate with the correct limit when a limit button is clicked', async () => {
		const user = userEvent.setup();
		const onUpdate = vi.fn();
		render(<ModeSelector {...baseProps} onUpdate={onUpdate} />);
		await user.click(screen.getByText('10'));
		expect(onUpdate).toHaveBeenCalledWith({ limit: 10 });
	});
});
