# AWT Course Catalog
Alua Issimbayeva It3-2301

Semester project for the **Advanced Web Technologies** course — Lab 1: project scaffold, App Router, TypeScript, and a first Client Component.

**Lab 2:** styled with Tailwind CSS and shadcn/ui — `CourseCard` rebuilt on shadcn `Card`/`Button` with a hover effect, a responsive `/courses` grid (1 / 2 / 3 / 4 columns at base / `sm` / `lg` / `xl`), and a padded nav bar with hover states and a bottom border.

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS, and shadcn/ui.

## Routes

| Route | Description |
| --- | --- |
| `/` | Home page with a welcome message and a link to the catalog |
| `/about` | Static page describing the project |
| `/courses` | Course list, loaded on the server |
| `/courses/[id]` | Course detail page with an interactive like button |

## What's implemented

- **Mock data source** — [`lib/courses.ts`](lib/courses.ts) exports a typed `Course` model plus `getCourses()` and `getCourse(id)`. Both are async with a 300ms delay so loading states are actually visible. A real FastAPI backend replaces this in a later lab.
- **Server Components by default** — `/courses` awaits `getCourses()` directly in the component body, with no `useEffect` and no client-side loading state.
- **`CourseCard`** ([`components/CourseCard.tsx`](components/CourseCard.tsx)) — a Server Component with typed props. The whole card is a `<Link>`, so navigation stays client-side without needing `'use client'`.
- **Dynamic route** ([`app/courses/[id]/page.tsx`](app/courses/%5Bid%5D/page.tsx)) — `params` is typed as `Promise<{ id: string }>` and awaited. Unknown ids call `notFound()`.
- **`generateStaticParams`** — prerenders all six course pages at build time; `next build` reports them as SSG.
- **`loading.tsx`** — shows "Loading course…" while the 300ms fetch resolves.
- **`not-found.tsx`** — renders "Course not found" with a link back to `/courses`. Try `/courses/does-not-exist`.
- **`LikeButton`** ([`components/LikeButton.tsx`](components/LikeButton.tsx)) — the only Client Component in the project. Holds the like count in `useState` and increments it on click.
- **Shared navigation** — Home / Courses / About links in the root layout, styled with Tailwind.

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

To verify the production build and static generation:

```bash
npm run build
```

## Deployment

Not deployed yet.
