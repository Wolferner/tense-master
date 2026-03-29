'use client';

import { useTenseStore } from '@/shared/stores/useTenseStore';
import { Fragment } from 'react/jsx-runtime';
import SelectTrainingSection from './ui/SelectTrainingSection/SelectTrainingSection';
import TrainingSection from './ui/TrainingSection/TrainingSection';

const TenseTrainer = () => {
	const { step } = useTenseStore();

	return <Fragment>{step === 'select' ? <SelectTrainingSection /> : <TrainingSection />}</Fragment>;
};

export default TenseTrainer;
