'use client';

import { useTenseStore } from '@/shared/stores/useTenseStore';
import { Fragment } from 'react/jsx-runtime';
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
		answers,
		toggleTense,
		selectAll,
		clearAll,
		toggleGroup,
		updateMode,
		setStep,
		startTraining,
		nextExercise,
		submitAnswer,
		sessionId,
	} = useTenseStore();

	return (
		<Fragment>
			{step === 'select' ? (
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
			) : (
				<TrainingSection
					currentIndex={currentExerciseIndex}
					exercises={exercises}
					mode={mode}
					isLoading={isLoading}
					answers={answers}
					sessionId={sessionId}
					onBack={() => setStep('select')}
					onCheck={submitAnswer}
					onNext={nextExercise}
				/>
			)}
		</Fragment>
	);
};

export default TenseTrainer;
