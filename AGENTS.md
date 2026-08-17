# AGENTS.md

## Cursor Cloud specific instructions

This repo is **Say It Your Way Romanian**, a single-page, fully client-side React + Vite + TypeScript PWA (Tailwind CSS). There is no backend server, database, or API: `@supabase/supabase-js` is listed as a dependency but is not wired into the app, and no environment variables or secrets are required to run, build, or test it. All state (progress, favourites, review flags) is persisted in the browser via `localStorage`. Teacher/progress sharing is done offline via QR codes, not a network service.

### Services & commands

There is a single frontend service. Standard scripts live in `package.json`:

- Dev server: `npm run dev` (Vite, serves on `http://localhost:5173`).
- Lint: `npm run lint` (ESLint). Note: the current codebase has pre-existing lint errors; a non-zero exit from lint does not mean the environment is broken.
- Typecheck: `npm run typecheck` (`tsc --noEmit`, currently clean).
- Production build: `npm run build` (outputs to `dist/`; also generates the PWA service worker).
- Preview built output: `npm run preview`.

### Non-obvious notes

- Node: `.node-version` pins `20`, but the app builds and runs fine on the default Node 22 already on the VM; no nvm switching is required.
- Deployment target is Cloudflare Pages (`wrangler.toml`, `pages_build_output_dir = "dist"`), but nothing Cloudflare-specific is needed for local development.
- Because this is a PWA with `registerType: 'autoUpdate'`, a stale service worker can cache old assets in the browser during manual testing. If UI changes don't appear, hard-reload or clear site data.
