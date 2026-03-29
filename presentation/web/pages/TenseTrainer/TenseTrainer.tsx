'use client';

import { useTenseStore } from '@/shared/stores/useTenseStore';
import { useState } from 'react';
import { fetchExercises } from './api/fetchExercises';
import SelectTrainingSection from './ui/SelectTrainingSection/SelectTrainingSection';
import TrainingSection from './ui/TrainingSection';

const TenseTrainer = () => {
	const {
		selectedTenses,
		mode,
		fixedLimit,
		exercises,
		step,
		currentExerciseIndex,
		isLoading,
		toggleTense,
		selectAll,
		clearAll,
		toggleGroup,

		patchExercises,
		setStep,
		setCurrentExerciseIndex,
		setIsLoading,

		updateMode,
	} = useTenseStore();

	const [userAnswer, setUserAnswer] = useState('');

	const currentExercises = exercises[currentExerciseIndex];

	const startTraining = async () => {
		if (selectedTenses.length === 0) return;
		setIsLoading(true);
		const data = await fetchExercises(selectedTenses, mode === 'fixed' ? fixedLimit : 10);
		patchExercises(data);
		setCurrentExerciseIndex(0);
		setUserAnswer('');
		setStep('training');
		setIsLoading(false);
	};

	const nextExercise = async () => {
		if (mode === 'infinite') {
			setIsLoading(true);
			const data = await fetchExercises(selectedTenses, 1);
			patchExercises(data);
			setCurrentExerciseIndex(currentExerciseIndex + 1);
			setUserAnswer('');
			setStep('training');
			setIsLoading(false);
			return;
		}

		if (currentExerciseIndex + 1 < exercises.length) {
			setCurrentExerciseIndex(currentExerciseIndex + 1);
			setUserAnswer('');
			setStep('training');
		} else {
			setStep('select');
		}
	};

	if (step === 'select') {
		return (
			<SelectTrainingSection
				selectedTenses={selectedTenses}
				mode={mode}
				fixedLimit={fixedLimit}
				hasExercises={exercises.length > 0}
				isLoading={isLoading}
				toggleTense={toggleTense}
				onToggleGroup={toggleGroup}
				selectAll={selectAll}
				clearAll={clearAll}
				onUpdateMode={updateMode}
				onContinue={() => setStep('training')}
				onStart={startTraining}
			/>
		);
	}

	return (
		<TrainingSection
			current={currentExercises}
			currentIndex={currentExerciseIndex}
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
