'use client';

import { selectStep } from '@/shared/stores/useTenseStore/tenseStoreSelectors';
import { useTenseStore } from '@/shared/stores/useTenseStore/useTenseStore';
import { Fragment } from 'react/jsx-runtime';
import SelectTrainingSection from './ui/SelectTrainingSection/SelectTrainingSection';
import TrainingSection from './ui/TrainingSection/TrainingSection';

const TenseTrainer = () => {
	const step = useTenseStore(selectStep);

	return <Fragment>{step === 'select' ? <SelectTrainingSection /> : <TrainingSection />}</Fragment>;
};

export default TenseTrainer;
