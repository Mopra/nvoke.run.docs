# nvoke.run.docs — agent instructions

The public developer documentation site for nvoke.run. Next.js 16 + **Nextra 4** (`nextra-theme-docs`) + Pagefind. Content is authored in MDX under `app/**/page.mdx`. Deploys to `docs.nvoke.run` as a static site on GitHub Pages.

## Sibling repos

This repo is one of three under the [Mopra/nvoke](https://github.com/Mopra) project. Local sibling paths (when working from the umbrella workspace):

- `../nvoke.run/` — the product (`app.nvoke.run`).
- `../nvoke.run.website/` — the marketing site (`nvoke.run`).

**When to switch repos:**
- If the request is about a product feature, auth, or API behavior → switch to `../nvoke.run/`.
- If the request is about landing pages, marketing copy, or pricing → switch to `../nvoke.run.website/`.
- If the request is about docs content, guides, or API reference pages → stay here.

## Conventions

- The site uses Nextra's built-in `<Navbar>` and `<Footer>` components, configured inline in `app/layout.tsx`. Header/footer customization happens via props and children on those components — do not introduce a custom header or footer implementation.
- No shadcn/ui in this repo (Nextra owns the UI). Use plain `<a>` tags or Nextra's components for links.
- Content structure: pages live under `app/**/page.mdx`, navigation order via `_meta.js`. Existing top-level sections: `/getting-started`, `/concepts`, `/guides/*`, `/api-reference/*`, `/limits`.
- Absolute URLs when linking to sibling properties.
- Cross-property links from docs to marketing open in the **same tab**; links to the app open in a **new tab**.
