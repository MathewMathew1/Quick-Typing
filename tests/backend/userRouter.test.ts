import { describe, it, expect } from "vitest";
import { appRouter } from "~/server/api/root";
import { createTestContext } from "./utils/utils";


describe("user router", () => {
  it("hello query returns correct message", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.health.hello();
    expect(result).toEqual({ message: "hello from user router" });
  });
});