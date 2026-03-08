# 🥋 SQL Dojo

Daily SQL practice — from SELECT to Window Functions. Mobile-first PWA you can install on iPhone.

## Stack
- **Next.js 14** (App Router)
- **Supabase** (Postgres + anon key)
- **Vercel** (deploy)
- **Tailwind CSS**
- **TypeScript**

---

## Quick Start

### 1. Clone & Install
```bash
git clone <your-repo>
cd sql-dojo
npm install
```

### 2. Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** in your project
3. Run the schema from the app's **Schema** tab (tap "Copy SQL" and paste it)
4. Also run the second SQL block shown (todos + problem_attempts tables)
5. Copy your project URL and anon key from **Settings → API**

### 3. Environment Variables
```bash
cp .env.example .env.local
```
Fill in your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 4. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

```bash
npx vercel
```

Add your environment variables in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Install on iPhone (PWA)

1. Open your Vercel URL in **Safari**
2. Tap the **Share** button (box with arrow)
3. Tap **Add to Home Screen**
4. Tap **Add**

The app will appear on your home screen and run fullscreen like a native app.

---

## Features

- **30 SQL problems** spanning SELECT, WHERE, JOIN, GROUP BY, Subqueries, CTEs, Window Functions, Date functions, String functions
- **Daily problem rotation** — deterministic, same problem all day, new one tomorrow
- **Difficulty levels**: BEGINNER → INTERMEDIATE → ADVANCED → EXPERT
- **Hint system** — expandable hints before revealing solution
- **Solution viewer** — copy-to-clipboard SQL solutions
- **Personal notes** — write and save your SQL attempt per problem
- **Todo checklist** — add daily tasks, filter by today or all
- **Streak tracker** — tracks consecutive days you've solved a problem
- **Schema viewer** — all 5 tables with column types and foreign keys
- **Offline-friendly PWA** — installable on iPhone via Safari

---

## Database Tables

| Table | Purpose |
|-------|---------|
| `employees` | 10 employees with salaries, hire dates, departments |
| `departments` | 5 departments with budgets and locations |
| `orders` | 12 orders with statuses, amounts, dates |
| `customers` | 10 customers across countries and tiers |
| `products` | 10 products with categories and pricing |

---

## Debugging

- All Supabase errors are caught silently; check browser DevTools → Network tab for API calls
- If Supabase is not set up, the app still works — notes/todos just won't persist
- The streak is stored in `localStorage` for simplicity

---

## Adding More Problems

Edit `lib/problems.ts` and add to the `PROBLEMS` array following the existing schema. The daily rotation will automatically include new problems.
