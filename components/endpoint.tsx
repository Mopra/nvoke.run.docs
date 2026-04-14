import type { ReactNode } from "react";

type Auth = "public" | "clerk" | "api-key";
type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";

const authLabels: Record<Auth, string> = {
  public: "Public",
  clerk: "Clerk session",
  "api-key": "API key",
};

export function Endpoint({
  method,
  path,
  auth,
  children,
}: {
  method: Method | Method[];
  path: string;
  auth: Auth;
  children?: ReactNode;
}) {
  const methods = Array.isArray(method) ? method.join(" / ") : method;
  return (
    <div
      style={{
        border: "1px solid var(--x-color-gray-300, #e5e5e5)",
        borderRadius: 8,
        padding: "0.75rem 1rem",
        margin: "1rem 0",
        fontFamily:
          "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        fontSize: "0.9rem",
      }}
    >
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <span style={{ fontWeight: 700 }}>{methods}</span>
        <span>{path}</span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: "0.75rem",
            fontFamily: "inherit",
            padding: "0.1rem 0.5rem",
            borderRadius: 999,
            border: "1px solid currentColor",
            opacity: 0.7,
          }}
        >
          {authLabels[auth]}
        </span>
      </div>
      {children ? (
        <div
          style={{
            marginTop: "0.5rem",
            fontFamily: "system-ui, sans-serif",
            fontSize: "0.875rem",
            opacity: 0.8,
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
