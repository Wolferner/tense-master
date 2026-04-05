---
name: Semantic Markup — Home Page
description: Fix heading hierarchy and add ARIA attributes on Home page and Header
type: spec
date: 2026-04-05
---

# Semantic Markup — Home Page

## Goal

Fix semantic HTML issues on the Home page and Header: heading hierarchy, ARIA labels, and decorative element annotation.

## Scope

- `presentation/web/components/Header/Header.tsx`
- `presentation/web/pages/Home/Home.tsx`

`Reason.tsx` requires no changes — `<h3>` is already correct and stays as-is once `<h2>` is introduced.

Out of scope: other pages (TenseTrainer, Profile, Settings).

---

## Current Issues

1. **Heading hierarchy broken** — `<h1>` followed directly by `<h3>` in reason cards, `<h2>` missing
2. **`<nav>` has no `aria-label`** — screen readers cannot distinguish navigation regions
3. **Decorative badge has no `aria-hidden`** — "English Tenses Trainer" `<span>` adds noise for screen readers
4. **Sections have no `aria-labelledby`** — regions are not labeled for assistive technology

---

## Changes

### `Header.tsx`

Add `aria-label` to `<nav>`:

```tsx
<nav aria-label='Основная навигация' className='...'>
```

### `Home.tsx`

**Badge** — add `aria-hidden`:

```tsx
<span aria-hidden='true' className='...'>
	English Tenses Trainer
</span>
```

**Hero section** — add `aria-labelledby` + `id` on `<h1>`:

```tsx
<section aria-labelledby='home-heading' className='...'>
  ...
  <h1 id='home-heading' className='...'>Tense Master</h1>
```

**CTA button** — more descriptive `aria-label`:

```tsx
<Link href='/tense-trainer' aria-label='Начать тренировку по английским временам'>
	Начать тренировку
</Link>
```

**Reasons section** — add `aria-labelledby` + visually hidden `<h2>`:

```tsx
<section aria-labelledby='reasons-heading' className='grid w-full gap-4 sm:grid-cols-3'>
	<h2 id='reasons-heading' className='sr-only'>
		Почему этот тренажёр
	</h2>
	{REASONS.map(reason => (
		<Reason key={reason.title} reason={reason} />
	))}
</section>
```

---

## Result: Page Outline

```
<header>
  <nav aria-label="Основная навигация">
<main>
  <section aria-labelledby="home-heading">
    <h1 id="home-heading">Tense Master</h1>
  <section aria-labelledby="reasons-heading">
    <h2 class="sr-only" id="reasons-heading">Почему этот тренажёр</h2>
    <article>
      <h3>...</h3>
```

Heading hierarchy: `h1 → h2 → h3` — correct.
