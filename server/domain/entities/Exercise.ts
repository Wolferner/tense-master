import { Tense } from '../value-objects';

export class Exercise {
	constructor(
		readonly id: string,
		readonly tense: Tense,
		readonly question: string,
		readonly answer: string,
		readonly explanation: string,

		readonly createdAt: Date,
		readonly updatedAt: Date,
	) {}
}
