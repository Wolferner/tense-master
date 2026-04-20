# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.3.0] - 2026-04-20

### Added

- Added website pages localization.
- Added exercises localization.

## [1.2.5] - 2026-04-07

### Added

- Added highlight of profile icon when page is active.
- Added useSwipeNavigation hook and usage in Header.
- Added answer result to `TaskResult`.
- Added section about local-first approach on home page.
- Added `Footer`.

### Changed

- All routs encapsulated in `routes.ts`.
- Updated semantic tags on `Home` page.
- Don't show answer in `TaskResult` if user answer is correct.
- Tenses badges now collapsed in one if in session was selected all variants.
- Hide more than 5 exercises in Profile, and add opportunity to show all.
- Actualize `README.md`.

## [1.2.4] - 2026-04-05

### Fixed

- Update robots.txt to disallow API access.

## [1.2.3] - 2026-04-05

### Fixed

- Fixed bug when on small devices Header don't have enough space for content.

## [1.2.2] - 2026-04-05

### Added

- `metadataBase` in root layout — enables absolute canonical and Open Graph URLs
- `app/sitemap.ts` — generates `/sitemap.xml` with the home page as the only indexed entry
- JSON-LD structured data (`WebApplication` schema) on the home page
- OG image (`public/og.png`, 1200×630) referenced in Open Graph and Twitter card metadata
- `aria-label="Основная навигация"` on the header `<nav>`
- `aria-label="Tense Master"` on the logo link in the header
- `aria-label="Профиль пользователя"` on the profile icon button
- `aria-labelledby` on both home page sections linking to their respective headings
- Visually hidden `<h2>` for the reasons section — fixes `h1 → h3` heading hierarchy skip

### Changed

- HTML `lang` attribute changed from `en` to `ru` to match Russian-language content
- Page descriptions (meta, Open Graph, Twitter) updated to Russian
- Twitter card type upgraded from `summary` to `summary_large_image`
- Header navigation labels changed to Russian: `Home → Главная`, `Trainer → Тренажер`
- Decorative elements in the header and home page marked `aria-hidden="true"`
- Sitemap reference added to `robots.txt`

### Fixed

- App pages (`/tense-trainer`, `/profile`, `/settings`) and all `/telegram/*` routes now have `noindex, nofollow` to prevent search engine indexing

## [1.2.1] - 2026-04-05

### Changed

- Answer validation is now more lenient: punctuation is stripped, articles (`a`, `an`, `the`) are ignored, and common English contractions are expanded before comparison (`"He'll"` = `"He will"`, `"don't"` = `"do not"`, etc.)

## [1.2.0] - 2026-04-05

### Added

- Profile page with overall stats (total, correct, skipped, wrong, accuracy)
- Per-tense accuracy breakdown with progress bars
- Session history with expandable answer details
- Progress chart (cumulative correct answers over time) via recharts
- `Session` domain entity
- Dexie schema with `exercises`, `sessions`, `answers` tables
- `DexieExerciseRepository`, `DexieSessionRepository`, `DexieAnswerRepository`
- `ExerciseSyncService` — syncs exercises from server on app start, skips if `lastUpdatedAt` unchanged
- `ProfileService` — computes stats, tense breakdown, chart data and session summaries from local DB
- `GET /api/exercises/meta` — returns `lastUpdatedAt` for sync check (CDN cached 1 hour)
- `GET /api/exercises/all` — returns all exercises for client sync (CDN cached 1 hour)
- `proxy.ts` — blocks cross-origin browser requests via `Origin` header check (`ALLOWED_ORIGINS` env var, semicolon-separated list of allowed domains)
- "Завершить" button for infinite mode to explicitly complete a session
- Active sessions are auto-completed when a new session starts
- Unit tests: `ExerciseSessionService`, `ExerciseSyncService`, `ProfileService`
- Component tests: `ProfilePage`, `StatsOverview`, `TenseBreakdown`, `SessionHistory`, `SessionDetail`, `ProgressChart`

### Changed

- `ExerciseAnswer` converted from plain type to class
- `ExerciseSessionService` now owns all session/answer persistence — removed direct repo usage from store
- `sessionStore` — replaced `answers` record with single `currentAnswer`, added `finishSession` action
- Header profile icon is now a clickable link to `/profile`
- Client infrastructure split: Dexie implementations in `dexie/`, wiring in `container.ts`
- `ExerciseResponseDto` moved to `shared/dtos/` so both server and client can use it

### Fixed

- Previous session not completed when starting a new training
- ESLint hook warning — redundant `setIsLoading` call inside `useEffect`

## [1.1.1] - 2026-04-03

### Added

- Server side logic tested.
- Client components tested.

## [1.1.0] - 2026-04-01

### Added

- Offline support via service worker (Serwist): API route `/api/excersises` is cached with `NetworkFirst` strategy (5s timeout) — after the first online session, exercises load from cache when offline
- Fallback seed data (`public/fallback-exercises.json`) — 10 exercises per tense (120 total) served as static JSON; used when the API is unreachable and no cached response exists, enabling offline use even on first launch
- Service worker precache `fallback-exercises.json` on install, ensuring it is available offline without any prior API call
- `robots.txt` file for `SEO`.
- Screenshots to `manifest.json`.
- Network connection badge and `useNetworkStatus` hook.
- Handling cases when in fallback exercises not enough items.
- Handling of cases when in DB not enough exercises(service).
- Error, GlobalError and NotFound fallbacks in case of errors.

## [1.0.2] - 2026-03-30

### Changed

- Added new project logo and icons.
- Basic manifest file

## [1.0.1] - 2026-03-29

### Changed

- Moved `useTenseStore` calls from `TenseTrainer` into `SelectTrainingSection` and `TrainingSection` directly — each module subscribes only to its own slice, reducing unnecessary re-renders
- Extracted store selectors into `shared/stores/useTenseStore/tenseStoreSelectors.ts` — components import named selectors instead of defining inline selector functions
- Applied `useShallow` to all object selectors to prevent re-renders when references change but values don't
- Reorganized shared config — tense labels and groups moved to a dedicated file, store defaults co-located with the store

## [1.0.0] - 2026-03-29

### Added

- English tense practice app — user selects tenses, gets a Russian sentence, types English translation, then reveals the correct answer with explanation
- 12 tenses supported across Present, Past, and Future groups
- Fixed mode (5 / 10 / 20 exercises) and Infinite mode with automatic exercise buffering
- Tense selection screen with grouped checkboxes, select-all/clear per group and globally
- Training screen with textarea input, skip support, and per-exercise answer reveal
- Answer validation — case-insensitive, trimmed comparison
- Correct answer and tense explanation shown after each submission with tense badge
- All answers persisted to `localStorage` via Zustand `persist` middleware
- Full attempt history per exercise keyed by `exercise.id`
- Each answer stamped with `createdAt` (ISO string) and `sessionId` (UUID)
- New `sessionId` generated on each training start — enables per-session statistics
- Discriminated union answer type: answered (with `isCorrect`) vs skipped
- Prisma 7 + PostgreSQL (Neon) with `TenseExerciseQuestion` model and seed workflow
