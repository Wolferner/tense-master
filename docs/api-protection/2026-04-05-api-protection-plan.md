# API Protection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Protect `/api/*` routes from cross-origin browser requests via Origin check, and reduce database load by caching stable endpoints.

**Architecture:** A `proxy.ts` file at the project root (Next.js 16 replacement for `middleware.ts`) intercepts all `/api/*` requests before they reach route handlers, checks the `Origin` header against an allowlist from `ALLOWED_ORIGINS` env var, and returns 403 for disallowed origins. Two stable endpoints (`/api/exercises/meta` and `/api/exercises/all`) get `export const revalidate = 3600` so Vercel serves cached responses for one hour, protecting the database from repeated hits.

**Tech Stack:** Next.js 16.2.1 (`proxy.ts` convention), Node.js runtime, Vercel environment variables.

---

## File Structure

| Action | File                              | Responsibility                         |
| ------ | --------------------------------- | -------------------------------------- |
| Create | `proxy.ts`                        | Origin check for all `/api/*` requests |
| Modify | `app/api/exercises/meta/route.ts` | Add 1-hour cache                       |
| Modify | `app/api/exercises/all/route.ts`  | Add 1-hour cache                       |

`/api/exercises/route.ts` (random endpoint) is intentionally not cached — it's a fallback path and randomness matters.

---

### Task 1: Origin check in `proxy.ts`

**Files:**

- Create: `proxy.ts`

**Context:** In Next.js 16, `middleware.ts` is deprecated and renamed to `proxy.ts`. The exported function is named `proxy` (not `middleware`). The `NextProxy` type from `next/server` covers the function signature. The `config.matcher` works the same as before.

The logic:

- Read `ALLOWED_ORIGINS` env var (comma-separated, e.g. `https://a.com,https://b.com`)
- Read `Origin` header from the incoming request
- If `Origin` is present AND not in the allowlist → return `Response.json` with status 403
- If `Origin` is absent (direct curl without header, same-origin browser request) → allow through
- If `Origin` is in the allowlist → allow through

- [ ] **Step 1: Create `proxy.ts`**

```ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? '')
	.split(',')
	.map(o => o.trim())
	.filter(Boolean);

export function proxy(request: NextRequest) {
	const origin = request.headers.get('origin');

	if (origin && !allowedOrigins.includes(origin)) {
		return Response.json({ error: 'Forbidden' }, { status: 403 });
	}

	return NextResponse.next();
}

export const config = {
	matcher: '/api/:path*',
};
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Add `ALLOWED_ORIGINS` to `.env.local` for local dev**

Add to `.env.local` (create if it doesn't exist):

```
ALLOWED_ORIGINS=http://localhost:3000
```

- [ ] **Step 4: Manual smoke test — allowed origin passes through**

Start the dev server:

```bash
npm run dev
```

In a separate terminal, send a request with your allowed origin:

```bash
curl -s -o /dev/null -w "%{http_code}" \
  -H "Origin: http://localhost:3000" \
  http://localhost:3000/api/exercises/meta
```

Expected: `200`

- [ ] **Step 5: Manual smoke test — blocked origin returns 403**

```bash
curl -s -o /dev/null -w "%{http_code}" \
  -H "Origin: https://evil.com" \
  http://localhost:3000/api/exercises/meta
```

Expected: `403`

- [ ] **Step 6: Manual smoke test — no Origin header passes through**

```bash
curl -s -o /dev/null -w "%{http_code}" \
  http://localhost:3000/api/exercises/meta
```

Expected: `200` (curl without Origin is allowed — accepted tradeoff)

- [ ] **Step 7: Commit**

```bash
git add proxy.ts .env.local
git commit -m "feat: add origin check in proxy.ts for /api/* routes"
```

---

### Task 2: Cache stable API endpoints

**Files:**

- Modify: `app/api/exercises/meta/route.ts`
- Modify: `app/api/exercises/all/route.ts`

**Context:** Next.js supports route-level caching via `export const revalidate = N` (seconds). When set, Vercel caches the response at the CDN edge and revalidates after N seconds. This means even if someone spams the endpoint, the database is only hit once per hour. The random endpoint (`/api/exercises/route.ts`) is intentionally excluded — it serves as a fallback and should return fresh random results.

- [ ] **Step 1: Add revalidate to `/api/exercises/meta/route.ts`**

Current file:

```ts
import { exerciseController } from '@/server/infrastructure/http/container';

export async function GET() {
	return exerciseController.getMeta();
}
```

Updated file:

```ts
import { exerciseController } from '@/server/infrastructure/http/container';

export const revalidate = 3600;

export async function GET() {
	return exerciseController.getMeta();
}
```

- [ ] **Step 2: Add revalidate to `/api/exercises/all/route.ts`**

Current file:

```ts
import { exerciseController } from '@/server/infrastructure/http/container';

export async function GET() {
	return exerciseController.getAll();
}
```

Updated file:

```ts
import { exerciseController } from '@/server/infrastructure/http/container';

export const revalidate = 3600;

export async function GET() {
	return exerciseController.getAll();
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/api/exercises/meta/route.ts app/api/exercises/all/route.ts
git commit -m "feat: cache /api/exercises/meta and /api/exercises/all for 1 hour"
```

---

### Task 3: Configure `ALLOWED_ORIGINS` on Vercel

This task is manual — no code changes.

- [ ] **Step 1: Open Vercel dashboard → your project → Settings → Environment Variables**

- [ ] **Step 2: Add variable**

```
Name:  ALLOWED_ORIGINS
Value: https://yourdomain.com,https://yourseconddomain.com
```

Set it for **Production**, **Preview**, and **Development** environments as needed.

- [ ] **Step 3: Redeploy**

Vercel requires a redeploy for env var changes to take effect. Trigger it from the Vercel dashboard or push a commit.

- [ ] **Step 4: Smoke test on production**

```bash
# Should return 200
curl -s -o /dev/null -w "%{http_code}" \
  -H "Origin: https://yourdomain.com" \
  https://yourdomain.com/api/exercises/meta

# Should return 403
curl -s -o /dev/null -w "%{http_code}" \
  -H "Origin: https://evil.com" \
  https://yourdomain.com/api/exercises/meta
```
