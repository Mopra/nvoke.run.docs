# nvoke.run.docs

Documentation site for [nvoke.run](https://nvoke.run), served at **https://docs.nvoke.run**.

Built with Next.js 16 + Nextra 4 + MDX + Pagefind, exported as a static site and deployed to GitHub Pages.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Other scripts:

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run build       # next build (static export) + pagefind postbuild
```

The build produces `out/` (static HTML + assets) and `out/_pagefind/` (search index). Both are gitignored — CI regenerates them on every deploy.

## Content structure

Pages are MDX files under `app/**/page.mdx`, routed by the Next.js App Router. Navigation order comes from `_meta.js` files in each section.

```text
app/
  page.mdx                  # Overview
  getting-started/page.mdx
  concepts/page.mdx
  guides/
    writing-functions/page.mdx
    http-endpoints/page.mdx
    authenticating-requests/page.mdx
    testing-and-debugging/page.mdx
  api-reference/
    overview/page.mdx
    functions/page.mdx
    invocations/page.mdx
    api-keys/page.mdx
    http-invoke/page.mdx
  limits/page.mdx
```

Two MDX-callable React components live in `components/`:

- `<Endpoint method path auth />` — API endpoint card
- `<ParamTable params={[...]} />` — request/response field table

They're wired into MDX through `mdx-components.tsx`.

## Deployment

Pushes to `main` trigger [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which runs typecheck + lint + build + Pagefind, then deploys `out/` to GitHub Pages. Pull requests run the build but skip the deploy step.

### One-time setup

After the first push to `main`:

1. **Enable Pages** — repo **Settings → Pages**, set **Source** to **GitHub Actions**.
2. **Point the DNS** — add a `CNAME` record at your DNS provider: `docs → mopra.github.io`.
3. **Enforce HTTPS** — once GitHub provisions the cert, repo **Settings → Pages → Enforce HTTPS**.

The [`public/CNAME`](public/CNAME) file tells GitHub Pages which custom domain to serve. The [`public/.nojekyll`](public/.nojekyll) file prevents Pages from stripping `_next/` assets.

## Search

[Pagefind](https://pagefind.app) runs in `postbuild`. It scans the static HTML in `out/` and writes the search index to `out/_pagefind/`. Nextra's search UI picks it up automatically at runtime — no configuration required.

## Blueprint

The design and stack choices are documented in [`docs/superpowers/specs/2026-04-14-docs-site-design.md`](docs/superpowers/specs/2026-04-14-docs-site-design.md). The original architectural pattern is in [`docs-site-blueprint.md`](docs-site-blueprint.md).
