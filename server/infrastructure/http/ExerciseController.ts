import { MAX_EXERCISES } from '@/shared/config/constants';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Locale, Tense } from '../../../domain/value-objects';
import { ExerciseService } from '../../application/exercise';

const TenseSchema = z.enum(Object.values(Tense) as [Tense, ...Tense[]]);
const LocaleSchema = z.enum(Object.values(Locale) as [Locale, ...Locale[]]);

const GetRandomSchema = z.object({
	tenses: z.array(TenseSchema).min(1),
	limit: z.coerce.number().int().min(1).max(50).default(10),
	locale: LocaleSchema,
});

export class ExerciseController {
	constructor(private readonly exerciseService: ExerciseService) {}

	async getMeta(req: NextRequest): Promise<NextResponse> {
		const localeParam = req.nextUrl.searchParams.get('locale');
		const parsed = LocaleSchema.safeParse(localeParam);
		if (!parsed.success) {
			return NextResponse.json({ error: 'Invalid or missing locale' }, { status: 400 });
		}
		const lastUpdatedAt = await this.exerciseService.getLastUpdatedAt(parsed.data);
		return NextResponse.json({ lastUpdatedAt }, { status: 200 });
	}

	async getAll(req: NextRequest): Promise<NextResponse> {
		const localeParam = req.nextUrl.searchParams.get('locale');
		const parsed = LocaleSchema.safeParse(localeParam);
		if (!parsed.success) {
			return NextResponse.json({ error: 'Invalid or missing locale' }, { status: 400 });
		}
		const exercises = await this.exerciseService.findAll(parsed.data);
		return NextResponse.json(exercises, { status: 200 });
	}

	async getRandom(req: NextRequest): Promise<NextResponse> {
		const tensesParam = req.nextUrl.searchParams.get('tenses');
		const limitParam = req.nextUrl.searchParams.get('limit');
		const localeParam = req.nextUrl.searchParams.get('locale');

		const parsed = GetRandomSchema.safeParse({
			tenses: tensesParam ? tensesParam.split(',') : [],
			limit: limitParam ?? MAX_EXERCISES,
			locale: localeParam,
		});

		if (!parsed.success) {
			return NextResponse.json({ error: parsed.error.message }, { status: 400 });
		}

		const exercises = await this.exerciseService.findRandom(
			parsed.data.tenses,
			parsed.data.limit,
			parsed.data.locale,
		);
		return NextResponse.json(exercises, { status: 200 });
	}
}
