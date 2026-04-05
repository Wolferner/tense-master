# SEO Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add baseline SEO — metadataBase, canonical URLs, noindex on app pages, sitemap, robots.txt, OG image references, JSON-LD structured data, and improved descriptions.

**Architecture:** All changes are static metadata in Next.js App Router. No new components or runtime logic. `metadataBase` in root layout enables canonical and OG URL generation. `app/sitemap.ts` is served automatically by Next.js at `/sitemap.xml`.

**Tech Stack:** Next.js 16 App Router metadata API, `MetadataRoute` from `next`, JSON-LD via inline `<script>` tag.

---

## File Map

| Action | File                                  |
| ------ | ------------------------------------- |
| Modify | `app/layout.tsx`                      |
| Modify | `app/(web)/page.tsx`                  |
| Modify | `app/(web)/tense-trainer/page.tsx`    |
| Modify | `app/(web)/profile/page.tsx`          |
| Modify | `app/(web)/settings.tsx/page.tsx`     |
| Modify | `app/telegram/tense-trainer/page.tsx` |
| Modify | `app/telegram/profile/page.tsx`       |
| Modify | `app/telegram/settings.tsx/page.tsx`  |
| Modify | `public/robots.txt`                   |
| Create | `app/sitemap.ts`                      |

---

### Task 1: Root layout — metadataBase, descriptions, OG image

**Files:**

- Modify: `app/layout.tsx`

- [ ] **Step 1: Update metadata in `app/layout.tsx`**

Replace the existing `metadata` export with:

```ts
export const metadata: Metadata = {
	metadataBase: new URL('https://tense-master.xyz'),
	title: 'Tense Master',
	description:
		'Практикуй английские времена — Present Simple, Past Perfect и другие — с упражнениями на перевод предложений',
	appleWebApp: {
		title: 'Tense Master',
		capable: true,
		statusBarStyle: 'default',
	},
	formatDetection: {
		telephone: false,
	},
	openGraph: {
		title: 'Tense Master',
		type: 'website',
		siteName: 'Tense Master',
		description:
			'Практикуй английские времена — Present Simple, Past Perfect и другие — с упражнениями на перевод предложений',
		images: [{ url: '/og.png', width: 1200, height: 630 }],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Tense Master',
		description:
			'Практикуй английские времена — Present Simple, Past Perfect и другие — с упражнениями на перевод предложений',
		images: ['/og.png'],
	},
	icons: {
		icon: [
			{ url: '/favicon.ico' },
			{ url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
			{ url: '/favicon.svg', type: 'image/svg+xml' },
		],
		apple: '/apple-touch-icon.png',
	},
};
```

- [ ] **Step 2: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add metadataBase, OG image refs, improved descriptions"
```

---

### Task 2: noindex on web app pages

**Files:**

- Modify: `app/(web)/tense-trainer/page.tsx`
- Modify: `app/(web)/profile/page.tsx`
- Modify: `app/(web)/settings.tsx/page.tsx`

- [ ] **Step 1: Update `app/(web)/tense-trainer/page.tsx`**

Replace existing metadata export:

```ts
export const metadata: Metadata = {
	title: 'Tense Trainer | Tense Master',
	description: 'Translate sentences and practice English tenses',
	robots: { index: false, follow: false },
};
```

- [ ] **Step 2: Update `app/(web)/profile/page.tsx`**

Replace existing metadata export:

```ts
export const metadata: Metadata = {
	title: 'Profile | Tense Master',
	description: 'Your progress and statistics',
	robots: { index: false, follow: false },
};
```

- [ ] **Step 3: Update `app/(web)/settings.tsx/page.tsx`**

Replace existing metadata export:

```ts
export const metadata: Metadata = {
	title: 'Settings | Tense Master',
	description: 'Your settings and preferences',
	robots: { index: false, follow: false },
};
```

- [ ] **Step 4: Commit**

```bash
git add app/(web)/tense-trainer/page.tsx app/(web)/profile/page.tsx "app/(web)/settings.tsx/page.tsx"
git commit -m "feat: add noindex to web app pages"
```

---

### Task 3: noindex on telegram app pages

**Files:**

- Modify: `app/telegram/tense-trainer/page.tsx`
- Modify: `app/telegram/profile/page.tsx`
- Modify: `app/telegram/settings.tsx/page.tsx`

- [ ] **Step 1: Update `app/telegram/tense-trainer/page.tsx`**

```ts
import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function TelegramTenseTrainerPage() {
  return (
    <main>
      <h1>Tense Trainer</h1>
    </main>
  );
}
```

- [ ] **Step 2: Update `app/telegram/profile/page.tsx`**

```ts
import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function TelegramProfilePage() {
  return (
    <main>
      <h1>Profile</h1>
    </main>
  );
}
```

- [ ] **Step 3: Update `app/telegram/settings.tsx/page.tsx`**

```ts
import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function TelegramSettingsPage() {
  return (
    <main>
      <h1>Settings</h1>
    </main>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add app/telegram/tense-trainer/page.tsx app/telegram/profile/page.tsx app/telegram/settings.tsx/page.tsx
git commit -m "feat: add noindex to telegram app pages"
```

---

### Task 4: Create sitemap

**Files:**

- Create: `app/sitemap.ts`

- [ ] **Step 1: Create `app/sitemap.ts`**

```ts
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: 'https://tense-master.xyz',
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 1,
		},
	];
}
```

- [ ] **Step 2: Verify sitemap is served**

Run dev server: `npm run dev`

Open `http://localhost:3000/sitemap.xml` — should return valid XML with one URL entry for `https://tense-master.xyz`.

- [ ] **Step 3: Commit**

```bash
git add app/sitemap.ts
git commit -m "feat: add sitemap.xml"
```

---

### Task 5: Update robots.txt

**Files:**

- Modify: `public/robots.txt`

- [ ] **Step 1: Update `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://tense-master.xyz/sitemap.xml
```

- [ ] **Step 2: Commit**

```bash
git add public/robots.txt
git commit -m "feat: add sitemap reference to robots.txt"
```

---

### Task 6: JSON-LD and improved home page description

**Files:**

- Modify: `app/(web)/page.tsx`

- [ ] **Step 1: Update `app/(web)/page.tsx`**

```tsx
import HomePage from '@/presentation/web/pages/Home/Home';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Tense Master',
	description:
		'Практикуй английские времена — Present Simple, Past Perfect и другие — с упражнениями на перевод предложений',
};

const jsonLd = {
	'@context': 'https://schema.org',
	'@type': 'WebApplication',
	name: 'Tense Master',
	url: 'https://tense-master.xyz',
	description: 'Практикуй английские времена с переводом предложений',
	applicationCategory: 'EducationalApplication',
	inLanguage: 'ru',
	offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

export default function Page() {
	return (
		<>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<HomePage />
		</>
	);
}
```

- [ ] **Step 2: Verify JSON-LD in browser**

Run dev server: `npm run dev`

Open `http://localhost:3000`, view page source — should contain `<script type="application/ld+json">` with the JSON object.

- [ ] **Step 3: Commit**

```bash
git add "app/(web)/page.tsx"
git commit -m "feat: add JSON-LD structured data and improved home page description"
```
