import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import TaskResult from '../TaskResult';
import { Tense } from '@/server/domain/value-objects';
import { type ExerciseResponseDto } from '@/server/aplication/exercise';

const exercise: ExerciseResponseDto = {
	id: 'ex-1',
	tense: Tense.PRESENT_SIMPLE,
	question: 'Он читает книгу',
	answer: 'He reads a book',
	explanation: 'Present Simple for habits',
	createdAt: new Date(),
	updatedAt: new Date(),
};

const baseProps = {
	current: exercise,
	isLoading: false,
	mode: 'fixed' as const,
	currentIndex: 0,
	totalExercises: 3,
	onNext: vi.fn(),
};

describe('TaskResult', () => {
	it('renders the correct answer and explanation', () => {
		render(<TaskResult {...baseProps} />);
		expect(screen.getByText('He reads a book')).toBeInTheDocument();
		expect(screen.getByText('Present Simple for habits')).toBeInTheDocument();
	});

	it('shows "Загрузка..." when isLoading is true', () => {
		render(<TaskResult {...baseProps} isLoading />);
		expect(screen.getByRole('button')).toHaveTextContent('Загрузка...');
	});

	it('shows "Следующее" in infinite mode', () => {
		render(<TaskResult {...baseProps} mode='infinite' />);
		expect(screen.getByRole('button')).toHaveTextContent('Следующее');
	});

	it('shows "Следующее" in fixed mode when not on the last exercise', () => {
		render(<TaskResult {...baseProps} mode='fixed' currentIndex={1} totalExercises={3} />);
		expect(screen.getByRole('button')).toHaveTextContent('Следующее');
	});

	it('shows "Завершить" in fixed mode on the last exercise', () => {
		render(<TaskResult {...baseProps} mode='fixed' currentIndex={2} totalExercises={3} />);
		expect(screen.getByRole('button')).toHaveTextContent('Завершить');
	});

	it('disables the button when isLoading is true', () => {
		render(<TaskResult {...baseProps} isLoading />);
		expect(screen.getByRole('button')).toBeDisabled();
	});

	it('calls onNext when button is clicked', async () => {
		const user = userEvent.setup();
		const onNext = vi.fn();
		render(<TaskResult {...baseProps} onNext={onNext} />);
		await user.click(screen.getByRole('button'));
		expect(onNext).toHaveBeenCalledOnce();
	});
});
