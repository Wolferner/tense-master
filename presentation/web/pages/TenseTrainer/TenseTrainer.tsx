'use client';

import { useTenseStore } from '@/shared/stores/useTenseStore';
import SelectTrainingSection from './ui/SelectTrainingSection/SelectTrainingSection';
import TrainingSection from './ui/TrainingSection/TrainingSection';

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
		updateMode,
		setStep,
		startTraining,
		nextExercise,
		submitAnswer,
	} = useTenseStore();

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
			currentIndex={currentExerciseIndex}
			exercises={exercises}
			mode={mode}
			step={step}
			isLoading={isLoading}
			onBack={() => setStep('select')}
			onCheck={submitAnswer}
			onNext={nextExercise}
		/>
	);
};

export default TenseTrainer;
