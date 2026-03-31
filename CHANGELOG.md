# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
