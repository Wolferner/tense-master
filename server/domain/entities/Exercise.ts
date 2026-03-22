import { Tense } from '../value-objects';

export class Exercise {
	constructor(
		readonly tense: Tense,
		readonly question: string,
		readonly answer: string,
		readonly explanation: string,

		readonly id: string,
		readonly createdAt: Date,
		readonly updatedAt: Date,
	) {}
}
