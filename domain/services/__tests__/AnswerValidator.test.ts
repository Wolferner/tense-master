import { describe, expect, it } from 'vitest';
import { normalizeAnswer, validateAnswer } from '../AnswerValidator';

describe('normalizeAnswer', () => {
	it('trims whitespace', () => {
		expect(normalizeAnswer('  hello  ')).toBe('hello');
	});

	it('collapses internal double spaces', () => {
		expect(normalizeAnswer('He  reads')).toBe('he reads');
	});

	it('lowercases', () => {
		expect(normalizeAnswer('Hello World')).toBe('hello world');
	});

	it('strips trailing period', () => {
		expect(normalizeAnswer('He drinks coffee.')).toBe('he drinks coffee');
	});

	it('strips trailing exclamation mark', () => {
		expect(normalizeAnswer('Run!')).toBe('run');
	});

	it('strips trailing question mark', () => {
		expect(normalizeAnswer('Is he ready?')).toBe('is he ready');
	});

	it("expands i'm to i am", () => {
		expect(normalizeAnswer("I'm reading")).toBe('i am reading');
	});

	it("expands he'll to he will", () => {
		expect(normalizeAnswer("He'll go")).toBe('he will go');
	});

	it("expands don't to do not", () => {
		expect(normalizeAnswer("I don't know")).toBe('i do not know');
	});

	it("expands won't to will not", () => {
		expect(normalizeAnswer("I won't go")).toBe('i will not go');
	});

	it("expands can't to cannot", () => {
		expect(normalizeAnswer("I can't swim")).toBe('i cannot swim');
	});

	it("expands haven't to have not", () => {
		expect(normalizeAnswer("I haven't finished")).toBe('i have not finished');
	});

	it("expands you're to you are", () => {
		expect(normalizeAnswer("You're right")).toBe('you are right');
	});

	it("expands they've to they have", () => {
		expect(normalizeAnswer("They've arrived")).toBe('they have arrived');
	});
});

describe('validateAnswer', () => {
	it('returns true for exact match', () => {
		expect(validateAnswer('He reads', 'He reads')).toBe(true);
	});

	it('returns true for case-insensitive match', () => {
		expect(validateAnswer('he reads', 'He reads')).toBe(true);
	});

	it('returns true when user omits trailing period', () => {
		expect(validateAnswer('He reads', 'He reads.')).toBe(true);
	});

	it('returns true when correct answer has trailing period and user does not', () => {
		expect(
			validateAnswer('The Earth revolves around the Sun', 'The Earth revolves around the Sun.'),
		).toBe(true);
	});

	it('returns true when user uses contraction matching expanded correct answer', () => {
		expect(validateAnswer("He'll read the book", 'He will read the book')).toBe(true);
	});

	it('returns true when correct answer has contraction and user types expanded form', () => {
		expect(validateAnswer('I do not know', "I don't know")).toBe(true);
	});

	it('returns false when answer is wrong', () => {
		expect(validateAnswer('He read', 'He reads')).toBe(false);
	});

	it('returns false for empty user answer', () => {
		expect(validateAnswer('', 'He reads')).toBe(false);
	});
});
