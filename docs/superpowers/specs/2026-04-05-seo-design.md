---
name: SEO Optimization
description: SEO improvements for tense-master.xyz — organic search + social sharing
type: spec
date: 2026-04-05
---

# SEO Optimization — Design Spec

## Goal

Improve search engine visibility and social sharing appearance for tense-master.xyz.
Target audience: Russian-speaking users now, with localization (DE, FR, ES) planned later.

## Scope

- Home page `/` — main SEO target, fully indexed
- App pages `/tense-trainer`, `/profile`, `/settings` — closed from indexing (noindex)
- Telegram routes — same noindex treatment

Out of scope: dynamic OG image generation, hreflang (deferred to localization feature).

---

## Section 1: Technical Foundations

**File:** `app/layout.tsx`

Add `metadataBase` to root metadata. Required for Next.js to generate absolute URLs for OG tags and canonical links:

```ts
metadataBase: new URL('https://tense-master.xyz'),
```

Canonical URLs are generated automatically by Next.js once `metadataBase` is set — no additional configuration needed.

**noindex on app pages** — add to `metadata` in each of these files:

- `app/(web)/tense-trainer/page.tsx`
- `app/(web)/profile/page.tsx`
- `app/(web)/settings.tsx/page.tsx`
- `app/telegram/tense-trainer/page.tsx`
- `app/telegram/profile/page.tsx`
- `app/telegram/settings.tsx/page.tsx`

```ts
robots: { index: false, follow: false },
```

---

## Section 2: Sitemap + robots.txt

**New file:** `app/sitemap.ts`

Next.js serves this at `/sitemap.xml` automatically. Only the home page is indexed:

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

**Updated file:** `public/robots.txt`

Add sitemap reference:

```
User-agent: *
Allow: /

Sitemap: https://tense-master.xyz/sitemap.xml
```

---

## Section 3: OG Image

**File:** `public/og.png` — 1200×630px static image (prepared manually, e.g. in Figma or Canva).

Referenced in `app/layout.tsx` metadata:

```ts
openGraph: {
  images: [{ url: '/og.png', width: 1200, height: 630 }],
},
twitter: {
  card: 'summary_large_image',
  images: ['/og.png'],
},
```

Note: if the image is not yet available, this step can be deferred — all other changes work independently.

---

## Section 4: JSON-LD + Improved Descriptions

**JSON-LD** added to `app/(web)/page.tsx` via inline script tag:

```tsx
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
```

**Improved descriptions:**

- Root layout description: `"Практикуй английские времена — Present Simple, Past Perfect и другие — с упражнениями на перевод предложений"`
- OG/Twitter description: same

---

## Future Considerations

When localization is implemented, add `hreflang` alternate links per locale in metadata. The `metadataBase` and sitemap structure defined here will make that addition straightforward.
