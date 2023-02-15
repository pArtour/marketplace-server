import { test } from "tap";
import buildApp from "../app";

test("requests health-check", async (t) => {
    // Build the app
    const app = await buildApp();
    // close the app after the test is done
    t.teardown(() => app.close());

    const response = await app.inject({
        method: "GET",
        url: "/health-check",
    });

    t.equal(response.statusCode, 200);
    t.same(response.json(), { status: "ok" });
});
