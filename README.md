# Team Task Board

A mini Trello/Linear task board with a Node.js REST API backend and a Next.js frontend.

## Setup & Run

```bash
# 1. Install dependencies for both projects
cd backend && npm install && cd ../frontend && npm install && cd ..

# 2. Start the backend (runs on http://localhost:4000)
cd backend && npm run dev

# 3. In a new terminal, start the frontend (runs on http://localhost:3000)
cd frontend && npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

## Project Structure

```
team-task-board/
├── backend/                # Express.js REST API (TypeScript)
│   └── src/
│       ├── index.ts        # Server entry point (port 4000)
│       ├── models/task.ts  # Task type + in-memory store with CRUD
│       ├── routes/tasks.ts # API route handlers
│       └── middleware/     # Input validation
├── frontend/               # Next.js App Router (TypeScript)
│   └── src/
│       ├── app/            # Next.js pages and layout
│       ├── components/     # React components (TaskBoard, TaskCard, etc.)
│       ├── lib/api.ts      # API client functions
│       └── types/task.ts   # Shared TypeScript types
└── README.md
```

## Architectural Decisions

### Backend
- **Express.js v5** with TypeScript — lightweight, well-known, fits the "Node.js API" requirement without adding unnecessary complexity.
- **In-memory storage (Map)** — simplest option for a take-home. Data resets on server restart. In production, this would be a database (PostgreSQL, MongoDB, etc.).
- **Manual validation middleware** — kept it simple with two focused middleware functions rather than pulling in a validation library like Zod for this scope.
- **`?fail=true` query param** — mutating endpoints (POST, PATCH, DELETE) accept this param to simulate server failures, making optimistic UI rollback testable.

### Frontend
- **Next.js 16 with App Router** — as requested. The page is a Server Component that renders the `TaskBoard` Client Component.
- **Client Components for interactivity** — the board, cards, form, and filter all need state/effects, so they use `"use client"`.
- **Tailwind CSS v4** — fast to build a usable UI without writing custom CSS.
- **No state management library** — React `useState` + `useCallback` + `useMemo` is sufficient for this scope. Context or Zustand would add complexity without benefit here.
- **Optimistic UI updates** — status changes and deletions update the UI immediately, then call the API. On failure, the previous state is restored and an error message is shown. This is the core "tricky" requirement.

### Monorepo
- Separate `frontend/` and `backend/` directories with independent `package.json` files. No monorepo tooling (Turborepo, Nx) — overkill for two projects.

## Testing Optimistic UI

1. Create a few tasks with different assignees
2. Check the **"Simulate API failure"** checkbox
3. Try changing a task's status via the dropdown — it will move to the new column instantly, then snap back with an error message
4. Try deleting a task — it will disappear, then reappear with an error message
5. Uncheck the checkbox to resume normal operation

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List all tasks (supports `?status=` and `?assignee=` query params) |
| POST | `/api/tasks` | Create a task (requires `title` in body) |
| GET | `/api/tasks/:id` | Get a single task |
| PATCH | `/api/tasks/:id` | Update a task (partial update) |
| DELETE | `/api/tasks/:id` | Delete a task |
| GET | `/health` | Health check |

All mutating endpoints support `?fail=true` to simulate a 500 error.

## What I'd Do Differently With More Time

- **Database**: Replace in-memory store with SQLite (via better-sqlite3) or PostgreSQL for persistence.
- **Drag and drop**: Use a library like `@dnd-kit` for dragging cards between columns instead of a dropdown.
- **Tests**: Add Vitest unit tests for the backend validation/store logic, and React Testing Library tests for the optimistic UI behavior.
- **Debounced search**: Add a text search input with debouncing for filtering tasks.
- **Error boundaries**: Add a React error boundary component for unexpected rendering errors.
- **Loading skeletons**: Replace the spinner with skeleton cards that match the layout.
- **Accessibility**: Full keyboard navigation for the board, ARIA live regions for optimistic update announcements.
- **Race condition handling**: Add request cancellation (AbortController) to prevent stale responses from overwriting newer state.
