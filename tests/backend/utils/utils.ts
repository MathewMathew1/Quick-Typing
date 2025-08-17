import { db } from "~/server/db";


export const createTestContext = (): any => { // to fix later
  return {
    db,
    session: {
      user: {
        id: "test-id",
        name: "Test User",
        email: null,
        image: null,
      },
      expires: new Date(Date.now() + 1000 * 60 * 60).toISOString(), 
    },
    headers: new Headers(),
  };
};
