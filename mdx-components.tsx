import { useMDXComponents as getDocsMDXComponents } from "nextra-theme-docs";
import type { MDXComponents } from "mdx/types";
import { Endpoint } from "./components/endpoint";
import { ParamTable } from "./components/param-table";

const docsComponents = getDocsMDXComponents({
  Endpoint,
  ParamTable,
});

export function useMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...docsComponents,
    ...components,
  };
}
