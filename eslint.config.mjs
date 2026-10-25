import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/ban-ts-comment": "error",
      // Quyền không được suy ra từ user_metadata (xem CLAUDE.md §4).
      "no-restricted-syntax": [
        "error",
        {
          selector: "MemberExpression[property.name='user_metadata']",
          message: "Không dùng user_metadata để quyết định quyền. Dùng user_role_assignments.",
        },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "next-env.d.ts",
  ]),
]);
