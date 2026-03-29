# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
