import { MAX_EXERCISES } from '@/shared/config/constants';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ExerciseService } from '../../aplication/exercise';
import { Tense } from '../../domain/value-objects';

const TenseSchema = z.enum(Object.values(Tense) as [Tense, ...Tense[]]);

const GetRandomSchema = z.object({
	tenses: z.array(TenseSchema).min(1),
	limit: z.coerce.number().int().min(1).max(50).default(10),
});

export class ExerciseController {
	constructor(private readonly exerciseService: ExerciseService) {}

	async getRandom(req: NextRequest): Promise<NextResponse> {
		const tensesParam = req.nextUrl.searchParams.get('tenses');
		const limitParam = req.nextUrl.searchParams.get('limit');

		const parsed = GetRandomSchema.safeParse({
			tenses: tensesParam ? tensesParam.split(',') : [],
			limit: limitParam ?? MAX_EXERCISES,
		});

		if (!parsed.success) {
			return NextResponse.json({ error: parsed.error.message }, { status: 400 });
		}

		const exercises = await this.exerciseService.findRandom(parsed.data.tenses, parsed.data.limit);
		return NextResponse.json(exercises, { status: 200 });
	}
}
