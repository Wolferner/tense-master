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
