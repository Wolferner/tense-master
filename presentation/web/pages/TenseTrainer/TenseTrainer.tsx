'use client';

import { ExerciseResponseDto } from '@/server/aplication/exercise';
import { useTenseStore } from '@/shared/stores/useTenseStore';
import { useCallback, useState } from 'react';
import { fetchExercises } from './api/fetchExercises';
import { Step } from './logic/types';
import SelectStep from './ui/SelectStep';
import TrainingStep from './ui/TrainingStep';

const TenseTrainer = () => {
	const {
		selectedTenses,
		toggleTense,
		selectAll,
		clearAll,
		mode,
		fixedLimit,
		setMode,
		setFixedLimit,
		setTenses,
	} = useTenseStore();

	const [step, setStep] = useState<Step>('select');
	const [exercises, setExercises] = useState<ExerciseResponseDto[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [userAnswer, setUserAnswer] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const current = exercises[currentIndex];

	const startTraining = useCallback(async () => {
		if (selectedTenses.length === 0) return;
		setIsLoading(true);
		const data = await fetchExercises(selectedTenses, mode === 'fixed' ? fixedLimit : 10);
		setExercises(data);
		setCurrentIndex(0);
		setUserAnswer('');
		setStep('training');
		setIsLoading(false);
	}, [selectedTenses, mode, fixedLimit]);

	const nextExercise = useCallback(async () => {
		if (mode === 'infinite') {
			setIsLoading(true);
			const data = await fetchExercises(selectedTenses, 1);
			setExercises(prev => [...prev, ...data]);
			setCurrentIndex(i => i + 1);
			setUserAnswer('');
			setStep('training');
			setIsLoading(false);
			return;
		}

		if (currentIndex + 1 < exercises.length) {
			setCurrentIndex(i => i + 1);
			setUserAnswer('');
			setStep('training');
		} else {
			setStep('select');
		}
	}, [mode, currentIndex, exercises.length, selectedTenses]);

	if (step === 'select') {
		return (
			<SelectStep
				selectedTenses={selectedTenses}
				toggleTense={toggleTense}
				selectAll={selectAll}
				clearAll={clearAll}
				setTenses={setTenses}
				mode={mode}
				fixedLimit={fixedLimit}
				setMode={setMode}
				setFixedLimit={setFixedLimit}
				hasExercises={exercises.length > 0}
				isLoading={isLoading}
				onContinue={() => setStep('training')}
				onStart={startTraining}
			/>
		);
	}

	if (!current) return null;

	return (
		<TrainingStep
			current={current}
			currentIndex={currentIndex}
			totalExercises={exercises.length}
			mode={mode}
			step={step}
			userAnswer={userAnswer}
			setUserAnswer={setUserAnswer}
			isLoading={isLoading}
			onBack={() => setStep('select')}
			onCheck={() => setStep('result')}
			onNext={nextExercise}
		/>
	);
};

export default TenseTrainer;
