import type { AnswerWithExercise } from '@/client/application/services/ProfileService';
import type { ExerciseResponseDto } from '@/shared/dtos';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SessionDetail } from '../SessionDetail';

function makeAnswer(
	overrides: Partial<AnswerWithExercise> & { exercise?: Partial<ExerciseResponseDto> } = {},
): AnswerWithExercise {
	return {
		id: 'a1',
		sessionId: 's1',
		exerciseId: 'e1',
		userAnswer: 'He reads',
		skipped: false,
		isCorrect: true,
		createdAt: '2024-01-01T00:00:00.000Z',
		exercise: {
			id: 'e1',
			tense: 'PRESENT_SIMPLE',
			question: 'Он читает',
			answer: 'He reads',
			explanation: 'habit',
			createdAt: new Date('2024-01-01'),
			updatedAt: new Date('2024-01-01'),
			...overrides.exercise,
		},
		...overrides,
	} as AnswerWithExercise;
}

describe('SessionDetail', () => {
	it('shows empty placeholder when no answers', () => {
		render(<SessionDetail answers={[]} />);
		expect(screen.getByText('Нет ответов')).toBeInTheDocument();
	});

	it('shows "Верно" for a correct answer', () => {
		render(<SessionDetail answers={[makeAnswer({ isCorrect: true, skipped: false })]} />);
		expect(screen.getByText('Верно')).toBeInTheDocument();
	});

	it('shows "Неверно" for a wrong answer', () => {
		render(
			<SessionDetail
				answers={[makeAnswer({ isCorrect: false, skipped: false, userAnswer: 'He read' })]}
			/>,
		);
		expect(screen.getByText('Неверно')).toBeInTheDocument();
	});

	it('shows "Пропущено" and hides user answer for skipped', () => {
		render(
			<SessionDetail answers={[makeAnswer({ skipped: true, isCorrect: null, userAnswer: '' })]} />,
		);
		expect(screen.getByText('Пропущено')).toBeInTheDocument();
		expect(screen.queryByText(/Ответ:/)).not.toBeInTheDocument();
	});

	it('shows user answer text for non-skipped', () => {
		render(
			<SessionDetail
				answers={[makeAnswer({ userAnswer: 'He reads', skipped: false, isCorrect: true })]}
			/>,
		);
		expect(screen.getByText('He reads')).toBeInTheDocument();
	});
});
