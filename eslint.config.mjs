import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const config = [
  ...nextCoreWebVitals,
  {
    ignores: ["out/**", ".next/**", "node_modules/**"],
  },
];

export default config;
