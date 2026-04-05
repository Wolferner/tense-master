# Semantic Markup — Home Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix heading hierarchy and add ARIA attributes on the Home page and Header for correct semantic HTML and screen reader support.

**Architecture:** Attribute-only changes to two existing components. No new files, no logic changes. `sr-only` Tailwind utility hides the `<h2>` visually while keeping it accessible.

**Tech Stack:** React, Next.js, Tailwind CSS (`sr-only` utility class).

---

## File Map

| Action | File                                            |
| ------ | ----------------------------------------------- |
| Modify | `presentation/web/components/Header/Header.tsx` |
| Modify | `presentation/web/pages/Home/Home.tsx`          |

---

### Task 1: aria-label on Header nav

**Files:**

- Modify: `presentation/web/components/Header/Header.tsx:31`

- [ ] **Step 1: Add `aria-label` to `<nav>`**

Replace:

```tsx
<nav className='flex items-center gap-0.5'>
```

With:

```tsx
<nav aria-label='Основная навигация' className='flex items-center gap-0.5'>
```

- [ ] **Step 2: Commit**

```bash
git add presentation/web/components/Header/Header.tsx
git commit -m "feat: add aria-label to main navigation"
```

---

### Task 2: Semantic attributes on Home page

**Files:**

- Modify: `presentation/web/pages/Home/Home.tsx`

- [ ] **Step 1: Replace the entire file content**

```tsx
import { Button } from '@/presentation/components/ui/button';
import Link from 'next/link';
import { REASONS } from './logic/reason';
import Reason from './ui/Reason';

const HomePage = () => {
	return (
		<main className='bg-background text-foreground flex flex-1 flex-col'>
			<div className='mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center gap-16 px-6 py-24'>
				<section
					aria-labelledby='home-heading'
					className='flex flex-col items-center gap-6 text-center'
				>
					<span
						aria-hidden='true'
						className='border-border bg-card text-primary rounded-full border px-4 py-1.5 text-sm'
					>
						English Tenses Trainer
					</span>
					<h1 id='home-heading' className='text-foreground text-5xl font-bold tracking-tight'>
						Tense Master
					</h1>
					<p className='text-muted-foreground max-w-xl text-lg leading-relaxed'>
						Путаница с английскими временами — одна из самых частых проблем в изучении языка. Не
						потому что правила сложные, а потому что их нужно чувствовать в контексте. Этот тренажёр
						именно для этого.
					</p>
					<Button asChild size='lg' className='mt-2'>
						<Link href='/tense-trainer' aria-label='Начать тренировку по английским временам'>
							Начать тренировку
						</Link>
					</Button>
				</section>

				<section aria-labelledby='reasons-heading' className='grid w-full gap-4 sm:grid-cols-3'>
					<h2 id='reasons-heading' className='sr-only'>
						Почему этот тренажёр
					</h2>
					{REASONS.map(reason => (
						<Reason key={reason.title} reason={reason} />
					))}
				</section>
			</div>
		</main>
	);
};

export default HomePage;
```

- [ ] **Step 2: Commit**

```bash
git add presentation/web/pages/Home/Home.tsx
git commit -m "feat: add semantic aria attributes and fix heading hierarchy on Home page"
```
