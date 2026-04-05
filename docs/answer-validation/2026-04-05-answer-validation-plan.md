# Answer Validation Enhancement Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make answer validation ignore trailing punctuation and accept contractions as equivalent to their expanded forms.

**Architecture:** `AnswerValidator` gains a `normalizeAnswer` helper (trim + lowercase + strip trailing `.!?` + expand English contractions). `validateAnswer` normalizes both sides before comparing. No schema changes — alternative answers are out of scope.

**Tech Stack:** TypeScript, Vitest.

---

## File Structure

| Action | File                                                | Responsibility                                 |
| ------ | --------------------------------------------------- | ---------------------------------------------- |
| Modify | `domain/services/AnswerValidator.ts`                | Add `normalizeAnswer`, update `validateAnswer` |
| Create | `domain/services/__tests__/AnswerValidator.test.ts` | Unit tests                                     |

---

### Task 1: Enhance `AnswerValidator`

**Files:**

- Modify: `domain/services/AnswerValidator.ts`
- Create: `domain/services/__tests__/AnswerValidator.test.ts`

- [ ] **Step 1: Write failing tests**

Create `domain/services/__tests__/AnswerValidator.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { normalizeAnswer, validateAnswer } from '../AnswerValidator';

describe('normalizeAnswer', () => {
	it('trims whitespace', () => {
		expect(normalizeAnswer('  hello  ')).toBe('hello');
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
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run domain/services/__tests__/AnswerValidator.test.ts
```

Expected: FAIL — `normalizeAnswer is not exported`.

- [ ] **Step 3: Implement enhanced `AnswerValidator`**

`domain/services/AnswerValidator.ts`:

```ts
const CONTRACTIONS: Record<string, string> = {
	"i'm": 'i am',
	"i've": 'i have',
	"i'll": 'i will',
	"you're": 'you are',
	"you've": 'you have',
	"you'll": 'you will',
	"he'll": 'he will',
	"she'll": 'she will',
	"it'll": 'it will',
	"we're": 'we are',
	"we've": 'we have',
	"we'll": 'we will',
	"they're": 'they are',
	"they've": 'they have',
	"they'll": 'they will',
	"that'll": 'that will',
	"there'll": 'there will',
	"don't": 'do not',
	"doesn't": 'does not',
	"didn't": 'did not',
	"won't": 'will not',
	"wouldn't": 'would not',
	"can't": 'cannot',
	"couldn't": 'could not',
	"shouldn't": 'should not',
	"isn't": 'is not',
	"aren't": 'are not',
	"wasn't": 'was not',
	"weren't": 'were not',
	"haven't": 'have not',
	"hasn't": 'has not',
	"hadn't": 'had not',
	"mustn't": 'must not',
	"needn't": 'need not',
	"shan't": 'shall not',
};

export function normalizeAnswer(s: string): string {
	let result = s
		.trim()
		.toLowerCase()
		.replace(/[.!?]+$/, '');
	for (const [contraction, expanded] of Object.entries(CONTRACTIONS)) {
		result = result.replace(new RegExp(`\\b${contraction}\\b`, 'g'), expanded);
	}
	return result;
}

export function validateAnswer(userAnswer: string, exerciseAnswer: string): boolean {
	return normalizeAnswer(userAnswer) === normalizeAnswer(exerciseAnswer);
}
```

Note: `'s` contractions (`he's`, `she's`, `it's`) are intentionally omitted — they are ambiguous (`he is` vs `he has`) and would cause false positives for Perfect tenses ("He's been working" → "He is been working").

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run domain/services/__tests__/AnswerValidator.test.ts
```

Expected: all tests PASS.

- [ ] **Step 5: Run full test suite to check for regressions**

```bash
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add domain/services/AnswerValidator.ts domain/services/__tests__/AnswerValidator.test.ts
git commit -m "feat: normalize answers — strip trailing punctuation and expand contractions"
```
