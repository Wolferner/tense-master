import { ExerciseAnswer } from '@/domain/entities/Answer';
import { Tense } from '@/domain/value-objects';
import { type ExerciseResponseDto } from '@/shared/dtos';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import TaskResult from '../TaskResult';

const exercise: ExerciseResponseDto = {
	id: 'ex-1',
	tense: Tense.PRESENT_SIMPLE,
	question: 'Он читает книгу',
	answer: 'He reads a book',
	explanation: 'Present Simple for habits',
	createdAt: new Date(),
	updatedAt: new Date(),
};

const correctAnswer = new ExerciseAnswer(
	'a-1',
	's-1',
	'ex-1',
	'He reads a book',
	false,
	true,
	new Date().toISOString(),
);
const wrongAnswer = new ExerciseAnswer(
	'a-2',
	's-1',
	'ex-1',
	'He read a book',
	false,
	false,
	new Date().toISOString(),
);
const skippedAnswer = new ExerciseAnswer(
	'a-3',
	's-1',
	'ex-1',
	'',
	true,
	null,
	new Date().toISOString(),
);

const baseProps = {
	current: exercise,
	isLoading: false,
	mode: 'fixed' as const,
	currentIndex: 0,
	totalExercises: 3,
	answerRecord: correctAnswer,
	onNext: vi.fn(),
};

describe('TaskResult', () => {
	it('shows "Верно!" when answer is correct', () => {
		render(<TaskResult {...baseProps} answerRecord={correctAnswer} />);
		expect(screen.getByText('Верно!')).toBeInTheDocument();
	});

	it('shows "Неверно" when answer is incorrect', () => {
		render(<TaskResult {...baseProps} answerRecord={wrongAnswer} />);
		expect(screen.getByText('Неверно')).toBeInTheDocument();
	});

	it('does not show result indicator when skipped', () => {
		render(<TaskResult {...baseProps} answerRecord={skippedAnswer} />);
		expect(screen.queryByText('Верно!')).not.toBeInTheDocument();
		expect(screen.queryByText('Неверно')).not.toBeInTheDocument();
	});

	it('hides correct answer and explanation when answer is correct', () => {
		render(<TaskResult {...baseProps} answerRecord={correctAnswer} />);
		expect(screen.queryByText('He reads a book')).not.toBeInTheDocument();
		expect(screen.queryByText('Present Simple for habits')).not.toBeInTheDocument();
	});

	it('shows correct answer and explanation when answer is wrong', () => {
		render(<TaskResult {...baseProps} answerRecord={wrongAnswer} />);
		expect(screen.getByText('He reads a book')).toBeInTheDocument();
		expect(screen.getByText('Present Simple for habits')).toBeInTheDocument();
	});

	it('shows correct answer and explanation when skipped', () => {
		render(<TaskResult {...baseProps} answerRecord={skippedAnswer} />);
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
