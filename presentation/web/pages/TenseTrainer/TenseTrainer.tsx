'use client';

import { useTenseStore } from '@/shared/stores/useTenseStore';
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
		userAnswer,
		toggleTense,
		selectAll,
		clearAll,
		toggleGroup,
		setUserAnswer,
		updateMode,
		setStep,
		startTraining,
		nextExercise,
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
			current={exercises[currentExerciseIndex]}
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
