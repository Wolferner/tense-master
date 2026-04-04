'use client';

import { selectStep, useTenseStore } from '@/client/stores/useTenseStore';
import { Fragment } from 'react/jsx-runtime';
import SelectTrainingSection from './ui/SelectTrainingSection/SelectTrainingSection';
import TrainingSection from './ui/TrainingSection/TrainingSection';

const TenseTrainer = () => {
	const step = useTenseStore(selectStep);

	return <Fragment>{step === 'select' ? <SelectTrainingSection /> : <TrainingSection />}</Fragment>;
};

export default TenseTrainer;
