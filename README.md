# AWT Course Catalog
Alua Issimbayeva It3-2301

Semester project for the **Advanced Web Technologies** course. A Next.js frontend for a course catalog whose data comes from the FastAPI backend [backend-fastapi](https://github.com/alua-issimbayeva/backend-fastapi).

- **Lab 1:** project scaffold, App Router, TypeScript, and a first Client Component.
- **Lab 2:** styled with Tailwind CSS and shadcn/ui. `CourseCard` is built on shadcn `Card`/`Button` with a hover effect, the `/courses` grid is responsive (1 / 2 / 3 / 4 columns at base / `sm` / `lg` / `xl`), and the nav bar is padded with hover states.
- **Lab 5:** connected to the FastAPI backend. Pages load courses from the API, the browser sends likes and enrollments, and the CORS breakage experiments are recorded in the journal below.

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui, and SWR.

## Running locally

Both projects have to run at the same time, **backend first, then frontend**.

1. Backend (in the `course-catalog-api` folder):

   ```bash
   source .venv/bin/activate        # Windows: .venv\Scripts\Activate.ps1
   fastapi dev main.py              # http://localhost:8000
   ```

2. Frontend (in this folder), in a second terminal:

   ```bash
   npm install
   npm run dev                      # http://localhost:3000
   ```

Open the frontend at exactly **http://localhost:3000**. That is the only origin the backend allows. `http://127.0.0.1:3000`, or port 3001, is blocked by CORS (see breakage 4).

### Environment variables

Create `.env.local` in the project root, next to `package.json`. It is not committed (`.env*` is in `.gitignore`).

```bash
API_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

| Variable | Used by | Visible in the browser? |
| --- | --- | --- |
| `API_URL` | `lib/courses.ts`: `getCourses()` and `getCourse()` in Server Components | no, server only |
| `NEXT_PUBLIC_API_URL` | `ElectiveFilter`, `LikeButton`, `EnrollForm` (Client Components) | yes, built into the browser JavaScript, so never put secrets here |

Restart `npm run dev` after creating the file. The startup output then shows `- Environments: .env.local`.

To check the production build (it passes even with the backend off):

```bash
npm run build
```

## Routes

| Route | Description | Who calls the backend |
| --- | --- | --- |
| `/` | Home page with a welcome message and a link to the catalog | — |
| `/about` | Static page describing the project | — |
| `/courses` | Course list, sorted by likes (the backend's default) | the Next.js server: `GET /courses` |
| `/courses/[id]` | Course page with a like button and an enrollment form | the Next.js server: `GET /courses/{id}`; the browser: `POST /courses/{id}/like`, `POST /enrollments` |
| `/filter` | "Electives only" checkbox | the browser (SWR): `GET /courses?is_elective=true` |

## What's implemented

- **Data layer**: [`lib/courses.ts`](lib/courses.ts) keeps the `Course` type and the same `getCourses()` / `getCourse(id)` functions, but they now `fetch` from `API_URL` with `cache: "no-store"`. They check `res.ok` (fetch doesn't throw on 4xx/5xx), and `getCourse` returns `undefined` on 404 so the page can call `notFound()`. The pages didn't change.
- **Special files with a real backend**:
  - `loading.tsx` shows "Loading course…" while the backend answers.
  - `not-found.tsx` shows for `/courses/does-not-exist`, after the backend answers 404.
  - [`error.tsx`](app/courses/error.tsx) shows "Something went wrong" when the backend is down. Its **Try again** button calls `retry()`, which re-fetches the data without a page reload.
- **`ElectiveFilter`** ([`components/ElectiveFilter.tsx`](components/ElectiveFilter.tsx)): SWR requests `/courses` or `/courses?is_elective=true` directly from the browser. The fetcher throws on `!res.ok` so SWR reports errors.
- **`LikeButton`** ([`components/LikeButton.tsx`](components/LikeButton.tsx)): `POST /courses/{id}/like`, then shows the count from the server's response. The like survives a reload.
- **`EnrollForm`** ([`components/EnrollForm.tsx`](components/EnrollForm.tsx)): sends JSON to `POST /enrollments`. It shows "Enrollment number: N" on 201, or the server's own message on 422 (for example, for a one-letter name).
- **Client Components import only types** from `lib/courses.ts` (`import type`), because that module is server-only and throws without `API_URL`.

## Decisions

- **`generateStaticParams` was removed from `/courses/[id]`.** In Lab 1 it prebuilt the six course pages from the mock data. Once the data moved to the backend, it called `getCourses()` during `npm run build`, and the build failed whenever the backend was off (`TypeError: fetch failed … ECONNREFUSED`, "Failed to collect page data for /courses/[id]"). Prebuilt pages would also show stale likes. Now `/courses` and `/courses/[id]` are both `ƒ` (dynamic) in the build table, and the build passes without the backend.
- **Why the like needs no preflight but the enrollment does.** The like is a `POST` with no body and no custom headers, which counts as a CORS *simple* request. The browser sends it straight away and only checks `access-control-allow-origin` on the response. The enrollment sends `Content-Type: application/json`, which isn't allowed for simple requests, so the browser first asks for permission with an `OPTIONS` preflight. The answer is cached for 600 seconds (`access-control-max-age`), so the second submission goes without `OPTIONS`.

## Breakage journal

Each breakage was introduced on its own, the backend was restarted, and the same protocol was run in Chrome with **Disable cache** on:
1. open `/filter`
2. click ❤ on `/courses/web-security`
3. submit the enrollment form with "Aigerim"
4. open `/courses`

The code was restored with `git restore` after each one.

### Breakage 1: CORS removed entirely

- What I did: commented out the whole block. `app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000"], allow_methods=["*"], allow_headers=["*"])` became `# app.add_middleware(...)`.
- Console: "Access to fetch at 'http://localhost:8000/courses' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource." The same message appears for `…/like`. For the form: "…Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource."
- Network:
  - `GET courses` → CORS error, while the backend log says `200 OK`.
  - `POST like` → CORS error, while the backend log says `POST /courses/web-security/like 200 OK`. The server's counter went 21 → 22, but the page shows "Failed to like the course".
  - `OPTIONS enrollments` → **405**, and the `POST` was never sent.
  - `/courses` works.
- Cause: no `access-control-allow-origin` header in any response, because CORS isn't connected. The server still executes the requests; only the browser blocks them. Server Component requests (`/courses`) aren't affected.
- How I found it: step 3 (no `access-control-allow-origin` in Response Headers) and step 4 (the preflight gets 405, so CORS isn't connected at all). By hand, `curl -X OPTIONS …` → `405 Method Not Allowed`, `{"detail":"Method Not Allowed"}`.

### Breakage 2: a trailing slash in the origin

- What I did: `allow_origins=["http://localhost:3000"]` → `allow_origins=["http://localhost:3000/"]`
- Console: the same messages as breakage 1, "No 'Access-Control-Allow-Origin' header is present on the requested resource", for the filter, the like, and the preflight.
- Network: `GET courses` → CORS error. `POST like` → CORS error (the backend executed it: 200). `OPTIONS enrollments` → **400**, and the `POST` was never sent. `/courses` works.
- Cause: `"http://localhost:3000/"` matches no origin (the browser sends `Origin: http://localhost:3000`, without a slash), so permission is granted to nobody.
- How I found it: step 4, where the preflight gets 400 rather than 405. The CORS middleware is running but rejects the origin. By hand, `curl -X OPTIONS …` → `400 Bad Request`, body `Disallowed CORS origin`, with no `access-control-allow-origin` line.

### Breakage 3: `allow_methods` removed

- What I did: deleted the line `allow_methods=["*"],`
- Console: only the form fails. "Access to fetch at 'http://localhost:8000/enrollments' from origin 'http://localhost:3000' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: It does not have HTTP ok status."
- Network:
  - `GET courses` → 200, and the filter works.
  - `POST like` → 200, and the like works (21 → 22).
  - `OPTIONS enrollments` → **400**. Its response does have `access-control-allow-origin: http://localhost:3000`, but `access-control-allow-methods: GET`. The `POST` was never sent.
- Cause: by default only `GET` is allowed, so the preflight for `POST` is rejected. The like still works because it is a simple request with no preflight, and the methods list is only checked in preflights. The origin header is present, so the fix is in the methods, not the origin.
- How I found it: step 4 (preflight 400) plus step 3 (the origin header is there). By hand, `curl -X OPTIONS …` → `400`, body `Disallowed CORS method`, `access-control-allow-methods: GET`.

### Breakage 4: a different origin, 127.0.0.1

- What I did: `main.py` unchanged. Added `allowedDevOrigins: ["127.0.0.1"]` to `next.config.ts` (temporarily, removed afterwards) and opened the frontend at `http://127.0.0.1:3000` instead of `http://localhost:3000`.
- Console: "Access to fetch at 'http://localhost:8000/courses' from origin 'http://127.0.0.1:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource." The same appears for the like and the preflight.
- Network: `GET courses` → CORS error (backend log: 200). `POST like` → CORS error (backend: 200). `OPTIONS enrollments` → 400, and the `POST` was never sent. `/courses` works.
- Cause: to the browser, `localhost` and `127.0.0.1` are different hosts, so `http://127.0.0.1:3000` is a different origin from the only allowed one, `http://localhost:3000`. The fix is to open the page at an allowed address, or to add the second origin to `allow_origins`.
- How I found it: step 3. The Request Headers show `Origin: http://127.0.0.1:3000`, which doesn't match the list character for character. By hand, the preflight with that origin → `400 Disallowed CORS origin`.

### Breakage 5: a Python error that pretends to be CORS

- What I did: in `list_courses`, `offset, limit = p["offset"], p["limit"]` → `offset, limit = p["ofset"], p["limit"]`
- Console on `/filter`: "Access to fetch at 'http://localhost:8000/courses' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource." It is the same text as breakage 1, but CORS is configured correctly.
- Network: `GET courses` → CORS error. `POST like` → 200, and the like works. `OPTIONS enrollments` → 200, then `POST enrollments` → 201 ("Enrollment number: 1"). `/courses` shows `error.tsx` ("Something went wrong"), and the console has `Error: API error: 500`.
- Backend terminal: `"GET /courses HTTP/1.1" 500 Internal Server Error`, then a traceback ending in `File "…\main.py", line 52, in list_courses` / `offset, limit = p["ofset"], p["limit"]` / `KeyError: 'ofset'`.
- Cause: an unhandled exception turns into a 500 response, produced by a layer outside `CORSMiddleware`, so it has no `access-control-*` headers and the browser reports it as a CORS error. The real bug is the dictionary key typo.
- How I found it: step 1 (`/courses`, requested by the Next.js server where CORS doesn't apply, also fails, so it isn't CORS) and step 5 (the backend terminal shows a Python traceback).

## Deployment

Not deployed yet.
