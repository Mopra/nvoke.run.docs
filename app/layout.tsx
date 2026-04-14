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
    logo={<span style={{ fontWeight: 600 }}>nvoke.run</span>}
    projectLink="https://github.com/Mopra/nvoke.run.docs"
  />
);

const footer = (
  <Footer>
    <span>
      © {new Date().getFullYear()} nvoke.run ·{" "}
      <a href="https://nvoke.run">nvoke.run</a>
    </span>
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
