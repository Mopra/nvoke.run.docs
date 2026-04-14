# nvoke.run Docs Site — Design

**Date:** 2026-04-14
**Repo:** [nvoke.run.docs](https://github.com/Mopra/nvoke.run.docs)
**Host:** `docs.nvoke.run` (custom domain on GitHub Pages)

## Goal

Ship a static, low-maintenance documentation site for nvoke.run that a developer can read and go from signup → their first deployed HTTP function in under two minutes. Markdown-first authoring, React components where helpful, self-hosted search, no backend.

## Stack

Per [docs-site-blueprint.md](../../../docs-site-blueprint.md):

- Next.js 16 (App Router) with `output: "export"`
- Nextra 4 + `nextra-theme-docs`
- MDX for all content pages
- TypeScript
- Tailwind CSS 4 (minimal — Nextra theme does the heavy lifting)
- Pagefind (postbuild, indexes `out/`)
- ESLint + `eslint-config-next`

No deviations from the blueprint except: Pagefind indexes `out/` (not `.next/server/app`) because of `output: "export"`.

## Information Architecture

```
/ (Overview)
/getting-started
/concepts
/guides/
  writing-functions
  http-endpoints
  authenticating-requests
  testing-and-debugging
/api-reference/
  overview
  functions
  invocations
  api-keys
  http-invoke
/limits
```

Navigation order and labels come from `_meta.js` files per section. No tabs, no recipes, no versioning. Single version, single language.

## Content Responsibilities

Each page gets written from the app surface analysis already completed in the brainstorming session. Key content decisions:

- **Overview** — one-paragraph product summary, mental model diagram (text), when to use vs not.
- **Getting Started** — linear walkthrough: sign in, create function in editor, set slug, test in UI, copy public URL, `curl` it. Ends with "next steps" links.
- **Concepts** — one short subsection per domain term: slug, access mode, allowed methods, enabled flag, invocation, logs, execution limits, API keys.
- **Guides** — task-oriented. Each guide is self-contained and links to relevant concepts and API reference.
- **API Reference** — one page per resource. Each endpoint rendered via the `Endpoint` component: method, path, auth requirement, request params table, response shape, example request/response.
- **Limits** — timeout (30s), memory (128 MB), response body preview cap (4 KB), allowed HTTP methods per function.

## Custom Components (minimal)

Only two, both in `components/`:

- `Endpoint` — renders `METHOD /path`, an auth badge (`Clerk` / `API key` / `Public`), and a description slot.
- `ParamTable` — renders a typed table of request or response fields (`name | type | required | description`).

Everything else uses Nextra defaults (`Callout`, `Tabs`, `Cards`, code blocks, etc). No custom tabs, no custom layout primitives. YAGNI until a real need appears.

## Project Structure

```
nvoke.run.docs/
  app/
    layout.tsx
    page.mdx                  # Overview
    _meta.js
    getting-started/page.mdx
    concepts/page.mdx
    guides/
      _meta.js
      writing-functions/page.mdx
      http-endpoints/page.mdx
      authenticating-requests/page.mdx
      testing-and-debugging/page.mdx
    api-reference/
      _meta.js
      overview/page.mdx
      functions/page.mdx
      invocations/page.mdx
      api-keys/page.mdx
      http-invoke/page.mdx
    limits/page.mdx
    globals.css
  components/
    endpoint.tsx
    param-table.tsx
  public/
    CNAME                     # "docs.nvoke.run"
    .nojekyll                 # GH Pages: don't mangle _next/
  mdx-components.tsx
  next.config.mjs
  postcss.config.mjs
  tsconfig.json
  package.json
  .eslintrc.json
  .gitignore
  README.md
  .github/workflows/deploy.yml
```

## next.config.mjs

```js
import nextra from "nextra";

const withNextra = nextra({});

export default withNextra({
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
  turbopack: {
    resolveAlias: {
      "next-mdx-import-source-file": "./mdx-components.tsx",
    },
  },
});
```

No `basePath` — the site is served from the root of a custom domain.

## Styling and Theme

Ship the default Nextra theme for v1. A minimal `app/globals.css` imports Tailwind and leaves a placeholder `@layer base` block for future theme-token overrides.

**Theme tokens rule (hard):** when we later tune colors to match the warm-neutral + sage direction used in `nvoke.run/apps/web`, we do it via CSS variables on `:root` / `.dark`. No hardcoded palette values anywhere in components or MDX. This matches the cross-repo convention recorded in auto-memory.

## Search (Pagefind)

`package.json` scripts:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "postbuild": "pagefind --site out --output-path out/_pagefind",
    "typecheck": "tsc --noEmit",
    "lint": "eslint"
  }
}
```

Pagefind output lives in `out/_pagefind`. It is **not committed** — CI regenerates on every deploy. `out/` and `.next/` are gitignored.

## Deploy — GitHub Actions + GitHub Pages

Single workflow at `.github/workflows/deploy.yml`:

- **Triggers:** `push` to `main`, plus `pull_request` to `main` (build-only on PRs, no deploy).
- **Jobs:**
  1. `build` — checkout → setup-node 20 (npm cache) → `npm ci` → `npm run typecheck` → `npm run lint` → `npm run build` → `upload-pages-artifact` with `path: out`.
  2. `deploy` — needs: build, `if: github.ref == 'refs/heads/main'`, uses `actions/deploy-pages`.
- **Permissions:** `pages: write`, `id-token: write`, `contents: read`.
- **Concurrency:** group `pages`, cancel-in-progress false (don't abort an in-flight production deploy).

## Custom Domain

- `public/CNAME` = `docs.nvoke.run`
- `public/.nojekyll` empty file
- Manual one-time steps (documented in README.md):
  1. Repo Settings → Pages → Source: "GitHub Actions"
  2. DNS: `CNAME docs → mopra.github.io` (or `A` records for apex, not applicable here)
  3. Repo Settings → Pages → enforce HTTPS after cert is issued

## CI Failure Modes (what the build catches)

- Broken MDX or missing page files (next build fails)
- TypeScript errors in components or `mdx-components.tsx`
- ESLint errors
- Broken Pagefind pipeline (postbuild exits non-zero)

## Out of Scope for v1

- Versioned docs
- i18n
- Custom search UI (Nextra's default Pagefind integration is sufficient)
- Analytics
- OG image generation
- Sitemap / robots.txt — add later when we know final URL shape
- Theme customization beyond Nextra defaults (warm-neutral/sage pass happens after v1 ships)

## Success Criteria

1. `npm run build` completes locally and in CI with zero errors and zero lint warnings.
2. After the first successful deploy, `https://docs.nvoke.run` serves the Overview page.
3. Search works on the deployed site and returns results from all content pages.
4. Every documented API endpoint in the `/api-reference/` section matches a real route in `nvoke.run/apps/api`.
5. A developer following `/getting-started` end-to-end can create and `curl` their first function without referencing any other page.
