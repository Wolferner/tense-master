'use client';

import { useSessionStore } from '@/client/stores/sessionStore';
import { Fragment } from 'react/jsx-runtime';
import SelectTrainingSection from './ui/SelectTrainingSection/SelectTrainingSection';
import TrainingSection from './ui/TrainingSection/TrainingSection';

const TenseTrainer = () => {
	const step = useSessionStore(s => s.step);

	return <Fragment>{step === 'select' ? <SelectTrainingSection /> : <TrainingSection />}</Fragment>;
};

export default TenseTrainer;
