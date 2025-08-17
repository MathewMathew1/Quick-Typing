import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: { "~": path.resolve(__dirname, "src") },
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  test: {
    server: {
      deps: {
        inline: ["next"],
      },
    },
    globals: true,
    environment: "node",
    include: ["tests/backend/**/*.test.ts"],
  },
});
