# Team Management Mobile

Expo and React Native application for managing sports teams, rosters, schedules,
attendance, practice plans, depth charts, invitations, and notifications.

## Requirements

- Node.js 20 or newer
- npm 11.3.0
- Xcode for local iOS builds
- Android Studio for local Android builds
- An Expo development build for features that are unavailable in Expo Go

This repository uses npm. Commit changes to `package-lock.json` whenever
dependencies change, and do not add a Yarn or pnpm lockfile.

## Setup

1. Install dependencies:

   ```bash
   npm ci
   ```

2. Copy the environment template:

   ```bash
   cp .env.example .env
   ```

3. Set the API and Socket.IO URLs in `.env`.

4. Start the development client:

   ```bash
   npm run dev
   ```

Use `npm run ios` or `npm run android` when a native development build needs to
be generated locally.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `EXPO_PUBLIC_API_URL` | Default API base URL, including `/api/v1` |
| `EXPO_PUBLIC_API_URL_STAGING` | Staging API base URL, including `/api/v1` |
| `EXPO_PUBLIC_SOCKET_URL` | Socket.IO server origin |

Local `.env` files are ignored. Keep credentials and environment-specific URLs
out of Git.

## Project structure

| Path | Responsibility |
| --- | --- |
| `app/` | Expo Router screens, layouts, and navigation groups |
| `api/` | HTTP client and feature API functions |
| `components/` | Reusable application and UI components |
| `hooks/` | Zustand stores and shared hooks |
| `socket/` | Socket connection and event definitions |
| `themes/` | Colors, spacing, typography, and Paper themes |
| `types/` | Shared mobile domain types |
| `utils/` | Pure domain helpers and their focused tests |

### Navigation

- `app/(auth)` contains authentication screens.
- `app/(onboarding)` contains initial profile setup.
- `app/(app)` contains authenticated tabs.
- `app/(app)/teams/team/[teamId]/(drawer)` contains the selected team's drawer
  screens.
- Modal and detail routes live in the enclosing team stack.

Use Expo Router route parameters for screen identity. Keep API access in `api/`,
shared state in `hooks/`, and reusable presentation in `components/`.

## Validation

Run these commands before opening a pull request:

```bash
npm run lint
npm run typecheck
npm test
```

The current test command runs focused TypeScript tests under `utils/` and
`hooks/` using Node's test runner.

## Common commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start Expo for a development client |
| `npm run staging` | Start Expo with the staging environment selected |
| `npm run ios` | Build and run the native iOS project |
| `npm run android` | Build and run the native Android project |
| `npm run web` | Start the web target |
| `npm run typecheck` | Run TypeScript without emitting files |
| `npm run lint` | Run ESLint |
| `npm test` | Run focused unit tests |
| `npm run prebuild` | Regenerate native projects from Expo configuration |

Generated `.expo`, `dist`, `ios`, and `android` directories are ignored and
should not be committed.
