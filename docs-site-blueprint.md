# Static Docs Site Blueprint

## Overview

This is a practical pattern for building a documentation site with `Next.js`, `Nextra`, `MDX`, and `Pagefind`.

It is designed for teams that want:

- markdown-first authoring
- React components inside docs pages
- static hosting
- self-hosted full-text search
- a low-maintenance docs stack

The key idea is:

```text
MDX content -> Next.js + Nextra build -> static HTML -> Pagefind index -> deploy as static site
```

## Recommended Stack

- Framework: `Next.js` with App Router
- UI/runtime: `React`
- Docs framework: `Nextra` + `nextra-theme-docs`
- Language: `TypeScript`
- Styling: `Tailwind CSS`
- Search: `Pagefind`
- Linting: `ESLint`

Example package set:

```json
{
  "dependencies": {
    "next": "16.x",
    "react": "19.x",
    "react-dom": "19.x",
    "nextra": "4.x",
    "nextra-theme-docs": "4.x"
  },
  "devDependencies": {
    "typescript": "^5",
    "tailwindcss": "^4",
    "@tailwindcss/postcss": "^4",
    "pagefind": "^1",
    "eslint": "^9",
    "eslint-config-next": "16.x"
  }
}
```

## Why This Stack Works Well

- `Next.js` gives you routing, metadata, build tooling, and static export support.
- `Nextra` gives you a docs-oriented layout, navigation, page tree, and MDX integration.
- `MDX` lets you write mostly in markdown while still embedding React components.
- `Pagefind` gives you static search without an external search service.
- `Tailwind CSS` keeps branding and docs component styling simple.

## Project Structure

Recommended layout:

```text
my-docs/
  app/
    layout.tsx
    page.mdx
    _meta.js
    getting-started/
      page.mdx
      _meta.js
    api-reference/
      page.mdx
      _meta.js
  components/
    api-endpoint.tsx
    api-response.tsx
    feature-table.tsx
  public/
  mdx-components.tsx
  next.config.mjs
  postcss.config.mjs
  package.json
  tsconfig.json
```

## Content Model

### Pages are MDX files

Use `app/**/page.mdx` so docs content is routed by the Next App Router.

Examples:

- `app/page.mdx`
- `app/getting-started/page.mdx`
- `app/api-reference/create-item/page.mdx`

### Section metadata uses `_meta.js`

Use `_meta.js` files to define labels and ordering for the docs navigation.

Example:

```js
export default {
  index: { title: "Overview" },
  "getting-started": { title: "Getting Started" },
  "api-reference": { title: "API Reference" }
};
```

This keeps the sidebar predictable and easy to manage.

## App Layout

Put the docs shell in `app/layout.tsx`.

Typical responsibilities:

- global metadata
- navbar
- footer
- docs layout wrapper
- page map loading
- global theme CSS imports

Example:

```tsx
import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Documentation",
    template: "%s | Documentation",
  },
  description: "Project documentation site.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          navbar={<Navbar logo={<span>Docs</span>} projectLink="https://github.com/your-org/your-repo" />}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/your-org/your-repo/tree/main"
          footer={<Footer>Documentation footer</Footer>}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
```

## MDX Component Mapping

Create `mdx-components.tsx` so MDX content can use both Nextra defaults and your own React components.

```tsx
import { useMDXComponents as getDocsMDXComponents } from "nextra-theme-docs";
import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...getDocsMDXComponents(),
    ...components,
  };
}
```

Then point Next/Nextra at that file in `next.config.mjs`.

## Next Config

This is the most important part if you want a fully static docs site.

```js
import nextra from "nextra";

const withNextra = nextra({});

const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
  turbopack: {
    resolveAlias: {
      "next-mdx-import-source-file": "./mdx-components.tsx",
    },
  },
};

export default withNextra(nextConfig);
```

### Why these settings matter

- `output: "export"` makes the site deployable as static files.
- `images.unoptimized` avoids depending on a Next image server.
- the `next-mdx-import-source-file` alias wires your MDX component mapping into Nextra.

## Styling Setup

Use Tailwind and a global stylesheet for docs-specific theme overrides.

Minimal `postcss.config.mjs`:

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

Minimal `app/globals.css`:

```css
@import "tailwindcss";

@layer base {
  body {
    @apply bg-white text-black;
  }
}
```

If you use shadcn-style components or custom tokens, add them here.

## Custom Docs Components

Keep docs-only UI components in `components/` and use them from MDX.

Good examples:

- endpoint cards
- request/response examples
- comparison tables
- callouts
- tabs for language examples

This keeps content expressive without turning the docs system into a full app.

## Search With Pagefind

`Pagefind` is a strong fit for a static docs site because it indexes generated HTML after build and serves search entirely from static assets.

Add this to `package.json`:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "postbuild": "pagefind --site .next/server/app --output-path public/_pagefind",
    "start": "next start",
    "lint": "eslint",
    "typecheck": "tsc --noEmit"
  }
}
```

### What happens during build

1. `next build` renders static HTML for every route.
2. `pagefind` scans `.next/server/app`.
3. it creates a search index in `public/_pagefind`.
4. those assets are deployed with the rest of the site.

This avoids:

- a hosted search provider
- a separate crawler service
- custom backend search code

## Local Commands

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run build
```

## Deployment Model

This setup is intended for static hosting.

Good deployment targets:

- Vercel static output
- Netlify
- Cloudflare Pages
- GitHub Pages
- S3 + CDN
- any static web host

The important point is that production does not need a Node server if everything is compatible with static export.

## Recommended Improvements From Day One

### 1. Document the build pipeline

In your `README.md`, explain:

- that the site uses static export
- that Pagefind runs in `postbuild`
- where search assets are generated
- how deployment is expected to work

This prevents future confusion.

### 2. Add CI

At minimum, run:

- `npm ci`
- `npm run typecheck`
- `npm run lint`
- `npm run build`

This catches broken routes, MDX issues, and search pipeline regressions.

### 3. Add SEO support

For a public docs site, add:

- `app/robots.ts`
- `app/sitemap.ts`
- Open Graph metadata
- Twitter metadata
- canonical URLs if needed

### 4. Keep CSS overrides targeted

When customizing the Nextra theme:

- prefer stable wrapper classes
- avoid broad structural selectors when possible
- use `!important` sparingly

This reduces breakage when dependencies update.

### 5. Decide how to handle generated search assets

Be explicit about whether `public/_pagefind` is:

- committed to git, or
- generated only during CI/deploy builds

Either approach can work, but it should be intentional.

### 6. Keep docs components minimal

A docs site stays maintainable when custom components are small and content-oriented. Avoid building complex app logic into MDX helpers unless there is a clear need.

## When This Pattern Is A Good Fit

Choose this setup if you want:

- rich docs with React components
- mostly static content
- easy hosting
- self-hosted search
- low operational overhead

## When It Is Not A Good Fit

This pattern is less ideal if your docs require:

- heavy per-request personalization
- authenticated server-side rendering
- dynamic backend-driven search
- frequent runtime data dependencies that cannot be prerendered

In those cases, keep Next, but reconsider full static export.

## Practical Summary

If you want to replicate this method in another project:

1. Use `Next.js + Nextra + MDX`.
2. Configure `output: "export"`.
3. Store docs as `app/**/page.mdx`.
4. Use `_meta.js` files for navigation.
5. Add `mdx-components.tsx` and alias it in `next.config`.
6. Style with Tailwind and a small global CSS layer.
7. Run `Pagefind` in `postbuild`.
8. Deploy the result as a static site.

This gives you a clean, scalable docs architecture with very little infrastructure.
