import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Head, Search } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";
import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  metadataBase: new URL("https://docs.nvoke.run"),
  title: {
    default: "nvoke.run docs",
    template: "%s — nvoke.run docs",
  },
  description:
    "Documentation for nvoke.run — write JavaScript functions and deploy them as HTTP endpoints.",
  openGraph: {
    title: "nvoke.run docs",
    description:
      "Write JavaScript functions and deploy them as HTTP endpoints.",
    url: "https://docs.nvoke.run",
    siteName: "nvoke.run docs",
    type: "website",
  },
};

const navbar = (
  <Navbar
    logo={<span style={{ fontWeight: 600 }}>nvoke.run docs</span>}
    projectLink="https://github.com/Mopra/nvoke.run.docs"
  >
    <a href="https://nvoke.run" style={{ marginRight: "0.75rem", fontSize: "0.875rem" }}>
      nvoke.run
    </a>
    <a
      href="https://app.nvoke.run"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        padding: "0.375rem 0.875rem",
        borderRadius: "0.375rem",
        background: "currentColor",
        color: "var(--x-color-background, white)",
        fontSize: "0.875rem",
        fontWeight: 500,
        textDecoration: "none",
      }}
    >
      Launch app
    </a>
  </Navbar>
);

const footerColumns = [
  {
    heading: "Product",
    links: [
      { label: "Pricing", href: "https://nvoke.run/pricing" },
      { label: "Blog", href: "https://nvoke.run/blog" },
      { label: "Launch app", href: "https://app.nvoke.run", external: true },
    ],
  },
  {
    heading: "Docs",
    links: [
      { label: "Getting started", href: "/getting-started" },
      { label: "Guides", href: "/guides/writing-functions" },
      { label: "API reference", href: "/api-reference/overview" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "GitHub", href: "https://github.com/Mopra/nvoke.run" },
      { label: "Privacy", href: "https://nvoke.run/privacy" },
      { label: "Terms", href: "https://nvoke.run/terms" },
    ],
  },
];

const footer = (
  <Footer>
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "2rem",
        }}
      >
        {footerColumns.map((col) => (
          <div key={col.heading}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.75rem" }}>
              {col.heading}
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                fontSize: "0.875rem",
              }}
            >
              {col.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    {...(link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.5rem",
          fontSize: "0.75rem",
          opacity: 0.7,
          borderTop: "1px solid currentColor",
          paddingTop: "1rem",
        }}
      >
        <span>© {new Date().getFullYear()} nvoke. All rights reserved.</span>
        <span>
          <a href="https://nvoke.run">nvoke.run</a>
          {" · "}
          <a href="https://docs.nvoke.run">docs.nvoke.run</a>
          {" · "}
          <a href="https://app.nvoke.run" target="_blank" rel="noopener noreferrer">
            app.nvoke.run
          </a>
        </span>
      </div>
    </div>
  </Footer>
);

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/Mopra/nvoke.run.docs/tree/main"
          footer={footer}
          search={<Search />}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
