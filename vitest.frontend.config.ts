import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: { "~": path.resolve(__dirname, "src") },
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: ["tests/frontend/**/*.test.{ts,tsx}"],
    setupFiles: "./tests/frontend/setup.ts",
  },
});
